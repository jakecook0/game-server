MyGame.graphics = (function() {
  'use strict';

  let canvas = document.getElementById('game-canvas');
  let context = canvas.getContext('2d');

  let terrain;

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

  // function saveTerrain(points) {
  //   terrain = new Path2D(); // clear out old terrain
  //   terrain.moveTo(0, canvas.height);
  //   // context.moveTo(points[0].x, points[0].y);
  //   for (let point = 0; point < points.length; point++) {
  //     terrain.lineTo(points[point].x, points[point].y);
  //   }
  //   terrain.lineTo(canvas.width, canvas.height);
  //   terrain.closePath();
  // }

  // draws the saved Path2D obj of terrain
  function drawTerrain(terrain) {
    context.save();
    context.strokeStyle = 'rgb(255,255,255)';
    context.lineWidth = 2;
    context.stroke(terrain);
    context.fillStyle = 'black';
    context.fill(terrain);
    context.restore();

  };

  let api = {
    get canvas() { return canvas; },
    clear: clear,
    drawTexture: drawTexture,
    drawText: drawText,
    drawBackground: drawBackground,
    drawTerrain: drawTerrain,
    // saveTerrain: saveTerrain,
  };

  return api;
}());
