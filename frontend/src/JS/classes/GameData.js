/**
 * An Object that can be used to store and interact with the game.
 * In here we save our important data that we need to access globally.
 * @class GameData
 */
export default class GameData {
    static playerlist = { ...localStorage };

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
}