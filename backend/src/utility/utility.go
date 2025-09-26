package utility

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	ID       string
	HashName string
	Conn     *websocket.Conn
	Send     chan JsonResp // a channel that can holds jsonrespones
	Receive  chan []byte   // a channel that holds incoming messages
}

// a structure used to streamline responses
type Message struct {
	Action  Action                 `json:"Action"`
	Payload map[string]interface{} `json:"payload"`
}

// an action list for messages to streamline the switch case more
type Action string

const (
	UpdateGame       Action = "UpdateGame"
	JoinLobby        Action = "JoinLobby"
	ShowLobby        Action = "ShowLobby"
	SendLobbyMessage Action = "SendLobbyMessage"
)

type JsonResp map[string]interface{}
