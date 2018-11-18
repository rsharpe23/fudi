; (function ($) {
  'use strict';

  function AnchorScroll($element, options) {
    // this.$element = $element;
    // this.options = options;
    this.$body = $('html, body');
  }

  AnchorScroll.DEFAULTS = {
    namespace: 'fudi.anchor-scroll'
  };

  AnchorScroll.getEvent = function () {
    return [].join.call(arguments, '.') + '.' + AnchorScroll.DEFAULTS.namespace;

    // return name + '.' + AnchorScroll.DEFAULTS.namespace;
  };

  AnchorScroll.prototype.run = function (target) {
    var targetTop = $(target).offset().top;
    this.$body.animate({ scrollTop: targetTop });

    // var $target = $(this.$element.data('target') || this.$element.attr('href'));
    // var targetTop = $target.position().top;
    // this.$body.animate({ scrollTop: targetTop });
  };


  function Plugin(param, options) {
    var namespace = AnchorScroll.DEFAULTS.namespace;
    var newOptions = $.extend({}, AnchorScroll.DEFAULTS, typeof options == 'object' && options);

    return this.each(function () {
      var $this = $(this);
      var instance = $this.data(namespace);

      if (instance) {
        instance.options = newOptions;
      } else {
        instance = new AnchorScroll($this, newOptions);
        $this.data(namespace, instance);
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

    var target = $this.data('target') || $this.attr('href');
    $this.anchorScroll(target);

    if ($this.is('a')) {
      e.preventDefault();
    }

    // var $context = $(this);
    // Plugin.call($context);

    // if ($context.is('a')) {
    //   e.preventDefault();
    // }
  });

})(jQuery);




// ; (function ($) {
//   'use strict';

//   function AnchorScroll($element, options) {
//     this.$element = $element;
//     this.options = options;
//     this.$body = $('html, body');
//   }

//   AnchorScroll.DEFAULTS = { 
//     namespace: 'fudi.anchor-scroll' 
//   };

//   AnchorScroll.getEvent = function (name) {
//     return name + '.' + AnchorScroll.DEFAULTS.namespace;
//   };

//   AnchorScroll.prototype.run = function () {
//     var $target = $(this.$element.data('target') || this.$element.attr('href'));
//     var targetTop = $target.position().top;
//     this.$body.animate({ scrollTop: targetTop });
//   };


//   function Plugin(param) {
//     var namespace = AnchorScroll.DEFAULTS.namespace;

//     return this.each(function () {
//       var $this = $(this);
//       var instance = $this.data(namespace);

//       if (!instance) {
//         var options = $.extend({}, AnchorScroll.DEFAULTS, typeof param == 'object' && param);
//         $this.data(namespace, instance = new AnchorScroll($this, options));
//       }

//       instance.run();
//     });
//   }

//   var old = $.fn.anchorScroll;

//   $.fn.anchorScroll = Plugin;
//   $.fn.anchorScroll.Constructor = AnchorScroll;

//   $.fn.anchorScroll.noConflict = function () {
//     $.fn.anchorScroll = old;
//     return this;
//   };


//   var dataApiEvent = AnchorScroll.getEvent('click');

//   $(document).on(dataApiEvent, '.js-anchor-toggle', function (e) {
//     var $context = $(this);
//     Plugin.call($context);

//     if ($context.is('a')) {
//       e.preventDefault();
//     }
//   });

// })(jQuery); 
