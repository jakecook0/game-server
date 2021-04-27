
MyGame.storage = (function (input, objects) {
    const KEYS_DIR = 'FROGGER-JC.controls';
    const SCORES_DIR = 'FROGGER-JC.highScores';
    const KEYFUNCTION_LOOKUP = { // gets the plaintext name of the key function for the settings screen
        'moveLeft': { desc: 'Move Left', func: objects.objs.player.moveLeft },
        'moveRight': { desc: 'Move Right', func: objects.objs.player.moveRight },
        'moveForward': { desc: 'Move Forward', func: objects.objs.player.moveForward },
        'moveBackward': { desc: 'Move Backward', func: objects.objs.player.moveBackward },
        'pause': { desc: 'Pause Game / Menu', func: null },
    };

    // save all registered keys to storage
    // overwrites all keys in persistent storage
    function saveKeys(keyboard) {
        // console.log('SAVING KEYS');
        localStorage.removeItem(KEYS_DIR);
        keys = {}
        for (let k in keyboard.handlers) {
            // console.log('KEY FUNCTION:');
            // console.log(keyboard.handlers[k]);
            keys[k] = { 'functionName': keyboard.handlers[k].name, 'desc': KEYFUNCTION_LOOKUP[keyboard.handlers[k].name].desc };
        }
        // console.log(keys);
        localStorage[KEYS_DIR] = JSON.stringify(keys);
        // console.log(localStorage[KEYS_DIR]);
    }

    function updateKeys(keys, keyboard) {
        // update keys in keyboard handlers
        // write new keys to storage
        console.log('updating keys');
        console.log(keyboard);
    }


    // Returns object of all registered keys and NAME of event
    function getKeys() {
        let keys = localStorage.getItem(KEYS_DIR);
        if (keys !== null) { keys = JSON.parse(keys); }
        return keys
    }

    function registerKeys(keyboard) {
        // perform all keyboard registering logic here instead of in gamemodel
        // TODO: Add a function lookup method dependent on move type (i.e. 'Move Forward' -> frog.moveForward)
        let tmp = getKeys();
        console.log(keyboard);
        for (let key in tmp) {
            keyboard.register(key, KEYFUNCTION_LOOKUP[tmp[key]['functionName']].func)
        }
    }

    // Saves a new score to storage
    function saveScore(score, username = 'User1') {   // TODO: remove default username
        let oldScores = localStorage.getItem(SCORES_DIR);
        if (oldScores !== null) { oldScores = JSON.parse(oldScores); }
        else { oldScores = {}; }

        oldScores[username] = score;
        oldScores = capSavedScores(oldScores);
        localStorage[SCORES_DIR] = JSON.stringify(oldScores)
    }

    // caps the numbers of scores saved in local storage to 5 (or 10)
    function capSavedScores(scores) {
        if (Object.keys(scores).length > 5) {
            // drop smallest value
            let worstKey;
            let smallest = 100000;
            for (let s in scores) {
                if (scores[s] <= smallest) {
                    smallest = scores[s];
                    worstKey = s;
                }
            }
            if (worstKey !== null) { delete scores[worstKey]; console.log('removed ' + worstKey + ' with score ' + smallest); }
            return scores;
        }
        return scores;
    }

    // returns the saved scores object as {username:score}
    // If no saved scores, retuns null
    function getScore() {
        let scores = localStorage.getItem(SCORES_DIR);
        if (scores !== null) { scores = JSON.parse(scores); }
        return scores
    }

    return {
        saveKeys: saveKeys,
        saveScore: saveScore,
        getKeys: getKeys,
        getScore: getScore,
        registerKeys: registerKeys,
        updateKeys: updateKeys,
        get KEYFUNCTION_LOOKUP() { return KEYFUNCTION_LOOKUP; },
    }

}(MyGame.input, MyGame.objects))