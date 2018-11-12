; (function ($) {
  'use strict';

  function Transition() { }

  Transition.prototype.duration = function (selector, value) {
    var PROPERTY_NAME = 'transition-duration';
    var $target = $(selector);

    if (!value) {
      var result = $target.css(PROPERTY_NAME);
      return parseFloat(result) * 1000;
    }

    $target.css(PROPERTY_NAME, value);
  };

  window.transition = new Transition();
})(jQuery);