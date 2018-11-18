; (function ($) {
  'use strict';

  function CounterUp($element, options) {
    this.$element = $element;
    this.options = options;
  }

  CounterUp.DEFAULTS = {
    namespace: 'fudi.counter-up',
    separator: false,
    duration: 5000,
    beginAt: 0
  };

  CounterUp.prototype.run = function () {
    var self = this;

    var count = this.options.beginAt;
    var total = this.$element.data('count');

    var MIN_REFRESH_RATE = 50;

    var refreshRate = this.options.duration / total;
    var offset = 1;

    if (refreshRate < MIN_REFRESH_RATE) {
      offset = Math.round(MIN_REFRESH_RATE / refreshRate);
      refreshRate = MIN_REFRESH_RATE;
    }

    var execute = function fn() {
      setElementTextBy.call(self, count);

      if (count == total) {
        return;
      }

      if (count > total) {
        setElementTextBy.call(self, total);
        return;
      }

      count += offset;
      setTimeout(fn, refreshRate);
    };

    execute();
  };

  function setElementTextBy(num) {
    var formatter = getFormatterBy(this.options.separator);
    var result = format(num.toString(), formatter);
    this.$element.text(result);
  }

  function getFormatterBy(separator) {
    switch (separator) {
      case 'dot':
        return '.';
      case 'comma':
        return ',';
      default:
        return null;
    }
  }

  function format(str, formatter) {
    if (!formatter) {
      return str;
    }

    var pattern = /(\d+)(\d{3})/;
    var value = '$1' + formatter + '$2';

    return str.replace(pattern, value);
  }

  function Plugin(param) {
    var namespace = CounterUp.DEFAULTS.namespace;

    return this.each(function () {
      var $this = $(this);
      var instance = $this.data(namespace);

      if (!instance) {
        var options = $.extend({}, CounterUp.DEFAULTS, typeof param == 'object' && param);
        $this.data(namespace, instance = new CounterUp($this, options));
      }

      instance.run();
    });
  }

  var old = $.fn.counterUp;

  $.fn.counterUp = Plugin;
  $.fn.counterUp.Constructor = CounterUp;

  $.fn.counterUp.noConflict = function () {
    $.fn.counterUp = old;
    return this;
  };

  $('.js-counter-up.js-waypoint').one('stay.fudi.waypoint', function () {
    $(this).counterUp({ separator: 'comma' });
  });

})(jQuery);