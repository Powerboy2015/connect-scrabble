package multiplayer

import (
	"fmt"

	connManager "zochi.com/m/v2/multiplayer/connManager"
)

func displayLobby(_client connManager.Client) {
	clientmap, err := connManager.GetLobbyPlayers("JSX85K")
	if err != nil {
		// Handle room not found
		resp := JsonResp{
			"ok":      false,
			"message": fmt.Sprintf("Room not found: %v", err),
			"Action":  p.Action,
		}
		_client.Conn.WriteJSON(resp)
	}

	// Extract client IDs from the map to make it serializable for frontend
	playerList := make([]string, 0, len(clientmap))
	for playerClient := range clientmap {
		playerList = append(playerList, playerClient.HashName)
	}

	// Create response with player list
	resp := JsonResp{
		"ok":      true,
		"message": "Lobby players retrieved",
		"Action":  "LobbyData",
		"Payload": JsonResp{
			"roomCode": "JSX85K",
			"players":  playerList,
			"count":    len(playerList),
		},
	}
	_client.Conn.WriteJSON(resp)
}
