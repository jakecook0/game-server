MyGame.objects.manager = (function (objects, renderer, graphics) {

    let levelNums = {
        6: [3, 3, 2, 2, 1, 1],
        9: [4, 3, 2, 3, 3, 2, 2, 1, 1],
        12: [5, 4, 3, 4, 3, 2, 3, 3, 2, 2, 1, 1],
    }


    function initLevel(level = 6) {
        // render level objects
        let rows = level / 3;
        let nums = levelNums[level];    // remove each number after used

        //TODO: get a random number's position

        for (let row = 1; row < rows + 1; row++) {
            for (let col in [1, 2, 3]) {    // 3 bombs per row
                let randPosition = getRandom(nums.length);
                let lookupnum = nums[randPosition];
                nums.splice(randPosition, 1);
                let img = timeLUT[lookupnum];

                let px = 90 * col + 280;
                let py = 90 * row + 80;
                var timer = objects.Timer({
                    imagesrc: img,
                    center: { x: px, y: py + 10 },
                    size: { width: 40, height: 40 },
                }, graphics);

                objects.objs.push(objects.Bombs({
                    bombImg: 'assets/Bomb.png',
                    overlay: timer,
                    time: lookupnum + 1,
                    row: row,
                    center: { x: px, y: py },
                    size: { width: 60, height: 60 },
                }, graphics, objects));
            }
        }
    }

    function getRandom(size) {
        return Math.floor(Math.random() * size);
        //TODO: return a random numbe within the size limit 
    }

    function update(elapsedTime, countingDown) {
        // update all bombs/objects
        // if (countingDown) {
        // objects.countdown.update(elapsedTime);
        // } else {
        if (countingDown) {
            return
        }
        for (let b in objects.objs) {
            // if timer isn't needed, don't update
            objects.objs[b].update(elapsedTime);
        }
        // }
    }

    function renderBombs() {
        //renders all bombs
        for (let b in objects.objs) {
            objects.objs[b].render();
        }
    }


    return {
        initLevel: initLevel,
        renderBombs: renderBombs,
        update: update,
    }

}(MyGame.objects, MyGame.render, MyGame.graphics));