package connManager

import (
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"zochi.com/m/v2/utility"
)

type LobbyManager struct {
	clients map[string]*utility.Client          //all clients
	lobbies map[string]map[*utility.Client]bool //clients that are in a lobby
}

var Manager = &LobbyManager{
	clients: make(map[string]*utility.Client),
	lobbies: make(map[string]map[*utility.Client]bool),
}

// adds an incoming connection to the connected client list
// gives each client a UUID
func AddClient(conn *websocket.Conn, username string) *utility.Client {
	_userid := uuid.New().String()
	_client := utility.Client{
		ID:       _userid,
		HashName: username,
		Conn:     conn,
		Send:     make(chan utility.JsonResp, 256),
		Receive:  make(chan []byte, 256),
	}
	Manager.clients[_userid] = &_client
	return &_client
}

// Gets client based on UUID
func GetClient(id string) (*utility.Client, error) {
	_client := Manager.clients[id]
	if _client == nil {
		return nil, fmt.Errorf("client %s not found", id)
	}
	return _client, nil
}

// Checks if UUID exits, if it does, renews conn variable with recent login
func RejoinClient(_uuid string, _conn *websocket.Conn) (*utility.Client, error) {
	client, err := GetClient(_uuid)
	if err != nil {
		log.Println("Rejoin error:", err)
		return nil, err
	}
	client.Conn = _conn
	client.Send = make(chan utility.JsonResp)
	client.Receive = make(chan []byte)
	return client, nil
}

// Adds an user to an lobby
func JoinLobby(_roomCode string, _client *utility.Client) {
	if Manager.lobbies[_roomCode] == nil {
		Manager.lobbies[_roomCode] = make(map[*utility.Client]bool)
	}
	Manager.lobbies[_roomCode][_client] = true
	fmt.Println(Manager.lobbies)
}

// Returns a list the list of all players in a lobby
func GetLobbyPlayers(_roomcode string) (map[*utility.Client]bool, error) {
	if Manager.lobbies[_roomcode] != nil {
		return Manager.lobbies[_roomcode], nil
	}
	return nil, fmt.Errorf("room %s not found", _roomcode)
}

// Sends a message in the ingame/lobby chat
func SendLobbyMessage(_roomcode string, _message []byte, _client *utility.Client) error {
	_clients, err := GetLobbyPlayers(_roomcode)
	if err != nil {
		return err
	}
	for client := range _clients {
		client.Send <- utility.JsonResp{"ok": true, "message": "new message in lobby", "Payload": utility.JsonResp{"message": string(_message), "sendBy": _client.HashName}, "Action": "NewLobbyMessage"}
	}
	return nil
}
