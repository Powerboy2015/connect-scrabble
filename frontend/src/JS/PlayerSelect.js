import GameData from "./classes/GameData.js";

let player = 0;
let currenPlayerNumber = 1;
export function PlayerSelect() {
  let player = 0;
  for (let i in GameData.playerlist) {
    player++;
    console.log(i);
    console.log(`player${player}`);
    document.getElementById(`player${player}`).innerHTML = i;
  }
}


//Ik heb een functie gemaakt die de timer naast de persoon showed, maar de timer
//is voor een rede 1 persoon verder de heletijd en ik kan dit niet fixen T-T
function clockvis(playernum) {
  const totalPlayers = Object.keys(GameData.playerlist).length;

  for (let i = 1; i <= totalPlayers; i++) {
    const clockthingy = document.getElementById(`clock${i}`);
    if (i === playernum) {
      clockthingy.style.display = "flex"; 
    } else {
      clockthingy.style.display = "none";
      clockthingy.innerHTML = "";
    }
  }
}


let IsActive = false;
export function TimerStart() {
  if (GameData.isTimerActive) {
    clearInterval(GameData.countDownInterval);
    GameData.countDownInterval = null;

  }
  let time = 15;
  PlayerTurn();

  const activeClock = document.getElementById(`clock${currenPlayerNumber}`);
  if (activeClock) activeClock.innerHTML = time;

  GameData.isTimerActive = true;
  GameData.countDownInterval = setInterval(() => {
    time -= 1;

    if (activeClock) {
      activeClock.innerHTML = Math.max(0, time);
    }

    if (time <= 0) {
      clearInterval(GameData.countDownInterval);
      GameData.countDownInterval = null;
      GameData.isTimerActive = false;

      setTimeout(() => {
        if (activeClock) {
          activeClock.innerHTML = "";
          activeClock.style.display = "none";
        }
        TimerStart();
      }, 250);
    }
  }, 1000);
}

function PlayerTurn() {
  let currentPlayer = document.getElementById(`player${currenPlayerNumber}`);
  if (currenPlayerNumber < Object.keys(GameData.playerlist).length) {
    currenPlayerNumber++;
  } else {
    currenPlayerNumber = 1;
  }

  GameData.currentPlayer = currenPlayerNumber;

  console.log(currentPlayer.id);
  document.getElementById("player1-select").innerHTML = "";
  document.getElementById("player2-select").innerHTML = "";
  document.getElementById("player3-select").innerHTML = "";
  document.getElementById("player4-select").innerHTML = "";

  if (currentPlayer.id === "player1" || currentPlayer.id === "player3") {
    document.getElementById(`${currentPlayer.id}-select`).innerHTML = "&#x23F4";
  }
  if (currentPlayer.id === "player2" || currentPlayer.id === "player4") {
    document.getElementById(`${currentPlayer.id}-select`).innerHTML = "&#x23F5";
  }

  clockvis(currenPlayerNumber);
}

export function startGameTimer() {
  let time = 3;
  GameData.countDownInterval = setInterval(function () {
    if (time > 0) {
      document.querySelector(".StartCountDown").innerHTML = time;
    } else {
      clearInterval(GameData.countDownInterval);
      document.querySelector(".StartCountDown").innerHTML = 0;
      IsActive = false;
    }
    time -= 1;
  }, 1000);

  setTimeout(() => {
    document.getElementById("StartCountDown").style.display = "none";
  }, 5000);

  setTimeout(() => {
    TimerStart();
  }, 5000);
}
