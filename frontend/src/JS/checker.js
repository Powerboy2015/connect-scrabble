import GameData from "./classes/GameData.js";
import MultiplayerConnection from "./classes/MultiplayerConnection.js";
import { PlayerSelect2, isSelected } from "./fiches-select.js";

export async function check() {
    const { letter } = GameData.lastPlacement;
    // Check if the last placement is valid
    if (letter !== "empty" && isSelected()) {
        console.log("Last placement is valid:", GameData.lastPlacement);
        return true;
    } else {
        console.log("No valid last placement to check.");
        return false;
    }
}

export async function checkForWords() {
    const { x, y, letter } = GameData.lastPlacement;
    if (!letter || letter === "empty") return;

    //check if 4 letters are on the board in a row
    let directions = [
        { dx: 1, dy: 0, directionName: "horizontal" }, // horizontal
        { dx: 0, dy: 1, directionName: "vertical" }, // vertical
        { dx: 1, dy: 1, directionName: "diagonal down-right" }, // diagonal down-right
        { dx: 1, dy: -1, directionName: "diagonal up-right" }, // diagonal up-right
    ];

    for (let { dx, dy, directionName } of directions) {
        // temp array that holds the the letters and at which location they were.
        /**
         * @type {Array<{letter: string, position: number}>}
         */
        let letters = [];
        letters.push({ letter: letter, position: 0, x: x, y: y, total: x + y }); // Add the last placed letter as the starting point
        // Check in the positive direction
        await checkNext(x, y, dx, dy, letters, 1, "forward", directionName);
        await checkNext(x, y, dx, dy, letters, -1, "backward", directionName);
    }
}

async function checkNext(
    x,
    y,
    dx,
    dy,
    letters,
    position,
    direction,
    _directionName
) {
    let newX, newY, nextPosition;
    if (direction === "forward") {
        newX = x + dx;
        newY = y + dy;
        nextPosition = position + 1;
    } else {
        newX = x - dx;
        newY = y - dy;
        nextPosition = position - 1;
    }
    let nextLetter;
    try {
        nextLetter = GameData.gridStatus[newY][newX];
        console.debug("Checking position:", newX, newY, "Found:", nextLetter);
    } catch (e) {
        console.debug("Out of bounds");
        return;
    }

    if (nextLetter !== "empty" && nextLetter !== undefined) {
        letters.push({
            letter: nextLetter,
            position: position,
            x: newX,
            y: newY,
            total: newX + newY,
        });

        // Check for valid words at each step, not just when reaching 4-7 letters
        if (letters.length >= 4 && letters.length <= 7) {
            console.log(`Found ${letters.length} in a row:`, letters);
            await sendCheckupRequest(letters, _directionName);

            // Add this section to check all possible valid subwords
            if (letters.length > 4) {
                // Check all possible subwords of length 4 or more
                for (
                    let startIdx = 0;
                    startIdx <= letters.length - 4;
                    startIdx++
                ) {
                    for (
                        let endIdx = startIdx + 3;
                        endIdx < letters.length;
                        endIdx++
                    ) {
                        const subLetters = letters.slice(startIdx, endIdx + 1);
                        if (subLetters.length >= 4) {
                            console.log(
                                `Checking subword of length ${subLetters.length}:`,
                                subLetters
                            );
                            await sendCheckupRequest(
                                subLetters,
                                _directionName
                            );
                        }
                    }
                }
            }
        } else if (letters.length > 7) {
            return;
        }
        return checkNext(
            newX,
            newY,
            dx,
            dy,
            letters,
            nextPosition,
            direction,
            _directionName
        );
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
    const word = sorted.map((l) => l.letter).join("");
    const reversedWord = [...sorted]
        .reverse()
        .map((l) => l.letter)
        .join("");

    const words = [word, reversedWord];

    for (const word of words) {
        const found = await getWordsFromServer(word.toLowerCase());
        if (found) {
            console.log(`Valid word found (${_directionName}):`, word);
            MultiplayerConnection.sendMessage({
                Action: "WordFound",
                Payload: {
                    word: word,
                },
            });
            showBanner(word); // Show the banner when a valid word is found
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
        const response = await fetch("http://localhost:8081/api/v1/checkWord", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Word: word }),
        });

        if (!response.ok) {
            console.error(
                "Server responded with an error:",
                response.statusText
            );
            return [];
        }
        const data = await response.json();
        return data.found; // Assuming the server returns an array of words
    } catch (error) {
        console.error("Error fetching words from server:", error);
        return [];
    }
}

/**
 * Banner weergeeft bij correct woord het gebruikte woord en de winnaars
 * @param {string} word correct woord gevormd
 */
export function showBanner(word) {
    const banner = document.getElementById("idk");
    const winText = document.getElementById("WinText");

    if (banner && winText) {
        // Winnende team wordt bepaald door juiste speler
        const currentPlayerIndex = GameData.currentPlayer;
        const teamPlayers = Object.values(GameData.playerlist);
        const winningTeam =
            currentPlayerIndex % 2 === 0
                ? [teamPlayers[0], teamPlayers[2]] // Team 1
                : [teamPlayers[1], teamPlayers[3]]; // Team 2

        // Update banner text
        winText.textContent = `Winnaars: ${winningTeam.join(
            " & "
        )} - "${word}"`;
        banner.style.display = "flex"; // laat banner zien
    } else {
        console.error("Banner or WinText element not found.");
    }
}
