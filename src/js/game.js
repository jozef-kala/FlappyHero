class Game {
    constructor(config) {
        this.sound = new Sound();

        this.config = config;
        this.width = config.width;
        this.height = config.height;

        this.canvas = document.getElementById('canvas'),
        this.canvas.width = config.width;
        this.canvas.height = config.height;
        this.ctx = this.canvas.getContext('2d');

        this.lastUpdate = 0;
        this.score = 0;
        this.state = Object.freeze({GAME: 1, MENU: 2, DYING : 3, GAME_OVER: 4});
        this.gameState = this.state.MENU;
        this.allowRestart = true;
    }

    clear () {
        let {ctx, width, height} = this;
        ctx.fillStyle = '#94c0e6';
        ctx.fillRect(0, 0, width, height);
    }

    update (modifier) {
        let {flappy, ctx, state} = this;

        flappy.anim ();

        let menu =  this.isMenu();
        let gameOver = this.isGameOver();
        flappy.setMenuPositions(menu, gameOver);

        if( !menu && !gameOver) {
            this.flappy.update(modifier,
                () => { this.gameOver() },
                this.gameState === state.DYING
            );
        }

        if(this.isGame()) {
            this.obstacles.forEach((o)=> o.update(modifier,() => {
                this.score++;
                this.sound.score();
                }
            ));

            //check collisions
            this.obstacles.forEach((obs)=> {
                if(!(flappy.x >= obs.x + obs.width || obs.x >= flappy.x + flappy.width) &&
                    (flappy.y < obs.top || flappy.y + flappy.height > obs.bottom)) {
                    this.gameState = state.DYING;
                    this.sound.hit();
                }
            });
        }
    }

    draw () {
        let {ctx, score, width, height, config} = this;

        this.clear();

        // little grass
        ///ctx.fillStyle = 'green';
        //ctx.fillRect(0, height - 20, width, height);

        switch (this.gameState) {

            case this.state.GAME:
            case this.state.DYING:

                ctx.beginPath();
                this.obstacles.forEach((o)=> o.draw());
                ctx.closePath();
                ctx.fill();

                //current score
                ctx.fillStyle = '#eee';
                ctx.font = 'normal 30px verdena';
                ctx.fillText('Score: ' + score, width - 150, 20);
                break;

            case this.state.MENU:
            case this.state.GAME_OVER:

                let menuTitle = this.isGameOver() ? 'Game Over' : 'Flappy Hero';
                let tapText = this.isGameOver() ? 'Tap to restart...' : 'Tap to start!';

                ctx.beginPath();
                ctx.fillStyle = '#eee';
                ctx.rect(config.menu.left, config.menu.top, width - config.menu.left * 2, height-config.menu.top * 2);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = 'black';
                ctx.font = 'normal 40px verdena';
                ctx.textAlign = "center";
                ctx.textBaseline = "top"
                ctx.fillText(menuTitle, width/2 ,config.menu.top + 20);

                if (this.isGameOver()) {
                    ctx.fillStyle = '#888';
                    ctx.font = 'normal 30px verdena';
                    ctx.fillText('Score: ' + this.score, width/2 , height / 2 - 40);
                    ctx.fillStyle = 'lightgreen';
                    let best = localStorage.bestScore ? localStorage.bestScore : this.score;
                    ctx.fillText('Best score: ' + best, width/2 , height / 2);
                }

                ctx.fillStyle = '#888';
                ctx.font = 'normal 25px verdena';
                ctx.fillText(tapText, width/2 , height - config.menu.top * 2 +30);

                break;
        }
        this.flappy.draw();
    }

    render () {
      let now = Date.now(),
          delta = now - this.lastUpdate;
      this.lastUpdate = now;
      this.update(delta);
      this.draw();

      requestAnimationFrame(this.render.bind(this));
    }

    createGameElements () {
        let {config, ctx} = this;

        //obstacles
        let o1 = new Obstacle(config, ctx);
        let o2 = new Obstacle(config, ctx);
        let o3 = new Obstacle(config, ctx);

        o1.setPosition(config.width / 2);
        o2.setPosition(config.width);
        o3.setPosition(config.width + config.width / 2);

        this.obstacles = [o1, o2, o3];

        //flappy super hero
        this.flappy = new Flappy(config, ctx);
    }

    reset () {
        let {config, ctx, obstacles, flappy} = this;

        this.score = 0;

        obstacles.forEach((o)=> o.reset());
        obstacles[0].setPosition(config.width / 2);
        obstacles[1].setPosition(config.width);
        obstacles[2].setPosition(config.width + config.width / 2);

        flappy.reset();

        this.gameState = this.state.GAME;
        this.sound.start();
    }

    start () {
        this.createGameElements();
        new Events(this);
        this.render();
    }

    gameOver () {
        if (!localStorage.bestScore || this.score > localStorage.bestScore ){
            localStorage.bestScore = this.score;
        }
        this.gameState = this.state.GAME_OVER
        this.sound.gameOver();

        this.allowRestart = false;
        setTimeout(()=>{this.allowRestart = true} , 1000);
    }

    isGame(){
        return this.gameState === this.state.GAME;
    }

    isMenu(){
        return this.gameState === this.state.MENU;
    }

    isGameOver(){
        return this.gameState === this.state.GAME_OVER;
    }
}