class Obstacle {

    constructor(config, ctx) {
        this.config = config;
        this.ctx = ctx;
        this.width =  this.config.obstacle.width;
        this.minSpace = this.config.obstacle.minSpace;
        this.maxSpace= this.config.obstacle.maxSpace;

        this.score = 0;
        this.scored = false;

        this.reset(); //generate obstacle
    }

    update (modifier, updateScore) {
        let {x, width, config} = this;
        this.x = x - (this.config.obstacle.speed / modifier);
        if (this.x + width < 0) {
            this.reset();
        }

        if(this.x + width < config.flappy.position && !this.scored) {
            updateScore();
            this.scored = true;
        }
    }

    reset () {
        let {config} = this;
        let space = this.getRandomInt (config.obstacle.minSpace, config.obstacle.maxSpace);
        this.x = config.width + config.width / 2;
        this.top = this.getRandomInt (0, config.height - space);
        this.bottom = this.top + space;
        this.scored = false;
    }

    setPosition(x) {
      this.x = x;
    }

    draw () {
        let {x, top, bottom, width, ctx} = this;
        ctx.fillStyle = '#75672e';
        ctx.rect(x, 0, width, top);
        ctx.rect(x, bottom, width, this.config.height);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}