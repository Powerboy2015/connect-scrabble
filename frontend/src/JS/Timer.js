import GameData from "./classes/GameData.js";

/**
 * A simple countdown timer class.
 * Can be started and stopped, and can call functions on each tick and on finish.
 * Default time is 15 seconds, but can be set in the constructor.
 */
export default class Timer {
    timer = 0;
    isRunning = false;
    TimeSec; //15 seconds
    intervalId = null;

    /** @type {(time: number) => void} */
    displayFunc = null;

        /** @type {() => void} */
    finishFunc = null;

    constructor(_TimerSec = 15) {
        this.TimeSec = _TimerSec;
    }


    /**
     *  Starts the timer, also fires the display function every second if set.
     * @returns {void}
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.timer = this.TimeSec;
        this.intervalId = setInterval(() => {

            // if a display function is set, call it with the current timer value.
            if (this.displayFunc){
                this.displayFunc(this.timer);
            }

            this.timer--;        
            if (this.timer < 0) {
                this.stop();

                // if a finish function is set, call it.
                if (this.finishFunc) {
                    this.finishFunc();
                }
            }

        }, 1000);
    }

    /**
     * Stops timer immediately and resets the timer to 0.
     */
    stop() {
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.timer = this.TimeSec
    }

    restart() {
        this.stop();
        document.getElementById("clock" + GameData.currentPlayer).style.display = "none";
        this.start();
    }

    /**
     * sets the function that will be called every second with the current time.
     * @param {(time: number) => void} func 
     */
    setDisplayFunction(func) {
        this.displayFunc = func;
    }

    /**
     * sets the function that will be called when the timer finishes.
     * @param {() => void} func 
     */
    setFinishFunction(func) {
        this.finishFunc = func;
    }
}