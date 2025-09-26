package multiplayer

// This is the main function where we initiate the socket and lay the connection.
// From here on out we will make seperate classes that will help with game management.

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"zochi.com/m/v2/encryption"
	connManager "zochi.com/m/v2/multiplayer/connManager"
)

type Action string

const (
	UpdateGame Action = "UpdateGame"
	JoinLobby  Action = "JoinLobby"
	ShowLobby  Action = "ShowLobby"
)

type Message struct {
	Action  Action                 `json:"Action"`
	Payload map[string]interface{} `json:"payload"`
}

type JsonResp = map[string]interface{}

var p Message

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
	user := encryption.DecodeUser(userHash)
	fmt.Println(user)

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
		msgType, msg, err := client.Conn.ReadMessage()
		if err != nil {
			fmt.Println("read error: ", err)
			break
		}

		// If you expect JSON text, ensure TextMessage (but Binary works too)
		if msgType != websocket.TextMessage && msgType != websocket.BinaryMessage {
			log.Println("unsupported message type")
			continue
		}

		// checks to see if it's possible to convert it to an object from json.
		if err := json.Unmarshal(msg, &p); err != nil {
			log.Println("json unmarshal error:", err)

			resp := JsonResp{"ok": false, "message": "invalid json"}
			// Echo the received bytes back to the client. WriteMessage expects a []byte.
			if err := client.Conn.WriteJSON(resp); err != nil {
				// catches any response errors.
				fmt.Println("write error: ", err)
			}
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

		default:
			resp := JsonResp{"ok": false, "message": "action does not exist", "Action": "noEvent"}
			client.Conn.WriteJSON(resp)
		}

	}
}
