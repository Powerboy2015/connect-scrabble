function AddButton() {
  player = document.getElementById("nameInput").value;
  let count = localStorage.length;

  if (player !== "") {
    newListItem = document.createElement("li");
    newButton = document.createElement("button");
    newListItem.innerHTML = player;
    newButton.value = count;
    newButton.innerHTML = "X";

    newListItem.appendChild(newButton);
    newButton.addEventListener("click", function () {
      this.parentElement.remove();
      localStorage.removeItem(`player${this.value}`);
    });
    newListItem.classList.add("player");

    document.getElementById("players").append(newListItem);

    localStorage.setItem(`player${count}`, player);

    document.getElementById("nameInput").value = "";
  }
}

function clearLocalStorage() {
  localStorage.clear();
}
