MyGame.screens['settings'] = (function (game, model, storage) {
  'use strict';

  function initialize() {
    //register back button
    document.getElementById('settings-menu').addEventListener(
      'click',
      function () { game.showScreen('main-menu') }
    )
  }

  function run() {
    // display bound keys
    let storedKeys = storage.getKeys();
    let htmlNode = document.getElementById('key-bindings');
    // TODO: Add listeners to all keys to allow changing
    htmlNode.innerHTML = '';
    for (let key in storedKeys) {
      let btn = document.createElement("button");
      btn.innerHTML = key
      btn.type = 'button';
      btn.id = key;
      htmlNode.innerHTML += ('' + storedKeys[key]['desc'] + ': ');
      htmlNode.appendChild(btn);
      htmlNode.innerHTML += '<br>';
    }
    for (let key in storedKeys) {
      let n = document.getElementById(key);
      n.addEventListener('click', function () {
        model.myKeyboard.unregister(n.innerHTML);
        n.innerHTML = 'Press a key...';
        n.addEventListener('keydown', function (e) {
          n.innerHTML = e.key;
          model.myKeyboard.register(e.key, model.KEYFUNCTION_LOOKUP[storedKeys[key].functionName].func)
          storage.saveKeys(model.myKeyboard);
        });
      });
    }
  }

  return {
    initialize: initialize,
    run: run
  };

}(MyGame.game, MyGame.gamemodel, MyGame.storage))
