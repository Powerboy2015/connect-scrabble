// selecteer de knop en het tekst-element
const Startbutton = document.getElementById('startbutton');
const spelerinfoelement = document.getElementById('spelerinfo');
let spelers = 2; // aantal spelers later veranderen naar dynamisch
if (spelers === 2 || spelers === 4) { //knop tonen
    Startbutton.style.display = 'block'; 
} else {
    Startbutton.style.display = 'none'
}

Startbutton.addEventListener('click',function(){
    console.log('Startknop is aangeklikt!')

alert ('het spel is gestart'); //na aanklikken startknop moet later weggehaald worden

});





