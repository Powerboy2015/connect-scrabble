function makegrid(rows, collums) {
    let grid = []
    for (let createdrows = 0; createdrows < rows; createdrows++) {
        let row = []
        for (let createdcollums = 0; createdcollums < collums; createdcollums++) {
            row.push(null);
        }
        grid.push(row);
    }
    console.log(grid)
    return grid
}
