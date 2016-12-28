"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Flappy = function () {
    function Flappy(config, ctx) {
        _classCallCheck(this, Flappy);

        this.config = config;
        this.ctx = ctx;

        this.width = config.flappy.width;
        this.height = config.flappy.height;

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

    _createClass(Flappy, [{
        key: "setMenuPositions",
        value: function setMenuPositions(menu, gameOver) {
            if (menu || gameOver) {
                this.x = this.config.width / 2 - this.width;
                this.y = this.config.height / 2 - this.height;
                if (gameOver) {
                    this.x = this.config.width / 3;
                }
                return;
            }
        }
    }, {
        key: "reset",
        value: function reset() {
            this.x = this.config.flappy.position;
            this.y = this.config.height / 2 - this.height / 2;
            this.boost = false;
        }
    }, {
        key: "setBoost",
        value: function setBoost(boost) {
            this.boost = boost;
        }
    }, {
        key: "anim",
        value: function anim() {
            this.frameInterval++;
            if (this.frameInterval > this.frameSpeed) {
                this.currentFrame++;
                if (this.currentFrame > 2) {
                    this.currentFrame = 0;
                }
                this.frameInterval = 0;
            }
        }
    }, {
        key: "update",
        value: function update(modifier, flappyOnTheGround, dying) {
            var boost = this.boost,
                config = this.config,
                width = this.width,
                height = this.height;

            var gravity = config.flappy.gravity;

            if (dying) {
                gravity = config.flappy.hitGravity;
            }

            if (boost) {
                this.y = this.y - config.flappy.boost / modifier;
                if (this.y < 0) {
                    this.y = 0;
                }
                this.rotate = 0.2;
            } else {
                this.y = this.y + gravity / modifier;
                if (this.y > config.height - height) {
                    flappyOnTheGround();
                }
                this.rotate = 0.4;
            }
        }
    }, {
        key: "draw",
        value: function draw() {
            var x = this.x,
                y = this.y,
                width = this.width,
                height = this.height,
                imageSize = this.imageSize,
                currentFrame = this.currentFrame,
                ctx = this.ctx;


            var rotate = this.y / 100;
            if (rotate > 0.1) rotate = 0.1;
            if (rotate < -0.1) rotate = -0.1;
            //this.rotate= this.rotate+rotate;

            ctx.save();
            ctx.translate(x, y);
            // ctx.rotate(90*Math.PI/180);
            ctx.rotate(this.rotate);
            ctx.drawImage(this.image, imageSize * currentFrame, 0, imageSize, imageSize, 0, 0, width, height);
            ctx.restore();
        }
    }]);

    return Flappy;
}();