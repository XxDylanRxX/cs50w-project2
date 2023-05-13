document.addEventListener("DOMContentLoaded",() =>{
    const socket = io();
    let room; 
    
    const join_button = document.querySelector("#joinBtn");
    
    join_button.onclick = () => {
        const roomName = document.querySelector("#room-name");
        
        if (!roomName) {
            console.error("No se pudo encontrar el elemento con el ID room-name");
            return ;
        }
        NombreSala= roomName.value;
        socket.emit("create_room", NombreSala, (res) => {
            room = res;
            document.querySelector(".title1").innerHTML = `ChatZone-${room}`;
            document.querySelector("#root").innerHTML = `Te has unido a la sala ${room}`;
            document.querySelector("#root").innerHTML += "</br>";
        });
        const roomList = document.querySelector("#rooms-list");
        const roomElement = document.createElement("li");
        roomElement.innerText = roomName.value;
        roomList.appendChild(roomElement);
      
        const joinButton = document.createElement("button");
        joinButton.innerText = "Unirse";

        joinButton.onclick = () => {
          const roomName = roomElement.textContent.slice(0, -11); // Obtener directamente el nombre del elemento
          console.log(roomName);
          socket.emit("join_room", roomName, () => {
            document.querySelector("#root").innerHTML = `Te has unido a la sala ${roomName}`;
            document.querySelector(".title1").innerHTML = `ChatZone-${roomName}`;
            console.log(`Unido a la sala ${roomName}`);
          });
          
          socket.emit("get_last_messages", {room_name: roomName}, (messages) => {
            // Agregar mensajes a la interfaz de usuario
            messages.forEach((message) => {
              // Agregar mensaje a la interfaz de usuario
              const messageElement = document.createElement("div");
              messageElement.innerHTML = `<strong>${message.username}:</strong> ${message.message}`;
              document.querySelector("#root").appendChild(messageElement);
              document.querySelector("#root").innerHTML += "<br>";
            });
          });
        };

        roomElement.appendChild(joinButton);
      
        const leaveButton = document.createElement("button");
        leaveButton.innerText = "Salir";
        leaveButton.onclick = () => {
          console.log(NombreSala)
          socket.emit("leave_room", NombreSala, () => {
            if (NombreSala) {
              console.log(`Abandonó la sala ${NombreSala}`);
              document.querySelector("#root").innerHTML = `ha salido  de la sala` ;
              document.querySelector(".title1").innerHTML = `ChatZone`;
            } else {
              console.log(`No se pudo abandonar la sala ${NombreSala}`);
            }

          });
        };
        roomElement.appendChild(leaveButton);

        const Name = document.querySelector("#room-name");
        Name.value= "";

    };
    
  


    socket.on("message", (data) => {
      const message = data.message;
      const username = data.username;
      console.log(username)
      const messageElement = document.createElement("div");
      messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
      document.querySelector("#root").appendChild(messageElement);
      document.querySelector("#root").innerHTML += "<br>";
    });
    const send_message = document.querySelector("#send-message");
  
    send_message.onclick = () => {
      const message = document.querySelector("#input-message").value;
      socket.emit("message", {
        message,
        room: room,
      });
  
      const mensaje = document.querySelector("#input-message");
      mensaje.value = "";
    }
  });

  
  
  
  
  
  
  