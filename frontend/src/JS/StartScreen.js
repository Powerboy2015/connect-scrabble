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
