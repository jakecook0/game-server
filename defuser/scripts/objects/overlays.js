MyGame.objects.Explosion = function (obj, graphics) {
    let imageReady = false;
    let image = new Image();

    image.onload = function () {
        imageReady = true;
    };
    image.src = 'assets/Explosion.png';

    function render() {
        if (imageReady) graphics.drawTexture(image, obj.center, 0, obj.size);
    }

    return {
        render: render,
        get center() { return obj.center },
        get size() { return obj.size },
        set center(c) { obj.center = c },
        set size(s) { obj.size = s },
    }
}

MyGame.objects.Timer = function (obj, graphics) {
    let imageReady = false;
    let image = new Image();

    image.onload = function () {
        imageReady = true;
    };
    image.src = obj.imagesrc;

    function update(remaining) {
        let newTime = Math.floor(remaining);
        if (newTime < 0) {
            return;
        }
        let newsrc = timeLUT[newTime];
        if (obj.imagesrc == newsrc) {
            return;
        }
        obj.imagesrc = newsrc;

        imageReady = false;
        // console.log(newTime);
        // let img = new Image();
        image = new Image();
        image.onload = function () {
            imageReady = true;
        }
        image.src = newsrc;
    }

    function render() {
        if (imageReady) {
            graphics.drawTexture(image, obj.center, 0, obj.size);
        }
    }

    return {
        render: render,
        update: update,
        get imageReady() { return imageReady; },
        set imageReady(bool) { imageReady = bool; },
        get center() { return obj.center },
        get size() { return obj.size },
        get image() { return image }
    }
}

MyGame.objects.Checkmark = function (obj, graphics) {
    let imageReady = false;
    let image = new Image();

    image.onload = function () {
        imageReady = true;
    };
    image.src = 'assets/checkmark.png';

    function render() {
        graphics.drawTexture(image, obj.center, 0, obj.size);
    }

    function update(elapsedTime) {
        //does nothing
    }

    return {
        render: render,
        update: update,
        get center() { return obj.center },
        get size() { return obj.size },
        set center(c) { obj.center = c },
        set size(s) { obj.size = s },
    }
}