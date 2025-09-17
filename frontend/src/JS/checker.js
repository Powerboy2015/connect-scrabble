import GameData from "./classes/GameData.js";

export async function check() {
    const {x,y,letter} = GameData.lastPlacement;
    // Check if the last placement is valid
    if (letter !== "empty") {
        console.log("Last placement is valid:", GameData.lastPlacement);
    } else {
        console.log("No valid last placement to check.");
        return;
    }


    //check if 4 letters are on the board in a row
    let directions = [
        {dx: 1, dy: 0,directionName: "horizontal"},  // horizontal
        {dx: 0, dy: 1,directionName: "vertical"},  // vertical
        {dx: 1, dy: 1,directionName: "diagonal down-right"},  // diagonal down-right
        {dx: 1, dy: -1,directionName: "diagonal up-right"}  // diagonal up-right
    ];

    for (let {dx, dy,directionName} of directions) {
        // temp array that holds the the letters and at which location they were.
        /**
         * @type {Array<{letter: string, position: number}>}
         */
        let letters = [];
        letters.push({letter: letter, position: 0, x: x, y: y, total: x+y}); // Add the last placed letter as the starting point
        // Check in the positive direction
        await checkNext(x,y,dx,dy,letters,1, "forward",directionName);
        await checkNext(x,y,dx,dy,letters,-1, "backward",directionName);
    }
}

async function checkNext(x, y, dx, dy, letters, position, direction, _directionName) {
    
    let newX, newY, nextPosition;
    if(direction === "forward") {
        newX = x + dx; 
        newY = y + dy;
        nextPosition = position + 1;
    } else {
        newX = x - dx;
        newY = y - dy;
        nextPosition = position - 1;
    }
    let nextLetter;
    try{
        nextLetter = GameData.gridStatus[newY][newX];
        console.debug("Checking position:", newX, newY, "Found:", nextLetter);
    } catch(e) {
        console.debug("Out of bounds");
        return;
    }

    if (nextLetter !== "empty" && nextLetter !== undefined) {
        letters.push({letter: nextLetter, position: position, x: newX, y: newY, total: newX + newY});
        
        if (letters.length >= 4 && letters.length <= 7) {
            console.log(`Found ${letters.length} in a row:`, letters);
            await sendCheckupRequest(letters, _directionName);
            // Here you can add logic to handle the event of finding 4 in a row
            // return letters
        } else if (letters.length > 7) {
            return;
        }
        return checkNext(newX, newY, dx, dy, letters, nextPosition,direction,_directionName);
    } else {
        console.debug("No letter at position:", newX, newY);
        return;
    }
}

/**
 * 
 * @param {[{letter: string, position: number, x: number, y: number, total: number}]} letters 
 * @param {string} _directionName 
 */
async function sendCheckupRequest(letters, _directionName) {
    // Send the letters and direction name to the server or handle the checkup logic
    console.debug("Sending checkup request for direction:", _directionName);

    const sorted = letters.sort((a, b) => a.position - b.position);    
    const word = sorted.map(l => l.letter).join('');
    const reversedWord = [...sorted].reverse().map(l => l.letter).join('');

    const words = [word, reversedWord];

    for (const word of words) {
        const found = await getWordsFromServer(word.toLowerCase());
        if (found) {
            console.log(`Valid word found (${_directionName}):`, word);
        }
        console.debug("Found words for checkup:", found);
    }
    
}

/**
 * 
 * @param {string} word 
 * @returns {Promise<Array<string>>} An array of found words from the server
 */
async function getWordsFromServer(word) {
    try {
        const response = await fetch('http://localhost:8081/api/v1/checkWord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Word: word })
        });

        if (!response.ok) {
            console.error("Server responded with an error:", response.statusText);
            return [];
        } 
        const data = await response.json();
        return data.found; // Assuming the server returns an array of words
    } catch (error) {
        console.error("Error fetching words from server:", error);
        return [];
    }
}