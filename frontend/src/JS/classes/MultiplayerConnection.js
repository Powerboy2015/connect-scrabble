export default class MultiplayerConnection {

    /** @type {WebSocket} */
    socket;
    

    constructor() {
        const url = new URL("ws://localhost:8081/online");
        // checks if there is a session id to be set.
        const sessionID = window.sessionStorage.getItem("sessionID");
        url.searchParams.set("uuid",sessionID || "");

        this.socket = new WebSocket(url); 
    }

    /**
     * 
     * @param {Message} _message 
     */
    sendMessage(_message = {}) {
        if(this.socket.readyState !== this.socket.OPEN)
        {
            return setTimeout(() => {
                console.log("waiting for socket to open...");
                this.sendMessage(_message);
            },500)
        }
        this.socket.send(JSON.stringify(_message))
    }
}