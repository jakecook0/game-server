MyGame.render.Terrain = (function(graphics) {
  'use strict';

  function render(spec) {
    // graphics.drawTerrain(spec.points);
    graphics.drawTerrain(spec.terrainShape);
  }

  // function saveTerrain(spec) {
  //   graphics.saveTerrain(spec.points);
  // }

  return {
    render: render,
    // saveTerrain: saveTerrain,
  };

}(MyGame.graphics));
