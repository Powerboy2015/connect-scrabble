const players = { ...localStorage };
let player = 0;
let currenPlayerNumber = 1;
function PlayerSelect() {
  for (i in players) {
    player++;
    console.log(i);
    console.log(`player${player}`);
    document.getElementById(`player${player}`).innerHTML = i;
  }
}

let IsActive = false;
function TimerStart() {
  if (IsActive) {
    clearInterval(countdown);
  }
  let time = 15;
  PlayerTurn();
  countdown = setInterval(function () {
    IsActive = true;
    if (time > 0) {
      document.getElementById("clock").innerHTML = time;
    } else {
      clearInterval(countdown);
      document.getElementById("clock").innerHTML = 0;
      IsActive = false;
      TimerStart();
    }
    time -= 1;
  }, 1000);
}

function PlayerTurn() {
  let currentPlayer = document.getElementById(`player${currenPlayerNumber}`);
  if (currenPlayerNumber < Object.keys(players).length) {
    currenPlayerNumber++;
  } else {
    currenPlayerNumber = 1;
  }

  console.log(currentPlayer.id);
  document.getElementById("player1-select").innerHTML = "";
  document.getElementById("player2-select").innerHTML = "";
  document.getElementById("player3-select").innerHTML = "";
  document.getElementById("player4-select").innerHTML = "";

  if (currentPlayer.id === "player2" || currentPlayer.id === "player4") {
    document.getElementById(`${currentPlayer.id}-select`).innerHTML = "&#x23F4";
  }
  if (currentPlayer.id === "player1" || currentPlayer.id === "player3") {
    document.getElementById(`${currentPlayer.id}-select`).innerHTML = "&#x23F5";
  }
}

function startGameTimer() {
  let time = 3;
  countdown = setInterval(function () {
    if (time > 0) {
      document.querySelector(".StartCountDown").innerHTML = time;
    } else {
      clearInterval(countdown);
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
