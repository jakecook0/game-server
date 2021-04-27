MyGame.objects.Text = function(spec) {
  'use strict';

  let rotation = 0;


  let api = {
    get rotation() { return rotation; },
    get center() { return spec.center; },
    get text() { return spec.text; },
    get font() { return spec.font; },
    get fillStyle() { return spec.fillStyle; },
    get strokeStyle() { return spec.strokeStyle; },
    set text(newText) { spec.text = newText; },
    set fillStyle(newFill) { spec.fillStyle = newFill; },
    set num(newNum) { spec.num = newNum; },
    get num() { return spec.num; },
  };

  return api;

}
