from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Users(db.Model):
    __tablename__="users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))