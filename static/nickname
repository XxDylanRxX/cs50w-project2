let messageContainer = document.querySelector(".messages");
const joinBtn = document.getElementById('joinBtn');
const usernameInput = document.getElementById('username');

joinBtn.addEventListener('click', () => {
  const username = usernameInput.value;
   localStorage.setItem('username', username);
  socket.emit('join', username);
});

