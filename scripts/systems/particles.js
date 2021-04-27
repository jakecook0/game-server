// Is the object that handles creates, updates, removals

MyGame.systems.ParticleSystem = (function (renderer) {
    'use strict';

    const NUM_PARTICLES = 50;
    let particles = [];

    let types = {
        'home': { 'fillColor': 'rgba(255,255,0,1)' },
        'car': { 'fillColor': 'rgba(180,0,0,1' }
    }

    let box = {
        size: { width: 3, height: 3 },
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(0, 0, 0, 1)',    // black
        center: {
            x: 400,
            y: 350,
        },
        scale: 1,
        time: 5,
    };

    // creates a single particle
    function createParticle(spec) {
        // let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
            center: { x: spec.x, y: spec.y },
            size: { width: 5, height: 5 },  // Making square particles
            direction: Random.nextCircleVector(),
            speed: Random.nextRange(8, 12), // pixels per second
            rotation: Math.PI * Random.nextDouble(),
            rotation: 0,
            // lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
            lifetime: 2,
            alive: 0    // How long the particle has been alive, in seconds
        }
        p.center.x += p.speed * p.direction.x * 1.6;
        p.center.y += p.speed * p.direction.y * 1.6;

        return p;
    }

    //------------------------------------------------------------------
    //
    // Update the state of all particles.  This includes removing any that have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        if (particles.length == 0) {
            return;
        }

        let removeMe = [];
        elapsedTime = elapsedTime / 1000;

        particles.forEach(particle => {
            // Update how long it has been alive
            particle.alive += elapsedTime;

            // Update its center
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            // Rotate proportional to its speed
            particle.rotation += particle.speed / 500;

            // If the lifetime has expired, identify it for removal

            if (particle.alive > particle.lifetime) {
                removeMe.push(particles);
            }
        });

        // Remove all of the expired particles
        if (removeMe.length > 0) {
            particles = [];
        }
        removeMe = [];
    }

    // runs all particles if hit by car at deathObj's location
    function squished(spec) {
        if (spec.init) {
            particles = [];
            box.fillStyle = types['car'].fillColor;
            box.center = spec.center;    // TODO: ensure homePad is being passed in correctly
            for (let x = 0; x < NUM_PARTICLES; x++) {
                particles[x] = createParticle(box.center);
            }
            return;
        }

        // renderEverything
        if (!spec.doRender) {
            update(spec.elapsedTime);    // update all particles, removing expired
        } else {
            if (particles.length == 0) { return; }
            particles.forEach(p => {
                box.center = p.center;
                renderer.particleSystem.render(box);
            });
        }
    }

    // Runs all particles for homes
    // args: homePad is the lilypad object that was hit
    function home(spec) {
        // change boxes color for type of particle
        if (spec.init) {
            particles = [];
            box.fillStyle = types['home'].fillColor;
            box.center = spec.center;    // TODO: ensure homePad is being passed in correctly
            for (let x = 0; x < NUM_PARTICLES; x++) {
                particles[x] = createParticle(box.center);
            }
            return;
        }

        // renderEverything
        if (!spec.doRender) {
            update(spec.elapsedTime);    // update all particles, removing expired
        } else {
            if (particles.length == 0) { return; }
            particles.forEach(p => {
                box.center = p.center;
                renderer.particleSystem.render(box);
            });
        }
    }

    let api = {
        home: home,
        squished: squished,
        update: update,
    }

    return api;

}(MyGame.render));