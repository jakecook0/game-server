// only one frog is ever in play, so keep in 

MyGame.objects.Frog = function (obj) {
    'use strict';

    // jump positions are time-independent
    const HORIZONTAL_JUMP = 50;    // num of pixels to jump
    const VERTICAL_JUMP = 50;
    const JUMP_RATE = 0.15; // Delay between jumps (s)
    const JUMP_DIST = 50;

    // object state
    // let center = { x: 0, y: 0 };
    // let onMoving = false;
    // let died = false;

    let isJumping = false;
    let freeze = false;
    let reverse = null;

    let jumpRate = 0;
    let jumpDir = ['y', '-'];
    let distanceJumped = 0;

    let lastElapsedTime = 0;

    function canJump() {
        // limits how often a player can jump
        if (isJumping || jumpRate < JUMP_RATE || obj.died || freeze) {
            return false
        }
        return true;
    }

    // runs the jump procedure for smooth jumps between spots
    function jump(elapsedTime) {
        if (distanceJumped < JUMP_DIST) {   // continue updating positiong
            let distadd = obj.moveRate * elapsedTime;
            distanceJumped += distadd;
            if (distanceJumped > JUMP_DIST) {
                distadd -= distanceJumped - JUMP_DIST;
            }
            // Move character
            if (jumpDir[1] == '-') {
                obj.center[jumpDir[0]] -= distadd;
            } else {
                obj.center[jumpDir[0]] += distadd;
            }
        } else {
            isJumping = false;
            distanceJumped = 0;
            jumpRate = 0;
        }
    }

    function moveLeft() {
        if (canJump()) {
            isJumping = true;
            obj.rotation = Math.PI / 2
            jumpDir = ['x', '-'];
        }
    }

    function moveRight() {
        if (canJump()) {
            isJumping = true;
            obj.rotation = - Math.PI / 2;
            jumpDir = ['x', '+'];
        }
    }

    function moveForward() {
        if (canJump()) {
            isJumping = true;
            obj.rotation = Math.PI;
            jumpDir = ['y', '-'];
        }
    }

    function moveBackward() {
        if (canJump()) {
            isJumping = true;
            obj.rotation = 0;
            jumpDir = ['y', '+'];
        }
    }

    // if on a moving object, move with object
    // object_speed will be negative if moving in -x dir
    function updatePosition(elapsedTime, objectOn) {
        if (lastElapsedTime == 0) lastElapsedTime = elapsedTime;
        if (!obj.died) {
            obj.center.x += objectOn.direction * objectOn.moveRate * elapsedTime * 1.978;   // This is literally a magic number
        }
        lastElapsedTime = elapsedTime;
    }

    // updates the jump rate for how quickly repeat jumps can occur
    function update(elapsedTime) {
        jumpRate += elapsedTime / 1000;
    }

    function resetFrog() {
        console.log('Reset frog');
        obj.center = { x: graphics.canvas.width / 2, y: graphics.canvas.height - (graphics.canvas.height / 14) };
        obj.onMoving = false;
        obj.died = false;
        obj.timeLastJump = 0;
        obj.rotation = Math.PI;
        obj.home = false;
    }

    let api = {
        moveLeft: moveLeft,
        moveRight: moveRight,
        moveForward: moveForward,
        moveBackward: moveBackward,
        jump: jump,     // the frog update process
        update: update,
        updatePosition, updatePosition,
        resetFrog: resetFrog,
        // get isReady() { return isReady },
        get center() { return obj.center },
        set center(newCenter) { obj.center = newCenter; },
        get onMoving() { return obj.onMoving; },    // if on moving object, update with time
        set onMoving(bool) { obj.onMoving = bool; },
        get size() { return obj.size; },
        get timeLastJump() { return obj.timeLastJump; },
        set timeLastJump(t) { obj.timeLastJump = t; },
        get freeze() { return freeze; },
        set freeze(bool) { freeze = bool; },
        get JUMP_RATE() { return JUMP_RATE; },
        get rotation() { return obj.rotation; },
        set rotation(r) { obj.rotation = r; },
        get isJumping() { return isJumping; },
        get moveRate() { return obj.moveRate; },
        get reverse() { return reverse; },
        get died() { return obj.died; },
        set died(bool) { obj.died = bool; },
        get home() { return obj.home; },
        set home(bool) { obj.home = bool; },
    }

    return api;
}