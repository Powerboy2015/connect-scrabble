// Responsible for handling client sending and receiving.
package GoClient

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
	"zochi.com/m/v2/multiplayer/connManager"
	messagehandler "zochi.com/m/v2/multiplayer/messageHandler"
	"zochi.com/m/v2/utility"
)

func Connect(_client *utility.Client) {
	go clientReader(_client)
	go clientReceiver(_client)
	go clientHandler(_client)
}

// func Create(conn *websocket.Conn, username string) *Client {
// 	_userid := uuid.New().String()
// 	_client := Client{
// 		ID:       _userid,
// 		HashName: username,
// 		Conn:     conn,
// 		Send:     make(chan JsonResp, 256),
// 	}
// 	Manager.clients[_userid] = &_client
// 	return &_client
// }

// Loops through a channel of messages to send from a client and sends them.
func clientReader(_client *utility.Client) {
	defer _client.Conn.Close()

	for {
		message, ok := <-_client.Send
		if !ok {
			_client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
			return
		}

		err := _client.Conn.WriteJSON(message)
		if err != nil {
			return
		}
	}
}

func IsClientConnected(_client *utility.Client) bool {
	return _client != nil && _client.Conn != nil
}

// Receives incoming messages, checks if they're the right message type and adds them to the Receive channel.
func clientReceiver(_client *utility.Client) {
	defer func() {
		_client.Conn.Close()
		// Find and remove client from any lobbies they're in
		connManager.MarkClientDisconnected(_client)
	}()

	for {
		msgType, message, err := _client.Conn.ReadMessage()
		if err != nil {
			// Handle error (likely connection closed)
			break
		}

		// // If you expect JSON text, ensure TextMessage (but Binary works too)
		if msgType != websocket.TextMessage && msgType != websocket.BinaryMessage {
			log.Println("unsupported message type")
			continue
		}

		// Send the raw message to the processing channel
		_client.Receive <- message
	}

	// When the reader exits, close the receive channel
	close(_client.Receive)
}

// Handles the Receive message channel, Loops through messages and Handles them.
func clientHandler(_client *utility.Client) {
	for {
		msg, ok := <-_client.Receive
		if !ok {
			// Channel closed, exit
			return
		}
		var p utility.Message
		// checks to see if it's possible to convert it to an object from json.
		if err := json.Unmarshal(msg, &p); err != nil {
			log.Println("json unmarshal error:", err)

			resp := utility.JsonResp{"ok": false, "message": "invalid json"}
			// Echo the received bytes back to the client. WriteMessage expects a []byte.
			_client.Send <- resp
		}

		// replacement for return functionality. Basically the "execute the code" point.
		fmt.Printf("received message: %s\n", msg)

		switch p.Action {

		case utility.StartGame:
			roomCode := "JSX85K"
			// SetPlayerReady(p, _client)

			// First check if everyone is ready
			allReady := connManager.CheckAllPlayersReady(roomCode)
			if !allReady {
				_client.Send <- utility.JsonResp{
					"ok":      false,
					"message": "not all players are ready",
					"Action":  "GameStartFailed",
				}
				continue
			}

			// If everyone is ready, start the game

		case utility.JoinLobby:
			connManager.JoinLobby("JSX85K", _client)
			connManager.SendJoinMessage("JSX85K", utility.JsonResp{"ok": true, "message": "user has joined room ", "Action": "LobbyJoined"}, _client)
			SetPlayerReady(p, _client)

			// response message
			resp := utility.JsonResp{"ok": true, "message": "user has joined room ", "Action": "LobbyJoined"}
			_client.Send <- resp

			isReady := connManager.CheckAllPlayersReady("JSX85K")
			if !isReady {
				log.Printf("Loading players...")
			} else {
				log.Printf("Lobby is ready to start game!")
				// Here you could trigger game start logic
				connManager.GetWTFMessage("JSX85K")

			}

		case utility.ShowLobby:
			messagehandler.DisplayLobby(*_client, p)

		case utility.SendLobbyMessage:

			// if the payload is not given correctly, return early error.
			message, ok := p.Payload["Message"].(string)
			if !ok {
				resp := utility.JsonResp{"ok": false, "message": "invalid message format", "Action": "noEvent"}
				_client.Send <- resp

			}

			// if room is not found, return early response.
			err := connManager.SendLobbyMessage("JSX85K", []byte(message), _client)
			if err != nil {
				resp := utility.JsonResp{"ok": false, "message": err.Error(), "Action": "noEvent"}
				_client.Send <- resp

			} else {
				resp := utility.JsonResp{"ok": true, "message": "message sent to lobby", "Action": "LobbyMessageSent"}
				_client.Send <- resp

			}

		case utility.UpdateGameState:
			var gameData utility.GameDataObject
			gameDataBytes, err := json.Marshal(p.Payload)
			if err != nil {
				resp := utility.JsonResp{"ok": false, "message": "invalid game data format", "Action": "noEvent"}
				_client.Send <- resp
				continue
			}
			err = json.Unmarshal(gameDataBytes, &gameData)
			if err != nil {
				resp := utility.JsonResp{"ok": false, "message": "invalid game data format", "Action": "noEvent"}
				_client.Send <- resp
				continue
			}

			err = connManager.SendGameUpdate("JSX85K", gameData)
			if err != nil {
				resp := utility.JsonResp{"ok": false, "message": err.Error(), "Action": "noEvent"}
				_client.Send <- resp

			} else {
				resp := utility.JsonResp{"ok": true, "message": "game state updated", "Action": "GameStateUpdated"}
				_client.Send <- resp
			}

		case utility.GoToGame:
			connManager.SendMessage("JSX85K", utility.JsonResp{
				"ok":      true,
				"message": "game is starting",
				"Action":  "GameStarting",
			})

		case utility.WordFound:

			connManager.SendMessage("JSX85K", utility.JsonResp{
				"ok":      true,
				"message": "a word was found",
				"Action":  "WordFound",
				"payload": p.Payload,
			})

			// If no action can be found, return a noEvent.
		default:
			resp := utility.JsonResp{"ok": false, "message": "action does not exist", "Action": "noEvent"}
			_client.Send <- resp
		}
	}

}

func SetPlayerReady(p utility.Message, _client *utility.Client) {
	readyStatus, ok := p.Payload["ready"].(bool)

	if !ok {
		_client.Send <- utility.JsonResp{
			"ok":      false,
			"message": "invalid ready status",
			"Action":  "noEvent",
		}
	}

	roomCode := "JSX85K" // Using your default room code

	err := connManager.SetClientReady(roomCode, _client, readyStatus)
	if err != nil {
		_client.Send <- utility.JsonResp{
			"ok":      false,
			"message": err.Error(),
			"Action":  "noEvent",
		}
	}
}
