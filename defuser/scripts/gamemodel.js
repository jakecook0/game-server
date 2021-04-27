MyGame.gamemodel = (function (game, input, storage, graphics, objects) {
    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();
    let cancelNextRequest = true;
    let level = 6;  // add by 3 to max of 12 --> 3 levels total;
    let score = 0;
    let pause = false;
    let displayscore = false;
    let countingDown = true;
    let gameover = false;

    function initialize() {
        //initialize all gamestate code here -- call from gameplay init
        objects.manager.initLevel(level);

        myKeyboard.register('Escape', function () {
            cancelNextRequest = true;
            game.showScreen('main-menu');
            pause = true;
        });
        document.addEventListener('click', function (e) {
            // check for click inside any known bomb area
            for (let bomb in objects.objs) {
                let ob = objects.objs[bomb]
                if (e.offsetX < (ob.center.x + ob.size.width / 2) && e.offsetX > ob.center.x - ob.size.width / 2) {
                    if (e.offsetY < (ob.center.y + ob.size.height / 2) && e.offsetY > (ob.center.y - ob.size.height / 2)) {
                        ob.wasClicked();
                        score += Math.ceil(ob.time);
                    }
                }
            }
            // console.log(e);
        })
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        // myMouse.update(elapsedTime);
    }

    function update(elapsedTime) {
        // update each bomb -> logic in bomb's update()
        //TODO: if all objects clicked, start next level, else stop and show game over text
        if (gameover) { // do no updating
            storage.saveScore(score);
            return;
        }

        let all = true;
        for (let o in objects.objs) {
            if (!objects.objs[o].clicked) {
                all = false;
            }
            if (objects.objs[o].exploded) {
                gameover = true;
                score -= 3;
            }
        }
        if (all) {

            if (level >= 15) {
                pause = true;
                displayscore = true;
                // storage.saveScore(score);   // TODO: ensure scores are saved
            }

            if (objects.countdown.time == 3 && !pause) {
                level += 3;
                countingDown = true;
                objects.objs = [];
                objects.manager.initLevel(level);
            }
            console.log('leve', level);
            console.log(objects.countdown.time);

        }
        if (objects.countdown.time <= 0) {
            countingDown = false;
            objects.countdown.time = 3;
        }
        if (!pause && !countingDown) {
            objects.hud.update(elapsedTime, score);
        }

        if (countingDown) {
            objects.countdown.update(elapsedTime);
        }

        objects.manager.update(elapsedTime, countingDown);
    }

    function render() {
        // renders each bomb/overlay -> logic in bomb render()
        graphics.clear();
        if (countingDown) {
            objects.countdown.render();
        }
        objects.hud.render();
        objects.manager.renderBombs();
    }

    return {
        initialize: initialize,
        processInput: processInput,
        update: update,
        render: render,
        get cancelNextRequest() { return cancelNextRequest; },
        set cancelNextRequest(bool) { cancelNextRequest = bool; },
        set pause(bool) { pause = bool },

    }

}(MyGame.game, MyGame.input, MyGame.storage, MyGame.graphics, MyGame.objects));