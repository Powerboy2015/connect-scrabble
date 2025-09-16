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

  document.getElementById(currentPlayer.id).style.backgroundColor = "red";
}
