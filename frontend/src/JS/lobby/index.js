import MultiplayerConnection from "../classes/MultiplayerConnection.js";

const socket = new MultiplayerConnection;

socket.sendMessage({"Action":"JoinLobby",
                    "Payload": {
                        roomCode: "JSX85K"
                    }})