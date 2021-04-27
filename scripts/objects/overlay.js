MyGame.objects.Countdown = (function (graphics) {
    'use strict';

    let state = {
        text: 'Player in 5...',
        font: '32pt Arial',
        fillStyle: 'rgba(255, 120, 0, 1)',
        strokeStyle: 'rgba(0, 0, 0, 1)',
        center: {
            x: graphics.canvas.width / 3,
            y: graphics.canvas.height / 2 - 22,
        },
        time: 5,
    };

    function update(elapsedTime) {
        // count down timer
        state.time -= elapsedTime / 1000;
        if (state.time < 0) {
            state.text = 'Player in 0';
        }
        else {
            state.text = 'Player in ' + Math.ceil(state.time);
        }
    }

    function render() {
        graphics.drawText(state);
    }

    return {
        update: update,
        render: render,
        get state() { return state; },
        set state(s) { state = s; },
    }

}(MyGame.graphics));

MyGame.objects.Timer = (function (graphics) {
    'use strict';
    const TIME_MODIFIER = 4;
    let time = 30 // total time remaining in seconds
    let lastTime = 30

    let state = {
        size: { width: 2 * time * TIME_MODIFIER, height: 25 },
        fillStyle: 'rgba(255, 120, 0, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        center: {
            x: graphics.canvas.width - time * TIME_MODIFIER,       // center x is the right border of the rect
            y: graphics.canvas.height - 25,
        },
        scale: 2,
        time: 5,
    };

    function update(elapsedTime) {
        time -= elapsedTime / 1000;
        state.center.x += (lastTime - time) * TIME_MODIFIER;
        lastTime = time;
    }

    function render() {
        graphics.drawRectangle(state);
    }

    // returns if the "timer" is out
    function timeOut() {
        return state.center.x >= graphics.canvas.width;
    }

    function resetTimer() {
        time = 30;
        lastTime = 30;
        state.center.x = graphics.canvas.width - time * TIME_MODIFIER;
    }

    return {
        update: update,
        render: render,
        timeOut: timeOut,
        resetTimer: resetTimer,
        get state() { return state; },
        set state(s) { state = s; },
    }

}(MyGame.graphics));

MyGame.objects.score = (function (graphics) {
    'use strict';
    let state = {
        text: 'Score: 0',
        font: '16pt Arial',
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(0, 0, 0, 1)',
        center: {
            x: graphics.canvas.width / 2 - 45,
            y: 6,
        },
        score: 0,
    };

    function updateScore(score) {
        state.score = score;
        state.text = 'Score: ' + state.score;

    }

    function render() {
        graphics.drawText(state);
    }

    return {
        updateScore: updateScore,
        render: render,
        get state() { return state; },
    }

}(MyGame.graphics));

MyGame.objects.lives = (function (renderer, graphics) {
    'use strict';
    let frog = renderer.Obstacles({
        spriteSheet: 'assets/sprites/home-frog.png',
        direction: 1,
        moveRate: 0,     // negative value if moving right to left (even rows, 12, 10, 8)
        center: { x: 50, y: graphics.canvas.height - 20 },
        size: { width: 0, height: 0 },
        rotation: 0,
        imageScale: 0.5,
        canFrog: true,
    }, graphics);

    let remainingLives = 3;

    function render() {
        for (let x = 0; x < remainingLives; x++) {
            frog.center.x += 50;   // add lives next to eachother
            frog.render();
        }
        frog.center.x = 10;
    }

    return {
        render: render,
        get remainingLives() { return remainingLives; },
        set remainingLives(l) { remainingLives = l - 1; },
    }

}(MyGame.render, MyGame.graphics));