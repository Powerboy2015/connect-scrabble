function PlayerSelect() {
  document.getElementById("player0").innerHTML =
    localStorage.getItem("player0");
  document.getElementById("player1").innerHTML =
    localStorage.getItem("player1");
  document.getElementById("player2").innerHTML =
    localStorage.getItem("player2");
  document.getElementById("player3").innerHTML =
    localStorage.getItem("player3");
}
