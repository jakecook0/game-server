MyGame.objects.Particles = function(spec) {
  'use strict';

  let image = new Image();
  let isReady = false;
  let nextName = 1;
  let particles = {};

  image.onload = function() {
    isReady = true;
  }
  image.src = spec.imageSrc;

  // CREDIT: @Dr Dean Mathias
  function create() {
    let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
    let particle = {
      center: { x: spec.center.x, y: spec.center.y },
      size: { width: size, height: size }, // Making square particles
      direction: Random.nextCircleVector(),
      speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
      rotation: 0,
      lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), // How long the particle should live, in seconds
      alive: 0 // How long the particle has been alive, in seconds
    };
    return particle;
  }

  function update(elapsedTime) {
    let removeMe = [];

    // We work with time in seconds, elapsedTime comes in as milliseconds
    elapsedTime = elapsedTime / 1000;
    spec.timeRemaining -= elapsedTime; //how long the exposion will last

    Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
      let particle = particles[value];

      // Update how long it has been alive
      particle.alive += elapsedTime;

      // Update its center
      particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
      particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

      // Rotate proportional to its speed
      particle.rotation += particle.speed / 500;

      // If the lifetime has expired, identify it for removal
      if (particle.alive > particle.lifetime) {
        removeMe.push(value);
      }
    });
    // Remove all of the expired particles
    for (let particle = 0; particle < removeMe.length; particle++) {
      delete particles[removeMe[particle]];
    }
    removeMe.length = 0;

    // Generate some new particles
    if (spec.timeRemaining > 0) {
      for (let particle = 0; particle < 1; particle++) {
        // Assign a unique name to each particle
        particles[nextName++] = create();
      }
    }
  }

  function clearParticles() {
    particles = {};
  }

  let api = {
    update: update,
    clearParticles: clearParticles,
    get particles() { return particles; },
    get image() { return image; },
    get isReady() { return isReady; },
    get size() { return spec.size; },
    get center() { return spec.center; },
    set center(newCenter) { spec.center = newCenter; },
    get rotation() { return spec.rotation; },
    get timeRemaining() { return spec.timeRemaining; },
    set timeRemaining(newt) { spec.timeRemaining = newt; },
    get speed() { return spec.speed; },
    get lifetime() { return spec.lifetime; },
  }

  return api;

}
