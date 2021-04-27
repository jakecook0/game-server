// only one frog is ever in play, so keep in 

MyGame.objects.Turtle = function (obj) {
    'use strict';

    // let timeTilSink = Random.randomNumber(0.3, 0.99).toFixed(2); // the random variation in how long turtles stay above water before going underwater
    // let timeTilRise = Random.randomNumber(0.1, 0.99).toFixed(2);    // random time until resurfacing for group
    // let timings = Array(9).fill(obj.moveRate * 2);
    // timings[0] = timeTilSink;
    let reverse = false;
    let deleteX = -50; // TODO: update with better method

    function update(elapsedTime) {
        obj.center.x += obj.direction * obj.moveRate * elapsedTime;
    }

    let api = {
        update: update,
        get timings() { return obj.timings; },
        get reverse() { return reverse; },
        set reverse(bool) { reverse = bool; },
        get canFrog() { return obj.canFrog },
        get deleteX() { return deleteX; },
        get center() { return obj.center; },
        get size() { return obj.size; },
        get rotation() { return obj.rotation; },
        get moveRate() { return obj.moveRate; },
        get direction() { return obj.direction; },
    }

    return api;
}