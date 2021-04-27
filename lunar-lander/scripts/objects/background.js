// spec = {
//   imageSrc: ,
//   height: ,
//   width: ,
// }

// create the Background objects
// No state function needed as background is static
MyGame.objects.Background = function(spec) {
  'use strict';

  let isReady = false;
  let image = new Image();

  image.onload = function() {
    isReady = true;
    console.log('Background image is loaded');
  }
  image.src = spec.imageSrc;

  let api = {
    get image() { return image },
    get height() { return spec.height },
    get width() { return spec.width },
    get isReady() { return isReady; },
  }

  return api;
}
