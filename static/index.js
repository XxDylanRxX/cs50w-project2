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
            document.querySelector("#root").innerHTML = `Te has unido a la sala ${room}`;
            document.querySelector("#root").innerHTML += "</br>";
        });

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
        console.log(message)
    
        socket.emit("message",{
            message,
            room: room
        });
    
        const mensaje = document.querySelector("#input-message");
        mensaje.value= "";
    }
    
} )