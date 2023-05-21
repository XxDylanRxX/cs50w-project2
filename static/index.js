document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  let room;

  const roomName = localStorage.getItem("channel");

  if (roomName && roomName.trim() !== "") {
    socket.emit("join_room", roomName, () => {
      room = roomName;
      document.querySelector("#root").innerHTML = `Te has unido a la sala ${roomName}`;
      document.querySelector(".title1").innerHTML = `ChatZone-${roomName}`;
      console.log(`Unido a la sala ${roomName}`);
      socket.emit("actualizar", { room_name: roomName });
    });

    
    socket.on("last_messages1", (messages) => {
      const messageContainer = document.querySelector("#root");
  
      messages.forEach((message) => {
        const { username, timestamp, message: text } = message;
  
        const messageElement = document.createElement("div");
        messageElement.innerHTML = `<strong>${username} (${timestamp}):</strong> ${text}`;
  
        messageContainer.appendChild(messageElement);
      });
    });
  
  
 
    const roomList = document.querySelector("#rooms-list");
    const roomElement = document.createElement("li");
    roomElement.innerText = roomName;
    roomList.appendChild(roomElement);

    const leaveButton = document.createElement("button");
    leaveButton.innerText = "Salir";
    leaveButton.classList.add("button-style")

    leaveButton.onclick = () => {
      console.log(roomName);
      socket.emit("leave_room", roomName, () => {
        if (roomName) {
          console.log(`Abandonó la sala ${roomName}`);
          document.querySelector("#root").innerHTML = `ha salido de la sala`;
          document.querySelector(".title1").innerHTML = `ChatZone`;
        } else {
          console.log(`No se pudo abandonar la sala ${roomName}`);
        }
      });
    };
    roomElement.appendChild(leaveButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Eliminar";
    deleteButton.classList.add("button-style");
    deleteButton.onclick = () => {
      roomList.removeChild(roomElement);
    };
    roomElement.appendChild(deleteButton);
 

}


socket.on("message", (data) => {
  const message = data.message;
  const username = data.username;
  const time = data.timestamp;
  const isUser = data.is_user;
  
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${username} (${time}):</strong> ${message}`;
  console.log(isUser)
  if (isUser) {
    messageElement.classList.add("message", "user");
  } else {
    messageElement.classList.add("message", "other");
  }

  document.querySelector("#root").appendChild(messageElement);
});


const send_message = document.querySelector("#send-message");

send_message.onclick = () => {
  const message = document.querySelector("#input-message").value.trim();
  console.log(message)
  if (message !== "") { 
    socket.emit("message", {
      message,
      room: room,
    });

    const mensaje = document.querySelector("#input-message");
    mensaje.value = "";
  }
}
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  const darkModeButton = document.querySelector("#dark-mode-button");

  darkModeButton.onclick = () => {
    const body = document.querySelector("section");
    body.classList.toggle("dark-mode");
    const body2 = document.querySelector("aside");
    body2.classList.toggle("dark-mode2");
   }
 const join_button = document.querySelector("#joinBtn");

  join_button.onclick = () => {
    const roomName = document.querySelector("#room-name");

    if (!roomName) {
      console.error("No se pudo encontrar el elemento con el ID room-name");
      return;
    }

    const nombreSala = roomName.value;
    if (nombreSala && nombreSala.trim() !== "") {

      socket.emit("create_room", nombreSala, (res) => {
          room = res;
          localStorage.setItem("channel", room);
          document.querySelector("#root").innerHTML = `Te has unido a la sala ${room}`;
          document.querySelector(".title1").innerHTML = `ChatZone-${room}`;
          console.log(`Unido a la sala ${room}`);
          socket.emit("actualizar", { room_name: room });
        
       
      socket.emit("ingresar", { room_name: nombreSala });
      socket.on("last_messages2", (messages) => {
        const messageContainer = document.querySelector("#root");
    
        messages.forEach((message) => {
          const { username, timestamp, message: text } = message;
    
          const messageElement = document.createElement("div");
          messageElement.innerHTML = `<strong>${username} (${timestamp}):</strong> ${text}`;
    
          messageContainer.appendChild(messageElement);
        });
        
      });
    
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  const roomList = document.querySelector("#rooms-list");
    const roomElement = document.createElement("li");
    roomElement.innerText = roomName.value;
    roomList.appendChild(roomElement);

    const joinButton = document.createElement("button");
    joinButton.innerText = "Unirse";
    joinButton.classList.add("button-style");

    joinButton.onclick = () => {
      const roomName = roomElement.textContent.slice(0, -19); // Obtener directamente el nombre del elemento
      console.log(roomName);
      socket.emit("join_room", roomName, () => {
        document.querySelector("#root").innerHTML = `Te has unido a la sala ${roomName}`;
        document.querySelector(".title1").innerHTML = `ChatZone-${roomName}`;
        console.log(`Unido a la sala ${roomName}`);
      })

      socket.on("inform",(mensaje) => {
        document.querySelector("#root").innerHTML = `${mensaje}`;

        console.log(`${mensaje}`);
      })
      socket.emit("join", { room_name: nombreSala });
      socket.on("last_messages3", (messages) => {
        const messageContainer = document.querySelector("#root");
    
        messages.forEach((message) => {
          const { username, timestamp, message: text } = message;
    
          const messageElement = document.createElement("div");
          messageElement.innerHTML = `<strong>${username} (${timestamp}):</strong> ${text}`;
    
          messageContainer.appendChild(messageElement);
        });
      socket.removeEventListener("last_messages2", handleLastMessages);
      });
      }


    roomElement.appendChild(joinButton);

    const leaveButton = document.createElement("button");
    leaveButton.innerText = "Salir";
    leaveButton.classList.add("button-style");
    leaveButton.onclick = () => {
      console.log(roomName.value)
      socket.emit("leave_room", nombreSala, () => {
        if (roomName) {
          console.log(`Abandonó la sala ${nombreSala}`); 
          document.querySelector("#root").innerHTML = `ha salido  de la sala`;
          document.querySelector(".title1").innerHTML = `ChatZone`;
        } else {
          console.log(`No se pudo abandonar la sala ${nombreSala}`);
        }

      });
    };
    roomElement.appendChild(leaveButton);

    const Name = document.querySelector("#room-name");
    Name.value = "";
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Eliminar";
    deleteButton.classList.add("button-style");
    deleteButton.onclick = () => {
      roomList.removeChild(roomElement);
      localStorage.setItem("channel",'');
    };
    roomElement.appendChild(deleteButton);

  });

  }

//////////////////////////////////////////////////////////////////////////////////////////////////////

 }
})
