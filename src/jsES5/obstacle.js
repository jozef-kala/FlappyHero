'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Obstacle = function () {
    function Obstacle(config, ctx) {
        _classCallCheck(this, Obstacle);

        this.config = config;
        this.ctx = ctx;
        this.width = this.config.obstacle.width;
        this.minSpace = this.config.obstacle.minSpace;
        this.maxSpace = this.config.obstacle.maxSpace;

        this.score = 0;
        this.scored = false;

        this.reset(); //generate obstacle
    }

    _createClass(Obstacle, [{
        key: 'update',
        value: function update(modifier, updateScore) {
            var x = this.x,
                width = this.width,
                config = this.config;

            this.x = x - this.config.obstacle.speed / modifier;
            if (this.x + width < 0) {
                this.reset();
            }

            if (this.x + width < config.flappy.position && !this.scored) {
                updateScore();
                this.scored = true;
            }
        }
    }, {
        key: 'reset',
        value: function reset() {
            var config = this.config;

            var space = this.getRandomInt(config.obstacle.minSpace, config.obstacle.maxSpace);
            this.x = config.width + config.width / 2;
            this.top = this.getRandomInt(0, config.height - space);
            this.bottom = this.top + space;
            this.scored = false;
        }
    }, {
        key: 'setPosition',
        value: function setPosition(x) {
            this.x = x;
        }
    }, {
        key: 'draw',
        value: function draw() {
            var x = this.x,
                top = this.top,
                bottom = this.bottom,
                width = this.width,
                ctx = this.ctx;

            ctx.fillStyle = '#75672e';
            ctx.rect(x, 0, width, top);
            ctx.rect(x, bottom, width, this.config.height);
        }
    }, {
        key: 'getRandomInt',
        value: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }]);

    return Obstacle;
}();