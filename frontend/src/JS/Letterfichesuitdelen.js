import { PlayerSelect2 } from "./fiches-select.js";

// Letterfiches uitdelen voor Scrabble
const letterDistribution = {
    A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1, K: 1,
    L: 4, M: 2, N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2,
    W: 2, X: 1, Y: 2, Z: 1, _: 2 // _ represents blank tiles
};

export function createTileBag() {
    const tileBag = [];
    for (const [letter, count] of Object.entries(letterDistribution)) {
        for (let i = 0; i < count; i++) {
            tileBag.push(letter);
        }
    }
    
    return shuffleTiles(tileBag);
}

function shuffleTiles(tileBag) {
    for (let i = tileBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileBag[i], tileBag[j]] = [tileBag[j], tileBag[i]];
    }
    return tileBag;
}

export function dealTiles(tileBag, gplayers) {
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
            const newTile = tileBag.shift(); // Draw a new fiche from the fiche bag
            sharedHand.push({ letter: newTile, used: false }); // Add the new fiche to the shared hand
        }
        return true; // fiche successfully used
    }
    return false; // fiche not available
}

export function useTileAndUpdate(letter, tileBag, sharedHand) {
  if (useTile(sharedHand, letter, tileBag)) {
    populateLetterhand(sharedHand); // Update HTML after using a fiche
  }
}

  // Functie om de fiches-container te vullen
  export function populateLetterhand(sharedHand) {
    const container = document.getElementById('fiches');
    if (!container) {
      console.error('Element with id "fiches-container" not found.');
      return;
    }
    container.innerHTML = ''; // Maak de container leeg

    sharedHand.forEach(tile => {
      const letterDiv = document.createElement('div');
      letterDiv.className = 'letter';
      letterDiv.textContent = tile.letter;
      if (tile.used) {
        return; // Skip rendering used tiles
      }
      // letterDiv.addEventListener('click', () => {
      //   if (!tile.used) {
      //     tile.used = true; // Mark the tile as used
      //     populateLetterhand(sharedHand); // Re-render the hand
      //   }
      // });
      container.appendChild(letterDiv);
    });
    PlayerSelect2();
  }