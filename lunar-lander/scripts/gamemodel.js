// Manages the gamestate updates and related functions for system control
// Includes:
//    Physics updates
//    object movement/position changes not covered by object itself
MyGame.gamemodel = (function (objects, renderer, graphics, sounds) {
  'use strict';

  let canvas = document.getElementById('game-canvas');
  let exploded = false;
  let won = false;
  let registered = false;

  // safe landing parameters
  const safespeed = 2.0;
  const safeAngle = 5;

  // updates the gravity system/accel and lander position as enacted by update
  function gravity(elapsedTime, lander) {
    if (lander.freeze) { return; }
    lander.momentum.y += lander.gravityConst * elapsedTime;
  }

  // applies the movement to the lander
  // updates speed
  function moveLander(elapsedTime, lander) {
    // console.log(lander.momentum.y);
    if (lander.freeze) return;
    lander.center.x += lander.momentum.x;
    lander.center.y += lander.momentum.y;
    lander.speed = Math.abs(lander.momentum.y * 7.5);
  }

  // Reference: https://stackoverflow.com/questions/37224912/circle-line-segment-collision
  function lineCircleIntersection(pt1, pt2, circle) {
    let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
    let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
    let b = -2 * (v1.x * v2.x + v1.y * v2.y);
    let c = 2 * (v1.x * v1.x + v1.y * v1.y);
    let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
    if (isNaN(d)) { // no intercept
      return false;
    }
    // These represent the unit distance of point one and two on the line
    let u1 = (b - d) / c;
    let u2 = (b + d) / c;
    if (u1 <= 1 && u1 >= 0) { // If point on the line segment
      return true;
    }
    if (u2 <= 1 && u2 >= 0) { // If point on the line segment
      return true;
    }
    return false;
  }

  function checkCollision(lander, terrain) {
    if (lander.freeze) { return; }
    let circle = { center: { x: lander.center.x, y: lander.center.y }, radius: lander.size.width / 2 }
    for (let pt1 = 0; pt1 < terrain.points.length - 1; pt1++) {
      if (lineCircleIntersection(terrain.points[pt1], terrain.points[pt1 + 1], circle)) {
        lander.freeze = true; // game over
        console.log("EXPLODED :(");
        exploded = true;
      }
    }
  }

  function radToDeg(rad) {
    return (90 + rad * 180 / Math.PI);
  }

  // checks if lander is at the appropriate speed and at x,y position of lander
  function checkWin(platforms, lander) {
    if (lander.freeze) { return; }
    platforms.forEach((platform, i) => {
      if (platform.y == Math.floor(lander.center.y + lander.size.height / 2)) {
        if (Math.floor(lander.center.x) > platform.x1 && Math.floor(lander.center.x) < platform.x2) {
          // TODO: check that rotation is within ~1.4% of level
          console.log(radToDeg(lander.rotation))
          // console.log(radToDeg(lander.rotation) > (Math.PI - safeAngle));
          if (radToDeg(lander.rotation) > safeAngle || radToDeg(lander.rotation) < (Math.PI - safeAngle) || lander.speed > safespeed) {
            console.log("exploded");
            lander.freeze = true;
            exploded = true;
          } else {
            console.log("WON!");
            lander.freeze = true;
            won = true;

            // TODO: remove lowest score/only add if list not full or higher than existing
            // TODO: popup dialogue box for usernames (as keys)
            // Add score to persistent storage
            if (Object.keys(highScores).length > 5) {
              remove(Object.keys(highScores)[0]);
            }
            add('player' + Math.ceil(Random.nextDouble() * 27), lander.fuel.toFixed(2), 'scores');
          }
        }
      }
    });
  }

  //runs particles if exploded
  function runParticles(elapsedTime, particleFire) {
    if (exploded) {
      particleFire.update(elapsedTime);
      // renderer.Particles.render(particleFire);
    }
  }

  // run all lander updates
  function updateLander(elapsedTime, lander) {
    gravity(elapsedTime, lander);
    moveLander(elapsedTime, lander);
  }

  function updateHud(hudItems, lander) {
    //TODO: update fill color if values are within parameters
    hudItems.hudFuel.text = 'Fuel: ' + lander.fuel.toFixed(2) + ' s';
    hudItems.hudSpeed.text = 'Speed: ' + lander.speed.toFixed(2) + ' m/s';
    hudItems.hudAngle.text = 'Angle: ' + radToDeg(lander.rotation).toFixed(2) + ' deg';
    hudItems.hudFuel.fillStyle = (lander.fuel <= 0) ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 255, 0, 1)'
    hudItems.hudAngle.fillStyle = (radToDeg(lander.rotation) > safeAngle || radToDeg(lander.rotation) < (Math.PI - safeAngle)) ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 255, 0, 1)';
    hudItems.hudSpeed.fillStyle = (lander.speed > safespeed) ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 255, 0, 1)';
  }

  function updateCountdown(elapsedTime, countdown) {
    countdown.num = countdown.num - elapsedTime / 1000; //convert elapsed time to seconds
    if (countdown.num < 2) countdown.text = 'Next Round in 2';
    if (countdown.num < 1) countdown.text = 'Next Round in 1';
    if (countdown.num < 0) countdown.text = 'Next Round in 0';
  }

  let explAudio = true;
  let landedAudio = true;


  // window.addEventListener('keyup', function() { sounds.pauseSound('thrust') });
  // window.addEventListener('keydown', function() { sounds.playSound('thrust') });

  function playSound(lander) {
    // if (lander.firing) {
    //   sounds.playSound('thrust');
    // }
    if (exploded && explAudio) {
      // lander.firing = false;
      sounds.playSound('explosion');
      explAudio = false;
    }
    if (won && landedAudio) {
      // lander.firing = false;
      sounds.playSound('landed');
      landedAudio = false;
    }
  }

  // run all update functions
  function update(elapsedTime, lander, terrain, particleFire, hudItems, counterText) {
    runParticles(elapsedTime, particleFire);
    updateHud(hudItems, lander);
    checkWin(terrain.platforms, lander);
    checkCollision(lander, terrain);
    updateLander(elapsedTime, lander);
    // countdown and start new level
    if (won) { updateCountdown(elapsedTime, counterText); }
    if (counterText.num < -1) reset(lander, particleFire, terrain, counterText, 1);
    playSound(lander);
  }

  function render(lander, particleFire, gameOverText, wonText, hudItems, counterText) {
    Object.getOwnPropertyNames(hudItems).forEach(function (item) {
      renderer.Text.render(hudItems[item]);
    });

    if (!exploded) renderer.Lander.render(lander);
    if (exploded) renderer.Particles.render(particleFire);
    if (exploded) renderer.Text.render(gameOverText);
    if (won) renderer.Text.render(wonText);
    if (won) renderer.Text.render(counterText);
  }

  // reset everything for new level/new game
  function reset(landerObj, particleFire, terrainObj, counterText, pltfrms = 1) {
    // graphics.clear();
    landerObj.fuel = 15;
    landerObj.speed = 0;
    landerObj.rotation = -Math.PI / 2;
    landerObj.center = { x: canvas.width / 2, y: 100 };
    landerObj.freeze = false;
    landerObj.momentum = { x: 0, y: 0 };
    landerObj.firing = false;
    // reset particle effects to follow lander
    particleFire.center = landerObj.center;
    particleFire.timeRemaining = 0.8;
    won = false;
    exploded = false;
    // reset audio
    explAudio = true;
    landedAudio = true;
    // reset countdown transitioner
    counterText.num = 3;
    counterText.text = 'Next Round in 3';
    // build level's terrain
    terrainObj.buildTerrain(pltfrms, terrainObj.width); // clears pts, builds new pts, saves to terrainShape
  }

  // save keysbindings to persistent storage
  function registerKeys(keyboard) {
    if (registered) { return; }
    Object.getOwnPropertyNames(keyboard.handlers).forEach(function (key) {
      add(keyboard.handlers[key].name, key, 'controls');
    });
    // registered = true;
  }

  // ------ Persistent storage handler ------
  let highScores = {};
  let controls = {};
  let previousScores = localStorage.getItem('MyGame.highScores');
  let previousControls = localStorage.getItem('MyGame.controls');

  if (previousScores !== null) {
    highScores = JSON.parse(previousScores);
  }
  if (previousControls !== null) {
    controls = JSON.parse(previousControls);
  }

  function add(key, value, dir) {
    if (dir === 'scores') {
      highScores[key] = value;
      localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }
    if (dir === 'controls') {
      controls[key] = value;
      localStorage['MyGame.controls'] = JSON.stringify(controls);
    }
  }

  function remove(key) {
    delete highScores[key];
    localStorage['MyGame.highScores'] = JSON.stringify(highScores);
  }

  function reportScore() {
    let htmlNode = document.getElementById('score-vals');

    htmlNode.innerHTML = '';
    for (let key in highScores) {
      htmlNode.innerHTML += ('' + key + ': ' + highScores[key] + '<br/>');
    }
    // htmlNode.scrollTop = htmlNode.scrollHeight;
  }

  function reportKeys() {
    let list = document.getElementById('key-bindings');

    list.innerHTML = '';
    for (let key in controls) {
      var keybind = document.createElement('li');
      keybind.innerHTML = '' + key + ': ' + controls[key];
      //TODO:
      // let name = keybind.innerHTML.splice(":")[0];
      // onclick, add an input box inside with addEventListener for keyup
      // inputbox receives an input then removes eventlistener after keypress
      // restore name with new key

      keybind.onclick = function () { console.log("clicked"); };
      list.appendChild(keybind);
    }
    // htmlNode.scrollTop = htmlNode.scrollHeight;
  }

  return {
    update: update,
    render: render,
    reset: reset,
    // persistent storage functions
    add: add,
    remove: remove,
    reportScore: reportScore,
    reportKeys: reportKeys,
    registerKeys: registerKeys,
    get controls() { return controls; }
  };

}(MyGame.objects, MyGame.render, MyGame.graphics, MyGame.sounds));
