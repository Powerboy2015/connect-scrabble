package multiplayer

// This is the main function where we initiate the socket and lay the connection.
// From here on out we will make seperate classes that will help with game management.

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"zochi.com/m/v2/encryption"
	goClient "zochi.com/m/v2/multiplayer/GoClient"
	connManager "zochi.com/m/v2/multiplayer/connManager"
	"zochi.com/m/v2/utility"
)

var p utility.Message

// used in order to upgrade the connection from a https request to a websocket connection.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
	// allowing all conncetion types. We do the original cors checking before already
}

// XXX Entryfunction for websockets. Upgrades HTTP request and log user into the websocket.
func Connect(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	// gathers given querys
	query := r.URL.Query()
	userID := query.Get("uuid")
	userHash := query.Get("userHash")

	// checks if an user is give, otherwise logs you in as anonymous
	var user encryption.User
	if userHash != "" {
		user = encryption.DecodeUser(userHash)
	} else {
		user = encryption.User{
			Username: "anonymous",
			Password: "undefined",
		}
	}

	// This part checks if the user was logged in before and if not, gives it a new UUID and handle.
	var client *utility.Client
	if userID == "" {
		client = connManager.AddClient(ws, user.Username)
		client.Conn.WriteJSON(utility.JsonResp{"ok": true, "message": "new client connected successfully to server", "Payload": utility.JsonResp{"id": client.ID}, "Action": "NewUserConnected"})
	} else {
		client, err = connManager.RejoinClient(userID, ws)
		if err != nil {
			// Client not found, create a new one
			client = connManager.AddClient(ws, user.Username)
			client.Conn.WriteJSON(utility.JsonResp{"ok": true, "message": "UUID was not found, rejoined as new client to server", "Payload": utility.JsonResp{"id": client.ID}, "Action": "NewUserConnected"})
		} else {
			// Client found and reconnected
			client.Conn.WriteJSON(utility.JsonResp{"ok": true, "message": "client reconnected successfully to server", "Payload": utility.JsonResp{"id": client.ID}, "Action": "UserConnected"})
		}
	}

	// connects to the message handlers & receivers.
	goClient.Connect(client)

}
