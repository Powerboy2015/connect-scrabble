function AddButton() {
  player = document.getElementById("nameInput").value;

  if (player !== "") {
    newListItem = document.createElement("li");
    newButton = document.createElement("button");
    newListItem.innerHTML = player;

    newListItem.appendChild(newButton);
    newButton.addEventListener("click", function () {
      this.parentElement.remove();
    });

    document.getElementById("players").append(newListItem);

    document.getElementById("nameInput").value = "";
  }
}
