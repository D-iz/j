/*! Salt.js DOM Selector Lib. By @james2doyle */
// window.$ = function(selector, context, undefined) {
// 		// an object containing the matching keys and native get commands
// 		var matches = {
// 				'#': 'getElementById',
// 				'.': 'getElementsByClassName',
// 				'@': 'getElementsByName',
// 				'=': 'getElementsByTagName',
// 				'*': 'querySelectorAll'
// 		}[selector[0]]; // you can treat a string as an array of characters
// 		// now pass the selector without the key/first character
// 		var el = (((context === undefined) ? document: context)[matches ? matches : 'querySelectorAll'](matches ? selector.slice(1) : selector));
// 		// if there is one element than return the 0 element
// 		return ((el.length < 2) ? el[0]: el);
// };



// ;(function( $, window, document, undefined ) {
'use strict';

window.$ = function(selector, context) {
// an object containing the matching keys and native get commands
var matches = {
	'#': 'getElementById',
	'.': 'getElementsByClassName',
	'@': 'getElementsByName',
	'=': 'getElementsByTagName',
	'*': 'querySelectorAll'
}[selector[0]]; // you can treat a string as an array of characters
// now pass the selector without the key/first character
var el = (((context === undefined) ? document: context)[matches ? matches : 'querySelectorAll'](matches ? selector.slice(1) : selector));


// return (el)? ((el.length < 2) ? el[0]: el):document.createElement('div'); //if we have no found anything, return dummy element to avoid errors
return ((el.length < 2) ? el[0]: el);

};


// window.$ = function (selector, context) {
// 	var el = context?context:document['querySelectorAll'](selector);
// 	return (el.length < 2) ? el[0]: el;
// }

var el = window.Element.prototype,
	nl = window.NodeList.prototype,
	hc = window.HTMLCollection.prototype;

// another useful one for doing $('.inside').each()
nl.each = hc.each = Array.prototype.forEach;

// probably the most useful and allows $('#iddiv').find('.inside')
el.find = function(selector) { return $(selector, this) };

el.closest = function (selector) {
	var parent = this.parentNode,
		elements = document.querySelectorAll( selector ),
		index;
		
	while( parent.tagName !== 'HTML' ){
		for( index in elements ){
			if( elements[index] === parent ){
				return parent;
			}
		}
		parent = parent.parentNode;
	}
	return undefined;
}

//if need has/add/remove class for ie8-9, add polyfill | /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
// ;if("document" in self&&!("classList" in document.createElement("_"))){(function(j){"use strict";if(!("Element" in j)){return}var a="classList",f="prototype",m=j.Element[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.getAttribute("class")||""),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.setAttribute("class",this.toString())}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false;do{r=t[s]+"";var q=g(this,r);if(q!==-1){this.splice(q,1);o=true}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}return !o};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};


// $().addClass('name1 name2 name3');
el.addClass = function(classes) {
	var array = classes.split(' ');

	for (var i = 0, length = array.length; i < length; i++) {
		this.classList.add(array[i]);
	}
	return this;
};

nl.addClass = hc.addClass = function(classes){
	var array = classes.split(' ');
	this.each(function(el) {
		for (var i = 0, length = array.length; i < length; i++) {
			el.classList.add(array[i]);
		}
	});
	return this;
};

// $().removeClass('name1 name2 name3');
el.removeClass = function(classes) {
	// this.classList.add(name);
	var array = classes.split(' ');
	for (var i = 0, length = array.length; i < length; i++) {
		this.classList.remove(array[i]);
	}
	return this;
};

nl.removeClass = hc.removeClass = function(classes){
	var array = classes.split(' ');
	this.each(function(el) {
		for (var i = 0, length = array.length; i < length; i++) {
			el.classList.remove(array[i]);
		}
	});
	return this;
};

// $().hasClass('name');
el.hasClass = function(name) {
	return this.classList.contains(name);
};

nl.hasClass = hc.hasClass = function(name) {
	var success = false;
	this.each(function(el) {
		if(!success && el.classList.contains(name)) success = true;
	});
	return success;
};

//old ie classes
//.hasClass()


// window.Element.prototype.hasClass = function ( name ){
// 	return this.className.split( ' ' ).indexOf( name ) > -1
// }
// window.NodeList.prototype.hasClass = function(name) {
// 	var success = false;
// 	this.each(function(el) {
// 		if(!success && (el.className.split( ' ' ).indexOf( name ) > -1)) success = true;
// 	});
// 	return success;
// };

//.addClass()
// Element.prototype.addClass = function ( cName ){
// 	var classNames = this.className.split( ' ' );
// 	//if class doesn't allready exist
// 	if( classNames.indexOf( cName ) == -1 ){
// 		classNames.push( cName );
// 		this.className = classNames.join( ' ' );
// 	}
// }

// //.removeClass()
// Element.prototype.removeClass = function ( cName ) {
//   var classNames = this.className.split( ' ' );
//   var index = classNames.indexOf( cName );
//   //if classname exists.
//   if( classNames.indexOf( cName ) > -1 ){
//     classNames.splice( index, index );
//     this.className = classNames.join( ' ' );
//   }
// }

// $().attr('prop', 'value') support
el.attr = function(name, value) {
	if(value) {
		this.setAttribute(name, value);
		return this;
	} else {
		return this.getAttribute(name);
	}
};

nl.attr = hc.attr = function(name, value) {
	this.each(function(el) {
		if(value) {
			el.setAttribute(name, value);
		} else {
			return el.getAttribute(name);
		}
	});
	return this;
};

// $().css('prop', 'value') support
el.css = function(prop, value) {
	function getStyle(el, prop) {
		var computedStyle;

		if (document.defaultView && document.defaultView.getComputedStyle) { // standard (includes ie9)
			computedStyle = document.defaultView.getComputedStyle(el, null)[prop];
		} else if (el.currentStyle) { // IE < 9 
			computedStyle = el.currentStyle[prop];

		} else { // inline style
			computedStyle = el.style[prop];
		}
		return computedStyle;
	}

	if (value) {
		this.style[prop] = value;
		return this;
	} else {
		return getStyle(this,prop);
	}
};

nl.css = hc.css = function(prop, value) {
	this.each(function(el) {
		el.css(prop, value);
	});
	return this;
};


// window.Element.prototype.append = function() {
	
// };


el.html = function (html) {
	this.innerHTML = html;
	return this;
}
nl.html = hc.html = function(html) {
	this.each(function(el) {
		el.innerHTML = html;
	});
	return this;
};

el.remove = function () {
	this.parentNode.removeChild(this)
	return this;
}

nl.remove = hc.remove = function() {

	this.each(function(el) {
		el.parentNode.removeChild(el)
	});
	return this;
};

el.append = window.Element.prototype.appendChild;

el.prepend = function (el) {
	return this.insertBefore(el, this.firstChild);
}
el.before = function (el) {
	return this.parentNode.insertBefore(el, this);
}
el.after = function (el) {
	return this.parentNode.insertBefore(el, this.nextSibling);
}


// }
// window.HTMLCollection

// })( window.jQuery || false, window , document );


var t = $('.oak');

console.log(t)
// t.remove();

