MyGame.screens['game-play'] = (function (model) {
  //Gameplay logic and objects (created upon screen load)
  let lastTimeStamp = performance.now();

  //gameloop tools
  function processInput(elapsedTime) {
    model.processInput(elapsedTime);
  }

  function update(elapsedTime) {
    model.update(elapsedTime)
  }

  // render everything to screen
  function render() {
    model.render()
  }

  function gameLoop(time) {
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render();

    // allows creation of only one gameloop
    if (!model.cancelNextRequest) requestAnimationFrame(gameLoop);
  }

  function initialize() {
    model.initialize()
  }

  function run() {
    model.resetGame();
    lastTimeStamp = performance.now();
    model.cancelNextRequest = false;
    model.startAudio();
    // model.reset()
    // window.addEventListener('keyup', stops);
    // window.addEventListener('keydown', plays);

    requestAnimationFrame(gameLoop);
  }

  return {
    initialize: initialize,
    run: run,
  };

}(MyGame.gamemodel));
