// FIX: Перенести весь доступ к свойствам data из методов класса в обработчики событий 

; (function ($) {
  'use strict';

  function AnimateCss($element, options) {
    this.$element = $element;
    this.options = options;
  }

  AnimateCss.DEFAULTS = {
    namespace: 'fudi.animate-css',
    delay: 0
  };

  AnimateCss.prototype.play = function (anim) {
    if (!anim) {
      throw new Error('Anim is false');
    }

    if (typeof anim == 'string') {
      setAnim.call(this, anim);
    } else if (typeof anim == 'object') {
      setAnimThoughMedia.call(this, anim);
    }
  };

  function setAnimThoughMedia(animObj) {
    var breakPoints = Object.keys(animObj);

    var result = breakPoints.filter(function (breakPoint) {
      var query = '(min-width:' + breakPoint + ')';
      return window.matchMedia(query).matches;
    });

    // HACK: здесь для назначения анимации применяется apply, а не call, 
    // поэтому необходимо полученный результат дополнительно слить в пустой массив; 
    // в противном же случае может возникнуть исключение, 
    // т.к. результатом может быть просто строка с названием анимации, 
    // а не массив с названием и задержкой.
    var animArr = [].concat(animObj[result.pop()]);

    setAnim.apply(this, animArr);
  }
 
  function setAnim(name, delay) {
    this.$element.addClass(['animated', name].join(' '));
    setAnimDelay.call(this, delay);
  }

  function setAnimDelay(delay) {
    delay || (delay = this.options.delay);

    if (delay > 0) {
      this.$element.css('animation-delay', delay + 'ms');
    }

    return !!delay;
  }

  function Plugin(param, options) {
    var namespace = AnimateCss.DEFAULTS.namespace;
    var newOptions = $.extend({}, AnimateCss.DEFAULTS, typeof options == 'object' && options);

    return this.each(function () {
      var $this = $(this);
      var instance = $this.data(namespace);

      if (instance) {
        instance.options = newOptions;
      } else {
        instance = new AnimateCss($this, newOptions);
        $this.data(namespace, instance);
      }

      instance.play(param);
    });
  }

  var old = $.fn.animateCss;

  $.fn.animateCss = Plugin;
  $.fn.animateCss.Constructor = AnimateCss;

  $.fn.animateCss.noConflict = function () {
    $.fn.animateCss = old;
    return this;
  };

  $('.js-animate.js-waypoint').one('stay.fudi.waypoint', function () {
    var $this = $(this);

    var anim = $this.data('anim');
    var delay = $this.data('anim-delay');

    $this.animateCss(anim, { delay: delay });
  });



})(jQuery);
