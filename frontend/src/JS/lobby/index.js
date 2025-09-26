import MultiplayerConnection from "../classes/MultiplayerConnection.js";

const socket = new MultiplayerConnection;

// Ensures that newly conencted users have their UUID saved in cookies.
socket.registerHandler("NewUserConnected",(/** @type {Message}*/ mesg) => {
    const UUID = mesg.Payload.id
    window.sessionStorage.setItem("sessionID",UUID)
})


socket.sendMessage({Action:"JoinLobby", Payload:{
    roomCode:"JSX205J"
}})