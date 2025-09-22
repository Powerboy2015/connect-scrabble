from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

class Persons(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)

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
            'password': item.password
        })
    return jsonify(all)

@app.route("/create", methods=["POST"])
def create_account():
    data = request.get_json()
    firstName = data.get("firstName")
    password = data.get("password") 
    msg = Persons(firstName=firstName, password=password)
    db.session.add(msg)
    db.session.commit()
    return jsonify({"id": msg.id, "status": "ok"}), 201

if __name__ == "__main__":
    app.run(debug=True, port=5001)