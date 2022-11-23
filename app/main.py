from app import create_app
from app.migrate import init_db
from flask import render_template
from flask import request, Flask

app = create_app()

@app.route('/prueba')
def prueba2():
    lista = ["valorant", "halo", "apex"]
    return render_template("prueba.html", varx=lista)

@app.route('/')
def prueba():
    return "Pon /prueba en la barra de busqueda"

@app.route('/database')
def create_db():
    init_db()
    return "La base de datos ha sido creada"

@app.route('/formulario/')
def form():
    return render_template("formulario.html")

@app.route("/retorno", methods=['GET'])
def retorno():
    nombre = request.args.get('nombre')
    apellido = request.args.get('apellido')
    usuario = request.args.get('usuario')
    artista = request.args.get('artista')
    longitudNombre = str(nombre)
    longitud2 = len(longitudNombre)
    lenght = str(longitud2)
    return "<center>Nombre " + nombre + "<br><br><center>Longitud de nombre " + lenght + "<br><br><center>Apellido "+ apellido +"<br><br><center> Usuario: " + usuario +"<br><br><center> Tu contrasena secreta: " + artista + "<br><br>"

if __name__ == "__main__":
    app.run(debug=True, port=5000)