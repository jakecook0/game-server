MyGame.render.Backgrounds = function (obj, graphics) {
    'use strict';

    // let subImageIndex = 0;
    // let subWidth = 0;
    let image = new Image();
    let isReady = false;  // Can't render until the texture is loaded
    let filled = false;

    // Load the texture to use for the particle system loading and ready for rendering
    image.onload = function () {
        // console.log('Image Loaded');
        isReady = true;
        obj.subWidth = image.width / obj.spriteCount - obj.offset;
    }
    image.src = obj.spriteSheet;

    function render() {
        // render image across whole row
        obj.rows.forEach(row => {
            for (let i = 0; i < graphics.canvas.width; i++) {
                graphics.drawSubTexture(image, obj.subImageIndex, obj.subWidth, { x: obj.size.width * i, y: graphics.canvas.height / 14 * row }, 0, obj.size, obj.subStartX);
            }
        });
    }

    // render lily pads in home row, evenly spaced columns
    function renderHomes() {
        // '5' is the number of home columns
        let cols = graphics.canvas.width / 5;
        // console.log(obj.colWidth);
        obj.cols.forEach(col => {
            graphics.drawTexture(image, { x: obj.colWidth * col, y: graphics.canvas.height / 14 }, 0, obj.size);
        });
    }

    let api = {
        render: render,
        renderHomes: renderHomes,
        get size() { return obj.size; },
        get filled() { return obj.filled; },
        set filled(f) { obj.filled = f; },
        get cols() { return obj.cols; },
    }

    return api;
}