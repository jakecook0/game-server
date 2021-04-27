// --------------------------------------------------------------
//
// Renders an animated model based on a spritesheet.
//
// --------------------------------------------------------------
MyGame.render.AnimatedModel = function (spec, graphics) {
    'use strict';

    // let animationTime = 0;
    let subImageIndex = 0;
    let subWidth = 0;
    let image = new Image();
    let isReady = false;  // Can't render until the texture is loaded

    // Load the texture to use for the particle system loading and ready for rendering
    image.onload = function () {
        // console.log('Image Loaded');
        isReady = true;
        subWidth = image.width / spec.spriteCount - spec.offset;
    }
    image.src = spec.spriteSheet;

    //------------------------------------------------------------------
    //
    // Update the state of the animation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        spec.animationTime += elapsedTime;
        //
        // Check to see if we should update the animation frame
        if (spec.animationTime >= spec.spriteTime[subImageIndex]) {
            //
            // When switching sprites, keep the leftover time because
            // it needs to be accounted for the next sprite animation frame.
            spec.animationTime -= spec.spriteTime[subImageIndex];
            subImageIndex += 1;
            //
            // Wrap around from the last back to the first sprite as needed
            subImageIndex = subImageIndex % spec.spriteCount;
        }
    }

    //------------------------------------------------------------------
    //
    // Render the specific sub-texture animation frame
    //
    //------------------------------------------------------------------
    function render(model) {
        if (isReady) {
            graphics.drawSubTexture(image, subImageIndex, subWidth, model.center, model.rotation, model.size, spec.subStartX);
        }
    }

    let api = {
        update: update,
        render: render,
        get subWidth() { return subWidth; },
        get spriteTime() { return spec.spriteTime; },
        set subImageIndex(i) { subImageIndex = i; },
    };

    return api;
};
