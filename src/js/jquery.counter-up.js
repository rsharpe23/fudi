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

  CounterUp.prototype.run = function (total) {
    var self = this;

    var MIN_REFRESH_RATE = 50;

    var count = this.options.beginAt;
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

  function Plugin(param, options) {
    var namespace = CounterUp.DEFAULTS.namespace;
    var newOptions = $.extend({}, CounterUp.DEFAULTS, typeof options == 'object' && options);

    return this.each(function () {
      var $this = $(this);
      var instance = $this.data(namespace);

      if (instance) {
        instance.options = newOptions;
      } else {
        instance = new CounterUp($this, newOptions);
        $this.data(namespace, instance);
      }

      instance.run(param);
    });
  }

  var old = $.fn.counterUp;

  $.fn.counterUp = Plugin;
  $.fn.counterUp.Constructor = CounterUp;

  $.fn.counterUp.noConflict = function () {
    $.fn.counterUp = old;
    return this;
  };

  $('.js-counter-up.js-waypoint').one('ready.fudi.waypoint', function () {
    var $this = $(this);
    var param = $this.data('count');
    $this.counterUp(param, { separator: 'comma' });
  });

})(jQuery);