MyGame.gamemodel = (function (game, input, storage, graphics, objects, renderer, systems) {
    let myKeyboard = input.Keyboard();
    // let myMouse = input.Mouse();
    let cancelNextRequest = true;

    // gameplay items
    let lives = 3;
    let level = 1;
    let wasReset = true;
    let visitedRows = [650];   // holds the rows that have been scored
    let score = 0;
    let homeHit = false;
    let filledHome = false;

    let deathObj = renderer.Obstacles({
        spriteSheet: 'assets/sprites/dead.png',
        direction: 1,
        moveRate: 0,     // negative value if moving right to left (even rows, 12, 10, 8)
        center: { x: 0, y: 0 },
        size: { width: graphics.canvas.width / 16, height: graphics.canvas.height / 14 },
        rotation: -Math.PI / 2,
        imageScale: 1,
        canFrog: false,
        shouldRender: false,
    }, graphics);

    function pause() {  // keyboard function
        cancelNextRequest = true;
        game.showScreen('main-menu');
        objects.audiomanager.stopGameMusic();
    };

    let KEYFUNCTION_LOOKUP = {};

    function initialize() {
        //initialize all gamestate code here -- call from gameplay init

        //TODO:
        // load audio files
        objects.audiomanager.init();

        objects.objs.player = objects.Frog({
            center: { x: graphics.canvas.width / 2, y: graphics.canvas.height - (graphics.canvas.height / 14) },
            size: { width: graphics.canvas.width / 16, height: graphics.canvas.height / 14 },
            onMoving: false,
            died: false,
            timeLastJump: 0,
            rotation: Math.PI,
            moveRate: 0.5,
            home: false,
        });
        objects.objs.playerRender = renderer.AnimatedModel({
            spriteSheet: 'assets/sprites/frog-3.png',
            spriteCount: 7,
            // spriteTime: Array(7).fill(objects.objs.player.moveRate / 7),
            spriteTime: [0.01, 0.03, 0.07, 0.24, 0.07, 0.03, 0.01],
            animationTime: 0,
            // subStartX: 0,
            offset: 0,
        }, graphics);

        KEYFUNCTION_LOOKUP = { // gets the plaintext name of the key function for the settings screen
            'moveLeft': { desc: 'Move Left', func: objects.objs.player.moveLeft },
            'moveRight': { desc: 'Move Right', func: objects.objs.player.moveRight },
            'moveForward': { desc: 'Move Forward', func: objects.objs.player.moveForward },
            'moveBackward': { desc: 'Move Backward', func: objects.objs.player.moveBackward },
            'pause': { desc: 'Pause Game / Menu', func: pause },
        };

        objects.manager.init();

        // save/load all keys to/from persistent storage
        let inputs = storage.getKeys();
        if (inputs !== null) {
            // load keys from storage, register to keyboard
            console.log('LOADING KEYS FROM FILE');
            // storage.registerKeys(myKeyboard);
            let tmpkeyreg = storage.getKeys()
            console.log(tmpkeyreg);
            for (let k in tmpkeyreg) {
                myKeyboard.register(k, KEYFUNCTION_LOOKUP[tmpkeyreg[k]['functionName']].func);
            }
        }
        else {
            myKeyboard.register('ArrowLeft', objects.objs.player.moveLeft);
            myKeyboard.register('ArrowRight', objects.objs.player.moveRight);
            myKeyboard.register('ArrowUp', objects.objs.player.moveForward);
            myKeyboard.register('ArrowDown', objects.objs.player.moveBackward);
            myKeyboard.register('Escape', pause);
            storage.saveKeys(myKeyboard);
        }
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        // myMouse.update(elapsedTime);
    }

    function update(elapsedTime) {
        updateScore();

        if (wasReset) objects.Countdown.update(elapsedTime);
        // update timers
        if (!wasReset) {  // update countdown timer after round start
            objects.Timer.update(elapsedTime);
            objects.objs.player.freeze = false;
        }
        if (wasReset && objects.Countdown.state.time > 0) {
            deathObj.shouldRender = true;
            objects.objs.player.freeze = true;
        }

        // check if time ran out
        if (objects.Timer.timeOut()) {
            objects.audiomanager.frogRoad()
            objects.objs.player.died = true;
            // resetThings();
        }

        // update player frog
        objects.objs.player.update(elapsedTime);    // updates the jump rate
        if (objects.objs.player.isJumping) {    // run jump animation
            objects.audiomanager.frogJump();
            objects.objs.player.jump(elapsedTime);
            objects.objs.playerRender.update(elapsedTime);    // update player/frog sprite --> only applies if mid-jump (jump seq is short)
        } else {
            // objects.audiomanager.frogPause();
            objects.objs.playerRender.subImageIndex = 0;    // resets image if under/over jumped image index
        }

        // Spawn any new obstacles, update all obstacles, delete offscreen obstacles
        objects.spawner.run(elapsedTime);
        objects.movement.run(elapsedTime);

        // add a new frog if at home
        objects.manager.addHomeFrog();

        // if (objects.objs.player.died) { deathObj.shouldRender = true; }

        // If frog dies, render death image in place of the frog
        if (objects.objs.player.died) {
            lives -= 1;
            deathObj.center = objects.objs.player.center;
            deathObj.shouldRender = true;
            // play appropriate sound
            if (objects.objs.player.center.y < graphics.canvas.height / 2) { objects.audiomanager.frogWater(); }
            else {
                objects.audiomanager.frogRoad();
                systems.ParticleSystem.squished({ init: true, center: objects.objs.player.center, doRender: false });
            };
            resetThings();
        }
        if (objects.objs.player.home) { // got to an empty home
            homeHit = true;
            objects.audiomanager.frogHome();
            systems.ParticleSystem.home({ init: true, center: objects.objs.player.center, doRender: false });
            resetThings();
        }

        deathObj.update(elapsedTime);
        // updateScore();

        if (lives == 0) {   // out of lives
            // get user's name
            let username = getUsername();
            // save score to persistent storage
            storage.saveScore(score, username);
            // kick back to high scores menu
            cancelNextRequest = true;
            game.showScreen('high-scores')
            // objects.audiomanager.startGameMusic();
        }
        objects.lives.remainingLives = lives;
        systems.ParticleSystem.home({ elapsedTime: elapsedTime, init: false, doRender: false });
        systems.ParticleSystem.squished({ elapsedTime: elapsedTime, init: false, doRender: false });

    }

    function render() {
        // renders homefrogs only for now
        objects.manager.renderAll(deathObj);
        systems.ParticleSystem.home({ doRender: true });
        systems.ParticleSystem.squished({ doRender: true });

        // text visuals
        if (!wasReset) { objects.Timer.render(); }
        // render countdown timer of new
        if (wasReset && objects.Countdown.state.time > 0) objects.Countdown.render();
        else {
            wasReset = false;
            objects.Countdown.state.time = 3;
        }

        objects.score.render();
        objects.lives.render();
    }

    function resetThings(countdownTime = 3) {
        wasReset = true;
        objects.Timer.resetTimer();
        objects.Countdown.state.time = countdownTime;
        objects.manager.resetFrog();
        visitedRows = [650];
        if (objects.objs.homeFrogs.length == 5) {
            objects.objs.homeFrogs = [];
            resetHomes();
        }
    }

    function updateScore() {
        if (homeHit) {
            score += Math.ceil((graphics.canvas.width - objects.Timer.state.center.x) * (2 / 3) / 10) * 10; // remaining time reward
            score += 50; // player home
            homeHit = false;
        }
        if (objects.objs.player.center.y % (graphics.canvas.height / 14) == 0 && !visitedRows.includes(objects.objs.player.center.y)) {
            visitedRows.push(objects.objs.player.center.y);
            score += 10;
        }
        if (filledHome) { score += 1000; level += 1 }  // all frogs home
        // update score on score text object
        filledHome = false;
        objects.score.updateScore(score);
    }

    function startAudio() {
        objects.audiomanager.startGameMusic();
    }

    function getUsername() {
        let basic = "User " + Math.ceil(Math.random() * 100);
        let username = window.prompt("GAME OVER! Enter your name: ", basic);
        if (username == null || username == '') {
            return basic
        } else {
            return username;
        }
    }

    function resetGame() {
        // deathObj.shouldRender = false;
        deathObj.center = { x: -deathObj.size.width, y: 0 };
        lives = 3;
        score = 0;
        resetThings(5);
        myKeyboard.keys = {};
        objects.objs.homeFrogs = [];
        objects.lives.remainingLives = 3;
        resetHomes();
    }

    function resetHomes() {
        for (let x in objects.objs.homes.filled) {  // reset if homes pads are filled
            objects.objs.homes.filled[x] = false;
        }
    }

    return {
        initialize: initialize,
        processInput: processInput,
        update: update,
        render: render,
        startAudio: startAudio,
        resetGame: resetGame,
        get cancelNextRequest() { return cancelNextRequest; },
        set cancelNextRequest(bool) { cancelNextRequest = bool; },
        get myKeyboard() { return myKeyboard; },
        get KEYFUNCTION_LOOKUP() { return KEYFUNCTION_LOOKUP; },
    }

}(MyGame.game, MyGame.input, MyGame.storage, MyGame.graphics, MyGame.objects, MyGame.render, MyGame.systems));