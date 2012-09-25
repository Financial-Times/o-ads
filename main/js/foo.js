(function (w, d, u) {
  "use strict";
  var TEST = w.TEST = w.TEST || {};

  TEST.addInts = function (i, j) {
    i = parseInt(i, 10);
    j = parseInt(j, 10);
    if (!isNaN(i) && !isNaN(j)) {
      return i + j;
    }
    throw new Error('you can only add numbers you idiot!');
  };
}(window, document));
