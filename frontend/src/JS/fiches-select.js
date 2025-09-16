
function PlayerSelect() {
  const fiches = document.querySelectorAll('#fiches .letter');

  fiches.forEach(fiche => {
    fiche.addEventListener('click', () => {
      
      fiches.forEach(f => f.classList.remove('selected'));
      fiche.classList.add('selected');
    });
  });
}

