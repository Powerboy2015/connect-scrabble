let grid = [];
let gridstatus = [];
let playercolor = "red";

function makegrid(rows, columns) {
    const board = document.getElementById("gridshit");
    const buttonspul = document.getElementById("buttonsfortest");

    board.innerHTML = ""
    buttonspul.innerHTML = ""

    grid = [];
    letteringrid = [];

    board.style.gridTemplateColumns = `repeat(${columns}, 3vw)`;
    board.style.gridTemplateRows = `repeat(${rows}, 3vw)`;

    for (let createdrows = 0; createdrows < rows; createdrows++) {
        let row = [];
        let rowstatus = [];

        for (let createdcollums = 0; createdcollums < columns; createdcollums++) {
            const idk = document.createElement("div");
            idk.classList.add("idk");
            board.appendChild(idk);
            row.push(idk)
            rowstatus.push("mt")
        }
        grid.push(row);
        gridstatus.push(rowstatus)
    }
    for (let columnbuttons = 0; columnbuttons < columns; columnbuttons++) { 
        const button = document.createElement("button");
        button.textContent = "test";
        button.onclick = () => dropkickchild(columnbuttons);
        buttonspul.appendChild(button);
    }
}

// SPELFOUT collum T-T (ik bewerk dit later lol)

function dropkickchild(column) {
    for (let row = grid.length - 1; row >= 0; row--) {
        if (gridstatus[row][column] === "mt") {
            grid[row][column].style.backgroundColor = playercolor;
            gridstatus[row][column] = "iets";
            break;
        }
    }
}