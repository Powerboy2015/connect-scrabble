from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

CORS(app, resources={r"*":{
    "origins": ["*"]
}})


class Persons(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String, nullable=False)
    lastName = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    birthDate = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)


class Friends(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column(db.String, db.ForeignKey('persons.id'))
    friend = db.Column(db.String)


@app.route("/getFriends", methods=["GET"])
def getFriends():
    items = Friends.query.all()
    all = []
    for item in items:
        all.append({
            "id": item.id,
            "person_id": item.person_id,
            "friend": item.friend
        })
    return jsonify(all)

with app.app_context():
    db.create_all()

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
    

@app.route("/delete/<string:email>", methods=["DELETE"])
def deleteUser(email):
    person = Persons.query.get_or_404(email)

    db.session.delete(person)
    db.session.commit()

    return jsonify({"message": "deleted"})


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

    





if __name__ == "__main__":
    app.run(debug=True, port=5001)