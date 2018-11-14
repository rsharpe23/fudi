; (function () {
  'use strict';

  function UniqueId() {
    this.count = 0;
    this.key = 'uuid';
  }

  UniqueId.prototype.get = function ($element) {
    var uuid = $element.data(this.key);

    if (!uuid) {
      $element.data(this.key, uuid = ++this.count);
    }

    return uuid;
  };

  window.uniqueId = new UniqueId();

})(jQuery);

(function ($) {
  'use strict';

  function Transition() {
    this.property = 'transition-duration';
  }

  Transition.prototype.duration = function (target, value) {
    var $target = $(target);

    if (!value) {
      var result = $target.css(this.property);
      return parseFloat(result) * 1000;
    }

    $target.css(this.property, value);
  };

  window.transition = new Transition();

})(jQuery);