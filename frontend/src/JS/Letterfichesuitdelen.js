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

function dealTiles(tileBag, gplayers) {
    const sharedHand = tileBag.splice(0, 10).map(tile => ({ letter: tile, used: false })); // Shared hand
    const playerTiles = {};
    for (const gplayer of gplayers) {
        playerTiles[gplayer] = sharedHand; // All players reference the same shared hand
    }
    return { playerTiles, sharedHand };
}

function useTile(sharedHand, letter, tileBag) {
    const tile = sharedHand.find(tile => tile.letter === letter && !tile.used);
    if (tile) {
        tile.used = true; // Mark the tile as used
        if (tileBag.length > 0) {
            const newTile = tileBag.shift(); // Draw a new tile from the tile bag
            sharedHand.push({ letter: newTile, used: false }); // Add the new tile to the shared hand
        }
        return true; // Tile successfully used
    }
    return false; // Tile not available
}

// Voorbeeldgebruik
const gplayers = ['Player1', 'Player2', 'Player3', 'Player4'];
let tileBag = createTileBag();
tileBag = shuffleTiles(tileBag);
const { playerTiles, sharedHand } = dealTiles(tileBag, gplayers);

console.log('Tile Bag:', tileBag);
console.log('Shared Hand:', sharedHand);
console.log('Player Tiles:', playerTiles);

// Example of using a tile
console.log('Player1 uses tile A:', useTile(sharedHand, 'A', tileBag));
console.log('Player2 tries to use tile A:', useTile(sharedHand, 'A', tileBag));
console.log('Updated Tile Bag:', tileBag);
console.log('Updated Shared Hand:', sharedHand);