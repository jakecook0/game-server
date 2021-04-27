// The rendering processor for all particles
MyGame.render.particleSystem = (function (graphics) {
    'use strict';

    function render(particle) {
        graphics.drawRectangle(particle);
    }

    return {
        render: render,
    }

}(MyGame.graphics));