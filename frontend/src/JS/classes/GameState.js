import { makegrid } from '../Bord grid.js';
import { PlayerSelect2 } from '../fiches-select.js';
import { createTileBag, dealTiles, populateLetterhand } from '../Letterfichesuitdelen.js';
import { PlayerSelect, PlayerTurn, startGameTimer } from '../PlayerSelect.js';
import GameData from './GameData.js';

export default class GameState {

    /**
     * Initiates the gamestate and game loop
     */
    constructor() {
        GameData.Timer.displayFunc = (time) => { 
            const user = document.getElementById("clock" + GameData.currentPlayer)
            user.innerHTML = time;
            user.style.display = "flex";    
            console.log("clock" + GameData.currentPlayer);
        };
        GameData.Timer.finishFunc = () => {
            console.log(`Player ${GameData.currentPlayer} ran out of time!`);
            document.getElementById("clock" + GameData.currentPlayer).style.display = "none";
            PlayerTurn();
            GameData.Timer.restart();
            // Handle end of turn due to timeout here
        };

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


// hihi ik doe deze spul hier :3, want al veel imports
class TeamData {
    constructor(tileBag, players) {
        this.players = players
        this.ficheshand = []

        for (let i = 0; i < 10; i++) {
            this.ficheshand.push(tileBag.pop());
        }
    }
}

function TeamClassSetup() {
    const tileBag = createTileBag();
    const PlayerAmount = Object.keys(GameData.playerlist).length;
    const players = Object.values(GameData.playerlist);
    console.log('player amount:',PlayerAmount)

    let team1, team2;
    // fuck you ik ga het op deze stomme manier doen (idk als dit ook nodig is lol)
    if (PlayerAmount == 2) {
        team1 = new TeamData(tileBag, players[0]);
        team2 = new TeamData(tileBag, players[1]);
    }
    else if (PlayerAmount == 3) {
        team1 = new TeamData(tileBag, [players[0], players[2]]);
        team2 = new TeamData(tileBag, players[1]);
    }
    else if (PlayerAmount == 4) {
        team1 = new TeamData(tileBag, [players[0], players[2]]);
        team2 = new TeamData(tileBag, [players[1], players[3]]);
    }
    else {
        console.log("wtf")
    }

    console.log('team1:', team1?.ficheshand, team1.players);
    console.log('team2:', team2?.ficheshand, team2.players);
}




TeamClassSetup()