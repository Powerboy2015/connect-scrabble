import GameData from "./classes/GameData.js";

export function PlayerSelect2() {
  const fiches = document.querySelectorAll("#fiches .letter");

  // console.log(fiches);

  fiches.forEach((fiche) => {
    fiche.addEventListener("click", () => {
      fiches.forEach((f) => f.classList.remove("selected"));
      fiche.classList.add("selected");
      GameData.selectedLetter = fiche.textContent;
    });
  });
}
