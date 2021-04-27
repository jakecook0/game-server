MyGame.screens['high-scores'] = (function (game, model, storage) {
  'use strict';

  function initialize() {
    document.getElementById('high-score-menu').addEventListener(
      'click',
      function () { game.showScreen('main-menu'); }
    );
  }

  function run() {
    //load highscores from persistent storage
    let scores = storage.getScore();
    // add scores to screen
    let htmlNode = document.getElementById('score-vals');
    htmlNode.innerHTML = '';
    if (scores == null) {
      htmlNode.innerHTML = 'NO HIGHSCORES SAVED';
    }
    else {
      for (let key in scores) {
        htmlNode.innerHTML += ('' + key + ': ' + scores[key] + '<br>');
      }
    }
  }

  return {
    initialize: initialize,
    run: run
  };

}(MyGame.game, MyGame.gamemodel, MyGame.storage));
