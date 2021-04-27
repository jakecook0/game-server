MyGame.screens['high-scores'] = (function(game, model) {
  'use strict';

  function initialize() {
    document.getElementById('high-score-menu').addEventListener(
      'click',
      function() { game.showScreen('main-menu'); }
    );
  }

  function run() {
    //load highscores from persistent storage
    model.reportScore();
  }

  return {
    initialize: initialize,
    run: run
  };

}(MyGame.game, MyGame.gamemodel));
