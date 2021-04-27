MyGame.screens['main-menu'] = (function (game) {

  function initialize() {

    //setup listeners on each button
    document.getElementById('id-new-game').addEventListener(
      'click',
      function () {
        game.showScreen('game-play');
      });
    document.getElementById('id-high-scores').addEventListener(
      'click',
      function () { game.showScreen('high-scores'); });
    document.getElementById('id-help-about').addEventListener(
      'click',
      function () { game.showScreen('help-about'); });
    // document.getElementById('main-menu').classList.add('active');
  }

  function run() {
    // empty as nothing to run on this page
  }

  return {
    initialize: initialize,
    run: run
  };

}(MyGame.game));
