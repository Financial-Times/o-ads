/* global TEST, equal, raises, test */
test("simple addition method", function () {
  "use strict";
  function createCallBack() {
    var args = Array.prototype.slice.call(arguments),
      fn = args.shift();
    return function () {
      fn.call(this, args);
    };
  }

  equal(TEST.addInts(1, 1), 2, 'works with small numbers :)');
  equal(TEST.addInts(3e3, 2e3), 5e3, 'works with bigger numbers :)');
  raises(createCallBack(TEST.addInts, 'hi', 1), 'String in arg 1 errors');
  raises(createCallBack(TEST.addInts, 1, 'matey'), 'String in arg 2 errors');
  raises(createCallBack(TEST.addInts, 'hi', 'matey'), 'Strings in both args error');
  //equal(TEST.addInts(1, 1), 3, 'faily fail fail');
});
