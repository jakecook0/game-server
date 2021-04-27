// creates the Lander object with state managing functions

// spec = {
//   imageSrc: image_path,
//   center: {x: val, y: val},
//   size: { width: val, height: val },
//   thrustForce: val
//   rotateRate: val
//   }

MyGame.objects.Lander = function(spec) {
  'use strict';

  // let rotation = -Math.PI / 2;
  let isReady = false;
  let image = new Image();
  // let speed = 0;
  let freeze = false;

  image.onload = function() {
    console.log('Lander image loaded');
    isReady = true;
  };
  image.src = spec.imageSrc;

  function rotateLeft(elapsedTime) {
    if (freeze) { return; }
    spec.rotation += (spec.rotateRate * (Math.PI / elapsedTime));
    if (spec.rotation + Math.PI / 2 > 2 * Math.PI) spec.rotation = spec.rotation - 2 * Math.PI;
  }

  function rotateRight(elapsedTime) {
    if (freeze) { return; }
    spec.rotation -= (spec.rotateRate * (Math.PI / elapsedTime));
    // console.log(spec.rotation + Math.PI / 2);
    if (spec.rotation + Math.PI / 2 < -2 * Math.PI) spec.rotation = spec.rotation + 2 * Math.PI;
  }

  // perform thrust in direction of rotation
  // should update vehicle speed
  function thrust(elapsedTime) {
    // console.log(spec.fuel);
    if (freeze || spec.fuel == 0) { return; }
    // spec.firing = true;
    spec.fuel = (spec.fuel - elapsedTime / 1000);
    if (spec.fuel < 0) spec.fuel = 0;
    let rotVector = { x: Math.cos(spec.rotation), y: Math.sin(spec.rotation) };
    spec.momentum.x -= rotVector.x * spec.thrustForce * elapsedTime;
    spec.momentum.y += rotVector.y * spec.thrustForce * elapsedTime;
  }

  let api = {
    rotateLeft: rotateLeft,
    rotateRight: rotateRight,
    thrust: thrust,
    get rotation() { return spec.rotation; },
    set rotation(newRot) { spec.rotation = newRot; },
    get center() { return spec.center; },
    set center(newCenter) { spec.center = newCenter; },
    get size() { return spec.size; },
    get image() { return image },
    get isReady() { return isReady; },
    get speed() { return spec.speed; },
    set speed(newSpeed) { spec.speed = newSpeed; },
    get fuel() { return spec.fuel; },
    set fuel(newFuel) { spec.fuel = newFuel; },
    get freeze() { return freeze; },
    set freeze(bool) { freeze = bool; },
    get gravityConst() { return spec.gravityConst; },
    get momentum() { return spec.momentum; },
    set momentum(newMoment) { spec.momentum = newMoment; },
    get firing() { return spec.firing; },
    set firing(stat) { spec.firing = stat; },
    //Other getters for object specs
  }

  return api;

}
