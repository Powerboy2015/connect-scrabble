function PlayerSelect() {
  for (let i = 0; i < 4; i++) {
    document.getElementById(`player${i}`).innerHTML = localStorage.getItem(
      `player${i}`
    );
  }
}
