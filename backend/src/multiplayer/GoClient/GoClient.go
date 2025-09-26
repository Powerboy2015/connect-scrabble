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

// Receives incoming messages, checks if they're the right message type and adds them to the Receive channel.
func clientReceiver(_client *utility.Client) {
	defer _client.Conn.Close()

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

		case utility.UpdateGame:

		case utility.JoinLobby:
			connManager.JoinLobby("JSX85K", _client)
			fmt.Println(p.Payload)

			// response message
			resp := utility.JsonResp{"ok": true, "message": "user has joined room ", "Action": "LobbyJoined"}
			_client.Send <- resp

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

			// If no action can be found, return a noEvent.
		default:
			resp := utility.JsonResp{"ok": false, "message": "action does not exist", "Action": "noEvent"}
			_client.Send <- resp
		}
	}

}
