from app import *
from app.migrate import init_db
from flask import render_template
app = create_app()

@app.route('/home')
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/database')
def create_db():
    init_db()
    return "La base de datos ha sido creada"

@app.route('/prueba')
def create_db():
    lista = ["valorant", "halo", "apex"]
    return render_template("prueba.html", varx=lista)

if __name__ == "__main__":
    app.run(debug=True, port=5000)