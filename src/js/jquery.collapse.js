; (function ($) {
  'use strict';

  function Collapse($element, options) {}

  Collapse.DEFAULTS = {
    namespace: 'fudi.collapse'
  };

  Collapse.getEvent = function () {
    return [].join.call(arguments, '.') + '.' + Collapse.DEFAULTS.namespace;
  };

  Collapse.prototype.toggle = function (target) {
    $(target).slideToggle();
  };


  function Plugin(param) {
    var namespace = Collapse.DEFAULTS.namespace;

    return this.each(function () {
      var $this = $(this);
      var instance = $this.data(namespace);

      if (!instance) {
        $this.data(namespace, instance = new Collapse());
      }

      instance.toggle(param);
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };


  var clickEvent = Collapse.getEvent('click');

  $(document).on(clickEvent, '.js-collapse-toggle', function (e) {
    var $this = $(this);

    var param = $this.data('target') || $this.attr('href');
    $this.collapse(param);

    if ($this.is('a')) {
      e.preventDefault();
    }
  });

})(jQuery);