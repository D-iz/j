добавить event emitter

https://github.com/olado/microjs.com



//transitionDuration with delay
function getTransitionDuration (el, with_delay){
var style=window.getComputedStyle(el),
    duration = style.webkitTransitionDuration,
    delay = style.webkitTransitionDelay; 

// fix miliseconds vs seconds
duration = (duration.indexOf("ms")>-1) ? parseFloat(duration) : parseFloat(duration)*1000;
delay = (delay.indexOf("ms")>-1) ? parseFloat(delay) : parseFloat(delay)*1000;


if(with_delay) return (duration + delay);
else return duration;
}



//transition with prefix
function getTransitionProperty(element) {
  // Note that in some versions of IE9 it is critical that
  // msTransform appear in this list before MozTransform
  var properties = [
    'transition',
    'WebkitTransition',
    'msTransition',
    'MozTransition',
    'OTransition'
  ];
  var p;
  while (p = properties.shift()) {
    if (typeof element.style[p] != 'undefined') {
      return p;
    }
  }
  return false;
}
