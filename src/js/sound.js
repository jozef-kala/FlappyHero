class Sound {

    constructor(){
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.connect(this.audioCtx.destination);
        this.gainNode.gain.value = 0.5;
    }

    score () {
       this.createSound ([300], [0.05]);
    }

    start () {
       this.createSound ([200, 300 ], [0.1, 0.3]);
    }

    hit () {
       this.createSound ([200], [0.1]);
    }

    gameOver () {
        let notes = [300, 150,  100,]; // value in hertz
        let times = [0.3, 0.3,   0.4]; //in seconds
        let soundType = 'sawtooth'; //' sine', 'wave', 'square', 'sawtooth', 'triangle' and 'custom'
        this.createSound (notes, times, soundType);

        this.createSound ([400, 250, 300], [0.3, 0.3, 0.4], 'triangle');
    }

    createSound (notes, times, type = 'sawtooth') {
        let oscillators = [];

        notes.forEach((note, index) => {
            let oscillator = this.audioCtx.createOscillator();
            oscillator.connect(this.gainNode);
            oscillator.type = type;
            oscillator.frequency.value = note;
            oscillator.onended = this.playNote.bind(this, index + 1, oscillators, times);
            oscillators.push(oscillator);
        });
        this.playNote (0, oscillators, times);
    }

    playNote (index,oscillators, times) {
        if(index< oscillators.length ) {
            oscillators[index].start();
            oscillators[index].stop(this.audioCtx.currentTime + times[index]);
        }
    }
}