function AddButton() {
  player = document.getElementById("nameInput").value;
  const items = { ...localStorage };

  if (player !== "") {
    newListItem = document.createElement("li");
    newButton = document.createElement("button");
    newListItem.innerHTML = player;
    newButton.value = player;
    newButton.innerHTML = "X";

    newListItem.appendChild(newButton);
    newButton.addEventListener("click", function () {
      this.parentElement.remove();
      document.getElementById("foutmelding").innerHTML = "";

      localStorage.removeItem(this.value);
    });
    newListItem.classList.add("player");

    if (!(player in items)) {
      if (Object.values(items).length <= 3) {
        localStorage.setItem(player, player);
        document.getElementById("players").append(newListItem);
        document.getElementById("foutmelding").innerHTML = "";
      } else {
        document.getElementById("foutmelding").innerHTML =
          "Voeg maximaal 4 spelers toe";
      }
    } else {
      document.getElementById("foutmelding").innerHTML = "Naam moet uniek zijn";
    }

    document.getElementById("nameInput").value = "";
  }
}

function clearLocalStorage() {
  localStorage.clear();
}

function StartButtonClick() {
  const items2 = { ...localStorage };
  if (Object.keys(items2).length >= 2 && Object.keys(items2).length <= 4) {
    window.location.href = "../HTML/PlayScreen.html";
  } else if (Object.keys(items2).length < 2) {
    document.getElementById("foutmelding").innerHTML =
      "Voeg minimaal 2 spelers toe";
    console.log(items2);
  }
}

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

// pas dit aan zodat je ander scherm kan zien
let loggedin = true;


function check_if_logged_in() {
  if (loggedin) {
    document.getElementById("profile_overlay").style.display = "flex";
  }
  else {
    document.getElementById("login_overlay").style.display = "flex";
  }
}

function close_overlay(page) {
  document.getElementById(page).style.display = "none";
}