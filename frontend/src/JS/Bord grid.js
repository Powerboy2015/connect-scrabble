function makegrid(rows, columns) {
    let grid = []
    const board = document.getElementById("gridshit")

    board.innerHTML = "";

    board.style.gridTemplateColumns = `repeat(${columns}, 50px)`;
    board.style.gridTemplateRows = `repeat(${rows}, 50px)`;

    for (let createdrows = 0; createdrows < rows; createdrows++) {
        let row = new Array(7);
        grid.push(row);

        for (let createdcollums = 0; createdcollums < columns; createdcollums++) {
            const idk = document.createElement("div");
            idk.classList.add("idk");
            board.appendChild(idk);
        }
        
    }
    console.log(grid)
    return grid
}
