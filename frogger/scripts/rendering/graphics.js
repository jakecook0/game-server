MyGame.graphics = (function () {
  'use strict';

  let canvas = document.getElementById('game-canvas');
  let context = canvas.getContext('2d');

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  //credit @Dr Dean Mathias
  function drawTexture(image, center, rotation, size) {
    context.save();

    context.translate(center.x, center.y);
    context.rotate(-Math.PI / 2 - rotation);
    context.translate(-center.x, -center.y);

    context.drawImage(
      image,
      center.x - size.width / 2,
      center.y - size.height / 2,
      size.width, size.height);

    context.restore();
  }

  //credit @Dr Dean Mathias
  function drawText(spec) {
    context.save();

    context.font = spec.font;
    context.fillStyle = spec.fillStyle;
    context.strokeStyle = spec.strokeStyle;
    context.textBaseline = 'top';

    context.translate(spec.center.x, spec.center.y);
    context.rotate(spec.rotation);
    context.translate(-spec.center.x, -spec.center.y);


    context.fillText(spec.text, spec.center.x, spec.center.y);
    context.strokeText(spec.text, spec.center.x, spec.center.y);

    context.restore();
  }

  function drawBackground(image, width = 600, height = 600) {
    context.save();
    context.drawImage(image, 0, 0, width, height);
    context.restore();
  }

  function drawRectangle(spec) {
    context.save();

    context.translate(
      spec.center.x,
      spec.center.y + spec.size.height / 2);
    context.rotate(spec.rotation);
    context.translate(
      -(spec.center.x),
      -(spec.center.y + spec.size.height / 2));

    context.fillStyle = spec.fillStyle;
    context.fillRect(spec.center.x, spec.center.y, spec.size.width, spec.size.height);

    context.strokeStyle = spec.strokeStyle;
    context.strokeRect(spec.center.x, spec.center.y, spec.size.width, spec.size.height);

    context.restore();
  }

  // --------------------------------------------------------------
  //
  // Draws a sub-texture to the canvas with the following specification:
  //    image: Image
  //    index: index of sub-texture to draw
  //    subTextureWidth: pixel width of the sub-texture to draw
  //    center: {x: , y: }
  //    rotation: radians
  //    size: { x: , y: } // Size (in pixels) to render the sub-texture
  //
  // --------------------------------------------------------------
  function drawSubTexture(image, index, subWidth, center, rotation, size, subStartX = null) {
    context.save();
    if (subStartX == null) subStartX = 0;

    context.translate(center.x, center.y);
    context.rotate(rotation);
    context.translate(-center.x, -center.y);

    //
    // Pick the selected sprite from the sprite sheet to render
    context.drawImage(
      image,
      subStartX + subWidth * index, 0,      // Which sub-texture to pick out
      subWidth - subStartX, image.height,             // The size of the sub-texture
      center.x - size.width / 2,           // Where to draw the sub-texture
      center.y - size.width / 2,
      size.width, size.height);

    context.restore();
  }

  let api = {
    get canvas() { return canvas; },
    clear: clear,
    drawTexture: drawTexture,
    drawText: drawText,
    drawBackground: drawBackground,
    drawRectangle: drawRectangle,
    drawSubTexture: drawSubTexture,
  };

  return api;
}());
