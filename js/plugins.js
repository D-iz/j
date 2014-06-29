// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
// Place any jQuery/helper plugins in here.

/*
Old browsers need to clear the placeholder text before sending form data.
$('[placeholder]').placeholder('clear')
*/

// (function($){var native_support=('placeholder'in document.createElement('input'));$.fn.placeholder=function(command){if(!native_support){if(command){switch(command){case'clear':this.each(function(){var el=$(this);if(el.data('isEmpty')||el.val()==el.attr('placeholder')){el.val('')}});break}return this}this.each(function(){if(!$(this).data('gotPlaceholder')){$(this).focus(function(){var el=$(this);if(el.data('isEmpty')){el.val('').removeClass('placeholder')}}).blur(function(){var el=$(this);if(el.data('isEmpty')||!el.val().length){el.val(el.attr('placeholder')).addClass('placeholder')}}).keyup(function(){var el=$(this);el.data('isEmpty',(el.val().length==0))}).data('gotPlaceholder',true);if(!$(this).val().length||$(this).val()==$(this).attr('placeholder')){$(this).val($(this).attr('placeholder')).addClass('placeholder').data('isEmpty',true)}}})}return this}})(jQuery);
// $(function() {
//     $('[placeholder]').placeholder();
// });
