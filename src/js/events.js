class Events {
    constructor (game){
        this.game = game;

        let  canvas = document.getElementsByTagName('canvas')[0];

        //canvas.addEventListener('touchstart', this.touchStart.bind(this), false);
        canvas.addEventListener('mousedown', this.touchStart.bind(this), false);

        //canvas.addEventListener('touchend', this.touchEnd.bind(this), false);
        canvas.addEventListener('mouseup', this.touchEnd.bind(this), false);
    }

    touchStart (e) {
        e.preventDefault();
        clearInterval(this.clearTimer);

        if (this.game.isGame()){
            this.game.flappy.setBoost(true);

        } else if(this.game.isMenu() || this.game.isGameOver() ){
            if(this.game.allowRestart) {
               this.game.reset();
            }
        }

        this.clearTimer = setInterval(this.stopBoost.bind(this), 150);
    }

    touchEnd (e) {
        e.preventDefault();
        this.game.flappy.setBoost(false);
    }

    stopBoost () {
        this.game.flappy.setBoost(false);
    }
}