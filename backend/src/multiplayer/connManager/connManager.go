package connManager

import (
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type JsonResp map[string]interface{}

type LobbyManager struct {
	clients map[string]*Client          //all clients
	lobbies map[string]map[*Client]bool //clients that are in a lobby
}

type Client struct {
	ID       string
	HashName string
	Conn     *websocket.Conn
	Send     chan []byte
}

var Manager = &LobbyManager{
	clients: make(map[string]*Client),
	lobbies: make(map[string]map[*Client]bool),
}

// adds an incoming connection to the connected client list
// gives each client a UUID
func AddClient(conn *websocket.Conn, username string) *Client {
	_userid := uuid.New().String()
	if username == "" {
		username = "Anonymous"
	}
	_client := Client{
		ID:       _userid,
		HashName: username,
		Conn:     conn,
		Send:     make(chan []byte, 256),
	}
	Manager.clients[_userid] = &_client
	return &_client
}

// Gets client based on UUID
func GetClient(id string) (*Client, error) {
	_client := Manager.clients[id]
	if _client == nil {
		return nil, fmt.Errorf("client %s not found", id)
	}
	return _client, nil
}

// Checks if UUID exits, if it does, renews conn variable with recent login
func RejoinClient(_uuid string, _conn *websocket.Conn) (*Client, error) {
	client, err := GetClient(_uuid)
	if err != nil {
		log.Println("Rejoin error:", err)
		return nil, err
	}
	client.Conn = _conn
	return client, nil
}

func JoinLobby(_roomCode string, _client *Client) {
	if Manager.lobbies[_roomCode] == nil {
		Manager.lobbies[_roomCode] = make(map[*Client]bool)
	}
	Manager.lobbies[_roomCode][_client] = true
	fmt.Println(Manager.lobbies)
}

func GetLobbyPlayers(_roomcode string) (map[*Client]bool, error) {
	if Manager.lobbies[_roomcode] != nil {
		return Manager.lobbies[_roomcode], nil
	}
	return nil, fmt.Errorf("room %s not found", _roomcode)
}

func SendLobbyMessage(_roomcode string, _message []byte) error {
	_clients, err := GetLobbyPlayers(_roomcode)
	if err != nil {
		return err
	}
	for client := range _clients {
		client.Conn.WriteJSON(JsonResp{"ok": true, "message": "new message in lobby", "Payload": JsonResp{"message": string(_message)}, "Action": "NewLobbyMessage"})
	}
	return nil
}
