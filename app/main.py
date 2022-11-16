from app import create_app, create_db
from app.migrate import init_db

app = create_app()

@app.route("/home")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/database")
def create_db():
   return "La base de datos ha sido creada"