; (function ($) {
  'use strict';

  function Carousel($element, options) {
    this.$element = $element;
    this.options = options;
    this.sliding = false;
    this.cycle = null;
    this.pointsModel = new PointsModel(this.$element);
    this.itemsModel = new ItemsModel(this.$element);

    var enterEvent = Carousel.getEvent('mouseenter');
    var leaveEvent = Carousel.getEvent('mouseleave');

    this.options.pause && this.$element
      .on(enterEvent, $.proxy(this.stop, this))
      .on(leaveEvent, $.proxy(this.start, this));
  }

  Carousel.DEFAULTS = {
    namespace: 'fudi.carousel',
    pause: true,
    interval: 3000
  };

  Carousel.getEvent = function (name) {
    return name + '.' + Carousel.DEFAULTS.namespace;
  }

  Carousel.prototype.start = function () {
    this.stop();

    var handler = $.proxy(this.next, this);
    var timeout = this.options.interval;

    if (!timeout) {
      return;
    }

    this.cycle = setInterval(handler, timeout)
  };

  Carousel.prototype.stop = function () {
    if (!this.cycle) {
      return;
    }

    clearInterval(this.cycle);
  };

  Carousel.prototype.next = function () {
    if (this.sliding) {
      return;
    }

    var $currentItem = this.itemsModel.current();
    var isLast = $currentItem.index() == this.itemsModel.length - 1;

    var $newItem = isLast ? this.itemsModel.first() : $currentItem.next();
    var $newPoint = this.pointsModel.find($newItem.index());

    slide.call(this, $newItem, $newPoint, 'is-next', 'is-left');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) {
      return;
    }

    var $currentItem = this.itemsModel.current();
    var isFirst = $currentItem.index() == 0;

    var $newItem = isFirst ? this.itemsModel.last() : $currentItem.prev();
    var $newPoint = this.pointsModel.find($newItem.index());

    slide.call(this, $newItem, $newPoint, 'is-prev', 'is-right');
  };

  Carousel.prototype.to = function (index) {
    if (this.sliding) {
      return;
    }

    var currentIndex = this.itemsModel.current().index();
    if (currentIndex == index) {
      return;
    }

    var $newItem = this.itemsModel.find(index);
    var $newPoint = this.pointsModel.find($newItem.index());

    var typeDir = (currentIndex > index) ? ['is-prev', 'is-right'] : ['is-next', 'is-left'];
    slide.apply(this, [$newItem, $newPoint].concat(typeDir));
  };

  function slide($newItem, $newPoint, typeClassName, dirClassName) {
    var ACTIVE_CLASS_NAME = 'is-active';

    if (!$newItem.length || $newItem.hasClass(ACTIVE_CLASS_NAME)) {
      return;
    }

    this.sliding = true;
    $newItem.addClass(typeClassName);
    $newItem[0].offsetWidth;

    var $currentItem = this.itemsModel.current();

    $currentItem.addClass(dirClassName);
    $newItem.addClass(dirClassName);

    var self = this;
    var timeout = transition.duration(this.itemsModel.getSelector());

    setTimeout(function () {
      $currentItem.removeClass([ACTIVE_CLASS_NAME, dirClassName].join(' '));
      $newItem.removeClass([typeClassName, dirClassName].join(' ')).addClass(ACTIVE_CLASS_NAME);
      self.sliding = false;
    }, timeout);

    var $currentPoint = this.pointsModel.current();

    $currentPoint.removeClass(ACTIVE_CLASS_NAME);
    $newPoint.addClass(ACTIVE_CLASS_NAME);
  };


  function ElementsModel($element) {
    this.$content = $element.find(this.getSelector());
  }

  Object.defineProperty(ElementsModel.prototype, "length", {
    get: function () {
      return this.$content.length;
    }
  });

  ElementsModel.prototype.getSelector = function () { };

  ElementsModel.prototype.current = function () {
    return this.$content.filter('.is-active');
  };

  ElementsModel.prototype.find = function (index) {
    return this.$content.eq(index);
  };


  function PointsModel($element) {
    ElementsModel.call(this, $element)
  }

  PointsModel.prototype = Object.create(ElementsModel.prototype);
  PointsModel.prototype.constructor = PointsModel;

  PointsModel.prototype.getSelector = function () {
    return '.carousel-point';
  };


  function ItemsModel($element) {
    ElementsModel.call(this, $element);
  }

  ItemsModel.prototype = Object.create(ElementsModel.prototype)
  ItemsModel.prototype.constructor = ItemsModel;

  ItemsModel.prototype.getSelector = function () {
    return '.carousel-item';
  }

  ItemsModel.prototype.first = function () {
    return this.$content.first();
  };

  ItemsModel.prototype.last = function () {
    return this.$content.last();
  };


  function Plugin(option) {
    var namespace = Carousel.DEFAULTS.namespace;

    return this.each(function () {
      var $this = $(this);
      var instance = $this.data(namespace);

      if (!instance) {
        var options = $.extend({}, Carousel.DEFAULTS, typeof option == 'object' && option);
        $this.data(namespace, instance = new Carousel($this, options));
      }

      if (typeof option == 'string') {
        instance[option]();
      } else if (typeof option == 'number') {
        instance.to(option);
      } else {
        instance.start();
      }
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };


  var clickEvent = Carousel.getEvent('click');

  var clickHandler = function (e) {
    var $this = $(this);

    var $context = $this.closest('.js-carousel');
    var option = $this.data('slide') || +$this.attr('data-index');

    Plugin.call($context, option);

    if ($this.is('a')) {
      e.preventDefault();
    }
  };

  $(document)
    .on(clickEvent, '[data-index]', clickHandler)
    .on(clickEvent, '[data-slide]', clickHandler);


  var loadEvent = Carousel.getEvent('load');

  $(window).on(loadEvent, function () {
    $('.js-carousel').each(function () {
      Plugin.call($(this));
    });
  });

})(jQuery);
