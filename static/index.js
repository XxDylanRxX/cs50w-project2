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
          const roomName = roomElement.innerText.split(" ")[1];
          console.log(roomName)
          socket.emit("join_room", roomName, () => {
            document.querySelector("#root").innerHTML = `Te has unido a la sala ${roomName}`;
            console.log(`Unido a la sala ${roomName}`);
          });
          
          // Emitir evento para solicitar los últimos 100 mensajes
          socket.emit("get_last_messages", {room: roomName}, (messages) => {
              // Agregar mensajes a la interfaz de usuario
              messages.forEach((message) => {
                  // Agregar mensaje a la interfaz de usuario
                  document.querySelector("#root").innerHTML = ` ${message}`;
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
              roomList.removeChild(roomElement);
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
    
  


    socket.on("message", (mensaje) =>{
        document.querySelector("#root").append(mensaje);
        document.querySelector("#root").innerHTML += "</br>";
    });
    
    const send_message = document.querySelector("#send-message");
    
    send_message.onclick  = () =>{
        const message = document.querySelector("#input-message").value;
        socket.emit("message",{
            message,
            room: room
        });
    
        const mensaje = document.querySelector("#input-message");
        mensaje.value= "";
    }
    
} )