from app import create_app, create_db

app = create_app

@app.route("/home")
def hello_world():
    return "<p>Hello, World!</p>"