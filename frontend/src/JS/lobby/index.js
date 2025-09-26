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


function SendMessenger() {
    /**@type {HTMLInputElement} */
    const messageEl = document.getElementById("chatInput");
    document.getElementById("SendMessageButton").addEventListener("click",() => {
        const textToSend = messageEl.value
        console.log(textToSend);
        messageEl.value = "";

        socket.sendMessage({Action:"SendLobbyMessage", Payload: {
            Message: textToSend
        }})
    })
}


function ReceiverMessages() {
    const ChatBox = document.getElementById("chatMessages");
    socket.registerHandler("NewLobbyMessage", (/** @type {Message}*/ mesg) => {
        const message = mesg.Payload.message;
        const sendBy = mesg.Payload.sendBy;
        const newMessage = document.createElement("div");
        newMessage.className = "message";
        newMessage.innerHTML = /*HTML*/
        `<span>${sendBy}: </span>
        ${message}`
        ChatBox.appendChild(newMessage);
    })
}

SendMessenger();
ReceiverMessages();
