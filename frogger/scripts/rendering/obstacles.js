MyGame.render.Obstacles = function (obj, graphics) {

    let image = new Image();
    let isReady = false;  // Can't render until the texture is loaded
    let renderTime = 2;

    // Load the texture to use for the particle system loading and ready for rendering
    image.onload = function () {
        // adjust spawn point to offscreen based on image size
        if (obj.center.x == 0) { obj.center.x -= image.width / 2; }
        else { obj.center.x += image.width / 2; }
        obj.size = { width: image.width * obj.imageScale, height: graphics.canvas.height / 14 };
        // determine the position at which to stop rendering the obj
        let border = (obj.direction == 1) ? graphics.canvas.width : 0;
        let deleteX = obj.direction * obj.size.width / 2 + border;
        obj.deleteX = deleteX;
        isReady = true;
    }
    image.src = obj.spriteSheet;

    function update(elapsedTime) {
        // update the time to show the item
        if (typeof obj.shouldRender !== "undefined" && obj.shouldRender) {
            renderTime -= elapsedTime / 100;
            if (renderTime <= 0) { obj.shouldRender = false; renderTime = 2; }
        } else {
            obj.center.x += obj.moveRate * elapsedTime;
        }
    }

    function render() {
        if (isReady) {
            if (typeof obj.shouldRender !== "undefined" && obj.shouldRender) {
                graphics.drawTexture(image, obj.center, obj.rotation, obj.size);
            } else if (typeof obj.shouldRender == "undefined") {
                graphics.drawTexture(image, obj.center, obj.rotation, obj.size);
            }
        }
    }

    let api = {
        render: render,
        update: update,
        get center() { return obj.center; },
        set center(c) { obj.center = c; },
        get deleteX() { return obj.deleteX; },
        get image() { return image; },
        get canFrog() { return obj.canFrog; },
        set size(s) { obj.size = s },
        get shouldRender() { return obj.shouldRender; },
        set shouldRender(bool) { obj.shouldRender = bool; },
        get renderTime() { return renderTime; },
        set renderTime(t) { renderTime = t; },
        //
        get moveRate() { return obj.moveRate; },
        get direction() { return obj.direction; },
        get size() { return obj.size; },
    }

    return api;

}