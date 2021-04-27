// spec = {
//   image,
//   width,
//   height
// }

// Renders the background image for the game
MyGame.render.Background = (function(graphics) {
  'use strict';

  function render(spec) {
    if(spec.isReady) {
      graphics.drawBackground(spec.image, spec.width, spec.height);
    }
  }

  return { render: render };

}(MyGame.graphics));
