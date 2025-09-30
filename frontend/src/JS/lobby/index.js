import MultiplayerConnection from "../classes/MultiplayerConnection.js";

const socket = new MultiplayerConnection;
const playerListEl = document.getElementById("speler-lijst");
let players = 0;

// Ensures that newly conencted users have their UUID saved in cookies.
socket.registerHandler("NewUserConnected",(/** @type {Message}*/ mesg) => {
    const UUID = mesg.Payload.id
    window.sessionStorage.setItem("sessionID",UUID)
})

// Joins a specific lobby
socket.sendMessage({Action:"JoinLobby", Payload:{
    roomCode:"JSX205J"
}})

function initLobbyData() {
    socket.registerHandler("LobbyData", (/** @type {Message}*/ mesg) => {
        const _players = mesg.Payload.count;
        const playerList = mesg.Payload.players;
        const playerEls = playerListEl.children;

        for (let i = 0; i < _players; i++) {
            const playerEl = playerEls[i];
            playerEl.className = "player joined";
            playerEl.querySelector("p").textContent = playerList[i].name;
        }

        players = _players;
        initStartButton();

    });
}

function RedirectClients() {
    socket.registerHandler("GameStarting", (/** @type {Message}*/ mesg) => {
        const url = new URL("/HTML/onlineGame.html", window.location.href);
        window.location = url;
    });
}

// WAAROM IS ALLES NEDERLANDS WTFFFFF, WAAROM NIET 
function initStartButton() {
    const Startbutton = document.getElementById('startbutton');
    const spelerinfoelement = document.getElementById('spelerinfo');
    let spelers = players; // aantal spelers later veranderen naar dynamisch
    if (spelers === 2 || spelers === 4) { //knop tonen
        Startbutton.style.display = 'block'; 
    } else {
        Startbutton.style.display = 'none'
    }
    
    Startbutton.onclick = () => {
        socket.sendMessage({Action:"GoToGame", Payload:{ready:true}});
        console.log("start button has been clicked.");
    };

}



initLobbyData();
RedirectClients();