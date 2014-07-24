//yes, i know that native methods like getElement... faster, but this is minimalistic library, if you want, you can improve it yourself
(function () {
   window.j = function (selector) {
		return new Library(selector);
	};

	if(!window.$) window.$ = window.j;
	 
	// In our Library we get our selector with querySelectorAll (we do not support < ie8)
	var Library = function (selector) {
		var query;
		if(typeof selector === 'string') {
			query = document.querySelectorAll(selector);
		} else if(selector instanceof Array) {
			query = selector;
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
	};
	j.fn = Library.prototype;

	//don't remove this method;
	j.match = function (el, selector) {
		var matchesSelector = el.matches 
				|| el.matchesSelector
				|| el.oMatchesSelector 
				|| el.mozMatchesSelector 
				|| el.webkitMatchesSelector 
				|| el.msMatchesSelector;

		return matchesSelector.call(el, selector);
	}

	//don't remove this method;
	j.fn.each = function (callback) {
		for (var i = 0, l = this.length; i < l ;i++) {
			if (callback.call(this[i], i) === false) break;
		}
	}


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//methods that can be removed


	j.fn.is = function (selector) {
		var r = false;

		this.each(function (i) {
			if(j.match(this,selector)) {
				r = true;
				return false;
			}
		})
		return r;
	}


	j.fn.find = function (selector) {
		var that = this,
			newArray = [],
			tq;//temporary query

		this.each(function (i) {
			tq = this.querySelectorAll(selector);
			if(tq.length) {
				newArray = newArray.concat(tq);
			}
		})
		return j(newArray);
	}

	j.fn.closest = function (selector) {
		var closestArr = [],
			parent;

		for (var i = 0, l = this.length; i < l ;i++) {
			if(j.match(this[i], selector)) {
				closestArr.push(this[i])
			} else {
				parent = this[i].parentNode;
				while( parent.tagName !== 'HTML') {
					if(j.match(parent, selector)) closestArr.push(parent);
					parent = parent.parentNode;
				}
			}
		}

		return j(closestArr);
	}


	j.fn.addClass = function (classes) {
		var arr = classes.split(' ');

		this.each(function(i) {
			for (var i = 0, l = arr.length; i < l ;i++) {
				this.classList.add(arr[i]);
			}
		});
		return this;
	}

	j.fn.removeClass = function (classes) {
		var arr = classes.split(' ');

		this.each(function(i) {
			for (var i = 0, l = arr.length; i < l ;i++) {
				this.classList.remove(arr[i]);
			}
		});
		return this;
	}

	//if one of elements has this class, return true
	j.fn.hasClass = function (name) {
		var r = false;

		this.each(function(i) {
			if(this.classList.contains(name)) {
				r = true;
				return false;
			}

		});
		return r;
	}

	//Get the value of an attribute for the first element in the set of matched elements or set one or more attributes for every matched element.
	j.fn.attr = function (name, value) {
		var mode,
			r;

		(value) ? mode = 'set' : mode = 'get';

		this.each(function() {
			if(mode === 'set') {
				this.setAttribute(name, value);
			} else {
				r =  this.getAttribute(name) || undefined;
				return false;
			}
		});

		if(mode === 'set') {
			return this;
		} else {
			return r;
		}
	}


	//Get the value of a style property for the first element in the set of matched elements or set one or more CSS properties for every matched element.
	j.fn.css = function (prop, value) {
		var mode,
			r;

		(value) ? mode = 'set' : mode = 'get';

		this.each(function () {
			if(mode === 'set') {
				this.style[prop] = value;
			} else {
				r = getComputedStyle(this, null)[prop] || undefined;
				return false;
			}
		})

		if(mode === 'set') {
			return this;
		} else {
			return r;
		}
	}
	













	
})();


