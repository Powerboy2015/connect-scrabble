import { makegrid } from '../Bord grid.js';
import { PlayerSelect2 } from '../fiches-select.js';
import { createTileBag, dealTiles, populateLetterhand } from '../Letterfichesuitdelen.js';
import { PlayerSelect, startGameTimer } from '../PlayerSelect.js';
import GameData from './GameData.js';

export default class GameState {

    /**
     * Initiates the gamestate and game loop
     */
    constructor() {
        GameData.fichesBag = createTileBag();
        console.log('Gamestate initialized with players:', GameData.playerlist);
        console.log('Initial fiches bag:', GameData.fichesBag);
        const {playerTiles, player} = dealTiles(GameData.fichesBag,[1]);
        GameData.sharedHand = playerTiles[1];
        populateLetterhand(GameData.sharedHand);
        console.log('Dealing fiches to players...', GameData.sharedHand);
        PlayerSelect();
        PlayerSelect2();
        makegrid(6, 7);
        console.log(GameData.grid, GameData.gridStatus);
    }

    startGame() {
        console.log('Game started!');
        console.debug(
            "players: ", GameData.playerlist, 
            "fichesBag: ", GameData.fichesBag, 
            "grid: ", GameData.grid, 
            "gridStatus: ", GameData.gridStatus, 
            "currentPlayer: ", GameData.currentPlayer);
        startGameTimer();
    }
}