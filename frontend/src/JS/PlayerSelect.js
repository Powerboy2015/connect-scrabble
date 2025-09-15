const items = { ...localStorage };
console.log(items);
let player = 0;
function PlayerSelect() {
  for (i in items) {
    player++;
    console.log(i);
    console.log(`player${player}`);
    document.getElementById(`player${player}`).innerHTML = i;
  }
}
