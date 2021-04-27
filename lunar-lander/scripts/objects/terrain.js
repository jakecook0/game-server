// terrain generation algorithm
// saves generated terrain points into object MyGame.terrain.points -- pass to a render function for terrain

MyGame.objects.Terrain = function(spec) {
  'use strict';

  // let pts = [];
  // let platforms = [];
  let detail = 6;
  let terrainShape = new Path2D();

  let canvas = spec.canvas;
  let s = 1;

  // get whole random num
  function getRandomInt(max = 4) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // generates a random value between min and max
  function getRandomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Starts with the x coords of the line endpoints (x-dist gives good enough)
  // recursively runs algorithm for 'iteration' num of iterations
  function randomMidpointDisplacement(pt1, pt2, iteration) { //x1=a, x2=b
    if (iteration <= 0) {
      return;
    }
    let mid = Math.ceil((pt1.x + pt2.x) / 2);
    let len = pt2.x - pt1.x;
    let elev = Math.ceil(getElevation(len));

    // make point
    let newPt = { x: mid, y: elev }
    // add new point to list of points (this prevents duplicates)
    spec.pts.push(newPt);
    // recurse down an iteration, new pts
    randomMidpointDisplacement(pt1, newPt, --iteration);
    randomMidpointDisplacement(newPt, pt2, --iteration);
  }

  // calculates an approximately normally distributed number
  // normal distribution credit: @Vortico on stackoverflow
  function getElevation(len) {
    //TODO: Check equation again, try with different spread/variable to line len directly
    let gaussian = Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random())
    return Math.min(Math.max(canvas.height - gaussian * len - 120, canvas.height / 2.1), canvas.height - 20);
  }

  // returns an object of randomly gen safe "platforms" as points { 0: {y: , x1: , x2: }, 1: {...} }
  // safe platforms are 15% or more away from an edge
  function safePlatforms(numPlatforms, width) {
    let platforms = [];
    let widthSections = canvas.width / numPlatforms; // break canvas into zones for landing pads
    for (let platform = 0; platform < numPlatforms; platform++) {
      // calc a random y value, use for both points
      // calc 2 random x vals as start and end lengths, within width maximum
      let y = canvas.height - getRandomInt(canvas.height / 2.8); //cap platform height to 1/3 of render height TODO: modify this value for difficulty/interest
      let margin = canvas.width * 0.15;

      let x1 = getRandomIntFromInterval(platform * widthSections, (platform + 1) * widthSections);
      let x2 = 0;
      while (x2 > (((platform + 1) * widthSections) - margin) || x2 < (margin + platform * widthSections)) { //if too close to edges, recalc
        // also check that x1 - x2 <= widthMax
        x1 = getRandomInt(canvas.width)
        x2 = x1 + width;
      }

      // save platform points
      platforms.push({ y: y, x1: x1, x2: x2 });

    }
    platforms.sort((a, b) => {
      return a.x1 - b.x1;
    })
    return platforms;
  }

  function buildTerrain(numPlatforms = 1, width = 100) { // width should be variably set in calling section;
    // generate random safe platform x,y coords from a length value
    terrainShape = new Path2D();
    spec.pts = []; // clear previous terrain;
    let platforms = safePlatforms(numPlatforms, width);
    spec.platforms = platforms;

    // gen the left and right border points
    let pt1 = { x: 0 };
    let pt2 = { x: canvas.width };
    pt1.y = getRandomIntFromInterval(canvas.height, canvas.height / 2);
    pt2.y = getRandomIntFromInterval(canvas.height, canvas.height / 2);
    spec.pts.push(pt1);
    // add all platform points
    // console.log("platforms");
    // console.log(platforms);
    platforms.forEach((segment, i) => {
      spec.pts.push({ x: segment.x1, y: segment.y });
      spec.pts.push({ x: segment.x2, y: segment.y });
    });

    spec.pts.push(pt2);

    // make copy of current points
    let tmpPts = [];
    spec.pts.forEach((pt, i) => {
      tmpPts.push(pt);
    });

    // randomMidpointDisplacement(pt1, pt2, detail);
    for (let i = 0; i < tmpPts.length; i += 2) { // skips platforms
      randomMidpointDisplacement(tmpPts[i], tmpPts[i + 1], detail);
    }

    spec.pts.sort((a, b) => {
      return a.x - b.x; // sort ascending order by x position
    })
    saveTerrain();
  }

  function saveTerrain() {
    spec.terrainShape = new Path2D(); // clear out old terrain
    spec.terrainShape.moveTo(0, canvas.height);
    // context.moveTo(points[0].x, points[0].y);
    for (let point = 0; point < spec.pts.length; point++) {
      spec.terrainShape.lineTo(spec.pts[point].x, spec.pts[point].y);
    }
    spec.terrainShape.lineTo(canvas.width, canvas.height);
    spec.terrainShape.closePath();
    // return terrainShape;
  }

  let api = {
    buildTerrain: buildTerrain,
    // saveTerrain: saveTerrain,
    // clearTerrain: clearTerrain,
    get points() { return spec.pts; }, // returns a LIST
    set points(newPts) { spec.pts = newPts; },
    get platforms() { return spec.platforms; },
    set platforms(newPlatforms) { spec.platforms = newPlatforms; },
    get terrainShape() { return spec.terrainShape; },
    // set terrainShape(newTerr) { terrainShape = newTerr; },
  }

  return api;
}
