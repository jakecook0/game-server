// game object holds all game data

MyGame.game = (function (screens) {
  'use strict';
  console.log('Game loaded');

  // Changes to a new active screens
  function showScreen(id) {
    // remove the active state screen (only 1 should exist)
    let active = document.getElementsByClassName('active');
    for (let screen = 0; screen < active.length; screen++) {
      active[screen].classList.remove('active');
    }

    // tell screen to run anything pertinent
    // all screens have a run() method
    screens[id].run(2);
    //set new screen as active
    document.getElementById(id).classList.add('active');
  }

  function initialize() {
    let screen = null;
    //initialize each screen
    for (screen in screens) { //screens from gamestate of index
      if (screens.hasOwnProperty(screen)) {
        screens[screen].initialize();
      }
    }


    // Display start screen
    showScreen('main-menu');
  }

  return {
    initialize: initialize,
    showScreen: showScreen
  };

}(MyGame.screens))
