MyGame.objects.movement = (function (graphics, objects) {
    'use strict';

    // runs collisions detection: on moving object, killed, border hit, home reached
    function run(elapsedTime) {
        // check if player intersects with an object, or not (if in water rows, 6-1)
        // if intersects, determine action -> ride with, squished, drown, home
        detectCollision(elapsedTime);

    }

    // returns true if a collision has occured
    function detectCollision(elapsedTime) {
        let player = objects.objs.player;
        let rowheight = graphics.canvas.height / 14;
        let saferows = [rowheight * 13, rowheight * 7];

        if (hitBorder()) {
            player.died = true;
            return;
        }
        // console.log('No border hit');

        if (saferows.indexOf(player.center.y) !== -1) {   // player in safe zone
            // break, player in safe zone
            return;
        } else if (player.center.y > graphics.canvas.height / 2) { // player in road area
            // TODO: optimize by checking only against cars in the row (known from LUT)
            for (let obj in objects.objs.cars) {
                objects.objs.cars[obj].forEach(car => {
                    if (isCollision(player, car, 0, 10)) {
                        // console.log('Setting player to dead 1');
                        player.died = true;
                        return;
                    }
                });
            }
        }
        else if (player.center.y == graphics.canvas.height / 14) {   // player at home row
            // check that character is in a home position, else dies
            // if (player.center.x in homeslots & homeslot not full) {}
            // check if on home, with some leniency, TODO: check leniency
            let homely = objects.objs.homes;
            let colWidth = graphics.canvas.width / 16;
            for (let i in homely.cols) {
                // if frog is within the bounds of the home pad (with a margin of error)
                if (player.center.x <= homely.cols[i] * colWidth + colWidth * 0.3 &&
                    player.center.x >= homely.cols[i] * colWidth - colWidth * 0.3) {

                    if (homely.filled[i]) {
                        // console.log('frog in home but already filled');
                        player.dead = true;
                        return;
                    }

                    player.center.x = homely.cols[i] * colWidth;
                    player.home = true;
                    homely.filled[i] = true;
                    // console.log('Frog hit empty home!');
                    return;
                }
            }
            // missed home (fell in water <(-_-)>)
            // console.log('DEAD missed home pad');
            player.died = true;
            return;
        } else if ([1, 2, 3, 4, 5, 6, 7].indexOf(player.center.y / rowheight) !== -1) {    // player in water area
            // if 'collision' with object, move with obj
            // else die
            let safe = false;
            for (let obj in objects.objs.floats) {
                if (obj.includes('turtleRender')) continue;
                else {
                    objects.objs.floats[obj].forEach(float => {
                        if (isCollision(player, float, -25, 25)) {
                            // player safe, move palyer with obj
                            if (float.direction == -1) {
                                let rendItem = objects.objs.floats.turtleRender[objects.objs.floats.turtle.indexOf(float)];
                                if (rendItem.isUnderwater()) {   // if object is "underwater", player should die
                                    objects.objs.player.died = true;
                                    return;
                                }
                            }
                            safe = true;
                            objects.objs.player.updatePosition(elapsedTime, float);
                            return;
                        }
                    });
                }
            }
            if (!safe) {
                player.died = true;
                return;
            }
        }
    }

    // returns true if hit a border
    function hitBorder() {
        let player = objects.objs.player;
        if ((player.center.x + player.size.width / 2) >= graphics.canvas.width) {
            player.center.x = graphics.canvas.width - player.size.width - 10;
            player.died = true;
            // console.log('right Border hit!');
        }
        else if (player.center.x - player.size.width / 2 <= 0) {
            player.center.x = player.size.width + 10;
            player.died = true;
            // console.log('left Border hit!');
        }
        else if (player.center.y >= graphics.canvas.height) {
            player.center.y = graphics.canvas.height - player.size.height;
            player.died = true;
            // console.log('bottom Border hit!');
        }
    }

    // returns true if collided with deadly object
    function isCollision(player, objSpec, adj1, adj2) {
        let playerPos = player.center.x + player.size.width / 2 - adj1;
        let playerNeg = player.center.x - player.size.width / 2 + adj2;

        if (player.center.y == objSpec.center.y) {   // if player is in same row
            if (playerPos > (objSpec.center.x - objSpec.size.width / 2) && playerNeg > (objSpec.center.x + objSpec.size.width / 2)) {
                return false;   // player between cars
            } else if (playerPos < (objSpec.center.x + objSpec.size.width / 2) && playerNeg < (objSpec.center.x - objSpec.size.width / 2)) {
                return false;   // player between cars
            }
            else {
                return true;
            }
        }
    }

    return {
        run: run,
    }


}(MyGame.graphics, MyGame.objects));