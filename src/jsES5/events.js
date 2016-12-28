'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = function () {
    function Events(game) {
        _classCallCheck(this, Events);

        this.game = game;

        var canvas = document.getElementsByTagName('canvas')[0];

        canvas.addEventListener('touchstart', this.touchStart.bind(this), false);
        canvas.addEventListener('mousedown', this.touchStart.bind(this), false);

        canvas.addEventListener('touchend', this.touchEnd.bind(this), false);
        canvas.addEventListener('mouseup', this.touchEnd.bind(this), false);
    }

    _createClass(Events, [{
        key: 'touchStart',
        value: function touchStart(e) {
            e.preventDefault();
            clearInterval(this.clearTimer);

            if (this.game.isGame()) {
                this.game.flappy.setBoost(true);
            } else if (this.game.isMenu() || this.game.isGameOver()) {
                if (this.game.allowRestart) {
                    this.game.reset();
                }
            }

            this.clearTimer = setInterval(this.stopBoost.bind(this), 150);
        }
    }, {
        key: 'touchEnd',
        value: function touchEnd(e) {
            e.preventDefault();
            this.game.flappy.setBoost(false);
        }
    }, {
        key: 'stopBoost',
        value: function stopBoost() {
            this.game.flappy.setBoost(false);
        }
    }]);

    return Events;
}();