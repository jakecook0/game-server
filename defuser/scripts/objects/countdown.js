MyGame.objects.countdown = (function (graphics) {

    let state = {
        text: 'Starting in 3',
        font: '32pt Arial',
        fillStyle: 'rgba(255, 120, 0, 1)',
        strokeStyle: 'rgba(0, 0, 0, 1)',
        center: {
            x: graphics.canvas.width / 3,
            y: 50,
        },
        time: 3,
    }
    let time = 3;


    function update(elapsedTime) {
        console.log(time);
        time -= elapsedTime / 1000;
        if (time < state.time - 1) {
            state.text = 'Starting in ' + Math.ceil(time),
                state.time = Math.ceil(time);
        }
    }

    function render() {
        graphics.drawText(state)
    }

    return {
        update: update,
        render: render,
        get time() { return time },
        set time(t) { time = t; },
    }


}(MyGame.graphics));

MyGame.objects.hud = (function (graphics) {
    let state = {
        text: 'Score: Time: ',
        font: '28pt Arial',
        fillStyle: 'rgba(0,0, 0, 1)',
        strokeStyle: 'rgba(0, 0, 0, 1)',
        center: {
            x: 25,
            y: 25,
        },
        time: 0,
    }
    let score = 0;

    function update(elapsedTime, score) {
        state.time += elapsedTime / 1000;
        score = score;
        state.text = 'Score: ' + score + ' Time:' + state.time.toFixed(2);
    }

    function render() {
        graphics.drawText(state);
    }

    return {
        update: update,
        render: render,
    }

}(MyGame.graphics));