from app import create_app
from app.migrate import init_db
from flask import render_template
from flask import request, Flask

app = create_app()

@app.route('/prueba')
def create_db():
    lista = ["valorant", "halo", "apex"]
    return render_template("prueba.html", varx=lista)

@app.route('/')
def prueba():
    return "<center><h1>Index</h1></center>"

@app.route('/database')
def create_db():
    init_db()
    return "La base de datos ha sido creada"

@app.route('/formulario/')
def form():
    return render_template("formulario.html")

@app.route("/retorno", methods=['GET'])
def retorno():
    nombreUser = request.args.get('nombreUser')
    juego = request.args.get('juego')
    longitud = len(juego)
    
    return "<center><h1>Bienvenido " + nombreUser + "</h1></center><br>""<center><h1> Juego favorito " + juego + "</h1></center><br>"

if __name__ == "__main__":
    app.run(debug=True, port=5000)