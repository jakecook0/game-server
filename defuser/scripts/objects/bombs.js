// Obj:
// obj = {
//     bombImg: '/path', //TODO: include dimensions for each img
//     timeImg: 'time.png',
//   N  checkMark: 'checkmark.png',
//     time: 3,    // randomly assigned time to start on bomb (updates/counts down)
//     row: 0,     // the row to render the bomb to (3 per row, up to 4 rows)
//  N   clicked: false, // if clicked, stop counting, render checkmark
// }

let timeLUT = {
    9: 'assets/glass_numbers_9.png',
    8: 'assets/glass_numbers_8.png',
    7: 'assets/glass_numbers_7.png',
    6: 'assets/glass_numbers_6.png',
    5: 'assets/glass_numbers_5.png',
    4: 'assets/glass_numbers_4.png',
    3: 'assets/glass_numbers_3.png',
    2: 'assets/glass_numbers_2.png',
    1: 'assets/glass_numbers_1.png',
    0: 'assets/glass_numbers_0.png',
}
MyGame.objects.Bombs = function (obj, graphics, objects) {
    'use strict';


    let imageReady = false;
    let image = new Image();
    let clicked = false;
    let exploded = false;
    let scored = false;

    let explosion = objects.Explosion({
        center: {},
        size: {},
    }, graphics);
    let checkmark = objects.Checkmark({
        center: {},
        size: {},
    }, graphics);

    image.onload = function () {
        imageReady = true;
    };
    image.src = obj.bombImg;

    function wasClicked() {
        // add checkmark
        if (exploded || clicked) {
            return;   // cannot click if exploded
        }
        clicked = true;
        checkmark.size = obj.overlay.size;
        checkmark.center = obj.overlay.center;
        obj.overlay = checkmark;
    }

    function update(elapsedTime) {
        // updates the time on the bomb (changes render character)
        obj.time -= elapsedTime / 1000; //TODO: change from time in seconds
        // update timer overlay
        if (exploded || clicked) {
            return;
        }
        else if (obj.time <= 0) {
            exploded = true;
            // set explosion to render
            explosion.center = obj.center;
            explosion.size = obj.size;
        } else {
            obj.overlay.update(obj.time);   // updates timer
        }
    }

    function render() {
        // draw primary object, overlay if not exploded (check or time)
        if (exploded) {
            explosion.render();
        }
        else {
            if (imageReady) {
                graphics.drawTexture(image, obj.center, Math.PI / 4, obj.size);
            }
            // console.log(obj.overlay.image.src);
            if (clicked || !exploded) { obj.overlay.render(); } // show bomb's timer
        }
    }

    let api = {
        update: update,
        render: render,
        wasClicked: wasClicked,
        get timeLUT() { return timeLUT; },
        get exploded() { return exploded; },
        get clicked() { return clicked; },
        get time() { return obj.time; },
        // remove:
        get center() { return obj.center; },
        get size() { return obj.size; },
        set scored(s) { scored = s; },
    }

    return api;
}