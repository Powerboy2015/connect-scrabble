// Letterfiches uitdelen voor Scrabble
const letterDistribution = {
    A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1, K: 1,
    L: 4, M: 2, N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2,
    W: 2, X: 1, Y: 2, Z: 1, _: 2 // _ represents blank tiles
};

function createTileBag() {
    const tileBag = [];
    for (const [letter, count] of Object.entries(letterDistribution)) {
        for (let i = 0; i < count; i++) {
            tileBag.push(letter);
        }
    }
    return tileBag;
}

function shuffleTiles(tileBag) {
    for (let i = tileBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileBag[i], tileBag[j]] = [tileBag[j], tileBag[i]];
    }
    return tileBag;
}

function dealTiles(tileBag, players) {
    const playerTiles = {};
    for (const player of players) {
        playerTiles[player] = tileBag.splice(0, 10); // Each player gets 10 tiles
    }
    return playerTiles;
}

// Voorbeeldgebruik
const players = ['Player1', 'Player2', 'Player3', 'Player4'];
let tileBag = createTileBag();
tileBag = shuffleTiles(tileBag);
const playerTiles = dealTiles(tileBag, players);

console.log('Tile Bag:', tileBag);
console.log('Player Tiles:', playerTiles);