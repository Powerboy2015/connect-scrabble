package multiplayer

// This is the main function where we initiate the socket and lay the connection.
// From here on out we will make seperate classes that will help with game management.

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
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

		response, err := HandleMessages(msg)
		if err != nil {
			fmt.Println("could not handle incoming message: ", err)
		}

		// Echo the received bytes back to the client. WriteMessage expects a []byte.
		if err := ws.WriteMessage(websocket.TextMessage, response); err != nil {
			// catches any response errors.
			fmt.Println("write error: ", err)
			break
		}
	}

}
