import GameData from "../classes/GameData.js";
import GameState from "../classes/GameState.js";
import MultiplayerConnection from "../classes/MultiplayerConnection.js";
import { populateLetterhand } from "../Letterfichesuitdelen.js";

const socket = new MultiplayerConnection;
console.log(GameData.json());


// Ensures that newly conencted users have their UUID saved in cookies.
socket.registerHandler("NewUserConnected",(/** @type {Message}*/ mesg) => {
    const UUID = mesg.Payload.id
    window.sessionStorage.setItem("sessionID",UUID)
})


socket.sendMessage({Action:"JoinLobby", Payload:{
    roomCode:"JSX205J"
}})


/**
 * Sets up the send message button to send chat messages via websocket.
 */
function SendMessenger() {
    /**@type {HTMLInputElement} */
    const messageEl = document.getElementById("chatInput");
    if(!messageEl) {
        console.error("Messagebox not found");
        return;
    };

    // When we click on the sendmessage button, 
    // it will send a message through the socket to the other players in the lobby.
    document.getElementById("SendMessageButton").addEventListener("click",() => {
        const textToSend = messageEl.value
        console.log(textToSend);
        messageEl.value = "";

        socket.sendMessage({Action:"SendLobbyMessage", Payload: {
            Message: textToSend
        }})
    })
}

/**
 *  sets up a listener for the chat message box and
 *  processes incoming messages from websocket into the chatbox.
 */
function ReceiverMessages() {
    const ChatBox = document.getElementById("chatMessages");
    if(!ChatBox) {
        console.error("Chatbox not found");
        return;
    }

    //if the chatbox is found, add a handler on the websocket for incoming messages.
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

function SendGameUpdate() {
    if(!GameData.isPlayerTurn()) {
        return console.debug("Not your turn, not sending game update.");
    }
    socket.sendMessage({Action:"UpdateGameState", Payload: GameData.json()})
}

function ReceiveGameUpdates() {
    socket.registerHandler("GameUpdate", (/** @type {Message}*/ mesg) => {
        const gameData = mesg.Payload;
        GameData.fichesBag = gameData.FichesBag;
        GameData.sharedHand = gameData.SharedHand;
        GameData.currentPlayer = gameData.CurrentPlayer;
        GameData.gridStatus = gameData.GridStatus;

    populateLetterhand(GameData.sharedHand);
        populateLetterhand(GameData.sharedHand);
        console.log("Game state updated from server:", GameData.json());
    })
}

/**
 * 
 * @param {[{id: string, name: string}]} _playerList 
 */
function InitPlayerSpot(_playerList) {
    const spot = _playerList.findIndex(player => player.id === window.sessionStorage.getItem("sessionID"));
    GameData.ThisPlayerSpot = spot;
    console.log("This player is at spot:", GameData.ThisPlayerSpot);    
}

socket.registerHandler("LobbyData", (/** @type {Message}*/ mesg) => {
    InitPlayerSpot(mesg.Payload.players);

    const gameState = new GameState();
    SendGameUpdate();
    ReceiveGameUpdates();
});

socket.registerHandler("UserConnected", (/** @type {Message}*/ mesg) => {
    console.log("User connected:", mesg.Payload);
    SendMessenger();
    ReceiverMessages();
});

