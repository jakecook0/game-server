MyGame.screens['settings'] = (function(game, model) {
  'use strict';

  function initialize() {
    //register back button
    document.getElementById('settings-menu').addEventListener(
      'click',
      function() { game.showScreen('main-menu') }
    )
  }

  function run() {
    // display bound keys
    model.reportKeys();
    //add listeners to all items in div ''
  }

  return {
    initialize: initialize,
    run: run
  };

}(MyGame.game, MyGame.gamemodel))
