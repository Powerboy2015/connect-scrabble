/**
 * An Object that can be used to store and interact with the game.
 * In here we save our important data that we need to access globally.
 * @class GameData
 */
export default class GameData {
    static playerlist = { ...localStorage };

    /** @type {Array<string>} */
    static fichesBag = [];

    /** @type {number} */
    static currentPlayer = 0;

    /** @type {Array<Array<HTMLElement>>} */
    static grid = [];

    /** @type {Array<Array<string>>} */
    static gridStatus = [];

    static lastPlacement = {x:0, y:0, letter:"" };

    static isTimerActive = false;
    static countDownInterval = null;

    //TODO needs to be a single selected finch from the board
    static selectedLetter = ["A","P","P","E","L"];

    /**
    * @returns {string} The currently selected letter from the dropdown.
     */
    static get getSelectedLetter() {
        const letter = this.selectedLetter.pop() || "";
        console.log("Selected letter:", letter);
        return letter;
    }
}