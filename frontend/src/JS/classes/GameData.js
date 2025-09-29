import Timer from "../Timer.js";

/**
 * An Object that can be used to store and interact with the game.
 * In here we save our important data that we need to access globally.
 * @class GameData
 */
export default class GameData {
    static playerlist = { ...localStorage };

    // Holds the value of where in the array the player currently is.
    /** @type {number} */
    static ThisPlayerSpot;

    /** @type {Array<string>} */
    static fichesBag = [];

    /** @type {Array<{letter: string, used: boolean}>} */
    static sharedHand = [];

    /** @type {number} */
    static currentPlayer = 0;

    /** @type {Array<Array<HTMLElement>>} */
    static grid = [];

    /** @type {Array<Array<string>>} */
    static gridStatus = [];

    static lastPlacement = {x:0, y:0, letter:"" };

    static isTimerActive = false;
    static countDownInterval = null;

    // Currently selected letter from the shared hand
    static selectedLetter = "";

    static Timer = new Timer;

    /**
     * Dynamically fetches the next available letter from the shared hand.
     * Removes the letter from the shared hand and returns it.
     * @returns {string} The next selected letter.
     */
    static get getSelectedLetter() {
        const letter = this.selectedLetter;
        this.selectedLetter = ""; 
        return letter;
    }

    static json() {
        return {
            // playerlist: this.playerlist,
            FichesBag: this.fichesBag,
            SharedHand: this.sharedHand,
            CurrentPlayer: this.currentPlayer,
            GridStatus: this.gridStatus,
            // lastPlacement: this.lastPlacement,
            // isTimerActive: this.isTimerActive,
            // selectedLetter: this.selectedLetter
        };
    }

    // Checks if it's the current players's turn.
    static isPlayerTurn() {
        return this.currentPlayer == this.ThisPlayerSpot;
    }
}