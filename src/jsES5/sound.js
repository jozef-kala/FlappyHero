'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sound = function () {
    function Sound() {
        _classCallCheck(this, Sound);

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.connect(this.audioCtx.destination);
        this.gainNode.gain.value = 0.5;
    }

    _createClass(Sound, [{
        key: 'score',
        value: function score() {
            this.createSound([300], [0.05]);
        }
    }, {
        key: 'start',
        value: function start() {
            this.createSound([200, 300], [0.1, 0.3]);
        }
    }, {
        key: 'hit',
        value: function hit() {
            this.createSound([200], [0.1]);
        }
    }, {
        key: 'gameOver',
        value: function gameOver() {
            var notes = [300, 150, 100]; // value in hertz
            var times = [0.3, 0.3, 0.4]; //in seconds
            var soundType = 'sawtooth'; //' sine', 'wave', 'square', 'sawtooth', 'triangle' and 'custom'
            this.createSound(notes, times, soundType);

            this.createSound([400, 250, 300], [0.3, 0.3, 0.4], 'triangle');
        }
    }, {
        key: 'createSound',
        value: function createSound(notes, times) {
            var _this = this;

            var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sawtooth';

            var oscillators = [];

            notes.forEach(function (note, index) {
                var oscillator = _this.audioCtx.createOscillator();
              	oscillator.connect(_this.gainNode);
                oscillator.type = type;
                oscillator.frequency.value = note;
                oscillator.onended = _this.playNote.bind(_this, index + 1, oscillators, times);
                oscillators.push(oscillator);
            });
            this.playNote(0, oscillators, times);
        }
    }, {
        key: 'playNote',
        value: function playNote(index, oscillators, times) {
            if (index < oscillators.length) {
                oscillators[index].start();
                oscillators[index].stop(this.audioCtx.currentTime + times[index]);
            }
        }
    }]);

    return Sound;
}();