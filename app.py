from flask import Flask, render_template, redirect, url_for, request, session
from flask_socketio import SocketIO, send, emit, join_room
from flask_session import Session

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'mysecretkey'
socketio = SocketIO(app, cors_allowed_origins="*")
chat_rooms ={}

@app.route('/', methods=['GET', 'POST'])
def nombreusuario():
    if 'username' in session:
        return render_template('index.html')
    if request.method == 'POST':
        username = request.form.get("username")
        session['username'] = username
        return render_template('index.html')
    return render_template('nickname.html')


@socketio.on("message")
def message(data):
    emit("message", data['message'], room=data['room'], broadcast=False, include_self=True)

@socketio.on("create_room")
def create_room(room_name):
    join_room(room_name)
    emit("message", f"Te has unido a la sala {room_name}.", room=room_name)
    return room_name



if __name__ == "__main__":
    app.run(debug=True)
