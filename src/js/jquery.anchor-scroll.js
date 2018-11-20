; (function ($) {
  'use strict';

  function AnchorScroll($element, options) {
    this.$body = $('html, body');
  }

  AnchorScroll.DEFAULTS = {
    namespace: 'fudi.anchor-scroll'
  };

  AnchorScroll.getEvent = function () {
    return [].join.call(arguments, '.') + '.' + AnchorScroll.DEFAULTS.namespace;
  };

  AnchorScroll.prototype.run = function (target) {
    var targetTop = $(target).offset().top;
    this.$body.animate({ scrollTop: targetTop });
  };


  function Plugin(param) {
    var namespace = AnchorScroll.DEFAULTS.namespace;

    return this.each(function () {
      var $this = $(this);
      var instance = $this.data(namespace);

      if (!instance) {
        $this.data(namespace, instance = new AnchorScroll());
      }

      instance.run(param);
    });
  }

  var old = $.fn.anchorScroll;

  $.fn.anchorScroll = Plugin;
  $.fn.anchorScroll.Constructor = AnchorScroll;

  $.fn.anchorScroll.noConflict = function () {
    $.fn.anchorScroll = old;
    return this;
  };


  var clickEvent = AnchorScroll.getEvent('click');

  $(document).on(clickEvent, '.js-anchor-toggle', function (e) {
    var $this = $(this);

    var param = $this.data('target') || $this.attr('href');
    $this.anchorScroll(param);

    if ($this.is('a')) {
      e.preventDefault();
    }
  });

})(jQuery);