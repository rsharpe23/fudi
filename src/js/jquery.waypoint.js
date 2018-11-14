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

  Waypoint.prototype.run = function (e) {
    // elemTop/elemBottom могут менятся динамический, 
    // поэтому обновляем их в кажом событии прокрутки

    var scrollTop = this.$root.scrollTop();
    var scrollBottom = scrollTop + window.innerHeight;

    var elemTop = this.$element.position().top;
    var elemBottom = elemTop + this.$element.outerHeight();

    if (scrollTop > this.lastScrollTop) {
      if (scrollBottom > elemTop + getElementOffset.call(this) && scrollBottom < elemBottom) {
        tobeInsideElement.call(this);
      }
    } else {
      if (scrollTop < elemBottom - getElementOffset.call(this) && scrollTop > elemTop) {
        tobeInsideElement.call(this);
      }
    }

    this.lastScrollTop = scrollTop;
  };

  function tobeInsideElement() {
    fireElementEvent.call(this, 'stay');
  }

  function fireElementEvent(name) {
    var e = $.Event(Waypoint.getEvent(name));
    this.$element.trigger(e);
  }

  function getElementOffset() {
    var value = parseInt(this.options.offset);
    return this.$element.outerHeight() / 100 * value;
  }

  function Plugin(param) {
    return this.each(function () {
      var options = $.extend({}, Waypoint.DEFAULTS, typeof param == 'object' && param);
      new Waypoint($(this), options);
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