MyGame.objects.audiomanager = (function (objects) {
    'use strict';

    let sounds = {};

    function init() {
        loadAudio('jump', 'assets/audio/hop.wav');
        loadAudio('waterdeath', 'assets/audio/plunk.wav');
        loadAudio('roaddeath', 'assets/audio/squash.wav');
        loadAudio('home', 'assets/audio/extra.wav');
        loadAudio('game', 'assets/audio/frogger-theme.mp3', 0.1, true)
    }

    function loadAudio(soundname, sound, vol = 1.0, loop = false) {
        let s = new Audio();
        // s.isReady = false;
        s.volume = vol;
        s.src = sound;
        s.loop = loop
        sounds[soundname] = s;
    }

    function frogJump() {
        sounds.jump.currentTime = 0;
        sounds.jump.play();
    }

    function frogHome() {
        stopGameMusic();
        sounds.home.play();
        startGameMusic();
    }

    function frogWater() {
        sounds.waterdeath.currentTime = 0;
        sounds.waterdeath.play();
    }

    function frogRoad() {
        stopGameMusic();
        sounds.roaddeath.play();
        startGameMusic();
    }

    function startGameMusic() {
        loopbackground();
        sounds.game.play();
    }
    function stopGameMusic(params) {
        sounds.game.pause();
    }

    function loopbackground() {
        // loop the happy part of the music
        if (sounds.game.currentTime >= 5.947) {
            sounds.game.currentTime = 2.374
        }
    }

    let api = {
        init: init,
        frogJump: frogJump,
        frogWater: frogWater,
        frogRoad: frogRoad,
        frogHome: frogHome,
        startGameMusic: startGameMusic,
        stopGameMusic: stopGameMusic,
        loopbackground: loopbackground,
    }

    return api;

}(MyGame.objects));