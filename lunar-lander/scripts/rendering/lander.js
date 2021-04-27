// Renders the lander image to the canvas

// spec = {
//   image: '<imgsrc>',
//   center: {x: <coord>, y: <coord>},
//   size: { width: <val>, height: <val> }
// }

MyGame.render.Lander = (function(graphics) {
  'use strict';

  function render(spec) {
    if (spec.isReady) {
      graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
    }
  }

  return { render: render };

}(MyGame.graphics));
