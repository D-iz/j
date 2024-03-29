(function () {
	//you can't create elements with this function
	window.j = function(selector) {
		selector = selector || '';
		return new j.fn.init(selector);
	};
	if(!window.$) window.$ = window.j;

	j.match = function (el, selector) {
		if(el === document) el = document.documentElement;

		var matchesSelector = el.matches 
				|| el.matchesSelector
				|| el.oMatchesSelector 
				|| el.mozMatchesSelector 
				|| el.webkitMatchesSelector 
				|| el.msMatchesSelector;

		return matchesSelector.call(el, selector);
	}

	j.fn = j.prototype;

	j.fn.init = function (selector) {
		var query;

		if(typeof selector === 'string' && selector.length > 0) {
			//detect html input
			if(selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">") {
				(j.str2dom) ? query = j.str2dom(selector) : query = [];
			} else {
				query = document.querySelectorAll(selector);
			}
		} else if(selector instanceof Array || selector instanceof NodeList || selector instanceof HTMLCollection || selector instanceof j) {
			query = selector;
		} else if((window.Node && selector instanceof Node) || selector == selector.window || typeof selector === 'object') {
			query = [selector];
		} else if(typeof selector === 'function') {
			query = [document];
			document.addEventListener("DOMContentLoaded", selector);
		} else {
			query = [];
		}

		//save selector length
		this.length = query.length;

		for (var i = 0, l = this.length; i < l ;i++) {
			this[i] = query[i];
		}
		
		// Return as object
		return this;
	}
	j.fn.init.prototype = j.fn;//maked for using instenceOf operator(example: j('#test') instanceOf j)


	j.fn.each = function (callback) {
		for (var i = 0, l = this.length; i < l ;i++) {
			if (callback.call(this[i], i, this[i]) === false) break;
		}
		return this;
	}
}());


/////////////////////////////////////////////////////////////////////////
//methods that can be removed
/////////////////////////////////////////////////////////////////////////
//create DOM elements from string
//you can't create body tag with this func, if you need to create body tag, you can modify code, example you can find on next link - http://krasimirtsonev.com/blog/article/Revealing-the-magic-how-to-properly-convert-HTML-string-to-a-DOM-element
j.str2dom = function (html) {
	var wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		_default: [ 1, "<div>", "</div>" ]
	};

	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	var match = /<\s*\w.*?>/g.exec(html);
	var element = document.createElement('div');


	if (match != null) {
		var tag = match[0].replace(/</g, '') .replace(/>/g, '') .split(' ') [0];

		var map = wrapMap[tag] || wrapMap._default,
			element;

		html = map[1] + html + map[2];
		element.innerHTML = html;
		// Descend through wrappers to the right content

		var j = map[0];

		while (j--) {
			element = element.lastChild;
		}
		element = element.children;

		element = Array.prototype.slice.call(element);
	} else {
		element.innerHTML = html;
		element = element.lastChild;
	}
	return element;
}


