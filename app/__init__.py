from flask import Flask
from app.models import Users

def create_app():
    app = Flask(__name__)
    return app

def init_db():
    