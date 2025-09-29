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
    id1 = db.Column(db.Integer, db.ForeignKey('persons.id', ondelete="CASCADE"))
    id2 = db.Column(db.Integer, db.ForeignKey('persons.id', ondelete="CASCADE"))
    status = db.Column(db.String)


with app.app_context():
    db.create_all()

#get all friends in db voor test
@app.route("/getFriends", methods=["GET"])
def getALlFriends():
    items = Friends.query.all()
    all = []
    for item in items:
        all.append({
            "id": item.id,
            "id1": item.id1,
            "id2": item.id2,
            "status": item.status
        })
    return jsonify(all)

#get all friends from user...
@app.route("/getFriends/<int:id>", methods=["GET"])
def getFriends(id):
    items = Friends.query.all()
    all = []
    for item in items:
        if item.id1 == id and item.status == "accepted":
            all.append({
                "id2": item.id2
            })
    return jsonify(all)

# email to id
@app.route("/emailToId/<string:email>", methods=["GET"])
def getId(email):
    person = Persons.query.filter_by(email=email).first()
    all = {
        "id": person.id

    }
    return jsonify(all)


#get alle users die de search term in hun voornaam of achternaam hebben
@app.route("/searchFriend/<string:search>", methods=["GET"])
def searchFriend(search):
    items = Persons.query.all()
    friends = Friends.query.all()
    all = []
    for item in items:
        if search in item.firstName:
            all.append({
                'firstname': item.firstName,
                'lastname': item.lastName,
                'id': item.id,
                'email': item.email
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

# get alle info voor user met id
@app.route("/get/<int:id>", methods=["GET"]) 
def get_email(id):
    person = Persons.query.filter_by(id=id).first()
    if not person:
        return {"error": "No person found"}, 404


    return {            'id': person.id,
            'firstName': person.firstName,
            'lastName': person.lastName,
            'email': person.email,
            'birthDate': person.birthDate,
            'password': person.password,
            
            }


# get email/wachtwoord voor alle data van die user
@app.route("/get/<int:id>/<string:password>", methods=["GET"])
def getUser(id, password):
    person = Persons.query.get_or_404(id)

    if password == person.password:
        return jsonify({
            "id": person.id,
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
    firstName = data.get("firstName").lower()
    lastName = data.get("lastName").lower()
    email = data.get("email")
    birthDate = data.get("birthDate")
    password = data.get("password")
    msg = Persons(firstName=firstName, password=password, lastName=lastName, email=email, birthDate=birthDate)
    db.session.add(msg)
    db.session.commit()
    return jsonify({"status": "ok"}), 201

# addFriend, persoon... voegt persoon... toe als vriend.
@app.route("/addFriend/<int:id1>/<int:id2>", methods=["POST"])
def addFriend(id1, id2):
    existing1 = Friends.query.filter_by(id1=id1, id2=id2).first()
    existing2 = Friends.query.filter_by(id1=id2, id2=id1).first()
    existing = existing1 or existing2
    if existing:
        return jsonify({"error": "Vriendschapsverzoek bestaat al"}), 400

    friend_request = Friends(id1=id1, id2=id2, status="pending")
    db.session.add(friend_request)
    db.session.commit()
    return jsonify({"status": "request_sent"}), 200

#accept friendrequest met request id
@app.route("/acceptFriend/<int:request_id>", methods=["POST"])
def acceptFriend(request_id):
    friend_request = Friends.query.get(request_id)
    if not friend_request:
        return jsonify({"error": "Request not found"}), 404

    friend_request.status = "accepted"
    db.session.commit()
    return jsonify({"status": "accepted"}), 200

#decline friend request
@app.route("/declineFriend/<int:request_id>", methods=["POST"])
def declineFriend(request_id):
    friend_request = Friends.query.get(request_id)
    if not friend_request:
        return jsonify({"error": "Request not found"}), 404

    friend_request.status = "declined"
    db.session.commit()
    return jsonify({"status": "accepted"}), 200

#get friend requests van user met id 
@app.route("/friendRequests/<int:user_id>", methods=["GET"])
def getFriendRequests(user_id):
    requests = Friends.query.filter_by(id2=user_id, status="pending").all()

    result = [
        {
            "request_id": r.id,
            "from_user": r.id1,
            "to_user": r.id2,
            "status": r.status
        }
        for r in requests
    ]

    return jsonify(result), 200


# get user outgoing friendrequest
@app.route("/friendRequestsOutgoing/<int:user_id>", methods=["GET"])
def getFriendRequestsOut(user_id):
    requests = Friends.query.filter_by(id1=user_id, status="pending").all()

    result = [
        {
            "request_id": r.id,
            "from_user": r.id1,
            "to_user": r.id2,
            "status": r.status
        }
        for r in requests
    ]

    return jsonify(result), 200

#get friends van user met id
@app.route("/getUserFriends/<int:user_id>", methods=["GET"])
def getUserFriends(user_id):
    request1 = Friends.query.filter_by(id1=user_id, status="accepted").all()
    request2 = Friends.query.filter_by(id2=user_id, status="accepted").all()
    requests = request1 + request2

    result = [
        {
            "request_id": r.id,
            "from_user": r.id1,
            "to_user": r.id2,
            "status": r.status
        }
        for r in requests
    ]

    return jsonify(result), 200


#verwijder friend ...persoon verwijderd ...vriend
@app.route("/removeFriend/<int:id1>/<int:id2>", methods=["DELETE"])
def removeFriend(id1, id2): 
    friendship = Friends.query.filter(
        ((Friends.id1 == id1) & (Friends.id2 == id2)) |
        ((Friends.id1 == id2) & (Friends.id2 == id1))
    ).first()

    if not friendship:
        return jsonify({"error": "Vriendschap niet gevonden"}), 404

    db.session.delete(friendship)
    db.session.commit()
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001)