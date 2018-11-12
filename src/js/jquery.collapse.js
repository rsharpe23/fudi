; (function ($) {
  'use strict';

  function Collapse($element, options) {
    this.$element = $element;
    this.options = options;
  }

  Collapse.DEFAULTS = { 
    namespace: 'fudi.collapse' 
  };

  Collapse.getEvent = function (name) {
    return name + '.' + Collapse.DEFAULTS.namespace;
  };

  Collapse.prototype.toggle = function () {
    var $target = $(this.$element.data('target') || this.$element.attr('href'));
    $target.slideToggle();
  };


  function Plugin(param) {
    var namespace = Collapse.DEFAULTS.namespace;

    return this.each(function () {
      var $this = $(this);
      var instance = $this.data(namespace);

      if (!instance) {
        var options = $.extend({}, Collapse.DEFAULTS, typeof param == 'object' && param);
        $this.data(namespace, instance = new Collapse($this, options));
      }

      instance.toggle();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };


  var dataApiEvent = Collapse.getEvent('click');

  $(document).on(dataApiEvent, '.js-collapse-toggle', function (e) {
    var $context = $(this);
    Plugin.call($context);

    if ($context.is('a')) {
      e.preventDefault();
    }
  });

})(jQuery);