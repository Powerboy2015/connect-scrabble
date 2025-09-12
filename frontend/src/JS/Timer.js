let IsActive = false;
function TimerStart() {
    if (IsActive){
        return;
    }
    let time = 15;
    countdown = setInterval(function(){
        IsActive = true;
        if (time > 0){
            document.getElementById("clock").innerHTML = time;
        }
        else {
            clearInterval(countdown);
            document.getElementById("clock").innerHTML = 0;
            IsActive = false;
        }
        time -= 1;
    }, 1000)
}
