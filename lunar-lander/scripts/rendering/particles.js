MyGame.render.Particles = (function(graphics) {
  'use strict';

  function render(spec) {
    if (spec.isReady) {
      Object.getOwnPropertyNames(spec.particles).forEach(function(value) {
        let particle = spec.particles[value];
        // console.log(particle);
        graphics.drawTexture(spec.image, particle.center, particle.rotation, particle.size);
      });

      // graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
    }
  }

  return { render: render, };

}(MyGame.graphics));
