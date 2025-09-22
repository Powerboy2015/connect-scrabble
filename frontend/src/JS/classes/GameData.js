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

    /**
     * Dynamically fetches the next available letter from the shared hand.
     * Removes the letter from the shared hand and returns it.
     * @returns {string} The next selected letter.
     */
    static get getSelectedLetter() {
        if (this.sharedHand.length > 0) {
            const tile = this.sharedHand.find(tile => !tile.used); // Find the first unused tile
            if (tile) {
                tile.used = true; // Mark the tile as used
                console.log("Selected letter:", tile.letter);
                return tile.letter;
            }
        }
        console.warn("No unused letters available in shared hand.");
        return "";
    }
}