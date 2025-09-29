import { reloadGrid } from "../Bord grid.js";
import { showBanner } from "../checker.js";
import GameData from "../classes/GameData.js";
import GameState from "../classes/GameState.js";
import MultiplayerConnection from "../classes/MultiplayerConnection.js";
import { populateLetterhand } from "../Letterfichesuitdelen.js";
import Timer from "../Timer.js";

const socket = new MultiplayerConnection();
console.log(GameData.json());

// Ensures that newly conencted users have their UUID saved in cookies.
socket.registerHandler("NewUserConnected", (/** @type {Message}*/ mesg) => {
    const UUID = mesg.Payload.id;
    window.sessionStorage.setItem("sessionID", UUID);
});

socket.sendMessage({
    Action: "JoinLobby",
    Payload: {
        roomCode: "JSX205J",
        ready: true,
    },
});

/**
 * Sets up the send message button to send chat messages via websocket.
 */
function SendMessenger() {
    /**@type {HTMLInputElement} */
    const messageEl = document.getElementById("chatInput");
    if (!messageEl) {
        console.error("Messagebox not found");
        return;
    }

    // When we click on the sendmessage button,
    // it will send a message through the socket to the other players in the lobby.
    document
        .getElementById("SendMessageButton")
        .addEventListener("click", () => {
            const textToSend = messageEl.value;
            console.log(textToSend);
            messageEl.value = "";

            socket.sendMessage({
                Action: "SendLobbyMessage",
                Payload: {
                    Message: textToSend,
                },
            });
        });
}

/**
 *  sets up a listener for the chat message box and
 *  processes incoming messages from websocket into the chatbox.
 */
function ReceiverMessages() {
    const ChatBox = document.getElementById("chatMessages");
    if (!ChatBox) {
        console.error("Chatbox not found");
        return;
    }

    //if the chatbox is found, add a handler on the websocket for incoming messages.
    socket.registerHandler("NewLobbyMessage", (/** @type {Message}*/ mesg) => {
        const message = mesg.Payload.message;
        const sendBy = mesg.Payload.sendBy;
        const newMessage = document.createElement("div");
        newMessage.className = "message";
        newMessage.innerHTML =
            /*HTML*/
            `<span>${sendBy}: </span>
        ${message}`;
        ChatBox.appendChild(newMessage);
    });
}

export function SendGameUpdate() {
    if (!GameData.isPlayerTurn()) {
        return console.debug("Not your turn, not sending game update.");
    } else {
        console.debug("Sending game update to server:", GameData.json());

        return socket.sendMessage({
            Action: "UpdateGameState",
            Payload: GameData.json(),
        });
    }
}

function ReceiveGameUpdates() {
    socket.registerHandler("GameUpdate", (/** @type {Message}*/ mesg) => {
        const gameData = mesg.Payload;
        GameData.fichesBag = gameData.FichesBag;
        GameData.sharedHand = gameData.SharedHand;
        GameData.currentPlayer = gameData.CurrentPlayer;
        GameData.gridStatus = gameData.GridStatus;

        if (GameData.currentPlayer < 1) {
            GameData.currentPlayer++;
        } else {
            GameData.currentPlayer = 0;
        }

        console.log(GameData.currentPlayer);

        UpdateCurtain();

        populateLetterhand(GameData.sharedHand);
        reloadGrid();
        GameData.Timer.restart();
        console.log("Game state updated from server:", GameData.json());
    });
}

/**
 *
 * @param {[{id: string, name: string}]} _playerList
 */
function InitPlayerSpot(_playerList) {
    const spot = _playerList.findIndex(
        (player) => player.id === window.sessionStorage.getItem("sessionID")
    );
    GameData.ThisPlayerSpot = spot;
    console.log("This player is at spot:", GameData.ThisPlayerSpot);
}
let gameReadyInitialized = false;
socket.registerHandler("GameReady", (/** @type {Message}*/ mesg) => {
    if (gameReadyInitialized) return;
    gameReadyInitialized = true;

    InitPlayerSpot(mesg.Payload.players);

    // const names = mesg.Payload.players.map((p) => p.name);
    // GameData.playerlist = names;
    const state = Object.fromEntries(
        mesg.Payload.players.map((p) => {
            const name = p.name ?? p.username ?? p.id;
            return [name, name];
        })
    );
    GameData.playerlist = state;

    const gameState = new GameState();

    GameData.Timer.setDisplayFunction((time) => {
        const user = document.getElementById(
            "clock" + (GameData.currentPlayer + 1)
        );
        user.innerHTML = time;
        user.style.display = "flex";
        console.log("clock" + (GameData.currentPlayer + 1));
    });

    GameData.Timer.setFinishFunction(() => {
        console.log(`Player ${GameData.currentPlayer + 1} ran out of time!`);
        document.getElementById(
            "clock" + (GameData.currentPlayer + 1)
        ).style.display = "none";
        GameData.Timer.restart();

        if (GameData.isPlayerTurn()) {
            SendGameUpdate();
        }
        // Handle end of turn due to timeout here
    });

    const startTimer = new Timer(3);
    startTimer.setDisplayFunction((time) => {
        document.querySelector(".StartCountDown").innerHTML = time;
    });

    startTimer.setFinishFunction(() => {
        document.querySelector(".StartCountDown").style.display = "none";

        SendGameUpdate();
        ReceiveGameUpdates();
        GameData.Timer.start();
    });
    startTimer.start();
});

socket.registerHandler("UserConnected", (/** @type {Message}*/ mesg) => {
    console.log("User connected:", mesg.Payload);
    SendMessenger();
    ReceiverMessages();
});

function UpdateCurtain() {
    const curtain = document.querySelector(".NoPlayScreen");

    console.log(GameData.isPlayerTurn());

    if (GameData.isPlayerTurn()) {
        curtain.classList.remove("isactive");
    } else {
        curtain.classList.add("isactive");
    }
}

socket.registerHandler("WordFound", (/** @type {Message}*/ mesg) => {
    const word = mesg.payload.word;
    showBanner(word);
});
