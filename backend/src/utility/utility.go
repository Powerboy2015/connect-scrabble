package utility

import (
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID             string
	HashName       string
	Conn           *websocket.Conn
	Send           chan JsonResp
	Receive        chan []byte
	DisconnectedAt *time.Time // Add this field to track disconnection time
	IsReady        bool       // Add this field to track readiness
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
	UpdateGameState  Action = "UpdateGameState"
	StartGame        Action = "StartGame"
	SetPlayerReady   Action = "SetPlayerReady"
	GoToGame         Action = "GoToGame"
	WordFound        Action = "WordFound"
)

type JsonResp map[string]interface{}

type GameDataObject struct {
	FichesBag     []string
	SharedHand    []letter
	CurrentPlayer int
	// Grid          [][]html.Node
	GridStatus [][]string
}

type letter struct {
	Letter string `json:"letter"`
	Used   bool   `json:"used"`
}
