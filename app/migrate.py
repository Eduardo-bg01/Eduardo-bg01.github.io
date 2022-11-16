from app.models import *

def create_db():
    db.drop_all()
    db.create_all()

def init_db():
    create_db()
    admin = Users(name="Pedro")

    db.session.add(admin)