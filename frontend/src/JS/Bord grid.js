import { check, checkForWords } from "./checker.js";
import GameData from "./classes/GameData.js";
import { PlayerTurn, TimerStart } from "./PlayerSelect.js";
import { useTileAndUpdate } from "./Letterfichesuitdelen.js";
// let grid = [];
// let gridstatus = [];
// let playercolor = "red";


export function makegrid(rows, columns) {
    const board = document.getElementById("gridshit");
    const buttonspul = document.getElementById("buttonsfortest");

    board.innerHTML = ""
    buttonspul.innerHTML = ""

    let grid = [];
    let gridstatus = []

    board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let createdrows = 0; createdrows < rows; createdrows++) {
        let row = [];
        let rowstatus = [];

        for (let createdcollums = 0; createdcollums < columns; createdcollums++) {
            const vakjes = document.createElement("div");
            vakjes.classList.add("vakjes");
            board.appendChild(vakjes);
            row.push(vakjes)
            rowstatus.push("empty")
        }
        grid.push(row);
        gridstatus.push(rowstatus)
    }
    GameData.grid = grid;
    GameData.gridStatus = gridstatus;

    for (let columnbuttons = 0; columnbuttons < columns; columnbuttons++) { 
        const button = document.createElement("button");
        button.classList.add("dropbutton");
        button.onclick = () => dropkickchild(columnbuttons);
        buttonspul.appendChild(button);
        
    }
}

// SPELFOUT collum T-T (ik bewerk dit later lol)

async function dropkickchild(column) {
    const _letter = GameData.getSelectedLetter;

    if (!(await check())) return;

    for (let row = GameData.grid.length - 1; row >= 0; row--) {
        if (GameData.gridStatus[row][column] === "empty") {
            GameData.grid[row][column].textContent = _letter;
            GameData.grid[row][column].classList.add("iets");

            GameData.gridStatus[row][column] = _letter; // iets wordt een letter later te zijn (die komt dan in een
            // lijst waar zico misschien iets kan maken waardoor het checkt naast de vakjes bij het nieuwe letter ofzo)
            // hallo here it is -zico
            
            GameData.lastPlacement = {x:column, y:row, letter:_letter};



            break;
        }
    }
}

async function executeTurn(_column) {
    const _letter = GameData.getSelectedLetter;

    // does something with mukdembu's check
    if (!(await check())) return;
    checkForWords();
    useTileAndUpdate(_letter, GameData.fichesBag, GameData.sharedHand);
    reloadGrid(_column,_letter);
    GameData.Timer.restart();
    PlayerTurn();

    // XXX: debug info
    console.debug(GameData.gridStatus);
    console.debug(GameData.grid);
    console.debug(GameData.lastPlacement);
}

function reloadGrid(column,_letter) {
    for (let row = GameData.grid.length - 1; row >= 0; row--) {
        if (GameData.gridStatus[row][column] === "empty") {
            GameData.grid[row][column].textContent = _letter;
            GameData.grid[row][column].classList.add("iets");

            GameData.gridStatus[row][column] = _letter; // iets wordt een letter later te zijn (die komt dan in een
            // lijst waar zico misschien iets kan maken waardoor het checkt naast de vakjes bij het nieuwe letter ofzo)
            // hallo here it is -zico
            
            GameData.lastPlacement = {x:column, y:row, letter:_letter};
        }
    }
}