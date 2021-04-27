MyGame.sounds = (function() {
  'use strict';

  let sounds = {};

  // loads a sound file into a soundname for reference
  function loadAudio(soundname, sound, vol = 1.0) {
    let s = new Audio();
    s.volume = vol;
    s.src = sound;
    sounds[soundname] = s;
    // sounds[soundname] = loadSound(sound);
  }

  function pauseSound(soundname) {
    sounds[soundname].pause();
  }

  function playSound(soundname) {
    sounds[soundname].play();
  }

  return {
    loadAudio: loadAudio,
    pauseSound: pauseSound,
    playSound: playSound,
    get sounds() { return sounds; },
  };

}());
