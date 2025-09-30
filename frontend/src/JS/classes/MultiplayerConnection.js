import encrypter from "./Encrypter.js";

export default class MultiplayerConnection {
    /** @type {WebSocket} */
    static socket;

    // Action handlers mapped by action name
    actionHandlers = {
        // asks request for lobby data once someone joined the lobby.
        /** @param {Message} mesg  */
        LobbyJoined: (mesg) => {
            this.sendMessage({ Action: "ShowLobby", Payload: {} });
        },

        /** @param {Message} mesg  */
        LobbyData: (mesg) => {
            console.log("Received lobby data:", mesg.Payload);
            // Handle showing lobby data - add your code here
        },
    };

    constructor() {
        const url = new URL("ws://145.89.121.84:8081/online");
        // checks if there is a session id to be set.
        const sessionID = window.sessionStorage.getItem("sessionID");
        const userHash = this.hashLoggedUser();

        url.searchParams.set("uuid", sessionID || "");
        url.searchParams.set("userHash", userHash);

        this.socket = new WebSocket(url);

        this.socket.onmessage = (e) => {
            /** @type {Message} */
            const mesg = JSON.parse(e.data);

            // Dynamically call the appropriate handler based on action name
            if (mesg.Action && this.actionHandlers[mesg.Action]) {
                this.actionHandlers[mesg.Action](mesg);
            } else {
                console.warn(`No handler defined for action: ${mesg.Action}`);
            }
        };
        MultiplayerConnection.socket = this.socket;
    }
    /**
     *
     * @param {Message} _message
     */
    sendMessage(_message = {}) {
        if (this.socket.readyState !== this.socket.OPEN) {
            console.log("waiting for socket to open...");
            return setTimeout(() => {
                this.sendMessage(_message);
            }, 500);
        }
        this.socket.send(JSON.stringify(_message));
    }

    static sendMessage(_message = {}) {
        if (
            MultiplayerConnection.socket.readyState !==
            MultiplayerConnection.socket.OPEN
        ) {
            console.log("waiting for socket to open...");
            return setTimeout(() => {
                MultiplayerConnection.sendMessage(_message);
            }, 500);
        }
        MultiplayerConnection.socket.send(JSON.stringify(_message));
    }

    /**
     * Register a new action handler or override an existing one
     * @param {string} actionName - The action name to handle
     * @param {function} handlerFunction - The handler function that receives the message
     */
    registerHandler(actionName, handlerFunction) {
        if (typeof handlerFunction !== "function") {
            throw new Error("Handler must be a function");
        }

        this.actionHandlers[actionName] = handlerFunction;
        return this; // For method chaining
    }

    /**
     * Remove a handler for a specific action
     * @param {string} actionName - The action to remove handler for
     */
    removeHandler(actionName) {
        delete this.actionHandlers[actionName];
        return this; // For method chaining
    }

    hashLoggedUser() {
        const username = window.sessionStorage.getItem("username");
        const password = window.sessionStorage.getItem("password");
        const isFilled = !!password && !!username;

        if (!isFilled) {
            console.error(
                "user not logged in! Not supposed to happen but allowing anonymous user."
            );
            return "";
        }

        // Create the plaintext username|password format
        const plaintext = `${username}|${password}`;
        console.log("Plain text to encrypt:", plaintext);

        // Encrypt with the same key as Go is using
        const userString = encrypter.simpleEncrypt(plaintext, 16298085);
        console.log("Encrypted user string:", userString);
        return userString;
    }
}
