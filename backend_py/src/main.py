from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import event
from sqlalchemy.engine import Engine

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

CORS(app, resources={r"*":{
    "origins": ["*"]
}})

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

class Persons(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String, nullable=False)
    lastName = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    birthDate = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)


class Friends(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    personId = db.Column(db.Integer, db.ForeignKey('persons.id'))
    friendId = db.Column(db.Integer, db.ForeignKey('persons.id'))


with app.app_context():
    db.create_all()

#get all friends in db voor test
@app.route("/getFriends", methods=["GET"])
def getALlFriends():
    items = Friends.query.all()
    all = []
    for item in items:
        all.append({
            "personId": item.personId,
            "friendId": item.friendId
        })
    return jsonify(all)

#get all friends from user...
@app.route("/getFriends/<int:id>", methods=["GET"])
def getFriends(id):
    items = Friends.query.all()
    all = []
    for item in items:
        if item.personId == id:
            all.append({
                "personId": item.personId,
                "friendId": item.friendId
            })
    return jsonify(all)



#get alle users die de search term in hun voornaam of achternaam hebben
@app.route("/searchFriend/<string:search>", methods=["GET"])
def searchFriend(search):
    items = Persons.query.all()
    all = []
    for item in items:
        if search in item.firstName or search in items.lastName:
            all.append({
                'firstname': item.firstName
            })
    return jsonify(all)


#get alle users in db voor test
@app.route("/get", methods=["GET"])
def get():
    items = Persons.query.all()
    all = []
    for item in items:
        all.append({
            'id': item.id,
            'firstName': item.firstName,
            'lastName': item.lastName,
            'email': item.email,
            'birthDate': item.birthDate,
            'password': item.password,

        })
    return jsonify(all)

# get email/wachtwoord voor alle data van die user
@app.route("/get/<string:email>/<string:password>", methods=["GET"])
def getUser(email, password):
    person = Persons.query.get_or_404(email)

    if password == person.password:
        return jsonify({
            'firstName': person.firstName,
            'lastName': person.lastName,
            'email': person.email,
            'birthDate': person.birthDate,
            'password': person.password,
        })
    else:
        return jsonify({"failed"}), 400
    
# delete user 
@app.route("/delete/<string:email>", methods=["DELETE"])
def deleteUser(email):
    person = Persons.query.get_or_404(email)

    db.session.delete(person)
    db.session.commit()

    return jsonify({"message": "deleted"})

# create nieuwe user
@app.route("/create", methods=["POST"])
def create_account():
    data = request.get_json()
    firstName = data.get("firstName")
    lastName = data.get("lastName")
    email = data.get("email")
    birthDate = data.get("birthDate")
    password = data.get("password") 
    msg = Persons(firstName=firstName, password=password, lastName=lastName, email=email, birthDate=birthDate)
    db.session.add(msg)
    db.session.commit()
    return jsonify({"status": "ok"}), 201

# addFriend, persoon... voegt persoon... toe als vriend.
@app.route("/addFriend/<int:personId>/<int:friendId>", methods=["POST"])
def addFriend(personId, friendId):
    friend = Friends(personId = personId, friendId = friendId)
    db.session.add(friend)
    db.session.commit()
    return jsonify({"status": "ok"}), 200


#verwijder friend ...persoon verwijderd ...vriend
@app.route("/removeFriend/<int:personId>/<int:friendId>", methods=["DELETE"])
def removeFriend(personId, friendId): 
    friendship = Friends.query.filter_by(personId=personId, friendId=friendId).first_or_404()

    db.session.delete(friendship)
    db.session.commit()
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)