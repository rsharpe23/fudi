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
    minDelay: 50,
    beginAt: 0
  };

  CounterUp.getEvent = function (name) {
    return name + '.' + CounterUp.DEFAULTS.namespace;
  };

  CounterUp.prototype.run = function () {
    var self = this;

    var count = this.options.beginAt;
    var totalCount = this.$element.data('total');

    var fnDelay = this.options.duration / totalCount;
    var minDelay = this.options.minDelay;
    var offset = 1;

    if (fnDelay < minDelay) {
      offset = Math.round(minDelay / fnDelay);
      fnDelay = minDelay;
    }

    var execute = function fn() {
      setElementTextBy.call(self, count);

      if (count == totalCount) {
        return;
      }

      if (count > totalCount) {
        setElementTextBy.call(self, totalCount);
        return;
      }

      count += offset;
      setTimeout(fn, fnDelay);
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

  var loadEvent = CounterUp.getEvent('load');

  $(window).on(loadEvent, function () {
    $('.js-counter-up').each(function () {
      Plugin.call($(this), { separator: 'comma' });
    });
  });

})(jQuery);