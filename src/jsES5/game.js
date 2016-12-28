'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(config) {
        _classCallCheck(this, Game);

        this.sound = new Sound();

        this.config = config;
        this.width = config.width;
        this.height = config.height;

        this.canvas = document.createElement('canvas');
	this.canvas.id="canvas";
	document.body.appendChild(this.canvas);
         
        this.canvas.width = config.width;
        this.canvas.height = config.height;
        this.ctx = this.canvas.getContext('2d');

        this.lastUpdate = 0;
        this.score = 0;
        this.state = Object.freeze({ GAME: 1, MENU: 2, DYING: 3, GAME_OVER: 4 });
        this.gameState = this.state.MENU;
        this.allowRestart = true;
    }

    _createClass(Game, [{
        key: 'clear',
        value: function clear() {
            var ctx = this.ctx,
                width = this.width,
                height = this.height;

            ctx.fillStyle = '#94c0e6';
            ctx.fillRect(0, 0, width, height);
        }
    }, {
        key: 'update',
        value: function update(modifier) {
            var _this = this;

            var flappy = this.flappy,
                ctx = this.ctx,
                state = this.state;


            flappy.anim();

            var menu = this.isMenu();
            var gameOver = this.isGameOver();
            flappy.setMenuPositions(menu, gameOver);

            if (!menu && !gameOver) {
                this.flappy.update(modifier, function () {
                    _this.gameOver();
                }, this.gameState === state.DYING);
            }

            if (this.isGame()) {
                this.obstacles.forEach(function (o) {
                    return o.update(modifier, function () {
                        _this.score++;
                        _this.sound.score();
                    });
                });

                //check collisions
                this.obstacles.forEach(function (obs) {
                    if (!(flappy.x >= obs.x + obs.width || obs.x >= flappy.x + flappy.width) && (flappy.y < obs.top || flappy.y + flappy.height > obs.bottom)) {
                        _this.gameState = state.DYING;
                        _this.sound.hit();
                    }
                });
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var ctx = this.ctx,
                score = this.score,
                width = this.width,
                height = this.height,
                config = this.config;


            this.clear();

            // little grass
            //ctx.fillStyle = 'green';
            //ctx.fillRect(0, height - 20, width, height);

            switch (this.gameState) {

                case this.state.GAME:
                case this.state.DYING:

                    ctx.beginPath();
                    this.obstacles.forEach(function (o) {
                        return o.draw();
                    });
                    ctx.closePath();
                    ctx.fill();

                    //current score
                    ctx.fillStyle = '#eee';
                    ctx.font = 'normal 30px verdena';
                    ctx.fillText('Score: ' + score, width - 150, 20);
                    break;

                case this.state.MENU:
                case this.state.GAME_OVER:

                    var menuTitle = this.isGameOver() ? 'Game Over' : 'Flappy Hero';
                    var tapText = this.isGameOver() ? 'Tap to restart...' : 'Tap to start!';

                    ctx.beginPath();
                    ctx.fillStyle = '#eee';
                    ctx.rect(config.menu.left, config.menu.top, width - config.menu.left * 2, height - config.menu.top * 2);
                    ctx.closePath();
                    ctx.fill();

                    ctx.fillStyle = 'black';
                    ctx.font = 'normal 40px verdena';
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    ctx.fillText(menuTitle, width / 2, config.menu.top + 20);

                    if (this.isGameOver()) {
                        ctx.fillStyle = '#888';
                        ctx.font = 'normal 28px verdena';
                        ctx.fillText('Score: ' + this.score, width / 2, height / 2 - 30);
                        ctx.fillStyle = 'lightgreen';
                        var best = localStorage.bestScore ? localStorage.bestScore : this.score;
                        ctx.fillText('Best score: ' + best, width / 2, height / 2);
                    }

                    ctx.fillStyle = '#888';
                    ctx.font = 'normal 25px verdena';
                    ctx.fillText(tapText, width / 2, height - config.menu.top * 2 + 30);

                    break;
            }
            this.flappy.draw();
        }
    }, {
        key: 'render',
        value: function render() {
            var now = Date.now(),
                delta = now - this.lastUpdate;
            this.lastUpdate = now;
            this.update(delta);
            this.draw();

            requestAnimationFrame(this.render.bind(this));
        }
    }, {
        key: 'createGameElements',
        value: function createGameElements() {
            var config = this.config,
                ctx = this.ctx;

            //obstacles

            var o1 = new Obstacle(config, ctx);
            var o2 = new Obstacle(config, ctx);
            var o3 = new Obstacle(config, ctx);

            o1.setPosition(config.width / 2);
            o2.setPosition(config.width);
            o3.setPosition(config.width + config.width / 2);

            this.obstacles = [o1, o2, o3];

            //flappy super hero
            this.flappy = new Flappy(config, ctx);
        }
    }, {
        key: 'reset',
        value: function reset() {
            var config = this.config,
                ctx = this.ctx,
                obstacles = this.obstacles,
                flappy = this.flappy;


            this.score = 0;

            obstacles.forEach(function (o) {
                return o.reset();
            });
            obstacles[0].setPosition(config.width / 2);
            obstacles[1].setPosition(config.width);
            obstacles[2].setPosition(config.width + config.width / 2);

            flappy.reset();

            this.gameState = this.state.GAME;
            this.sound.start();
        }
    }, {
        key: 'start',
        value: function start() {
            this.createGameElements();
            new Events(this);
            this.render();
        }
    }, {
        key: 'gameOver',
        value: function gameOver() {
            var _this2 = this;

            if (!localStorage.bestScore || this.score > localStorage.bestScore) {
                localStorage.bestScore = this.score;
            }
            this.gameState = this.state.GAME_OVER;
            this.sound.gameOver();

            this.allowRestart = false;
            setTimeout(function () {
                _this2.allowRestart = true;
            }, 1000);
        }
    }, {
        key: 'isGame',
        value: function isGame() {
            return this.gameState === this.state.GAME;
        }
    }, {
        key: 'isMenu',
        value: function isMenu() {
            return this.gameState === this.state.MENU;
        }
    }, {
        key: 'isGameOver',
        value: function isGameOver() {
            return this.gameState === this.state.GAME_OVER;
        }
    }]);

    return Game;
}();