from flask import Flask
from app.models import db, Users
from app.config import Config

def create_db():
    db.create_all()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    return app

def init_db():
    create_db()
    admin = Users(name = "Pedro")