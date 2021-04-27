// handles all the object states
// Inits/generates all objects - frog(s), cars, floaters
// updates positional logic
// 

MyGame.objects.manager = (function (objects, renderer, graphics) {
    'use strict';
    let BACKGROUND_SPRITE_COUNT = 5;
    let carLUT = {
        'sports': { sprite: 'assets/sprites/sports-car.png', moverate: 1 / 9, screenoffset: 50 },
        'police': { sprite: 'assets/sprites/police-car.png', moverate: 1 / 11, screenoffset: 50 },
        'sedan': { sprite: 'assets/sprites/sedan.png', moverate: 1 / 14, screenoffset: 50 },
        'firetruck': { sprite: 'assets/sprites/firetruck.png', moverate: 1 / 20, screenoffset: -140 },
        'semi': { sprite: 'assets/sprites/semi.png', moverate: 1 / 25, screenoffset: -230 },
    };
    let floatLUT = {
        'short': { sprite: 'assets/sprites/short-log.png', screenoffset: -190, moverate: 1 / 23 },
        'medium': { sprite: 'assets/sprites/medium-log.png', screenoffset: -278, moverate: 1 / 20 },
        'long': { sprite: 'assets/sprites/long-log.png', screenoffset: -357, moverate: 1 / 13 },
        'turtle2': { sprite: 'assets/sprites/turtle.png', screenoffset: 0, moverate: 1 / 30 },
        'turtle3': { sprite: 'assets/sprites/turtle.png', screenoffset: 0, moverate: 1 / 19 },
        // TODO: Add alligators
    };

    // creates all the static elements (background tiles, lily pads) with appropriate positions
    function init() {
        // create one of each background object
        genBackground();
        genHomes();
    }

    // creates a car object at the starting position
    function genCar(carType, item) {
        // set object origin
        let x_origin = (item.direction == -1) ? graphics.canvas.width : 0;

        objects.objs.cars[carType].push(renderer.Obstacles({
            spriteSheet: carLUT[carType].sprite,
            direction: item.direction,
            moveRate: item.direction * carLUT[carType].moverate,     // negative value if moving right to left (even rows, 12, 10, 8)
            center: { x: x_origin + carLUT[carType].screenoffset, y: item.row * graphics.canvas.height / 14 },
            size: { width: 0, height: 0 },
            rotation: item.rotation,
            imageScale: 0.6,
            canFrog: false,
        }, graphics));
    }

    function genFloat(floatType, row, x_origin, rotation) {
        if (floatType.includes('turtle')) {
            let numToGen = (floatType.includes('2') ? 2 : 3);
            let timeTilSink = Random.randomNumber(2000, 30000).toFixed(2); // the random variation in how long turtles stay above water before going underwater
            let timeTilRise = Random.randomNumber(3000, 6000).toFixed(2);
            let timings = [parseFloat(timeTilSink), 1000, 1000, 1000, 1000, 500, 400, 400, parseFloat(timeTilRise)]

            for (let i = 0; i < numToGen; i++) {
                genTurtle(floatType, row, timings, i * 50);
            }
        } else {
            genLog(floatType, row, rotation);
        }
    }

    function genLog(floatType, row, rotation) {
        objects.objs.floats.log.push(renderer.Obstacles({
            spriteSheet: floatLUT[floatType].sprite,
            direction: 1,
            moveRate: floatLUT[floatType].moverate,     // negative value if moving right to left (even rows, 12, 10, 8)
            center: { x: floatLUT[floatType].screenoffset, y: row * graphics.canvas.height / 14 },
            size: { width: 0, height: 0 },
            rotation: rotation,
            imageScale: 0.8,
            canFrog: true,
        }, graphics));
    }

    function genTurtle(floatType, row, timings, x_shift) {
        // start position, move rate
        let turtleObj = objects.Turtle({
            spriteSheet: floatLUT[floatType].sprite,
            direction: -1,
            moveRate: floatLUT[floatType].moverate,     // negative value if moving right to left (even rows, 12, 10, 8)
            center: { x: graphics.canvas.width + floatLUT[floatType].screenoffset + x_shift, y: row * graphics.canvas.height / 14 },
            size: { width: graphics.canvas.width / 16, height: graphics.canvas.height / 14 },
            rotation: Math.PI,
            canFrog: true,
            timings: timings,
        }, graphics)

        objects.objs.floats.turtle.push(turtleObj);

        objects.objs.floats.turtleRender.push(renderer.AnimatedModel({
            spriteSheet: 'assets/sprites/turtle.png',
            spriteCount: 9,
            spriteTime: timings,
            animationTime: 0,
            // subStartX: 0,
            offset: -8,
        }, graphics));
    }

    // generates the image object of the roads and grass/safe areas
    // each are rendered multiple times for performance, rather than separate objs
    function genBackground() {
        // rows -> rows to render image in (full width), background renderer will handle this
        // size
        objects.objs.backgrounds.grass = renderer.Backgrounds({
            spriteSheet: 'assets/sprites/background_all.png',
            rows: [12.95, 6.95, 0],
            size: { width: objects.objs.player.size.width, height: objects.objs.player.size.height + 5 },
            subWidth: 0,
            subStartX: 14,
            offset: 3,
            subImageIndex: 0,
            spriteCount: BACKGROUND_SPRITE_COUNT,
        }, graphics);
        objects.objs.backgrounds.road = renderer.Backgrounds({
            spriteSheet: 'assets/sprites/background_all.png',
            rows: [11.88, 10.88, 9.88, 8.88, 7.88],
            size: { width: objects.objs.player.size.width, height: objects.objs.player.size.height + 12 },
            subWidth: 0,
            subStartX: 14,
            offset: 3,
            subImageIndex: 2,
            spriteCount: BACKGROUND_SPRITE_COUNT,
        }, graphics);
    }

    // generates lilypad object, rendered multiple times for performance
    function genHomes() {
        objects.objs.homes = renderer.Backgrounds({
            spriteSheet: 'assets/sprites/lily-pad.png',
            rows: 13,
            cols: [2, 5, 8, 11, 14],
            colWidth: objects.objs.player.size.width,
            size: { width: objects.objs.player.size.width, height: objects.objs.player.size.height },
            subWidth: 0,
            offset: 75, //offset here is used for column alignment
            spriteCount: 1,
            filled: { 2: false, 5: false, 8: false, 11: false, 14: false },
        }, graphics);
    }

    // checks if a new frog or death symbol needs to be rendered
    // if frog died, returns true to render dead symbol, else pushes a frog to the home pad that was landed on
    function addHomeFrog() {
        let player = objects.objs.player;
        if (player.home) {
            // push a new frog obj to homeFrogs
            objects.objs.homeFrogs.push(renderer.Obstacles({
                spriteSheet: 'assets/sprites/home-frog.png',
                direction: 1,
                moveRate: 0,     // negative value if moving right to left (even rows, 12, 10, 8)
                center: { x: player.center.x - player.size.width / 2, y: player.center.y },
                size: { width: player.size.width, height: player.size.height },
                rotation: -Math.PI / 2,
                imageScale: 1,
                canFrog: true,
            }, graphics));
        }
    }

    function renderAll(deathObj) {
        graphics.clear();

        // render backgrounds
        for (let bgimg in objects.objs.backgrounds) {
            objects.objs.backgrounds[bgimg].render();
        }
        objects.objs.homes.renderHomes(); // lilypads

        for (let frog in objects.objs.homeFrogs) {
            objects.objs.homeFrogs[frog].render();
        }

        // render logs
        objects.objs.floats.log.forEach(el => {
            el.render();
        });

        // render turtle
        for (let x in objects.objs.floats.turtle) {
            objects.objs.floats.turtleRender[x].render(objects.objs.floats.turtle[x]);
        }

        // render player or deathObj if died
        deathObj.render();
        objects.objs.playerRender.render(objects.objs.player);

        // render cars
        for (let type in objects.objs.cars) {
            objects.objs.cars[type].forEach(el => {
                el.render();
            });
        }

        objects.lives.render();
    }

    // moves frog to home, resets everything to default
    function resetFrog() {
        let player = objects.objs.player;
        player.center = { x: graphics.canvas.width / 2, y: graphics.canvas.height - (graphics.canvas.height / 14) };
        player.onMoving = false;
        player.died = false;
        player.timeLastJump = 0;
        player.rotation = Math.PI;
        player.home = false;
    }

    return {
        init: init,
        genCar: genCar,
        genFloat: genFloat,
        addHomeFrog: addHomeFrog,
        resetFrog: resetFrog,
        renderAll: renderAll,
    }

}(MyGame.objects, MyGame.render, MyGame.graphics));