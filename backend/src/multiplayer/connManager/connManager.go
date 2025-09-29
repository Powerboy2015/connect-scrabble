package connManager

import (
	"fmt"
	"log"
	"time"

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

func HandleClientDisconnection(_client *utility.Client) {
	// Find and remove client from any lobbies they're in
	for roomCode, lobby := range Manager.lobbies {
		if _, inLobby := lobby[_client]; inLobby {
			// Remove client from lobby
			delete(lobby, _client)

			// If lobby is empty, consider removing it
			if len(lobby) == 0 {
				delete(Manager.lobbies, roomCode)
			} else {
				// Notify other clients in the lobby about the disconnection
				for client := range lobby {
					if client != _client && client.Conn != nil {
						client.Send <- utility.JsonResp{
							"ok":      true,
							"message": "player disconnected",
							"Payload": utility.JsonResp{"id": _client.ID},
							"Action":  "PlayerDisconnected",
						}
					}
				}
			}
		}
	}
}

// When a client disconnects, mark them as disconnected but don't remove immediately
func MarkClientDisconnected(client *utility.Client) {
	// Set disconnection time
	now := time.Now()
	client.DisconnectedAt = &now
	client.Conn = nil

	// Notify other players about temporary disconnection
	for roomCode, lobby := range Manager.lobbies {
		if _, inLobby := lobby[client]; inLobby {
			for otherClient := range lobby {
				if otherClient != client && otherClient.Conn != nil {
					otherClient.Send <- utility.JsonResp{
						"ok":      true,
						"message": "player temporarily disconnected",
						"Payload": utility.JsonResp{"id": client.ID, "username": client.HashName},
						"Action":  "PlayerTemporarilyDisconnected",
					}
				}
			}

			// Start a timer to remove the client if they don't reconnect
			go scheduleClientRemoval(client, roomCode, 10*time.Second)
		}
	}
}

// Schedule client removal after timeout period
func scheduleClientRemoval(client *utility.Client, roomCode string, timeout time.Duration) {
	time.Sleep(timeout)

	// After timeout, check if the client is still disconnected
	if client.DisconnectedAt != nil && client.Conn == nil {
		// Actually remove the client since they didn't reconnect in time
		HandleClientDisconnection(client)

		log.Printf("Client %s removed from room %s after timeout", client.ID, roomCode)
	}
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

	// Check if the client exists but was marked as disconnected
	if client.Conn == nil {
		log.Println("Reconnecting previously disconnected client:", _uuid)
	}

	client.Conn = _conn
	client.Send = make(chan utility.JsonResp, 256)
	client.Receive = make(chan []byte, 256)
	client.DisconnectedAt = nil // Clear disconnection timestamp

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

// handles sending the game update to all players in the lobby.
func SendGameUpdate(_roomcode string, _message utility.GameDataObject) error {
	_clients, err := GetLobbyPlayers(_roomcode)
	if err != nil {
		return err
	}

	//Handle jsonify of object
	for client := range _clients {
		client.Send <- utility.JsonResp{"ok": true, "message": "game update", "Payload": _message, "Action": "GameUpdate"}
	}
	return nil
}

func GetWTFMessage(_roomcode string) (bool, error) {
	_clients, err := GetLobbyPlayers(_roomcode)
	if err != nil {
		return false, err
	}
	// Check if all clients are connected
	playerNames := []utility.JsonResp{}

	for client := range _clients {
		playerNames = append(playerNames, utility.JsonResp{"id": client.ID, "username": client.HashName})
	}

	// If all clients are connected, send ready signal
	for client := range _clients {
		client.Send <- utility.JsonResp{
			"ok":      true,
			"message": "all players connected",
			"Payload": utility.JsonResp{
				"players": playerNames,
				"count":   len(_clients),
			},
			"Action": "GameReady",
		}
	}
	return true, nil

}

func SendJoinMessage(_roomcode string, _message utility.JsonResp, _client *utility.Client) error {
	_clients, err := GetLobbyPlayers(_roomcode)
	if err != nil {
		return err
	}
	for client := range _clients {
		if client != _client {
			client.Send <- _message
		}
	}
	return nil
}

func SendMessage(roomCode string, message utility.JsonResp) error {
	_clients, err := GetLobbyPlayers(roomCode)
	if err != nil {
		return err
	}
	for client := range _clients {
		client.Send <- message
	}
	return nil
}

// SetClientReady marks a client as ready in a given room
func SetClientReady(roomCode string, client *utility.Client, isReady bool) error {
	lobby, err := GetLobbyPlayers(roomCode)
	if err != nil {
		return err
	}

	if _, exists := lobby[client]; !exists {
		return fmt.Errorf("client not in room %s", roomCode)
	}

	// Set client's ready status
	client.IsReady = isReady

	// // Notify all players about the status change
	// for c := range lobby {
	// 	c.Send <- utility.JsonResp{
	// 		"ok":      true,
	// 		"message": "player ready status changed",
	// 		"Payload": utility.JsonResp{
	// 			"id":       client.ID,
	// 			"ready":    isReady,
	// 			"username": client.HashName,
	// 		},
	// 		"Action": "PlayerReadyChanged",
	// 	}
	// }

	// Check if everyone is ready
	CheckAllPlayersReady(roomCode)

	return nil
}

func CheckAllPlayersReady(roomCode string) bool {
	lobby, err := GetLobbyPlayers(roomCode)
	if err != nil {
		return false
	}

	// Need at least 2 players
	if len(lobby) < 2 {
		return false
	}

	// Check if everyone is ready
	allReady := true
	for client := range lobby {
		if !client.IsReady {
			allReady = false
			break
		}
	}

	// If all are ready, notify everyone
	if allReady {
		for client := range lobby {
			client.Send <- utility.JsonResp{
				"ok":      true,
				"message": "all players ready, game can start",
				"Action":  "AllPlayersReady",
			}
		}
	}

	return allReady
}
