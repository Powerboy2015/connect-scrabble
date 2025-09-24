async function startSocket()
{
    let socket = new WebSocket("ws://localhost:8081/online");
    console.log(socket);
    sendMessage(socket);

}


function sendMessage(_socket)
{
    if (_socket.readyState === _socket.OPEN) {
        _socket.send(JSON.stringify({
            action: "join",
            lobbyId: "12345"
        }))
    } else {
        setTimeout(() => {
            sendMessage(_socket)
        },500)
    }
}

startSocket();