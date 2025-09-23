from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

CORS(app, resources={r"*":{
    "origins": ["*"]
}})


class Persons(db.Model):
    firstName = db.Column(db.String, nullable=False)
    lastName = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, primary_key=True)
    birthDate = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)

with app.app_context():
    db.create_all()

@app.route("/get", methods=["GET"])
def get():
    items = Persons.query.all()
    all = []
    for item in items:
        all.append({
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