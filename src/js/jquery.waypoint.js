; (function ($) {
  'use strict';

  function Waypoint($element, options) {
    this.$element = $element;
    this.options = options;
    this.$root = $(document);
    this.lastScrollTop = this.$root.scrollTop();

    var event = Waypoint.getEvent('scroll');
    var handler = $.proxy(this.run, this);

    this.$root.on(event, handler);
  }

  Waypoint.DEFAULTS = {
    namespace: 'fudi.waypoint',
    offset: '0%',
  };

  Waypoint.getEvent = function () {
    return [].join.call(arguments, '.') + '.' + Waypoint.DEFAULTS.namespace;
  }

  Waypoint.isEnabled = function ($element) {
    return $element.css('display') != 'none';
  }

  Waypoint.prototype.run = function (e) {
    var scrollTop = this.$root.scrollTop();
    var scrollBottom = scrollTop + window.innerHeight;

    // elemTop/elemBottom могут менятся динамический, 
    // поэтому обновляем их в кажом событии прокрутки
    // var elemTop = this.$element.position().top; // Позиция относительно родителя
    var elemTop = this.$element.offset().top; // Позиция относительно документа
    var elemBottom = elemTop + this.$element.outerHeight();

    if (scrollTop > this.lastScrollTop) {
      if (scrollBottom > elemTop + getOffsetHeight.call(this) && scrollBottom < elemBottom) {
        ready.call(this);
      }
    } else {
      if (scrollTop < elemBottom - getOffsetHeight.call(this) && scrollTop > elemTop) {
        ready.call(this);
      }
    }

    this.lastScrollTop = scrollTop;
  };

  function ready() {
    // Проверяем также во время скролла, 
    // поскольку отображение элемента может меняться динамически
    if (Waypoint.isEnabled(this.$element)) {
      fireEvent.call(this, 'stay');
    }
  }

  function fireEvent(name) {
    var e = $.Event(Waypoint.getEvent(name));
    this.$element.trigger(e);
  }

  function getOffsetHeight() {
    var value = parseInt(this.options.offset);
    return this.$element.outerHeight() / 100 * value;
  }

  function Plugin(options) {
    var newOptions = $.extend({}, Waypoint.DEFAULTS, typeof options == 'object' && options);

    return this.each(function () {
      var $this = $(this);

      if (Waypoint.isEnabled($this)) {
        new Waypoint($this, newOptions);
      }
    });
  }

  var old = $.fn.waypoint;

  $.fn.waypoint = Plugin;
  $.fn.waypoint.Constructor = Waypoint;

  $.fn.waypoint.noConflict = function () {
    $.fn.waypoint = old;
    return this;
  };

  $(document).ready(function () {
    $('.js-waypoint').waypoint();
  });

})(jQuery);