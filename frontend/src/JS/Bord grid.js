import { check } from "./checker.js";
import GameData from "./classes/GameData.js";
import { TimerStart } from "./PlayerSelect.js";
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

function dropkickchild(column) {
    for (let row = GameData.grid.length - 1; row >= 0; row--) {
        if (GameData.gridStatus[row][column] === "empty") {
            const _letter = GameData.getSelectedLetter;
            GameData.grid[row][column].textContent = _letter;
            GameData.grid[row][column].classList.add("iets"); //"iets" wordt de 2e class van het lege vakje 
            // waardoor het een andere kleur krijgt, als iemand dit dus wilt veranderen, zo dat het 
            // om en om verandert van speler kan je een naam aanmaken die dan een andere css heeft bvb voor kleur??
            // mijn nederland is dood

            GameData.gridStatus[row][column] = _letter; // iets wordt een letter later te zijn (die komt dan in een
            // lijst waar zico misschien iets kan maken waardoor het checkt naast de vakjes bij het nieuwe letter ofzo)
            // hallo here it is -zico
            
            GameData.lastPlacement = {x:column, y:row, letter:_letter};

            // XXX: debug info
            console.debug(GameData.gridStatus);
            console.debug(GameData.grid);
            console.debug(GameData.lastPlacement);
            check();
            TimerStart();
            break;
        }
    }
}