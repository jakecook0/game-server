MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input, model, sounds) {
  //Gameplay logic and objects (created upon screen load)
  let lastTimeStamp = performance.now();
  let cancelNextRequest = true; //use to prevent multiple gameloops
  let maxGravity = 0.5 / 1000; // pixels per millisec
  let gravityConst = 0.1 / 1000; //pixels per millisec to subtract from speed

  //inputs
  let myKeyboard = input.Keyboard();
  let myMouse = input.Mouse();

  // game components (renderable objects)

  let terrainObj = objects.Terrain({
    platforms: 2,
    // TODO: make width fixed to lander
    canvas: graphics.canvas,
    width: (50 * 1.5) // TODO: change multiplier as a difficulty value every round
  });

  let backgroundImg = objects.Background({
    imageSrc: 'assets/images/cosmos.png',
    height: graphics.canvas.height,
    width: graphics.canvas.width,
  });

  let landerObj = objects.Lander({
    imageSrc: 'assets/images/lander-level.png',
    momentum: { x: 0, y: 0 },
    center: { x: graphics.canvas.width / 2, y: 100 }, //place to center of screen to start
    size: { width: 50, height: 50 },
    rotateRate: 100 / 1000, // pixels per millisecond
    thrustForce: 1 / 3000, // pixels per 3 millisecond?
    speed: 0, // updates based on "gravity" and thrust
    rotation: Math.PI / 2,
    gravityConst: gravityConst,
    maxGravity: maxGravity,
    fuel: 15 // second of fuel (20, TODO: adjust fuel amount)
    // Assign more object details (angle, vector, speed, etc)});
  });

  let particleFire = objects.Particles({
    center: landerObj.center,
    size: { mean: 10, stdev: 4 },
    speed: { mean: 50, stdev: 25 },
    lifetime: { mean: 4, stdev: 1 },
    imageSrc: 'assets/images/fire.png',
    rotation: 0,
    timeRemaining: 0.8, // num of seconds for effect to take place
  });

  let gameOverText = objects.Text({
    text: 'GAME OVER',
    font: '32pt Arial',
    fillStyle: 'rgba(255, 255, 255, 1)',
    strokeStyle: 'rgba(0, 0, 0, 1)',
    center: { x: graphics.canvas.width / 2 - (9 / 2 * 32), y: graphics.canvas.height / 2.5 } // adjusted to center
  });

  let wonText = objects.Text({
    text: 'THE EAGLE HAS LANDED',
    font: '32pt Arial',
    fillStyle: 'rgba(255, 255, 255, 1)',
    strokeStyle: 'rgba(0, 0, 0, 1)',
    center: { x: graphics.canvas.width / 2 - (17 / 2 * 32), y: graphics.canvas.height / 2.5 } // adjusted to center
  });

  let hudFuel = objects.Text({
    text: 'Fuel: ' + landerObj.fuel,
    font: '16pt Arial',
    fillStyle: 'rgba(0, 255, 0, 1)',
    strokeStyle: 'rgba(0, 0, 0, 1)',
    center: { x: graphics.canvas.width - (12 * 16), y: 80 }
  });

  let hudSpeed = objects.Text({
    text: 'Speed: ' + landerObj.speed,
    font: '16pt Arial',
    fillStyle: 'rgba(0, 255, 0, 1)',
    strokeStyle: 'rgba(0, 0, 0, 1)',
    center: { x: graphics.canvas.width - (12 * 16), y: 112 }
  });

  let hudAngle = objects.Text({
    text: 'Angle: ' + landerObj.rotation,
    font: '16pt Arial',
    fillStyle: 'rgba(0, 255, 0, 1)',
    strokeStyle: 'rgba(0, 0, 0, 1)',
    center: { x: graphics.canvas.width - (12 * 16), y: 144 }
  });

  let counterText = objects.Text({
    text: 'Next Round in 3',
    num: 3,
    font: '32pt Arial',
    fillStyle: 'rgba(255, 255, 255, 1)',
    strokeStyle: 'rgba(0, 0, 0, 1)',
    center: { x: graphics.canvas.width / 2 - (9 / 2 * 32), y: graphics.canvas.height / 3 } // adjusted to center
  });

  //gameloop tools
  function processInput(elapsedTime) {
    myKeyboard.update(elapsedTime);
    // myMouse.update(elapsedTime);
  }

  let fuel = 15;

  function update(elapsedTime) {
    // update lander specs not handled by buttons (i.e. gravity)
    fuel = landerObj.fuel;
    model.update(elapsedTime, landerObj, terrainObj, particleFire, { hudFuel: hudFuel, hudSpeed: hudSpeed, hudAngle: hudAngle }, counterText);
    // model.registerKeys(myKeyboard);
  }

  // render everything to screen
  function render() {
    graphics.clear();

    renderer.Background.render(backgroundImg);
    console.log();
    renderer.Terrain.render(terrainObj);
    // renderer.Lander.render(landerObj);
    // renderer.Particles.render(particleFire);
    model.render(landerObj, particleFire, gameOverText, wonText, { hudFuel: hudFuel, hudSpeed: hudSpeed, hudAngle: hudAngle }, counterText);
  }

  function gameLoop(time) {
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render();

    // allows creation of only one gameloop
    if (!cancelNextRequest) requestAnimationFrame(gameLoop);
  }

  function plays(landerObj) {
    if (!fuel == 0) sounds.playSound('thrust');
  }

  function stops(landerObj) {
    sounds.pauseSound('thrust');
  }

  function initialize() {
    //register initial controls
    myKeyboard.register('a', landerObj.rotateLeft);
    myKeyboard.register('d', landerObj.rotateRight);
    myKeyboard.register('w', landerObj.thrust);
    myKeyboard.register('Escape', function quit() {
      cancelNextRequest = true;
      game.showScreen('main-menu');
      particleFire.clearParticles();
      window.removeEventListener('keydown', plays);
    })
    model.registerKeys(myKeyboard);

    // save sound effects
    sounds.loadAudio('explosion', 'assets/audio/explosion.mp3', 0.8);
    sounds.loadAudio('landed', 'assets/audio/landed.mp3');
    sounds.loadAudio('thrust', 'assets/audio/rocket_engine.mp3', 0.3);

  }

  function run(level) {
    lastTimeStamp = performance.now();
    cancelNextRequest = false;

    model.reset(landerObj, particleFire, terrainObj, counterText, level);
    window.addEventListener('keyup', stops);
    window.addEventListener('keydown', plays);

    requestAnimationFrame(gameLoop);
  }

  return {
    initialize: initialize,
    run: run,
    // reset: reset,
  };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.gamemodel, MyGame.sounds));