//extend function from jQuery
j.isArray = function(a){return j.type(a)==="array"};
j.isFunction = function(a){return j.type(a)=="function"};
j.isPlainObject = function(f){var b,c={},a={}.hasOwnProperty;if(!f||j.type(f)!=="object"||f.nodeType||j.isWindow(f)){return false}try{if(f.constructor&&!a.call(f,"constructor")&&!a.call(f.constructor.prototype,"isPrototypeOf")){return false}}catch(d){return false}if(c.ownLast){for(b in f){return a.call(f,b)}}for(b in f){}return b===undefined||a.call(f,b)};
j.isWindow = function(a){return a!=null&&a==a.window};
j.type = function(c){var a=a={"[object Array]":"array","[object Boolean]":"boolean","[object Date]":"date","[object Error]":"error","[object Function]":"function","[object Number]":"number","[object Object]":"object","[object RegExp]":"regexp","[object String]":"string"},b=a.toString;if(c==null){return c+""}return typeof c==="object"||typeof c==="function"?a[b.call(c)]||"object":typeof c};
//for extend function we need: j.isArray, j.isFunction, j.isPlainObject, j.isWindow, j.type
j.extend = function(){
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !j.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( j.isPlainObject(copy) || (copyIsArray = j.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && j.isArray(src) ? src : [];

					} else {
						clone = src && j.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = j.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

//el sholud be dom element
j.inArray = function (arr, el) {
	if(!el) return this;

	for (var i = 0, l = arr.length; i < l ;i++) {
		if(arr[i] === el) {
			return i;
			break
		}
	}
	return -1;
}

//json wrapper
j.parseJSON = function (json) {
	return JSON.parse(json);
}


//document ready event
j.fn.ready = function (fn) {
	document.addEventListener("DOMContentLoaded", fn);
}

//(string|dom element|query|j collection)
j.fn.add = function (selector) {
	var newCollection = [],
		newQuery;

		//set old elements
		this.each(function (i) {
			newCollection[i] = this;
		})


	if(typeof selector === 'string') {
		newQuery = $(selector);
	} else if(selector.nodeType || selector === document || selector === window) {
		newQuery = [selector]
	} else if(selector instanceof j) {
		newQuery = selector;
	}

	for (var i = 0, l = newQuery.length; i < l ;i++) {
		newCollection.push(newQuery[i]);
	}

	return $(newCollection);
}

j.fn.attr = function (name, value) {
	if(typeof name === 'object') {
		return this.each(function () {
			for (var key in name) {
				this.setAttribute(key, name[key]);
			}
		})
	} else {
		if(value) {
			return this.each(function () {
				this.setAttribute(name, value);
			});
		} else {
			return this[0].getAttribute(name) || undefined;
		}
	}
}

j.fn.removeAttr = function (name) {
	return this.each(function () {
		this.removeAttribute(name);
	});
}

//Get the value of a style property for the first element in the set of matched elements or set one CSS property for every matched element.
j.fn.css = function (prop, value) {
	var that = this;
	if(!prop) return;
	
	if (prop == 'float') prop = 'styleFloat';

	function prefixed(prop) {//select proper prefix
		var vendorProp, 
			supportedProp,
			prefix,	
			prefixes = ["Webkit", "Moz", "O", "ms"],
			capProp = prop.charAt(0).toUpperCase() + prop.slice(1),// Capitalize first character of the prop to test vendor prefix
			div = that[0];		

		if(prop in div.style) {
			supportedProp = prop;// Browser supports standard CSS property name
		} else {
			for (var i = 0; i < prefixes.length; i++) {// Otherwise test support for vendor-prefixed property names
				vendorProp = prefixes[i] + capProp;

				if (vendorProp in div.style) {
					prefix = prefixes[i];
					supportedProp = vendorProp;
					break;
				} else {
					vendorProp = undefined;
				}

			}
		}


		return supportedProp;
	}


	if(typeof prop === 'object') {
		return this.each(function () {
			for (var key in prop) {
				this.style[prefixed(key)] = prop[key];
			}
		})
	} else {
		if(value) {
			return this.each(function () {
				this.style[prefixed(prop)] = value;
			});
		} else {
			return getComputedStyle(this[0], null)[prefixed(prop)] || undefined;
		}
	}
}

j.fn.html = function (html) {
	if(typeof html === 'number' || typeof html === 'string') {
		return this.each(function () {
			this.innerHTML = html;
		})
	} else {
		return this[0].innerHTML.trim() || undefined;
	}
}

j.fn.text = function (text) {
	if(text) {
		return this.each(function () {
			this.textContent = text;
		})
	} else {
		return this[0].textContent.trim() || undefined;
	}
}

//Check the current matched set of elements against a selector and return true if at least one of these elements matches the given arguments. (also compare with nodes and j collections)
j.fn.is = function (selector) {
	var r = false;

	//compare with selector
	if(typeof selector === 'string') {
		this.each(function (i) {
			if(j.match(this,selector)) {
				r = true;
				return false;
			}
		})
		return r;
	}

	//compare with document
	else if(selector === document) {
		this.each(function () {
			if (this === document) {
				r = true;
				return false;
			}
		})
		return r;
	}

	//compare with window
	else if(selector === window) {
		this.each(function () {
			if (this === window) {
				r = true;
				return false;
			}
		})
		return r;
	}

	//compare with dom element or j collection
	else if(selector.nodeType || selector instanceof j) {
		var compare = selector.nodeType ? [selector] : selector;

		this.each(function () {
			var el = this;

			for (i = 0; i < compare.length; i++) {
				if (el === compare[i]) {
					r = true;
					return false;
				}
			}

		})
		return r;

	}
}

//Get the descendants of each element in the current set of matched elements
j.fn.find = function (selector) {
	var newArray = [],
		tq;//temporary query

	this.each(function (i) {
		tq = Array.prototype.slice.call(this.querySelectorAll(selector),'')
		if(tq.length) {
			newArray = newArray.concat(tq);
		}
	})
	return j(newArray);
}

//required .is
//filter by selector or function
j.fn.filter = function (selector) {
	var newArray = [];

	if(typeof selector === 'string') {
		this.each(function (i, el) {
			if(j.match(el, selector)) {
				newArray.push(el);
			}
		})
	} else if(typeof selector === 'function') {
		this.each(function (i, el) {
			if(selector.call(this, i, el) === true) {
				newArray.push(el);
			}
		})
	}

	return j(newArray);
}

j.fn.children = function (selector) {
	var newArray = [];

	this.each(function (i) {
		var children = this.children;

		for (var i = 0, l = children.length; i < l ;i++) {
			if(!selector) {
				newArray.push(children[i]);
			} else {
				if(j.match(children[i], selector)) {
					newArray.push(children[i])
				}
			}
		}
	})
	return j(newArray);
}



//for closest method we need j.inArray
j.fn.closest = function (selector) {
	var closestArr = [],
		parent;

	for (var i = 0, l = this.length; i < l ;i++) {
		if(j.match(this[i], selector)) {
			closestArr.push(this[i])
		} else {
			parent = this[i].parentNode;
			if(parent === document) parent = document.documentElement;

			while(parent && parent.tagName !== 'HTML') {
				if(j.match(parent, selector) && j.inArray(closestArr, parent) === -1) closestArr.push(parent);
				parent = parent.parentNode;
			}
		}
	}

	return j(closestArr);
}










//Remove the set of matched elements from the DOM.
j.fn.remove = function () {
	return this.each(function () {
		if(this.parentNode) this.parentNode.removeChild(this);
	})
}

//simple cloning
j.fn.clone = function () {
	var cloned = [];

	this.each(function (i) {
		cloned.push(this.cloneNode( true ));
	});

	return j(cloned);
}

//Insert content
//this methods can't take html string, if you need to put html string, make smth like this (if html parser function included) - .append(j('<i>my html string</i>'))
//required j.fn.clone if use clone flag
j.fn._insert = function (content, clone, type) {
	return this.each(function () {
		var els = j(content),
			frag = document.createDocumentFragment();

		if(j.fn.clone && clone) els = j(content).clone();


		//insert all elements in fragment, because prepend method insert elements reversed, and also for perfomance
		els.each(function () {
			frag.appendChild( this );
		});

		switch(type) {
		case 'append':
		case 'appendTo':
			this.appendChild(frag);
		break;
		case 'prepend':
		case 'prependTo':
			this.insertBefore(frag, this.firstChild)
		break;
		case 'before':
			this.parentNode.insertBefore(frag, this);
		break;
		case 'after':
			this.parentNode.insertBefore(frag, this.nextSibling);
		break;
		}
	})
}

j.fn.append = function (content, clone) {
	return j.fn._insert.call(this, content, clone || false, 'append')
}
j.fn.prepend = function (content, clone) {
	return j.fn._insert.call(this, content, clone || false, 'prepend')
}
j.fn.before = function (content, clone) {
	return j.fn._insert.call(this, content, clone || false, 'before')
}
j.fn.after = function (content, clone) {
	return j.fn._insert.call(this, content, clone || false, 'after')
}
j.fn.prependTo = function (content, clone) {
	j.fn._insert.call(content, this, clone || false, 'prependTo');
	return this;
}
j.fn.appendTo = function (content, clone) {
	j.fn._insert.call(content, this, clone || false, 'appendTo');
	return this;
}









//data methods
//Store arbitrary data associated with the matched elements or return the value at the named data store for the first element in the set of matched elements.
j._toDashed = function (str) {
	return str.replace(/([A-Z])/g, function(u) {
		return "-" + u.toLowerCase();
	});
}
j._toCamel = function (str) {
	return str.replace(/-+(.)?/g, function(match, chr){ 
		return chr ? chr.toUpperCase() : '' 
	})
}
//need methods: j._toDashed, j._toCamel
j.fn.data = function (name, value) {
	var mode,
		r = this,
		elem = document.createElement('div'),
		dataSupport;

	if(!name && !value) {
		mode = false
	} else if(value) {
		mode = 'set'
		name = j._toCamel(name);
	} else if(name) {
		mode = 'get'
		name = j._toCamel(name);
	} 

	

	elem.setAttribute("data-a-b", "c");
	dataSupport = !!(elem.dataset && elem.dataset.aB === "c");

	//return all data attributes
	if(!mode) {
		var atr = {};
		if(dataSupport) {
			atr = this[0].dataset;
		} else {
			var atributes = this[0].attributes;
			for (var i = 0, l = atributes.length; i < l ;i++) {
				if(/^data-/.test(atributes[i].name)) {
					atr[j._toCamel(atributes[i].name.replace(/data\-/,''))] = atributes[i].value;
					
				}
			}
		}
		return atr;
	}


	if (dataSupport) {
		if(mode === 'set') {
			this.each(function () {
				this.dataset[name] = value;
			})
		} else {
			r = this[0].dataset[name];
		}

		//remove
		// delete node.dataset[name];
	} else {
		if(mode === 'set') {
			this.each(function () {
				this.setAttribute('data-' + j._toDashed(name), value);
			})
		} else {
			r = this[0].getAttribute('data-' + j._toDashed(name));
		}
	}
	return r;
}
//Remove a previously-stored piece of data. (space-separated string naming the pieces of data to delete)
//need methods: j._toDashed, j._toCamel
j.fn.removeData = function(name) {
	var arr = name.split(' '),
		elem = document.createElement('div'),
		dataSupport;

	elem.setAttribute("data-a-b", "c");
	dataSupport = !!(elem.dataset && elem.dataset.aB === "c");

	if(dataSupport) {
		this.each(function (i) {
			for (var i = 0, l = arr.length; i < l ;i++) {
				delete this.dataset[j._toCamel(arr[i])];
			}
		})
	} else {
		this.each(function (i) {
			for (var i = 0, l = arr.length; i < l ;i++) {
				this.removeAttribute('data-' + j._toDashed(arr[i]));
			}
		})
	}
}



j.fn.addClass = function (classes) {
	var classListExist = !!('classList' in document.createElement('p'))
	var arr = classes.split(' ');

	if(classListExist) {
		this.each(function() {
			for (var i = 0, l = arr.length; i < l ;i++) {
				this.classList.add(arr[i]);
			}
		});
	} else {//for ie9
		this.each(function () {
			var curClasses = " " + this.className + " ".replace( /[\t\r\n\f]/g, " " );

			for (var i = 0, l = arr.length; i < l ;i++) {

				if(curClasses.indexOf(' ' + arr[i] + ' ') === -1) {
					this.className += ' '+arr[i];
				}

			}

		})
	}
	return this;
}

j.fn.removeClass = function (classes) {
	var classListExist = !!('classList' in document.createElement('p'));
	var arr = classes.split(' ');
	var origClasses;

	if(classListExist) {
		this.each(function(i) {
			for (var i = 0, l = arr.length; i < l ;i++) {
				this.classList.remove(arr[i]);
			}
		});
	} else {//for ie9
		this.each(function () {
			origClasses = this.className;
			
			for (var i = 0, l = arr.length; i < l ;i++) {
				origClasses = origClasses.replace(new RegExp(' ?'+ arr[i]), '')
			}
			this.className = origClasses;
		})
	}
	
	return this;
}

j.fn.hasClass = function (name) {//if one of elements has this class, return true
	var classListExist = !!('classList' in document.createElement('p'))
	var r = false;

	if(classListExist) {
		this.each(function(i) {
			if(this.classList.contains(name)) {
				r = true;
				return false;
			}
		});
	} else {//for ie9
		this.each(function (i) {
			if(this.className.indexOf(name) > -1) {
				r = true;
				return false;
			}
		})
	}
	return r;
}






//old, simple methods
// j.fn.on = function (type, fn) {
// 	return this.each(function () {
// 		this.addEventListener( type, fn, false );
// 	})
// }

// j.fn.off = function (type, fn) {
// 	return this.each(function () {
// 		this.removeEventListener( type, fn, false );
// 	})
// }

//simple delegate method
// j.fn.delegate = function (selector, event, fn) {
// 	return this.each(function (i) {
// 		var parent = this;

// 		$(this).on(event, function (e) {
// 			var target = e && e.target || window.event.srcElement;

// 			for (var i = 0, l = e.path.length; i < l ;i++) {
// 				if(e.path[i] === parent) break;//don't check all dom
// 				if(e.path[i] !== document && j.match(e.path[i], selector)) {
// 					fn.call(e.path[i], e);
// 					break;//if we find needed el, don't need to check all other dom elements
// 				}
// 			}

// 			// if(j.match(target,selector)) {
// 			// 	fn.call(target, e);
// 			// }
// 		})

// 	})
// }

j.fn.on = function (types, selector, data, fn, one) {//one - internal
	//set proper links to variables, depends on how much arguments were passed
	if ( data == null && fn == null ) {
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {
			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {
			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}

	if ( fn === false ) {
		fn = function () {
			return false;
		};
	} else if ( !fn ) {
		return this;
	}

	

	var events = types.split(' ');
	//todo доделать ивенты к любым объектам
	// var isNode;
	// isNode = 'nodeType' in this || 'nodeName' in this;
	return this.each(function () {
		var parent = this,
			tmp,
			type,
			bindType,
			namespaces;

		for (var i = 0, l = events.length; i < l ;i++) {
			tmp = /^([^.]*)(?:\.(.+)|)$/.exec( events[i] ) || [];
			type = tmp[1];
			tmp[2] ? namespaces = ( tmp[2] ).split( "." ).sort() : namespaces = [];

			bindType = type;

			if(type === 'mouseenter') {
				bindType = 'mouseover';
				namespaces.push('_mouseenter')
			}
			if(type === 'mouseleave') {
				bindType = 'mouseout';
				namespaces.push('_mouseleave')
			}

			if (!this._events) this._events = {};
			if (!this._events[type]) this._events[type] = [];

			var obj = {
				delegateTarget: parent,
				handleEvent: function (e) {
					e = e || window.event;

					e = function fixEvent(e) {
						e.data = data;

						//normalize relatedTarget
						if (!e.relatedTarget) {
							if (e.type == 'mouseover') e.relatedTarget = e.fromElement;
							if (e.type == 'mouseout') e.relatedTarget = e.toElement;
						}

						//fix path
						if(!e.path) {
							e.path = [];
							var node = e.target;
							// while(node != document) {//check for document - fix for chrome, as chrome used native path that contain document el
							while(node) {
								e.path.push(node);
								node = node.parentNode;
							}
						}

						// Support: Safari 6.0+, Chrome<28
						// Target should not be a text node (# 504, # 13143)
						if ( e.target && e.target.nodeType === 3 ) {
							e.target = e.target.parentNode;
						}


						//normalize which form jQuery
						var	rkeyEvent = /^key/,
							rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/;

						if(rkeyEvent.test(e.type)) {//if this is key event
							if (e.which == null) {
								e.which = e.charCode != null ? e.charCode : e.keyCode;
							}
						} else if(rmouseEvent.test(e.type)) {//if this is mouse event
							if (!e.which && e.button !== undefined ) {
								e.which = ( e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ) );
							}
						}

						return e;
					}(e);

					e.handleObj = this;

					if(!this.selector) {//usual addEventListener
						handleFunction();
					} else {//delegate listener
						for (var k = 0, l2 = e.path.length; k < l2 ;k++) {
							if(e.path[k].toString() === '[object ShadowRoot]') continue;
							if(e.path[k] === parent) break;//don't check all dom
							if(e.path[k] !== document && j.match(e.path[k], this.selector)) {
								obj.el = e.path[k];

								handleFunction(true);
								break;//if we find needed el, don't need to check all other dom elements
							}
						}
					}

					function handleFunction(delegate) {
						var type = e.handleObj.type,
							handler = e.handleObj.handler;

						if(type === 'mouseenter' || type === 'mouseleave') {
							var related = e.relatedTarget,
								parent = e.handleObj.el || e.handleObj.delegateTarget;

							if(!related || (related !== parent && !parent.contains(related))) {
								fire();
							}
						} else {
							fire();
						}

						function fire() {
							var args;

							//add trigger data to argument when calling handler
							if(e.triggerData && e.triggerData.length) {
								args = e.triggerData.slice(0)
								args.unshift(e);
								delete e.triggerData;
							} else {
								args = [e];
							}

							if(delegate) {
								var thisEl = e.handleObj.el;
							} else {
								var thisEl = e.handleObj.delegateTarget;
							}

							//handle namespacing while calling handler
							if(e.triggerNamespace && e.triggerNamespace.length) {
								if(e.triggerNamespace.length > 1) {
									var re = new RegExp( "(^|\\.)" + e.triggerNamespace.join("\\.(?:.*\\.|)") + "(\\.|$)" ),
										handler_namespaces = e.handleObj.namespace.join('.');

									if(re.test(handler_namespaces)) {
										handler.apply(thisEl, args);

										if(one) $(parent).off(type, handler);
									}
								} else {
									if(j.inArray(e.handleObj.namespace, e.triggerNamespace[0]) !== -1) {
										handler.apply(thisEl, args);

										if(one) $(parent).off(type, handler);
									}
								}
							} else {
								handler.apply(thisEl, args);

								if(one) {
									$(parent).off(type, handler);
								}
							}
						}
					}
				}
			}

			obj.type = type;
			obj.data = data;
			obj.handler = fn;

			obj.selector = selector;
			obj.namespace = namespaces;

			this._events[type].push(obj);

			this.addEventListener(bindType, obj, false );
		}
	})
}

j.fn.one = function (types, selector, data, fn) {
	this.on(types, selector, data, fn, 1);
}

//for off method we need j.inArray
j.fn.off = function (types, fn) {
	types = types || '';

	var events = types.split(' ');

	return this.each(function () {
		var _events = this._events,
			that = this,
			tmp,
			type,
			namespaces;
		if (!_events) return;

		for (var i = 0, l = events.length; i < l ;i++) {
			tmp = /^([^.]*)(?:\.(.+)|)$/.exec( events[i] ) || [];
			//detect current type
			type = tmp[1];
			//detect namespaces
			tmp[2] ? namespaces = ( tmp[2] ).split( "." ).sort() : namespaces = [];
			//clear namespaces from duplicates
			namespaces = namespaces.filter (function (v, i, a) { return a.indexOf (v) == i });

			


			if(type) {//we have type
				if(!_events[type] || !_events[type].length) return;//we have no handlers with this type

				if(namespaces.length) {//we have type and namespaces
					removeNamespacedListener.call(this);//search on every handler of this type
				} else {//if we have type, but no namespaces
					for (var i2 = 0, l2 = _events[type].length; i2 < l2; i2++) {//search on every handler of this type
						removeListener.call(this,type,i2)
					}
				}
				clearEvents(type);
			} else {//no type
				if(namespaces.length) {//we have no type, but have namespaces
					for (var type in _events) {
						if (_events.hasOwnProperty(type)) {
							removeNamespacedListener.call(this);//search on every handler of this type
						}
					}
				} else {//we have no type and no namespaces, remove all
					for (var type in _events) {
						if (_events.hasOwnProperty(type)) {
							for (var i2 = 0, l2 = _events[type].length; i2 < l2; i2++) {//search on every handler of this type
								removeListener.call(this,type,i2)
							}
						}
					}
				}
				clearEvents();
			}
		}
		


		function removeNamespacedListener() {
			for (var i2 = 0, l2 = _events[type].length; i2 < l2; i2++) {//search on every handler of this type
				if(namespaces.length > 1) {
					var re = new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ),
						handler_namespaces = _events[type][i2].namespace.join('.');

					if(re.test(handler_namespaces)) {
						removeListener.call(this,type,i2)
					}
				} else {
					if(j.inArray(_events[type][i2].namespace, namespaces[0]) !== -1) {
						removeListener.call(this,type,i2)
					}

				}
			}
		}

		function removeListener(type, k) {
			var removeType = type;
			if(type === 'mouseenter') {
				removeType = 'mouseover'
			}

			if(type === 'mouseleave') {
				removeType = 'mouseout'
			}


			if(!fn || (fn && _events[type][k].handler === fn)) {
				//remove listener
				this.removeEventListener( removeType, _events[type][k], false );
				//removeInfo from internal data
				delete _events[type][k];
			} else {
				return false;
			}
		}

		function clearEvents(type) {
			if(type) {
				//clear _events from undefined values
				_events[type] = _events[type].filter(function(e){return e});
				//remove empty sections
				if(!_events[type].length) delete _events[type];
			} else {
				for (var key in _events) {
					if (_events.hasOwnProperty(key)) {
						//clear _events from undefined values
						_events[key] = _events[key].filter(function(e){return e});
						//remove empty sections
						if(!_events[key].length) delete _events[key];
					}
				}
			}

			//delete _events object form dom element if there are no events
			var emptyEvents = true;
			for (var prop in _events) {
				if(_events.hasOwnProperty(prop)) {
				    emptyEvents = false;
					break;
				}
			}
			if(emptyEvents) delete that._events;
		}

	});
}



//for now trigger and triggerHandler are same method...
//using old implementation of events, because of ie...
j.fn.trigger = function (types, triggerData) {
	var events = types.split(' ');

	if(events.length > 1) return;//don't handle triggering multiple events

	return this.each(function (i) {
		var event = document.createEvent('HTMLEvents'),
			tmp,
			type,
			namespaces;

		tmp = /^([^.]*)(?:\.(.+)|)$/.exec( events[0] ) || [];
		type = tmp[1];
		tmp[2] ? namespaces = ( tmp[2] ).split( "." ).sort() : namespaces = [];


		if(type) {
			event.initEvent(type, true, true);
			event.eventName = type;
			if(triggerData) event.triggerData = triggerData;
			if(namespaces.length) event.triggerNamespace = namespaces;

			event.target = this;
			this.dispatchEvent(event);
		} else {//don't trigger events only with namespace
			return;
		}
	})
}
j.fn.triggerHandler = function (types, triggerData) {
	var events = types.split(' ');

	if(events.length > 1) return;//don't handle triggering multiple events

	var el = this[0];

	var event = document.createEvent('HTMLEvents'),
		tmp,
		type,
		namespaces;

	tmp = /^([^.]*)(?:\.(.+)|)$/.exec( events[0] ) || [];
	type = tmp[1];
	tmp[2] ? namespaces = ( tmp[2] ).split( "." ).sort() : namespaces = [];


	if(type) {
		event.initEvent(type, false, true);
		event.eventName = type;
		if(triggerData) event.triggerData = triggerData;
		if(namespaces.length) event.triggerNamespace = namespaces;

		event.target = el;
		el.dispatchEvent(event);
	} else {//don't trigger events only with namespace
		return;
	}
	

	return undefined;
}



// //todo, change trigger methods, because of using old implementation
// j.fn.trigger = function (type, data) {
// 	return this.each(function (i) {
// 		var event = document.createEvent('HTMLEvents');
// 		event.initEvent(type, true, true);
// 		event.data = data || [];
// 		event.eventName = type;
// 		event.target = this;
// 		this.dispatchEvent(event);
// 		// return this;
// 	})
// }

// j.fn.triggerHandler = function (type, data) {
// 	var event = document.createEvent('HTMLEvents');
// 	event.initEvent(type, false, true);
// 	event.data = data || [];
// 	event.eventName = type;
// 	event.target = this[0];
// 	this[0].dispatchEvent(event);
// 	return this;
// }







//remove all children
j.fn.empty = function () {
	return this.each(function () {
		while (this.firstChild) {
		    this.removeChild(this.firstChild);
		}
	})
}

j.fn.val = function (value) {
	if(value) {
		return this.each(function () {
			this.value = value;
		})
	} else {
		return this[0].value;
	}
}

//work same as in jquery
j.fn.index =  function (selector) {
	var that = this;
	if(selector) {
		var r;
		if(selector.nodeType || selector instanceof j) {
			var newSelector;
			(selector.nodeType) ? newSelector = selector : newSelector = selector[0];
			this.each(function (i) {
				if(this === newSelector) {
					r = i;
					return false;
				} else {
					r = -1;
				}
			})
		} else if(typeof selector === 'string') {
			var queryFrom;
			(typeof selector === 'string') ? queryFrom = $(selector) : queryFrom = selector;

			queryFrom.each(function (i) {
				if(that[0] === this) {
					r = i;
					return false;
				}
			})
		}
		return r;
		
	} else {//position relative to its sibling elements
		var el = this[0],
			i = 0;
		while ((el = el.previousSibling) !== null) {
			if (el.nodeType === 1) i++;
		}
		return i;
	}
}

j.fn.not = function (selector) {
	var neededElements = [];

	this.each(function () {
		if(!j.match(this, selector)) {
			neededElements.push(this)
		}
	})
	return j(neededElements);
}

j.fn.focus = function () {
	return this.each(function () {
		try {
			this.focus();
		} catch ( e ) {}
	})
}

j.fn.first = function () {//.first() method constructs a new j object from the first element in that set
	return j(this[0]);
}

//works only as getter
j.fn._scroll = function (dir) {
	var el = this[0];
	if(el === window) {
		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

		if(dir === 'x') {
			return supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
		} else if(dir === 'y') {
			return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
		}
	} else {
		if(dir === 'x') {
			return el.scrollLeft;
		} else if(dir === 'y') {
			return el.scrollTop;
		}
	}
}
//works only as getter, needs j.fn._scroll to work
j.fn.scrollTop = function () {
	return j.fn._scroll.call(this, 'y');
}
//works only as getter, needs j.fn._scroll to work
j.fn.scrollLeft = function () {
	return j.fn._scroll.call(this, 'x');
}

j.fn.outerWidth = function () {
	return this[0].offsetWidth;
};

j.fn.outerHeight = function () {
	return this[0].offsetHeight;	
}












// j.fn.transform = function (transform) {
// 	return this.each(function () {
// 		var elStyle = this.style;
// 		elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
// 	})
// }

// j.fn.transition = function (duration) {
// 	if (typeof duration !== 'string') {
// 		duration = duration + 'ms';
// 	}

// 	return this.each(function () {
// 		var elStyle = this.style;
// 		elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
// 	});
// }


























/////////////////////////////////////////////////////////////////////////
//Internet Explorer
/////////////////////////////////////////////////////////////////////////
//for ie <9
//потестить более короткую версию
// function addEvent(evnt, elem, func) {
//    if (elem.addEventListener)  // W3C DOM
//       elem.addEventListener(evnt,func,false);
//    else if (elem.attachEvent) { // IE DOM
//       elem.attachEvent("on"+evnt, func);
//    }
//    else { // No much to do
//       elem[evnt] = func;
//    }
// }

// j.fn.on = function (type, fn) {//thanks John Resig
// 	return this.each(function () {
// 		var obj = this;
// 		if ( obj.attachEvent ) {
// 			obj['e'+type+fn] = fn;
// 			obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
// 			obj.attachEvent( 'on'+type, obj[type+fn] );
// 		} else {
// 			obj.addEventListener( type, fn, false );
// 		}
// 	})
// }

// j.fn.off = function (type, fn) {
// 	return this.each(function () {
// 		var obj = this;
// 		if ( obj.detachEvent ) {
// 			obj.detachEvent( 'on'+type, obj[type+fn] );
// 			obj[type+fn] = null;
// 		} else {
// 			obj.removeEventListener( type, fn, false );
// 		}
// 	})
// }










