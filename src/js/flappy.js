class Flappy {

    constructor(config, ctx) {
        this.config = config;
        this.ctx = ctx;

        this.width =  config.flappy.width;
        this.height =  config.flappy.height;

        this.image = new Image();
        this.image.src = "sprites/flappy.png";
        //this.sprite.onload = updateProgress;

        this.imageSize = 230;

        this.currentFrame = 0;
        this.frameInterval = 0;
        this.frameSpeed = 10;

        this.reset();

        this.rotate = 0.4;
    }

    setMenuPositions(menu, gameOver) {
        if (menu || gameOver) {
            this.x = this.config.width/2 - this.width/2;
            this.y = this.config.height/2 - this.height/2;
            if(gameOver) {
                this.x = this.config.width / 3;
            }
            return;
        }
    }

    reset () {
        this.x = this.config.flappy.position;
        this.y = this.config.height / 2 - this.height / 2;
        this.boost = false;
    }

    setBoost (boost) {
        this.boost = boost;
    }

    anim () {
        this.frameInterval++;
        if (this.frameInterval > this.frameSpeed) {
            this.currentFrame++;
            if( this.currentFrame > 2) {
                this.currentFrame = 0 ;
            }
            this.frameInterval = 0;
        }
    }

    update (modifier, flappyOnTheGround, dying) {
        let {boost, config, width, height} = this;
        let gravity = config.flappy.gravity;


        if (dying) {
            gravity = config.flappy.hitGravity;
        }

        if (boost) {
            this.y = this.y - config.flappy.boost / modifier;
            if (this.y < 0) {
                this.y =0;
            }
            this.rotate = 0.2;
        } else {
            this.y = this.y + gravity / modifier;
            if ( this.y > config.height - height) {
              flappyOnTheGround();
            }
            this.rotate = 0.4;
        }
    }

    draw () {
        let {x, y, width, height, imageSize, currentFrame, ctx} = this;
        ctx.save();
        ctx.translate(  x,  y);
        ctx.rotate(this.rotate);
        ctx.drawImage(this.image, imageSize * currentFrame, 0,
            imageSize, imageSize,
            0, 0, width, height);
        ctx.restore();
    }
}
