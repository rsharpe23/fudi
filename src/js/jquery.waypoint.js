; (function ($) {
  'use strict';

  function Waypoint($element, options) {
    this.$element = $element;
    this.options = options;
    this.$root = $(window);
    this.lastScrollTop = 0;

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
    return $element.is(':visible');
  }

  Waypoint.prototype.run = function () {
    var scrollPos = new ScrollPos(this.$root);
    var elemPos = new ElementPos(this.$element, this.options.offset);

    if (scrollPos.top > this.lastScrollTop) {
      if (scrollPos.bottom > (elemPos.top + elemPos.offset) && scrollPos.top < elemPos.bottom) {
        ready.call(this);
      }
    } else {
      if (scrollPos.top < (elemPos.bottom - elemPos.offset) && scrollPos.bottom > elemPos.top) {
        ready.call(this);
      }
    }

    // if (scrollPos.top > this.lastScrollTop) {
    //   if (scrollPos.bottom > (elemPos.top + elemPos.offset) && scrollPos.bottom < elemPos.bottom) {
    //     ready.call(this);
    //   }
    // } else {
    //   if (scrollPos.top < (elemPos.bottom - elemPos.offset) && scrollPos.top > elemPos.top) {
    //     ready.call(this);
    //   }
    // }

    this.lastScrollTop = scrollPos.top;
  };

  function ready() {
    if (!Waypoint.isEnabled(this.$element)) {
      return;
    }

    fireEvent.call(this, 'ready');
  }

  function fireEvent(name) {
    var e = $.Event(Waypoint.getEvent(name));
    this.$element.trigger(e);
  }


  function ScrollPos($owner) {
    this.$owner = $owner;
    this.top = this._getTop();
    this.bottom = this._getBottom();
  }

  ScrollPos.prototype._getTop = function () {
    return this.$owner.scrollTop();
  }

  ScrollPos.prototype._getBottom = function () {
    if (!this.hasOwnProperty('top')) {
      throw new Error('Property "top" not found');
    }

    return this.top + this.$owner.height();
  }


  function ElementPos($owner, offsetPercent) {
    ScrollPos.call(this, $owner);
    this.offset = this._getOffset(offsetPercent);
  }

  ElementPos.prototype = Object.create(ScrollPos.prototype);
  ElementPos.prototype.constructor = ElementPos;

  ElementPos.prototype._getTop = function () {
    return this.$owner.offset().top;
  };

  ElementPos.prototype._getOffset = function (offsetPercent) {
    return this.$owner.height() / 100 * parseInt(offsetPercent);
  };


  function Plugin(options) {
    var newOptions = $.extend({}, Waypoint.DEFAULTS, typeof options == 'object' && options);

    return this.each(function () {
      var $element = $(this);

      if (Waypoint.isEnabled($element)) {
        new Waypoint($element, newOptions).run();
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

  var loadEvent = Waypoint.getEvent('load');

  $(window).on(loadEvent, function () {
    $('.js-waypoint').waypoint();
  });

})(jQuery);



// ; (function ($) {
//   'use strict';

//   function Waypoint($element, options) {
//     this.$element = $element;
//     this.options = options;
//     this.$root = $(document);
//     this.lastScrollTop = this.$root.scrollTop();

//     var event = Waypoint.getEvent('scroll');
//     var handler = $.proxy(this.run, this);

//     this.$root.on(event, handler);
//   }

//   Waypoint.DEFAULTS = {
//     namespace: 'fudi.waypoint',
//     offset: '0%',
//   };

//   Waypoint.getEvent = function () {
//     return [].join.call(arguments, '.') + '.' + Waypoint.DEFAULTS.namespace;
//   }

//   Waypoint.isEnabled = function ($element) {
//     return $element.css('display') != 'none';
//   }

//   Waypoint.prototype.run = function () {
//     var scrollTop = this.$root.scrollTop();
//     var scrollBottom = scrollTop + window.innerHeight;

//     // elemTop/elemBottom могут менятся динамический, 
//     // поэтому обновляем их в кажом событии прокрутки

//     // var elemTop = this.$element.position().top; // Позиция относительно родителя
//     var elemTop = this.$element.offset().top; // Позиция относительно документа
//     var elemBottom = elemTop + this.$element.outerHeight();
//     var elemOffset = getHeightOffset.call(this);

//     if (scrollTop > this.lastScrollTop) {
//       if (scrollBottom > (elemTop + elemOffset) && scrollBottom < elemBottom) {
//         ready.call(this);
//       }
//     } else {
//       if (scrollTop < (elemBottom - elemOffset) && scrollTop > elemTop) {
//         ready.call(this);
//       }
//     }

//     this.lastScrollTop = scrollTop;
//   };

//   function ready() {
//     // Проверяем также во время скролла, 
//     // поскольку отображение элемента может меняться динамически
//     if (Waypoint.isEnabled(this.$element)) {
//       fireEvent.call(this, 'stay');
//     }
//   }

//   function fireEvent(name) {
//     var e = $.Event(Waypoint.getEvent(name));
//     this.$element.trigger(e);
//   }

//   function getHeightOffset() {
//     var value = parseInt(this.options.offset);
//     return this.$element.outerHeight() / 100 * value;
//   }

//   function Plugin(options) {
//     var newOptions = $.extend({}, Waypoint.DEFAULTS, typeof options == 'object' && options);

//     return this.each(function () {
//       var $this = $(this);

//       if (Waypoint.isEnabled($this)) {
//         new Waypoint($this, newOptions);
//       }
//     });
//   }

//   var old = $.fn.waypoint;

//   $.fn.waypoint = Plugin;
//   $.fn.waypoint.Constructor = Waypoint;

//   $.fn.waypoint.noConflict = function () {
//     $.fn.waypoint = old;
//     return this;
//   };

//   $(document).ready(function () {
//     $('.js-waypoint').waypoint();
//   });

// })(jQuery);