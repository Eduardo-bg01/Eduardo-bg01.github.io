from app import create_app
from flask import render_template, request, redirect
app = create_app()

@app.route('/prueba')
def create_db():
    lista = ["valorant", "halo", "apex"]
    return render_template("prueba.html", varx=lista)

@app.route('/formulario', methods=["GET", "POST"])
def show_form():
    if request.method == 'POST':
        lista2 = [
            request.form['input1'],
            request.form['input2'],
            request.form['input3']
        ]
        return render_template('data.html', lista2=lista2)
    elif request.method == 'GET':
        return render_template("formulario.html")
    else:
        return redirect('/prueba')

if __name__ == "__main__":
    app.run(debug=True, port=5000)