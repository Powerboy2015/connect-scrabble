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
      localStorage.setItem(player, player);
      document.getElementById("players").append(newListItem);
      document.getElementById("foutmelding").innerHTML = "";
    } else {
      console.log("moet uniek zijn");
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
      "voeg minimaal 2 spelers toe";
    console.log(items2);
  } else if (Object.keys(items2).length > 4) {
    document.getElementById("foutmelding").innerHTML =
      "voeg maximaal 4 spelers toe";
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
