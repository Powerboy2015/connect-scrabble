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

function clockvis(playernum) {
  const cocks = document.querySelectorAll(".clock");
  
  cocks.forEach((cock, index) => {
    if (index + 1 === playernum) {
      cock.style.display = "flex";
    }
    else{
      cock.style.display = "none";
    }
  })
}


let IsActive = false;
export function TimerStart() {
  if (GameData.isTimerActive) {
    clearInterval(GameData.countDownInterval);
    GameData.countDownInterval = null;
  }

  let time = 15;
  clockvis(currenPlayerNumber);
  PlayerTurn();

  if (IsActive){
    return;
  }

  GameData.countDownInterval = setInterval(() => {
    IsActive = true;
    let clockspul = document.getElementById("clock" + currenPlayerNumber)
    if (time > 0) {
      clockspul.innerHTML = time;
    }

    else {
      clearInterval(GameData.countDownInterval);
      clockspul.innerHTML = "0";
      IsActive = false;
    }
    time -= 1;
  }, 1000);
}


function PlayerTurn() {
  let currentPlayer = document.getElementById(`player${currenPlayerNumber}`);
    // clockvis(currenPlayerNumber);

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
  
}

export function startGameTimer() {
  let time = 3;
  GameData.countDownInterval = setInterval(function () {
    if (time > 0) {
      document.querySelector(".StartCountDown").innerHTML = time;
    } else {
      clearInterval(GameData.countDownInterval);
      document.querySelector(".StartCountDown").innerHTML = 0;
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
