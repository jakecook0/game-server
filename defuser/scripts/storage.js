MyGame.storage = (function (input) {
    // const KEYS_DIR = 'MyGame.controls';
    const SCORES_DIR = 'MyGame.highScores';
    // const KEYFUNCTION_LOOKUP = { // gets the plaintext name of the key function for the settings screen
    //     'moveLeft': 'Move Left',
    //     'moveRight': 'Move Right',
    //     'moveForward': 'Move Forward',
    //     'moveBack': 'Move Backward'
    // };

    // // save all registered keys to storage
    // // overwrites all keys in persistent storage
    // function saveKeys(keyboard) {
    //     localStorage.removeItem(KEYS_DIR);
    //     keys = {}
    //     for (let k in keyboard.handlers) {
    //         keys[k] = { 'function': keyboard.handlers[k], 'name': KEYFUNCTION_LOOKUP[keyboard.handlers[k]] };
    //     }
    //     localStorage[KEYS_DIR] = JSON.stringify(keyboard.handlers);
    // }


    // // Returns object of all registered keys and NAME of event
    // function getKeys() {
    //     let keys = localStorage.getItem(KEYS_DIR);
    //     if (keys !== null) { keys = JSON.parse(keys); }
    //     return keys
    // }

    // Saves a new score to storage
    function saveScore(score, username = 'User1') {   // TODO: remove default username
        let oldScores = localStorage.getItem(SCORES_DIR);
        if (oldScores !== null) { oldScores = JSON.parse(oldScores); }
        else { oldScores = { 'User1': 0 } }
        oldScores[username] = score;
        localStorage[SCORES_DIR] = JSON.stringify(oldScores)
    }

    // returns the saved scores object as {username:score}
    // If no saved scores, retuns null
    function getScore() {
        let scores = localStorage.getItem(SCORES_DIR);
        if (scores !== null) { scores = JSON.parse(scores); }
        return scores
    }

    return {
        // saveKeys: saveKeys,
        // getKeys: getKeys,
        saveScore: saveScore,
        getScore: getScore,
    }

}(MyGame.input))