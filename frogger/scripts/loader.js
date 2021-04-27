//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame = {
    screens: {},
    input: {},
    objects: {
        objs: {
            player: {},
            backgrounds: {},
            cars: { semi: [], firetruck: [], sedan: [], police: [], sports: [] },
            floats: { log: [], turtle: [], turtleRender: [] },
            homeFrogs: [],
        }
    },
    render: {},
    assets: {},
    systems: {},
};

MyGame.loader = (function () {
    'use strict';
    let scriptOrder = [
        {
            scripts: ['random'],
            message: 'Random number generator loaded',
            onComplete: null
        }, {
            scripts: ['input-keyboard'],
            message: 'keyboard controller loaded',
            onComplete: null
        }, {
            scripts: ['objects/frog'],
            message: 'frog player loaded',
            onComplete: null
        }, {
            scripts: ['objects/spawner'],
            message: 'spawner loaded',
            onComplete: null
        }, {
            scripts: ['objects/turtle'],
            message: 'turtles loaded',
            onComplete: null
        }, {
            scripts: ['audio'],
            message: 'audio loaded',
            onComplete: null
        }, {
            scripts: ['storage'],
            message: 'storage loaded',
            onComplete: null
        }, {
            scripts: ['rendering/graphics'],
            message: 'graphics loaded',
            onComplete: null
        }, {
            scripts: ['collisions'],
            message: 'collisions loaded',
            onComplete: null
        }, {
            scripts: ['rendering/animated-model'],
            message: 'animation loaded',
            onComplete: null
        }, {
            scripts: ['rendering/backgrounds'],
            message: 'backgrounds loaded',
            onComplete: null
        }, {
            scripts: ['rendering/obstacles'],
            message: 'obstacles loaded',
            onComplete: null
        }, {
            scripts: ['rendering/particles'],
            message: 'particle rendering loaded',
            onComplete: null
        }, {
            scripts: ['systems/particles'],
            message: 'particle system loaded',
            onComplete: null
        }, {
            scripts: ['objects/overlay'],
            message: 'overlay objects loaded',
            onComplete: null
        }, {
            scripts: ['objects/object-management'],
            message: 'object manager loaded',
            onComplete: null
        }, {
            scripts: ['game'],
            message: 'game loaded',
            onComplete: null
        }, {
            scripts: ['gamemodel'],
            message: 'gamemodel loaded',
            onComplete: null
        }, {
            scripts: ['screens/mainmenu'],
            message: 'screen menu loaded',
            onComplete: null
        }, {
            scripts: ['screens/highscores'],
            message: 'screen scores loaded',
            onComplete: null
        }, {
            scripts: ['screens/settings'],
            message: 'screen settings loaded',
            onComplete: null
        }, {
            scripts: ['screens/help-about'],
            message: 'screen help loaded',
            onComplete: null
        }, {
            scripts: ['screens/gameplay'],
            message: 'screen gameplay loaded',
            onComplete: null
        }
    ];

    let assetOrder = [
        {
            key: 'dead',
            source: '/assets/sprites/lily-pad.png'
        },
        {
            key: 'background',
            source: '/assets/sprites/background_all.png'
        }, {
            key: 'frog-3',
            source: '/assets/sprites/frog-3.png'
        },
        {
            key: 'lilypad',
            source: '/assets/sprites/lily-pad.png'
        },
        {
            key: 'firetruck',
            source: '/assets/sprites/firetruck.png'
        },
        {
            key: 'homefrog',
            source: '/assets/sprites/home-frog.png'
        },
        {
            key: 'longlog',
            source: '/assets/sprites/long-log.png'
        },
        {
            key: 'mediumlog',
            source: '/assets/sprites/medium-log.png'
        },
        {
            key: 'policecar',
            source: '/assets/sprites/police-car.png'
        },
        {
            key: 'sedan',
            source: '/assets/sprites/sedan.png'
        },
        {
            key: 'semi',
            source: '/assets/sprites/semi.png'
        },
        {
            key: 'shortlog',
            source: '/assets/sprites/short-log.png'
        },
        {
            key: 'sportscar',
            source: '/assets/sprites/sports-car.png'
        },
        {
            key: 'turtle',
            source: '/assets/sprites/turtle.png'
        },
        {
            key: 'game',
            source: '/assets/audio/frogger-theme.mp3'
        },
        {
            key: 'jump',
            source: '/assets/audio/hop.wav'
        },
        {
            key: 'plunk',
            source: '/assets/audio/plunk.wav'
        },
        {
            key: 'squash',
            source: '/assets/audio/squash.wav'
        },
        {
            key: 'home',
            source: '/assets/audio/extra.wav'
        }
    ];

    //------------------------------------------------------------------
    //
    // Helper function used to load scripts in the order specified by the
    // 'scripts' parameter.  'scripts' expects an array of objects with
    // the following format...
    //    {
    //        scripts: [script1, script2, ...],
    //        message: 'Console message displayed after loading is complete',
    //        onComplete: function to call when loading is complete, may be null
    //    }
    //
    //------------------------------------------------------------------
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function () {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.shift();    // Alternatively: scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // Helper function used to load assets in the order specified by the
    // 'assets' parameter.  'assets' expects an array of objects with
    // the following format...
    //    {
    //        key: 'asset-1',
    //        source: 'asset/.../asset.png'
    //    }
    //
    // onSuccess is invoked per asset as: onSuccess(key, asset)
    // onError is invoked per asset as: onError(error)
    // onComplete is invoked once per 'assets' array as: onComplete()
    //
    //------------------------------------------------------------------
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function (asset) {
                    onSuccess(entry, asset);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function (error) {
                    onError(error);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest();
        let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                let asset = null;
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3' || fileExtension === 'wav') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    console.log(asset);
                    asset.onload = function () {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    if (onSuccess) { onSuccess(asset); }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }

    //------------------------------------------------------------------
    //
    // Called when all the scripts are loaded, it kicks off the demo app.
    //
    //------------------------------------------------------------------
    function mainComplete() {
        console.log('It is all loaded up');
        MyGame.game.initialize();
    }

    //
    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    loadAssets(assetOrder,
        function (source, asset) {    // Store it on success
            MyGame.assets[source.key] = asset;
        },
        function (error) {
            console.log(error);
        },
        function () {
            console.log('All game assets loaded');
            console.log('Starting to dynamically load project scripts');
            loadScripts(scriptOrder, mainComplete);
        }
    );

}());
