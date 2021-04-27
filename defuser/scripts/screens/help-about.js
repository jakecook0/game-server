MyGame.screens['help-about'] = (function(game) {
  'use strict';

  function initialize() {
    document.getElementById('help-about-menu').addEventListener(
      'click',
      function() { game.showScreen('main-menu'); }
    );
  }

  function run() {
    //intentionally left blank
    // no items to run upon displaying
  }

  return {
    initialize: initialize,
    run: run
  };

}(MyGame.game));
