package multiplayer

// This is the main function where we initiate the socket and lay the connection.
// From here on out we will make seperate classes that will help with game management.

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"zochi.com/m/v2/encryption"
	"zochi.com/m/v2/multiplayer/connManager"
)

// used in order to upgrade the connection from a https request to a websocket connection.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
	// allowing all conncetion types. We do the original cors checking before already
}

func Connect(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	query := r.URL.Query()
	userID := query.Get("uuid")
	userHash := query.Get("userHash")
	fmt.Println("userhash: ", userHash)
	var user encryption.User
	if userHash != "" {
		user = encryption.DecodeUser(userHash)
	} else {
		user = encryption.User{
			Username: "anonymous",
			Password: "undefined",
		}
	}

	var client *connManager.Client
	if userID == "" {
		client = connManager.AddClient(ws, user.Username)
		client.Conn.WriteJSON(JsonResp{"ok": true, "message": "new client connected successfully to server", "Payload": JsonResp{"id": client.ID}, "Action": "NewUserConnected"})
	} else {
		client, err = connManager.RejoinClient(userID, ws)
		if err != nil {
			// Client not found, create a new one
			client = connManager.AddClient(ws, user.Username)
			client.Conn.WriteJSON(JsonResp{"ok": true, "message": "UUID was not found, rejoined as new client to server", "Payload": JsonResp{"id": client.ID}, "Action": "NewUserConnected"})
		} else {
			// Client found and reconnected
			client.Conn.WriteJSON(JsonResp{"ok": true, "message": "client reconnected successfully to server", "Payload": JsonResp{"id": client.ID}, "Action": "UserConnected"})
		}

	}

	// deferring closing, meaning it closes later when we are doing with using the connection within this funtion.
	defer ws.Close()

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("read error: ", err)
			break
		}

		// replacement for return functionality. Basically the "execute the code" point.
		fmt.Printf("received message: %s\n", msg)

		switch p.Action {

		case UpdateGame:

		case JoinLobby:
			connManager.JoinLobby("JSX85K", client)
			fmt.Println(p.Payload)

			// response message
			resp := JsonResp{"ok": true, "message": "user has joined room ", "Action": "LobbyJoined"}
			client.Conn.WriteJSON(resp)

		case ShowLobby:
			displayLobby(*client)

		case "SendLobbyMessage":
			message, ok := p.Payload["message"].(string)
			if !ok {
				resp := JsonResp{"ok": false, "message": "invalid message format", "Action": "noEvent"}
				client.Conn.WriteJSON(resp)
				continue
			}
			err := connManager.SendLobbyMessage("JSX85K", []byte(message))
			if err != nil {
				resp := JsonResp{"ok": false, "message": err.Error(), "Action": "noEvent"}
				client.Conn.WriteJSON(resp)
			} else {
				resp := JsonResp{"ok": true, "message": "message sent to lobby", "Action": "LobbyMessageSent"}
				client.Conn.WriteJSON(resp)
			}

		default:
			resp := JsonResp{"ok": false, "message": "action does not exist", "Action": "noEvent"}
			client.Conn.WriteJSON(resp)
		}

	}
}
