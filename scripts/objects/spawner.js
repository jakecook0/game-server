// manages the spawn rates of objects
// removes objects if offscreen
// runs updates on objects (called into object.manager)
MyGame.objects.spawner = (function name(objects) {
    let carSpawnRates = {
        'sports': { rate: 4, row: 10, lastSpawn: 4, rotation: Math.PI / 2, direction: -1 },
        'police': { rate: 3, row: 12, lastSpawn: 3, rotation: Math.PI / 2, direction: -1 },
        'sedan': { rate: 4, row: 8, lastSpawn: 4, rotation: Math.PI / 2, direction: -1 },
        'firetruck': { rate: 9, row: 11, lastSpawn: 9, rotation: -Math.PI / 2, direction: 1 },
        'semi': { rate: 9, row: 9, lastSpawn: 9, rotation: -Math.PI / 2, direction: 1 },
    }
    let floatSpawnRates = {
        'long': { row: 4, rate: 2.7, lastSpawn: 4, direction: 1 },
        'medium': { row: 2, rate: 4, lastSpawn: 4, direction: 1 },
        'short': { row: 5, rate: 4, lastSpawn: 4, direction: 1 },
        'turtle3': { row: 6, rate: 4, lastSpawn: 4, direction: -1 },
        'turtle2': { row: 3, rate: 5, lastSpawn: 5, direction: -1 },
    }

    // runs all updating activites: spawning/removing if needed, updating
    function run(elapsedTime) {
        // remove any vehicles offscreen
        // spawn vehicles if spawnTime hit
        // update positions on everything
        spawn(elapsedTime);
        remove();
        update(elapsedTime);
    }

    function spawn(elapsedTime) {
        for (let carType in carSpawnRates) {
            let item = carSpawnRates[carType];

            if (item.lastSpawn >= item.rate) {
                objects.manager.genCar(carType, item);
                item.lastSpawn = 0;
            } else {
                item.lastSpawn += elapsedTime / 1000;
            }
        }
        for (let floatType in floatSpawnRates) {
            let item = floatSpawnRates[floatType];
            let rotation = floatSpawnRates[floatType].direction == -1 ? Math.PI / 2 : -Math.PI / 2;
            if (item.lastSpawn > item.rate) {
                objects.manager.genFloat(floatType, item.row, item.origin, rotation);
                item.lastSpawn = 0;
            } else {
                item.lastSpawn += elapsedTime / 1000;
            }
        }
    }

    function remove() {
        for (let type in objects.objs.cars) {
            if (objects.objs.cars[type].length !== 0) {
                if (objects.objs.cars[type][0].direction == -1) {
                    if (objects.objs.cars[type][0].center.x <= objects.objs.cars[type][0].deleteX) {
                        objects.objs.cars[type].shift();
                    }
                } else {
                    if (objects.objs.cars[type][0].center.x >= objects.objs.cars[type][0].deleteX) {
                        objects.objs.cars[type].shift();
                    }
                }
            }
        }
        for (let type in objects.objs.floats) {
            let removed = false;
            let cat = objects.objs.floats[type];

            if (cat.length !== 0 && !type.includes('Render')) {   // skip renderers
                if (cat[0].direction == -1) {    // - dir, obj center < (0 + imgwidth/2)
                    if (cat[0].center.x <= cat[0].deleteX) {
                        cat.shift();
                        removed = true;
                    }
                } else {
                    if (cat[0].center.x >= cat[0].deleteX) {
                        cat.shift();
                        removed = true;
                    }
                }
            }
            if (type == 'turtle' && removed) {
                objects.objs.floats.turtleRender.shift();
            }
        }
        // TODO: remove turtles
    }

    function update(elapsedTime) {
        // car updates
        for (let type in objects.objs.cars) {   // update for each car type
            if (objects.objs.cars[type].length !== 0) {    // if no cars, skip
                objects.objs.cars[type].forEach(car => {
                    car.update(elapsedTime);
                });
            }
        }
        // update all water objects
        for (let type in objects.objs.floats) {
            let x = objects.objs.floats[type];
            if (x.length !== 0) {
                for (let item in x) {
                    if (type.includes('turtle')) {  // if updating turtles, update the animation renderer as well
                        x[item].update(elapsedTime);
                        // objects.objs.floats.turtleRender[item].update(elapsedTime);
                    } else {
                        x[item].update(elapsedTime);    // update logs
                    }
                }
                objects.objs.floats[type].forEach(obj => {
                    obj.update(elapsedTime);
                });
            }
        }

    }


    return {
        run: run,
    }


}(MyGame.objects));