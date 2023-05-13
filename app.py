from flask import Flask, render_template, redirect, url_for, request, session
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_session import Session
from datetime import datetime

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'mysecretkey'
socketio = SocketIO(app, cors_allowed_origins="*")
chat_rooms ={}
messages = {}


@app.route('/', methods=['GET', 'POST'])
def nombreusuario():
    if 'username' in session:
        return render_template('index.html', chat_rooms=chat_rooms)
    if request.method == 'POST':
        username = request.form.get("username")
        print(username)
        session['username'] = username
        print(session['username'])
        return render_template('index.html', chat_rooms=chat_rooms)
    return render_template('nickname.html')


@socketio.on("message")
def message(data):
    room = data['room']
    message = data['message']
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
    username = session['username']
    emit("message", {'message': message, 'username': username, 'timestamp': timestamp}, room=room, broadcast=False, include_self=True)

    # Almacenar el mensaje en la lista de mensajes del canal correspondiente
    if room in messages:
        messages[room].append({'message': message, 'username': username, 'timestamp': timestamp})
    else:
        messages[room] = [{'message': message, 'username': username, 'timestamp': timestamp}]

    # Mantener solo los últimos 100 mensajes en la lista
    if len(messages[room]) > 100:
        messages[room] = messages[room][-100:]

@socketio.on("create_room")
def create_room(room_name):
    chat_rooms[room_name] = []
    join_room(room_name)
    emit("room_list", list(chat_rooms.keys()), broadcast=True)
    emit("message", f"Te has unido a la sala {room_name}.", room=room_name)
    return room_name

@socketio.on("join_room")
def join_chat_room(room_name):
    join_room(room_name)
    chat_rooms[room_name].append(session['username'])
    emit("message", f"{session['username']} se ha unido a la sala {room_name}.", room=room_name)
    emit("update_rooms", chat_rooms, broadcast=True, include_self=True)

@socketio.on("get_last_messages")
def get_last_messages(data):
    room_name = data['room_name']
    emit("last_messages", messages[room_name][-100:], include_self=True)


@socketio.on("leave_room")
def leave_room_function(room_name):
    leave_room(room_name)
    if session['username'] in chat_rooms[room_name]:
        emit("message", f"{session['username']} ha salido de la sala {room_name}.", room=room_name)
        emit("leave_room", chat_rooms, broadcast=True, include_self=True)
    

if __name__ == "__main__":
    app.run(debug=True)
