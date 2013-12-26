window.Echo = (function (window, document, undefined) {

  'use strict';

  var store = [], offset, throttle, poll;

  var _inView = function (el) {
    var coords = el.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
  };

  var _pollContents = function () {
    for (var i = store.length; i--;) {
      var prop, self = store[i];
      if (_inView(self)) {
        prop = self.getAttribute('data-lazy-prop') || 'src';
        self[prop] = self.getAttribute('data-lazy');
        self.removeAttribute('data-lazy-prop');
        self.removeAttribute('data-lazy');
        store.splice(i, 1);
      }
    }
  };

  var _throttle = function () {
    clearTimeout(poll);
    poll = setTimeout(_pollContents, throttle);
  };

  var push = function(node) {
    store.push(node);
  };

  var init = function (obj) {
    var nodes = document.querySelectorAll('[data-lazy]');
    var opts = obj || {};
    offset = opts.offset || 0;
    throttle = opts.throttle || 250;

    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }

    _throttle();

    if (document.addEventListener) {
      window.addEventListener('scroll', _throttle, false);
    } else {
      window.attachEvent('onscroll', _throttle);
    }
  };

  return {
    init: init,
    push: push,
    render: _throttle
  };

})(window, document);
