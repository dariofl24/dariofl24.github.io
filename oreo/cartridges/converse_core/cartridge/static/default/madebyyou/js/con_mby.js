(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var callToStart = require('domready');

var App = require('./app.js');

callToStart( function() {
    var id = "con_mby";
    window[id] = new App({$el:$('#'+id)});
});



},{"./app.js":16,"domready":2}],2:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],3:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to pool arrays and objects used internally */
  var arrayPool = [],
      objectPool = [];

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
  var keyPrefix = +new Date + '';

  /** Used as the size when optimizations are enabled for large arrays */
  var largeArraySize = 75;

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match leading whitespace and zeros to be removed */
  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
    'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as an internal `_.debounce` options object */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.indexOf` without support for binary searches
   * or `fromIndex` constraints.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value or `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var type = typeof value;
    cache = cache.cache;

    if (type == 'boolean' || value == null) {
      return cache[value] ? 0 : -1;
    }
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value;
    cache = (cache = cache[type]) && cache[key];

    return type == 'object'
      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
      : (cache ? 0 : -1);
  }

  /**
   * Adds a given value to the corresponding cache object.
   *
   * @private
   * @param {*} value The value to add to the cache.
   */
  function cachePush(value) {
    var cache = this.cache,
        type = typeof value;

    if (type == 'boolean' || value == null) {
      cache[value] = true;
    } else {
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value,
          typeCache = cache[type] || (cache[type] = {});

      if (type == 'object') {
        (typeCache[key] || (typeCache[key] = [])).push(value);
      } else {
        typeCache[key] = true;
      }
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default callback when a given
   * collection is a string value.
   *
   * @private
   * @param {string} value The character to inspect.
   * @returns {number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ac = a.criteria,
        bc = b.criteria,
        index = -1,
        length = ac.length;

    while (++index < length) {
      var value = ac[index],
          other = bc[index];

      if (value !== other) {
        if (value > other || typeof value == 'undefined') {
          return 1;
        }
        if (value < other || typeof other == 'undefined') {
          return -1;
        }
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to return the same value for
    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
    //
    // This also ensures a stable sort in V8 and other engines.
    // See http://code.google.com/p/v8/issues/detail?id=90
    return a.index - b.index;
  }

  /**
   * Creates a cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [array=[]] The array to search.
   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
   */
  function createCache(array) {
    var index = -1,
        length = array.length,
        first = array[0],
        mid = array[(length / 2) | 0],
        last = array[length - 1];

    if (first && typeof first == 'object' &&
        mid && typeof mid == 'object' && last && typeof last == 'object') {
      return false;
    }
    var cache = getObject();
    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

    var result = getObject();
    result.array = array;
    result.cache = cache;
    result.push = cachePush;

    while (++index < length) {
      result.push(array[index]);
    }
    return result;
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} match The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Gets an object from the object pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Object} The object from the pool.
   */
  function getObject() {
    return objectPool.pop() || {
      'array': null,
      'cache': null,
      'criteria': null,
      'false': false,
      'index': 0,
      'null': false,
      'number': null,
      'object': null,
      'push': null,
      'string': null,
      'true': false,
      'undefined': false,
      'value': null
    };
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Releases the given object back to the object pool.
   *
   * @private
   * @param {Object} [object] The object to release.
   */
  function releaseObject(object) {
    var cache = object.cache;
    if (cache) {
      releaseObject(cache);
    }
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given context object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns the `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /**
     * Used for `Array` method references.
     *
     * Normally `Array.prototype` would suffice, however, using an array literal
     * avoids issues in Narwhal.
     */
    var arrayRef = [];

    /** Used for native method references */
    var objectProto = Object.prototype;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to resolve the internal [[Class]] of values */
    var toString = objectProto.toString;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        setTimeout = context.setTimeout,
        splice = arrayRef.splice,
        unshift = arrayRef.unshift;

    /** Used to set meta data on functions */
    var defineProperty = (function() {
      // IE 8 only accepts DOM elements
      try {
        var o = {},
            func = isNative(func = Object.defineProperty) && func,
            result = func(o, o, o) && func;
      } catch(e) { }
      return result;
    }());

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps the given value to enable intuitive
     * method chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
     * and `zip`
     *
     * The non-chainable wrapper functions are:
     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
     * `template`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first` and `last` return wrapped values when `n` is
     * provided, otherwise they return unwrapped values.
     *
     * Explicit chaining can be enabled by using the `_.chain` method.
     *
     * @name _
     * @constructor
     * @category Chaining
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap in a `lodash` instance.
     * @param {boolean} chainAll A flag to enable chaining for all methods
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': /<%-([\s\S]+?)%>/g,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': /<%([\s\S]+?)%>/g,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * The base implementation of `_.bind` that creates the bound function and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new bound function.
     */
    function baseBind(bindData) {
      var func = bindData[0],
          partialArgs = bindData[2],
          thisArg = bindData[4];

      function bound() {
        // `Function#bind` spec
        // http://es5.github.io/#x15.3.4.5
        if (partialArgs) {
          // avoid `arguments` object deoptimizations by using `slice` instead
          // of `Array.prototype.slice.call` and not assigning `arguments` to a
          // variable as a ternary expression
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        // mimic the constructor's `return` behavior
        // http://es5.github.io/#x13.2.2
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          var thisBinding = baseCreate(func.prototype),
              result = func.apply(thisBinding, args || arguments);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.clone` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, callback, stackA, stackB) {
      if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
          return result;
        }
      }
      // inspect [[Class]]
      var isObj = isObject(value);
      if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className]) {
          return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
          case boolClass:
          case dateClass:
            return new ctor(+value);

          case numberClass:
          case stringClass:
            return new ctor(value);

          case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
      } else {
        return value;
      }
      var isArr = isArray(value);
      if (isDeep) {
        // check for circular references and return corresponding clone
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == value) {
            return stackB[length];
          }
        }
        result = isArr ? ctor(value.length) : {};
      }
      else {
        result = isArr ? slice(value) : assign({}, value);
      }
      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // exit for shallow clone
      if (!isDeep) {
        return result;
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? forEach : forOwn)(value, function(objValue, key) {
        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
      });

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(prototype, properties) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    // fallback for browsers without `Object.create`
    if (!nativeCreate) {
      baseCreate = (function() {
        function Object() {}
        return function(prototype) {
          if (isObject(prototype)) {
            Object.prototype = prototype;
            var result = new Object;
            Object.prototype = null;
          }
          return result || context.Object();
        };
      }());
    }

    /**
     * The base implementation of `_.createCallback` without support for creating
     * "_.pluck" or "_.where" style callbacks.
     *
     * @private
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     */
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      // exit early for no `thisArg` or already bound by `Function#bind`
      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
      }
      var bindData = func.__bindData__;
      if (typeof bindData == 'undefined') {
        if (support.funcNames) {
          bindData = !func.name;
        }
        bindData = bindData || !support.funcDecomp;
        if (!bindData) {
          var source = fnToString.call(func);
          if (!support.funcNames) {
            bindData = !reFuncName.test(source);
          }
          if (!bindData) {
            // checks if `func` references the `this` keyword and stores the result
            bindData = reThis.test(source);
            setBindData(func, bindData);
          }
        }
      }
      // exit early if there are no `this` references or `func` is bound
      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 2: return function(a, b) {
          return func.call(thisArg, a, b);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return bind(func, thisArg);
    }

    /**
     * The base implementation of `createWrapper` that creates the wrapper and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new function.
     */
    function baseCreateWrapper(bindData) {
      var func = bindData[0],
          bitmask = bindData[1],
          partialArgs = bindData[2],
          partialRightArgs = bindData[3],
          thisArg = bindData[4],
          arity = bindData[5];

      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          key = func;

      function bound() {
        var thisBinding = isBind ? thisArg : this;
        if (partialArgs) {
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        if (partialRightArgs || isCurry) {
          args || (args = slice(arguments));
          if (partialRightArgs) {
            push.apply(args, partialRightArgs);
          }
          if (isCurry && args.length < arity) {
            bitmask |= 16 & ~32;
            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
          }
        }
        args || (args = arguments);
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          thisBinding = baseCreate(func.prototype);
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.difference` that accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {Array} [values] The array of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     */
    function baseDifference(array, values) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
          result = [];

      if (isLarge) {
        var cache = createCache(values);
        if (cache) {
          indexOf = cacheIndexOf;
          values = cache;
        } else {
          isLarge = false;
        }
      }
      while (++index < length) {
        var value = array[index];
        if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      if (isLarge) {
        releaseObject(values);
      }
      return result;
    }

    /**
     * The base implementation of `_.flatten` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns a new flattened array.
     */
    function baseFlatten(array, isShallow, isStrict, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value && typeof value == 'object' && typeof value.length == 'number'
            && (isArray(value) || isArguments(value))) {
          // recursively flatten arrays (susceptible to call stack limits)
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isStrict);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isStrict) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
     * that allows partial "_.where" style comparisons.
     *
     * @private
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
      // used to indicate that when comparing objects, `a` has at least the properties of `b`
      if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a &&
          !(a && objectTypes[type]) &&
          !(b && objectTypes[otherType])) {
        return false;
      }
      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
      // http://es5.github.io/#x15.3.4.4
      if (a == null || b == null) {
        return a === b;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `+0` vs. `-0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
            bWrapped = hasOwnProperty.call(b, '__wrapped__');

        if (aWrapped || bWrapped) {
          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = a.constructor,
            ctorB = b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB &&
              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
              ('constructor' in a && 'constructor' in b)
            ) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        // compare lengths to determine if a deep comparison is necessary
        length = a.length;
        size = b.length;
        result = size == length;

        if (result || isWhere) {
          // deep compare the contents, ignoring non-numeric properties
          while (size--) {
            var index = length,
                value = b[size];

            if (isWhere) {
              while (index--) {
                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                  break;
                }
              }
            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        }
      }
      else {
        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
        // which, in this case, is more costly
        forIn(b, function(value, key, b) {
          if (hasOwnProperty.call(b, key)) {
            // count the number of properties.
            size++;
            // deep compare each property value.
            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
          }
        });

        if (result && !isWhere) {
          // ensure both objects have the same number of properties
          forIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) {
              // `size` will be `-1` if `a` has more properties than `b`
              return (result = --size > -1);
            }
          });
        }
      }
      stackA.pop();
      stackB.pop();

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.merge` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     */
    function baseMerge(object, source, callback, stackA, stackB) {
      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            var isShallow;
            if (callback) {
              result = callback(value, source);
              if ((isShallow = typeof result != 'undefined')) {
                value = result;
              }
            }
            if (!isShallow) {
              value = isArr
                ? (isArray(value) ? value : [])
                : (isPlainObject(value) ? value : {});
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!isShallow) {
              baseMerge(value, source, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }

    /**
     * The base implementation of `_.random` without argument juggling or support
     * for returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns a random number.
     */
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function} [callback] The function called per iteration.
     * @returns {Array} Returns a duplicate-value-free array.
     */
    function baseUniq(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];

      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
          seen = (callback || isLarge) ? getArray() : result;

      if (isLarge) {
        var cache = createCache(seen);
        indexOf = cacheIndexOf;
        seen = cache;
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isSorted
              ? !index || seen[seen.length - 1] !== computed
              : indexOf(seen, computed) < 0
            ) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      if (isLarge) {
        releaseArray(seen.array);
        releaseObject(seen);
      } else if (callback) {
        releaseArray(seen);
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an object composed
     * of keys generated from the results of running each element of the collection
     * through a callback. The given `setter` function sets the keys and values
     * of the composed object.
     *
     * @private
     * @param {Function} setter The setter function.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter) {
      return function(collection, callback, thisArg) {
        var result = {};
        callback = lodash.createCallback(callback, thisArg, 3);

        var index = -1,
            length = collection ? collection.length : 0;

        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          forOwn(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function that, when called, either curries or invokes `func`
     * with an optional `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of method flags to compose.
     *  The bitmask may be composed of the following flags:
     *  1 - `_.bind`
     *  2 - `_.bindKey`
     *  4 - `_.curry`
     *  8 - `_.curry` (bound)
     *  16 - `_.partial`
     *  32 - `_.partialRight`
     * @param {Array} [partialArgs] An array of arguments to prepend to those
     *  provided to the new function.
     * @param {Array} [partialRightArgs] An array of arguments to append to those
     *  provided to the new function.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new function.
     */
    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          isPartial = bitmask & 16,
          isPartialRight = bitmask & 32;

      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
      }
      var bindData = func && func.__bindData__;
      if (bindData && bindData !== true) {
        // clone `bindData`
        bindData = slice(bindData);
        if (bindData[2]) {
          bindData[2] = slice(bindData[2]);
        }
        if (bindData[3]) {
          bindData[3] = slice(bindData[3]);
        }
        // set `thisBinding` is not previously bound
        if (isBind && !(bindData[1] & 1)) {
          bindData[4] = thisArg;
        }
        // set if previously bound but not currently (subsequent curried functions)
        if (!isBind && bindData[1] & 1) {
          bitmask |= 8;
        }
        // set curried arity if not yet set
        if (isCurry && !(bindData[1] & 4)) {
          bindData[5] = arity;
        }
        // append partial left arguments
        if (isPartial) {
          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
        }
        // append partial right arguments
        if (isPartialRight) {
          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
        }
        // merge flags
        bindData[1] |= bitmask;
        return createWrapper.apply(null, bindData);
      }
      // fast path for `_.bind`
      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
    }

    /**
     * Used by `escape` to convert characters to HTML entities.
     *
     * @private
     * @param {string} match The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized, this method returns the custom method, otherwise it returns
     * the `baseIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
     */
    function isNative(value) {
      return typeof value == 'function' && reNative.test(value);
    }

    /**
     * Sets `this` binding data on a given function.
     *
     * @private
     * @param {Function} func The function to set data on.
     * @param {Array} value The data array to set.
     */
    var setBindData = !defineProperty ? noop : function(func, value) {
      descriptor.value = value;
      defineProperty(func, '__bindData__', descriptor);
    };

    /**
     * A fallback implementation of `isPlainObject` which checks if a given value
     * is an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and that
     * there are no `Object.prototype` extensions.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
        return false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /**
     * Used by `unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {string} match The matched character to unescape.
     * @returns {string} Returns the unescaped character.
     */
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })(1, 2, 3);
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
     * @example
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     *
     * _.isArray([1, 2, 3]);
     * // => true
     */
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == arrayClass || false;
    };

    /**
     * A fallback implementation of `Object.keys` which produces an array of the
     * given object's own enumerable property names.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     */
    var shimKeys = function(object) {
      var index, iterable = object, result = [];
      if (!iterable) return result;
      if (!(objectTypes[typeof object])) return result;
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            result.push(index);
          }
        }
      return result
    };

    /**
     * Creates an array composed of the own enumerable property names of an object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     * @example
     *
     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };

    /**
     * Used to convert characters to HTML entities:
     *
     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
     * don't require escaping in HTML and have no special meaning unless they're part
     * of a tag or an unquoted attribute value.
     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
     */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    /** Used to convert HTML entities to characters */
    var htmlUnescapes = invert(htmlEscapes);

    /** Used to match HTML entities and HTML characters */
    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a callback is provided it will be executed to produce the
     * assigned values. The callback is bound to `thisArg` and invoked with two
     * arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @type Function
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
     * // => { 'name': 'fred', 'employer': 'slate' }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * var object = { 'name': 'barney' };
     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var assign = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
      } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
      }
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
        }
        }
      }
      return result
    };

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a callback
     * is provided it will be executed to produce the cloned values. If the
     * callback returns `undefined` cloning will be handled by the method instead.
     * The callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var shallow = _.clone(characters);
     * shallow[0] === characters[0];
     * // => true
     *
     * var deep = _.clone(characters, true);
     * deep[0] === characters[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, callback, thisArg) {
      // allows working with "Collections" methods without using their `index`
      // and `collection` arguments for `isDeep` and `callback`
      if (typeof isDeep != 'boolean' && isDeep != null) {
        thisArg = callback;
        callback = isDeep;
        isDeep = false;
      }
      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates a deep clone of `value`. If a callback is provided it will be
     * executed to produce the cloned values. If the callback returns `undefined`
     * cloning will be handled by the method instead. The callback is bound to
     * `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var deep = _.cloneDeep(characters);
     * deep[0] === characters[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? assign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param- {Object} [guard] Allows working with `_.reduce` without using its
     *  `key` and `object` arguments as sources.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var object = { 'name': 'barney' };
     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var defaults = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (typeof result[index] == 'undefined') result[index] = iterable[index];
        }
        }
      }
      return result
    };

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': false },
     *   'fred': {    'age': 40, 'blocked': true },
     *   'pebbles': { 'age': 1,  'blocked': false }
     * };
     *
     * _.findKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (property order is not guaranteed across environments)
     *
     * // using "_.where" callback shorthand
     * _.findKey(characters, { 'age': 1 });
     * // => 'pebbles'
     *
     * // using "_.pluck" callback shorthand
     * _.findKey(characters, 'blocked');
     * // => 'fred'
     */
    function findKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': true },
     *   'fred': {    'age': 40, 'blocked': false },
     *   'pebbles': { 'age': 1,  'blocked': true }
     * };
     *
     * _.findLastKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
     *
     * // using "_.where" callback shorthand
     * _.findLastKey(characters, { 'age': 40 });
     * // => 'fred'
     *
     * // using "_.pluck" callback shorthand
     * _.findLastKey(characters, 'blocked');
     * // => 'pebbles'
     */
    function findLastKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwnRight(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over own and inherited enumerable properties of an object,
     * executing the callback for each property. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forIn(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
     */
    var forIn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        for (index in iterable) {
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forIn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forInRight(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
     */
    function forInRight(object, callback, thisArg) {
      var pairs = [];

      forIn(object, function(value, key) {
        pairs.push(key, value);
      });

      var length = pairs.length;
      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(pairs[length--], pairs[length], object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Iterates over own enumerable properties of an object, executing the callback
     * for each property. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
     */
    var forOwn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forOwn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, callback, thisArg) {
      var props = keys(object),
          length = props.length;

      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        var key = props[length];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Creates a sorted array of property names of all enumerable properties,
     * own and inherited, of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names that have function values.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified property name exists as a direct property of `object`,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to check.
     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the created inverted object.
     * @example
     *
     * _.invert({ 'first': 'fred', 'second': 'barney' });
     * // => { 'fred': 'first', 'barney': 'second' }
     */
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        value && typeof value == 'object' && toString.call(value) == boolClass || false;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     */
    function isDate(value) {
      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     */
    function isElement(value) {
      return value && value.nodeType === 1 || false;
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({});
     * // => true
     *
     * _.isEmpty('');
     * // => true
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass || className == argsClass ) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      forOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If a callback is provided it will be executed
     * to compare values. If the callback returns `undefined` comparisons will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var copy = { 'name': 'fred' };
     *
     * object == copy;
     * // => false
     *
     * _.isEqual(object, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg) {
      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This is not the same as native `isFinite` which will return true for
     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     */
    function isFunction(value) {
      return typeof value == 'function';
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.io/#x8
      // and avoid a V8 bug
      // http://code.google.com/p/v8/issues/detail?id=2291
      return !!(value && objectTypes[typeof value]);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This is not the same as native `isNaN` which will return `true` for
     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(undefined);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4 * 5);
     * // => true
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        value && typeof value == 'object' && toString.call(value) == numberClass || false;
    }

    /**
     * Checks if `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * _.isPlainObject(new Shape);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     */
    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
      if (!(value && toString.call(value) == objectClass)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/fred/);
     * // => true
     */
    function isRegExp(value) {
      return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('fred');
     * // => true
     */
    function isString(value) {
      return typeof value == 'string' ||
        value && typeof value == 'object' && toString.call(value) == stringClass || false;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     *
     * var characters = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // using "_.pluck" callback shorthand
     * _.mapValues(characters, 'age');
     * // => { 'fred': 40, 'pebbles': 1 }
     */
    function mapValues(object, callback, thisArg) {
      var result = {};
      callback = lodash.createCallback(callback, thisArg, 3);

      forOwn(object, function(value, key, object) {
        result[key] = callback(value, key, object);
      });
      return result;
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a callback is
     * provided it will be executed to produce the merged values of the destination
     * and source properties. If the callback returns `undefined` merging will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'characters': [
     *     { 'name': 'barney' },
     *     { 'name': 'fred' }
     *   ]
     * };
     *
     * var ages = {
     *   'characters': [
     *     { 'age': 36 },
     *     { 'age': 40 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object) {
      var args = arguments,
          length = 2;

      if (!isObject(object)) {
        return object;
      }
      // allows working with `_.reduce` and `_.reduceRight` without using
      // their `index` and `collection` arguments
      if (typeof args[2] != 'number') {
        length = args.length;
      }
      if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
      var sources = slice(arguments, 1, length),
          index = -1,
          stackA = getArray(),
          stackB = getArray();

      while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
      }
      releaseArray(stackA);
      releaseArray(stackB);
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` omitting the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The properties to omit or the
     *  function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object without the omitted properties.
     * @example
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
     * // => { 'name': 'fred' }
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'fred' }
     */
    function omit(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var props = [];
        forIn(object, function(value, key) {
          props.push(key);
        });
        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

        var index = -1,
            length = props.length;

        while (++index < length) {
          var key = props[index];
          result[key] = object[key];
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (!callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * Creates a two dimensional array of an object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` picking the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The function called per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object composed of the picked properties.
     * @example
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
     * // => { 'name': 'fred' }
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'fred' }
     */
    function pick(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var index = -1,
            props = baseFlatten(arguments, true, false, 1),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce` this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable properties through a callback, with each callback execution
     * potentially mutating the `accumulator` object. The callback is bound to
     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
     * Callbacks may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = baseCreate(proto);
        }
      }
      if (callback) {
        callback = lodash.createCallback(callback, thisArg, 4);
        (isArr ? forEach : forOwn)(object, function(value, index, object) {
          return callback(accumulator, value, index, object);
        });
      }
      return accumulator;
    }

    /**
     * Creates an array composed of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property values.
     * @example
     *
     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
     * // => [1, 2, 3] (property order is not guaranteed across environments)
     */
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
     *   to retrieve, specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns a new array of elements corresponding to the
     *  provided indexes.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
     * // => ['fred', 'pebbles']
     */
    function at(collection) {
      var args = arguments,
          index = -1,
          props = baseFlatten(args, true, false, 1),
          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
          result = Array(length);

      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given value is present in a collection using strict equality
     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
     * offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {*} target The value to check for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.contains('pebbles', 'eb');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var index = -1,
          indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;

      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
      if (isArray(collection)) {
        result = indexOf(collection, target, fromIndex) > -1;
      } else if (typeof length == 'number') {
        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
      } else {
        forOwn(collection, function(value) {
          if (++index >= fromIndex) {
            return !(result = value === target);
          }
        });
      }
      return result;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through the callback. The corresponding value
     * of each key is the number of times the key was returned by the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });

    /**
     * Checks if the given callback returns truey value for **all** elements of
     * a collection. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if all elements passed the callback check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes']);
     * // => false
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(characters, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(characters, { 'age': 36 });
     * // => false
     */
    function every(collection, callback, thisArg) {
      var result = true;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return (result = !!callback(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning an array of all elements
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that passed the callback check.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [2, 4, 6]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(characters, 'blocked');
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     *
     * // using "_.where" callback shorthand
     * _.filter(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     */
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning the first element that
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.find(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
     *
     * // using "_.where" callback shorthand
     * _.find(characters, { 'age': 1 });
     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
     *
     * // using "_.pluck" callback shorthand
     * _.find(characters, 'blocked');
     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
     */
    function find(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
    }

    /**
     * This method is like `_.find` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(num) {
     *   return num % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forEachRight(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result = value;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over elements of a collection, executing the callback for each
     * element. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * Note: As with other "Collections" methods, objects with a `length` property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
     * // => logs each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
     * // => logs each number and returns the object (property order is not guaranteed across environments)
     */
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        forOwn(collection, callback);
      }
      return collection;
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
     * // => logs each number from right to left and returns '3,2,1'
     */
    function forEachRight(collection, callback, thisArg) {
      var length = collection ? collection.length : 0;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        var props = keys(collection);
        length = props.length;
        forOwn(collection, function(value, key, collection) {
          key = props ? props[--length] : --length;
          return callback(collection[key], key, collection);
        });
      }
      return collection;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of a collection through the callback. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of the collection through the given callback. The corresponding
     * value of each key is the last element responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keys = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keys, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in the `collection`
     * returning an array of the results of each invoked method. Additional arguments
     * will be provided to each invoked method. If `methodName` is a function it
     * will be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [arg] Arguments to invoke the method with.
     * @returns {Array} Returns a new array of the results of each invoked method.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the collection
     * through the callback. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (property order is not guaranteed across environments)
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(characters, 'name');
     * // => ['barney', 'fred']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        forOwn(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of a collection. If the collection is empty or
     * falsey `-Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.max(characters, function(chr) { return chr.age; });
     * // => { 'name': 'fred', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(characters, 'age');
     * // => { 'name': 'fred', 'age': 40 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of a collection. If the collection is empty or
     * falsey `Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.min(characters, function(chr) { return chr.age; });
     * // => { 'name': 'barney', 'age': 36 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(characters, 'age');
     * // => { 'name': 'barney', 'age': 36 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the value of a specified property from all elements in the collection.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} property The name of the property to pluck.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(characters, 'name');
     * // => ['barney', 'fred']
     */
    var pluck = map;

    /**
     * Reduces a collection to a value which is the accumulated result of running
     * each element in the collection through the callback, where each successive
     * callback execution consumes the return value of the previous execution. If
     * `accumulator` is not provided the first element of the collection will be
     * used as the initial `accumulator` value. The callback is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      if (!collection) return accumulator;
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);

      var index = -1,
          length = collection.length;

      if (typeof length == 'number') {
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);
      forEachRight(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter` this method returns the elements of a
     * collection that the callback does **not** return truey for.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that failed the callback check.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [1, 3, 5]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(characters, 'blocked');
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     *
     * // using "_.where" callback shorthand
     * _.reject(characters, { 'age': 36 });
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     */
    function reject(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }

    /**
     * Retrieves a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Allows working with functions like `_.map`
     *  without using their `index` arguments as `n`.
     * @returns {Array} Returns the random sample(s) of `collection`.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (collection && typeof collection.length != 'number') {
        collection = values(collection);
      }
      if (n == null || guard) {
        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        var rand = baseRandom(0, ++index);
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }

    /**
     * Checks if the callback returns a truey value for **any** element of a
     * collection. The function returns as soon as it finds a passing value and
     * does not iterate over the entire collection. The callback is bound to
     * `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if any element passed the callback check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(characters, 'blocked');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(characters, { 'age': 1 });
     * // => false
     */
    function some(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return !(result = callback(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through the callback. This method
     * performs a stable sort, that is, it will preserve the original sort order
     * of equal elements. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an array of property names is provided for `callback` the collection
     * will be sorted by each property value.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of sorted elements.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'barney',  'age': 26 },
     *   { 'name': 'fred',    'age': 30 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(_.sortBy(characters, 'age'), _.values);
     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
     *
     * // sorting by multiple properties
     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          isArr = isArray(callback),
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      if (!isArr) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      forEach(collection, function(value, key, collection) {
        var object = result[++index] = getObject();
        if (isArr) {
          object.criteria = map(callback, function(key) { return value[key]; });
        } else {
          (object.criteria = getArray())[0] = callback(value, key, collection);
        }
        object.index = index;
        object.value = value;
      });

      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        var object = result[length];
        result[length] = object.value;
        if (!isArr) {
          releaseArray(object.criteria);
        }
        releaseObject(object);
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return slice(collection);
      }
      return values(collection);
    }

    /**
     * Performs a deep comparison of each element in a `collection` to the given
     * `properties` object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Object} props The object of property values to filter by.
     * @returns {Array} Returns a new array of elements that have the given properties.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.where(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
     *
     * _.where(characters, { 'pets': ['dino'] });
     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using strict
     * equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     */
    function difference(array) {
      return baseDifference(array, baseFlatten(arguments, true, true, 1));
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.findIndex(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // => 2
     *
     * // using "_.where" callback shorthand
     * _.findIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findIndex(characters, 'blocked');
     * // => 1
     */
    function findIndex(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        if (callback(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': true },
     *   { 'name': 'fred',    'age': 40, 'blocked': false },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
     * ];
     *
     * _.findLastIndex(characters, function(chr) {
     *   return chr.age > 30;
     * });
     * // => 1
     *
     * // using "_.where" callback shorthand
     * _.findLastIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findLastIndex(characters, 'blocked');
     * // => 2
     */
    function findLastIndex(array, callback, thisArg) {
      var length = array ? array.length : 0;
      callback = lodash.createCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element or first `n` elements of an array. If a callback
     * is provided elements at the beginning of the array are returned as long
     * as the callback returns truey. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias head, take
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the first element(s) of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.first([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.first(characters, 'blocked');
     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
     * // => ['barney', 'fred']
     */
    function first(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truey, the array will only be flattened a single level. If a callback
     * is provided each element of the array is passed through the callback before
     * flattening. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(characters, 'pets');
     * // => ['hoppy', 'baby puss', 'dino']
     */
    function flatten(array, isShallow, callback, thisArg) {
      // juggle arguments
      if (typeof isShallow != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
        isShallow = false;
      }
      if (callback != null) {
        array = map(array, callback, thisArg);
      }
      return baseFlatten(array, isShallow);
    }

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the array is already sorted
     * providing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element or last `n` elements of an array. If a
     * callback is provided elements at the end of the array are excluded from
     * the result as long as the callback returns truey. The callback is bound
     * to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     *
     * _.initial([1, 2, 3], 2);
     * // => [1]
     *
     * _.initial([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.initial(characters, 'blocked');
     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
     * // => ['barney', 'fred']
     */
    function initial(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }

    /**
     * Creates an array of unique values present in all provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of shared values.
     * @example
     *
     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2]
     */
    function intersection() {
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length,
          caches = getArray(),
          indexOf = getIndexOf(),
          trustIndexOf = indexOf === baseIndexOf,
          seen = getArray();

      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
          caches.push(trustIndexOf && value.length >= largeArraySize &&
            createCache(argsIndex ? args[argsIndex] : seen));
        }
      }
      var array = args[0],
          index = -1,
          length = array ? array.length : 0,
          result = [];

      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      while (argsLength--) {
        cache = caches[argsLength];
        if (cache) {
          releaseObject(cache);
        }
      }
      releaseArray(caches);
      releaseArray(seen);
      return result;
    }

    /**
     * Gets the last element or last `n` elements of an array. If a callback is
     * provided elements at the end of the array are returned as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the last element(s) of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     *
     * _.last([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.last([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.last(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.last(characters, { 'employer': 'na' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function last(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      return slice(array, nativeMax(0, length - n));
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from the given array using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {...*} [value] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull(array) {
      var args = arguments,
          argsIndex = 0,
          argsLength = args.length,
          length = array ? array.length : 0;

      while (++argsIndex < argsLength) {
        var index = -1,
            value = args[argsIndex];
        while (++index < length) {
          if (array[index] === value) {
            splice.call(array, index--, 1);
            length--;
          }
        }
      }
      return array;
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`. If `start` is less than `stop` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns a new range array.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = typeof step == 'number' ? step : (+step || 1);

      if (end == null) {
        end = start;
        start = 0;
      }
      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / (step || 1))),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Removes all elements from an array that the callback returns truey for
     * and returns an array of removed elements. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4, 5, 6];
     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3, 5]
     *
     * console.log(evens);
     * // => [2, 4, 6]
     */
    function remove(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (callback(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * The opposite of `_.initial` this method gets all but the first element or
     * first `n` elements of an array. If a callback function is provided elements
     * at the beginning of the array are excluded from the result as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias drop, tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     *
     * _.rest([1, 2, 3], 2);
     * // => [3]
     *
     * _.rest([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.rest(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.rest(characters, { 'employer': 'slate' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;

        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }

    /**
     * Uses a binary search to determine the smallest index at which a value
     * should be inserted into a given sorted array in order to maintain the sort
     * order of the array. If a callback is provided it will be executed for
     * `value` and each element of `array` to compute their sort ranking. The
     * callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? low = mid + 1
          : high = mid;
      }
      return low;
    }

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of combined values.
     * @example
     *
     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2, 3, 5, 4]
     */
    function union() {
      return baseUniq(baseFlatten(arguments, true, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using strict equality
     * for comparisons, i.e. `===`. If the array is sorted, providing
     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
     * each element of `array` is passed through the callback before uniqueness
     * is computed. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, callback, thisArg) {
      // juggle arguments
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
        isSorted = false;
      }
      if (callback != null) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }

    /**
     * Creates an array excluding all provided values using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {...*} [value] The values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return baseDifference(array, slice(arguments, 1));
    }

    /**
     * Creates an array that is the symmetric difference of the provided arrays.
     * See http://en.wikipedia.org/wiki/Symmetric_difference.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of values.
     * @example
     *
     * _.xor([1, 2, 3], [5, 2, 1, 4]);
     * // => [3, 5, 4]
     *
     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
     * // => [1, 4, 5]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArray(array) || isArguments(array)) {
          var result = result
            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
            : array;
        }
      }
      return result || [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second
     * elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @alias unzip
     * @category Arrays
     * @param {...Array} [array] Arrays to process.
     * @returns {Array} Returns a new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    function zip() {
      var array = arguments.length > 1 ? arguments : arguments[0],
          index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Provide
     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns an object composed of the given keys and
     *  corresponding values.
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      if (!values && length && !isArray(keys[0])) {
        values = [];
      }
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that executes `func`, with  the `this` binding and
     * arguments of the created function, only after being called `n` times.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {number} n The number of times the function must be called before
     *  `func` is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('Done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'Done saving!', after all saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with the `this`
     * binding of `thisArg` and prepends any additional `bind` arguments to those
     * provided to the bound function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'fred' }, 'hi');
     * func();
     * // => 'hi fred'
     */
    function bind(func, thisArg) {
      return arguments.length > 2
        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
        : createWrapper(func, 1, null, null, thisArg);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all the function properties
     * of `object` will be bound.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...string} [methodName] The object method names to
     *  bind, specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = createWrapper(object[key], 1, null, null, object);
      }
      return object;
    }

    /**
     * Creates a function that, when called, invokes the method at `object[key]`
     * and prepends any additional `bindKey` arguments to those provided to the bound
     * function. This method differs from `_.bind` by allowing bound functions to
     * reference methods that will be redefined or don't yet exist.
     * See http://michaux.ca/articles/lazy-function-definition-pattern.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'fred',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi fred'
     *
     * object.greet = function(greeting) {
     *   return greeting + 'ya ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hiya fred!'
     */
    function bindKey(object, key) {
      return arguments.length > 2
        ? createWrapper(key, 19, slice(arguments, 2), null, object)
        : createWrapper(key, 3, null, null, object);
    }

    /**
     * Creates a function that is the composition of the provided functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {...Function} [func] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var realNameMap = {
     *   'pebbles': 'penelope'
     * };
     *
     * var format = function(name) {
     *   name = realNameMap[name.toLowerCase()] || name;
     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     * };
     *
     * var greet = function(formatted) {
     *   return 'Hiya ' + formatted + '!';
     * };
     *
     * var welcome = _.compose(greet, format);
     * welcome('pebbles');
     * // => 'Hiya Penelope!'
     */
    function compose() {
      var funcs = arguments,
          length = funcs.length;

      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var args = arguments,
            length = funcs.length;

        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }

    /**
     * Creates a function which accepts one or more arguments of `func` that when
     * invoked either executes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` can be specified
     * if `func.length` is not sufficient.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var curried = _.curry(function(a, b, c) {
     *   console.log(a + b + c);
     * });
     *
     * curried(1)(2)(3);
     * // => 6
     *
     * curried(1, 2)(3);
     * // => 6
     *
     * curried(1, 2, 3);
     * // => 6
     */
    function curry(func, arity) {
      arity = typeof arity == 'number' ? arity : (+arity || func.length);
      return createWrapper(func, 4, null, null, null, arity);
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked.
     * Provide an options object to indicate that `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
     * to the debounced function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * var lazyLayout = _.debounce(calculateLayout, 150);
     * jQuery(window).on('resize', lazyLayout);
     *
     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * });
     *
     * // ensure `batchLog` is executed once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * source.addEventListener('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }, false);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = nativeMax(0, wait) || 0;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };

      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      };

      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) { console.log(text); }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay execution.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) { console.log(text); }, 1000, 'later');
     * // => logs 'later' after one second
     */
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it will be used to determine the cache key for storing the result
     * based on the arguments provided to the memoized function. By default, the
     * first argument provided to the memoized function is used as the cache key.
     * The `func` is executed with the `this` binding of the memoized function.
     * The result cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] A function used to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     *
     * fibonacci(9)
     * // => 34
     *
     * var data = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // modifying the result cache
     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
     * get('pebbles');
     * // => { 'name': 'pebbles', 'age': 1 }
     *
     * get.cache.pebbles.name = 'penelope';
     * get('pebbles');
     * // => { 'name': 'penelope', 'age': 1 }
     */
    function memoize(func, resolver) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with any additional
     * `partial` arguments prepended to those provided to the new function. This
     * method is similar to `_.bind` except it does **not** alter the `this` binding.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('fred');
     * // => 'hi fred'
     */
    function partial(func) {
      return createWrapper(func, 16, slice(arguments, 1));
    }

    /**
     * This method is like `_.partial` except that `partial` arguments are
     * appended to those provided to the new function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      return createWrapper(func, 32, null, slice(arguments, 1));
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Provide an options object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle executions to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = wait;
      debounceOptions.trailing = trailing;

      return debounce(func, wait, debounceOptions);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Additional arguments provided to the function are appended
     * to those provided to the wrapper function. The wrapper is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('Fred, Wilma, & Pebbles');
     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
     */
    function wrap(value, wrapper) {
      return createWrapper(wrapper, 16, [value]);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var getter = _.constant(object);
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Produces a callback bound to an optional `thisArg`. If `func` is a property
     * name the created callback will return the property value for a given element.
     * If `func` is an object the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(characters, 'age__gt38');
     * // => [{ 'name': 'fred', 'age': 40 }]
     */
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
      }
      // handle "_.pluck" style callback shorthands
      if (type != 'object') {
        return property(func);
      }
      var props = keys(func),
          key = props[0],
          a = func[key];

      // handle "_.where" style callback shorthands
      if (props.length == 1 && a === a && !isObject(a)) {
        // fast path the common case of providing an object with a single
        // property containing a primitive value
        return function(object) {
          var b = object[key];
          return a === b && (a !== 0 || (1 / a == 1 / b));
        };
      }
      return function(object) {
        var length = props.length,
            result = false;

        while (length--) {
          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
            break;
          }
        }
        return result;
      };
    }

    /**
     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
     * corresponding HTML entities.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('Fred, Wilma, & Pebbles');
     * // => 'Fred, Wilma, &amp; Pebbles'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Adds function properties of a source object to the destination object.
     * If `object` is a function methods will be added to its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Function|Object} [object=lodash] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
     * @example
     *
     * function capitalize(string) {
     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     * }
     *
     * _.mixin({ 'capitalize': capitalize });
     * _.capitalize('fred');
     * // => 'Fred'
     *
     * _('fred').capitalize().value();
     * // => 'Fred'
     *
     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
     * _('fred').capitalize();
     * // => 'Fred'
     */
    function mixin(object, source, options) {
      var chain = true,
          methodNames = source && functions(source);

      if (!source || (!options && !methodNames.length)) {
        if (options == null) {
          options = source;
        }
        ctor = lodashWrapper;
        source = object;
        object = lodash;
        methodNames = functions(source);
      }
      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      var ctor = object,
          isFunc = isFunction(ctor);

      forEach(methodNames, function(methodName) {
        var func = object[methodName] = source[methodName];
        if (isFunc) {
          ctor.prototype[methodName] = function() {
            var chainAll = this.__chain__,
                value = this.__wrapped__,
                args = [value];

            push.apply(args, arguments);
            var result = func.apply(object, args);
            if (chain || chainAll) {
              if (value === result && isObject(result)) {
                return this;
              }
              result = new ctor(result);
              result.__chain__ = chainAll;
            }
            return result;
          };
        }
      });
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * A no-operation function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // no operation performed
    }

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var stamp = _.now();
     * _.defer(function() { console.log(_.now() - stamp); });
     * // => logs the number of milliseconds it took for the deferred function to be called
     */
    var now = isNative(now = Date.now) && now || function() {
      return new Date().getTime();
    };

    /**
     * Converts the given value into an integer of the specified radix.
     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See http://es5.github.io/#E.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} value The value to parse.
     * @param {number} [radix] The radix used to interpret the value to parse.
     * @returns {number} Returns the new integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
    };

    /**
     * Creates a "_.pluck" style function, which returns the `key` value of a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} key The name of the property to retrieve.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'fred',   'age': 40 },
     *   { 'name': 'barney', 'age': 36 }
     * ];
     *
     * var getName = _.property('name');
     *
     * _.map(characters, getName);
     * // => ['barney', 'fred']
     *
     * _.sortBy(characters, getName);
     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
     */
    function property(key) {
      return function(object) {
        return object[key];
      };
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number will be
     * returned. If `floating` is truey or either `min` or `max` are floats a
     * floating-point number will be returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating=false] Specify returning a floating-point number.
     * @returns {number} Returns a random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (typeof min == 'boolean' && noMax) {
          floating = min;
          min = 1;
        }
        else if (!noMax && typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /**
     * Resolves the value of property `key` on `object`. If `key` is a function
     * it will be invoked with the `this` binding of `object` and its result returned,
     * else the property value is returned. If `object` is falsey then `undefined`
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to resolve.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'cheese': 'crumpets',
     *   'stuff': function() {
     *     return 'nonsense';
     *   }
     * };
     *
     * _.result(object, 'cheese');
     * // => 'crumpets'
     *
     * _.result(object, 'stuff');
     * // => 'nonsense'
     */
    function result(object, key) {
      if (object) {
        var value = object[key];
        return isFunction(value) ? object[key]() : value;
      }
    }

    /**
     * A micro-templating method that handles arbitrary delimiters, preserves
     * whitespace, and correctly escapes quotes within interpolated code.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier
     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
     *
     * For more information on precompiling templates see:
     * http://lodash.com/custom-builds
     *
     * For more information on Chrome extension sandboxes see:
     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} text The template text.
     * @param {Object} data The data object used to populate the text.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as local variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [variable] The data object variable name.
     * @returns {Function|string} Returns a compiled function when no `data` object
     *  is given, else it returns the interpolated text.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'fred' });
     * // => 'hello fred'
     *
     * // using the "escape" delimiter to escape HTML in data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to generate HTML
     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'pebbles' });
     * // => 'hello pebbles'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
     * // => 'hello barney!'
     *
     * // using a custom template delimiters
     * _.templateSettings = {
     *   'interpolate': /{{([\s\S]+?)}}/g
     * };
     *
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `imports` option to import jQuery
     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(text, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      text = String(text || '');

      // avoid missing dependencies when `iteratorTemplate` is not defined
      options = defaults({}, options, settings);

      var imports = defaults({}, options.imports, settings.imports),
          importsKeys = keys(imports),
          importsValues = values(imports);

      var isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable,
          hasVariable = variable;

      if (!hasVariable) {
        variable = 'obj';
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + variable + ') {\n' +
        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
        "var __t, __p = '', __e = _.escape" +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source by its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Executes the callback `n` times, returning an array of the results
     * of each callback execution. The callback is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} n The number of times to execute the callback.
     * @param {Function} callback The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns an array of the results of each `callback` execution.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * The inverse of `_.escape` this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('Fred, Barney &amp; Pebbles');
     * // => 'Fred, Barney & Pebbles'
     */
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps the given value with explicit
     * method chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(characters)
     *     .sortBy('age')
     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
     *     .first()
     *     .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }

    /**
     * Invokes `interceptor` with the `value` as the first argument and then
     * returns `value`. The purpose of this method is to "tap into" a method
     * chain in order to perform operations on intermediate results within
     * the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .tap(function(array) { array.pop(); })
     *  .reverse()
     *  .value();
     * // => [3, 2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chaining
     * @returns {*} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(characters).first();
     * // => { 'name': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(characters).chain()
     *   .first()
     *   .pick('age')
     *   .value();
     * // => { 'age': 36 }
     */
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }

    /**
     * Produces the `toString` result of the wrapped value.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {string} Returns the string result.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {*} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.createCallback = createCallback;
    lodash.curry = curry;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.mapValues = mapValues;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.pull = pull;
    lodash.range = range;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.unzip = zip;

    // add functions to `lodash.prototype`
    mixin(lodash);

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    mixin(function() {
      var source = {}
      forOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }(), false);

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;

    // add aliases
    lodash.take = first;
    lodash.head = first;

    forOwn(lodash, function(func, methodName) {
      var callbackable = methodName !== 'sample';
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(n, guard) {
          var chainAll = this.__chain__,
              result = func(this.__wrapped__, n, guard);

          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
            ? result
            : new lodashWrapper(result, chainAll);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = '2.4.1';

    // add "Chaining" functions to the wrapper
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    forEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            result = func.apply(this.__wrapped__, arguments);

        return chainAll
          ? new lodashWrapper(result, chainAll)
          : result;
      };
    });

    // add `Array` functions that return the existing wrapped value
    forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    forEach(['concat', 'slice', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
      };
    });

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({
	id: "detail",
	template : require("./../templates/detail.tpl"), 
	events: {
		'click .trk': 'sendTrackingEvent'
	},
	sendTrackingEvent: function(e){
			var category = e.currentTarget.getAttribute('data-category');
			var label = e.currentTarget.getAttribute('data-label');
			var eventStr = category + " " + label;
			ga('send', 'event', category, 'click', label);
		//	console.log(eventStr);
	},
	init: function(){			
		this.$el.html(this.template({ detail:""} ));
		this.bindEvents();
	},
	bindEvents: function() {
		var _this = this;
		this.$(".hear-icon").show();
		this.$el.find('.close').on('click', _this.hide.bind(_this));
		this.$el.find('.hear-link').on('click', _this.toggleAudio.bind(_this));
		this.$el.find('.hear-link').hover(
			 function(){
				TweenMax.fromTo( $(this).find('.hear-pulse'), 1, { scaleX: 1, scaleY: 1, autoAlpha: 1 },{ scaleX: 1.5, scaleY: 1.5, display: 'block', autoAlpha: 0, ease: Circ.easeOut });
				TweenMax.fromTo( $(this).find('.hear-border'), 1, { scaleX: 1, scaleY: 1 },{ scaleX: .85, scaleY: .85, ease: Expo.easeOut });
				TweenMax.to( $(this).find('.hear-border'), 1, { css:{ borderColor:"#666666", borderWidth: 2 }, ease: Expo.easeOut });
				TweenMax.to( $(this).find('.hear-text'), 1, { color:"#000", ease: Expo.easeOut });
			 },
			 function(){
				TweenMax.to( $(this).find('.hear-border'), 1, { scaleX: 1, scaleY: 1, ease: Expo.easeOut });
				TweenMax.to( $(this).find('.hear-border'), 1, { css:{ borderColor:"#cccccc", borderWidth: 1 }, ease: Expo.easeOut });
				TweenMax.to( $(this).find('.hear-text'), 1, { color:"#4e4e4e", ease: Expo.easeOut });
			 }
		);
		this.circle = document.getElementById("circle-progress");
		this.circle.ctx = this.circle.getContext("2d");
		this.audio = this.$el.find('.info-audio')[0];
		this.audio.addEventListener('ended', function(){
			_this.$(".pause").fadeOut(200);
			_this.$(".play").fadeIn(200);
			
			_this.circle.ctx.clearRect ( 0 , 0 , 100, 100 );
			window.clearInterval(_this.audioInterval);
		})
	},
	toggleAudio: function(){
		var _this = this;
		if (this.audio.duration > 0 && !this.audio.paused) {
			this.$(".pause").fadeOut(200);
			this.$(".play").fadeIn(200);
			
		    this.audio.pause();
		    window.clearInterval(this.audioInterval);

		} else {
		    this.audio.play();

		    this.$(".pause").fadeIn(200);
		    this.$(".play").fadeOut(200);
		    this.$(".hear-icon").fadeOut(200);
		    //start drawing circle
		    this.audioInterval = setInterval(function(){
				_this.drawCircle();
			}, 10);
		}
		
	},
	getAudioProgress: function(){
		var percent = this.audio.currentTime / this.audio.duration;
		return 2 * percent;
	},
	drawCircle: function(){
		var progress = this.getAudioProgress();
		this.circle.ctx.clearRect ( 0 , 0 , 100, 100 );
		this.circle.ctx.beginPath();
		this.circle.ctx.arc(50, 50, 49, 0, progress * Math.PI);
		this.circle.ctx.lineWidth = 2;
		this.circle.ctx.strokeStyle = '#676767';
		this.circle.ctx.stroke();
		//this.circle.ctx.webkitImageSmoothingEnabled=true;

	},	
	updateContent: function(content){
		this.$el.html(this.template({detail: content}));
		this.bindEvents();
	},
	show: function(){
	
		this.$el.css("display", "block");
		
		that = this;
		var $w = $(window).width();
		TweenMax.fromTo( $('.detail-background'), 1.75, { x: $w, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: Power4.easeInOut });
		TweenMax.fromTo( $('.detail-inner'), 1.5, { x: $w }, { x: 0, ease: Power4.easeInOut, delay: .25 } );
		
		TweenMax.fromTo( $('.detail-inner .detail-icon'), 1.5, { autoAlpha: 0, x: 100 }, { autoAlpha: 1, x: 0, ease: Power4.easeInOut, delay: .5 } );
		TweenMax.fromTo( $('.detail-inner .content'), 1.5, { autoAlpha: 0, x: 200 }, { autoAlpha: 1, x: 0, ease: Power4.easeInOut, delay: .5 } );
		TweenMax.fromTo( $('.detail-inner .hear-link'), 1.5, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power4.easeInOut, delay: .75, onComplete: function() {
			TweenMax.fromTo( $('.hear-pulse'), 1.5, { scaleX: 1, scaleY: 1, autoAlpha: 1 },{ scaleX: 1.5, scaleY: 1.5, display: 'block', autoAlpha: 0, ease: Circ.easeOut, delay: 1, repeat: -1, repeatDelay: 1 });
		}});
		
		TweenMax.fromTo( $('.detail-inner .close'), 1.5, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power4.easeInOut, delay: 2 } );
		
		// HIDE BOTTOM NAV
		//TweenMax.to( $('.bottom-nav'), 1, { y: 80, autoAlpha: 0, ease: Power4.easeIn });
		
	},
	hide: function(){
		if(this.audioInterval){
			window.clearInterval(this.audioInterval);
		}
	
		
		this.global.trigger("hideDetail");
		
		var that = this;
		var $w = $(window).width();
		TweenLite.killTweensOf($('.hear-pulse'));
		TweenMax.to( $('.detail-background'), 1.65, { autoAlpha: 0 } );
		TweenMax.to( $('.detail-background'), 1.5, { x: $w, ease: Power4.easeInOut, delay: .15 } );
		TweenMax.to( $('.detail-inner '), 1.5, { x: $w, ease: Power4.easeInOut, onComplete: function() {
			that.$el.css("display", "none");
		}});
		
		// SHOW BOTTOM NAV
		//TweenMax.to( $('.bottom-nav'), 1, { y: 0, autoAlpha: 1, ease: Power4.easeOut, delay: 1 });
		
		// CALL TO CLOSE DETAIL IN GI ITEM

		//stop audio
		this.$el.find('.info-audio')[0].pause();
	}
});



},{"./../templates/detail.tpl":28}],5:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({

		id: "footer",
		template : require("./../templates/footer.tpl"), 

		events: {
			
		}, 

		init: function(){			
			this.$el.html(this.template({key:"footer"}));
			
		},


});
},{"./../templates/footer.tpl":29}],6:[function(require,module,exports){
var ImgSeq				=	require("./utilities/img_sequence.js");
module.exports = Backbone.ViewBase.extend({

		className: "g-item",
		template : require("./../templates/gallery-item.tpl"),
		template2 : require("./../templates/gallery-item-intro.tpl"), 
		id: 112354,
		events: {
			'click .trk': 'sendTrackingEvent'
		},
		init: function(){
			//PAUSE
 			//console.log("gal item",this.options);
			if(parseInt(this.options.galleryItem.type) == 1){
				this.$el.html(this.template({key:"gallery-item",index: this.options.index, galleryItem: this.options.galleryItem}));					
				var options = this.options.galleryItem.sigOptions;
	
				var device = this.global.attributes.checks.device.type;
				var cnv = this.$el.find('.sig')[0];
				//if (device == "desktop"){
					cnv.width = options.img.v2w;
					cnv.height = options.img.v2h;
					//console.log(cnv.width);
				// }else{ //for mobile-> overwrite defaults with mobile values
				// 	cnv.width = options.img.wMobile;
				// 	cnv.height = options.img.hMobile;
				// 	options.baseURL =  options.baseURLMobile;
				// 	options.img.w =  options.img.wMobile;
				// 	options.img.h =  options.img.hMobile;	
				// }
				//v2

				options.canvas = cnv;
				this.imgSeq = new ImgSeq(options);					
			}else{
				this.$el.html(this.template2({key:"gallery-item",index: this.options.index, galleryItem: this.options.galleryItem}));
			}
			$(".gallery-items").append(this.$el);
			this.$el.css("height", $(window).height());
			
			// SCALE DOWN ALL SIGNATURES
			//TweenMax.set( $('.sig'), { scaleX: .65, scaleY: .65, y: 20 });
			var jd = $('.sig')[0];
			var kt = $('.sig')[1];
			TweenMax.set( $(jd), { y: 30});
			TweenMax.set( $(kt), { scaleX: 0.8, scaleY: 0.8});
			//TweenMax.set( $(tm), {y: 0});
			
			var $w = $(window).width();
			if ($w < 1000) $w = 1000;
			this.$el.css("width", $w);
			this.$el.css("marginRight", ($w  * .5));
			
			this.bindEvents();
		},
		sendTrackingEvent: function(e){
			var category = e.currentTarget.getAttribute('data-category');
			var label = e.currentTarget.getAttribute('data-label');
			var eventStr = category + " " + label;
			ga('send', 'event', category, 'click', label);
			//console.log(eventStr);
		},
		bindEvents: function(){
			this.global.on("hidePlayer",this.closePlayer.bind(this));
			this.global.on("hideDetail",this.closeDetail.bind(this));			
        	$(window).on("resize", this.resize.bind(this));
			var that = this;
			if(this.options.galleryItem.type == 1){
				this.$el.find('.view-link').on("click", this.openDetail.bind(this));
				this.$el.find('.view-video').on("click", this.openPlayer.bind(this));	
				
				this.$el.find('.view-link').hover(
					 function(){
						// TIMER
						that.global.trigger("stoptimer");
						
					 	TweenMax.fromTo( $(this).find('.view-pulse'), 1, { scaleX: 1, scaleY: 1, autoAlpha: 1 },{ scaleX: 1.5, scaleY: 1.5, display: 'block', autoAlpha: 0, ease: Circ.easeOut });
					 	TweenMax.fromTo( $(this).find('.view-border'), 1, { scaleX: 1, scaleY: 1 },{ scaleX: .85, scaleY: .85, ease: Expo.easeOut });
					 	TweenMax.to( $(this).find('.view-border'), 1, { css:{ borderColor:"#666666", borderWidth: 2 }, ease: Expo.easeOut });
					 	TweenMax.to( $(this).find('.view-text'), 1, { color:"#000", ease: Expo.easeOut });
					 },
					 function(){
						// TIMER
						that.global.trigger("starttimer");
						
					 	TweenMax.to( $(this).find('.view-border'), 1, { scaleX: 1, scaleY: 1, ease: Expo.easeOut });
					 	TweenMax.to( $(this).find('.view-border'), 1, { css:{ borderColor:"#cccccc", borderWidth: 1 }, ease: Expo.easeOut });
					 	TweenMax.to( $(this).find('.view-text'), 1, { color:"#666666", ease: Expo.easeOut });
					 }
				);
				
				this.$el.find('.view-video').hover(
					 function(){
						// TIMER
						that.global.trigger("stoptimer");
						
					 	TweenMax.fromTo( $(this).find('.view-pulse'), 1, { scaleX: 1, scaleY: 1, autoAlpha: 1 },{ scaleX: 1.5, scaleY: 1.5, display: 'block', autoAlpha: 0, ease: Circ.easeOut });
					 	TweenMax.fromTo( $(this).find('.view-border'), 1, { scaleX: 1, scaleY: 1 },{ scaleX: .85, scaleY: .85, ease: Expo.easeOut });
					 	TweenMax.to( $(this).find('.view-border'), 1, { css:{ borderColor:"#666666", borderWidth: 2 }, ease: Expo.easeOut });
					 	TweenMax.to( $(this).find('.view-text'), 1, { color:"#000", /*rotationY: 360, transformPerspective: 600, */ease: Circ.easeOut });
					 },
					 function(){
						// TIMER
						that.global.trigger("starttimer");
						
					 	TweenMax.to( $(this).find('.view-border'), 1, { scaleX: 1, scaleY: 1, ease: Expo.easeOut });
					 	TweenMax.to( $(this).find('.view-border'), 1, { css:{ borderColor:"#cccccc", borderWidth: 1 }, ease: Expo.easeOut });
					 	TweenMax.to( $(this).find('.view-text'), 1, { color:"#666666", /*rotationY: 0, */ease: Expo.easeOut });
					 }
				);
			}
		},

		openDetail: function(){
				
			var that = this;
			TweenMax.fromTo( this.$el, 1, { scaleX: 1, scaleY: 1, },{ scaleX: .9, scaleY: .9, ease: Expo.easeOut });
			TweenMax.fromTo( this.$el, 1.75, { x: 0, autoAlpha: 1 },{ x: -$(window).width(), autoAlpha: 0, ease: Power4.easeInOut, delay: .5, onStart: function() {
				that.global.trigger("gitem:select:detail", {content: that.options.galleryItem, idx: that.options.index});
				// console.log("post gal-item openDetail", that.options.galleryItem);
				// console.log(that)
			}});
			
			TweenMax.set( $('.cover'), { display: 'block' } );
			TweenMax.staggerTo($('.nav-item'), 1, { y: 60, ease: Power4.easeOut }, .1 );
			TweenMax.to($('.download-links'), 1, { y: 60, ease: Power4.easeOut, delay: .5 });
			
			// TIMER IN CASE TIMER WAS RESTARTED FROM BUTTON HOVER OUT
			this.global.trigger("setoverlaymode", true);
			setTimeout(function(){ 
				that.global.trigger("stoptimer")
			 }, 1000);
		
		},
		openPlayer: function(){
			var that = this;
			TweenMax.fromTo( this.$el, 1, { scaleX: 1, scaleY: 1, },{ scaleX: .9, scaleY: .9, ease: Expo.easeOut });
			TweenMax.fromTo( this.$el, 1.75, { x: 0, autoAlpha: 1 },{ x: -$(window).width(), autoAlpha: 0, ease: Power4.easeInOut, delay: .5 , onStart: function() {
				that.global.trigger("gitem:select:video", {content: that.options.galleryItem, idx: that.options.index});
			}});
			
			TweenMax.set( $('.cover'), { display: 'block' } );
			TweenMax.staggerTo($('.nav-item'), 1, { y: 60, ease: Power4.easeOut }, .1 );
			TweenMax.to($('.download-links'), 1, { y: 60, ease: Power4.easeOut, delay: .5 });
			
			// TIMER IN CASE TIMER WAS RESTARTED FROM BUTTON HOVER OUT
			this.global.trigger("setoverlaymode", true);
			setTimeout(function(){ 
				that.global.trigger("stoptimer")
			 }, 1000);
		},
		closeDetail: function(){
			var that = this;
			TweenMax.fromTo( this.$el, 1.75, { x: -$(window).width(), autoAlpha: 0 },{ x: 0, autoAlpha: 1, ease: Power4.easeInOut });
			TweenMax.to( this.$el, 1, { scaleX: 1, scaleY: 1, ease: Expo.easeOut, delay: 1.75 });
			
			TweenMax.set( $('.cover'), { display: 'none' } );
			TweenMax.staggerTo($('.nav-item'), 1, { y: 0, ease: Power4.easeOut, delay: 1 }, .1 );
			TweenMax.to($('.download-links'), 1, { y: 0, ease: Power4.easeOut, delay: 1.5 });
			
			// TIMER
			this.global.trigger("setoverlaymode", false);
			this.global.trigger("starttimer");
		},
		closePlayer: function(){
			var that = this;
			TweenMax.fromTo( this.$el, 1.75, { x: -$(window).width(), autoAlpha: 0 },{ x: 0, autoAlpha: 1, ease: Power4.easeInOut, });
			TweenMax.to( this.$el, 1, { scaleX: 1, scaleY: 1, ease: Expo.easeOut, delay: 1.75 });
			
			TweenMax.set( $('.cover'), { display: 'none' } );
			TweenMax.staggerTo($('.nav-item'), 1, { y: 0, ease: Power4.easeOut, delay: 1 }, .1 );
			TweenMax.to($('.download-links'), 1, { y: 0, ease: Power4.easeOut, delay: 1.5 });
			
			// TIMER
			this.global.trigger("setoverlaymode", false);
			this.global.trigger("starttimer");
		},
		resize: function(){
			this.$el.css("height", $(window).height());
			//this.$el.css("width", $(window).width() * 1.25);
			
			var $w = $(window).width();
			if ($w < 1000) $w = 1000;
			this.$el.css("width", $w);
			this.$el.css("marginRight", ($w  * .5));
		} 
}); 
},{"./../templates/gallery-item-intro.tpl":30,"./../templates/gallery-item.tpl":31,"./utilities/img_sequence.js":26}],7:[function(require,module,exports){

var GalleryItems 			= 	require("./GalleryItems.js");
var GalleryNav				=	require("./GalleryNav.js");

module.exports = Backbone.ViewBase.extend({
	
	id: "gallery",
	template : require("./../templates/gallery.tpl"), 

	init: function(){ 
		//console.log(this);	 
		var data = this.options.data;
		this.model = new Backbone.Model()		
		this.$el.html(this.template({key:"gallery"}));
		
		//create gal items container
		this.galleryItems = new GalleryItems({data: data, global:this.global, local: this.model});
		//create nav
		this.nav = new GalleryNav({data: data, global:this.global, local: this.model});
		this.bindEvents();
		
		var $w = $(window).width();
		if ($w < 1000) $w = 1000;
		
		//var fullWidth = $(window).width() * 1.25 * 6 ;
		var fullWidth = $w * 1.5 * 6 ;
		this.$el.css("width", fullWidth);
		
		//var $w = $(window);
		//this.giWidth = $w.width() * 1.25;
		this.giWidth = $w * 1.5;
		
		this.currentId = 0;
		
		this.inTransition = true;
		
		// ACTIVITY TIMER
		this.timerInteraction;
		this.inModal = false;
	},
	bindEvents: function() {
		this.model.on('gitem:select:detail', this.handleDetailSelect.bind(this));
        this.model.on('gitem:select:video', this.handleSelectVideo.bind(this));
        this.model.on('nav:select', this.handleSelectNav.bind(this));
		
		this.global.on("starttimer",this.startTimer.bind(this));
		this.global.on("stoptimer",this.stopTimer.bind(this));
		this.global.on("checktimer",this.checkTimer.bind(this));
		this.global.on("setoverlaymode",this.setOverlayMode.bind(this));
		
        $(document).on("keydown", this.handleKeyPress.bind(this));
        //$("body").on("mousewheel", this.handleMouseWheel.bind(this));
        $(window).on("resize", this.resize.bind(this));
	},
	handleMouseWheel: function(event, delta){
		if ( this.inTransition ) return;
		event.preventDefault();
		var targetId = this.currentId;
		if (delta > 0) {
			targetId--
		} else {
			targetId++
		}
		this.handleSelectNav(targetId);
	},
	handleSelectNav: function(id){
		if (id > 4) id = 4;
		if (id < 1) id = 0;
		if (this.currentId == id) return;
		this.scrollToItem(id);
	},
	scrollToItem: function(id){
		this.inTransition = true;
		var newPosition = Math.floor(this.giWidth * id);
		var curPosition = Math.floor(this.giWidth * this.currentId);
		that = this;
		
		// COVER UP THE NAV SO IT ISNT CLICKABLE
		TweenMax.set( $('.bottom-nav-cover'), { display: 'block' } );
		
		// NEW SCROLLING
		//TweenMax.killAll(false, true, false);
		TweenLite.killTweensOf($('.gallery-inner'));
		TweenMax.to( $('.gallery-inner'), 3, { x: -newPosition, ease: Power4.easeInOut, delay: .5,
			onStart: function() {
				that.nav.updateSelected(id);
			}, onComplete: function() {
				that.inTransition = false;
				TweenMax.set( $('.bottom-nav-cover'), { display: 'none' } );
			}
		});
		
		// NO ANIMATIONS IF ALREADY THERE
		if ( newPosition == curPosition ) return;
		
		// SIGNATURE DRAWING RESTART	
		if (id != 0) {
			that.galleryItems.galleryItems[id].imgSeq.goTo(0);
			that.galleryItems.galleryItems[id].imgSeq.pause();
		}
		
		// GENERIC ANIMATIONS
		TweenMax.fromTo( $('.g-item:eq(' + id + ') .made-by'), 2, { autoAlpha: 0 }, { autoAlpha: 1, ease: Expo.EaseOut, delay: 2 } );
		TweenMax.fromTo( $('.g-item:eq(' + id + ') .sig'), .5, { autoAlpha: 0 }, { autoAlpha: 1, delay: 1, onComplete: function() {
			if (id != 0) {
				that.galleryItems.galleryItems[id].imgSeq.begin();
			}
		}});
		
		// DIRECTION SPECIFIC ANIMATIONS
		if ( newPosition > curPosition ){
			// NEW SECTION ITEMS
			TweenMax.fromTo( $('.g-item:eq(' + id + ') .film-icon'), 3.5, { x: 500 }, { x: 0, ease: Power4.easeInOut, delay: .5 } );
			TweenMax.staggerFromTo( $('.g-item:eq(' + id + ') .btn-circle .view-text'), 3, { x: 50 }, { x: 0, ease: Power4.easeInOut, delay: .5 }, .1 );
			TweenMax.staggerFromTo( $('.g-item:eq(' + id + ') .btn-circle .view-text'), 3, { autoAlpha: 0 }, { autoAlpha: 1, delay: 2.5 }, .25 );
			TweenMax.staggerFromTo( $('.g-item:eq(' + id + ') .btn-circle .view-right'), .25, { height: 0 }, { height: 100, ease: Power0.easeIn, delay: 2.5 }, .25 );
			TweenMax.staggerFromTo( $('.g-item:eq(' + id + ') .btn-circle .view-left'), .25, { height: 0 }, { height: 100, ease: Power0.easeout, delay: 2.75 }, .25 );
			// OLD SECTION ITEMS
			TweenMax.to( $('.g-item:eq(' + this.currentId + ') .film-icon'), 3, { x: -500, ease: Power4.easeInOut, delay: .5 } );
			
		} else {
			// NEW SECTION ITEMS
			TweenMax.fromTo( $('.g-item:eq(' + id + ') .film-icon'), 3.5, { x: -500 }, { x: 0, ease: Power4.easeInOut, delay: .5 } );
			TweenMax.staggerFromTo( $('.g-item:eq(' + id + ') .btn-circle .view-text'), 3, { x: -50 }, { x: 0, ease: Power4.easeInOut, delay: .5 }, -.1 );
			TweenMax.staggerFromTo( $('.g-item:eq(' + id + ') .btn-circle .view-text'), 3, { autoAlpha: 0 }, { autoAlpha: 1, delay: 3 }, -.25 );
			TweenMax.staggerFromTo( $('.g-item:eq(' + id + ') .btn-circle .view-right'), .25, { height: 0 }, { height: 100, ease: Power0.easeIn, delay: 3 }, -.25 );
			TweenMax.staggerFromTo( $('.g-item:eq(' + id + ') .btn-circle .view-left'), .25, { height: 0 }, { height: 100, ease: Power0.easeout, delay: 3.25 }, -.25 );
			// OLD SECTION ITEMS
			TweenMax.to( $('.g-item:eq(' + this.currentId + ') .film-icon'), 3, { x: 500, ease: Power4.easeInOut, delay: .5 } );
		}

		// SET WHERE WE ARE AT
		this.currentId = id;
		
	},
	handleKeyPress: function(e){
		if ( this.inTransition ) return;
		var keyCode = e.keyCode || e.which, arrow = {left: 37, up: 38, right: 39, down: 40 };
		var targetId = this.currentId;
		switch (keyCode) {
			case arrow.up:
			case arrow.left:
				targetId--;
				this.global.trigger("starttimer");
				break;
			case arrow.down:
			case arrow.right:
				this.global.trigger("starttimer");
				targetId++;
				break;
		}
		this.handleSelectNav(targetId);
	},
	handleDetailSelect: function(content){
		//console.log("gal handle select content",content);
		this.trigger("selectDetail", content);
	},
	handleSelectVideo: function(content, idx){
		
		this.trigger("selectVideo", content);
	},
	startTimer: function(){
		this.stopTimer();
		//console.log("START TIMER");
		var that = this;
		this.timerInteraction = setTimeout(function() {
			that.checkTimer();
		}, 10000);
	},
	stopTimer: function(){
		//console.log("STOP TIMER");
		clearTimeout(this.timerInteraction);
		this.timerInteraction = 0;
	},
	checkTimer: function(){
		//console.log("CHECK TIMER");
		if ( this.inTransition || this.inModal ) {
			// SITE IS MOVING. JUST RESTART TIMER.
		} else {
			// GO TO THE NEXT SECTION
			var targetId = this.currentId;
				targetId++;
			if (targetId > 4) targetId = 0;
			this.handleSelectNav(targetId);
		};
		this.stopTimer();
		this.startTimer();
	},
	setOverlayMode: function(boolean){
		this.inModal = boolean;
	},
	resize: function(){		
		var $w = $(window).width();
		if ($w < 1000) $w = 1000;
		var fullWidth = $w * 1.5 * 6 ;
		this.$el.css("width", fullWidth);
		this.giWidth = $w * 1.5;
		
		TweenMax.set( $('.gallery-inner'), { x: -(this.giWidth * this.currentId) } );
	}
});  
},{"./../templates/gallery.tpl":34,"./GalleryItems.js":8,"./GalleryNav.js":9}],8:[function(require,module,exports){
var GalleryItem             =   require("./GItem.js");
module.exports = Backbone.ViewBase.extend({

		template : require("./../templates/gallery-items.tpl"), 

		init: function(){			
			var data = this.options.data;
			this.$el.html(this.template({key:"gallery-items"}));
			$(".gallery-inner").append(this.$el);
			//create gallery items
			this.galleryItems = [];
			for(i=0;i<data.galleryItems.length;i++){
				var galleryItem = new GalleryItem({index: i, galleryItem: data.galleryItems[i], global: this.global, local: this.local});
				this.galleryItems.push(galleryItem);
				galleryItem.on('selectDetail', this.handleSelectDetail.bind(this));
				galleryItem.on('selectVideo', this.handleSelectVideo.bind(this));
			}
			
			$(".gallery-items").css("height", $(window).height());
			
			this.bindEvents();
		},
		bindEvents: function(){
        	$(window).on("resize", this.resize.bind(this));
		},
		handleSelectDetail: function(index){
		var content = this.options.data.galleryItems[index.idx];
		this.trigger("selectDetail", {content: content});
		},
		handleSelectVideo: function(index){
			var content = this.options.data.galleryItems[index.idx];
			
			//unselect other items
			//console.log("gal handle selectvideo index",index);
			//console.log("gal handle selectvideo content",content);
			//this.trigger("selectVideo", {content: content, idx: index.idx});
		},
		resize: function(){
			$(".gallery-items").css("height", $(window).height());
		} 
});
},{"./../templates/gallery-items.tpl":32,"./GItem.js":6}],9:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({
	template : require("./../templates/gallery-nav.tpl"), 
	init: function(){			
		this.$el.html(this.template({key:"gallery-nav"}));
		$(".main").append(this.$el);
		this.bindEvents();
		this.$el.find(".nav0").addClass("selected");
		
		if (navigator.appVersion.indexOf("Win")!=-1){
		     //It is Windows
		     this.$(".name").css("top", "7px");
		}else if(navigator.appVersion.indexOf("Linux")!=-1){
		     //It is Linux
 		     this.$(".name").css("top", "4px");
		}else if(navigator.appVersion.indexOf("Mac")!=-1){
		     //It is Mac
 		     this.$(".name").css("top", "4px");
		}

	},
	bindEvents: function(){
		this.$el.find(".trk").on("click", this.sendTrackingEvent.bind(this));
		this.global.on("deeplink",this.handleDeepLink.bind(this));
		this.$el.find('.nav-item').on('click', this.scrollNav.bind(this));
		
		that = this;
		this.$el.find('.bottom-nav').hover(
			 function(){
				 // TIMER
				that.global.trigger("stoptimer");
		
				//TweenMax.to( $('.gallery-inner'), 1, { y: -70, ease: Expo.easeOut });
				TweenMax.to( $('.bar-extra'), 1, { y: -60, ease: Expo.easeOut });
				
				TweenMax.staggerTo($('.nav-item'), .75, { y: -50, ease: Expo.easeOut }, .05 );
				TweenMax.staggerTo( $('.bar-bottom'), .75, { y: 35, ease: Expo.easeOut }, .05 );
				TweenMax.staggerTo( $('.bar-left'), .75, { y: 15, ease: Expo.easeOut }, .05 );
				
				TweenMax.fromTo( $('.icon'), .75, { y: 0, autoAlpha: 1 }, { y: 0, autoAlpha: 0, ease: Expo.easeOut } );
				TweenMax.fromTo( $('.iconbig'), .75, { y: 30, autoAlpha: 0 }, { y: 10, autoAlpha: 1, display: "block", ease: Expo.easeOut, delay: .1 });
				
				TweenMax.staggerTo( $('.num'), .75, { y: 0, autoAlpha: 0, ease: Expo.easeOut }, .05 );
				TweenMax.staggerTo( $('.num .number1'), .75, { y: -20, autoAlpha: 0, ease: Expo.easeOut  }, .05 );
				TweenMax.staggerTo( $('.num .number2'), .75, { y: -20, autoAlpha: 0, ease: Expo.easeOut, delay: .1  }, .05 );
				
				TweenMax.staggerFromTo( $('.numbig'), .75, { y: 0, autoAlpha: 0 }, { y: 0, autoAlpha: 1, display: "block", ease: Expo.easeOut  }, .05 );
				TweenMax.staggerFromTo( $('.numbig .number1'), .75, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: Expo.easeOut  }, .05 );
				TweenMax.staggerFromTo( $('.numbig .number2'), .75, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: Expo.easeOut, delay: .1  }, .05 );
				
				TweenMax.staggerFromTo( $('.first'), .75, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, display: "block", ease: Expo.easeOut }, .05 );
				TweenMax.staggerFromTo( $('.last'), .75, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, display: "block", ease: Expo.easeOut, delay: .1 }, .05 );
				
				TweenMax.staggerFromTo( $('.anim-dl'), .75, { y: 0 }, { y: -30, ease: Expo.easeOut, delay: .3 }, .05 );
				TweenMax.fromTo( $('.download-links p'), .75, { y: 0 }, { y: -30, ease: Expo.easeOut, delay: .4 } );
			 },
			 function(){
				// TIMER
				that.global.trigger("starttimer");
				 
				TweenLite.killTweensOf( $('.bar-extra') );
				TweenLite.killTweensOf( $('.nav-item') );
				TweenLite.killTweensOf( $('.bar-bottom') );
				TweenLite.killTweensOf( $('.bar-left') );
				 
				TweenLite.killTweensOf( $('.icon'));
				TweenLite.killTweensOf( $('.iconbig'));
				
				TweenLite.killTweensOf( $('.num'));
				TweenLite.killTweensOf( $('.num .number1') );
				TweenLite.killTweensOf( $('.num .number2') );
				
				TweenLite.killTweensOf( $('.numbig') );
				TweenLite.killTweensOf( $('.numbig .number1') );
				TweenLite.killTweensOf( $('.numbig .number2') );
				
				TweenLite.killTweensOf( $('.first') );
				TweenLite.killTweensOf( $('.last') );
				
				TweenLite.killTweensOf( $('.anim-dl') );
				TweenLite.killTweensOf( $('.download-links p') );
				
				//TweenMax.to( $('.gallery-inner'), 1, { y: 0, ease: Expo.easeOut });
				TweenMax.to( $('.bar-extra'), 1, { y: 0, ease: Expo.easeOut });
				
				TweenMax.to( $('.icon'), .75, { y: 0, autoAlpha: 1, ease: Expo.easeOut, delay: .1 });
				TweenMax.to( $('.iconbig'), .75, { y: 30, autoAlpha: 0, ease: Expo.easeOut });
				
				TweenMax.staggerTo( $('.nav-item'), .75, { y: 0, ease: Expo.easeOut }, .05 );
				TweenMax.staggerTo( $('.bar-bottom'), .75, { y: 0, ease: Expo.easeOut }, .05 );
				TweenMax.staggerTo ($('.bar-left'), .75, { y: 0, ease: Expo.easeOut }, .05 );
				
				TweenMax.staggerTo( $('.num'), .75, { y: 0, autoAlpha: 1, ease: Expo.easeOut }, .05 );
				TweenMax.staggerTo( $('.num .number2'), .75, { y: 0, autoAlpha: 1, ease: Expo.easeOut  }, .05 );
				TweenMax.staggerTo( $('.num .number1'), .75, { y: 0, autoAlpha: 1, ease: Expo.easeOut, delay: .1 }, .05 );
				
				TweenMax.staggerTo( $('.numbig'), .75, { y: 0, autoAlpha: 0, ease: Expo.easeOut }, .05 );
				TweenMax.staggerTo( $('.numbig .number1'), .5, { y: 0, autoAlpha: 0, ease: Expo.easeOut  }, .05 );
				TweenMax.staggerTo( $('.numbig .number2'), .5, { y: 0, autoAlpha: 0, ease: Expo.easeOut, delay: .1 }, .05 );
				
				TweenMax.staggerTo( $('.last'), .5, { y: 0, autoAlpha: 0, ease: Expo.easeOut, delay: 0 }, .05 );
				TweenMax.staggerTo( $('.first'), .5, { y: 0, autoAlpha: 0, ease: Expo.easeOut, delay: .1 }, .05 );
				
				TweenMax.staggerTo( $('.anim-dl'), .75, { y: 0, ease: Expo.easeOut, delay: .3 }, .05 );
				TweenMax.to( $('.download-links p'), .75, { y: 0, ease: Expo.easeOut, delay: .25 } );
			 }
		);
	},
	updateSelected: function(idx) { //id
		for(i=0;i<=4;i++){
			if(i == idx){
				this.$el.find(".nav"+idx).addClass("selected");	
			}else{
				this.$el.find(".nav"+i).removeClass("selected");		
			}	
		}
	},
	scrollNav: function(e){
		var id = parseInt(e.currentTarget.getAttribute('data-id'));
		this.local.trigger("nav:select", id);
	},
	arrowScroll: function(e){

	},
	handleDeepLink: function(deeplink){
		$( ".nav" + deeplink ).trigger( "click" );
	},
	sendTrackingEvent: function(e){
			var category = e.currentTarget.getAttribute('data-category');
			var label = e.currentTarget.getAttribute('data-label');
			var eventStr = category + " " + label;
			ga('send', 'event', category, 'click', label);
			//console.log(eventStr);
	}
});
},{"./../templates/gallery-nav.tpl":33}],10:[function(require,module,exports){
module.exports = Backbone.ModelBase.extend({
		
		initialize: function(){
			
		}
		
});
},{}],11:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({

		id: "header",
		template : require("./../templates/header.tpl"), 

		events: {
			
		}, 

		init: function(){			
			this.$el.html(this.template({key:"header"}));
			
		}
		
		
});
},{"./../templates/header.tpl":35}],12:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({

	template : require("./../templates/intro.tpl"), 
	events: {
		
	}, 

	init: function(){			
		this.$el.html(this.template({key:"intro"}));
		this.$el.css("width", $(window).width())
		TweenMax.set( $('#loader-panel'), { autoAlpha: 0, display: 'block' } );
		TweenMax.set( $('#intro-panel'), { autoAlpha: 0, display: 'block' } );
		TweenMax.set( $('.loader-sprite'), { scaleX: .8, scaleY: .8 } );
		
		this.bindEvents();
	
		this.showPreloader();
	},
	bindEvents: function() {
		this.$el.find('.intro-shoe').on("click", this.selectOption.bind(this));
        $(window).on("resize", this.resize.bind(this));
        this.global.on("preloader:preloaded",this.onPreloaded.bind(this))
	},
	onPreloaded: function(){
		this.hidePreloader();
	},
	showPreloader: function(){
		that = this;
		TweenMax.fromTo( $('#loader-panel'), 1, { autoAlpha: 0 }, { autoAlpha: 1, display: 'block', delay: 1, onComplete: function() {
			//that.hidePreloader();
		}});
	},
	hidePreloader: function(){
		that = this;
		TweenMax.fromTo( $('#loader-panel'), 2, { autoAlpha: 1 }, { autoAlpha: 0, display: 'none', delay: 1, onComplete: function() {
			that.showIntro();
		}});
	},
	showIntro: function(){
		that = this;
		TweenMax.fromTo( $('#intro-panel'), .25, { autoAlpha: 0 }, { autoAlpha: 1, display: 'block'});
		TweenMax.fromTo( $('.intro h1'), 2, { x: 100, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: Expo.easeOut } );
		TweenMax.fromTo( $('.intro .underline'), 1, { scaleX: .5 , autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, transformOrigin:"right top", ease: Expo.EaseOut });
		TweenMax.fromTo( $('.intro h2'), 2, { x: 100, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: Expo.easeOut, delay: .25 } );
		TweenMax.staggerFromTo( $('.intro .intro-shoe'), 2, { x: 100, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: Expo.easeOut }, .25 );
		//TweenMax.fromTo( $('.intro h3'), 4, { autoAlpha: 0 }, { autoAlpha: 1, ease: Expo.easeOut, delay: 2 });
		
		// QUICK TYPEWRITER EFFECT
		var $target = $("#intro-panel .typewriter");
		var $text = $target.html();
		$target.html(
			$text.replace('<br>','~')
			.replace(/./g, '<span class="letter">$&</span>')
			.replace('~', '<br>' )
		);
		TweenMax.staggerFromTo( $('#intro-panel .letter'), .01, { autoAlpha: 0 }, { autoAlpha: 1 }, .05 );
		
		// 5 SECOND DELAY BEFORE INTRO IS SKIPPED
		TweenMax.delayedCall( 5, this.deeplinkIntro, [1], this);
	},
	selectOption: function(e){
		var id = parseInt($(e.target).index());
		var deeplink;
		
		if (id == 5) {
			deeplink = 1;
		} else {
			deeplink = id + 1;
		}
		TweenMax.killDelayedCallsTo(this.deeplinkIntro);
		this.deeplinkIntro(deeplink);
		
		// remove click event from shoe
		this.$el.find('.intro-shoe').unbind("click");
	},
	deeplinkIntro: function(deeplink){
		this.global.trigger("deeplink",deeplink);
		this.hideIntro(deeplink);
	},
	hideIntro: function(deeplink){
		// MOVE THE INTRO SECTION OVER WITH ENTIRE GALLERY
		//var $w = $(window).width() * 1.25;
		//var targetPosition = Math.floor($w * deeplink);
		
		var $w = $(window).width();
		if ($w < 1000) $w = 1000;
		var targetPosition = Math.floor(($w  * 1.75) * deeplink);
		
		TweenMax.set( $('.g-item:eq(0)'), { autoAlpha: 0, backgroundColor: '#ffffff' }); 
		TweenMax.fromTo( $('.intro'), 3, { x: 0 }, { x: -targetPosition, ease: Power4.easeInOut, delay: .5 });
		TweenMax.fromTo( $('.intro h2'), 1, { autoAlpha: 1 }, { autoAlpha: 0, delay: .5 });
		
		TweenMax.fromTo( $('.intro'), 1, { autoAlpha: 1 }, { autoAlpha: 0, display: 'none', delay: 2,
			onComplete: function() {
				TweenMax.set( $('.g-item:eq(0)'), { autoAlpha: 1 });
			}
		});
		
		// SHOW BOTTOM NAV
		//TweenMax.fromTo( $('.bottom-nav'), 2, { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: Power4.easeInOut, delay: 1 });
		TweenMax.set( $('.bottom-nav'), { y: 0, autoAlpha: 1 });
		TweenMax.staggerFromTo($('.nav-item'), 1, { y: 60 }, { y: 0, ease: Power4.easeOut, delay: 2 }, .1 );
		TweenMax.staggerFromTo($('.download-links'), 1, { y: 60 }, { y: 0, ease: Power4.easeOut, delay: 2.5 });
		
		// START THE SITE TIMER
		this.global.trigger("starttimer");
	},
	resize: function(){
		var $w = $(window);
		var fullWidth = $w.width();
		this.$el.css("width", fullWidth);
	}
});
},{"./../templates/intro.tpl":36}],13:[function(require,module,exports){
var Shares              =   require("./Social.js");

module.exports = Backbone.ViewBase.extend({
	id: "player",
	template : require("./../templates/player.tpl"), 
	events:{
		'click .play-pause': 'togglePlay',
		'click .mute': 'toggleSound',
		'click .close': 'hide',
		'click .home': 'hide',
		'click .replay': 'replay',
		'click .android-app': 'toPlayStore',
		'click .ios-app': 'toAppStore',
		'click .trk': 'sendTrackingEvent'
	},

	init: function(){
		this.hasPlayed = false;			
		this.$el.html(this.template({idx:-1}));
		//console.log("data",this.options.data);
		/*player360 = new imPlayer(document.getElementById('playerContainer'));
		//console.log("player360 load", this.options.data.galleryItems[1].videoURL);
		var _this = this;
		player360.onLoad = function(e){
			//console.log("playerLoaded!!!", _this.options.data.galleryItems[1].videoURL);
			player360.loadScenePlugin('im.skin.shades.VideoBar','plugins/IMGui.swf');
		//	player360.loadVideo(_this.options.data.galleryItems[1].videoURL);
		}
		player360.init('../lib/player/');*/
		//console.log(player360);
		//console.log("shares",this.$el.find('.shares'));
		this.bindEvents();
		
		this.countdownTimer;
		this.countdownNumber = 9;
		
	},
	bindEvents: function(){
		this.$el.find('.skip').on("click", this.closeInstructions.bind(this));
	//	this.$el.find('.close').on('click', this.hide.bind(this));
	//	this.$el.find('.play-pause').on('click', this.togglePlay.bind(this)); //was double firing
	//	this.$el.find('.mute').on('click', this.toggleSound.bind(this));
	},
	replay: function(){
		player360.setMediaProperty("framenumber", 0);
		player360.playVideo();
		$('.end-screen').css("display","none");
	},
	togglePlay: function(){
		if(this.playing == true){
			this.$('.pause').hide();
			this.$('.play').show();
			this.playing= false;
			player360.pauseVideo();
		}else{
			this.$('.play').hide();
			this.$('.pause').show();
			this.playing= true;
			player360.playVideo();
		}
	},
	toggleSound: function(){
		if(this.muted == false){
			this.$('.soundOn').hide();
			this.$('.soundOff').show();
			this.muted= true;
			player360.getMediaProperty("volume"); //must get first
			player360.setMediaProperty("volume", 0);
		}else{
			this.$('.soundOff').hide();
			this.$('.soundOn').show();
			this.muted= false;
			player360.getMediaProperty("volume"); //must get first
			player360.setMediaProperty("volume", 1);
		}
	},
	toAppStore: function(){
		//window.location = "https://itunes.apple.com/us/app/in-their-chucks-360-experience/id968846917?mt=8";
		window.open("https://itunes.apple.com/us/app/in-their-chucks-360-experience/id968846917?mt=8");
	
	},
	toPlayStore: function(){
		//window.location = "https://play.google.com/store/apps/details?id=com.converse.intheirchucks";
		window.open("https://play.google.com/store/apps/details?id=com.converse.intheirchucks");
	},
	updateContent: function(obj){
		//this.$el.html(this.template({idx:obj.idx}));
		//console.log("index",obj.idx);
		//start Timer
		var d = new Date();
    	this.startTime = d.getTime();
		this.creator = this.options.data.galleryItems[obj.idx].creator;
		var theURL = this.getURL(obj);
		var _this = this;
		$.ajax({
		  dataType: 'json',	
          url: theURL,
	          beforeSend: function( xhr ) {
	            xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	          }
	        })
	          .done(function( data ) {

	              var vidURL = data.videos[0].videoUrl;
	            	_this.setPlayer(obj, vidURL);
	          });
	},
	padding: function(num, size){
    	var s = "000000000" + num;
    	return s.substr(s.length-size);
	},
	getURL: function(obj){
		var id = parseInt(this.options.data.galleryItems[obj.idx].videoID);
		var first = this.padding(parseInt(id/1000000), 3);
		var second = this.padding(parseInt((id % 1000000)/1000),3);
		return this.options.data.galleryItems[obj.idx].videoBasePath + first + "/" + second + "/" + id + "/source";
	}, 
	setPlayer: function(obj, vidURL){
		player360 = new imPlayer(document.getElementById('playerContainer'));
		var _this = this;
		this.theInterval = null;
		player360.onLoad = function(e){
		//	console.log("playerLoaded!!!", _this.options.data.galleryItems[obj.idx].videoURL);
			player360.loadScenePlugin('im.skin.shades.VideoBar','plugins/IMGui.swf');
			//console.log(player360);
			//console.log(_this.options.data.galleryItems[obj.idx].videoURL)
			// console.log(vidURL);
			player360.loadVideo(vidURL,0,true);
			//TEST URLS
			
			// player360.loadVideo(_this.options.data.galleryItems[obj.idx].testURL);
			_this.playing = true;
			_this.muted= false;
			
			var angle = _this.options.data.galleryItems[obj.idx].angle
			player360.setCameraProperty('maxPitch', 90);
			player360.setCameraProperty('minPitch', angle); 
			player360.setCameraProperty('maxFov', 80);
			player360.setCameraProperty('minFov', 80);
			/*_this.theInterval = setInterval(function(){
				console.log(player360.getCameraProperty("pitch"));
			}, 1000);*/
			
		}
		player360.onVideoEvent = function(e) {
			if( e.type==imVideoEventType.Finished ){
			//	console.log('[video event: ' + e.type + ']');
				//TRIGGER REPLAY SCREEN
				$('.end-screen').css("display","block");
				_this.completedTrackingEvent();
			} //fires at the end of the video 
			if( e.type==imVideoEventType.FirstFrame ){
			//	console.log('[video event: ' + e.type + ']');
				_this.$('.pause').show();
				_this.$('.soundOn').show();
			} //fires when the first frame is shown 
			if( e.type==imVideoEventType.DurationChanged ){
			//	console.log('[video event: ' + e.type + ']');	
			} //fires just after Playing when the file metadata is read 
			if( e.type==imVideoEventType.Playing ){
			//	console.log('[video event: ' + e.type + ']');
			} //fires when video file header starts to be read, before it actually plays 
			if (e.type == "bytes.loaded") {
			
				if(haveTotal == false) {
				totalBytes = player.getMediaProperty('bytesTotal'); haveTotal = true;
				}
				bytesLoaded = player.getMediaProperty('bytesLoaded');
			//	console.log("media property bytesLoaded: " + bytesLoaded + " or " + (bytesLoaded*100/totalBytes).toFixed(2) + " %");
			}
		}
		player360.init('../madebyyou/lib/player/', null, {wmode:"opaque"});
		//console.log("update content", obj);
		//this.socials = new Shares({channels:obj.content.social, $el:this.$el.find('.shares')});
		this.bindEvents();
		

		this.show();
	},
	show: function(){
		//console.log(this.$el);
		this.$el.css("display", "block");
		$('.end-screen').css("display","none");
		// HIDE BOTTOM NAV
		TweenMax.to( $('.bottom-nav'), 1, { y: 80, autoAlpha: 0, ease: Power4.easeIn });
		
		var $w = $(window).width();
		TweenMax.fromTo( $('.player-background'), 1.75, { x: $w, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: Power4.easeInOut });
		TweenMax.fromTo( $('.player-inner'), 1.5, { x: $w }, { x: 0, ease: Power4.easeInOut, delay: .25 } );
		
		TweenMax.fromTo( $('.instructions'), 1, { autoAlpha: 0 }, { autoAlpha: 1, delay: 2 } );
		TweenMax.fromTo( $('.headphones'), 2, { autoAlpha: 0, y: -150 }, { autoAlpha: 1, y: 0, ease: Power4.easeInOut, delay: 2 } );
		
		TweenMax.fromTo( $('.status'), 1, { autoAlpha: 0 }, { autoAlpha: 1, delay: 2.5 } );
		TweenMax.fromTo( $('.skip'), 1, { autoAlpha: 0 }, { autoAlpha: 1, delay: 3 } );
		
		TweenMax.fromTo( $('.instruction1'), 1, { autoAlpha: 1 }, { autoAlpha: 0, delay: 5 } );
		TweenMax.fromTo( $('.instruction2'), 1, { autoAlpha: 0 }, { autoAlpha: 1, delay: 6 } );
		TweenMax.fromTo( $('.arrow-left'), 1, { x: 100, autoAlpha: 0 }, { x: 0, autoAlpha: 1, delay: 6 } );
		TweenMax.fromTo( $('.arrow-right'), 1, { x: -100, autoAlpha: 0 }, { x: 0, autoAlpha: 1, delay: 6 } );
		TweenMax.fromTo( $('.pointer'), 1, { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, delay: 6 } );

		TweenMax.to( $('.instructions'), 1, { autoAlpha: 0, delay: 9, onComplete: function() {
			// START PLAYER HERE
			player360.playVideo();
		}});
		
		this.countdownNumber = 9;
		this.countdownStart();
	},
	countdownStart: function(){
		this.countdownNumber--;
		$('.status span').html(this.countdownNumber);
		if (this.countdownNumber == 0){
			clearTimeout(this.countdownTimer);
			this.countdownTimer = 0;
		} else  {
			var that = this;
			this.countdownTimer = setTimeout(function() {
				that.countdownStart();
			}, 1000);
		}
	},
	sendVideoTimeEvent: function(){
		var d = new Date();
    	this.endTime = d.getTime();
    	var timeSpent = parseInt((this.endTime - this.startTime)/1000);
    	var category =  "duration-watched";
    	var label = this.creator; 
    	ga('send', 'event', category, 'watch', label, timeSpent);
    	//console.log(category + "watch " + label + timeSpent);
	},
	completedTrackingEvent: function(){
		var category = "video watched"
		var label = this.creator; 
    	ga('send', 'event', category, 'completed', label);
    	//console.log(category + "completed " + label);
	},
	hide: function(){
		this.sendVideoTimeEvent();
		//console.log("hide elm");
		$('.play, .soundOn, .soundOff, .pause, .end-screen').hide();
		//window.clearInterval(this.theInterval);
		this.global.trigger("hidePlayer");
		
		var that = this;
		var $w = $(window).width();
		TweenMax.to( $('.player-background'), 1.65, { autoAlpha: 0 } );
		TweenMax.to( $('.player-background'), 1.5, { x: $w, ease: Power4.easeInOut, delay: .15 } );
		TweenMax.to( $('.player-inner'), 1.5, { x: $w, ease: Power4.easeInOut, onComplete: function() {
			that.$el.css("display", "none");
		}});
		
		// SHOW BOTTOM NAV
		TweenMax.to( $('.bottom-nav'), 1, { y: 0, autoAlpha: 1, ease: Power4.easeOut, delay: 1 });
	},
	closeInstructions: function(){
		TweenMax.fromTo( $('.instructions'), 1, { autoAlpha: 1 },{ autoAlpha: 0 } );
		player360.playVideo();
	},
	sendTrackingEvent: function(e){
			var category = e.currentTarget.getAttribute('data-category');
			var label = e.currentTarget.getAttribute('data-label');
			var eventStr = category + " " + label;
			ga('send', 'event', category, 'click', label);
		//	console.log(eventStr);
	}
});
},{"./../templates/player.tpl":39,"./Social.js":15}],14:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({

		id: "preloader",
		template : require("./../templates/preloader.tpl"), 

		events: {
			
		}, 

		init: function(){			
			this.$el.html(this.template({key:"preloader"}));
			//$("#con_mby").append(this.$el);
			
			this.device = this.options.device;
		//	console.log(this.device)
			this.gatherAssets()
			this.preloadAssets();
		
		},
		listMobileAssets: function(){
			this.topAssets = this.options.data.assets.mobile.top;
			//GENERATE SIGNATURE STRINGS
			// for(i=0;i<this.gItems.length;i++){
			// 	if(this.gItems[i].type == 1){
			// 		var gItem = this.gItems[i];
			// 		var frames = gItem.sigOptions.totalCount
			// 	//	console.log(frames);
			// 		for(j=0;j<frames;j++){
			// 			var url = gItem.sigOptions.baseURLMobile+j+"."+gItem.sigOptions.ext;
			// 			this.topAssets.push(url);
			// 		}
			// 	}
			// }
					
		},
		listDesktopAssets: function(){
			this.topAssets = this.options.data.assets.desktop.top;
			//GENERATE SIGNATURE STRINGS
			for(i=0;i<this.gItems.length;i++){
				if(this.gItems[i].type == 1){
					var gItem = this.gItems[i];
					var frames = gItem.sigOptions.totalCount
					//console.log(frames);
					for(j=0;j<frames;j++){
						var url = gItem.sigOptions.baseURL+j+"."+gItem.sigOptions.ext;
						this.topAssets.push(url);
					}
				}
			}	
		},
		gatherAssets: function(){
			this.gItems = this.options.data.galleryItems;
			this.sigURLS = [];
			if(this.device == "desktop"){
				this.listDesktopAssets();
			}else{
				this.listMobileAssets();
			}
		},
		preloadAssets: function(){
			//console.log(this.topAssets);
			var _this = this;
			var assetsLoaded = 0;
			var i;
			
	        var img = null;
	        
	        for(i = 0; i < this.topAssets.length; i++){
	            // new image created, overwrites previous image within the for loop
	            img = new Image();
	            // set the src attribute path to the image file names in the for loop
	            img.src = this.topAssets[i];
	            $(img).on('load', function(i){ 
	            	assetsLoaded++
	            	var percentage = Math.floor(assetsLoaded/ _this.topAssets.length * 100);
	            	$(".preloader-percentage").html(percentage);
	            	$(".loader-percentage").html(percentage);
	            	//console.log(percentage);
	            	if(percentage == 100){
	            		//$(".preloader-percentage").hide();
	            		_this.global.trigger("preloader:preloaded");
	            	}
	            	
	            })
	                 
	            // if last array index, set onload complete handler
	            // if(i == (this.topAssets.length - 1)){
	              
	            //     var theimg = img;
	           
	            //     $(theimg).on('load', function(){ 
	            //            // _this.global.trigger("preloader:preloaded");
	            //        })
	                 
	            // }
	        }
	       
		}


});
},{"./../templates/preloader.tpl":40}],15:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({

		id: "socials",
	template : require("./../templates/socials.tpl"),
        socialTemplates: {
            facebook:  '<div class="social icon-facebook">fb</div>',
            pinterest: '<div class="social icon-pinterest">pin</div>',
            tumblr:    '<div class="social icon-tumblr">tblr</div>',
            twitter:   '<div class="social icon-twitter">tw</div>'
        },
		

		init: function(){		
			this.$el.html(this.template({data:""}));
            //console.log('SHARES', this.$el[0])  ;

            //console.log(this.options.twitter.share)
            //this.bindEvents();
            //var social = this.options.content.social
           
            for(var i=0;i<this.options.channels.length;i++) {
                this.$el.find('.container').append(this.socialTemplates[this.options.channels[i].type])
                
            }
            this.bindEvents();
            
		},
        bindEvents: function(){
           this.$el.find('.icon-facebook').on('click', this.shareFacebook.bind(this));
           this.$el.find('.icon-twitter').on('click', this.shareTwitter.bind(this));
           this.$el.find('.icon-pinterest').on('click', this.sharePinterest.bind(this));
           this.$el.find('.icon-tumblr').on('click', this.shareTumblr.bind(this));
        },
        // this should only be used for main site share
        shareFacebook: function (options) {
            // console.log('shareFacebook', options);
            options = _.extend({
                url: location.href,

            }, options);
            var site = encodeURIComponent(options.url);

            var shareURL = 'http://www.facebook.com/sharer.php?u=' + site ;
            this.openWindow(shareURL, 'Facebook');
        },

        shareFacebookDynamic: function (options) {
            var title = 'title=' + encodeURIComponent(options.title);
            var description = 'description=' + encodeURIComponent(options.description);
            var img = 'img=' + encodeURIComponent(options.img);
            var redirURL = 'redirectURL=' + encodeURIComponent(options.redirectURL);
            var params = [redirURL, title, description, img];

            // generic share url
            var shareUrl = E.SITE_ROOT + 'share?' + params.join('&');

            //    console.log(params);
          
            SocialService.shareFacebook({
                url: shareUrl
            });
        },

        shareTwitter: function (options) {
            // console.log('shareTwitter', options);
            options = _.extend({
                url: '',
                description: 'default',
            }, options);

           /* if( options.url.length + options.description.length > 140){
                console.warn("tweet characters >140: ", options.url.length + options.description.length);
            }*/
          
            var description = encodeURIComponent(options.description);
            if (options.url.length > 1){
                var site = encodeURIComponent(options.url);
                var shareURL = 'http://twitter.com/share?text=' + description + '&url=' + site;
            }else{
                 var shareURL = 'http://twitter.com/share?text=' + description;   
            }
          
            this.openWindow(shareURL, 'Twitter');
        },

        shareTumblr: function (options) {
            // console.log('shareTumblr', options);
            options = _.extend({
                img: "",
                url: window.location.href,
                title: "",
                desc: "",
            }, options);

            //var site = '&u=' + encodeURIComponent(options.url);
            //var title = options.title ? '&t=' + encodeURIComponent(options.title) : '';
            //var shareURL = 'http://tumblr.com/share?s=&v=3' + title + site;
            // var site =  encodeURIComponent(options.url);
            var site =  encodeURIComponent(options.url);
            var photo = encodeURIComponent(options.img);
            var title =  encodeURIComponent(options.title);
            var desc =  encodeURIComponent(options.desc);
            var shareURL_p = "//www.tumblr.com/share/photo?source=" + photo + "&caption=" + desc + "&click_thru=" + site;
            // var shareURL= 'http://www.tumblr.com/share/link?url=' + site + '&name=' + title + '&description='+ desc;
           
            this.openWindow(shareURL_p, 'Tumblr');
        },

        sharePinterest: function (options) {
            // console.log('sharePinterest', options);
            options = _.extend({
                url: window.location.href,
                description: undefined,
                media: undefined,
                isVideo: false
            }, options);

            var media = options.media ? '&media=' + encodeURIComponent(options.media) : '';
            var isVideo = options.isVideo ? '&isVideo=true' : '';
            var site = encodeURIComponent(options.url);
            var description = options.description ? '&description=' + encodeURIComponent(options.description) : '';
            var shareURL = 'http://pinterest.com/pin/create/button/?url=' + site + description + media + isVideo;
            this.openWindow(shareURL, 'Pinterest');
        },

    

    openWindow: function(url, title) {
        var width = 575,
            height = 425,
            opts =
                ',width=' + width +
                ',height=' + height;
        window.open(url, title, opts);
    }

});
},{"./../templates/socials.tpl":41}],16:[function(require,module,exports){

var Router              =   require("./router.js");
var GlobalEventModel 	= 	require("./GlobalEventModel.js");
var Checks              =   require("./utilities/checks/checks.js");
var DataUtil            =   require("./utilities/Data.js"); 
var I18n                =   require("./utilities/I18n.js"); 
var Preloader           =   require("./Preloader.js");

var Header              =   require("./Header.js"); 
var Footer              =   require("./Footer.js");
var Intro               =   require("./Intro.js");
var MobileIntro         =   require("./mobile-intro.js");
var Gallery             =   require("./Gallery.js");
var Detail              =   require("./Detail.js");
var Player              =   require("./Player.js");

var Social              =   require("./Social.js");
var Audio               =   require("./utilities/Audio.js"); 
var MobileGallery       =   require("./mobile-gallery.js");
module.exports = Backbone.View.extend({ 

    template: require('../templates/app.tpl'),
  
    initialize: function(options) {
        this.$el = options.$el;
        this.$el.html(this.template()) ;
        this.initSequence();
    },
    initSequence: function() {
        Sequence(
            [
                { fn:this.setupObj.bind(this) },
                { fn:this.runChecks.bind(this), o:['results'] },
                { fn:this.getData.bind(this), o:['data'] },
                { fn:this.createShares.bind(this), i:['data']},
                { fn:this.setupEnvironment.bind(this), i:['results'] },
                { fn:this.bindEvents.bind(this) }//,
              //  { fn:this.setupRouter.bind(this)}
            ],
            {
                completed: this.finishedInit.bind(this)
            }
        )
    },
    createShares: function(data, cb){
        //this.shares = new Social({channels:data.top.social, $el:this.$el.find('.shares')});
        cb();
    },
    setupObj: function(cb){
    	this.model 	= new GlobalEventModel();
    	//this.router = new Router();
    	this.checks = new Checks();
        this.audio = new Audio();
        this.i18n = new I18n();
        this.dataUtil = new DataUtil();
        cb();
    },
    bindEvents: function(cb){
        this.model.on('gitem:select:detail', this.handleGallerySelectDetail.bind(this));
        this.model.on('gitem:select:video', this.handleGallerySelectVideo.bind(this));
           
        cb();
    },
    finishedInit: function(obj){
        this.model.checksResults = obj.results;  
        this.initialized = true;
       // console.log('finished init')
    },
    runChecks: function(cb){
        this.checks.run(cb);
    },
    getData: function(cb){
        var _this = this;
        this.dataUtil.getData(function(data) {
            _this.model.set('appdata',data);
            cb(data);
        });
    },
    setupEnvironment: function(results, cb){
        this.model.set("checks", results);
         var data = this.model.get('appdata');
        if(results.device.type == "desktop"){
            this.$el.addClass("desktop");
            this.intro = new Intro({global: this.model, data:data, $el:this.$el.find('.intro')});
            this.preloader = new Preloader({global: this.model, device: results.device.type, data:data, $el:this.$el.find('.preloader')});
            this.header = new Header({data:data, $el:this.$el.find('.header')});
            this.footer = new Footer({data:data, $el:this.$el.find('.footer')});
            this.detail = new Detail({global: this.model, data:data, $el:this.$el.find('.detail')});
            this.player = new Player({global: this.model, data:data, $el:this.$el.find('.player')});
            this.page = new Gallery({global: this.model, data:data, $el:this.$el.find('.main')});        

        }else{
            this.$el.find('.intro').hide();
            this.$el.find('.mobile-intro').show();
            this.intro = new MobileIntro({global: this.model, data:data, $el:this.$el.find('.mobile-intro')});
            this.preloader = new Preloader({global: this.model, device: results.device.type, data:data, $el:this.$el.find('.preloader')});
            this.mobileGal = new MobileGallery({global: this.model, device: results.device, data:data, $el:this.$el.find('.mobile')});            
        }      
        
        cb();
    },
    setupRouter: function(cb) {
        var _this = this;
        this.currentPageSlug = "";
        function pageRoute(loc) {
            if(_this.initialized){   
                _this.changePage('gallery');
            } else {
                _this.createPage('gallery');
            }
        }
        this.router.on('route:home', function() {
            pageRoute('gallery');
        });
        this.router.on('route:gallery', function() {
            pageRoute('gallery');
        });
        this.router.start();
        
        cb();
    },
    handleGallerySelectDetail: function(content){
        this.detail.updateContent(content.content);
        this.detail.show();
    },
    handleGallerySelectVideo: function(obj){
	   this.createPlayer(obj);
    },
    changePage: function(slug){
        var data = this.model.get('appdata');

        switch(slug) {
            case "home" :
            case "gallery":  
                 this.newpage = new Gallery({global: this.model, data:data, $el:this.$el.find('.main')}); 
                 this.page.exit();
                 this.page = this.newpage;
                 this.newpage = null;
                 this.page.enter();
                 this.currentPageSlug = "gallery";
                 this.model.on('gitem:select:detail', this.handleGallerySelectDetail.bind(this));
                 this.model.on('gitem:select:video', this.handleGallerySelectVideo.bind(this));
                break;
            default:
                break;
        } 
    },
    createPage: function(slug){
        var data = this.model.get('appdata');
        switch(slug) {
            case "home" :
            case "gallery":
                 this.page = new Gallery({global: this.model, data:data, $el:this.$el.find('.main')});
                 this.currentPageSlug = "gallery";
                 this.model.on('gitem:select:detail', this.handleGallerySelectDetail.bind(this));
                 this.model.on('gitem:select:video', this.handleGallerySelectVideo.bind(this));
                break;
            default:
                break;
        } 
    },
    createPlayer:function(obj){
        //console.log(content)
         this.player.updateContent(obj);
    },
    start: function() {
        //this.preloader.dostomeaksjdn;
    }
});


},{"../templates/app.tpl":27,"./Detail.js":4,"./Footer.js":5,"./Gallery.js":7,"./GlobalEventModel.js":10,"./Header.js":11,"./Intro.js":12,"./Player.js":13,"./Preloader.js":14,"./Social.js":15,"./mobile-gallery.js":17,"./mobile-intro.js":18,"./router.js":19,"./utilities/Audio.js":20,"./utilities/Data.js":21,"./utilities/I18n.js":22,"./utilities/checks/checks.js":24}],17:[function(require,module,exports){
var ImgSeq				=	require("./utilities/img_sequence.js");
module.exports = Backbone.ViewBase.extend({

		
		template : require("./../templates/mobile-gallery.tpl"), 

		events: {
			'click .mobile-gallery' : 'nextSlide',
			'click .shoe': 'toWhichStore',
			'click .android-app': 'toPlayStore',
			'click .ios-app': 'toAppStore',
			'click .trk': 'sendTrackingEvent'
		}, 

		init: function(){

			var _this = this;
			this.$el.html(this.template({key:"mobile-gallery"}));
			
			this.slideIdx = 0;
			this.imgSeq = [];
			var w = $(window).width();

			TweenMax.to( this.$('.mobile-gallery').parent(), 0, { x: w});	
			//OFFSET SHOES AND SIGS
			this.shoes = $(".shoe");
			this.sigs = $(".sig");
			this.madeBy = $(".made-by");
			this.underlines = $(".underLine");
			//hide shoes/underlines
			// for(i=0; i< this.shoes.length; i++){
			// 	if(i%2==0){
			// 		var s = -1;
			// 		TweenMax.to(this.underlines[i], 0, {scaleX: 0.001, opacity:0});
			// 		//TweenMax.to(this.sigs[i], 0, {opacity:1, x: 25});
			// 	}else{
			// 		var s = 1;
			// 		TweenMax.to(this.underlines[i], 0, {scaleX: 0.001, opacity:0});
			// 		//TweenMax.to(this.sigs[i], 0, {opacity:1, x: 150});
			// 	}
			// 	TweenMax.to(this.shoes[i], 0,{opacity:0, x: 200*-s});
			// 	//TweenMax.to(this.madeBy[i], 0,{opacity:0, x: 100*-s});
				
				
				
			// 	this.loadSig(i+1);	
			// }
			var jd = $('.joanna-shoe')[0];
			var kt = $('.king-shoe')[0];
			var re = $('.ron-shoe')[0];
			//TweenMax.set( $(jd), { scaleX: 1.05, scaleY: 1.05});
			TweenMax.set( $(kt), { scaleX: 0.95, scaleY: 0.95});
			//TweenMax.set( $(re), { scaleX: 0.92, scaleY: 0.92});
			this.shoes.addClass("ease");
			this.sigs.addClass("ease");
			this.madeBy.addClass("ease");
			this.underlines.addClass("easeSlow");
			for (var i = 1; i <= 3; i++) {
				var slide = $('.slider-container')[i];
				TweenMax.to( slide, 0, { x: w });
			};
			//hide info
			// var tl = new TimelineMax({});
			// var items = $(".info > li")
			// tl.to(items, 0, {x:30, opacity: 0});

			TweenMax.to( $('.currentText > li'), 0, { x: 60, opacity: 0 });
			var e1 = $(".currentText > li")[0];
			var e2 = $(".currentText > li")[1];
			
			//$(".currentText").removeClass("ease");
			TweenMax.to([e1, e2], 0, {x:80, opacity: 0});
			$(".currentText h1").addClass("ease");
			var cb = this.$(".cardboard-goggles");
			var h1 = this.$("h1");
			TweenMax.to(cb, 0, {x:70});
			TweenMax.to(h1, 0, {x:50, opacity: 0});
			cb.addClass("ease");
			h1.addClass("easeMed");	
			//this.loadText();
			this.infoTriggered = false;
			this.joannaTriggered = false;
			this.kingTriggered = false;
			this.thomasTriggered = false;
			this.ronTriggered = false;
			this.bindEvents();
			this.$el.addClass("collapse");
			
		},
		sendTrackingEvent: function(e){
			var category = e.currentTarget.getAttribute('data-category');
			var label = e.currentTarget.getAttribute('data-label');
			
			var eventStr = category + " " + label;
			ga('send', 'event', category, 'click', label);
		},
		bindEvents: function(){
			//this.scrollTrigger = _.debounce(this.scrollTriggerFun, 100)
			$("#con_mby").on("scroll", this.scrollTriggerFun.bind(this));
			this.global.on("intro:leaving",this.onIntroLeft.bind(this))

		},
		toAppStore: function(){
			window.open("https://itunes.apple.com/us/app/in-their-chucks-360-experience/id968846917?mt=8");
		},
		toPlayStore: function(){
			window.open("https://play.google.com/store/apps/details?id=com.converse.intheirchucks");
		},
		toWhichStore: function(){
			if(this.options.device.os == 'iOS'){
				this.toAppStore();
			}else{
				this.toPlayStore();
			}
		},
		onIntroLeft: function(){
			this.$el.removeClass("collapse");
			var _this = this;
			//Slide in
			TweenMax.to( this.$('.mobile-gallery').parent(), 0, { x: 0});
			var e1 = $(".currentText > li")[0];
			var e2 = $(".currentText > li")[1];
			var cb = this.$(".cardboard-goggles");
			TweenMax.to(e1, 0, {x:0, opacity: 1, delay: 0.3});
			TweenMax.to(e2, 0, {x:0, opacity: 1, delay: 0.4});

			TweenMax.to(cb, 0, {x:0});
			var h1 = this.$("h1");
			TweenMax.to(h1, 0, {x:0, opacity: 1});		
			//Start Gallery
			setInterval(function(){
				_this.nextSlide();
			}, 3500);

		},
		scrollTriggerFun: function(e){
			//console.log($(window).scrollTop());
			var _this = this;
			
				var st = $("#con_mby").scrollTop();

				if(st > 30 && _this.infoTriggered == false){
					_this.infoTriggered = true;
					_this.loadText();
				}
				if(st > 345 && _this.joannaTriggered == false){
					_this.joannaTriggered = true;
					_this.slideInShoe(0);
					setTimeout(function(){
						_this.playSig(1);
					}, 400) ;
					
			
				}
				if(st > 630 && _this.kingTriggered == false){
					_this.kingTriggered = true;
					_this.slideInShoe(1);
					setTimeout(function(){
						_this.playSig(2);
					}, 400) ;

				}
				if(st > 980 && _this.thomasTriggered == false){
					_this.thomasTriggered = true;
					_this.slideInShoe(2);
					setTimeout(function(){
						_this.playSig(3);
					}, 400) ;

				}
				if(st > 1320 && _this.ronTriggered == false){
					_this.ronTriggered = true;
					_this.slideInShoe(3);
					setTimeout(function(){
						_this.playSig(4);
					}, 400) ;
				}
				
		},
		slideInShoe: function(idx){
				var _this = this;
				if(idx%2==0){
					var s = -1;
					//TweenMax.to(this.sigs[idx], 0, {opacity: 1});
					TweenMax.to(this.madeBy[idx], 0, {opacity: 1, x: 0});
					TweenMax.to(this.underlines[idx], 0, {delay: 0.7, scaleX: 1, opacity: 1});//, x: 25});
					
				}else{
					var s = 1;
					TweenMax.to(this.madeBy[idx], 0, {opacity: 1, x: 0});
					//TweenMax.to(this.sigs[idx], 0, {opacity: 1, x: 150});
					TweenMax.to(this.underlines[idx], 0, {delay: 0.7, scaleX: 1, opacity: 1});//, x: 150});
					
					
					
				}
				TweenMax.to(this.shoes[idx], 0,{opacity: 1, x: 0});		
			
		},
		loadText:function(){
			
			var items = $(".info > li")
			
			var tl = new TimelineMax({});
			
			$(".info").addClass("slideEase");
			for(i=0;i<items.length;i++){
			var idx = i;	
			setTimeout(function(idx){
				tl.to(items[idx], 0, {x:0, opacity: 1});
			}, 250*i, idx) ;	
			}
		},
		loadSig: function(idx){
			//console.log(this.options.data.galleryItems[idx]);
			var cnv = this.$el.find('.sig')[idx-1];
			var options = this.options.data.galleryItems[idx].sigOptions;	
			cnv.width = options.img.v2w;
			cnv.height = options.img.v2h;
			options.baseURL =  options.baseURLMobile;
			options.img.w =  options.img.v2w;
			options.img.h =  options.img.v2h;	
			options.canvas = cnv;
			this.imgSeq[idx] = new ImgSeq(options);	
		},
		playSig: function(idx){
			this.imgSeq[idx].begin();
		},
		nextSlide: function(){
			var w = $(window).width();
			var tl = new TimelineMax({});
			var _this = this;
			
			if(this.slideIdx == 4)
				this.slideIdx = 0;
			var end = w * (4 - this.slideIdx);
			var third = w * (3 - this.slideIdx);
			var offset = w * this.slideIdx;
			$( ".slider-container" ).removeClass("next");
			$( ".slider-container" ).removeClass("current");
			$( ".slider-container" ).removeClass("out");
			$( ".caption" ).removeClass("nextText");
			$( ".caption" ).removeClass("currentText");
			$( ".caption" ).removeClass("outText");
			$( ".slider-container" ).addClass(function( index ) {
			  var addedClass;
			 
			  if ( index === _this.slideIdx ) {
			    addedClass = "current";
			   
			  }
			  else if ( index === _this.slideIdx + 1) {
			    addedClass = "next";
			   
			  }else if(_this.slideIdx == 3 && index == 0){
			  	addedClass = "next"
			  }

			  else{
			  		addedClass="out"
			  }
			 
			  return addedClass;
			});
			$( ".caption" ).addClass(function( index ) {
			  var addedClass;
			  if ( index === _this.slideIdx ) {
			    addedClass = "currentText"; 
			  }
			  else if ( index === _this.slideIdx + 1) {
			    addedClass = "nextText";
			  }else if(_this.slideIdx == 3 && index == 0){
			  	addedClass = "nextText"
			  }
			  else{
			  		addedClass="outText"
			  }
			 
			  return addedClass;
			});
			//$('.slider-container').get(this.slideIdx).addClass("current");
			//$('.slider-container')[this.slideIdx+1].addClass("next");
			
			
			TweenMax.to( $('.next'), 0, { x: 0 });		
				
			TweenMax.to( $('.current'), 0, { x: -w });
			
			TweenMax.to( $('.out'), 0.01, { x: w });
			var tl = new TimelineMax({});
			var e1 = $(".nextText > li")[0];
			var e2 = $(".nextText > li")[1];

			$(".nextText").removeClass("ease");
			tl.to([e1, e2], 0, {x:70, opacity: 0});

			 tl.to(e1, 0, {x:0, opacity: 1, delay: 0.3});
			 tl.to(e2, 0, {x:0, opacity: 1, delay: 0.4});

			setTimeout(function(){
				$(".nextText").addClass("ease");
			}, 20) 
			//TweenMax.to( $('.nextText'), 0, { x:  0 });		
				
			//TweenMax.to( $('.currentText > li'), 0, { x: 100, opacity: 0 });
			
			//animate slides and pop off top of slider from html stack and add to end(?)
			this.slideIdx++;
			
		},
		
		
		
});
},{"./../templates/mobile-gallery.tpl":37,"./utilities/img_sequence.js":26}],18:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({

	template : require("./../templates/mobile-intro.tpl"), 
	events: {
		
	}, 

	init: function(){
		var _this = this;			
		this.$el.html(this.template({key:"intro"}));
		this.$el.css("width", $(window).width())
		this.$el.css("height", $(window).height())
		this.$el.css("display", "block");
		this.bindEvents();
		this.viewedIntro = false;
		this.showPreloader();
		setTimeout(function(){
			_this.viewedIntro = true;
		}, 2000); //show intro atleast 2 second
	},
	bindEvents: function() {
        $(window).on("resize", this.resize.bind(this));
        this.global.on("preloader:preloaded",this.onPreloaded.bind(this))
	},
	onPreloaded: function(){
		var _this = this;
		if(this.viewedIntro == true){
			this.hidePreloader();
			this.hideIntro();
			var w = $(window).width();
			this.global.trigger("intro:leaving");
			TweenMax.to( this.$('.loader-panel').parent(), 0, { x: -w});		
		}else{
			setTimeout(function(){
				_this.onPreloaded();
			}, 200)
		}
		
	},
	showPreloader: function(){
		
	},
	hidePreloader: function(){
		
	},
	showIntro: function(){
		
	},
	
	hideIntro: function(){
		this.$el.fadeOut(); //TODO animate out		
	},
	resize: function(){
		var $w = $(window);
		var fullWidth = $w.width();
		this.$el.css("width", fullWidth);
	}
});
},{"./../templates/mobile-intro.tpl":38}],19:[function(require,module,exports){
module.exports = Backbone.Router.extend({

        routes: {
            "": "home",
          //  "gallery":  "gallery", 
          //  "gallery/:id": 	"detail",
          //  "player/:id": "player"
        },
        start: function() {
        	Backbone.history.start();
        }
}); 
},{}],20:[function(require,module,exports){
module.exports = Backbone.ModelBase.extend({
		//control global audio
		initialize: function(){
			
		}
		
});
},{}],21:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({

		init: function(){			
			
		},
		
		getData: function(cb){
			///console.log("getting data");
			cb({
				assets: {
					desktop:{
						top: ["./images/Joanna.png","./images/King.png","./images/Thomas.png","./images/Ron.png","./images/cardboard.jpg"],
						second: ["./images/Joanna_top.png","./images/King_top.png","./images/Thomas_top.png","./images/Ron_top.png"],
					},
					mobile:{
						top: ["./images/mobile/Joanna.png","./images/mobile/King.png","./images/mobile/Thomas.png","./images/mobile/Ron.png","./images/cardboard-mobile.png","./images/slider/joanna.jpg","./images/slider/king.jpg","./images/slider/ron.jpg","./images/slider/thomas.jpg"],
						
					}
				},
				top: {
					social: [
							{
								type: "facebook",
								title: "number 1",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg"

							},
							{
								type: "twitter",
								title: "number 1"

							},
							{
								type: "tumblr",
								title: "number 1",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
							{
								type: "pinterest",
								title: "number 1",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
						],
				},
				galleryItems:[

					{	
						type: 2,
						title:"View with or without cardboard goggles",
						img: "images/cardboard.jpg",
						info: "View online now or download the app to move around every corner of the experience by shifting your handheld device in different directions.<br><br>Use <a class= \"trk\" data-category=\"desktop:link\" data-label=\"buy-cardboard\" href=\"http://www.knoxlabs.com/\" target=\"_blank\">cardboard goggles</a> for the fully immersive experience."
					},
					{	
						sigOptions: {
								totalCount:91,
								ext:'png',
								img: {
									h:165,
									w:600,
									hMobile: 148,
									wMobile: 521,
									v2h: 200,
									v2w: 390
								},
									//canvas: cnv,
									loop:false,
									speed:30,
									autoStart:false,
									loadedImages: [],
									baseURL:'./images/Signatures/v2/Joanna/Joanna_',
									baseURLMobile: './images/Signatures/v2/Joanna/Joanna_'
							},
						social: [
							{
								type: "facebook",
								title: "number 1",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg"

							},
							{
								type: "twitter",
								title: "number 1"

							},
							{
								type: "tumblr",
								title: "number 1",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
							{
								type: "pinterest",
								title: "number 1",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
						],
						type: 1,
						label:"joanna-delane",
						creator: "Joanna DeLane",
						title: "Step into a world of zombies<br>with actress Joanna DeLane.",
						img: "images/Joanna.png",
						imgDetail: "images/Joanna_top.png",
						audioDetail: "audio/Joanna.mp3",
						shareImg: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
						videoURL: "http://www.cdn.converse.toolofnadrive.com/Zombie_L_1.mp4",
						testURL: "http://www.cdn.converse.toolofnadrive.com/Zombie_Desktop.mp4",
						
						videoID: "2787",
						videoBasePath: "http://s3.amazonaws.com/im360-apps/56bJifKDv%2BCFXbXcoxwL/sources/",
						angle: -38,
						info: "Joanna DeLane is an actress living in LA pursuing her dreams of the big screen. Recently she played a gruesome role of a zombie extra and scared even herself.<br><br>&quot;Being an actress in Los Angeles...it isn't easy. But if it's your dream, it's worth it.&quot;"
					},
					{
						sigOptions: {
							totalCount:101,
							ext:'png',
							img: {
								h:258,
								w:600,
								hMobile: 192,
								wMobile: 436,
								v2h: 200,
								v2w: 390
							},
								//canvas: cnv,
								loop:false,
								speed:30,
								autoStart:false,
								loadedImages: [],
				                baseURL:'./images/Signatures/v2/Kingtuff/Kingtuff_',
				                baseURLMobile: './images/Signatures/v2/Kingtuff/Kingtuff_'
						},
						social: [
							{
								type: "facebook",
								title: "number 2",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg"

							},
							{
								type: "twitter",
								title: "number 2"

							},
							{
								type: "tumblr",
								title: "number 2",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
							{
								type: "pinterest",
								title: "number 2",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
						],
						type: 1,
						label:"king-tuff",
						creator: "King Tuff",
						title: "Step into the psychedelic mind<br>of musician King Tuff.",
						img: "images/King.png",
						imgDetail: "images/King_top.png",
						audioDetail: "audio/King.mp3",
						shareImg: "http://www.logoquizcheat.com/levels/games/android/bubble-quiz-games_logo-quiz/level-3/converse.jpg",
						videoURL: "http://www.cdn.converse.toolofnadrive.com/kt_5.mov",
						testURL: "http://www.cdn.converse.toolofnadrive.com/KingTuff_Desktop.mp4",
						
						videoID: "2788",
						videoBasePath: "http://s3.amazonaws.com/im360-apps/56bJifKDv%2BCFXbXcoxwL/sources/",
						angle: -32,
						info: "King Tuff, also known by his mother as 'Kyle', is quickly becoming a rock and roll mainstay. With his edgy style and psychedelic lyrics, King Tuff takes us on a journey through his mind with every track. <br><br>&quot;Something that would inspire me is an old man with one tooth or mini grilled cheese.&quot;"
					},
					{
						sigOptions: {
							totalCount:59,
							ext:'png',
							img: {
								h:190,
								w:600,
								hMobile:130,
								wMobile:408,
								v2h: 200,
								v2w: 390 
							},
								//canvas: cnv,
								loop:false,
								speed:30,
								autoStart:false,
								loadedImages: [],
				                baseURL:'./images/Signatures/v2/Thomas/Thomas_',
				                baseURLMobile: './images/Signatures/v2/Thomas/Thomas_'
						},
						social: [
							{
								type: "facebook",
								title: "number 3",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg"

							},
							{
								type: "twitter",
								title: "number 3"

							},
							{
								type: "tumblr",
								title: "number 3",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
							{
								type: "pinterest",
								title: "number 3",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
						],
						type: 1,
						label:"thomas-midlane",
						creator: "Thomas Midlane",
						title: "Step into places unknown<br>with urban explorer Thomas Midlane.",
						img: "images/Thomas.png",
						imgDetail: "images/Thomas_top.png",
						audioDetail: "audio/Thomas.mp3",
						shareImg: "http://fc08.deviantart.net/fs71/f/2013/289/f/1/converse_logo_1_by_mr_logo-d6qo7kh.jpg",
						videoURL: "http://www.cdn.converse.toolofnadrive.com/thomas_3.mp4",
						testURL: "http://www.cdn.converse.toolofnadrive.com/Urban_Desktop.mp4",
						
						videoID: "2789",
						videoBasePath: "http://s3.amazonaws.com/im360-apps/56bJifKDv%2BCFXbXcoxwL/sources/",
						angle: -50,
						info: "Thomas Midlane is an urban explorer that hails from London, England. He finds adventure in exploring the darkest and deepest caverns that his city has to offer.<br><br>&quot;Some say the city is just for shopping. I think it's for meeting new people and exploring new places.&quot;"
					},
					
					
					{
						sigOptions: {
							totalCount:83,
							ext:'png',
							img: {
								h:258,
								w:600,
								hMobile:233,
								wMobile:567,
								v2h: 200,
								v2w: 390
							},
								//canvas: cnv,
								loop:false,
								speed:30,
								autoStart:false,
								loadedImages: [],
				                baseURL:'./images/Signatures/v2/English/English_',
				                baseURLMobile: './images/Signatures/v2/English/English_'
						},
						social: [
							{
								type: "facebook",
								title: "number 4",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg"

							},
							{
								type: "twitter",
								title: "number 4"

							},
							{
								type: "tumblr",
								title: "number 4",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
							{
								type: "pinterest",
								title: "number 4",
								img: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
								description: "number 1 description"
							},
						],
						type: 1,
						label:"ron-english",
						creator: "Ron English",
						title: "Step onto an LA skyscraper with<br>artist Ron English.",
						img: "images/Ron.png",
						imgDetail: "images/Ron_top.png",
						audioDetail: "audio/Ron.mp3",
						shareImg: "http://www.freelargeimages.com/wp-content/uploads/2014/12/Converse_Logo_04.jpg",
						videoURL: "http://www.cdn.converse.toolofnadrive.com/english_2.mp4",
						testURL: "http://www.cdn.converse.toolofnadrive.com/Rooftop_Desktop_02.mp4",
						
						videoID: "2786",
						videoBasePath: "http://s3.amazonaws.com/im360-apps/56bJifKDv%2BCFXbXcoxwL/sources/",
						angle: -34,
						info: "Ron English is a cultural icon that has changed the game in art. He is known for pushing the envelope creatively and politically and isn't afraid to ruffle some feathers along the way.<br><br>&quot;I try to make big political points without pissing anyone off. Which is pretty much impossible.&quot;"
					}

				]

			})
		}

});
},{}],22:[function(require,module,exports){
//api for internationalization 
module.exports = Backbone.ModelBase.extend({
		
		initialize: function(){
			
		}
		
});
},{}],23:[function(require,module,exports){
module.exports = Backbone.ModelBase.extend({
//check browser to show fall back if necessary

		init: function(){			
			
		},

		run: function(){
			navigator.sayswho= (function(){
			    var ua= navigator.userAgent, tem, 
			    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
			    if(/trident/i.test(M[1])){
			        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
			        return 'IE '+(tem[1] || '');
			    }
			    if(M[1]=== 'Chrome'){
			        tem= ua.match(/\bOPR\/(\d+)/)
			        if(tem!= null) return 'Opera '+tem[1];
			    }
			    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
			    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
			    return M.join(' ');
			})();
			var browser = navigator.sayswho.split(" ")[0];
			var version = navigator.sayswho.split(" ")[1];
			//console.log('running browser check')
			this.trigger('complete', {
				name:'browser',
				result:{
					browser: browser,
					version: version
				}
			})
		}

});
},{}],24:[function(require,module,exports){
var Device = 			require("./device.js");
var Browser = 			require("./browser.js");
//var Region =			require("./region.js");
//var Language = 			require("./language.js");
//var Bandwidth = 		require("./bandwidth.js");
//var Webgl = 			require("./webgl.js");
 
module.exports = Backbone.ModelBase.extend({
		results: {},
		init: function(){	
			this.createObjects();
			this.bindEvents();
		},
		createObjects: function() {
			this.device = new Device();
			this.browser = new Browser();	
			//this.region = new Region();		
			//this.language = new Language();
			//this.bandwidth = new Bandwidth();
			//this.webGl = new Webgl();
		},
		bindEvents: function() {
			this.device.on('complete',this.handleComplete.bind(this));
			this.browser.on('complete',this.handleComplete.bind(this));
			//this.region.on('complete',this.handleComplete.bind(this));
			//this.language.on('complete',this.handleComplete.bind(this));
			//this.bandwidth.on('complete',this.handleComplete.bind(this));
			//this.webGl.on('complete',this.handleComplete.bind(this));
		},
		handleComplete: function(e) {
			this.results[e.name] = e.result;
			//console.log(e.result);
			if( 
				this.results.device && 
				this.results.browser //&& 
				//this.results.region && 
				//this.results.language && 
				//this.results.bandwidth &&				
				//this.results.webgl 
			) {

				this.complete()

			}
		},
		run: function(cb){
			this.cb = cb
			this.device.run();
			this.browser.run();
			//this.region.run();
			//this.language.run();
			//this.bandwidth.run();
			//this.webGl.run();
		},
		complete: function() {
			if(this.cb && typeof this.cb === 'function') {
				this.cb(this.results)
			} else {
				this.trigger('complete',this.results)
			}
		}
		
});
},{"./browser.js":23,"./device.js":25}],25:[function(require,module,exports){
module.exports = Backbone.ViewBase.extend({

		init: function(){			

		},
		run: function(){
		//	console.log("running device check");
			var mobileOS = null;
			var result;
			var ua = navigator.userAgent;
			if(ua.match(/Android/i)) {
				mobileOS = 'Android';
			} else if( ua.match(/BlackBerry/i)){
		    	mobileOS = 'BlackBerry';
		    } else if( ua.match(/iPhone/i)) {
		    	mobileOS = 'iOS';
		    } else if( ua.match(/iPad/i)) {
		    	mobileOS = 'iOS';
		    } else if( ua.match(/iPod/i)) {
		    	mobileOS = 'iOS';
		    } else if (ua.match(/Opera Mini/i)){
	        	mobileOS = 'Opera';
	        } else if(ua.match(/IEMobile/i)){
	        	mobileOS = 'Windows';
		    }
		    if(mobileOS) {
		    	result = {
		    		type: 'mobile',
		    		os: mobileOS
		    		//version: needs to be added		    		
		    	}
		    }else {
		    	result = {
		    		type: 'desktop',
		    		os: this.os()
		    	}

		    }
		  	// result = {
	    // 		type: 'mobile' //test mobile on desktop
	    // 	} 
		    this.trigger('complete', {
				name:'device',
				result: result
			})
		},
		os: function() {
			var OSName;
			if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
			if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
			if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
			if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
			return OSName;
		}

});
},{}],26:[function(require,module,exports){
/*
    TO DO
        - add preloading
*/


module.exports = Backbone.Model.extend({
    config: {

    },
    state: {},
    initialize: function(options) {
        this.setConfig(options)
        this.state = {};
        if(this.config.autoStart) {
            this.begin();
        }
       // this.preload();
    },
    preload: function(){

        var i;
        var img = null;
        for(i = 0; i < this.config.totalCount; i++){
            // new image created, overwrites previous image within the for loop
            img = new Image();
            // set the src attribute path to the image file names in the for loop
            img.src = this.config.baseURL+i+"."+this.config.ext;
            // if last array index, set onload complete handler
            if(i == (this.config.totalCount - 1)){
                img.onload = this.imagesLoaded = true;
                   //     console.log("preloaded");
            }
            // store the image object to the images array
            this.config.loadedImages.push(img);
        }
    },
    setConfig: function(options) {
        this.config = options

       // console.log(this.config);
        this.config.ctx = this.config.canvas.getContext("2d"); 
    },
    begin: function() {
     //   console.log("begin", this);
        this.state.begun = true;
        var _this = this;
        this.state.currentIndex = 0;
        this.state.interval = setInterval(function(){

            _this.update.call(_this,_this.increment);
        }, 1000/this.config.speed)
    },
    update: function(callback) {

        var _this = this;
        if(this.config.loadedImages[this.state.currentIndex]) {
           // console.log(_this.config.canvas.width);
            this.config.ctx.clearRect(0,0,_this.config.canvas.width, _this.config.canvas.height);
            this.config.ctx.drawImage(this.config.loadedImages[this.state.currentIndex],
                0, 0, _this.config.img.v2w, _this.config.img.v2h);// dimensions and positions needs to be changed 
            if(callback && typeof callback == "function") {
                 callback.call(_this)
            }
        } else {
            var im = new Image()
            im.addEventListener("load", function () {
                _this.config.loadedImages[_this.state.currentIndex] = im;
                _this.config.ctx.clearRect(0,0,_this.config.canvas.width, _this.config.canvas.height);
                _this.config.ctx.drawImage(im, 
                    0, 0, _this.config.img.v2w, _this.config.img.v2h);// dimensions and positions needs to be changed 
                if(callback && typeof callback == "function") {
                    callback.call(_this)
                }
            })
            im.src = this.config.baseURL+this.state.currentIndex+"."+this.config.ext
           // console.log(this.state.currentIndex);
        }
    },
    increment: function() {
        if(this.state.currentIndex<this.config.totalCount-1) {
            this.state.currentIndex++;
        } else if(this.config.loop) {
            this.state.currentIndex = 0;
        } else {
            this.state.currentIndex = 0;
            clearInterval(this.state.interval);
        }
    },
    pause: function() {
        clearInterval(this.state.interval)
    },
    resume: function() {
        if(!this.state.begun) {
            this.begin()
        } else {
            var _this = this
            this.state.interval = setInterval(function(){
                _this.update(_this.increment)
            }, 1000/this.config.speed)
        }
    },
    next: function() {
        this.state.currentIndex++
        update()
    },
    previous: function() {
        this.state.currentIndex--
        update()
    },
    goTo: function(num) {
        this.state.currentIndex = num;
        this.update()
    },
    trash: function() {
        clearInterval(this.state.interval);
    }
})
},{}],27:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<script>(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){\n\t\t  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n\t\t  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n\t\t  })(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');\n\n\t\t  ga(\'create\', \'UA-60076663-1\', \'auto\');\n\t\t  ga(\'send\', \'pageview\');</script><div class="main"></div><div class="intro"></div><div class="header"></div><div class="footer"></div><div class="cover"></div><div class="detail"></div><div class="player"></div><div class="shares"></div><div class="mobile"></div><div class="mobile-intro"></div><div class="preloader"></div>';

}
return __p
};
},{"lodash":3}],28:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="detail-background"></div><div class="detail-inner"><img class="detail-icon" src="' +
((__t = (detail.imgDetail)) == null ? '' : __t) +
'"><div class="content"><h1 class="title">' +
((__t = (detail.creator)) == null ? '' : __t) +
'</h1><div class="info">' +
((__t = (detail.info)) == null ? '' : __t) +
'</div><div class="download-links"></div><div class="bts"></div><div class="hear-link btn-circle"><div class="hear-pulse"></div><div class="hear-border"></div><div class="hear-icon trk" data-category="desktop:detail:play" data-label="' +
((__t = (detail.creator)) == null ? '' : __t) +
'"></div><div class="play"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewbox="0 0 17.6 20" xml:space="preserve"><defs></defs><polygon fill="#89888A" points="0,0 17.6,10 0,20 "></polygon></svg></div><div class="pause"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewbox="0 0 20 19.8" xml:space="preserve"><defs></defs><rect y="0" fill="#89888A" width="7" height="19.8"></rect><rect x="13" y="0" fill="#89888A" width="7" height="19.8"></rect></svg></div><div class="hear-text">Hear More From<br>' +
((__t = (detail.creator)) == null ? '' : __t) +
'</div><canvas id="circle-progress" width="100" height="100"></canvas></div><audio class="info-audio"><source src="' +
((__t = (detail.audioDetail)) == null ? '' : __t) +
'" type="audio/mpeg"></source></audio></div><div class="close">X</div></div>';

}
return __p
};
},{"lodash":3}],29:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="footer-inner"></div>';

}
return __p
};
},{"lodash":3}],30:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<img class="film-icon" src="' +
((__t = (galleryItem.img)) == null ? '' : __t) +
'"><div class="g-item-inner"><h1 class="headline">' +
((__t = (galleryItem.title)) == null ? '' : __t) +
'</h1><p class="description">' +
((__t = (galleryItem.info)) == null ? '' : __t) +
'</p></div>';

}
return __p
};
},{"lodash":3}],31:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="g-item-inner"><div class="signature"><canvas class="sig"></canvas><div class="underline"></div></div><div class="title">' +
((__t = (galleryItem.title)) == null ? '' : __t) +
'</div><div class="btn-wrapper"><div class="view-video btn-circle trk" data-category="desktop:view360" data-label="' +
((__t = (galleryItem.label)) == null ? '' : __t) +
'"><div class="view-pulse"></div><div class="view-left"><div class="view-border"></div></div><div class="view-right"><div class="view-border"></div></div><div class="view-text">View<br>&nbsp;360&deg;</div></div><div class="view-link btn-circle trk" data-category="desktop:learn-more" data-label="' +
((__t = (galleryItem.label)) == null ? '' : __t) +
'"><div class="view-pulse"></div><div class="view-left"><div class="view-border"></div></div><div class="view-right"><div class="view-border"></div></div><div class="view-text">Learn<br>More</div></div></div></div><img class="film-icon" src="' +
((__t = (galleryItem.img)) == null ? '' : __t) +
'">';

}
return __p
};
},{"lodash":3}],32:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="gallery-items"><div class="gallery-line"></div></div>';

}
return __p
};
},{"lodash":3}],33:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="bottom-nav"><div class="bar-extra"></div><div class="bottom-nav-wrapper"><div class="nav-container"><div class="nav0 nav-item trk" data-id="0" data-category="desktop:nav" data-label="home"><div class="bar-bottom"></div><div class="bar-left"></div><div class="num"></div><div class="name"><div class="first"></div><div class="last"></div></div><div class="numbig"></div><div class="icon"><svg class="cb" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewbox="0 0 45.9 25.5" enable-background="new 0 0 45.9 25.5" xml:space="preserve" preserveaspectratio="xMidYMid meet"><path d="M43.6,2.2h-0.8V1.4c0-0.8-0.6-1.4-1.4-1.4H6.6C5.9,0,5.2,0.6,5.2,1.4v0.9H4.5c-1.3,0-2.3,1-2.3,2.3v2.7H1.4\n\tC0.6,7.3,0,7.9,0,8.7v3.9c0,0.8,0.6,1.4,1.4,1.4l0.8,0v9.3c0,1.3,1,2.3,2.3,2.3h14.4c1,0,1.8-0.6,2.2-1.5l0.9-2.3c0.8-2,3.6-2,4.3,0\n\tl0.9,2.3c0.3,0.9,1.2,1.5,2.2,1.5h14.4c1.3,0,2.3-1,2.3-2.3V4.6C45.9,3.3,44.9,2.2,43.6,2.2z M13.7,19c-2.8,0-5.1-2.3-5.1-5.1\n\ts2.3-5.1,5.1-5.1s5.1,2.3,5.1,5.1S16.5,19,13.7,19z M34.4,19c-2.8,0-5.1-2.3-5.1-5.1s2.3-5.1,5.1-5.1c2.8,0,5.1,2.3,5.1,5.1\n\tS37.3,19,34.4,19z"></path></svg></div><div class="iconbig"><svg class="cb" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewbox="0 0 45.9 25.5" enable-background="new 0 0 45.9 25.5" xml:space="preserve" preserveaspectratio="xMidYMid meet"><path d="M43.6,2.2h-0.8V1.4c0-0.8-0.6-1.4-1.4-1.4H6.6C5.9,0,5.2,0.6,5.2,1.4v0.9H4.5c-1.3,0-2.3,1-2.3,2.3v2.7H1.4\n\tC0.6,7.3,0,7.9,0,8.7v3.9c0,0.8,0.6,1.4,1.4,1.4l0.8,0v9.3c0,1.3,1,2.3,2.3,2.3h14.4c1,0,1.8-0.6,2.2-1.5l0.9-2.3c0.8-2,3.6-2,4.3,0\n\tl0.9,2.3c0.3,0.9,1.2,1.5,2.2,1.5h14.4c1.3,0,2.3-1,2.3-2.3V4.6C45.9,3.3,44.9,2.2,43.6,2.2z M13.7,19c-2.8,0-5.1-2.3-5.1-5.1\n\ts2.3-5.1,5.1-5.1s5.1,2.3,5.1,5.1S16.5,19,13.7,19z M34.4,19c-2.8,0-5.1-2.3-5.1-5.1s2.3-5.1,5.1-5.1c2.8,0,5.1,2.3,5.1,5.1\n\tS37.3,19,34.4,19z"></path></svg></div></div><div class="nav1 nav-item trk" data-category="desktop:nav" data-label="joanna-delane" data-id="1"><div class="bar-bottom"></div><div class="bar-left"></div><div class="num"><div class="number1">0</div><div class="number2">1</div></div><div class="numbig"><div class="number1">0</div><div class="number2">1</div></div><div class="name"><div class="first">Joanna</div><div class="last">DeLane</div></div></div><div class="nav2 nav-item trk" data-category="desktop:nav" data-label="king-tuff" data-id="2"><div class="bar-bottom"></div><div class="bar-left"></div><div class="num"><div class="number1">0</div><div class="number2">2</div></div><div class="numbig"><div class="number1">0</div><div class="number2">2</div></div><div class="name"><div class="first">King</div><div class="last">Tuff</div></div></div><div class="nav3 nav-item trk" data-category="desktop:nav" data-label="thomas-midlane" data-id="3"><div class="bar-bottom"></div><div class="bar-left"></div><div class="num"><div class="number1">0</div><div class="number2">3</div></div><div class="numbig"><div class="number1">0</div><div class="number2">3</div></div><div class="name"><div class="first">Thomas</div><div class="last">Midlane</div></div></div><div class="nav4 nav-item trk" data-category="desktop:nav" data-label="ron-english" data-id="4"><div class="bar-bottom"></div><div class="bar-left"></div><div class="bar-left" style="left: auto; right: 0"></div><div class="num"><div class="number1">0</div><div class="number2">4</div></div><div class="numbig"><div class="number1">0</div><div class="number2">4</div></div><div class="name"><div class="first">Ron</div><div class="last">English</div></div></div></div><div class="download-links"><a href="https://play.google.com/store/apps/details?id=com.converse.intheirchucks" class="google-play anim-dl trk" target="_blank" data-category="desktop:nav:downloads" data-label="android-app">Google Play</a> <a href="https://itunes.apple.com/us/app/in-their-chucks-360-experience/id968846917?mt=8" class="app-store anim-dl trk" target="_blank" data-category="desktop:nav:downloads" data-label="ios-app">App Store</a><p>Get the 360&deg; App Experience</p></div></div></div><div class="bottom-nav-cover"></div>';

}
return __p
};
},{"lodash":3}],34:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="gallery-inner"></div><div class="resize-your-browser"><div class="resize-text"><p>Please expand your window to get the full experience or just download the app.</p><a href="https://play.google.com/store/apps/details?id=com.converse.intheirchucks" class="google-play">Google Play</a> <a href="https://itunes.apple.com/us/app/in-their-chucks-360-experience/id968846917?mt=8" class="app-store">App Store</a></div></div>';

}
return __p
};
},{"lodash":3}],35:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="header-inner"><div class="main-header"></div><div class="sub-header"></div></div>';

}
return __p
};
},{"lodash":3}],36:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="intro-inner"><div id="intro-panel"><h1>In Their Chucks</h1><h2><span>A 360&deg; Experience</span></h2><div class="intro-shoes"><img class="intro-shoe" src="images/Joanna.png"> <img class="intro-shoe" src="images/King.png"> <img class="intro-shoe" src="images/Thomas.png"> <img class="intro-shoe" src="images/Ron.png"></div><h3 class="typewriter">Experience every scuff, stain<br>and rip through their eyes.</h3></div><div id="loader-panel"><div class="loader-logo"><img class="logo" src="images/Converse_Logo_04.png"><div class="greeting">Made by you</div></div><div class="loader-sprite"><div class="loader-percentage"></div></div></div></div>';

}
return __p
};
},{"lodash":3}],37:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="mobile-gallery"><div data-category="mobile:gallery" data-label="joanna-delane" class="trk slider-container"><div class="slider-img joanna"></div><ul class="caption currentText"><li>Step into a world of zombies</li><li>with actress Joanna DeLane</li></ul></div><div data-category="mobile:gallery" data-label="king-tuff" class="trk slider-container"><div class="slider-img king"></div><ul class="caption nextText"><li>Step into the psychedelic mind</li><li>of musician King Tuff</li></ul></div><div data-category="mobile:gallery" data-label="thomas-midlane" class="trk slider-container"><div class="slider-img thomas"></div><ul class="caption"><li>Step into places unknown with</li><li>urban explorer Thomas Midlane</li></ul></div><div data-category="mobile:gallery" data-label="ron-english" class="trk slider-container"><div class="slider-img ron"></div><ul class="caption"><li>Step onto an LA skyscaper</li><li>with artist Ron English</li></ul></div></div><img class="cardboard-goggles" src="./images/cardboard-mobile.png"><p class="btn-caption">Get the 360&deg app experience:</p><div class="download-links"><svg data-category="mobile:button:android-app" class="android-app trk" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="137.6px" height="45.9px" viewbox="0 0 137.6 45.9" enable-background="new 0 0 137.6 45.9" xml:space="preserve"><defs></defs><g><path stroke="#FFFFFF" stroke-width="1.5" stroke-miterlimit="10" d="M125.2,36.1c0,3.5-2.6,5.7-6.1,5.7H16.3\n\t\t\tc-3.5,0-6.3-2.8-6.3-6.3V8.7c0-3.5,2.8-6.3,6.3-6.3h102.8c3.5,0,6.1,2.8,6.1,6.3V36.1z"></path><path d="M137.6,42.7c0,1.8-1.4,3.2-3.2,3.2H3.2c-1.8,0-3.2-1.4-3.2-3.2V3.2C0,1.4,1.4,0,3.2,0h131.2c1.8,0,3.2,1.4,3.2,3.2V42.7z"></path><g><g><path fill="#FFFFFF" d="M88.7,30.7l-0.9,0.8c-0.2,0.1-0.4,0.2-0.6,0.3c-0.6,0.3-1.2,0.3-1.8,0.3c-0.6,0-1.5,0-2.4-0.7\n\t\t\t\t\tc-1.3-0.9-1.8-2.5-1.8-3.8c0-2.8,2.3-4.2,4.1-4.2c0.7,0,1.3,0.2,1.9,0.5c0.9,0.6,1.1,1.4,1.3,1.8l-4.3,1.7l-1.4,0.1\n\t\t\t\t\tc0.5,2.3,2,3.6,3.7,3.6C87.5,31.2,88.1,31,88.7,30.7C88.7,30.7,88.8,30.6,88.7,30.7z M86.1,26.1c0.3-0.1,0.5-0.2,0.5-0.5\n\t\t\t\t\tc0-0.7-0.8-1.6-1.8-1.6c-0.7,0-2.1,0.6-2.1,2.5c0,0.3,0,0.6,0.1,1L86.1,26.1z"></path><path fill="#FFFFFF" d="M79.8,30.5c0,0.7,0.1,0.8,0.7,0.9c0.3,0,0.6,0.1,0.9,0.1l-0.7,0.4h-3.2c0.4-0.5,0.5-0.6,0.5-1v-0.4\n\t\t\t\t\tl0-10.8h-1.4l1.4-0.7h2.6c-0.6,0.3-0.7,0.5-0.8,1.2L79.8,30.5z"></path><path fill="#FFFFFF" d="M74.9,24.4c0.4,0.3,1.3,1.1,1.3,2.4c0,1.3-0.8,2-1.5,2.6c-0.2,0.2-0.5,0.5-0.5,0.9c0,0.4,0.3,0.6,0.5,0.8\n\t\t\t\t\tl0.7,0.5c0.8,0.7,1.5,1.3,1.5,2.5c0,1.7-1.6,3.4-4.8,3.4c-2.6,0-3.9-1.2-3.9-2.6c0-0.7,0.3-1.6,1.4-2.2c1.1-0.7,2.6-0.8,3.5-0.8\n\t\t\t\t\tc-0.3-0.3-0.5-0.7-0.5-1.2c0-0.3,0.1-0.5,0.2-0.7c-0.2,0-0.4,0-0.6,0c-1.9,0-3-1.4-3-2.8c0-0.8,0.4-1.8,1.2-2.4\n\t\t\t\t\tc1-0.8,2.3-1,3.2-1h3.7L76,24.4H74.9z M73.6,32.4c-0.1,0-0.2,0-0.4,0c-0.2,0-1.1,0-1.9,0.3c-0.4,0.1-1.6,0.6-1.6,1.9\n\t\t\t\t\tc0,1.3,1.2,2.2,3.2,2.2c1.7,0,2.7-0.8,2.7-2C75.6,33.9,75,33.4,73.6,32.4z M74.1,29c0.4-0.4,0.5-1,0.5-1.3c0-1.3-0.8-3.3-2.3-3.3\n\t\t\t\t\tc-0.5,0-1,0.2-1.3,0.6c-0.3,0.4-0.4,0.9-0.4,1.3c0,1.2,0.7,3.2,2.3,3.2C73.3,29.5,73.8,29.2,74.1,29z"></path><path fill="#FFFFFF" d="M63.7,32.1c-2.9,0-4.4-2.2-4.4-4.3c0-2.4,1.9-4.4,4.7-4.4c2.7,0,4.3,2.1,4.3,4.3\n\t\t\t\t\tC68.3,29.9,66.6,32.1,63.7,32.1z M65.9,30.7c0.4-0.6,0.5-1.3,0.5-2c0-1.6-0.8-4.6-3-4.6c-0.6,0-1.2,0.2-1.6,0.6\n\t\t\t\t\tc-0.7,0.6-0.8,1.4-0.8,2.2c0,1.8,0.9,4.7,3.1,4.7C64.8,31.6,65.5,31.3,65.9,30.7z"></path><path fill="#FFFFFF" d="M54,32.1c-2.9,0-4.4-2.2-4.4-4.3c0-2.4,1.9-4.4,4.7-4.4c2.7,0,4.3,2.1,4.3,4.3C58.6,29.9,57,32.1,54,32.1\n\t\t\t\t\tz M56.3,30.7c0.4-0.6,0.5-1.3,0.5-2c0-1.6-0.8-4.6-3-4.6c-0.6,0-1.2,0.2-1.6,0.6c-0.7,0.6-0.8,1.4-0.8,2.2c0,1.8,0.9,4.7,3.1,4.7\n\t\t\t\t\tC55.2,31.6,55.9,31.3,56.3,30.7z"></path><path fill="#FFFFFF" d="M48.5,31.5l-2.4,0.6c-1,0.2-1.9,0.3-2.8,0.3c-4.7,0-6.5-3.4-6.5-6.1c0-3.3,2.5-6.3,6.8-6.3\n\t\t\t\t\tc0.9,0,1.8,0.1,2.6,0.4c1.3,0.4,1.9,0.8,2.2,1.1l-1.4,1.3l-0.6,0.1l0.4-0.7c-0.6-0.6-1.6-1.6-3.6-1.6c-2.7,0-4.7,2-4.7,5\n\t\t\t\t\tc0,3.2,2.3,6.2,6,6.2c1.1,0,1.6-0.2,2.2-0.4v-2.7l-2.6,0.1l1.4-0.7h3.6l-0.4,0.4c-0.1,0.1-0.1,0.1-0.2,0.3c0,0.2,0,0.6,0,0.8\n\t\t\t\t\tV31.5z"></path></g><g><path fill="#FFFFFF" d="M93.9,30.8v4.6H93V23.7h0.9V25c0.6-0.9,1.7-1.5,2.9-1.5c2.3,0,3.8,1.7,3.8,4.4c0,2.7-1.5,4.5-3.8,4.5\n\t\t\t\t\tC95.7,32.3,94.6,31.7,93.9,30.8z M99.7,27.9c0-2.1-1.1-3.6-3-3.6c-1.2,0-2.3,0.9-2.8,1.7v3.8c0.5,0.8,1.6,1.8,2.8,1.8\n\t\t\t\t\tC98.6,31.5,99.7,29.9,99.7,27.9z"></path><path fill="#FFFFFF" d="M101.9,32.1V20.4h0.9v11.7H101.9z"></path><path fill="#FFFFFF" d="M113.1,34.6c0.2,0.1,0.5,0.1,0.7,0.1c0.6,0,0.9-0.2,1.3-1l0.7-1.5l-3.6-8.6h1l3.1,7.4l3.1-7.4h1L116,34\n\t\t\t\t\tc-0.5,1.1-1.2,1.6-2.2,1.6c-0.3,0-0.7-0.1-0.9-0.1L113.1,34.6z"></path><path fill="#FFFFFF" d="M110.4,32.1c-0.1-0.3-0.1-0.6-0.1-0.8c0-0.2,0-0.4,0-0.7c-0.3,0.5-0.8,0.8-1.3,1.1\n\t\t\t\t\tc-0.6,0.3-1.1,0.5-1.8,0.5c-0.9,0-1.6-0.2-2.1-0.7c-0.5-0.4-0.7-1-0.7-1.8c0-0.8,0.4-1.4,1.1-1.9c0.7-0.5,1.6-0.7,2.8-0.7h2.1\n\t\t\t\t\tv-1.1c0-0.6-0.2-1.1-0.6-1.4c-0.4-0.3-1-0.5-1.8-0.5c-0.7,0-1.2,0.2-1.7,0.5c-0.4,0.3-0.6,0.7-0.6,1.2h-0.9l0,0\n\t\t\t\t\tc0-0.6,0.3-1.2,0.9-1.7c0.6-0.5,1.4-0.7,2.4-0.7c1,0,1.8,0.2,2.4,0.7c0.6,0.5,0.9,1.2,0.9,2.1v4.2c0,0.3,0,0.6,0.1,0.9\n\t\t\t\t\tc0,0.3,0.1,0.6,0.2,0.8H110.4z M107.2,31.4c0.8,0,1.3-0.2,1.9-0.5c0.6-0.3,1-0.8,1.2-1.3V28h-2.1c-0.8,0-1.5,0.2-2,0.5\n\t\t\t\t\tc-0.5,0.4-0.8,0.8-0.8,1.3c0,0.5,0.2,0.9,0.5,1.2C106.1,31.3,106.6,31.4,107.2,31.4z"></path></g></g><g><polygon fill="#F1F2F2" points="20.8,25.4 23.7,22.4 23.7,22.4 20.8,25.4 11.4,16 11.4,16 20.8,25.4 11.4,34.8 11.4,34.8 \n\t\t\t\t20.8,25.4 23.7,28.3 23.7,28.3 \t\t"></polygon><path fill="#F1F2F2" d="M23.7,22.4l-11.4-6.3C12,16,11.7,15.9,11.4,16l9.4,9.4L23.7,22.4z"></path><path fill="#F1F2F2" d="M23.7,28.3l3.9-2.1c0.8-0.4,0.8-1.1,0-1.6l-3.9-2.2l-2.9,2.9L23.7,28.3z"></path><path fill="#F1F2F2" d="M11.4,16c-0.3,0.1-0.6,0.5-0.6,1l0,16.8c0,0.5,0.2,0.9,0.6,1l9.4-9.4L11.4,16z"></path><path fill="#F1F2F2" d="M11.4,34.8c0.2,0.1,0.5,0,0.9-0.1l11.4-6.3l-2.9-2.9L11.4,34.8z"></path></g><g><g><path fill="#FFFFFF" d="M41.9,13.7l-0.4-1.1h-2.6l-0.4,1.1h-1.1l2.2-5.7h1.3l2.2,5.7H41.9z M40.2,8.9l-1,2.7h2.1L40.2,8.9z"></path><path fill="#FFFFFF" d="M47.8,13.7l-3-4.1v4.1h-1V7.9h1l2.9,4v-4h1v5.7H47.8z"></path><path fill="#FFFFFF" d="M50.2,13.7V7.9h2.1c1.8,0,3,1.2,3,2.9c0,1.7-1.2,2.9-3,2.9H50.2z M54.3,10.8c0-1.1-0.7-2-2-2h-1.1v4h1.1\n\t\t\t\t\tC53.6,12.8,54.3,11.9,54.3,10.8z"></path><path fill="#FFFFFF" d="M59.8,13.7l-1.3-2.1h-1v2.1h-1V7.9h2.5c1.1,0,1.9,0.7,1.9,1.8c0,1-0.7,1.6-1.4,1.7l1.4,2.2H59.8z\n\t\t\t\t\t M59.9,9.7c0-0.5-0.4-0.9-1-0.9h-1.4v1.8h1.4C59.5,10.6,59.9,10.3,59.9,9.7z"></path><path fill="#FFFFFF" d="M61.9,10.8c0-1.7,1.2-3,2.9-3c1.7,0,2.9,1.3,2.9,3c0,1.7-1.2,3-2.9,3C63.1,13.8,61.9,12.5,61.9,10.8z\n\t\t\t\t\t M66.7,10.8c0-1.2-0.7-2.1-1.9-2.1c-1.2,0-1.9,0.9-1.9,2.1c0,1.2,0.7,2.1,1.9,2.1C66,12.9,66.7,12,66.7,10.8z"></path><path fill="#FFFFFF" d="M68.9,13.7V7.9h1v5.7H68.9z"></path><path fill="#FFFFFF" d="M71.4,13.7V7.9h2.1c1.8,0,3,1.2,3,2.9c0,1.7-1.2,2.9-3,2.9H71.4z M75.5,10.8c0-1.1-0.7-2-2-2h-1.1v4h1.1\n\t\t\t\t\tC74.7,12.8,75.5,11.9,75.5,10.8z"></path><path fill="#FFFFFF" d="M84.1,13.7l-0.4-1.1h-2.6l-0.4,1.1h-1.1l2.2-5.7H83l2.2,5.7H84.1z M82.4,8.9l-1,2.7h2.1L82.4,8.9z"></path><path fill="#FFFFFF" d="M86.1,13.7V7.9h2.5c1.2,0,1.9,0.8,1.9,1.8c0,1-0.7,1.8-1.9,1.8h-1.5v2.1H86.1z M89.4,9.7\n\t\t\t\t\tc0-0.5-0.4-0.9-1-0.9h-1.4v1.8h1.4C89,10.6,89.4,10.3,89.4,9.7z"></path><path fill="#FFFFFF" d="M91.5,13.7V7.9H94c1.2,0,1.9,0.8,1.9,1.8c0,1-0.7,1.8-1.9,1.8h-1.5v2.1H91.5z M94.9,9.7\n\t\t\t\t\tc0-0.5-0.4-0.9-1-0.9h-1.4v1.8h1.4C94.5,10.6,94.9,10.3,94.9,9.7z"></path><path fill="#FFFFFF" d="M99.1,10.8c0-1.7,1.2-3,2.9-3c1.7,0,2.9,1.3,2.9,3c0,1.7-1.2,3-2.9,3C100.3,13.8,99.1,12.5,99.1,10.8z\n\t\t\t\t\t M103.9,10.8c0-1.2-0.7-2.1-1.9-2.1c-1.2,0-1.9,0.9-1.9,2.1c0,1.2,0.7,2.1,1.9,2.1C103.2,12.9,103.9,12,103.9,10.8z"></path><path fill="#FFFFFF" d="M110.1,13.7l-3-4.1v4.1h-1V7.9h1l2.9,4v-4h1v5.7H110.1z"></path></g></g></g></svg> <svg data-category="mobile:button:ios-app" class="ios-app trk" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="137.6px" height="45.4px" viewbox="0 0 137.6 45.4" enable-background="new 0 0 137.6 45.4" xml:space="preserve"><defs></defs><g><path d="M137.6,42.2c0,1.8-1.4,3.2-3.2,3.2H3.2C1.4,45.4,0,44,0,42.2v-39C0,1.4,1.4,0,3.2,0h131.2c1.8,0,3.2,1.4,3.2,3.2V42.2z"></path><g><path fill="#FFFFFF" d="M26.8,22.8c0-3.6,2.9-5.3,3.1-5.4c-1.7-2.5-4.3-2.8-5.2-2.8c-2.2-0.2-4.3,1.3-5.4,1.3\n\t\t\tc-1.1,0-2.9-1.3-4.7-1.3c-2.4,0-4.6,1.4-5.8,3.6C6.2,22.5,8,28.9,10.5,32.5c1.2,1.7,2.6,3.7,4.5,3.6c1.8-0.1,2.5-1.2,4.7-1.2\n\t\t\tc2.2,0,2.8,1.2,4.7,1.1c1.9,0,3.2-1.7,4.3-3.5c1.4-2,2-3.9,2-4C30.6,28.5,26.9,27.1,26.8,22.8z"></path><path fill="#FFFFFF" d="M23.3,12.2c1-1.2,1.6-2.9,1.5-4.6c-1.4,0.1-3.2,1-4.2,2.2c-0.9,1.1-1.7,2.8-1.5,4.4\n\t\t\tC20.6,14.3,22.2,13.4,23.3,12.2z"></path></g><g><defs><path id="SVGID_1_" d="M137.6,41.8c0,1.8-1.4,3.2-3.2,3.2H3.2C1.4,45,0,43.6,0,41.8V3.6c0-1.8,1.4-3.2,3.2-3.2h131.2\n\t\t\t\tc1.8,0,3.2,1.4,3.2,3.2V41.8z"></path></defs><clippath id="SVGID_2_"><use xlink:href="#SVGID_1_" overflow="visible"></clippath></g><g><g><path fill="#FFFFFF" d="M52.2,35h-2.5l-1.4-4.4h-4.8L42.1,35h-2.5l4.8-14.8h3L52.2,35z M47.9,28.8l-1.3-3.9\n\t\t\t\tc-0.1-0.4-0.4-1.3-0.7-2.8h0c-0.1,0.6-0.4,1.6-0.7,2.8l-1.2,3.9H47.9z"></path><path fill="#FFFFFF" d="M64.5,29.5c0,1.8-0.5,3.3-1.5,4.3c-0.9,0.9-2,1.4-3.3,1.4c-1.4,0-2.4-0.5-3.1-1.5v5.6h-2.4V27.8\n\t\t\t\tc0-1.1,0-2.3-0.1-3.5h2.1l0.1,1.7h0c0.8-1.3,2-1.9,3.6-1.9c1.3,0,2.3,0.5,3.2,1.5C64.1,26.5,64.5,27.9,64.5,29.5z M62.1,29.6\n\t\t\t\tc0-1-0.2-1.9-0.7-2.6c-0.5-0.7-1.2-1.1-2.1-1.1c-0.6,0-1.1,0.2-1.6,0.6c-0.5,0.4-0.8,0.9-0.9,1.5c-0.1,0.3-0.1,0.5-0.1,0.7v1.8\n\t\t\t\tc0,0.8,0.2,1.4,0.7,2c0.5,0.5,1.1,0.8,1.9,0.8c0.9,0,1.6-0.3,2.1-1C61.8,31.6,62.1,30.7,62.1,29.6z"></path><path fill="#FFFFFF" d="M76.8,29.5c0,1.8-0.5,3.3-1.5,4.3c-0.9,0.9-2,1.4-3.3,1.4c-1.4,0-2.4-0.5-3.1-1.5v5.6h-2.4V27.8\n\t\t\t\tc0-1.1,0-2.3-0.1-3.5h2.1l0.1,1.7h0c0.8-1.3,2-1.9,3.6-1.9c1.3,0,2.3,0.5,3.2,1.5C76.4,26.5,76.8,27.9,76.8,29.5z M74.4,29.6\n\t\t\t\tc0-1-0.2-1.9-0.7-2.6c-0.5-0.7-1.2-1.1-2.1-1.1c-0.6,0-1.1,0.2-1.6,0.6c-0.5,0.4-0.8,0.9-0.9,1.5c-0.1,0.3-0.1,0.5-0.1,0.7v1.8\n\t\t\t\tc0,0.8,0.2,1.4,0.7,2c0.5,0.5,1.1,0.8,1.9,0.8c0.9,0,1.6-0.3,2.1-1C74.1,31.6,74.4,30.7,74.4,29.6z"></path><path fill="#FFFFFF" d="M90.5,30.8c0,1.3-0.4,2.3-1.3,3.1c-1,0.9-2.3,1.3-4,1.3c-1.6,0-2.9-0.3-3.8-0.9l0.5-2\n\t\t\t\tc1,0.6,2.2,0.9,3.4,0.9c0.9,0,1.6-0.2,2.1-0.6c0.5-0.4,0.8-0.9,0.8-1.6c0-0.6-0.2-1.1-0.6-1.5c-0.4-0.4-1.1-0.8-2-1.1\n\t\t\t\tc-2.6-1-3.9-2.4-3.9-4.3c0-1.2,0.5-2.2,1.4-3c0.9-0.8,2.1-1.2,3.6-1.2c1.4,0,2.5,0.2,3.4,0.7l-0.6,1.9c-0.8-0.5-1.8-0.7-2.9-0.7\n\t\t\t\tc-0.8,0-1.5,0.2-2,0.6c-0.4,0.4-0.6,0.8-0.6,1.3c0,0.6,0.2,1.1,0.7,1.5c0.4,0.4,1.1,0.7,2.2,1.1c1.3,0.5,2.2,1.1,2.8,1.8\n\t\t\t\tC90.2,28.9,90.5,29.8,90.5,30.8z"></path><path fill="#FFFFFF" d="M98.4,26h-2.6v5.2c0,1.3,0.5,2,1.4,2c0.4,0,0.8,0,1.1-0.1l0.1,1.8c-0.5,0.2-1.1,0.3-1.8,0.3\n\t\t\t\tc-0.9,0-1.7-0.3-2.2-0.9c-0.5-0.6-0.8-1.5-0.8-2.9V26h-1.6v-1.8h1.6v-2l2.3-0.7v2.7h2.6V26z"></path><path fill="#FFFFFF" d="M110.2,29.5c0,1.6-0.5,3-1.4,4.1c-1,1.1-2.3,1.6-3.9,1.6c-1.6,0-2.8-0.5-3.8-1.6c-0.9-1-1.4-2.4-1.4-3.9\n\t\t\t\tc0-1.7,0.5-3,1.4-4.1c1-1.1,2.3-1.6,3.9-1.6c1.6,0,2.8,0.5,3.8,1.6C109.8,26.6,110.2,27.9,110.2,29.5z M107.8,29.6\n\t\t\t\tc0-1-0.2-1.8-0.6-2.5c-0.5-0.8-1.2-1.3-2.1-1.3c-1,0-1.7,0.4-2.2,1.3c-0.4,0.7-0.6,1.6-0.6,2.6c0,1,0.2,1.8,0.6,2.5\n\t\t\t\tc0.5,0.8,1.2,1.3,2.2,1.3c0.9,0,1.6-0.4,2.1-1.3C107.5,31.4,107.8,30.6,107.8,29.6z"></path><path fill="#FFFFFF" d="M118,26.4c-0.2,0-0.5-0.1-0.7-0.1c-0.8,0-1.5,0.3-1.9,0.9c-0.4,0.6-0.6,1.3-0.6,2.1V35h-2.4v-7.3\n\t\t\t\tc0-1.2,0-2.4-0.1-3.4h2.1l0.1,2h0.1c0.3-0.7,0.6-1.3,1.2-1.7c0.5-0.4,1.1-0.6,1.7-0.6c0.2,0,0.4,0,0.6,0L118,26.4L118,26.4z"></path><path fill="#FFFFFF" d="M128.6,29.1c0,0.4,0,0.8-0.1,1.1h-7.1c0,1.1,0.4,1.9,1,2.4c0.6,0.5,1.4,0.7,2.3,0.7c1.1,0,2-0.2,2.9-0.5\n\t\t\t\tl0.4,1.6c-1,0.4-2.2,0.7-3.6,0.7c-1.7,0-3-0.5-3.9-1.5c-0.9-1-1.4-2.3-1.4-3.9c0-1.6,0.4-3,1.3-4c0.9-1.1,2.2-1.7,3.7-1.7\n\t\t\t\tc1.5,0,2.7,0.6,3.5,1.7C128.3,26.6,128.6,27.8,128.6,29.1z M126.3,28.5c0-0.7-0.1-1.3-0.5-1.8c-0.4-0.7-1-1-1.9-1\n\t\t\t\tc-0.8,0-1.4,0.3-1.9,1c-0.4,0.5-0.6,1.1-0.7,1.8L126.3,28.5L126.3,28.5z"></path></g><g><g><path fill="#FFFFFF" d="M42.8,14.9c-0.7,0-1.2,0-1.7-0.1V7.6c0.6-0.1,1.3-0.2,2-0.2c2.7,0,4,1.3,4,3.5\n\t\t\t\t\tC47.1,13.5,45.6,14.9,42.8,14.9z M43.2,8.4c-0.4,0-0.7,0-0.9,0.1v5.5c0.1,0,0.4,0,0.8,0c1.8,0,2.8-1,2.8-2.9\n\t\t\t\t\tC45.8,9.3,44.9,8.4,43.2,8.4z"></path><path fill="#FFFFFF" d="M51,14.9c-1.5,0-2.5-1.1-2.5-2.7c0-1.6,1-2.8,2.6-2.8c1.5,0,2.5,1.1,2.5,2.7\n\t\t\t\t\tC53.6,13.8,52.5,14.9,51,14.9z M51,10.3c-0.8,0-1.4,0.8-1.4,1.9c0,1.1,0.6,1.9,1.4,1.9c0.8,0,1.4-0.8,1.4-1.9\n\t\t\t\t\tC52.4,11.1,51.8,10.3,51,10.3z"></path><path fill="#FFFFFF" d="M62.4,9.6l-1.6,5.3h-1.1L59,12.5c-0.2-0.6-0.3-1.1-0.4-1.7h0c-0.1,0.6-0.2,1.1-0.4,1.7l-0.7,2.3h-1.1\n\t\t\t\t\tl-1.5-5.3h1.2l0.6,2.5c0.1,0.6,0.3,1.2,0.4,1.7h0c0.1-0.4,0.2-1,0.4-1.7l0.7-2.5h1l0.7,2.5c0.2,0.6,0.3,1.2,0.4,1.7h0\n\t\t\t\t\tc0.1-0.5,0.2-1.1,0.4-1.7l0.6-2.5L62.4,9.6L62.4,9.6z"></path><path fill="#FFFFFF" d="M68.4,14.8h-1.2v-3c0-0.9-0.4-1.4-1.1-1.4c-0.7,0-1.2,0.6-1.2,1.3v3.1h-1.2v-3.8c0-0.5,0-1,0-1.5h1\n\t\t\t\t\tl0.1,0.8h0c0.3-0.6,1-0.9,1.7-0.9c1.1,0,1.8,0.8,1.8,2.2L68.4,14.8L68.4,14.8z"></path><path fill="#FFFFFF" d="M71.6,14.8h-1.2V7.1h1.2V14.8z"></path><path fill="#FFFFFF" d="M75.9,14.9c-1.5,0-2.5-1.1-2.5-2.7c0-1.6,1-2.8,2.6-2.8c1.5,0,2.5,1.1,2.5,2.7\n\t\t\t\t\tC78.5,13.8,77.5,14.9,75.9,14.9z M75.9,10.3c-0.8,0-1.4,0.8-1.4,1.9c0,1.1,0.6,1.9,1.4,1.9c0.8,0,1.4-0.8,1.4-1.9\n\t\t\t\t\tC77.3,11.1,76.8,10.3,75.9,10.3z"></path><path fill="#FFFFFF" d="M83.1,14.8L83,14.2h0c-0.4,0.5-0.9,0.7-1.5,0.7c-0.9,0-1.6-0.7-1.6-1.5c0-1.3,1.1-2,3.1-2v-0.1\n\t\t\t\t\tc0-0.7-0.4-1-1.1-1c-0.5,0-1,0.1-1.4,0.4l-0.2-0.8c0.5-0.3,1.1-0.5,1.8-0.5c1.4,0,2.1,0.7,2.1,2.2v1.9c0,0.5,0,0.9,0.1,1.3\n\t\t\t\t\tL83.1,14.8L83.1,14.8z M83,12.2c-1.3,0-1.9,0.3-1.9,1.1c0,0.6,0.3,0.8,0.8,0.8c0.6,0,1.1-0.5,1.1-1.1V12.2z"></path><path fill="#FFFFFF" d="M89.8,14.8L89.7,14h0c-0.3,0.6-0.9,1-1.7,1c-1.3,0-2.2-1.1-2.2-2.7c0-1.6,1-2.8,2.3-2.8\n\t\t\t\t\tc0.7,0,1.2,0.2,1.5,0.7h0v-3h1.2v6.3c0,0.5,0,1,0,1.4H89.8z M89.6,11.7c0-0.7-0.5-1.4-1.2-1.4c-0.9,0-1.4,0.8-1.4,1.8\n\t\t\t\t\tc0,1.1,0.5,1.8,1.4,1.8c0.7,0,1.3-0.6,1.3-1.4V11.7z"></path><path fill="#FFFFFF" d="M98.2,14.9c-1.5,0-2.5-1.1-2.5-2.7c0-1.6,1-2.8,2.6-2.8c1.5,0,2.5,1.1,2.5,2.7\n\t\t\t\t\tC100.8,13.8,99.8,14.9,98.2,14.9z M98.2,10.3c-0.8,0-1.4,0.8-1.4,1.9c0,1.1,0.6,1.9,1.4,1.9c0.8,0,1.4-0.8,1.4-1.9\n\t\t\t\t\tC99.6,11.1,99.1,10.3,98.2,10.3z"></path><path fill="#FFFFFF" d="M107.1,14.8h-1.2v-3c0-0.9-0.4-1.4-1.1-1.4c-0.7,0-1.2,0.6-1.2,1.3v3.1h-1.2v-3.8c0-0.5,0-1,0-1.5h1\n\t\t\t\t\tl0.1,0.8h0c0.3-0.6,1-0.9,1.7-0.9c1.1,0,1.8,0.8,1.8,2.2V14.8z"></path><path fill="#FFFFFF" d="M115,10.4h-1.3V13c0,0.7,0.2,1,0.7,1c0.2,0,0.4,0,0.5-0.1l0,0.9c-0.2,0.1-0.5,0.1-0.9,0.1\n\t\t\t\t\tc-0.9,0-1.5-0.5-1.5-1.8v-2.7h-0.8V9.6h0.8v-1l1.1-0.3v1.3h1.3V10.4z"></path><path fill="#FFFFFF" d="M121.1,14.8H120v-3c0-0.9-0.4-1.4-1.1-1.4c-0.6,0-1.2,0.4-1.2,1.2v3.2h-1.2V7.1h1.2v3.2h0\n\t\t\t\t\tc0.4-0.6,0.9-0.9,1.6-0.9c1.1,0,1.8,0.9,1.8,2.2V14.8z"></path><path fill="#FFFFFF" d="M127.5,12.5H124c0,1,0.7,1.6,1.7,1.6c0.5,0,1-0.1,1.4-0.2l0.2,0.8c-0.5,0.2-1.1,0.3-1.8,0.3\n\t\t\t\t\tc-1.6,0-2.6-1-2.6-2.7c0-1.6,1-2.8,2.5-2.8c1.3,0,2.2,1,2.2,2.5C127.5,12.1,127.5,12.3,127.5,12.5z M126.4,11.6\n\t\t\t\t\tc0-0.8-0.4-1.4-1.2-1.4c-0.7,0-1.2,0.6-1.3,1.4H126.4z"></path></g></g></g></g></svg></div><h1>In Their Chucks</h1><h1>A 360&deg; Experience</h1><div class="vert-divider"></div><ul class="info"><li>Download the app and</li><li>experience every scuff, stain</li><li>and rip through their eyes.</li></ul><ul class="info"><li>Move around every corner of</li><li>the experience by shifting your</li><li>handheld device in different</li><li>directions. Use cardboard</li><li>goggles for the fully immersive</li><li>experience.</li></ul><div class="shoes"><div class="joanna"><img data-category="mobile:shoe" data-label="joanna-delane" class="joanna-shoe shoe trk" src="./images/Joanna.png"><div class="signature"><div class="underLine"></div><img src="./images/Signatures/v2/Joanna/Joanna_90.png" class="sig"></div><p class="made-by">Made by Joanna DeLane</p></div><div class="king"><img data-category="mobile:shoe" data-label="king-tuff" class="king-shoe shoe trk" src="./images/King.png"><div class="signature"><div class="underLine"></div><img src="./images/Signatures/v2/Kingtuff/Kingtuff_99.png" class="sig"></div><p class="made-by">Made by King Tuff</p></div><div class="thomas"><img data-category="mobile:shoe" data-label="thomas-midlane" class="thomas-shoe shoe trk" src="./images/Thomas.png"><div class="signature"><div class="underLine"></div><img src="./images/Signatures/v2/Thomas/Thomas_59.png" class="sig"></div><p class="made-by">Made by Thomas Midlane</p></div><div class="ron"><img data-category="mobile:shoe" data-label="ron-english" class="ron-shoe shoe trk" src="./images/Ron.png"><div class="signature"><div class="underLine"></div><img src="./images/Signatures/v2/English/English_82.png" class="sig"></div><p class="made-by">Made by Ron English</p></div></div>';

}
return __p
};
},{"lodash":3}],38:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="intro-panel"></div><div class="loader-panel"><img class="logo" src="./images/loader.png"><div class="loader-sprite"><div class="preloader-percentage"></div></div><div class="loader"></div></div>';

}
return __p
};
},{"lodash":3}],39:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="player-background"></div><div class="player-inner"><div id="playerContainer" class="full"></div><div>Video' +
((__t = (idx +1)) == null ? '' : __t) +
'</div><div class="close">X</div><div class="shares"></div><div class="instructions"><div class="instruction instruction1"><h1>Put on your headphones</h1><div class="headphones"><svg version="1.1" id="headphones" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewbox="0 0 514 360.2" enable-background="new 0 0 514 360.2" xml:space="preserve"><g><path fill="none" stroke="#A7A9AC" stroke-width="4" stroke-miterlimit="10" d="M47.9,211c0-115.4,93.6-209,209-209\n                        s209,93.6,209,209"></path><path fill="none" stroke="#A7A9AC" stroke-width="4" stroke-miterlimit="10" d="M109.9,358.2H78.5c-0.8,0-1.4-0.6-1.4-1.4V199.7\n                        c0-0.8,0.6-1.4,1.4-1.4h31.4c0.8,0,1.4,0.6,1.4,1.4v157.1C111.3,357.6,110.7,358.2,109.9,358.2z"></path><path fill="none" stroke="#A7A9AC" stroke-width="4" stroke-miterlimit="10" d="M53.6,341.6c0,4.5-4.1,7.9-8.5,7\n                        C20.7,343,2,313.6,2,278.3s18.7-64.7,43.1-70.3c4.3-1,8.5,2.5,8.5,7V341.6z"></path><path fill="none" stroke="#A7A9AC" stroke-width="4" stroke-miterlimit="10" d="M404.1,358.2h31.4c0.8,0,1.4-0.6,1.4-1.4V199.7\n                        c0-0.8-0.6-1.4-1.4-1.4h-31.4c-0.8,0-1.4,0.6-1.4,1.4v157.1C402.7,357.6,403.4,358.2,404.1,358.2z"></path><path fill="none" stroke="#A7A9AC" stroke-width="4" stroke-miterlimit="10" d="M460.4,341.6c0,4.5,4.1,7.9,8.5,7\n                        c24.5-5.6,43.1-34.9,43.1-70.3s-18.7-64.7-43.1-70.3c-4.3-1-8.5,2.5-8.5,7V341.6z"></path></g></svg></div></div><div class="instruction instruction2"><h1>Click and drag to explore</h1><div class="mouse-drag"><div class="pointer"><svg version="1.1" id="pointer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewbox="0 0 15 30" enable-background="new 0 0 15 30" xml:space="preserve"><polygon fill="none" stroke="#FFFFFF" points="0.8,3.5 1.5,22.6 6,19.1 9.6,26.5 13.2,24.9 9.6,17.4 14.2,16.1 " style="stroke-width:.75"></polygon></svg></div><div class="arrow-left"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewbox="0 0 51 16.4" enable-background="new 0 0 51 16.4" xml:space="preserve"><g><line fill="none" stroke="#A7A9AC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" x1="2.2" y1="8.2" x2="50" y2="8.2"></line><polygon fill="#A7A9AC" points="8.8,16.4 10.2,14.9 2.9,8.2 10.2,1.5 8.8,0 0,8.2"></polygon></g></svg></div><div class="arrow-right"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewbox="0 0 51 16.4" enable-background="new 0 0 51 16.4" xml:space="preserve"><g><line fill="none" stroke="#A7A9AC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" x1="47.8" y1="8.2" x2="0" y2="8.2"></line><polygon fill="#A7A9AC" points="41.2,0 39.8,1.5 47.1,8.2 39.8,14.9 41.2,16.4 50,8.2"></polygon></g></svg></div></div></div><h2 class="status">Experience begins<br>in <span>5</span> seconds</h2><div class="skip">- Skip -</div></div><div class="end-screen"><div class="options"><div class="home trk" data-category="desktop:player" data-label="home"><div class="labels">Home</div></div><div class="replay trk" data-category="desktop:player" data-label="replay"><div class="labels">Replay</div></div></div></div><div class="download-btns"><svg class="android-app trk" data-category="desktop:player:appbtns" data-label="android-app" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="137.6px" height="45.9px" viewbox="0 0 137.6 45.9" enable-background="new 0 0 137.6 45.9" xml:space="preserve"><defs></defs><g><path stroke="#FFFFFF" stroke-width="1.5" stroke-miterlimit="10" d="M125.2,36.1c0,3.5-2.6,5.7-6.1,5.7H16.3\n                c-3.5,0-6.3-2.8-6.3-6.3V8.7c0-3.5,2.8-6.3,6.3-6.3h102.8c3.5,0,6.1,2.8,6.1,6.3V36.1z"></path><path d="M137.6,42.7c0,1.8-1.4,3.2-3.2,3.2H3.2c-1.8,0-3.2-1.4-3.2-3.2V3.2C0,1.4,1.4,0,3.2,0h131.2c1.8,0,3.2,1.4,3.2,3.2V42.7z"></path><g><g><path fill="#FFFFFF" d="M88.7,30.7l-0.9,0.8c-0.2,0.1-0.4,0.2-0.6,0.3c-0.6,0.3-1.2,0.3-1.8,0.3c-0.6,0-1.5,0-2.4-0.7\n                        c-1.3-0.9-1.8-2.5-1.8-3.8c0-2.8,2.3-4.2,4.1-4.2c0.7,0,1.3,0.2,1.9,0.5c0.9,0.6,1.1,1.4,1.3,1.8l-4.3,1.7l-1.4,0.1\n                        c0.5,2.3,2,3.6,3.7,3.6C87.5,31.2,88.1,31,88.7,30.7C88.7,30.7,88.8,30.6,88.7,30.7z M86.1,26.1c0.3-0.1,0.5-0.2,0.5-0.5\n                        c0-0.7-0.8-1.6-1.8-1.6c-0.7,0-2.1,0.6-2.1,2.5c0,0.3,0,0.6,0.1,1L86.1,26.1z"></path><path fill="#FFFFFF" d="M79.8,30.5c0,0.7,0.1,0.8,0.7,0.9c0.3,0,0.6,0.1,0.9,0.1l-0.7,0.4h-3.2c0.4-0.5,0.5-0.6,0.5-1v-0.4\n                        l0-10.8h-1.4l1.4-0.7h2.6c-0.6,0.3-0.7,0.5-0.8,1.2L79.8,30.5z"></path><path fill="#FFFFFF" d="M74.9,24.4c0.4,0.3,1.3,1.1,1.3,2.4c0,1.3-0.8,2-1.5,2.6c-0.2,0.2-0.5,0.5-0.5,0.9c0,0.4,0.3,0.6,0.5,0.8\n                        l0.7,0.5c0.8,0.7,1.5,1.3,1.5,2.5c0,1.7-1.6,3.4-4.8,3.4c-2.6,0-3.9-1.2-3.9-2.6c0-0.7,0.3-1.6,1.4-2.2c1.1-0.7,2.6-0.8,3.5-0.8\n                        c-0.3-0.3-0.5-0.7-0.5-1.2c0-0.3,0.1-0.5,0.2-0.7c-0.2,0-0.4,0-0.6,0c-1.9,0-3-1.4-3-2.8c0-0.8,0.4-1.8,1.2-2.4\n                        c1-0.8,2.3-1,3.2-1h3.7L76,24.4H74.9z M73.6,32.4c-0.1,0-0.2,0-0.4,0c-0.2,0-1.1,0-1.9,0.3c-0.4,0.1-1.6,0.6-1.6,1.9\n                        c0,1.3,1.2,2.2,3.2,2.2c1.7,0,2.7-0.8,2.7-2C75.6,33.9,75,33.4,73.6,32.4z M74.1,29c0.4-0.4,0.5-1,0.5-1.3c0-1.3-0.8-3.3-2.3-3.3\n                        c-0.5,0-1,0.2-1.3,0.6c-0.3,0.4-0.4,0.9-0.4,1.3c0,1.2,0.7,3.2,2.3,3.2C73.3,29.5,73.8,29.2,74.1,29z"></path><path fill="#FFFFFF" d="M63.7,32.1c-2.9,0-4.4-2.2-4.4-4.3c0-2.4,1.9-4.4,4.7-4.4c2.7,0,4.3,2.1,4.3,4.3\n                        C68.3,29.9,66.6,32.1,63.7,32.1z M65.9,30.7c0.4-0.6,0.5-1.3,0.5-2c0-1.6-0.8-4.6-3-4.6c-0.6,0-1.2,0.2-1.6,0.6\n                        c-0.7,0.6-0.8,1.4-0.8,2.2c0,1.8,0.9,4.7,3.1,4.7C64.8,31.6,65.5,31.3,65.9,30.7z"></path><path fill="#FFFFFF" d="M54,32.1c-2.9,0-4.4-2.2-4.4-4.3c0-2.4,1.9-4.4,4.7-4.4c2.7,0,4.3,2.1,4.3,4.3C58.6,29.9,57,32.1,54,32.1\n                        z M56.3,30.7c0.4-0.6,0.5-1.3,0.5-2c0-1.6-0.8-4.6-3-4.6c-0.6,0-1.2,0.2-1.6,0.6c-0.7,0.6-0.8,1.4-0.8,2.2c0,1.8,0.9,4.7,3.1,4.7\n                        C55.2,31.6,55.9,31.3,56.3,30.7z"></path><path fill="#FFFFFF" d="M48.5,31.5l-2.4,0.6c-1,0.2-1.9,0.3-2.8,0.3c-4.7,0-6.5-3.4-6.5-6.1c0-3.3,2.5-6.3,6.8-6.3\n                        c0.9,0,1.8,0.1,2.6,0.4c1.3,0.4,1.9,0.8,2.2,1.1l-1.4,1.3l-0.6,0.1l0.4-0.7c-0.6-0.6-1.6-1.6-3.6-1.6c-2.7,0-4.7,2-4.7,5\n                        c0,3.2,2.3,6.2,6,6.2c1.1,0,1.6-0.2,2.2-0.4v-2.7l-2.6,0.1l1.4-0.7h3.6l-0.4,0.4c-0.1,0.1-0.1,0.1-0.2,0.3c0,0.2,0,0.6,0,0.8\n                        V31.5z"></path></g><g><path fill="#FFFFFF" d="M93.9,30.8v4.6H93V23.7h0.9V25c0.6-0.9,1.7-1.5,2.9-1.5c2.3,0,3.8,1.7,3.8,4.4c0,2.7-1.5,4.5-3.8,4.5\n                        C95.7,32.3,94.6,31.7,93.9,30.8z M99.7,27.9c0-2.1-1.1-3.6-3-3.6c-1.2,0-2.3,0.9-2.8,1.7v3.8c0.5,0.8,1.6,1.8,2.8,1.8\n                        C98.6,31.5,99.7,29.9,99.7,27.9z"></path><path fill="#FFFFFF" d="M101.9,32.1V20.4h0.9v11.7H101.9z"></path><path fill="#FFFFFF" d="M113.1,34.6c0.2,0.1,0.5,0.1,0.7,0.1c0.6,0,0.9-0.2,1.3-1l0.7-1.5l-3.6-8.6h1l3.1,7.4l3.1-7.4h1L116,34\n                        c-0.5,1.1-1.2,1.6-2.2,1.6c-0.3,0-0.7-0.1-0.9-0.1L113.1,34.6z"></path><path fill="#FFFFFF" d="M110.4,32.1c-0.1-0.3-0.1-0.6-0.1-0.8c0-0.2,0-0.4,0-0.7c-0.3,0.5-0.8,0.8-1.3,1.1\n                        c-0.6,0.3-1.1,0.5-1.8,0.5c-0.9,0-1.6-0.2-2.1-0.7c-0.5-0.4-0.7-1-0.7-1.8c0-0.8,0.4-1.4,1.1-1.9c0.7-0.5,1.6-0.7,2.8-0.7h2.1\n                        v-1.1c0-0.6-0.2-1.1-0.6-1.4c-0.4-0.3-1-0.5-1.8-0.5c-0.7,0-1.2,0.2-1.7,0.5c-0.4,0.3-0.6,0.7-0.6,1.2h-0.9l0,0\n                        c0-0.6,0.3-1.2,0.9-1.7c0.6-0.5,1.4-0.7,2.4-0.7c1,0,1.8,0.2,2.4,0.7c0.6,0.5,0.9,1.2,0.9,2.1v4.2c0,0.3,0,0.6,0.1,0.9\n                        c0,0.3,0.1,0.6,0.2,0.8H110.4z M107.2,31.4c0.8,0,1.3-0.2,1.9-0.5c0.6-0.3,1-0.8,1.2-1.3V28h-2.1c-0.8,0-1.5,0.2-2,0.5\n                        c-0.5,0.4-0.8,0.8-0.8,1.3c0,0.5,0.2,0.9,0.5,1.2C106.1,31.3,106.6,31.4,107.2,31.4z"></path></g></g><g><polygon fill="#F1F2F2" points="20.8,25.4 23.7,22.4 23.7,22.4 20.8,25.4 11.4,16 11.4,16 20.8,25.4 11.4,34.8 11.4,34.8 \n                    20.8,25.4 23.7,28.3 23.7,28.3       "></polygon><path fill="#F1F2F2" d="M23.7,22.4l-11.4-6.3C12,16,11.7,15.9,11.4,16l9.4,9.4L23.7,22.4z"></path><path fill="#F1F2F2" d="M23.7,28.3l3.9-2.1c0.8-0.4,0.8-1.1,0-1.6l-3.9-2.2l-2.9,2.9L23.7,28.3z"></path><path fill="#F1F2F2" d="M11.4,16c-0.3,0.1-0.6,0.5-0.6,1l0,16.8c0,0.5,0.2,0.9,0.6,1l9.4-9.4L11.4,16z"></path><path fill="#F1F2F2" d="M11.4,34.8c0.2,0.1,0.5,0,0.9-0.1l11.4-6.3l-2.9-2.9L11.4,34.8z"></path></g><g><g><path fill="#FFFFFF" d="M41.9,13.7l-0.4-1.1h-2.6l-0.4,1.1h-1.1l2.2-5.7h1.3l2.2,5.7H41.9z M40.2,8.9l-1,2.7h2.1L40.2,8.9z"></path><path fill="#FFFFFF" d="M47.8,13.7l-3-4.1v4.1h-1V7.9h1l2.9,4v-4h1v5.7H47.8z"></path><path fill="#FFFFFF" d="M50.2,13.7V7.9h2.1c1.8,0,3,1.2,3,2.9c0,1.7-1.2,2.9-3,2.9H50.2z M54.3,10.8c0-1.1-0.7-2-2-2h-1.1v4h1.1\n                        C53.6,12.8,54.3,11.9,54.3,10.8z"></path><path fill="#FFFFFF" d="M59.8,13.7l-1.3-2.1h-1v2.1h-1V7.9h2.5c1.1,0,1.9,0.7,1.9,1.8c0,1-0.7,1.6-1.4,1.7l1.4,2.2H59.8z\n                         M59.9,9.7c0-0.5-0.4-0.9-1-0.9h-1.4v1.8h1.4C59.5,10.6,59.9,10.3,59.9,9.7z"></path><path fill="#FFFFFF" d="M61.9,10.8c0-1.7,1.2-3,2.9-3c1.7,0,2.9,1.3,2.9,3c0,1.7-1.2,3-2.9,3C63.1,13.8,61.9,12.5,61.9,10.8z\n                         M66.7,10.8c0-1.2-0.7-2.1-1.9-2.1c-1.2,0-1.9,0.9-1.9,2.1c0,1.2,0.7,2.1,1.9,2.1C66,12.9,66.7,12,66.7,10.8z"></path><path fill="#FFFFFF" d="M68.9,13.7V7.9h1v5.7H68.9z"></path><path fill="#FFFFFF" d="M71.4,13.7V7.9h2.1c1.8,0,3,1.2,3,2.9c0,1.7-1.2,2.9-3,2.9H71.4z M75.5,10.8c0-1.1-0.7-2-2-2h-1.1v4h1.1\n                        C74.7,12.8,75.5,11.9,75.5,10.8z"></path><path fill="#FFFFFF" d="M84.1,13.7l-0.4-1.1h-2.6l-0.4,1.1h-1.1l2.2-5.7H83l2.2,5.7H84.1z M82.4,8.9l-1,2.7h2.1L82.4,8.9z"></path><path fill="#FFFFFF" d="M86.1,13.7V7.9h2.5c1.2,0,1.9,0.8,1.9,1.8c0,1-0.7,1.8-1.9,1.8h-1.5v2.1H86.1z M89.4,9.7\n                        c0-0.5-0.4-0.9-1-0.9h-1.4v1.8h1.4C89,10.6,89.4,10.3,89.4,9.7z"></path><path fill="#FFFFFF" d="M91.5,13.7V7.9H94c1.2,0,1.9,0.8,1.9,1.8c0,1-0.7,1.8-1.9,1.8h-1.5v2.1H91.5z M94.9,9.7\n                        c0-0.5-0.4-0.9-1-0.9h-1.4v1.8h1.4C94.5,10.6,94.9,10.3,94.9,9.7z"></path><path fill="#FFFFFF" d="M99.1,10.8c0-1.7,1.2-3,2.9-3c1.7,0,2.9,1.3,2.9,3c0,1.7-1.2,3-2.9,3C100.3,13.8,99.1,12.5,99.1,10.8z\n                         M103.9,10.8c0-1.2-0.7-2.1-1.9-2.1c-1.2,0-1.9,0.9-1.9,2.1c0,1.2,0.7,2.1,1.9,2.1C103.2,12.9,103.9,12,103.9,10.8z"></path><path fill="#FFFFFF" d="M110.1,13.7l-3-4.1v4.1h-1V7.9h1l2.9,4v-4h1v5.7H110.1z"></path></g></g></g></svg> <svg class="ios-app trk" data-category="desktop:player:appbtns" data-label="ios-app" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="137.6px" height="45.4px" viewbox="0 0 137.6 45.4" enable-background="new 0 0 137.6 45.4" xml:space="preserve"><defs></defs><g><path d="M137.6,42.2c0,1.8-1.4,3.2-3.2,3.2H3.2C1.4,45.4,0,44,0,42.2v-39C0,1.4,1.4,0,3.2,0h131.2c1.8,0,3.2,1.4,3.2,3.2V42.2z"></path><g><path fill="#FFFFFF" d="M26.8,22.8c0-3.6,2.9-5.3,3.1-5.4c-1.7-2.5-4.3-2.8-5.2-2.8c-2.2-0.2-4.3,1.3-5.4,1.3\n                c-1.1,0-2.9-1.3-4.7-1.3c-2.4,0-4.6,1.4-5.8,3.6C6.2,22.5,8,28.9,10.5,32.5c1.2,1.7,2.6,3.7,4.5,3.6c1.8-0.1,2.5-1.2,4.7-1.2\n                c2.2,0,2.8,1.2,4.7,1.1c1.9,0,3.2-1.7,4.3-3.5c1.4-2,2-3.9,2-4C30.6,28.5,26.9,27.1,26.8,22.8z"></path><path fill="#FFFFFF" d="M23.3,12.2c1-1.2,1.6-2.9,1.5-4.6c-1.4,0.1-3.2,1-4.2,2.2c-0.9,1.1-1.7,2.8-1.5,4.4\n                C20.6,14.3,22.2,13.4,23.3,12.2z"></path></g><g><defs><path id="SVGID_1_" d="M137.6,41.8c0,1.8-1.4,3.2-3.2,3.2H3.2C1.4,45,0,43.6,0,41.8V3.6c0-1.8,1.4-3.2,3.2-3.2h131.2\n                    c1.8,0,3.2,1.4,3.2,3.2V41.8z"></path></defs><clippath id="SVGID_2_"><use xlink:href="#SVGID_1_" overflow="visible"></clippath></g><g><g><path fill="#FFFFFF" d="M52.2,35h-2.5l-1.4-4.4h-4.8L42.1,35h-2.5l4.8-14.8h3L52.2,35z M47.9,28.8l-1.3-3.9\n                    c-0.1-0.4-0.4-1.3-0.7-2.8h0c-0.1,0.6-0.4,1.6-0.7,2.8l-1.2,3.9H47.9z"></path><path fill="#FFFFFF" d="M64.5,29.5c0,1.8-0.5,3.3-1.5,4.3c-0.9,0.9-2,1.4-3.3,1.4c-1.4,0-2.4-0.5-3.1-1.5v5.6h-2.4V27.8\n                    c0-1.1,0-2.3-0.1-3.5h2.1l0.1,1.7h0c0.8-1.3,2-1.9,3.6-1.9c1.3,0,2.3,0.5,3.2,1.5C64.1,26.5,64.5,27.9,64.5,29.5z M62.1,29.6\n                    c0-1-0.2-1.9-0.7-2.6c-0.5-0.7-1.2-1.1-2.1-1.1c-0.6,0-1.1,0.2-1.6,0.6c-0.5,0.4-0.8,0.9-0.9,1.5c-0.1,0.3-0.1,0.5-0.1,0.7v1.8\n                    c0,0.8,0.2,1.4,0.7,2c0.5,0.5,1.1,0.8,1.9,0.8c0.9,0,1.6-0.3,2.1-1C61.8,31.6,62.1,30.7,62.1,29.6z"></path><path fill="#FFFFFF" d="M76.8,29.5c0,1.8-0.5,3.3-1.5,4.3c-0.9,0.9-2,1.4-3.3,1.4c-1.4,0-2.4-0.5-3.1-1.5v5.6h-2.4V27.8\n                    c0-1.1,0-2.3-0.1-3.5h2.1l0.1,1.7h0c0.8-1.3,2-1.9,3.6-1.9c1.3,0,2.3,0.5,3.2,1.5C76.4,26.5,76.8,27.9,76.8,29.5z M74.4,29.6\n                    c0-1-0.2-1.9-0.7-2.6c-0.5-0.7-1.2-1.1-2.1-1.1c-0.6,0-1.1,0.2-1.6,0.6c-0.5,0.4-0.8,0.9-0.9,1.5c-0.1,0.3-0.1,0.5-0.1,0.7v1.8\n                    c0,0.8,0.2,1.4,0.7,2c0.5,0.5,1.1,0.8,1.9,0.8c0.9,0,1.6-0.3,2.1-1C74.1,31.6,74.4,30.7,74.4,29.6z"></path><path fill="#FFFFFF" d="M90.5,30.8c0,1.3-0.4,2.3-1.3,3.1c-1,0.9-2.3,1.3-4,1.3c-1.6,0-2.9-0.3-3.8-0.9l0.5-2\n                    c1,0.6,2.2,0.9,3.4,0.9c0.9,0,1.6-0.2,2.1-0.6c0.5-0.4,0.8-0.9,0.8-1.6c0-0.6-0.2-1.1-0.6-1.5c-0.4-0.4-1.1-0.8-2-1.1\n                    c-2.6-1-3.9-2.4-3.9-4.3c0-1.2,0.5-2.2,1.4-3c0.9-0.8,2.1-1.2,3.6-1.2c1.4,0,2.5,0.2,3.4,0.7l-0.6,1.9c-0.8-0.5-1.8-0.7-2.9-0.7\n                    c-0.8,0-1.5,0.2-2,0.6c-0.4,0.4-0.6,0.8-0.6,1.3c0,0.6,0.2,1.1,0.7,1.5c0.4,0.4,1.1,0.7,2.2,1.1c1.3,0.5,2.2,1.1,2.8,1.8\n                    C90.2,28.9,90.5,29.8,90.5,30.8z"></path><path fill="#FFFFFF" d="M98.4,26h-2.6v5.2c0,1.3,0.5,2,1.4,2c0.4,0,0.8,0,1.1-0.1l0.1,1.8c-0.5,0.2-1.1,0.3-1.8,0.3\n                    c-0.9,0-1.7-0.3-2.2-0.9c-0.5-0.6-0.8-1.5-0.8-2.9V26h-1.6v-1.8h1.6v-2l2.3-0.7v2.7h2.6V26z"></path><path fill="#FFFFFF" d="M110.2,29.5c0,1.6-0.5,3-1.4,4.1c-1,1.1-2.3,1.6-3.9,1.6c-1.6,0-2.8-0.5-3.8-1.6c-0.9-1-1.4-2.4-1.4-3.9\n                    c0-1.7,0.5-3,1.4-4.1c1-1.1,2.3-1.6,3.9-1.6c1.6,0,2.8,0.5,3.8,1.6C109.8,26.6,110.2,27.9,110.2,29.5z M107.8,29.6\n                    c0-1-0.2-1.8-0.6-2.5c-0.5-0.8-1.2-1.3-2.1-1.3c-1,0-1.7,0.4-2.2,1.3c-0.4,0.7-0.6,1.6-0.6,2.6c0,1,0.2,1.8,0.6,2.5\n                    c0.5,0.8,1.2,1.3,2.2,1.3c0.9,0,1.6-0.4,2.1-1.3C107.5,31.4,107.8,30.6,107.8,29.6z"></path><path fill="#FFFFFF" d="M118,26.4c-0.2,0-0.5-0.1-0.7-0.1c-0.8,0-1.5,0.3-1.9,0.9c-0.4,0.6-0.6,1.3-0.6,2.1V35h-2.4v-7.3\n                    c0-1.2,0-2.4-0.1-3.4h2.1l0.1,2h0.1c0.3-0.7,0.6-1.3,1.2-1.7c0.5-0.4,1.1-0.6,1.7-0.6c0.2,0,0.4,0,0.6,0L118,26.4L118,26.4z"></path><path fill="#FFFFFF" d="M128.6,29.1c0,0.4,0,0.8-0.1,1.1h-7.1c0,1.1,0.4,1.9,1,2.4c0.6,0.5,1.4,0.7,2.3,0.7c1.1,0,2-0.2,2.9-0.5\n                    l0.4,1.6c-1,0.4-2.2,0.7-3.6,0.7c-1.7,0-3-0.5-3.9-1.5c-0.9-1-1.4-2.3-1.4-3.9c0-1.6,0.4-3,1.3-4c0.9-1.1,2.2-1.7,3.7-1.7\n                    c1.5,0,2.7,0.6,3.5,1.7C128.3,26.6,128.6,27.8,128.6,29.1z M126.3,28.5c0-0.7-0.1-1.3-0.5-1.8c-0.4-0.7-1-1-1.9-1\n                    c-0.8,0-1.4,0.3-1.9,1c-0.4,0.5-0.6,1.1-0.7,1.8L126.3,28.5L126.3,28.5z"></path></g><g><g><path fill="#FFFFFF" d="M42.8,14.9c-0.7,0-1.2,0-1.7-0.1V7.6c0.6-0.1,1.3-0.2,2-0.2c2.7,0,4,1.3,4,3.5\n                        C47.1,13.5,45.6,14.9,42.8,14.9z M43.2,8.4c-0.4,0-0.7,0-0.9,0.1v5.5c0.1,0,0.4,0,0.8,0c1.8,0,2.8-1,2.8-2.9\n                        C45.8,9.3,44.9,8.4,43.2,8.4z"></path><path fill="#FFFFFF" d="M51,14.9c-1.5,0-2.5-1.1-2.5-2.7c0-1.6,1-2.8,2.6-2.8c1.5,0,2.5,1.1,2.5,2.7\n                        C53.6,13.8,52.5,14.9,51,14.9z M51,10.3c-0.8,0-1.4,0.8-1.4,1.9c0,1.1,0.6,1.9,1.4,1.9c0.8,0,1.4-0.8,1.4-1.9\n                        C52.4,11.1,51.8,10.3,51,10.3z"></path><path fill="#FFFFFF" d="M62.4,9.6l-1.6,5.3h-1.1L59,12.5c-0.2-0.6-0.3-1.1-0.4-1.7h0c-0.1,0.6-0.2,1.1-0.4,1.7l-0.7,2.3h-1.1\n                        l-1.5-5.3h1.2l0.6,2.5c0.1,0.6,0.3,1.2,0.4,1.7h0c0.1-0.4,0.2-1,0.4-1.7l0.7-2.5h1l0.7,2.5c0.2,0.6,0.3,1.2,0.4,1.7h0\n                        c0.1-0.5,0.2-1.1,0.4-1.7l0.6-2.5L62.4,9.6L62.4,9.6z"></path><path fill="#FFFFFF" d="M68.4,14.8h-1.2v-3c0-0.9-0.4-1.4-1.1-1.4c-0.7,0-1.2,0.6-1.2,1.3v3.1h-1.2v-3.8c0-0.5,0-1,0-1.5h1\n                        l0.1,0.8h0c0.3-0.6,1-0.9,1.7-0.9c1.1,0,1.8,0.8,1.8,2.2L68.4,14.8L68.4,14.8z"></path><path fill="#FFFFFF" d="M71.6,14.8h-1.2V7.1h1.2V14.8z"></path><path fill="#FFFFFF" d="M75.9,14.9c-1.5,0-2.5-1.1-2.5-2.7c0-1.6,1-2.8,2.6-2.8c1.5,0,2.5,1.1,2.5,2.7\n                        C78.5,13.8,77.5,14.9,75.9,14.9z M75.9,10.3c-0.8,0-1.4,0.8-1.4,1.9c0,1.1,0.6,1.9,1.4,1.9c0.8,0,1.4-0.8,1.4-1.9\n                        C77.3,11.1,76.8,10.3,75.9,10.3z"></path><path fill="#FFFFFF" d="M83.1,14.8L83,14.2h0c-0.4,0.5-0.9,0.7-1.5,0.7c-0.9,0-1.6-0.7-1.6-1.5c0-1.3,1.1-2,3.1-2v-0.1\n                        c0-0.7-0.4-1-1.1-1c-0.5,0-1,0.1-1.4,0.4l-0.2-0.8c0.5-0.3,1.1-0.5,1.8-0.5c1.4,0,2.1,0.7,2.1,2.2v1.9c0,0.5,0,0.9,0.1,1.3\n                        L83.1,14.8L83.1,14.8z M83,12.2c-1.3,0-1.9,0.3-1.9,1.1c0,0.6,0.3,0.8,0.8,0.8c0.6,0,1.1-0.5,1.1-1.1V12.2z"></path><path fill="#FFFFFF" d="M89.8,14.8L89.7,14h0c-0.3,0.6-0.9,1-1.7,1c-1.3,0-2.2-1.1-2.2-2.7c0-1.6,1-2.8,2.3-2.8\n                        c0.7,0,1.2,0.2,1.5,0.7h0v-3h1.2v6.3c0,0.5,0,1,0,1.4H89.8z M89.6,11.7c0-0.7-0.5-1.4-1.2-1.4c-0.9,0-1.4,0.8-1.4,1.8\n                        c0,1.1,0.5,1.8,1.4,1.8c0.7,0,1.3-0.6,1.3-1.4V11.7z"></path><path fill="#FFFFFF" d="M98.2,14.9c-1.5,0-2.5-1.1-2.5-2.7c0-1.6,1-2.8,2.6-2.8c1.5,0,2.5,1.1,2.5,2.7\n                        C100.8,13.8,99.8,14.9,98.2,14.9z M98.2,10.3c-0.8,0-1.4,0.8-1.4,1.9c0,1.1,0.6,1.9,1.4,1.9c0.8,0,1.4-0.8,1.4-1.9\n                        C99.6,11.1,99.1,10.3,98.2,10.3z"></path><path fill="#FFFFFF" d="M107.1,14.8h-1.2v-3c0-0.9-0.4-1.4-1.1-1.4c-0.7,0-1.2,0.6-1.2,1.3v3.1h-1.2v-3.8c0-0.5,0-1,0-1.5h1\n                        l0.1,0.8h0c0.3-0.6,1-0.9,1.7-0.9c1.1,0,1.8,0.8,1.8,2.2V14.8z"></path><path fill="#FFFFFF" d="M115,10.4h-1.3V13c0,0.7,0.2,1,0.7,1c0.2,0,0.4,0,0.5-0.1l0,0.9c-0.2,0.1-0.5,0.1-0.9,0.1\n                        c-0.9,0-1.5-0.5-1.5-1.8v-2.7h-0.8V9.6h0.8v-1l1.1-0.3v1.3h1.3V10.4z"></path><path fill="#FFFFFF" d="M121.1,14.8H120v-3c0-0.9-0.4-1.4-1.1-1.4c-0.6,0-1.2,0.4-1.2,1.2v3.2h-1.2V7.1h1.2v3.2h0\n                        c0.4-0.6,0.9-0.9,1.6-0.9c1.1,0,1.8,0.9,1.8,2.2V14.8z"></path><path fill="#FFFFFF" d="M127.5,12.5H124c0,1,0.7,1.6,1.7,1.6c0.5,0,1-0.1,1.4-0.2l0.2,0.8c-0.5,0.2-1.1,0.3-1.8,0.3\n                        c-1.6,0-2.6-1-2.6-2.7c0-1.6,1-2.8,2.5-2.8c1.3,0,2.2,1,2.2,2.5C127.5,12.1,127.5,12.3,127.5,12.5z M126.4,11.6\n                        c0-0.8-0.4-1.4-1.2-1.4c-0.7,0-1.2,0.6-1.3,1.4H126.4z"></path></g></g></g></g></svg></div><div class="PlayerUI"><div class="play-pause"><div class="play"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="17.6px" height="20px" viewbox="0 0 17.6 20" enable-background="new 0 0 17.6 20" xml:space="preserve"><defs></defs><polygon fill="#FFFFFF" points="0,0 17.6,10 0,20 "></polygon></svg></div><div class="pause"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="20px" height="19.8px" viewbox="0 0 20 19.8" enable-background="new 0 0 20 19.8" xml:space="preserve"><defs></defs><rect y="0" fill="#FFFFFF" width="7" height="19.8"></rect><rect x="13" y="0" fill="#FFFFFF" width="7" height="19.8"></rect></svg></div></div><div class="mute"><div class="soundOn"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="31px" height="24.5px" viewbox="0 0 31 24.5" enable-background="new 0 0 31 24.5" xml:space="preserve"><defs></defs><g><path fill="#FFFFFF" d="M25.8,24.5c-0.2,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4c2.5-2.6,3.9-6.5,3.9-10.5c0-4.1-1.4-7.9-3.9-10.5 c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0c2.9,3,4.5,7.3,4.5,11.9s-1.6,8.9-4.5,11.9C26.3,24.4,26.1,24.5,25.8,24.5z"></path><path fill="#FFFFFF" d="M22.5,21.4c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4c1.8-1.8,2.9-4.5,2.9-7.4c0-2.9-1.1-5.6-2.9-7.4 c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0c2.2,2.2,3.5,5.4,3.5,8.9c0,3.5-1.3,6.7-3.5,8.9C23,21.3,22.7,21.4,22.5,21.4z"></path><path fill="#FFFFFF" d="M19.2,18.2c-0.3,0-0.6-0.1-0.8-0.4c-0.4-0.4-0.3-1.1,0.1-1.4c1.1-0.9,1.8-2.5,1.8-4.2 c0-1.7-0.7-3.3-1.8-4.3c-0.4-0.3-0.5-1-0.1-1.4c0.3-0.4,1-0.5,1.4-0.1c1.6,1.3,2.6,3.5,2.6,5.8c0,2.3-0.9,4.5-2.5,5.8 C19.6,18.2,19.4,18.2,19.2,18.2z"></path><polygon fill="#FFFFFF" points="4.6,6.6 0,6.6 0,17.9 4.6,17.9 13.1,24.2 13.1,0.2 \t"></polygon></g></svg></div><div class="soundOff"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="31.4px" height="24px" viewbox="0 0 31.4 24" enable-background="new 0 0 31.4 24" xml:space="preserve"><defs></defs><g><polygon fill="#FFFFFF" points="4.6,6.3 0,6.3 0,17.7 4.6,17.7 13.1,24 13.1,0 \t"></polygon><path fill="#FFFFFF" d="M30.6,17.9c-0.2,0-0.4-0.1-0.6-0.3l-11-11c-0.3-0.3-0.3-0.9,0-1.2s0.9-0.3,1.2,0l11,11 c0.3,0.3,0.3,0.9,0,1.2C31,17.9,30.8,17.9,30.6,17.9z"></path><path fill="#FFFFFF" d="M19.5,17.9c-0.2,0-0.4-0.1-0.6-0.3c-0.3-0.3-0.3-0.9,0-1.2l11-11c0.3-0.3,0.9-0.3,1.2,0s0.3,0.9,0,1.2 l-11,11C20,17.9,19.8,17.9,19.5,17.9z"></path></g></svg></div></div></div></div>';

}
return __p
};
},{"lodash":3}],40:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="preload-inner"><div class="percentage"></div></div>';

}
return __p
};
},{"lodash":3}],41:[function(require,module,exports){
var _ = require('lodash');
module.exports = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="container"></div>';

}
return __p
};
},{"lodash":3}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9hcHAvanMvbWFpbi5qcyIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvbm9kZV9tb2R1bGVzL2RvbXJlYWR5L3JlYWR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9kaXN0L2xvZGFzaC5qcyIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC9qcy9EZXRhaWwuanMiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvanMvRm9vdGVyLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL0dJdGVtLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL0dhbGxlcnkuanMiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvanMvR2FsbGVyeUl0ZW1zLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL0dhbGxlcnlOYXYuanMiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvanMvR2xvYmFsRXZlbnRNb2RlbC5qcyIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC9qcy9IZWFkZXIuanMiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvanMvSW50cm8uanMiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvanMvUGxheWVyLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL1ByZWxvYWRlci5qcyIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC9qcy9Tb2NpYWwuanMiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvanMvYXBwLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL21vYmlsZS1nYWxsZXJ5LmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL21vYmlsZS1pbnRyby5qcyIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC9qcy9yb3V0ZXIuanMiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvanMvdXRpbGl0aWVzL0F1ZGlvLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL3V0aWxpdGllcy9EYXRhLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL3V0aWxpdGllcy9JMThuLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL2pzL3V0aWxpdGllcy9jaGVja3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC9qcy91dGlsaXRpZXMvY2hlY2tzL2NoZWNrcy5qcyIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC9qcy91dGlsaXRpZXMvY2hlY2tzL2RldmljZS5qcyIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC9qcy91dGlsaXRpZXMvaW1nX3NlcXVlbmNlLmpzIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL3RlbXBsYXRlcy9hcHAudHBsIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL3RlbXBsYXRlcy9kZXRhaWwudHBsIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL3RlbXBsYXRlcy9mb290ZXIudHBsIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL3RlbXBsYXRlcy9nYWxsZXJ5LWl0ZW0taW50cm8udHBsIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL3RlbXBsYXRlcy9nYWxsZXJ5LWl0ZW0udHBsIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL3RlbXBsYXRlcy9nYWxsZXJ5LWl0ZW1zLnRwbCIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC90ZW1wbGF0ZXMvZ2FsbGVyeS1uYXYudHBsIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL3RlbXBsYXRlcy9nYWxsZXJ5LnRwbCIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC90ZW1wbGF0ZXMvaGVhZGVyLnRwbCIsIi9Vc2Vycy9Ub29sL0RvY3VtZW50cy9kZXYvY29udmVyc2Uvc3JjL2FwcC90ZW1wbGF0ZXMvaW50cm8udHBsIiwiL1VzZXJzL1Rvb2wvRG9jdW1lbnRzL2Rldi9jb252ZXJzZS9zcmMvYXBwL3RlbXBsYXRlcy9tb2JpbGUtZ2FsbGVyeS50cGwiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvdGVtcGxhdGVzL21vYmlsZS1pbnRyby50cGwiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvdGVtcGxhdGVzL3BsYXllci50cGwiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvdGVtcGxhdGVzL3ByZWxvYWRlci50cGwiLCIvVXNlcnMvVG9vbC9Eb2N1bWVudHMvZGV2L2NvbnZlcnNlL3NyYy9hcHAvdGVtcGxhdGVzL3NvY2lhbHMudHBsIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY2FsbFRvU3RhcnQgPSByZXF1aXJlKCdkb21yZWFkeScpO1xuXG52YXIgQXBwID0gcmVxdWlyZSgnLi9hcHAuanMnKTtcblxuY2FsbFRvU3RhcnQoIGZ1bmN0aW9uKCkge1xuICAgIHZhciBpZCA9IFwiY29uX21ieVwiO1xuICAgIHdpbmRvd1tpZF0gPSBuZXcgQXBwKHskZWw6JCgnIycraWQpfSk7XG59KTtcblxuXG4iLCIvKiFcbiAgKiBkb21yZWFkeSAoYykgRHVzdGluIERpYXogMjAxNCAtIExpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpXG5cbn0oJ2RvbXJlYWR5JywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmbnMgPSBbXSwgbGlzdGVuZXJcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBoYWNrID0gZG9jLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbFxuICAgICwgZG9tQ29udGVudExvYWRlZCA9ICdET01Db250ZW50TG9hZGVkJ1xuICAgICwgbG9hZGVkID0gKGhhY2sgPyAvXmxvYWRlZHxeYy8gOiAvXmxvYWRlZHxeaXxeYy8pLnRlc3QoZG9jLnJlYWR5U3RhdGUpXG5cblxuICBpZiAoIWxvYWRlZClcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIpXG4gICAgbG9hZGVkID0gMVxuICAgIHdoaWxlIChsaXN0ZW5lciA9IGZucy5zaGlmdCgpKSBsaXN0ZW5lcigpXG4gIH0pXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIGxvYWRlZCA/IGZuKCkgOiBmbnMucHVzaChmbilcbiAgfVxuXG59KTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiAtbyAuL2Rpc3QvbG9kYXNoLmpzYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbjsoZnVuY3Rpb24oKSB7XG5cbiAgLyoqIFVzZWQgYXMgYSBzYWZlIHJlZmVyZW5jZSBmb3IgYHVuZGVmaW5lZGAgaW4gcHJlIEVTNSBlbnZpcm9ubWVudHMgKi9cbiAgdmFyIHVuZGVmaW5lZDtcblxuICAvKiogVXNlZCB0byBwb29sIGFycmF5cyBhbmQgb2JqZWN0cyB1c2VkIGludGVybmFsbHkgKi9cbiAgdmFyIGFycmF5UG9vbCA9IFtdLFxuICAgICAgb2JqZWN0UG9vbCA9IFtdO1xuXG4gIC8qKiBVc2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMgKi9cbiAgdmFyIGlkQ291bnRlciA9IDA7XG5cbiAgLyoqIFVzZWQgdG8gcHJlZml4IGtleXMgdG8gYXZvaWQgaXNzdWVzIHdpdGggYF9fcHJvdG9fX2AgYW5kIHByb3BlcnRpZXMgb24gYE9iamVjdC5wcm90b3R5cGVgICovXG4gIHZhciBrZXlQcmVmaXggPSArbmV3IERhdGUgKyAnJztcblxuICAvKiogVXNlZCBhcyB0aGUgc2l6ZSB3aGVuIG9wdGltaXphdGlvbnMgYXJlIGVuYWJsZWQgZm9yIGxhcmdlIGFycmF5cyAqL1xuICB2YXIgbGFyZ2VBcnJheVNpemUgPSA3NTtcblxuICAvKiogVXNlZCBhcyB0aGUgbWF4IHNpemUgb2YgdGhlIGBhcnJheVBvb2xgIGFuZCBgb2JqZWN0UG9vbGAgKi9cbiAgdmFyIG1heFBvb2xTaXplID0gNDA7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0IGFuZCB0ZXN0IHdoaXRlc3BhY2UgKi9cbiAgdmFyIHdoaXRlc3BhY2UgPSAoXG4gICAgLy8gd2hpdGVzcGFjZVxuICAgICcgXFx0XFx4MEJcXGZcXHhBMFxcdWZlZmYnICtcblxuICAgIC8vIGxpbmUgdGVybWluYXRvcnNcbiAgICAnXFxuXFxyXFx1MjAyOFxcdTIwMjknICtcblxuICAgIC8vIHVuaWNvZGUgY2F0ZWdvcnkgXCJac1wiIHNwYWNlIHNlcGFyYXRvcnNcbiAgICAnXFx1MTY4MFxcdTE4MGVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwYVxcdTIwMmZcXHUyMDVmXFx1MzAwMCdcbiAgKTtcblxuICAvKiogVXNlZCB0byBtYXRjaCBlbXB0eSBzdHJpbmcgbGl0ZXJhbHMgaW4gY29tcGlsZWQgdGVtcGxhdGUgc291cmNlICovXG4gIHZhciByZUVtcHR5U3RyaW5nTGVhZGluZyA9IC9cXGJfX3AgXFwrPSAnJzsvZyxcbiAgICAgIHJlRW1wdHlTdHJpbmdNaWRkbGUgPSAvXFxiKF9fcCBcXCs9KSAnJyBcXCsvZyxcbiAgICAgIHJlRW1wdHlTdHJpbmdUcmFpbGluZyA9IC8oX19lXFwoLio/XFwpfFxcYl9fdFxcKSkgXFwrXFxuJyc7L2c7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gbWF0Y2ggRVM2IHRlbXBsYXRlIGRlbGltaXRlcnNcbiAgICogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbGl0ZXJhbHMtc3RyaW5nLWxpdGVyYWxzXG4gICAqL1xuICB2YXIgcmVFc1RlbXBsYXRlID0gL1xcJFxceyhbXlxcXFx9XSooPzpcXFxcLlteXFxcXH1dKikqKVxcfS9nO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIHJlZ2V4cCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcyAqL1xuICB2YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0ZWQgbmFtZWQgZnVuY3Rpb25zICovXG4gIHZhciByZUZ1bmNOYW1lID0gL15cXHMqZnVuY3Rpb25bIFxcblxcclxcdF0rXFx3LztcblxuICAvKiogVXNlZCB0byBtYXRjaCBcImludGVycG9sYXRlXCIgdGVtcGxhdGUgZGVsaW1pdGVycyAqL1xuICB2YXIgcmVJbnRlcnBvbGF0ZSA9IC88JT0oW1xcc1xcU10rPyklPi9nO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgd2hpdGVzcGFjZSBhbmQgemVyb3MgdG8gYmUgcmVtb3ZlZCAqL1xuICB2YXIgcmVMZWFkaW5nU3BhY2VzQW5kWmVyb3MgPSBSZWdFeHAoJ15bJyArIHdoaXRlc3BhY2UgKyAnXSowKyg/PS4kKScpO1xuXG4gIC8qKiBVc2VkIHRvIGVuc3VyZSBjYXB0dXJpbmcgb3JkZXIgb2YgdGVtcGxhdGUgZGVsaW1pdGVycyAqL1xuICB2YXIgcmVOb01hdGNoID0gLygkXikvO1xuXG4gIC8qKiBVc2VkIHRvIGRldGVjdCBmdW5jdGlvbnMgY29udGFpbmluZyBhIGB0aGlzYCByZWZlcmVuY2UgKi9cbiAgdmFyIHJlVGhpcyA9IC9cXGJ0aGlzXFxiLztcblxuICAvKiogVXNlZCB0byBtYXRjaCB1bmVzY2FwZWQgY2hhcmFjdGVycyBpbiBjb21waWxlZCBzdHJpbmcgbGl0ZXJhbHMgKi9cbiAgdmFyIHJlVW5lc2NhcGVkU3RyaW5nID0gL1snXFxuXFxyXFx0XFx1MjAyOFxcdTIwMjlcXFxcXS9nO1xuXG4gIC8qKiBVc2VkIHRvIGFzc2lnbiBkZWZhdWx0IGBjb250ZXh0YCBvYmplY3QgcHJvcGVydGllcyAqL1xuICB2YXIgY29udGV4dFByb3BzID0gW1xuICAgICdBcnJheScsICdCb29sZWFuJywgJ0RhdGUnLCAnRnVuY3Rpb24nLCAnTWF0aCcsICdOdW1iZXInLCAnT2JqZWN0JyxcbiAgICAnUmVnRXhwJywgJ1N0cmluZycsICdfJywgJ2F0dGFjaEV2ZW50JywgJ2NsZWFyVGltZW91dCcsICdpc0Zpbml0ZScsICdpc05hTicsXG4gICAgJ3BhcnNlSW50JywgJ3NldFRpbWVvdXQnXG4gIF07XG5cbiAgLyoqIFVzZWQgdG8gbWFrZSB0ZW1wbGF0ZSBzb3VyY2VVUkxzIGVhc2llciB0byBpZGVudGlmeSAqL1xuICB2YXIgdGVtcGxhdGVDb3VudGVyID0gMDtcblxuICAvKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHNob3J0Y3V0cyAqL1xuICB2YXIgYXJnc0NsYXNzID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgICBhcnJheUNsYXNzID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICAgIGJvb2xDbGFzcyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICAgIGRhdGVDbGFzcyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICAgIGZ1bmNDbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgICBudW1iZXJDbGFzcyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgICAgb2JqZWN0Q2xhc3MgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICAgIHJlZ2V4cENsYXNzID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgICBzdHJpbmdDbGFzcyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG4gIC8qKiBVc2VkIHRvIGlkZW50aWZ5IG9iamVjdCBjbGFzc2lmaWNhdGlvbnMgdGhhdCBgXy5jbG9uZWAgc3VwcG9ydHMgKi9cbiAgdmFyIGNsb25lYWJsZUNsYXNzZXMgPSB7fTtcbiAgY2xvbmVhYmxlQ2xhc3Nlc1tmdW5jQ2xhc3NdID0gZmFsc2U7XG4gIGNsb25lYWJsZUNsYXNzZXNbYXJnc0NsYXNzXSA9IGNsb25lYWJsZUNsYXNzZXNbYXJyYXlDbGFzc10gPVxuICBjbG9uZWFibGVDbGFzc2VzW2Jvb2xDbGFzc10gPSBjbG9uZWFibGVDbGFzc2VzW2RhdGVDbGFzc10gPVxuICBjbG9uZWFibGVDbGFzc2VzW251bWJlckNsYXNzXSA9IGNsb25lYWJsZUNsYXNzZXNbb2JqZWN0Q2xhc3NdID1cbiAgY2xvbmVhYmxlQ2xhc3Nlc1tyZWdleHBDbGFzc10gPSBjbG9uZWFibGVDbGFzc2VzW3N0cmluZ0NsYXNzXSA9IHRydWU7XG5cbiAgLyoqIFVzZWQgYXMgYW4gaW50ZXJuYWwgYF8uZGVib3VuY2VgIG9wdGlvbnMgb2JqZWN0ICovXG4gIHZhciBkZWJvdW5jZU9wdGlvbnMgPSB7XG4gICAgJ2xlYWRpbmcnOiBmYWxzZSxcbiAgICAnbWF4V2FpdCc6IDAsXG4gICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAgfTtcblxuICAvKiogVXNlZCBhcyB0aGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgYF9fYmluZERhdGFfX2AgKi9cbiAgdmFyIGRlc2NyaXB0b3IgPSB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IGZhbHNlLFxuICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgJ3ZhbHVlJzogbnVsbCxcbiAgICAnd3JpdGFibGUnOiBmYWxzZVxuICB9O1xuXG4gIC8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIE9iamVjdCAqL1xuICB2YXIgb2JqZWN0VHlwZXMgPSB7XG4gICAgJ2Jvb2xlYW4nOiBmYWxzZSxcbiAgICAnZnVuY3Rpb24nOiB0cnVlLFxuICAgICdvYmplY3QnOiB0cnVlLFxuICAgICdudW1iZXInOiBmYWxzZSxcbiAgICAnc3RyaW5nJzogZmFsc2UsXG4gICAgJ3VuZGVmaW5lZCc6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFVzZWQgdG8gZXNjYXBlIGNoYXJhY3RlcnMgZm9yIGluY2x1c2lvbiBpbiBjb21waWxlZCBzdHJpbmcgbGl0ZXJhbHMgKi9cbiAgdmFyIHN0cmluZ0VzY2FwZXMgPSB7XG4gICAgJ1xcXFwnOiAnXFxcXCcsXG4gICAgXCInXCI6IFwiJ1wiLFxuICAgICdcXG4nOiAnbicsXG4gICAgJ1xccic6ICdyJyxcbiAgICAnXFx0JzogJ3QnLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYCAqL1xuICB2YXIgZnJlZUV4cG9ydHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYCAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgICovXG4gIHZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzICYmIGZyZWVFeHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMgb3IgQnJvd3NlcmlmaWVkIGNvZGUgYW5kIHVzZSBpdCBhcyBgcm9vdGAgKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSBvYmplY3RUeXBlc1t0eXBlb2YgZ2xvYmFsXSAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCkpIHtcbiAgICByb290ID0gZnJlZUdsb2JhbDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IHN1cHBvcnQgZm9yIGJpbmFyeSBzZWFyY2hlc1xuICAgKiBvciBgZnJvbUluZGV4YCBjb25zdHJhaW50cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSBvciBgLTFgLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgaW5kZXggPSAoZnJvbUluZGV4IHx8IDApIC0gMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGltcGxlbWVudGF0aW9uIG9mIGBfLmNvbnRhaW5zYCBmb3IgY2FjaGUgb2JqZWN0cyB0aGF0IG1pbWljcyB0aGUgcmV0dXJuXG4gICAqIHNpZ25hdHVyZSBvZiBgXy5pbmRleE9mYCBieSByZXR1cm5pbmcgYDBgIGlmIHRoZSB2YWx1ZSBpcyBmb3VuZCwgZWxzZSBgLTFgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGAwYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGAtMWAuXG4gICAqL1xuICBmdW5jdGlvbiBjYWNoZUluZGV4T2YoY2FjaGUsIHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgY2FjaGUgPSBjYWNoZS5jYWNoZTtcblxuICAgIGlmICh0eXBlID09ICdib29sZWFuJyB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY2FjaGVbdmFsdWVdID8gMCA6IC0xO1xuICAgIH1cbiAgICBpZiAodHlwZSAhPSAnbnVtYmVyJyAmJiB0eXBlICE9ICdzdHJpbmcnKSB7XG4gICAgICB0eXBlID0gJ29iamVjdCc7XG4gICAgfVxuICAgIHZhciBrZXkgPSB0eXBlID09ICdudW1iZXInID8gdmFsdWUgOiBrZXlQcmVmaXggKyB2YWx1ZTtcbiAgICBjYWNoZSA9IChjYWNoZSA9IGNhY2hlW3R5cGVdKSAmJiBjYWNoZVtrZXldO1xuXG4gICAgcmV0dXJuIHR5cGUgPT0gJ29iamVjdCdcbiAgICAgID8gKGNhY2hlICYmIGJhc2VJbmRleE9mKGNhY2hlLCB2YWx1ZSkgPiAtMSA/IDAgOiAtMSlcbiAgICAgIDogKGNhY2hlID8gMCA6IC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZ2l2ZW4gdmFsdWUgdG8gdGhlIGNvcnJlc3BvbmRpbmcgY2FjaGUgb2JqZWN0LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhZGQgdG8gdGhlIGNhY2hlLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FjaGVQdXNoKHZhbHVlKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZSxcbiAgICAgICAgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcblxuICAgIGlmICh0eXBlID09ICdib29sZWFuJyB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgICBjYWNoZVt2YWx1ZV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZSAhPSAnbnVtYmVyJyAmJiB0eXBlICE9ICdzdHJpbmcnKSB7XG4gICAgICAgIHR5cGUgPSAnb2JqZWN0JztcbiAgICAgIH1cbiAgICAgIHZhciBrZXkgPSB0eXBlID09ICdudW1iZXInID8gdmFsdWUgOiBrZXlQcmVmaXggKyB2YWx1ZSxcbiAgICAgICAgICB0eXBlQ2FjaGUgPSBjYWNoZVt0eXBlXSB8fCAoY2FjaGVbdHlwZV0gPSB7fSk7XG5cbiAgICAgIGlmICh0eXBlID09ICdvYmplY3QnKSB7XG4gICAgICAgICh0eXBlQ2FjaGVba2V5XSB8fCAodHlwZUNhY2hlW2tleV0gPSBbXSkpLnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZUNhY2hlW2tleV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IGBfLm1heGAgYW5kIGBfLm1pbmAgYXMgdGhlIGRlZmF1bHQgY2FsbGJhY2sgd2hlbiBhIGdpdmVuXG4gICAqIGNvbGxlY3Rpb24gaXMgYSBzdHJpbmcgdmFsdWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgY2hhcmFjdGVyIHRvIGluc3BlY3QuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvZGUgdW5pdCBvZiBnaXZlbiBjaGFyYWN0ZXIuXG4gICAqL1xuICBmdW5jdGlvbiBjaGFyQXRDYWxsYmFjayh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5jaGFyQ29kZUF0KDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgYHNvcnRCeWAgdG8gY29tcGFyZSB0cmFuc2Zvcm1lZCBgY29sbGVjdGlvbmAgZWxlbWVudHMsIHN0YWJsZSBzb3J0aW5nXG4gICAqIHRoZW0gaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGNvbXBhcmUgdG8gYGJgLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvbXBhcmUgdG8gYGFgLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBzb3J0IG9yZGVyIGluZGljYXRvciBvZiBgMWAgb3IgYC0xYC5cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVBc2NlbmRpbmcoYSwgYikge1xuICAgIHZhciBhYyA9IGEuY3JpdGVyaWEsXG4gICAgICAgIGJjID0gYi5jcml0ZXJpYSxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYWMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFjW2luZGV4XSxcbiAgICAgICAgICBvdGhlciA9IGJjW2luZGV4XTtcblxuICAgICAgaWYgKHZhbHVlICE9PSBvdGhlcikge1xuICAgICAgICBpZiAodmFsdWUgPiBvdGhlciB8fCB0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgPCBvdGhlciB8fCB0eXBlb2Ygb3RoZXIgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRml4ZXMgYW4gYEFycmF5I3NvcnRgIGJ1ZyBpbiB0aGUgSlMgZW5naW5lIGVtYmVkZGVkIGluIEFkb2JlIGFwcGxpY2F0aW9uc1xuICAgIC8vIHRoYXQgY2F1c2VzIGl0LCB1bmRlciBjZXJ0YWluIGNpcmN1bXN0YW5jZXMsIHRvIHJldHVybiB0aGUgc2FtZSB2YWx1ZSBmb3JcbiAgICAvLyBgYWAgYW5kIGBiYC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9wdWxsLzEyNDdcbiAgICAvL1xuICAgIC8vIFRoaXMgYWxzbyBlbnN1cmVzIGEgc3RhYmxlIHNvcnQgaW4gVjggYW5kIG90aGVyIGVuZ2luZXMuXG4gICAgLy8gU2VlIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTkwXG4gICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjYWNoZSBvYmplY3QgdG8gb3B0aW1pemUgbGluZWFyIHNlYXJjaGVzIG9mIGxhcmdlIGFycmF5cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgKiBAcmV0dXJucyB7bnVsbHxPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIG9iamVjdCBvciBgbnVsbGAgaWYgY2FjaGluZyBzaG91bGQgbm90IGJlIHVzZWQuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVDYWNoZShhcnJheSkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIGZpcnN0ID0gYXJyYXlbMF0sXG4gICAgICAgIG1pZCA9IGFycmF5WyhsZW5ndGggLyAyKSB8IDBdLFxuICAgICAgICBsYXN0ID0gYXJyYXlbbGVuZ3RoIC0gMV07XG5cbiAgICBpZiAoZmlyc3QgJiYgdHlwZW9mIGZpcnN0ID09ICdvYmplY3QnICYmXG4gICAgICAgIG1pZCAmJiB0eXBlb2YgbWlkID09ICdvYmplY3QnICYmIGxhc3QgJiYgdHlwZW9mIGxhc3QgPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGNhY2hlID0gZ2V0T2JqZWN0KCk7XG4gICAgY2FjaGVbJ2ZhbHNlJ10gPSBjYWNoZVsnbnVsbCddID0gY2FjaGVbJ3RydWUnXSA9IGNhY2hlWyd1bmRlZmluZWQnXSA9IGZhbHNlO1xuXG4gICAgdmFyIHJlc3VsdCA9IGdldE9iamVjdCgpO1xuICAgIHJlc3VsdC5hcnJheSA9IGFycmF5O1xuICAgIHJlc3VsdC5jYWNoZSA9IGNhY2hlO1xuICAgIHJlc3VsdC5wdXNoID0gY2FjaGVQdXNoO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBieSBgdGVtcGxhdGVgIHRvIGVzY2FwZSBjaGFyYWN0ZXJzIGZvciBpbmNsdXNpb24gaW4gY29tcGlsZWRcbiAgICogc3RyaW5nIGxpdGVyYWxzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2ggVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAqL1xuICBmdW5jdGlvbiBlc2NhcGVTdHJpbmdDaGFyKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIHN0cmluZ0VzY2FwZXNbbWF0Y2hdO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gYXJyYXkgZnJvbSB0aGUgYXJyYXkgcG9vbCBvciBjcmVhdGVzIGEgbmV3IG9uZSBpZiB0aGUgcG9vbCBpcyBlbXB0eS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgZnJvbSB0aGUgcG9vbC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldEFycmF5KCkge1xuICAgIHJldHVybiBhcnJheVBvb2wucG9wKCkgfHwgW107XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYmplY3QgZnJvbSB0aGUgb2JqZWN0IHBvb2wgb3IgY3JlYXRlcyBhIG5ldyBvbmUgaWYgdGhlIHBvb2wgaXMgZW1wdHkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBvYmplY3QgZnJvbSB0aGUgcG9vbC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldE9iamVjdCgpIHtcbiAgICByZXR1cm4gb2JqZWN0UG9vbC5wb3AoKSB8fCB7XG4gICAgICAnYXJyYXknOiBudWxsLFxuICAgICAgJ2NhY2hlJzogbnVsbCxcbiAgICAgICdjcml0ZXJpYSc6IG51bGwsXG4gICAgICAnZmFsc2UnOiBmYWxzZSxcbiAgICAgICdpbmRleCc6IDAsXG4gICAgICAnbnVsbCc6IGZhbHNlLFxuICAgICAgJ251bWJlcic6IG51bGwsXG4gICAgICAnb2JqZWN0JzogbnVsbCxcbiAgICAgICdwdXNoJzogbnVsbCxcbiAgICAgICdzdHJpbmcnOiBudWxsLFxuICAgICAgJ3RydWUnOiBmYWxzZSxcbiAgICAgICd1bmRlZmluZWQnOiBmYWxzZSxcbiAgICAgICd2YWx1ZSc6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSBnaXZlbiBhcnJheSBiYWNrIHRvIHRoZSBhcnJheSBwb29sLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byByZWxlYXNlLlxuICAgKi9cbiAgZnVuY3Rpb24gcmVsZWFzZUFycmF5KGFycmF5KSB7XG4gICAgYXJyYXkubGVuZ3RoID0gMDtcbiAgICBpZiAoYXJyYXlQb29sLmxlbmd0aCA8IG1heFBvb2xTaXplKSB7XG4gICAgICBhcnJheVBvb2wucHVzaChhcnJheSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSBnaXZlbiBvYmplY3QgYmFjayB0byB0aGUgb2JqZWN0IHBvb2wuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHJlbGVhc2UuXG4gICAqL1xuICBmdW5jdGlvbiByZWxlYXNlT2JqZWN0KG9iamVjdCkge1xuICAgIHZhciBjYWNoZSA9IG9iamVjdC5jYWNoZTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIHJlbGVhc2VPYmplY3QoY2FjaGUpO1xuICAgIH1cbiAgICBvYmplY3QuYXJyYXkgPSBvYmplY3QuY2FjaGUgPSBvYmplY3QuY3JpdGVyaWEgPSBvYmplY3Qub2JqZWN0ID0gb2JqZWN0Lm51bWJlciA9IG9iamVjdC5zdHJpbmcgPSBvYmplY3QudmFsdWUgPSBudWxsO1xuICAgIGlmIChvYmplY3RQb29sLmxlbmd0aCA8IG1heFBvb2xTaXplKSB7XG4gICAgICBvYmplY3RQb29sLnB1c2gob2JqZWN0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2xpY2VzIHRoZSBgY29sbGVjdGlvbmAgZnJvbSB0aGUgYHN0YXJ0YCBpbmRleCB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsXG4gICAqIHRoZSBgZW5kYCBpbmRleC5cbiAgICpcbiAgICogTm90ZTogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGluc3RlYWQgb2YgYEFycmF5I3NsaWNlYCB0byBzdXBwb3J0IG5vZGUgbGlzdHNcbiAgICogaW4gSUUgPCA5IGFuZCB0byBlbnN1cmUgZGVuc2UgYXJyYXlzIGFyZSByZXR1cm5lZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNsaWNlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgVGhlIHN0YXJ0IGluZGV4LlxuICAgKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoZSBlbmQgaW5kZXguXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gc2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgICBzdGFydCB8fCAoc3RhcnQgPSAwKTtcbiAgICBpZiAodHlwZW9mIGVuZCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgZW5kID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gZW5kIC0gc3RhcnQgfHwgMCxcbiAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYGxvZGFzaGAgZnVuY3Rpb24gdXNpbmcgdGhlIGdpdmVuIGNvbnRleHQgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0PXJvb3RdIFRoZSBjb250ZXh0IG9iamVjdC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIHJ1bkluQ29udGV4dChjb250ZXh0KSB7XG4gICAgLy8gQXZvaWQgaXNzdWVzIHdpdGggc29tZSBFUzMgZW52aXJvbm1lbnRzIHRoYXQgYXR0ZW1wdCB0byB1c2UgdmFsdWVzLCBuYW1lZFxuICAgIC8vIGFmdGVyIGJ1aWx0LWluIGNvbnN0cnVjdG9ycyBsaWtlIGBPYmplY3RgLCBmb3IgdGhlIGNyZWF0aW9uIG9mIGxpdGVyYWxzLlxuICAgIC8vIEVTNSBjbGVhcnMgdGhpcyB1cCBieSBzdGF0aW5nIHRoYXQgbGl0ZXJhbHMgbXVzdCB1c2UgYnVpbHQtaW4gY29uc3RydWN0b3JzLlxuICAgIC8vIFNlZSBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDExLjEuNS5cbiAgICBjb250ZXh0ID0gY29udGV4dCA/IF8uZGVmYXVsdHMocm9vdC5PYmplY3QoKSwgY29udGV4dCwgXy5waWNrKHJvb3QsIGNvbnRleHRQcm9wcykpIDogcm9vdDtcblxuICAgIC8qKiBOYXRpdmUgY29uc3RydWN0b3IgcmVmZXJlbmNlcyAqL1xuICAgIHZhciBBcnJheSA9IGNvbnRleHQuQXJyYXksXG4gICAgICAgIEJvb2xlYW4gPSBjb250ZXh0LkJvb2xlYW4sXG4gICAgICAgIERhdGUgPSBjb250ZXh0LkRhdGUsXG4gICAgICAgIEZ1bmN0aW9uID0gY29udGV4dC5GdW5jdGlvbixcbiAgICAgICAgTWF0aCA9IGNvbnRleHQuTWF0aCxcbiAgICAgICAgTnVtYmVyID0gY29udGV4dC5OdW1iZXIsXG4gICAgICAgIE9iamVjdCA9IGNvbnRleHQuT2JqZWN0LFxuICAgICAgICBSZWdFeHAgPSBjb250ZXh0LlJlZ0V4cCxcbiAgICAgICAgU3RyaW5nID0gY29udGV4dC5TdHJpbmcsXG4gICAgICAgIFR5cGVFcnJvciA9IGNvbnRleHQuVHlwZUVycm9yO1xuXG4gICAgLyoqXG4gICAgICogVXNlZCBmb3IgYEFycmF5YCBtZXRob2QgcmVmZXJlbmNlcy5cbiAgICAgKlxuICAgICAqIE5vcm1hbGx5IGBBcnJheS5wcm90b3R5cGVgIHdvdWxkIHN1ZmZpY2UsIGhvd2V2ZXIsIHVzaW5nIGFuIGFycmF5IGxpdGVyYWxcbiAgICAgKiBhdm9pZHMgaXNzdWVzIGluIE5hcndoYWwuXG4gICAgICovXG4gICAgdmFyIGFycmF5UmVmID0gW107XG5cbiAgICAvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzICovXG4gICAgdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICAgIC8qKiBVc2VkIHRvIHJlc3RvcmUgdGhlIG9yaWdpbmFsIGBfYCByZWZlcmVuY2UgaW4gYG5vQ29uZmxpY3RgICovXG4gICAgdmFyIG9sZERhc2ggPSBjb250ZXh0Ll87XG5cbiAgICAvKiogVXNlZCB0byByZXNvbHZlIHRoZSBpbnRlcm5hbCBbW0NsYXNzXV0gb2YgdmFsdWVzICovXG4gICAgdmFyIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgICAvKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlICovXG4gICAgdmFyIHJlTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gICAgICBTdHJpbmcodG9TdHJpbmcpXG4gICAgICAgIC5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpXG4gICAgICAgIC5yZXBsYWNlKC90b1N0cmluZ3wgZm9yIFteXFxdXSsvZywgJy4qPycpICsgJyQnXG4gICAgKTtcblxuICAgIC8qKiBOYXRpdmUgbWV0aG9kIHNob3J0Y3V0cyAqL1xuICAgIHZhciBjZWlsID0gTWF0aC5jZWlsLFxuICAgICAgICBjbGVhclRpbWVvdXQgPSBjb250ZXh0LmNsZWFyVGltZW91dCxcbiAgICAgICAgZmxvb3IgPSBNYXRoLmZsb29yLFxuICAgICAgICBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgICAgICBnZXRQcm90b3R5cGVPZiA9IGlzTmF0aXZlKGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKSAmJiBnZXRQcm90b3R5cGVPZixcbiAgICAgICAgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgICAgcHVzaCA9IGFycmF5UmVmLnB1c2gsXG4gICAgICAgIHNldFRpbWVvdXQgPSBjb250ZXh0LnNldFRpbWVvdXQsXG4gICAgICAgIHNwbGljZSA9IGFycmF5UmVmLnNwbGljZSxcbiAgICAgICAgdW5zaGlmdCA9IGFycmF5UmVmLnVuc2hpZnQ7XG5cbiAgICAvKiogVXNlZCB0byBzZXQgbWV0YSBkYXRhIG9uIGZ1bmN0aW9ucyAqL1xuICAgIHZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgICAgIC8vIElFIDggb25seSBhY2NlcHRzIERPTSBlbGVtZW50c1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIG8gPSB7fSxcbiAgICAgICAgICAgIGZ1bmMgPSBpc05hdGl2ZShmdW5jID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KSAmJiBmdW5jLFxuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYyhvLCBvLCBvKSAmJiBmdW5jO1xuICAgICAgfSBjYXRjaChlKSB7IH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSgpKTtcblxuICAgIC8qIE5hdGl2ZSBtZXRob2Qgc2hvcnRjdXRzIGZvciBtZXRob2RzIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzICovXG4gICAgdmFyIG5hdGl2ZUNyZWF0ZSA9IGlzTmF0aXZlKG5hdGl2ZUNyZWF0ZSA9IE9iamVjdC5jcmVhdGUpICYmIG5hdGl2ZUNyZWF0ZSxcbiAgICAgICAgbmF0aXZlSXNBcnJheSA9IGlzTmF0aXZlKG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KSAmJiBuYXRpdmVJc0FycmF5LFxuICAgICAgICBuYXRpdmVJc0Zpbml0ZSA9IGNvbnRleHQuaXNGaW5pdGUsXG4gICAgICAgIG5hdGl2ZUlzTmFOID0gY29udGV4dC5pc05hTixcbiAgICAgICAgbmF0aXZlS2V5cyA9IGlzTmF0aXZlKG5hdGl2ZUtleXMgPSBPYmplY3Qua2V5cykgJiYgbmF0aXZlS2V5cyxcbiAgICAgICAgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluLFxuICAgICAgICBuYXRpdmVQYXJzZUludCA9IGNvbnRleHQucGFyc2VJbnQsXG4gICAgICAgIG5hdGl2ZVJhbmRvbSA9IE1hdGgucmFuZG9tO1xuXG4gICAgLyoqIFVzZWQgdG8gbG9va3VwIGEgYnVpbHQtaW4gY29uc3RydWN0b3IgYnkgW1tDbGFzc11dICovXG4gICAgdmFyIGN0b3JCeUNsYXNzID0ge307XG4gICAgY3RvckJ5Q2xhc3NbYXJyYXlDbGFzc10gPSBBcnJheTtcbiAgICBjdG9yQnlDbGFzc1tib29sQ2xhc3NdID0gQm9vbGVhbjtcbiAgICBjdG9yQnlDbGFzc1tkYXRlQ2xhc3NdID0gRGF0ZTtcbiAgICBjdG9yQnlDbGFzc1tmdW5jQ2xhc3NdID0gRnVuY3Rpb247XG4gICAgY3RvckJ5Q2xhc3Nbb2JqZWN0Q2xhc3NdID0gT2JqZWN0O1xuICAgIGN0b3JCeUNsYXNzW251bWJlckNsYXNzXSA9IE51bWJlcjtcbiAgICBjdG9yQnlDbGFzc1tyZWdleHBDbGFzc10gPSBSZWdFeHA7XG4gICAgY3RvckJ5Q2xhc3Nbc3RyaW5nQ2xhc3NdID0gU3RyaW5nO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgYGxvZGFzaGAgb2JqZWN0IHdoaWNoIHdyYXBzIHRoZSBnaXZlbiB2YWx1ZSB0byBlbmFibGUgaW50dWl0aXZlXG4gICAgICogbWV0aG9kIGNoYWluaW5nLlxuICAgICAqXG4gICAgICogSW4gYWRkaXRpb24gdG8gTG8tRGFzaCBtZXRob2RzLCB3cmFwcGVycyBhbHNvIGhhdmUgdGhlIGZvbGxvd2luZyBgQXJyYXlgIG1ldGhvZHM6XG4gICAgICogYGNvbmNhdGAsIGBqb2luYCwgYHBvcGAsIGBwdXNoYCwgYHJldmVyc2VgLCBgc2hpZnRgLCBgc2xpY2VgLCBgc29ydGAsIGBzcGxpY2VgLFxuICAgICAqIGFuZCBgdW5zaGlmdGBcbiAgICAgKlxuICAgICAqIENoYWluaW5nIGlzIHN1cHBvcnRlZCBpbiBjdXN0b20gYnVpbGRzIGFzIGxvbmcgYXMgdGhlIGB2YWx1ZWAgbWV0aG9kIGlzXG4gICAgICogaW1wbGljaXRseSBvciBleHBsaWNpdGx5IGluY2x1ZGVkIGluIHRoZSBidWlsZC5cbiAgICAgKlxuICAgICAqIFRoZSBjaGFpbmFibGUgd3JhcHBlciBmdW5jdGlvbnMgYXJlOlxuICAgICAqIGBhZnRlcmAsIGBhc3NpZ25gLCBgYmluZGAsIGBiaW5kQWxsYCwgYGJpbmRLZXlgLCBgY2hhaW5gLCBgY29tcGFjdGAsXG4gICAgICogYGNvbXBvc2VgLCBgY29uY2F0YCwgYGNvdW50QnlgLCBgY3JlYXRlYCwgYGNyZWF0ZUNhbGxiYWNrYCwgYGN1cnJ5YCxcbiAgICAgKiBgZGVib3VuY2VgLCBgZGVmYXVsdHNgLCBgZGVmZXJgLCBgZGVsYXlgLCBgZGlmZmVyZW5jZWAsIGBmaWx0ZXJgLCBgZmxhdHRlbmAsXG4gICAgICogYGZvckVhY2hgLCBgZm9yRWFjaFJpZ2h0YCwgYGZvckluYCwgYGZvckluUmlnaHRgLCBgZm9yT3duYCwgYGZvck93blJpZ2h0YCxcbiAgICAgKiBgZnVuY3Rpb25zYCwgYGdyb3VwQnlgLCBgaW5kZXhCeWAsIGBpbml0aWFsYCwgYGludGVyc2VjdGlvbmAsIGBpbnZlcnRgLFxuICAgICAqIGBpbnZva2VgLCBga2V5c2AsIGBtYXBgLCBgbWF4YCwgYG1lbW9pemVgLCBgbWVyZ2VgLCBgbWluYCwgYG9iamVjdGAsIGBvbWl0YCxcbiAgICAgKiBgb25jZWAsIGBwYWlyc2AsIGBwYXJ0aWFsYCwgYHBhcnRpYWxSaWdodGAsIGBwaWNrYCwgYHBsdWNrYCwgYHB1bGxgLCBgcHVzaGAsXG4gICAgICogYHJhbmdlYCwgYHJlamVjdGAsIGByZW1vdmVgLCBgcmVzdGAsIGByZXZlcnNlYCwgYHNodWZmbGVgLCBgc2xpY2VgLCBgc29ydGAsXG4gICAgICogYHNvcnRCeWAsIGBzcGxpY2VgLCBgdGFwYCwgYHRocm90dGxlYCwgYHRpbWVzYCwgYHRvQXJyYXlgLCBgdHJhbnNmb3JtYCxcbiAgICAgKiBgdW5pb25gLCBgdW5pcWAsIGB1bnNoaWZ0YCwgYHVuemlwYCwgYHZhbHVlc2AsIGB3aGVyZWAsIGB3aXRob3V0YCwgYHdyYXBgLFxuICAgICAqIGFuZCBgemlwYFxuICAgICAqXG4gICAgICogVGhlIG5vbi1jaGFpbmFibGUgd3JhcHBlciBmdW5jdGlvbnMgYXJlOlxuICAgICAqIGBjbG9uZWAsIGBjbG9uZURlZXBgLCBgY29udGFpbnNgLCBgZXNjYXBlYCwgYGV2ZXJ5YCwgYGZpbmRgLCBgZmluZEluZGV4YCxcbiAgICAgKiBgZmluZEtleWAsIGBmaW5kTGFzdGAsIGBmaW5kTGFzdEluZGV4YCwgYGZpbmRMYXN0S2V5YCwgYGhhc2AsIGBpZGVudGl0eWAsXG4gICAgICogYGluZGV4T2ZgLCBgaXNBcmd1bWVudHNgLCBgaXNBcnJheWAsIGBpc0Jvb2xlYW5gLCBgaXNEYXRlYCwgYGlzRWxlbWVudGAsXG4gICAgICogYGlzRW1wdHlgLCBgaXNFcXVhbGAsIGBpc0Zpbml0ZWAsIGBpc0Z1bmN0aW9uYCwgYGlzTmFOYCwgYGlzTnVsbGAsIGBpc051bWJlcmAsXG4gICAgICogYGlzT2JqZWN0YCwgYGlzUGxhaW5PYmplY3RgLCBgaXNSZWdFeHBgLCBgaXNTdHJpbmdgLCBgaXNVbmRlZmluZWRgLCBgam9pbmAsXG4gICAgICogYGxhc3RJbmRleE9mYCwgYG1peGluYCwgYG5vQ29uZmxpY3RgLCBgcGFyc2VJbnRgLCBgcG9wYCwgYHJhbmRvbWAsIGByZWR1Y2VgLFxuICAgICAqIGByZWR1Y2VSaWdodGAsIGByZXN1bHRgLCBgc2hpZnRgLCBgc2l6ZWAsIGBzb21lYCwgYHNvcnRlZEluZGV4YCwgYHJ1bkluQ29udGV4dGAsXG4gICAgICogYHRlbXBsYXRlYCwgYHVuZXNjYXBlYCwgYHVuaXF1ZUlkYCwgYW5kIGB2YWx1ZWBcbiAgICAgKlxuICAgICAqIFRoZSB3cmFwcGVyIGZ1bmN0aW9ucyBgZmlyc3RgIGFuZCBgbGFzdGAgcmV0dXJuIHdyYXBwZWQgdmFsdWVzIHdoZW4gYG5gIGlzXG4gICAgICogcHJvdmlkZWQsIG90aGVyd2lzZSB0aGV5IHJldHVybiB1bndyYXBwZWQgdmFsdWVzLlxuICAgICAqXG4gICAgICogRXhwbGljaXQgY2hhaW5pbmcgY2FuIGJlIGVuYWJsZWQgYnkgdXNpbmcgdGhlIGBfLmNoYWluYCBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBfXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQGNhdGVnb3J5IENoYWluaW5nXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGBsb2Rhc2hgIGluc3RhbmNlLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYSBgbG9kYXNoYCBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHdyYXBwZWQgPSBfKFsxLCAyLCAzXSk7XG4gICAgICpcbiAgICAgKiAvLyByZXR1cm5zIGFuIHVud3JhcHBlZCB2YWx1ZVxuICAgICAqIHdyYXBwZWQucmVkdWNlKGZ1bmN0aW9uKHN1bSwgbnVtKSB7XG4gICAgICogICByZXR1cm4gc3VtICsgbnVtO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IDZcbiAgICAgKlxuICAgICAqIC8vIHJldHVybnMgYSB3cmFwcGVkIHZhbHVlXG4gICAgICogdmFyIHNxdWFyZXMgPSB3cmFwcGVkLm1hcChmdW5jdGlvbihudW0pIHtcbiAgICAgKiAgIHJldHVybiBudW0gKiBudW07XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBfLmlzQXJyYXkoc3F1YXJlcyk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNBcnJheShzcXVhcmVzLnZhbHVlKCkpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2Rhc2godmFsdWUpIHtcbiAgICAgIC8vIGRvbid0IHdyYXAgaWYgYWxyZWFkeSB3cmFwcGVkLCBldmVuIGlmIHdyYXBwZWQgYnkgYSBkaWZmZXJlbnQgYGxvZGFzaGAgY29uc3RydWN0b3JcbiAgICAgIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmICFpc0FycmF5KHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnX193cmFwcGVkX18nKSlcbiAgICAgICA/IHZhbHVlXG4gICAgICAgOiBuZXcgbG9kYXNoV3JhcHBlcih2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBmYXN0IHBhdGggZm9yIGNyZWF0aW5nIGBsb2Rhc2hgIHdyYXBwZXIgb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGBsb2Rhc2hgIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hhaW5BbGwgQSBmbGFnIHRvIGVuYWJsZSBjaGFpbmluZyBmb3IgYWxsIG1ldGhvZHNcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGEgYGxvZGFzaGAgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9kYXNoV3JhcHBlcih2YWx1ZSwgY2hhaW5BbGwpIHtcbiAgICAgIHRoaXMuX19jaGFpbl9fID0gISFjaGFpbkFsbDtcbiAgICAgIHRoaXMuX193cmFwcGVkX18gPSB2YWx1ZTtcbiAgICB9XG4gICAgLy8gZW5zdXJlIGBuZXcgbG9kYXNoV3JhcHBlcmAgaXMgYW4gaW5zdGFuY2Ugb2YgYGxvZGFzaGBcbiAgICBsb2Rhc2hXcmFwcGVyLnByb3RvdHlwZSA9IGxvZGFzaC5wcm90b3R5cGU7XG5cbiAgICAvKipcbiAgICAgKiBBbiBvYmplY3QgdXNlZCB0byBmbGFnIGVudmlyb25tZW50cyBmZWF0dXJlcy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHZhciBzdXBwb3J0ID0gbG9kYXNoLnN1cHBvcnQgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBpZiBmdW5jdGlvbnMgY2FuIGJlIGRlY29tcGlsZWQgYnkgYEZ1bmN0aW9uI3RvU3RyaW5nYFxuICAgICAqIChhbGwgYnV0IFBTMyBhbmQgb2xkZXIgT3BlcmEgbW9iaWxlIGJyb3dzZXJzICYgYXZvaWRlZCBpbiBXaW5kb3dzIDggYXBwcykuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgXy5zdXBwb3J0XG4gICAgICogQHR5cGUgYm9vbGVhblxuICAgICAqL1xuICAgIHN1cHBvcnQuZnVuY0RlY29tcCA9ICFpc05hdGl2ZShjb250ZXh0LldpblJURXJyb3IpICYmIHJlVGhpcy50ZXN0KHJ1bkluQ29udGV4dCk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgaWYgYEZ1bmN0aW9uI25hbWVgIGlzIHN1cHBvcnRlZCAoYWxsIGJ1dCBJRSkuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgXy5zdXBwb3J0XG4gICAgICogQHR5cGUgYm9vbGVhblxuICAgICAqL1xuICAgIHN1cHBvcnQuZnVuY05hbWVzID0gdHlwZW9mIEZ1bmN0aW9uLm5hbWUgPT0gJ3N0cmluZyc7XG5cbiAgICAvKipcbiAgICAgKiBCeSBkZWZhdWx0LCB0aGUgdGVtcGxhdGUgZGVsaW1pdGVycyB1c2VkIGJ5IExvLURhc2ggYXJlIHNpbWlsYXIgdG8gdGhvc2UgaW5cbiAgICAgKiBlbWJlZGRlZCBSdWJ5IChFUkIpLiBDaGFuZ2UgdGhlIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmVcbiAgICAgKiBkZWxpbWl0ZXJzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgbG9kYXNoLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVXNlZCB0byBkZXRlY3QgYGRhdGFgIHByb3BlcnR5IHZhbHVlcyB0byBiZSBIVE1MLWVzY2FwZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5nc1xuICAgICAgICogQHR5cGUgUmVnRXhwXG4gICAgICAgKi9cbiAgICAgICdlc2NhcGUnOiAvPCUtKFtcXHNcXFNdKz8pJT4vZyxcblxuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIGRldGVjdCBjb2RlIHRvIGJlIGV2YWx1YXRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzXG4gICAgICAgKiBAdHlwZSBSZWdFeHBcbiAgICAgICAqL1xuICAgICAgJ2V2YWx1YXRlJzogLzwlKFtcXHNcXFNdKz8pJT4vZyxcblxuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIGRldGVjdCBgZGF0YWAgcHJvcGVydHkgdmFsdWVzIHRvIGluamVjdC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzXG4gICAgICAgKiBAdHlwZSBSZWdFeHBcbiAgICAgICAqL1xuICAgICAgJ2ludGVycG9sYXRlJzogcmVJbnRlcnBvbGF0ZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIHJlZmVyZW5jZSB0aGUgZGF0YSBvYmplY3QgaW4gdGhlIHRlbXBsYXRlIHRleHQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5nc1xuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKi9cbiAgICAgICd2YXJpYWJsZSc6ICcnLFxuXG4gICAgICAvKipcbiAgICAgICAqIFVzZWQgdG8gaW1wb3J0IHZhcmlhYmxlcyBpbnRvIHRoZSBjb21waWxlZCB0ZW1wbGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzXG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ2ltcG9ydHMnOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5ncy5pbXBvcnRzXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICAnXyc6IGxvZGFzaFxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmJpbmRgIHRoYXQgY3JlYXRlcyB0aGUgYm91bmQgZnVuY3Rpb24gYW5kXG4gICAgICogc2V0cyBpdHMgbWV0YSBkYXRhLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBiaW5kRGF0YSBUaGUgYmluZCBkYXRhIGFycmF5LlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJvdW5kIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VCaW5kKGJpbmREYXRhKSB7XG4gICAgICB2YXIgZnVuYyA9IGJpbmREYXRhWzBdLFxuICAgICAgICAgIHBhcnRpYWxBcmdzID0gYmluZERhdGFbMl0sXG4gICAgICAgICAgdGhpc0FyZyA9IGJpbmREYXRhWzRdO1xuXG4gICAgICBmdW5jdGlvbiBib3VuZCgpIHtcbiAgICAgICAgLy8gYEZ1bmN0aW9uI2JpbmRgIHNwZWNcbiAgICAgICAgLy8gaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS4zLjQuNVxuICAgICAgICBpZiAocGFydGlhbEFyZ3MpIHtcbiAgICAgICAgICAvLyBhdm9pZCBgYXJndW1lbnRzYCBvYmplY3QgZGVvcHRpbWl6YXRpb25zIGJ5IHVzaW5nIGBzbGljZWAgaW5zdGVhZFxuICAgICAgICAgIC8vIG9mIGBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbGAgYW5kIG5vdCBhc3NpZ25pbmcgYGFyZ3VtZW50c2AgdG8gYVxuICAgICAgICAgIC8vIHZhcmlhYmxlIGFzIGEgdGVybmFyeSBleHByZXNzaW9uXG4gICAgICAgICAgdmFyIGFyZ3MgPSBzbGljZShwYXJ0aWFsQXJncyk7XG4gICAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1pbWljIHRoZSBjb25zdHJ1Y3RvcidzIGByZXR1cm5gIGJlaGF2aW9yXG4gICAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTMuMi4yXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICAvLyBlbnN1cmUgYG5ldyBib3VuZGAgaXMgYW4gaW5zdGFuY2Ugb2YgYGZ1bmNgXG4gICAgICAgICAgdmFyIHRoaXNCaW5kaW5nID0gYmFzZUNyZWF0ZShmdW5jLnByb3RvdHlwZSksXG4gICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3MgfHwgYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IHRoaXNCaW5kaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MgfHwgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHNldEJpbmREYXRhKGJvdW5kLCBiaW5kRGF0YSk7XG4gICAgICByZXR1cm4gYm91bmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIHdpdGhvdXQgYXJndW1lbnQganVnZ2xpbmcgb3Igc3VwcG9ydFxuICAgICAqIGZvciBgdGhpc0FyZ2AgYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwPWZhbHNlXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIGNsb25lcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgY2FsbGJhY2ssIHN0YWNrQSwgc3RhY2tCKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlKTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpbnNwZWN0IFtbQ2xhc3NdXVxuICAgICAgdmFyIGlzT2JqID0gaXNPYmplY3QodmFsdWUpO1xuICAgICAgaWYgKGlzT2JqKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgICAgICAgaWYgKCFjbG9uZWFibGVDbGFzc2VzW2NsYXNzTmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN0b3IgPSBjdG9yQnlDbGFzc1tjbGFzc05hbWVdO1xuICAgICAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgICAgIGNhc2UgYm9vbENsYXNzOlxuICAgICAgICAgIGNhc2UgZGF0ZUNsYXNzOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBjdG9yKCt2YWx1ZSk7XG5cbiAgICAgICAgICBjYXNlIG51bWJlckNsYXNzOlxuICAgICAgICAgIGNhc2Ugc3RyaW5nQ2xhc3M6XG4gICAgICAgICAgICByZXR1cm4gbmV3IGN0b3IodmFsdWUpO1xuXG4gICAgICAgICAgY2FzZSByZWdleHBDbGFzczpcbiAgICAgICAgICAgIHJlc3VsdCA9IGN0b3IodmFsdWUuc291cmNlLCByZUZsYWdzLmV4ZWModmFsdWUpKTtcbiAgICAgICAgICAgIHJlc3VsdC5sYXN0SW5kZXggPSB2YWx1ZS5sYXN0SW5kZXg7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgICAgIGlmIChpc0RlZXApIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBjb3JyZXNwb25kaW5nIGNsb25lXG4gICAgICAgIHZhciBpbml0ZWRTdGFjayA9ICFzdGFja0E7XG4gICAgICAgIHN0YWNrQSB8fCAoc3RhY2tBID0gZ2V0QXJyYXkoKSk7XG4gICAgICAgIHN0YWNrQiB8fCAoc3RhY2tCID0gZ2V0QXJyYXkoKSk7XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAgIGlmIChzdGFja0FbbGVuZ3RoXSA9PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YWNrQltsZW5ndGhdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBpc0FyciA/IGN0b3IodmFsdWUubGVuZ3RoKSA6IHt9O1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGlzQXJyID8gc2xpY2UodmFsdWUpIDogYXNzaWduKHt9LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICAvLyBhZGQgYXJyYXkgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgXG4gICAgICBpZiAoaXNBcnIpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdpbmRleCcpKSB7XG4gICAgICAgICAgcmVzdWx0LmluZGV4ID0gdmFsdWUuaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdpbnB1dCcpKSB7XG4gICAgICAgICAgcmVzdWx0LmlucHV0ID0gdmFsdWUuaW5wdXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGV4aXQgZm9yIHNoYWxsb3cgY2xvbmVcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICAvLyBhZGQgdGhlIHNvdXJjZSB2YWx1ZSB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHNcbiAgICAgIC8vIGFuZCBhc3NvY2lhdGUgaXQgd2l0aCBpdHMgY2xvbmVcbiAgICAgIHN0YWNrQS5wdXNoKHZhbHVlKTtcbiAgICAgIHN0YWNrQi5wdXNoKHJlc3VsdCk7XG5cbiAgICAgIC8vIHJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cylcbiAgICAgIChpc0FyciA/IGZvckVhY2ggOiBmb3JPd24pKHZhbHVlLCBmdW5jdGlvbihvYmpWYWx1ZSwga2V5KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gYmFzZUNsb25lKG9ialZhbHVlLCBpc0RlZXAsIGNhbGxiYWNrLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGluaXRlZFN0YWNrKSB7XG4gICAgICAgIHJlbGVhc2VBcnJheShzdGFja0EpO1xuICAgICAgICByZWxlYXNlQXJyYXkoc3RhY2tCKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICAgICAqIHByb3BlcnRpZXMgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvdG90eXBlIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZUNyZWF0ZShwcm90b3R5cGUsIHByb3BlcnRpZXMpIHtcbiAgICAgIHJldHVybiBpc09iamVjdChwcm90b3R5cGUpID8gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSkgOiB7fTtcbiAgICB9XG4gICAgLy8gZmFsbGJhY2sgZm9yIGJyb3dzZXJzIHdpdGhvdXQgYE9iamVjdC5jcmVhdGVgXG4gICAgaWYgKCFuYXRpdmVDcmVhdGUpIHtcbiAgICAgIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIE9iamVjdCgpIHt9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICAgICAgICBpZiAoaXNPYmplY3QocHJvdG90eXBlKSkge1xuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgT2JqZWN0O1xuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQgfHwgY29udGV4dC5PYmplY3QoKTtcbiAgICAgICAgfTtcbiAgICAgIH0oKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlQ2FsbGJhY2tgIHdpdGhvdXQgc3VwcG9ydCBmb3IgY3JlYXRpbmdcbiAgICAgKiBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja3MuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gW2Z1bmM9aWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgY2FsbGJhY2suXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGNhbGxiYWNrLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRoZSBjYWxsYmFjayBhY2NlcHRzLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VDcmVhdGVDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICAgICAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGlkZW50aXR5O1xuICAgICAgfVxuICAgICAgLy8gZXhpdCBlYXJseSBmb3Igbm8gYHRoaXNBcmdgIG9yIGFscmVhZHkgYm91bmQgYnkgYEZ1bmN0aW9uI2JpbmRgXG4gICAgICBpZiAodHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgfHwgISgncHJvdG90eXBlJyBpbiBmdW5jKSkge1xuICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgIH1cbiAgICAgIHZhciBiaW5kRGF0YSA9IGZ1bmMuX19iaW5kRGF0YV9fO1xuICAgICAgaWYgKHR5cGVvZiBiaW5kRGF0YSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAoc3VwcG9ydC5mdW5jTmFtZXMpIHtcbiAgICAgICAgICBiaW5kRGF0YSA9ICFmdW5jLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgYmluZERhdGEgPSBiaW5kRGF0YSB8fCAhc3VwcG9ydC5mdW5jRGVjb21wO1xuICAgICAgICBpZiAoIWJpbmREYXRhKSB7XG4gICAgICAgICAgdmFyIHNvdXJjZSA9IGZuVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICAgICAgICBpZiAoIXN1cHBvcnQuZnVuY05hbWVzKSB7XG4gICAgICAgICAgICBiaW5kRGF0YSA9ICFyZUZ1bmNOYW1lLnRlc3Qoc291cmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFiaW5kRGF0YSkge1xuICAgICAgICAgICAgLy8gY2hlY2tzIGlmIGBmdW5jYCByZWZlcmVuY2VzIHRoZSBgdGhpc2Aga2V5d29yZCBhbmQgc3RvcmVzIHRoZSByZXN1bHRcbiAgICAgICAgICAgIGJpbmREYXRhID0gcmVUaGlzLnRlc3Qoc291cmNlKTtcbiAgICAgICAgICAgIHNldEJpbmREYXRhKGZ1bmMsIGJpbmREYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGV4aXQgZWFybHkgaWYgdGhlcmUgYXJlIG5vIGB0aGlzYCByZWZlcmVuY2VzIG9yIGBmdW5jYCBpcyBib3VuZFxuICAgICAgaWYgKGJpbmREYXRhID09PSBmYWxzZSB8fCAoYmluZERhdGEgIT09IHRydWUgJiYgYmluZERhdGFbMV0gJiAxKSkge1xuICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoYXJnQ291bnQpIHtcbiAgICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYSwgYik7XG4gICAgICAgIH07XG4gICAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYmluZChmdW5jLCB0aGlzQXJnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgY3JlYXRlV3JhcHBlcmAgdGhhdCBjcmVhdGVzIHRoZSB3cmFwcGVyIGFuZFxuICAgICAqIHNldHMgaXRzIG1ldGEgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYmluZERhdGEgVGhlIGJpbmQgZGF0YSBhcnJheS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlQ3JlYXRlV3JhcHBlcihiaW5kRGF0YSkge1xuICAgICAgdmFyIGZ1bmMgPSBiaW5kRGF0YVswXSxcbiAgICAgICAgICBiaXRtYXNrID0gYmluZERhdGFbMV0sXG4gICAgICAgICAgcGFydGlhbEFyZ3MgPSBiaW5kRGF0YVsyXSxcbiAgICAgICAgICBwYXJ0aWFsUmlnaHRBcmdzID0gYmluZERhdGFbM10sXG4gICAgICAgICAgdGhpc0FyZyA9IGJpbmREYXRhWzRdLFxuICAgICAgICAgIGFyaXR5ID0gYmluZERhdGFbNV07XG5cbiAgICAgIHZhciBpc0JpbmQgPSBiaXRtYXNrICYgMSxcbiAgICAgICAgICBpc0JpbmRLZXkgPSBiaXRtYXNrICYgMixcbiAgICAgICAgICBpc0N1cnJ5ID0gYml0bWFzayAmIDQsXG4gICAgICAgICAgaXNDdXJyeUJvdW5kID0gYml0bWFzayAmIDgsXG4gICAgICAgICAga2V5ID0gZnVuYztcblxuICAgICAgZnVuY3Rpb24gYm91bmQoKSB7XG4gICAgICAgIHZhciB0aGlzQmluZGluZyA9IGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzO1xuICAgICAgICBpZiAocGFydGlhbEFyZ3MpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IHNsaWNlKHBhcnRpYWxBcmdzKTtcbiAgICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRpYWxSaWdodEFyZ3MgfHwgaXNDdXJyeSkge1xuICAgICAgICAgIGFyZ3MgfHwgKGFyZ3MgPSBzbGljZShhcmd1bWVudHMpKTtcbiAgICAgICAgICBpZiAocGFydGlhbFJpZ2h0QXJncykge1xuICAgICAgICAgICAgcHVzaC5hcHBseShhcmdzLCBwYXJ0aWFsUmlnaHRBcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzQ3VycnkgJiYgYXJncy5sZW5ndGggPCBhcml0eSkge1xuICAgICAgICAgICAgYml0bWFzayB8PSAxNiAmIH4zMjtcbiAgICAgICAgICAgIHJldHVybiBiYXNlQ3JlYXRlV3JhcHBlcihbZnVuYywgKGlzQ3VycnlCb3VuZCA/IGJpdG1hc2sgOiBiaXRtYXNrICYgfjMpLCBhcmdzLCBudWxsLCB0aGlzQXJnLCBhcml0eV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcmdzIHx8IChhcmdzID0gYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKGlzQmluZEtleSkge1xuICAgICAgICAgIGZ1bmMgPSB0aGlzQmluZGluZ1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICB0aGlzQmluZGluZyA9IGJhc2VDcmVhdGUoZnVuYy5wcm90b3R5cGUpO1xuICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICAgICAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IHRoaXNCaW5kaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHNldEJpbmREYXRhKGJvdW5kLCBiaW5kRGF0YSk7XG4gICAgICByZXR1cm4gYm91bmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZGlmZmVyZW5jZWAgdGhhdCBhY2NlcHRzIGEgc2luZ2xlIGFycmF5XG4gICAgICogb2YgdmFsdWVzIHRvIGV4Y2x1ZGUuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gZXhjbHVkZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VEaWZmZXJlbmNlKGFycmF5LCB2YWx1ZXMpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGluZGV4T2YgPSBnZXRJbmRleE9mKCksXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgIGlzTGFyZ2UgPSBsZW5ndGggPj0gbGFyZ2VBcnJheVNpemUgJiYgaW5kZXhPZiA9PT0gYmFzZUluZGV4T2YsXG4gICAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGNyZWF0ZUNhY2hlKHZhbHVlcyk7XG4gICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgIGluZGV4T2YgPSBjYWNoZUluZGV4T2Y7XG4gICAgICAgICAgdmFsdWVzID0gY2FjaGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNMYXJnZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgICAgIGlmIChpbmRleE9mKHZhbHVlcywgdmFsdWUpIDwgMCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzTGFyZ2UpIHtcbiAgICAgICAgcmVsZWFzZU9iamVjdCh2YWx1ZXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mbGF0dGVuYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gICAgICogc2hvcnRoYW5kcyBvciBgdGhpc0FyZ2AgYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZsYXR0ZW4uXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNTaGFsbG93PWZhbHNlXSBBIGZsYWcgdG8gcmVzdHJpY3QgZmxhdHRlbmluZyB0byBhIHNpbmdsZSBsZXZlbC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1N0cmljdD1mYWxzZV0gQSBmbGFnIHRvIHJlc3RyaWN0IGZsYXR0ZW5pbmcgdG8gYXJyYXlzIGFuZCBgYXJndW1lbnRzYCBvYmplY3RzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzdGFydCBmcm9tLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZUZsYXR0ZW4oYXJyYXksIGlzU2hhbGxvdywgaXNTdHJpY3QsIGZyb21JbmRleCkge1xuICAgICAgdmFyIGluZGV4ID0gKGZyb21JbmRleCB8fCAwKSAtIDEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09ICdudW1iZXInXG4gICAgICAgICAgICAmJiAoaXNBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cylcbiAgICAgICAgICBpZiAoIWlzU2hhbGxvdykge1xuICAgICAgICAgICAgdmFsdWUgPSBiYXNlRmxhdHRlbih2YWx1ZSwgaXNTaGFsbG93LCBpc1N0cmljdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxJbmRleCA9IC0xLFxuICAgICAgICAgICAgICB2YWxMZW5ndGggPSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICAgIHJlc0luZGV4ID0gcmVzdWx0Lmxlbmd0aDtcblxuICAgICAgICAgIHJlc3VsdC5sZW5ndGggKz0gdmFsTGVuZ3RoO1xuICAgICAgICAgIHdoaWxlICgrK3ZhbEluZGV4IDwgdmFsTGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZVt2YWxJbmRleF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFpc1N0cmljdCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCwgd2l0aG91dCBzdXBwb3J0IGZvciBgdGhpc0FyZ2AgYmluZGluZyxcbiAgICAgKiB0aGF0IGFsbG93cyBwYXJ0aWFsIFwiXy53aGVyZVwiIHN0eWxlIGNvbXBhcmlzb25zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IGEgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAgICogQHBhcmFtIHsqfSBiIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtpc1doZXJlPWZhbHNlXSBBIGZsYWcgdG8gaW5kaWNhdGUgcGVyZm9ybWluZyBwYXJ0aWFsIGNvbXBhcmlzb25zLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgYGFgIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gVHJhY2tzIHRyYXZlcnNlZCBgYmAgb2JqZWN0cy5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VJc0VxdWFsKGEsIGIsIGNhbGxiYWNrLCBpc1doZXJlLCBzdGFja0EsIHN0YWNrQikge1xuICAgICAgLy8gdXNlZCB0byBpbmRpY2F0ZSB0aGF0IHdoZW4gY29tcGFyaW5nIG9iamVjdHMsIGBhYCBoYXMgYXQgbGVhc3QgdGhlIHByb3BlcnRpZXMgb2YgYGJgXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKGEsIGIpO1xuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJldHVybiAhIXJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZXhpdCBlYXJseSBmb3IgaWRlbnRpY2FsIHZhbHVlc1xuICAgICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgLy8gdHJlYXQgYCswYCB2cy4gYC0wYCBhcyBub3QgZXF1YWxcbiAgICAgICAgcmV0dXJuIGEgIT09IDAgfHwgKDEgLyBhID09IDEgLyBiKTtcbiAgICAgIH1cbiAgICAgIHZhciB0eXBlID0gdHlwZW9mIGEsXG4gICAgICAgICAgb3RoZXJUeXBlID0gdHlwZW9mIGI7XG5cbiAgICAgIC8vIGV4aXQgZWFybHkgZm9yIHVubGlrZSBwcmltaXRpdmUgdmFsdWVzXG4gICAgICBpZiAoYSA9PT0gYSAmJlxuICAgICAgICAgICEoYSAmJiBvYmplY3RUeXBlc1t0eXBlXSkgJiZcbiAgICAgICAgICAhKGIgJiYgb2JqZWN0VHlwZXNbb3RoZXJUeXBlXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gZXhpdCBlYXJseSBmb3IgYG51bGxgIGFuZCBgdW5kZWZpbmVkYCBhdm9pZGluZyBFUzMncyBGdW5jdGlvbiNjYWxsIGJlaGF2aW9yXG4gICAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjMuNC40XG4gICAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICAgIH1cbiAgICAgIC8vIGNvbXBhcmUgW1tDbGFzc11dIG5hbWVzXG4gICAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKSxcbiAgICAgICAgICBvdGhlckNsYXNzID0gdG9TdHJpbmcuY2FsbChiKTtcblxuICAgICAgaWYgKGNsYXNzTmFtZSA9PSBhcmdzQ2xhc3MpIHtcbiAgICAgICAgY2xhc3NOYW1lID0gb2JqZWN0Q2xhc3M7XG4gICAgICB9XG4gICAgICBpZiAob3RoZXJDbGFzcyA9PSBhcmdzQ2xhc3MpIHtcbiAgICAgICAgb3RoZXJDbGFzcyA9IG9iamVjdENsYXNzO1xuICAgICAgfVxuICAgICAgaWYgKGNsYXNzTmFtZSAhPSBvdGhlckNsYXNzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNhc2UgYm9vbENsYXNzOlxuICAgICAgICBjYXNlIGRhdGVDbGFzczpcbiAgICAgICAgICAvLyBjb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWJlcnMsIGRhdGVzIHRvIG1pbGxpc2Vjb25kcyBhbmQgYm9vbGVhbnNcbiAgICAgICAgICAvLyB0byBgMWAgb3IgYDBgIHRyZWF0aW5nIGludmFsaWQgZGF0ZXMgY29lcmNlZCB0byBgTmFOYCBhcyBub3QgZXF1YWxcbiAgICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG5cbiAgICAgICAgY2FzZSBudW1iZXJDbGFzczpcbiAgICAgICAgICAvLyB0cmVhdCBgTmFOYCB2cy4gYE5hTmAgYXMgZXF1YWxcbiAgICAgICAgICByZXR1cm4gKGEgIT0gK2EpXG4gICAgICAgICAgICA/IGIgIT0gK2JcbiAgICAgICAgICAgIC8vIGJ1dCB0cmVhdCBgKzBgIHZzLiBgLTBgIGFzIG5vdCBlcXVhbFxuICAgICAgICAgICAgOiAoYSA9PSAwID8gKDEgLyBhID09IDEgLyBiKSA6IGEgPT0gK2IpO1xuXG4gICAgICAgIGNhc2UgcmVnZXhwQ2xhc3M6XG4gICAgICAgIGNhc2Ugc3RyaW5nQ2xhc3M6XG4gICAgICAgICAgLy8gY29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyAoaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS4xMC42LjQpXG4gICAgICAgICAgLy8gdHJlYXQgc3RyaW5nIHByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IGluc3RhbmNlcyBhcyBlcXVhbFxuICAgICAgICAgIHJldHVybiBhID09IFN0cmluZyhiKTtcbiAgICAgIH1cbiAgICAgIHZhciBpc0FyciA9IGNsYXNzTmFtZSA9PSBhcnJheUNsYXNzO1xuICAgICAgaWYgKCFpc0Fycikge1xuICAgICAgICAvLyB1bndyYXAgYW55IGBsb2Rhc2hgIHdyYXBwZWQgdmFsdWVzXG4gICAgICAgIHZhciBhV3JhcHBlZCA9IGhhc093blByb3BlcnR5LmNhbGwoYSwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgICAgICBiV3JhcHBlZCA9IGhhc093blByb3BlcnR5LmNhbGwoYiwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICAgICAgaWYgKGFXcmFwcGVkIHx8IGJXcmFwcGVkKSB7XG4gICAgICAgICAgcmV0dXJuIGJhc2VJc0VxdWFsKGFXcmFwcGVkID8gYS5fX3dyYXBwZWRfXyA6IGEsIGJXcmFwcGVkID8gYi5fX3dyYXBwZWRfXyA6IGIsIGNhbGxiYWNrLCBpc1doZXJlLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXhpdCBmb3IgZnVuY3Rpb25zIGFuZCBET00gbm9kZXNcbiAgICAgICAgaWYgKGNsYXNzTmFtZSAhPSBvYmplY3RDbGFzcykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBPcGVyYSwgYGFyZ3VtZW50c2Agb2JqZWN0cyBoYXZlIGBBcnJheWAgY29uc3RydWN0b3JzXG4gICAgICAgIHZhciBjdG9yQSA9IGEuY29uc3RydWN0b3IsXG4gICAgICAgICAgICBjdG9yQiA9IGIuY29uc3RydWN0b3I7XG5cbiAgICAgICAgLy8gbm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWxcbiAgICAgICAgaWYgKGN0b3JBICE9IGN0b3JCICYmXG4gICAgICAgICAgICAgICEoaXNGdW5jdGlvbihjdG9yQSkgJiYgY3RvckEgaW5zdGFuY2VvZiBjdG9yQSAmJiBpc0Z1bmN0aW9uKGN0b3JCKSAmJiBjdG9yQiBpbnN0YW5jZW9mIGN0b3JCKSAmJlxuICAgICAgICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gYXNzdW1lIGN5Y2xpYyBzdHJ1Y3R1cmVzIGFyZSBlcXVhbFxuICAgICAgLy8gdGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpYyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjFcbiAgICAgIC8vIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AgKGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMTIuMylcbiAgICAgIHZhciBpbml0ZWRTdGFjayA9ICFzdGFja0E7XG4gICAgICBzdGFja0EgfHwgKHN0YWNrQSA9IGdldEFycmF5KCkpO1xuICAgICAgc3RhY2tCIHx8IChzdGFja0IgPSBnZXRBcnJheSgpKTtcblxuICAgICAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKHN0YWNrQVtsZW5ndGhdID09IGEpIHtcbiAgICAgICAgICByZXR1cm4gc3RhY2tCW2xlbmd0aF0gPT0gYjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHNpemUgPSAwO1xuICAgICAgcmVzdWx0ID0gdHJ1ZTtcblxuICAgICAgLy8gYWRkIGBhYCBhbmQgYGJgIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0c1xuICAgICAgc3RhY2tBLnB1c2goYSk7XG4gICAgICBzdGFja0IucHVzaChiKTtcblxuICAgICAgLy8gcmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKVxuICAgICAgaWYgKGlzQXJyKSB7XG4gICAgICAgIC8vIGNvbXBhcmUgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5XG4gICAgICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgICAgICBzaXplID0gYi5sZW5ndGg7XG4gICAgICAgIHJlc3VsdCA9IHNpemUgPT0gbGVuZ3RoO1xuXG4gICAgICAgIGlmIChyZXN1bHQgfHwgaXNXaGVyZSkge1xuICAgICAgICAgIC8vIGRlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXNcbiAgICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBsZW5ndGgsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBiW3NpemVdO1xuXG4gICAgICAgICAgICBpZiAoaXNXaGVyZSkge1xuICAgICAgICAgICAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIGlmICgocmVzdWx0ID0gYmFzZUlzRXF1YWwoYVtpbmRleF0sIHZhbHVlLCBjYWxsYmFjaywgaXNXaGVyZSwgc3RhY2tBLCBzdGFja0IpKSkge1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzdWx0ID0gYmFzZUlzRXF1YWwoYVtzaXplXSwgdmFsdWUsIGNhbGxiYWNrLCBpc1doZXJlLCBzdGFja0EsIHN0YWNrQikpKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIGRlZXAgY29tcGFyZSBvYmplY3RzIHVzaW5nIGBmb3JJbmAsIGluc3RlYWQgb2YgYGZvck93bmAsIHRvIGF2b2lkIGBPYmplY3Qua2V5c2BcbiAgICAgICAgLy8gd2hpY2gsIGluIHRoaXMgY2FzZSwgaXMgbW9yZSBjb3N0bHlcbiAgICAgICAgZm9ySW4oYiwgZnVuY3Rpb24odmFsdWUsIGtleSwgYikge1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIGtleSkpIHtcbiAgICAgICAgICAgIC8vIGNvdW50IHRoZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICAgIHNpemUrKztcbiAgICAgICAgICAgIC8vIGRlZXAgY29tcGFyZSBlYWNoIHByb3BlcnR5IHZhbHVlLlxuICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGtleSkgJiYgYmFzZUlzRXF1YWwoYVtrZXldLCB2YWx1ZSwgY2FsbGJhY2ssIGlzV2hlcmUsIHN0YWNrQSwgc3RhY2tCKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVzdWx0ICYmICFpc1doZXJlKSB7XG4gICAgICAgICAgLy8gZW5zdXJlIGJvdGggb2JqZWN0cyBoYXZlIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzXG4gICAgICAgICAgZm9ySW4oYSwgZnVuY3Rpb24odmFsdWUsIGtleSwgYSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYSwga2V5KSkge1xuICAgICAgICAgICAgICAvLyBgc2l6ZWAgd2lsbCBiZSBgLTFgIGlmIGBhYCBoYXMgbW9yZSBwcm9wZXJ0aWVzIHRoYW4gYGJgXG4gICAgICAgICAgICAgIHJldHVybiAocmVzdWx0ID0gLS1zaXplID4gLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdGFja0EucG9wKCk7XG4gICAgICBzdGFja0IucG9wKCk7XG5cbiAgICAgIGlmIChpbml0ZWRTdGFjaykge1xuICAgICAgICByZWxlYXNlQXJyYXkoc3RhY2tBKTtcbiAgICAgICAgcmVsZWFzZUFycmF5KHN0YWNrQik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1lcmdlYCB3aXRob3V0IGFyZ3VtZW50IGp1Z2dsaW5nIG9yIHN1cHBvcnRcbiAgICAgKiBmb3IgYHRoaXNBcmdgIGJpbmRpbmcuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnaW5nIHByb3BlcnRpZXMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIHZhbHVlcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpIHtcbiAgICAgIChpc0FycmF5KHNvdXJjZSkgPyBmb3JFYWNoIDogZm9yT3duKShzb3VyY2UsIGZ1bmN0aW9uKHNvdXJjZSwga2V5KSB7XG4gICAgICAgIHZhciBmb3VuZCxcbiAgICAgICAgICAgIGlzQXJyLFxuICAgICAgICAgICAgcmVzdWx0ID0gc291cmNlLFxuICAgICAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgICAgICBpZiAoc291cmNlICYmICgoaXNBcnIgPSBpc0FycmF5KHNvdXJjZSkpIHx8IGlzUGxhaW5PYmplY3Qoc291cmNlKSkpIHtcbiAgICAgICAgICAvLyBhdm9pZCBtZXJnaW5nIHByZXZpb3VzbHkgbWVyZ2VkIGN5Y2xpYyBzb3VyY2VzXG4gICAgICAgICAgdmFyIHN0YWNrTGVuZ3RoID0gc3RhY2tBLmxlbmd0aDtcbiAgICAgICAgICB3aGlsZSAoc3RhY2tMZW5ndGgtLSkge1xuICAgICAgICAgICAgaWYgKChmb3VuZCA9IHN0YWNrQVtzdGFja0xlbmd0aF0gPT0gc291cmNlKSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHN0YWNrQltzdGFja0xlbmd0aF07XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICB2YXIgaXNTaGFsbG93O1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgICBpZiAoKGlzU2hhbGxvdyA9IHR5cGVvZiByZXN1bHQgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNTaGFsbG93KSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gaXNBcnJcbiAgICAgICAgICAgICAgICA/IChpc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW10pXG4gICAgICAgICAgICAgICAgOiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFkZCBgc291cmNlYCBhbmQgYXNzb2NpYXRlZCBgdmFsdWVgIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0c1xuICAgICAgICAgICAgc3RhY2tBLnB1c2goc291cmNlKTtcbiAgICAgICAgICAgIHN0YWNrQi5wdXNoKHZhbHVlKTtcblxuICAgICAgICAgICAgLy8gcmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cylcbiAgICAgICAgICAgIGlmICghaXNTaGFsbG93KSB7XG4gICAgICAgICAgICAgIGJhc2VNZXJnZSh2YWx1ZSwgc291cmNlLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gc291cmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yYW5kb21gIHdpdGhvdXQgYXJndW1lbnQganVnZ2xpbmcgb3Igc3VwcG9ydFxuICAgICAqIGZvciByZXR1cm5pbmcgZmxvYXRpbmctcG9pbnQgbnVtYmVycy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiBUaGUgbWluaW11bSBwb3NzaWJsZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4IFRoZSBtYXhpbXVtIHBvc3NpYmxlIHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYSByYW5kb20gbnVtYmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VSYW5kb20obWluLCBtYXgpIHtcbiAgICAgIHJldHVybiBtaW4gKyBmbG9vcihuYXRpdmVSYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5pcWAgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFjayBzaG9ydGhhbmRzXG4gICAgICogb3IgYHRoaXNBcmdgIGJpbmRpbmcuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU29ydGVkPWZhbHNlXSBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBgYXJyYXlgIGlzIHNvcnRlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBkdXBsaWNhdGUtdmFsdWUtZnJlZSBhcnJheS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlVW5pcShhcnJheSwgaXNTb3J0ZWQsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBpbmRleE9mID0gZ2V0SW5kZXhPZigpLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgdmFyIGlzTGFyZ2UgPSAhaXNTb3J0ZWQgJiYgbGVuZ3RoID49IGxhcmdlQXJyYXlTaXplICYmIGluZGV4T2YgPT09IGJhc2VJbmRleE9mLFxuICAgICAgICAgIHNlZW4gPSAoY2FsbGJhY2sgfHwgaXNMYXJnZSkgPyBnZXRBcnJheSgpIDogcmVzdWx0O1xuXG4gICAgICBpZiAoaXNMYXJnZSkge1xuICAgICAgICB2YXIgY2FjaGUgPSBjcmVhdGVDYWNoZShzZWVuKTtcbiAgICAgICAgaW5kZXhPZiA9IGNhY2hlSW5kZXhPZjtcbiAgICAgICAgc2VlbiA9IGNhY2hlO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICAgICAgY29tcHV0ZWQgPSBjYWxsYmFjayA/IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgYXJyYXkpIDogdmFsdWU7XG5cbiAgICAgICAgaWYgKGlzU29ydGVkXG4gICAgICAgICAgICAgID8gIWluZGV4IHx8IHNlZW5bc2Vlbi5sZW5ndGggLSAxXSAhPT0gY29tcHV0ZWRcbiAgICAgICAgICAgICAgOiBpbmRleE9mKHNlZW4sIGNvbXB1dGVkKSA8IDBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgIGlmIChjYWxsYmFjayB8fCBpc0xhcmdlKSB7XG4gICAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgIHJlbGVhc2VBcnJheShzZWVuLmFycmF5KTtcbiAgICAgICAgcmVsZWFzZU9iamVjdChzZWVuKTtcbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgcmVsZWFzZUFycmF5KHNlZW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBhZ2dyZWdhdGVzIGEgY29sbGVjdGlvbiwgY3JlYXRpbmcgYW4gb2JqZWN0IGNvbXBvc2VkXG4gICAgICogb2Yga2V5cyBnZW5lcmF0ZWQgZnJvbSB0aGUgcmVzdWx0cyBvZiBydW5uaW5nIGVhY2ggZWxlbWVudCBvZiB0aGUgY29sbGVjdGlvblxuICAgICAqIHRocm91Z2ggYSBjYWxsYmFjay4gVGhlIGdpdmVuIGBzZXR0ZXJgIGZ1bmN0aW9uIHNldHMgdGhlIGtleXMgYW5kIHZhbHVlc1xuICAgICAqIG9mIHRoZSBjb21wb3NlZCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHNldHRlciBUaGUgc2V0dGVyIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFnZ3JlZ2F0b3IgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlQWdncmVnYXRvcihzZXR0ZXIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgICAgICAgICBzZXR0ZXIocmVzdWx0LCB2YWx1ZSwgY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSwgY29sbGVjdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBzZXR0ZXIocmVzdWx0LCB2YWx1ZSwgY2FsbGJhY2sodmFsdWUsIGtleSwgY29sbGVjdGlvbiksIGNvbGxlY3Rpb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgZWl0aGVyIGN1cnJpZXMgb3IgaW52b2tlcyBgZnVuY2BcbiAgICAgKiB3aXRoIGFuIG9wdGlvbmFsIGB0aGlzYCBiaW5kaW5nIGFuZCBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBmdW5jIFRoZSBmdW5jdGlvbiBvciBtZXRob2QgbmFtZSB0byByZWZlcmVuY2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgbWV0aG9kIGZsYWdzIHRvIGNvbXBvc2UuXG4gICAgICogIFRoZSBiaXRtYXNrIG1heSBiZSBjb21wb3NlZCBvZiB0aGUgZm9sbG93aW5nIGZsYWdzOlxuICAgICAqICAxIC0gYF8uYmluZGBcbiAgICAgKiAgMiAtIGBfLmJpbmRLZXlgXG4gICAgICogIDQgLSBgXy5jdXJyeWBcbiAgICAgKiAgOCAtIGBfLmN1cnJ5YCAoYm91bmQpXG4gICAgICogIDE2IC0gYF8ucGFydGlhbGBcbiAgICAgKiAgMzIgLSBgXy5wYXJ0aWFsUmlnaHRgXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxBcmdzXSBBbiBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZVxuICAgICAqICBwcm92aWRlZCB0byB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFtwYXJ0aWFsUmlnaHRBcmdzXSBBbiBhcnJheSBvZiBhcmd1bWVudHMgdG8gYXBwZW5kIHRvIHRob3NlXG4gICAgICogIHByb3ZpZGVkIHRvIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5XSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZVdyYXBwZXIoZnVuYywgYml0bWFzaywgcGFydGlhbEFyZ3MsIHBhcnRpYWxSaWdodEFyZ3MsIHRoaXNBcmcsIGFyaXR5KSB7XG4gICAgICB2YXIgaXNCaW5kID0gYml0bWFzayAmIDEsXG4gICAgICAgICAgaXNCaW5kS2V5ID0gYml0bWFzayAmIDIsXG4gICAgICAgICAgaXNDdXJyeSA9IGJpdG1hc2sgJiA0LFxuICAgICAgICAgIGlzQ3VycnlCb3VuZCA9IGJpdG1hc2sgJiA4LFxuICAgICAgICAgIGlzUGFydGlhbCA9IGJpdG1hc2sgJiAxNixcbiAgICAgICAgICBpc1BhcnRpYWxSaWdodCA9IGJpdG1hc2sgJiAzMjtcblxuICAgICAgaWYgKCFpc0JpbmRLZXkgJiYgIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIH1cbiAgICAgIGlmIChpc1BhcnRpYWwgJiYgIXBhcnRpYWxBcmdzLmxlbmd0aCkge1xuICAgICAgICBiaXRtYXNrICY9IH4xNjtcbiAgICAgICAgaXNQYXJ0aWFsID0gcGFydGlhbEFyZ3MgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1BhcnRpYWxSaWdodCAmJiAhcGFydGlhbFJpZ2h0QXJncy5sZW5ndGgpIHtcbiAgICAgICAgYml0bWFzayAmPSB+MzI7XG4gICAgICAgIGlzUGFydGlhbFJpZ2h0ID0gcGFydGlhbFJpZ2h0QXJncyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIGJpbmREYXRhID0gZnVuYyAmJiBmdW5jLl9fYmluZERhdGFfXztcbiAgICAgIGlmIChiaW5kRGF0YSAmJiBiaW5kRGF0YSAhPT0gdHJ1ZSkge1xuICAgICAgICAvLyBjbG9uZSBgYmluZERhdGFgXG4gICAgICAgIGJpbmREYXRhID0gc2xpY2UoYmluZERhdGEpO1xuICAgICAgICBpZiAoYmluZERhdGFbMl0pIHtcbiAgICAgICAgICBiaW5kRGF0YVsyXSA9IHNsaWNlKGJpbmREYXRhWzJdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmluZERhdGFbM10pIHtcbiAgICAgICAgICBiaW5kRGF0YVszXSA9IHNsaWNlKGJpbmREYXRhWzNdKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgYHRoaXNCaW5kaW5nYCBpcyBub3QgcHJldmlvdXNseSBib3VuZFxuICAgICAgICBpZiAoaXNCaW5kICYmICEoYmluZERhdGFbMV0gJiAxKSkge1xuICAgICAgICAgIGJpbmREYXRhWzRdID0gdGhpc0FyZztcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgaWYgcHJldmlvdXNseSBib3VuZCBidXQgbm90IGN1cnJlbnRseSAoc3Vic2VxdWVudCBjdXJyaWVkIGZ1bmN0aW9ucylcbiAgICAgICAgaWYgKCFpc0JpbmQgJiYgYmluZERhdGFbMV0gJiAxKSB7XG4gICAgICAgICAgYml0bWFzayB8PSA4O1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldCBjdXJyaWVkIGFyaXR5IGlmIG5vdCB5ZXQgc2V0XG4gICAgICAgIGlmIChpc0N1cnJ5ICYmICEoYmluZERhdGFbMV0gJiA0KSkge1xuICAgICAgICAgIGJpbmREYXRhWzVdID0gYXJpdHk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXBwZW5kIHBhcnRpYWwgbGVmdCBhcmd1bWVudHNcbiAgICAgICAgaWYgKGlzUGFydGlhbCkge1xuICAgICAgICAgIHB1c2guYXBwbHkoYmluZERhdGFbMl0gfHwgKGJpbmREYXRhWzJdID0gW10pLCBwYXJ0aWFsQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXBwZW5kIHBhcnRpYWwgcmlnaHQgYXJndW1lbnRzXG4gICAgICAgIGlmIChpc1BhcnRpYWxSaWdodCkge1xuICAgICAgICAgIHVuc2hpZnQuYXBwbHkoYmluZERhdGFbM10gfHwgKGJpbmREYXRhWzNdID0gW10pLCBwYXJ0aWFsUmlnaHRBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBtZXJnZSBmbGFnc1xuICAgICAgICBiaW5kRGF0YVsxXSB8PSBiaXRtYXNrO1xuICAgICAgICByZXR1cm4gY3JlYXRlV3JhcHBlci5hcHBseShudWxsLCBiaW5kRGF0YSk7XG4gICAgICB9XG4gICAgICAvLyBmYXN0IHBhdGggZm9yIGBfLmJpbmRgXG4gICAgICB2YXIgY3JlYXRlciA9IChiaXRtYXNrID09IDEgfHwgYml0bWFzayA9PT0gMTcpID8gYmFzZUJpbmQgOiBiYXNlQ3JlYXRlV3JhcHBlcjtcbiAgICAgIHJldHVybiBjcmVhdGVyKFtmdW5jLCBiaXRtYXNrLCBwYXJ0aWFsQXJncywgcGFydGlhbFJpZ2h0QXJncywgdGhpc0FyZywgYXJpdHldKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIGJ5IGBlc2NhcGVgIHRvIGNvbnZlcnQgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2ggVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlc2NhcGVIdG1sQ2hhcihtYXRjaCkge1xuICAgICAgcmV0dXJuIGh0bWxFc2NhcGVzW21hdGNoXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBhcHByb3ByaWF0ZSBcImluZGV4T2ZcIiBmdW5jdGlvbi4gSWYgdGhlIGBfLmluZGV4T2ZgIG1ldGhvZCBpc1xuICAgICAqIGN1c3RvbWl6ZWQsIHRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGN1c3RvbSBtZXRob2QsIG90aGVyd2lzZSBpdCByZXR1cm5zXG4gICAgICogdGhlIGBiYXNlSW5kZXhPZmAgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgXCJpbmRleE9mXCIgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0SW5kZXhPZigpIHtcbiAgICAgIHZhciByZXN1bHQgPSAocmVzdWx0ID0gbG9kYXNoLmluZGV4T2YpID09PSBpbmRleE9mID8gYmFzZUluZGV4T2YgOiByZXN1bHQ7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nICYmIHJlTmF0aXZlLnRlc3QodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgYHRoaXNgIGJpbmRpbmcgZGF0YSBvbiBhIGdpdmVuIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBzZXQgZGF0YSBvbi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZSBUaGUgZGF0YSBhcnJheSB0byBzZXQuXG4gICAgICovXG4gICAgdmFyIHNldEJpbmREYXRhID0gIWRlZmluZVByb3BlcnR5ID8gbm9vcCA6IGZ1bmN0aW9uKGZ1bmMsIHZhbHVlKSB7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICBkZWZpbmVQcm9wZXJ0eShmdW5jLCAnX19iaW5kRGF0YV9fJywgZGVzY3JpcHRvcik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYGlzUGxhaW5PYmplY3RgIHdoaWNoIGNoZWNrcyBpZiBhIGdpdmVuIHZhbHVlXG4gICAgICogaXMgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLCBhc3N1bWluZyBvYmplY3RzIGNyZWF0ZWRcbiAgICAgKiBieSB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IgaGF2ZSBubyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGFuZCB0aGF0XG4gICAgICogdGhlcmUgYXJlIG5vIGBPYmplY3QucHJvdG90eXBlYCBleHRlbnNpb25zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNoaW1Jc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gICAgICB2YXIgY3RvcixcbiAgICAgICAgICByZXN1bHQ7XG5cbiAgICAgIC8vIGF2b2lkIG5vbiBPYmplY3Qgb2JqZWN0cywgYGFyZ3VtZW50c2Agb2JqZWN0cywgYW5kIERPTSBlbGVtZW50c1xuICAgICAgaWYgKCEodmFsdWUgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gb2JqZWN0Q2xhc3MpIHx8XG4gICAgICAgICAgKGN0b3IgPSB2YWx1ZS5jb25zdHJ1Y3RvciwgaXNGdW5jdGlvbihjdG9yKSAmJiAhKGN0b3IgaW5zdGFuY2VvZiBjdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gSW4gbW9zdCBlbnZpcm9ubWVudHMgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMgYXJlIGl0ZXJhdGVkIGJlZm9yZVxuICAgICAgLy8gaXRzIGluaGVyaXRlZCBwcm9wZXJ0aWVzLiBJZiB0aGUgbGFzdCBpdGVyYXRlZCBwcm9wZXJ0eSBpcyBhbiBvYmplY3Qnc1xuICAgICAgLy8gb3duIHByb3BlcnR5IHRoZW4gdGhlcmUgYXJlIG5vIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gICAgICBmb3JJbih2YWx1ZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXN1bHQgPSBrZXk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09ICd1bmRlZmluZWQnIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXNlZCBieSBgdW5lc2NhcGVgIHRvIGNvbnZlcnQgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2ggVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIHVuZXNjYXBlLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5lc2NhcGVIdG1sQ2hhcihtYXRjaCkge1xuICAgICAgcmV0dXJuIGh0bWxVbmVzY2FwZXNbbWF0Y2hdO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIChmdW5jdGlvbigpIHsgcmV0dXJuIF8uaXNBcmd1bWVudHMoYXJndW1lbnRzKTsgfSkoMSwgMiwgMyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PSAnbnVtYmVyJyAmJlxuICAgICAgICB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzQ2xhc3MgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIChmdW5jdGlvbigpIHsgcmV0dXJuIF8uaXNBcnJheShhcmd1bWVudHMpOyB9KSgpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT0gJ251bWJlcicgJiZcbiAgICAgICAgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJyYXlDbGFzcyB8fCBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmtleXNgIHdoaWNoIHByb2R1Y2VzIGFuIGFycmF5IG9mIHRoZVxuICAgICAqIGdpdmVuIG9iamVjdCdzIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAgICAgKi9cbiAgICB2YXIgc2hpbUtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHZhciBpbmRleCwgaXRlcmFibGUgPSBvYmplY3QsIHJlc3VsdCA9IFtdO1xuICAgICAgaWYgKCFpdGVyYWJsZSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGlmICghKG9iamVjdFR5cGVzW3R5cGVvZiBvYmplY3RdKSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgZm9yIChpbmRleCBpbiBpdGVyYWJsZSkge1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0ZXJhYmxlLCBpbmRleCkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBjb21wb3NlZCBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ua2V5cyh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9KTtcbiAgICAgKiAvLyA9PiBbJ29uZScsICd0d28nLCAndGhyZWUnXSAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKi9cbiAgICB2YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIHRvIGNvbnZlcnQgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzOlxuICAgICAqXG4gICAgICogVGhvdWdoIHRoZSBgPmAgY2hhcmFjdGVyIGlzIGVzY2FwZWQgZm9yIHN5bW1ldHJ5LCBjaGFyYWN0ZXJzIGxpa2UgYD5gIGFuZCBgL2BcbiAgICAgKiBkb24ndCByZXF1aXJlIGVzY2FwaW5nIGluIEhUTUwgYW5kIGhhdmUgbm8gc3BlY2lhbCBtZWFuaW5nIHVubGVzcyB0aGV5J3JlIHBhcnRcbiAgICAgKiBvZiBhIHRhZyBvciBhbiB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICogaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvYW1iaWd1b3VzLWFtcGVyc2FuZHMgKHVuZGVyIFwic2VtaS1yZWxhdGVkIGZ1biBmYWN0XCIpXG4gICAgICovXG4gICAgdmFyIGh0bWxFc2NhcGVzID0ge1xuICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgXCInXCI6ICcmIzM5OydcbiAgICB9O1xuXG4gICAgLyoqIFVzZWQgdG8gY29udmVydCBIVE1MIGVudGl0aWVzIHRvIGNoYXJhY3RlcnMgKi9cbiAgICB2YXIgaHRtbFVuZXNjYXBlcyA9IGludmVydChodG1sRXNjYXBlcyk7XG5cbiAgICAvKiogVXNlZCB0byBtYXRjaCBIVE1MIGVudGl0aWVzIGFuZCBIVE1MIGNoYXJhY3RlcnMgKi9cbiAgICB2YXIgcmVFc2NhcGVkSHRtbCA9IFJlZ0V4cCgnKCcgKyBrZXlzKGh0bWxVbmVzY2FwZXMpLmpvaW4oJ3wnKSArICcpJywgJ2cnKSxcbiAgICAgICAgcmVVbmVzY2FwZWRIdG1sID0gUmVnRXhwKCdbJyArIGtleXMoaHRtbEVzY2FwZXMpLmpvaW4oJycpICsgJ10nLCAnZycpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAgICAgKiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlcyB3aWxsIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91c1xuICAgICAqIHNvdXJjZXMuIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZCB0byBwcm9kdWNlIHRoZVxuICAgICAqIGFzc2lnbmVkIHZhbHVlcy4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHR3b1xuICAgICAqIGFyZ3VtZW50czsgKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBhbGlhcyBleHRlbmRcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZV0gVGhlIHNvdXJjZSBvYmplY3RzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25pbmcgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5hc3NpZ24oeyAnbmFtZSc6ICdmcmVkJyB9LCB7ICdlbXBsb3llcic6ICdzbGF0ZScgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJywgJ2VtcGxveWVyJzogJ3NsYXRlJyB9XG4gICAgICpcbiAgICAgKiB2YXIgZGVmYXVsdHMgPSBfLnBhcnRpYWxSaWdodChfLmFzc2lnbiwgZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgcmV0dXJuIHR5cGVvZiBhID09ICd1bmRlZmluZWQnID8gYiA6IGE7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0geyAnbmFtZSc6ICdiYXJuZXknIH07XG4gICAgICogZGVmYXVsdHMob2JqZWN0LCB7ICduYW1lJzogJ2ZyZWQnLCAnZW1wbG95ZXInOiAnc2xhdGUnIH0pO1xuICAgICAqIC8vID0+IHsgJ25hbWUnOiAnYmFybmV5JywgJ2VtcGxveWVyJzogJ3NsYXRlJyB9XG4gICAgICovXG4gICAgdmFyIGFzc2lnbiA9IGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBndWFyZCkge1xuICAgICAgdmFyIGluZGV4LCBpdGVyYWJsZSA9IG9iamVjdCwgcmVzdWx0ID0gaXRlcmFibGU7XG4gICAgICBpZiAoIWl0ZXJhYmxlKSByZXR1cm4gcmVzdWx0O1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgYXJnc0luZGV4ID0gMCxcbiAgICAgICAgICBhcmdzTGVuZ3RoID0gdHlwZW9mIGd1YXJkID09ICdudW1iZXInID8gMiA6IGFyZ3MubGVuZ3RoO1xuICAgICAgaWYgKGFyZ3NMZW5ndGggPiAzICYmIHR5cGVvZiBhcmdzW2FyZ3NMZW5ndGggLSAyXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGJhc2VDcmVhdGVDYWxsYmFjayhhcmdzWy0tYXJnc0xlbmd0aCAtIDFdLCBhcmdzW2FyZ3NMZW5ndGgtLV0sIDIpO1xuICAgICAgfSBlbHNlIGlmIChhcmdzTGVuZ3RoID4gMiAmJiB0eXBlb2YgYXJnc1thcmdzTGVuZ3RoIC0gMV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IGFyZ3NbLS1hcmdzTGVuZ3RoXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgICAgaXRlcmFibGUgPSBhcmdzW2FyZ3NJbmRleF07XG4gICAgICAgIGlmIChpdGVyYWJsZSAmJiBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdKSB7XG4gICAgICAgIHZhciBvd25JbmRleCA9IC0xLFxuICAgICAgICAgICAgb3duUHJvcHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdICYmIGtleXMoaXRlcmFibGUpLFxuICAgICAgICAgICAgbGVuZ3RoID0gb3duUHJvcHMgPyBvd25Qcm9wcy5sZW5ndGggOiAwO1xuXG4gICAgICAgIHdoaWxlICgrK293bkluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgaW5kZXggPSBvd25Qcm9wc1tvd25JbmRleF07XG4gICAgICAgICAgcmVzdWx0W2luZGV4XSA9IGNhbGxiYWNrID8gY2FsbGJhY2socmVzdWx0W2luZGV4XSwgaXRlcmFibGVbaW5kZXhdKSA6IGl0ZXJhYmxlW2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdmFsdWVgLiBJZiBgaXNEZWVwYCBpcyBgdHJ1ZWAgbmVzdGVkIG9iamVjdHMgd2lsbCBhbHNvXG4gICAgICogYmUgY2xvbmVkLCBvdGhlcndpc2UgdGhleSB3aWxsIGJlIGFzc2lnbmVkIGJ5IHJlZmVyZW5jZS4gSWYgYSBjYWxsYmFja1xuICAgICAqIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgdG8gcHJvZHVjZSB0aGUgY2xvbmVkIHZhbHVlcy4gSWYgdGhlXG4gICAgICogY2FsbGJhY2sgcmV0dXJucyBgdW5kZWZpbmVkYCBjbG9uaW5nIHdpbGwgYmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuXG4gICAgICogVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDsgKHZhbHVlKS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwPWZhbHNlXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiB2YXIgc2hhbGxvdyA9IF8uY2xvbmUoY2hhcmFjdGVycyk7XG4gICAgICogc2hhbGxvd1swXSA9PT0gY2hhcmFjdGVyc1swXTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiB2YXIgZGVlcCA9IF8uY2xvbmUoY2hhcmFjdGVycywgdHJ1ZSk7XG4gICAgICogZGVlcFswXSA9PT0gY2hhcmFjdGVyc1swXTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5taXhpbih7XG4gICAgICogICAnY2xvbmUnOiBfLnBhcnRpYWxSaWdodChfLmNsb25lLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAqICAgICByZXR1cm4gXy5pc0VsZW1lbnQodmFsdWUpID8gdmFsdWUuY2xvbmVOb2RlKGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAgKiAgIH0pXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiB2YXIgY2xvbmUgPSBfLmNsb25lKGRvY3VtZW50LmJvZHkpO1xuICAgICAqIGNsb25lLmNoaWxkTm9kZXMubGVuZ3RoO1xuICAgICAqIC8vID0+IDBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbG9uZSh2YWx1ZSwgaXNEZWVwLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgLy8gYWxsb3dzIHdvcmtpbmcgd2l0aCBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcyB3aXRob3V0IHVzaW5nIHRoZWlyIGBpbmRleGBcbiAgICAgIC8vIGFuZCBgY29sbGVjdGlvbmAgYXJndW1lbnRzIGZvciBgaXNEZWVwYCBhbmQgYGNhbGxiYWNrYFxuICAgICAgaWYgKHR5cGVvZiBpc0RlZXAgIT0gJ2Jvb2xlYW4nICYmIGlzRGVlcCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXNBcmcgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSBpc0RlZXA7XG4gICAgICAgIGlzRGVlcCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCB0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJyAmJiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZGVlcCBjbG9uZSBvZiBgdmFsdWVgLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmVcbiAgICAgKiBleGVjdXRlZCB0byBwcm9kdWNlIHRoZSBjbG9uZWQgdmFsdWVzLiBJZiB0aGUgY2FsbGJhY2sgcmV0dXJucyBgdW5kZWZpbmVkYFxuICAgICAqIGNsb25pbmcgd2lsbCBiZSBoYW5kbGVkIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvXG4gICAgICogYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OyAodmFsdWUpLlxuICAgICAqXG4gICAgICogTm90ZTogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvbiB0aGUgc3RydWN0dXJlZCBjbG9uZSBhbGdvcml0aG0uIEZ1bmN0aW9uc1xuICAgICAqIGFuZCBET00gbm9kZXMgYXJlICoqbm90KiogY2xvbmVkLiBUaGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBhcmd1bWVudHNgIG9iamVjdHMgYW5kXG4gICAgICogb2JqZWN0cyBjcmVhdGVkIGJ5IGNvbnN0cnVjdG9ycyBvdGhlciB0aGFuIGBPYmplY3RgIGFyZSBjbG9uZWQgdG8gcGxhaW4gYE9iamVjdGAgb2JqZWN0cy5cbiAgICAgKiBTZWUgaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvaW5mcmFzdHJ1Y3R1cmUuaHRtbCNpbnRlcm5hbC1zdHJ1Y3R1cmVkLWNsb25pbmctYWxnb3JpdGhtLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBkZWVwIGNsb25lLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZGVlcCBjbG9uZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogdmFyIGRlZXAgPSBfLmNsb25lRGVlcChjaGFyYWN0ZXJzKTtcbiAgICAgKiBkZWVwWzBdID09PSBjaGFyYWN0ZXJzWzBdO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiB2YXIgdmlldyA9IHtcbiAgICAgKiAgICdsYWJlbCc6ICdkb2NzJyxcbiAgICAgKiAgICdub2RlJzogZWxlbWVudFxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgY2xvbmUgPSBfLmNsb25lRGVlcCh2aWV3LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAqICAgcmV0dXJuIF8uaXNFbGVtZW50KHZhbHVlKSA/IHZhbHVlLmNsb25lTm9kZSh0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIGNsb25lLm5vZGUgPT0gdmlldy5ub2RlO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xvbmVEZWVwKHZhbHVlLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgdHJ1ZSwgdHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicgJiYgYmFzZUNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAxKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBnaXZlbiBgcHJvdG90eXBlYCBvYmplY3QuIElmIGFcbiAgICAgKiBgcHJvcGVydGllc2Agb2JqZWN0IGlzIHByb3ZpZGVkIGl0cyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGFyZSBhc3NpZ25lZFxuICAgICAqIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3RvdHlwZSBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdIFRoZSBwcm9wZXJ0aWVzIHRvIGFzc2lnbiB0byB0aGUgb2JqZWN0LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIGZ1bmN0aW9uIFNoYXBlKCkge1xuICAgICAqICAgdGhpcy54ID0gMDtcbiAgICAgKiAgIHRoaXMueSA9IDA7XG4gICAgICogfVxuICAgICAqXG4gICAgICogZnVuY3Rpb24gQ2lyY2xlKCkge1xuICAgICAqICAgU2hhcGUuY2FsbCh0aGlzKTtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBDaXJjbGUucHJvdG90eXBlID0gXy5jcmVhdGUoU2hhcGUucHJvdG90eXBlLCB7ICdjb25zdHJ1Y3Rvcic6IENpcmNsZSB9KTtcbiAgICAgKlxuICAgICAqIHZhciBjaXJjbGUgPSBuZXcgQ2lyY2xlO1xuICAgICAqIGNpcmNsZSBpbnN0YW5jZW9mIENpcmNsZTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBjaXJjbGUgaW5zdGFuY2VvZiBTaGFwZTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuICAgICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzID8gYXNzaWduKHJlc3VsdCwgcHJvcGVydGllcykgOiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gICAgICogb2JqZWN0IGZvciBhbGwgZGVzdGluYXRpb24gcHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAuIE9uY2UgYVxuICAgICAqIHByb3BlcnR5IGlzIHNldCwgYWRkaXRpb25hbCBkZWZhdWx0cyBvZiB0aGUgc2FtZSBwcm9wZXJ0eSB3aWxsIGJlIGlnbm9yZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAgICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEFsbG93cyB3b3JraW5nIHdpdGggYF8ucmVkdWNlYCB3aXRob3V0IHVzaW5nIGl0c1xuICAgICAqICBga2V5YCBhbmQgYG9iamVjdGAgYXJndW1lbnRzIGFzIHNvdXJjZXMuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0geyAnbmFtZSc6ICdiYXJuZXknIH07XG4gICAgICogXy5kZWZhdWx0cyhvYmplY3QsIHsgJ25hbWUnOiAnZnJlZCcsICdlbXBsb3llcic6ICdzbGF0ZScgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdiYXJuZXknLCAnZW1wbG95ZXInOiAnc2xhdGUnIH1cbiAgICAgKi9cbiAgICB2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgZ3VhcmQpIHtcbiAgICAgIHZhciBpbmRleCwgaXRlcmFibGUgPSBvYmplY3QsIHJlc3VsdCA9IGl0ZXJhYmxlO1xuICAgICAgaWYgKCFpdGVyYWJsZSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgIGFyZ3NJbmRleCA9IDAsXG4gICAgICAgICAgYXJnc0xlbmd0aCA9IHR5cGVvZiBndWFyZCA9PSAnbnVtYmVyJyA/IDIgOiBhcmdzLmxlbmd0aDtcbiAgICAgIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgICAgaXRlcmFibGUgPSBhcmdzW2FyZ3NJbmRleF07XG4gICAgICAgIGlmIChpdGVyYWJsZSAmJiBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdKSB7XG4gICAgICAgIHZhciBvd25JbmRleCA9IC0xLFxuICAgICAgICAgICAgb3duUHJvcHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdICYmIGtleXMoaXRlcmFibGUpLFxuICAgICAgICAgICAgbGVuZ3RoID0gb3duUHJvcHMgPyBvd25Qcm9wcy5sZW5ndGggOiAwO1xuXG4gICAgICAgIHdoaWxlICgrK293bkluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgaW5kZXggPSBvd25Qcm9wc1tvd25JbmRleF07XG4gICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHRbaW5kZXhdID09ICd1bmRlZmluZWQnKSByZXN1bHRbaW5kZXhdID0gaXRlcmFibGVbaW5kZXhdO1xuICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kSW5kZXhgIGV4Y2VwdCB0aGF0IGl0IHJldHVybnMgdGhlIGtleSBvZiB0aGVcbiAgICAgKiBmaXJzdCBlbGVtZW50IHRoYXQgcGFzc2VzIHRoZSBjYWxsYmFjayBjaGVjaywgaW5zdGVhZCBvZiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHNlYXJjaC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXJcbiAgICAgKiAgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZCB0b1xuICAgICAqICBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8dW5kZWZpbmVkfSBSZXR1cm5zIHRoZSBrZXkgb2YgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYHVuZGVmaW5lZGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0ge1xuICAgICAqICAgJ2Jhcm5leSc6IHsgICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9LFxuICAgICAqICAgJ2ZyZWQnOiB7ICAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH0sXG4gICAgICogICAncGViYmxlcyc6IHsgJ2FnZSc6IDEsICAnYmxvY2tlZCc6IGZhbHNlIH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5maW5kS2V5KGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikge1xuICAgICAqICAgcmV0dXJuIGNoci5hZ2UgPCA0MDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiAnYmFybmV5JyAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmluZEtleShjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAxIH0pO1xuICAgICAqIC8vID0+ICdwZWJibGVzJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kS2V5KGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gJ2ZyZWQnXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZEtleShvYmplY3QsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgZm9yT3duKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwga2V5LCBvYmplY3QpKSB7XG4gICAgICAgICAgcmVzdWx0ID0ga2V5O1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmluZEtleWAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50c1xuICAgICAqIG9mIGEgYGNvbGxlY3Rpb25gIGluIHRoZSBvcHBvc2l0ZSBvcmRlci5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlclxuICAgICAqICBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgICogIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge3N0cmluZ3x1bmRlZmluZWR9IFJldHVybnMgdGhlIGtleSBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSB7XG4gICAgICogICAnYmFybmV5JzogeyAgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IHRydWUgfSxcbiAgICAgKiAgICdmcmVkJzogeyAgICAnYWdlJzogNDAsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgICdwZWJibGVzJzogeyAnYWdlJzogMSwgICdibG9ja2VkJzogdHJ1ZSB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIF8uZmluZExhc3RLZXkoY2hhcmFjdGVycywgZnVuY3Rpb24oY2hyKSB7XG4gICAgICogICByZXR1cm4gY2hyLmFnZSA8IDQwO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IHJldHVybnMgYHBlYmJsZXNgLCBhc3N1bWluZyBgXy5maW5kS2V5YCByZXR1cm5zIGBiYXJuZXlgXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmRMYXN0S2V5KGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDQwIH0pO1xuICAgICAqIC8vID0+ICdmcmVkJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kTGFzdEtleShjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+ICdwZWJibGVzJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbmRMYXN0S2V5KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBmb3JPd25SaWdodChvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGtleSwgb2JqZWN0KSkge1xuICAgICAgICAgIHJlc3VsdCA9IGtleTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QsXG4gICAgICogZXhlY3V0aW5nIHRoZSBjYWxsYmFjayBmb3IgZWFjaCBwcm9wZXJ0eS4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYFxuICAgICAqIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGtleSwgb2JqZWN0KS4gQ2FsbGJhY2tzIG1heSBleGl0XG4gICAgICogaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBmdW5jdGlvbiBTaGFwZSgpIHtcbiAgICAgKiAgIHRoaXMueCA9IDA7XG4gICAgICogICB0aGlzLnkgPSAwO1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIFNoYXBlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAqICAgdGhpcy54ICs9IHg7XG4gICAgICogICB0aGlzLnkgKz0geTtcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5mb3JJbihuZXcgU2hhcGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gbG9ncyAneCcsICd5JywgYW5kICdtb3ZlJyAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKi9cbiAgICB2YXIgZm9ySW4gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGluZGV4LCBpdGVyYWJsZSA9IGNvbGxlY3Rpb24sIHJlc3VsdCA9IGl0ZXJhYmxlO1xuICAgICAgaWYgKCFpdGVyYWJsZSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGlmICghb2JqZWN0VHlwZXNbdHlwZW9mIGl0ZXJhYmxlXSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgJiYgdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFjayA6IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIGZvciAoaW5kZXggaW4gaXRlcmFibGUpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2soaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikgPT09IGZhbHNlKSByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZm9ySW5gIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHNcbiAgICAgKiBvZiBhIGBjb2xsZWN0aW9uYCBpbiB0aGUgb3Bwb3NpdGUgb3JkZXIuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogZnVuY3Rpb24gU2hhcGUoKSB7XG4gICAgICogICB0aGlzLnggPSAwO1xuICAgICAqICAgdGhpcy55ID0gMDtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBTaGFwZS5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgKiAgIHRoaXMueCArPSB4O1xuICAgICAqICAgdGhpcy55ICs9IHk7XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIF8uZm9ySW5SaWdodChuZXcgU2hhcGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gbG9ncyAnbW92ZScsICd5JywgYW5kICd4JyBhc3N1bWluZyBgXy5mb3JJbiBgIGxvZ3MgJ3gnLCAneScsIGFuZCAnbW92ZSdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmb3JJblJpZ2h0KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBwYWlycyA9IFtdO1xuXG4gICAgICBmb3JJbihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcGFpcnMucHVzaChrZXksIHZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbGVuZ3RoID0gcGFpcnMubGVuZ3RoO1xuICAgICAgY2FsbGJhY2sgPSBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayhwYWlyc1tsZW5ndGgtLV0sIHBhaXJzW2xlbmd0aF0sIG9iamVjdCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgb3ZlciBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCwgZXhlY3V0aW5nIHRoZSBjYWxsYmFja1xuICAgICAqIGZvciBlYWNoIHByb3BlcnR5LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWVcbiAgICAgKiBhcmd1bWVudHM7ICh2YWx1ZSwga2V5LCBvYmplY3QpLiBDYWxsYmFja3MgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5XG4gICAgICogZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZm9yT3duKHsgJzAnOiAnemVybycsICcxJzogJ29uZScsICdsZW5ndGgnOiAyIH0sIGZ1bmN0aW9uKG51bSwga2V5KSB7XG4gICAgICogICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IGxvZ3MgJzAnLCAnMScsIGFuZCAnbGVuZ3RoJyAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKi9cbiAgICB2YXIgZm9yT3duID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBpbmRleCwgaXRlcmFibGUgPSBjb2xsZWN0aW9uLCByZXN1bHQgPSBpdGVyYWJsZTtcbiAgICAgIGlmICghaXRlcmFibGUpIHJldHVybiByZXN1bHQ7XG4gICAgICBpZiAoIW9iamVjdFR5cGVzW3R5cGVvZiBpdGVyYWJsZV0pIHJldHVybiByZXN1bHQ7XG4gICAgICBjYWxsYmFjayA9IGNhbGxiYWNrICYmIHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnID8gY2FsbGJhY2sgOiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgICB2YXIgb3duSW5kZXggPSAtMSxcbiAgICAgICAgICAgIG93blByb3BzID0gb2JqZWN0VHlwZXNbdHlwZW9mIGl0ZXJhYmxlXSAmJiBrZXlzKGl0ZXJhYmxlKSxcbiAgICAgICAgICAgIGxlbmd0aCA9IG93blByb3BzID8gb3duUHJvcHMubGVuZ3RoIDogMDtcblxuICAgICAgICB3aGlsZSAoKytvd25JbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGluZGV4ID0gb3duUHJvcHNbb3duSW5kZXhdO1xuICAgICAgICAgIGlmIChjYWxsYmFjayhpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKSA9PT0gZmFsc2UpIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5mb3JPd25gIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHNcbiAgICAgKiBvZiBhIGBjb2xsZWN0aW9uYCBpbiB0aGUgb3Bwb3NpdGUgb3JkZXIuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5mb3JPd25SaWdodCh7ICcwJzogJ3plcm8nLCAnMSc6ICdvbmUnLCAnbGVuZ3RoJzogMiB9LCBmdW5jdGlvbihudW0sIGtleSkge1xuICAgICAqICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiBsb2dzICdsZW5ndGgnLCAnMScsIGFuZCAnMCcgYXNzdW1pbmcgYF8uZm9yT3duYCBsb2dzICcwJywgJzEnLCBhbmQgJ2xlbmd0aCdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmb3JPd25SaWdodChvYmplY3QsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgICBjYWxsYmFjayA9IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW2xlbmd0aF07XG4gICAgICAgIGlmIChjYWxsYmFjayhvYmplY3Rba2V5XSwga2V5LCBvYmplY3QpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzb3J0ZWQgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgb2YgYWxsIGVudW1lcmFibGUgcHJvcGVydGllcyxcbiAgICAgKiBvd24gYW5kIGluaGVyaXRlZCwgb2YgYG9iamVjdGAgdGhhdCBoYXZlIGZ1bmN0aW9uIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBtZXRob2RzXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgdGhhdCBoYXZlIGZ1bmN0aW9uIHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5mdW5jdGlvbnMoXyk7XG4gICAgICogLy8gPT4gWydhbGwnLCAnYW55JywgJ2JpbmQnLCAnYmluZEFsbCcsICdjbG9uZScsICdjb21wYWN0JywgJ2NvbXBvc2UnLCAuLi5dXG4gICAgICovXG4gICAgZnVuY3Rpb24gZnVuY3Rpb25zKG9iamVjdCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgZm9ySW4ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgcHJvcGVydHkgbmFtZSBleGlzdHMgYXMgYSBkaXJlY3QgcHJvcGVydHkgb2YgYG9iamVjdGAsXG4gICAgICogaW5zdGVhZCBvZiBhbiBpbmhlcml0ZWQgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBrZXkgaXMgYSBkaXJlY3QgcHJvcGVydHksIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5oYXMoeyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH0sICdiJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhcyhvYmplY3QsIGtleSkge1xuICAgICAgcmV0dXJuIG9iamVjdCA/IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpIDogZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIGludmVydGVkIGtleXMgYW5kIHZhbHVlcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW52ZXJ0LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNyZWF0ZWQgaW52ZXJ0ZWQgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmludmVydCh7ICdmaXJzdCc6ICdmcmVkJywgJ3NlY29uZCc6ICdiYXJuZXknIH0pO1xuICAgICAqIC8vID0+IHsgJ2ZyZWQnOiAnZmlyc3QnLCAnYmFybmV5JzogJ3NlY29uZCcgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludmVydChvYmplY3QpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIHByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHQgPSB7fTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0W29iamVjdFtrZXldXSA9IGtleTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBib29sZWFuIHZhbHVlLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBib29sZWFuIHZhbHVlLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNCb29sZWFuKG51bGwpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNCb29sZWFuKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlIHx8XG4gICAgICAgIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBib29sQ2xhc3MgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBkYXRlLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBkYXRlLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNEYXRlKG5ldyBEYXRlKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGRhdGVDbGFzcyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIERPTSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBET00gZWxlbWVudCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzRWxlbWVudChkb2N1bWVudC5ib2R5KTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUubm9kZVR5cGUgPT09IDEgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgZW1wdHkuIEFycmF5cywgc3RyaW5ncywgb3IgYGFyZ3VtZW50c2Agb2JqZWN0cyB3aXRoIGFcbiAgICAgKiBsZW5ndGggb2YgYDBgIGFuZCBvYmplY3RzIHdpdGggbm8gb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBhcmUgY29uc2lkZXJlZFxuICAgICAqIFwiZW1wdHlcIi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgZW1wdHksIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pc0VtcHR5KFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNFbXB0eSh7fSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc0VtcHR5KCcnKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuXG4gICAgICBpZiAoKGNsYXNzTmFtZSA9PSBhcnJheUNsYXNzIHx8IGNsYXNzTmFtZSA9PSBzdHJpbmdDbGFzcyB8fCBjbGFzc05hbWUgPT0gYXJnc0NsYXNzICkgfHxcbiAgICAgICAgICAoY2xhc3NOYW1lID09IG9iamVjdENsYXNzICYmIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgaXNGdW5jdGlvbih2YWx1ZS5zcGxpY2UpKSkge1xuICAgICAgICByZXR1cm4gIWxlbmd0aDtcbiAgICAgIH1cbiAgICAgIGZvck93bih2YWx1ZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAocmVzdWx0ID0gZmFsc2UpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAgICAgKiBlcXVpdmFsZW50IHRvIGVhY2ggb3RoZXIuIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZFxuICAgICAqIHRvIGNvbXBhcmUgdmFsdWVzLiBJZiB0aGUgY2FsbGJhY2sgcmV0dXJucyBgdW5kZWZpbmVkYCBjb21wYXJpc29ucyB3aWxsXG4gICAgICogYmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kXG4gICAgICogaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM7IChhLCBiKS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSBhIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICAgICAqIEBwYXJhbSB7Kn0gYiBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaW5nIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0geyAnbmFtZSc6ICdmcmVkJyB9O1xuICAgICAqIHZhciBjb3B5ID0geyAnbmFtZSc6ICdmcmVkJyB9O1xuICAgICAqXG4gICAgICogb2JqZWN0ID09IGNvcHk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNFcXVhbChvYmplY3QsIGNvcHkpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIHZhciB3b3JkcyA9IFsnaGVsbG8nLCAnZ29vZGJ5ZSddO1xuICAgICAqIHZhciBvdGhlcldvcmRzID0gWydoaScsICdnb29kYnllJ107XG4gICAgICpcbiAgICAgKiBfLmlzRXF1YWwod29yZHMsIG90aGVyV29yZHMsIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgIHZhciByZUdyZWV0ID0gL14oPzpoZWxsb3xoaSkkL2ksXG4gICAgICogICAgICAgYUdyZWV0ID0gXy5pc1N0cmluZyhhKSAmJiByZUdyZWV0LnRlc3QoYSksXG4gICAgICogICAgICAgYkdyZWV0ID0gXy5pc1N0cmluZyhiKSAmJiByZUdyZWV0LnRlc3QoYik7XG4gICAgICpcbiAgICAgKiAgIHJldHVybiAoYUdyZWV0IHx8IGJHcmVldCkgPyAoYUdyZWV0ID09IGJHcmVldCkgOiB1bmRlZmluZWQ7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRXF1YWwoYSwgYiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHJldHVybiBiYXNlSXNFcXVhbChhLCBiLCB0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJyAmJiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDIpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcywgb3IgY2FuIGJlIGNvZXJjZWQgdG8sIGEgZmluaXRlIG51bWJlci5cbiAgICAgKlxuICAgICAqIE5vdGU6IFRoaXMgaXMgbm90IHRoZSBzYW1lIGFzIG5hdGl2ZSBgaXNGaW5pdGVgIHdoaWNoIHdpbGwgcmV0dXJuIHRydWUgZm9yXG4gICAgICogYm9vbGVhbnMgYW5kIGVtcHR5IHN0cmluZ3MuIFNlZSBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjEuMi41LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgZmluaXRlLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNGaW5pdGUoLTEwMSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc0Zpbml0ZSgnMTAnKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzRmluaXRlKHRydWUpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLmlzRmluaXRlKCcnKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5pc0Zpbml0ZShJbmZpbml0eSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Zpbml0ZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIG5hdGl2ZUlzRmluaXRlKHZhbHVlKSAmJiAhbmF0aXZlSXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNGdW5jdGlvbihfKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBsYW5ndWFnZSB0eXBlIG9mIE9iamVjdC5cbiAgICAgKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzT2JqZWN0KHt9KTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc09iamVjdCgxKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgdmFsdWUgaXMgdGhlIEVDTUFTY3JpcHQgbGFuZ3VhZ2UgdHlwZSBvZiBPYmplY3RcbiAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4OFxuICAgICAgLy8gYW5kIGF2b2lkIGEgVjggYnVnXG4gICAgICAvLyBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxXG4gICAgICByZXR1cm4gISEodmFsdWUgJiYgb2JqZWN0VHlwZXNbdHlwZW9mIHZhbHVlXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYE5hTmAuXG4gICAgICpcbiAgICAgKiBOb3RlOiBUaGlzIGlzIG5vdCB0aGUgc2FtZSBhcyBuYXRpdmUgYGlzTmFOYCB3aGljaCB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yXG4gICAgICogYHVuZGVmaW5lZGAgYW5kIG90aGVyIG5vbi1udW1lcmljIHZhbHVlcy4gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMS4yLjQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzTmFOKE5hTik7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc05hTihuZXcgTnVtYmVyKE5hTikpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIGlzTmFOKHVuZGVmaW5lZCk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc05hTih1bmRlZmluZWQpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOYU4odmFsdWUpIHtcbiAgICAgIC8vIGBOYU5gIGFzIGEgcHJpbWl0aXZlIGlzIHRoZSBvbmx5IHZhbHVlIHRoYXQgaXMgbm90IGVxdWFsIHRvIGl0c2VsZlxuICAgICAgLy8gKHBlcmZvcm0gdGhlIFtbQ2xhc3NdXSBjaGVjayBmaXJzdCB0byBhdm9pZCBlcnJvcnMgd2l0aCBzb21lIGhvc3Qgb2JqZWN0cyBpbiBJRSlcbiAgICAgIHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgIT0gK3ZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGBudWxsYCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzTnVsbChudWxsKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzTnVsbCh1bmRlZmluZWQpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdWxsKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBudW1iZXIuXG4gICAgICpcbiAgICAgKiBOb3RlOiBgTmFOYCBpcyBjb25zaWRlcmVkIGEgbnVtYmVyLiBTZWUgaHR0cDovL2VzNS5naXRodWIuaW8vI3g4LjUuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIG51bWJlciwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzTnVtYmVyKDguNCAqIDUpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgICB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gbnVtYmVyQ2xhc3MgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBmdW5jdGlvbiBTaGFwZSgpIHtcbiAgICAgKiAgIHRoaXMueCA9IDA7XG4gICAgICogICB0aGlzLnkgPSAwO1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIF8uaXNQbGFpbk9iamVjdChuZXcgU2hhcGUpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBpc1BsYWluT2JqZWN0ID0gIWdldFByb3RvdHlwZU9mID8gc2hpbUlzUGxhaW5PYmplY3QgOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCEodmFsdWUgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gb2JqZWN0Q2xhc3MpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciB2YWx1ZU9mID0gdmFsdWUudmFsdWVPZixcbiAgICAgICAgICBvYmpQcm90byA9IGlzTmF0aXZlKHZhbHVlT2YpICYmIChvYmpQcm90byA9IGdldFByb3RvdHlwZU9mKHZhbHVlT2YpKSAmJiBnZXRQcm90b3R5cGVPZihvYmpQcm90byk7XG5cbiAgICAgIHJldHVybiBvYmpQcm90b1xuICAgICAgICA/ICh2YWx1ZSA9PSBvYmpQcm90byB8fCBnZXRQcm90b3R5cGVPZih2YWx1ZSkgPT0gb2JqUHJvdG8pXG4gICAgICAgIDogc2hpbUlzUGxhaW5PYmplY3QodmFsdWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGEgcmVndWxhciBleHByZXNzaW9uLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNSZWdFeHAoL2ZyZWQvKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNSZWdFeHAodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gcmVnZXhwQ2xhc3MgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIHN0cmluZywgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzU3RyaW5nKCdmcmVkJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8XG4gICAgICAgIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdDbGFzcyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNVbmRlZmluZWQodm9pZCAwKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXlzIGFzIGBvYmplY3RgIGFuZCB2YWx1ZXMgZ2VuZXJhdGVkIGJ5XG4gICAgICogcnVubmluZyBlYWNoIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG9mIGBvYmplY3RgIHRocm91Z2ggdGhlIGNhbGxiYWNrLlxuICAgICAqIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7XG4gICAgICogKHZhbHVlLCBrZXksIG9iamVjdCkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBvYmplY3Qgd2l0aCB2YWx1ZXMgb2YgdGhlIHJlc3VsdHMgb2YgZWFjaCBgY2FsbGJhY2tgIGV4ZWN1dGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5tYXBWYWx1ZXMoeyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzfSAsIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICogMzsgfSk7XG4gICAgICogLy8gPT4geyAnYSc6IDMsICdiJzogNiwgJ2MnOiA5IH1cbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0ge1xuICAgICAqICAgJ2ZyZWQnOiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfSxcbiAgICAgKiAgICdwZWJibGVzJzogeyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLm1hcFZhbHVlcyhjaGFyYWN0ZXJzLCAnYWdlJyk7XG4gICAgICogLy8gPT4geyAnZnJlZCc6IDQwLCAncGViYmxlcyc6IDEgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1hcFZhbHVlcyhvYmplY3QsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG5cbiAgICAgIGZvck93bihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgICAgICByZXN1bHRba2V5XSA9IGNhbGxiYWNrKHZhbHVlLCBrZXksIG9iamVjdCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVjdXJzaXZlbHkgbWVyZ2VzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgdGhlIHNvdXJjZSBvYmplY3QocyksIHRoYXRcbiAgICAgKiBkb24ndCByZXNvbHZlIHRvIGB1bmRlZmluZWRgIGludG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzXG4gICAgICogd2lsbCBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy4gSWYgYSBjYWxsYmFjayBpc1xuICAgICAqIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgdG8gcHJvZHVjZSB0aGUgbWVyZ2VkIHZhbHVlcyBvZiB0aGUgZGVzdGluYXRpb25cbiAgICAgKiBhbmQgc291cmNlIHByb3BlcnRpZXMuIElmIHRoZSBjYWxsYmFjayByZXR1cm5zIGB1bmRlZmluZWRgIG1lcmdpbmcgd2lsbFxuICAgICAqIGJlIGhhbmRsZWQgYnkgdGhlIG1ldGhvZCBpbnN0ZWFkLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZFxuICAgICAqIGludm9rZWQgd2l0aCB0d28gYXJndW1lbnRzOyAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlKS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdpbmcgcHJvcGVydGllcy5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBuYW1lcyA9IHtcbiAgICAgKiAgICdjaGFyYWN0ZXJzJzogW1xuICAgICAqICAgICB7ICduYW1lJzogJ2Jhcm5leScgfSxcbiAgICAgKiAgICAgeyAnbmFtZSc6ICdmcmVkJyB9XG4gICAgICogICBdXG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIHZhciBhZ2VzID0ge1xuICAgICAqICAgJ2NoYXJhY3RlcnMnOiBbXG4gICAgICogICAgIHsgJ2FnZSc6IDM2IH0sXG4gICAgICogICAgIHsgJ2FnZSc6IDQwIH1cbiAgICAgKiAgIF1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5tZXJnZShuYW1lcywgYWdlcyk7XG4gICAgICogLy8gPT4geyAnY2hhcmFjdGVycyc6IFt7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LCB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfV0gfVxuICAgICAqXG4gICAgICogdmFyIGZvb2QgPSB7XG4gICAgICogICAnZnJ1aXRzJzogWydhcHBsZSddLFxuICAgICAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2JlZXQnXVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgb3RoZXJGb29kID0ge1xuICAgICAqICAgJ2ZydWl0cyc6IFsnYmFuYW5hJ10sXG4gICAgICogICAndmVnZXRhYmxlcyc6IFsnY2Fycm90J11cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5tZXJnZShmb29kLCBvdGhlckZvb2QsIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgIHJldHVybiBfLmlzQXJyYXkoYSkgPyBhLmNvbmNhdChiKSA6IHVuZGVmaW5lZDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICdmcnVpdHMnOiBbJ2FwcGxlJywgJ2JhbmFuYSddLCAndmVnZXRhYmxlcyc6IFsnYmVldCcsICdjYXJyb3RdIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtZXJnZShvYmplY3QpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgIGxlbmd0aCA9IDI7XG5cbiAgICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuICAgICAgLy8gYWxsb3dzIHdvcmtpbmcgd2l0aCBgXy5yZWR1Y2VgIGFuZCBgXy5yZWR1Y2VSaWdodGAgd2l0aG91dCB1c2luZ1xuICAgICAgLy8gdGhlaXIgYGluZGV4YCBhbmQgYGNvbGxlY3Rpb25gIGFyZ3VtZW50c1xuICAgICAgaWYgKHR5cGVvZiBhcmdzWzJdICE9ICdudW1iZXInKSB7XG4gICAgICAgIGxlbmd0aCA9IGFyZ3MubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGxlbmd0aCA+IDMgJiYgdHlwZW9mIGFyZ3NbbGVuZ3RoIC0gMl0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBiYXNlQ3JlYXRlQ2FsbGJhY2soYXJnc1stLWxlbmd0aCAtIDFdLCBhcmdzW2xlbmd0aC0tXSwgMik7XG4gICAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IDIgJiYgdHlwZW9mIGFyZ3NbbGVuZ3RoIC0gMV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IGFyZ3NbLS1sZW5ndGhdO1xuICAgICAgfVxuICAgICAgdmFyIHNvdXJjZXMgPSBzbGljZShhcmd1bWVudHMsIDEsIGxlbmd0aCksXG4gICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICBzdGFja0EgPSBnZXRBcnJheSgpLFxuICAgICAgICAgIHN0YWNrQiA9IGdldEFycmF5KCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZXNbaW5kZXhdLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpO1xuICAgICAgfVxuICAgICAgcmVsZWFzZUFycmF5KHN0YWNrQSk7XG4gICAgICByZWxlYXNlQXJyYXkoc3RhY2tCKTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYG9iamVjdGAgZXhjbHVkaW5nIHRoZSBzcGVjaWZpZWQgcHJvcGVydGllcy5cbiAgICAgKiBQcm9wZXJ0eSBuYW1lcyBtYXkgYmUgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgYXJndW1lbnRzIG9yIGFzIGFycmF5cyBvZlxuICAgICAqIHByb3BlcnR5IG5hbWVzLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgZm9yIGVhY2hcbiAgICAgKiBwcm9wZXJ0eSBvZiBgb2JqZWN0YCBvbWl0dGluZyB0aGUgcHJvcGVydGllcyB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVleVxuICAgICAqIGZvci4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50cztcbiAgICAgKiAodmFsdWUsIGtleSwgb2JqZWN0KS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufC4uLnN0cmluZ3xzdHJpbmdbXX0gW2NhbGxiYWNrXSBUaGUgcHJvcGVydGllcyB0byBvbWl0IG9yIHRoZVxuICAgICAqICBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRob3V0IHRoZSBvbWl0dGVkIHByb3BlcnRpZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ub21pdCh7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfSwgJ2FnZScpO1xuICAgICAqIC8vID0+IHsgJ25hbWUnOiAnZnJlZCcgfVxuICAgICAqXG4gICAgICogXy5vbWl0KHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAqICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJztcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvbWl0KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgcHJvcHMgPSBbXTtcbiAgICAgICAgZm9ySW4ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgcHJvcHMucHVzaChrZXkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvcHMgPSBiYXNlRGlmZmVyZW5jZShwcm9wcywgYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCBmYWxzZSwgMSkpO1xuXG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIGZvckluKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gICAgICAgICAgaWYgKCFjYWxsYmFjayh2YWx1ZSwga2V5LCBvYmplY3QpKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB0d28gZGltZW5zaW9uYWwgYXJyYXkgb2YgYW4gb2JqZWN0J3Mga2V5LXZhbHVlIHBhaXJzLFxuICAgICAqIGkuZS4gYFtba2V5MSwgdmFsdWUxXSwgW2tleTIsIHZhbHVlMl1dYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIG5ldyBhcnJheSBvZiBrZXktdmFsdWUgcGFpcnMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ucGFpcnMoeyAnYmFybmV5JzogMzYsICdmcmVkJzogNDAgfSk7XG4gICAgICogLy8gPT4gW1snYmFybmV5JywgMzZdLCBbJ2ZyZWQnLCA0MF1dIChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhaXJzKG9iamVjdCkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgcHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBba2V5LCBvYmplY3Rba2V5XV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzaGFsbG93IGNsb25lIG9mIGBvYmplY3RgIGNvbXBvc2VkIG9mIHRoZSBzcGVjaWZpZWQgcHJvcGVydGllcy5cbiAgICAgKiBQcm9wZXJ0eSBuYW1lcyBtYXkgYmUgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgYXJndW1lbnRzIG9yIGFzIGFycmF5cyBvZlxuICAgICAqIHByb3BlcnR5IG5hbWVzLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgZm9yIGVhY2hcbiAgICAgKiBwcm9wZXJ0eSBvZiBgb2JqZWN0YCBwaWNraW5nIHRoZSBwcm9wZXJ0aWVzIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5XG4gICAgICogZm9yLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzO1xuICAgICAqICh2YWx1ZSwga2V5LCBvYmplY3QpLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258Li4uc3RyaW5nfHN0cmluZ1tdfSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyXG4gICAgICogIGl0ZXJhdGlvbiBvciBwcm9wZXJ0eSBuYW1lcyB0byBwaWNrLCBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBwcm9wZXJ0eVxuICAgICAqICBuYW1lcyBvciBhcnJheXMgb2YgcHJvcGVydHkgbmFtZXMuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIHBpY2tlZCBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnBpY2soeyAnbmFtZSc6ICdmcmVkJywgJ191c2VyaWQnOiAnZnJlZDEnIH0sICduYW1lJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJyB9XG4gICAgICpcbiAgICAgKiBfLnBpY2soeyAnbmFtZSc6ICdmcmVkJywgJ191c2VyaWQnOiAnZnJlZDEnIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgKiAgIHJldHVybiBrZXkuY2hhckF0KDApICE9ICdfJztcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwaWNrKG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIHByb3BzID0gYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCBmYWxzZSwgMSksXG4gICAgICAgICAgICBsZW5ndGggPSBpc09iamVjdChvYmplY3QpID8gcHJvcHMubGVuZ3RoIDogMDtcblxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIGZvckluKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBrZXksIG9iamVjdCkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYWx0ZXJuYXRpdmUgdG8gYF8ucmVkdWNlYCB0aGlzIG1ldGhvZCB0cmFuc2Zvcm1zIGBvYmplY3RgIHRvIGEgbmV3XG4gICAgICogYGFjY3VtdWxhdG9yYCBvYmplY3Qgd2hpY2ggaXMgdGhlIHJlc3VsdCBvZiBydW5uaW5nIGVhY2ggb2YgaXRzIG93blxuICAgICAqIGVudW1lcmFibGUgcHJvcGVydGllcyB0aHJvdWdoIGEgY2FsbGJhY2ssIHdpdGggZWFjaCBjYWxsYmFjayBleGVjdXRpb25cbiAgICAgKiBwb3RlbnRpYWxseSBtdXRhdGluZyB0aGUgYGFjY3VtdWxhdG9yYCBvYmplY3QuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0b1xuICAgICAqIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOyAoYWNjdW11bGF0b3IsIHZhbHVlLCBrZXksIG9iamVjdCkuXG4gICAgICogQ2FsbGJhY2tzIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBUaGUgY3VzdG9tIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHNxdWFyZXMgPSBfLnRyYW5zZm9ybShbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTBdLCBmdW5jdGlvbihyZXN1bHQsIG51bSkge1xuICAgICAqICAgbnVtICo9IG51bTtcbiAgICAgKiAgIGlmIChudW0gJSAyKSB7XG4gICAgICogICAgIHJldHVybiByZXN1bHQucHVzaChudW0pIDwgMztcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiBbMSwgOSwgMjVdXG4gICAgICpcbiAgICAgKiB2YXIgbWFwcGVkID0gXy50cmFuc2Zvcm0oeyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH0sIGZ1bmN0aW9uKHJlc3VsdCwgbnVtLCBrZXkpIHtcbiAgICAgKiAgIHJlc3VsdFtrZXldID0gbnVtICogMztcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICdhJzogMywgJ2InOiA2LCAnYyc6IDkgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybShvYmplY3QsIGNhbGxiYWNrLCBhY2N1bXVsYXRvciwgdGhpc0FyZykge1xuICAgICAgdmFyIGlzQXJyID0gaXNBcnJheShvYmplY3QpO1xuICAgICAgaWYgKGFjY3VtdWxhdG9yID09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzQXJyKSB7XG4gICAgICAgICAgYWNjdW11bGF0b3IgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgY3RvciA9IG9iamVjdCAmJiBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgICAgICAgIHByb3RvID0gY3RvciAmJiBjdG9yLnByb3RvdHlwZTtcblxuICAgICAgICAgIGFjY3VtdWxhdG9yID0gYmFzZUNyZWF0ZShwcm90byk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgNCk7XG4gICAgICAgIChpc0FyciA/IGZvckVhY2ggOiBmb3JPd24pKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgb2JqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBjb21wb3NlZCBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgdmFsdWVzIG9mIGBvYmplY3RgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgcHJvcGVydHkgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnZhbHVlcyh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9KTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgM10gKHByb3BlcnR5IG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkIGFjcm9zcyBlbnZpcm9ubWVudHMpXG4gICAgICovXG4gICAgZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgcHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBvYmplY3RbcHJvcHNbaW5kZXhdXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzIGZyb20gdGhlIHNwZWNpZmllZCBpbmRleGVzLCBvciBrZXlzLCBvZiB0aGVcbiAgICAgKiBgY29sbGVjdGlvbmAuIEluZGV4ZXMgbWF5IGJlIHNwZWNpZmllZCBhcyBpbmRpdmlkdWFsIGFyZ3VtZW50cyBvciBhcyBhcnJheXNcbiAgICAgKiBvZiBpbmRleGVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0gey4uLihudW1iZXJ8bnVtYmVyW118c3RyaW5nfHN0cmluZ1tdKX0gW2luZGV4XSBUaGUgaW5kZXhlcyBvZiBgY29sbGVjdGlvbmBcbiAgICAgKiAgIHRvIHJldHJpZXZlLCBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBpbmRleGVzIG9yIGFycmF5cyBvZiBpbmRleGVzLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBlbGVtZW50cyBjb3JyZXNwb25kaW5nIHRvIHRoZVxuICAgICAqICBwcm92aWRlZCBpbmRleGVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmF0KFsnYScsICdiJywgJ2MnLCAnZCcsICdlJ10sIFswLCAyLCA0XSk7XG4gICAgICogLy8gPT4gWydhJywgJ2MnLCAnZSddXG4gICAgICpcbiAgICAgKiBfLmF0KFsnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcyddLCAwLCAyKTtcbiAgICAgKiAvLyA9PiBbJ2ZyZWQnLCAncGViYmxlcyddXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXQoY29sbGVjdGlvbikge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICBwcm9wcyA9IGJhc2VGbGF0dGVuKGFyZ3MsIHRydWUsIGZhbHNlLCAxKSxcbiAgICAgICAgICBsZW5ndGggPSAoYXJnc1syXSAmJiBhcmdzWzJdW2FyZ3NbMV1dID09PSBjb2xsZWN0aW9uKSA/IDEgOiBwcm9wcy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgICAgd2hpbGUoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gY29sbGVjdGlvbltwcm9wc1tpbmRleF1dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSBnaXZlbiB2YWx1ZSBpcyBwcmVzZW50IGluIGEgY29sbGVjdGlvbiB1c2luZyBzdHJpY3QgZXF1YWxpdHlcbiAgICAgKiBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuIElmIGBmcm9tSW5kZXhgIGlzIG5lZ2F0aXZlLCBpdCBpcyB1c2VkIGFzIHRoZVxuICAgICAqIG9mZnNldCBmcm9tIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgaW5jbHVkZVxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHsqfSB0YXJnZXQgVGhlIHZhbHVlIHRvIGNoZWNrIGZvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdGFyZ2V0YCBlbGVtZW50IGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uY29udGFpbnMoWzEsIDIsIDNdLCAxKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmNvbnRhaW5zKFsxLCAyLCAzXSwgMSwgMik7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uY29udGFpbnMoeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH0sICdmcmVkJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5jb250YWlucygncGViYmxlcycsICdlYicpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb250YWlucyhjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleCkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgaW5kZXhPZiA9IGdldEluZGV4T2YoKSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICBmcm9tSW5kZXggPSAoZnJvbUluZGV4IDwgMCA/IG5hdGl2ZU1heCgwLCBsZW5ndGggKyBmcm9tSW5kZXgpIDogZnJvbUluZGV4KSB8fCAwO1xuICAgICAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgcmVzdWx0ID0gaW5kZXhPZihjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleCkgPiAtMTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICByZXN1bHQgPSAoaXNTdHJpbmcoY29sbGVjdGlvbikgPyBjb2xsZWN0aW9uLmluZGV4T2YodGFyZ2V0LCBmcm9tSW5kZXgpIDogaW5kZXhPZihjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleCkpID4gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoKytpbmRleCA+PSBmcm9tSW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiAhKHJlc3VsdCA9IHZhbHVlID09PSB0YXJnZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIGtleXMgZ2VuZXJhdGVkIGZyb20gdGhlIHJlc3VsdHMgb2YgcnVubmluZ1xuICAgICAqIGVhY2ggZWxlbWVudCBvZiBgY29sbGVjdGlvbmAgdGhyb3VnaCB0aGUgY2FsbGJhY2suIFRoZSBjb3JyZXNwb25kaW5nIHZhbHVlXG4gICAgICogb2YgZWFjaCBrZXkgaXMgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUga2V5IHdhcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2suXG4gICAgICogVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50cztcbiAgICAgKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb21wb3NlZCBhZ2dyZWdhdGUgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmNvdW50QnkoWzQuMywgNi4xLCA2LjRdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIE1hdGguZmxvb3IobnVtKTsgfSk7XG4gICAgICogLy8gPT4geyAnNCc6IDEsICc2JzogMiB9XG4gICAgICpcbiAgICAgKiBfLmNvdW50QnkoWzQuMywgNi4xLCA2LjRdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIHRoaXMuZmxvb3IobnVtKTsgfSwgTWF0aCk7XG4gICAgICogLy8gPT4geyAnNCc6IDEsICc2JzogMiB9XG4gICAgICpcbiAgICAgKiBfLmNvdW50QnkoWydvbmUnLCAndHdvJywgJ3RocmVlJ10sICdsZW5ndGgnKTtcbiAgICAgKiAvLyA9PiB7ICczJzogMiwgJzUnOiAxIH1cbiAgICAgKi9cbiAgICB2YXIgY291bnRCeSA9IGNyZWF0ZUFnZ3JlZ2F0b3IoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgICAoaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSsrIDogcmVzdWx0W2tleV0gPSAxKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gY2FsbGJhY2sgcmV0dXJucyB0cnVleSB2YWx1ZSBmb3IgKiphbGwqKiBlbGVtZW50cyBvZlxuICAgICAqIGEgY29sbGVjdGlvbi4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlXG4gICAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBhbGxcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFsbCBlbGVtZW50cyBwYXNzZWQgdGhlIGNhbGxiYWNrIGNoZWNrLFxuICAgICAqICBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZXZlcnkoW3RydWUsIDEsIG51bGwsICd5ZXMnXSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5ldmVyeShjaGFyYWN0ZXJzLCAnYWdlJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5ldmVyeShjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAzNiB9KTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGV2ZXJ5KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSAhIWNhbGxiYWNrKGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gKHJlc3VsdCA9ICEhY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGFsbCBlbGVtZW50c1xuICAgICAqIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5IGZvci4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmRcbiAgICAgKiBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBzZWxlY3RcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgcGFzc2VkIHRoZSBjYWxsYmFjayBjaGVjay5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGV2ZW5zID0gXy5maWx0ZXIoWzEsIDIsIDMsIDQsIDUsIDZdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIG51bSAlIDIgPT0gMDsgfSk7XG4gICAgICogLy8gPT4gWzIsIDQsIDZdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maWx0ZXIoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfV1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmlsdGVyKGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDM2IH0pO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlcihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuXG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBmaXJzdCBlbGVtZW50IHRoYXRcbiAgICAgKiB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVleSBmb3IuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kXG4gICAgICogaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgZGV0ZWN0LCBmaW5kV2hlcmVcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYHVuZGVmaW5lZGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAsICdibG9ja2VkJzogdHJ1ZSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEsICAnYmxvY2tlZCc6IGZhbHNlIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5maW5kKGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikge1xuICAgICAqICAgcmV0dXJuIGNoci5hZ2UgPCA0MDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmQoY2hhcmFjdGVycywgeyAnYWdlJzogMSB9KTtcbiAgICAgKiAvLyA9PiAgeyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEsICdibG9ja2VkJzogZmFsc2UgfVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kKGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbmQoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBjb2xsZWN0aW9uW2luZGV4XTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgZm9yT3duKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmluZGAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50c1xuICAgICAqIG9mIGEgYGNvbGxlY3Rpb25gIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5maW5kTGFzdChbMSwgMiwgMywgNF0sIGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSAlIDIgPT0gMTtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiAzXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZExhc3QoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBmb3JFYWNoUmlnaHQoY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBhIGNvbGxlY3Rpb24sIGV4ZWN1dGluZyB0aGUgY2FsbGJhY2sgZm9yIGVhY2hcbiAgICAgKiBlbGVtZW50LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzO1xuICAgICAqICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS4gQ2FsbGJhY2tzIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieVxuICAgICAqIGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBOb3RlOiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBgbGVuZ3RoYCBwcm9wZXJ0eVxuICAgICAqIGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciBgXy5mb3JJbmAgb3IgYF8uZm9yT3duYFxuICAgICAqIG1heSBiZSB1c2VkIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGVhY2hcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXyhbMSwgMiwgM10pLmZvckVhY2goZnVuY3Rpb24obnVtKSB7IGNvbnNvbGUubG9nKG51bSk7IH0pLmpvaW4oJywnKTtcbiAgICAgKiAvLyA9PiBsb2dzIGVhY2ggbnVtYmVyIGFuZCByZXR1cm5zICcxLDIsMydcbiAgICAgKlxuICAgICAqIF8uZm9yRWFjaCh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9LCBmdW5jdGlvbihudW0pIHsgY29uc29sZS5sb2cobnVtKTsgfSk7XG4gICAgICogLy8gPT4gbG9ncyBlYWNoIG51bWJlciBhbmQgcmV0dXJucyB0aGUgb2JqZWN0IChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG5cbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgJiYgdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFjayA6IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGlmIChjYWxsYmFjayhjb2xsZWN0aW9uW2luZGV4XSwgaW5kZXgsIGNvbGxlY3Rpb24pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5mb3JFYWNoYCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIGVsZW1lbnRzXG4gICAgICogb2YgYSBgY29sbGVjdGlvbmAgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGVhY2hSaWdodFxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fE9iamVjdHxzdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfKFsxLCAyLCAzXSkuZm9yRWFjaFJpZ2h0KGZ1bmN0aW9uKG51bSkgeyBjb25zb2xlLmxvZyhudW0pOyB9KS5qb2luKCcsJyk7XG4gICAgICogLy8gPT4gbG9ncyBlYWNoIG51bWJlciBmcm9tIHJpZ2h0IHRvIGxlZnQgYW5kIHJldHVybnMgJzMsMiwxJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvckVhY2hSaWdodChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG4gICAgICBjYWxsYmFjayA9IGNhbGxiYWNrICYmIHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnID8gY2FsbGJhY2sgOiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKGNvbGxlY3Rpb25bbGVuZ3RoXSwgbGVuZ3RoLCBjb2xsZWN0aW9uKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHByb3BzID0ga2V5cyhjb2xsZWN0aW9uKTtcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSwgY29sbGVjdGlvbikge1xuICAgICAgICAgIGtleSA9IHByb3BzID8gcHJvcHNbLS1sZW5ndGhdIDogLS1sZW5ndGg7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNvbGxlY3Rpb25ba2V5XSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiBrZXlzIGdlbmVyYXRlZCBmcm9tIHRoZSByZXN1bHRzIG9mIHJ1bm5pbmdcbiAgICAgKiBlYWNoIGVsZW1lbnQgb2YgYSBjb2xsZWN0aW9uIHRocm91Z2ggdGhlIGNhbGxiYWNrLiBUaGUgY29ycmVzcG9uZGluZyB2YWx1ZVxuICAgICAqIG9mIGVhY2gga2V5IGlzIGFuIGFycmF5IG9mIHRoZSBlbGVtZW50cyByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyB0aGUga2V5LlxuICAgICAqIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7XG4gICAgICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWBcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb21wb3NlZCBhZ2dyZWdhdGUgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmdyb3VwQnkoWzQuMiwgNi4xLCA2LjRdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIE1hdGguZmxvb3IobnVtKTsgfSk7XG4gICAgICogLy8gPT4geyAnNCc6IFs0LjJdLCAnNic6IFs2LjEsIDYuNF0gfVxuICAgICAqXG4gICAgICogXy5ncm91cEJ5KFs0LjIsIDYuMSwgNi40XSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiB0aGlzLmZsb29yKG51bSk7IH0sIE1hdGgpO1xuICAgICAqIC8vID0+IHsgJzQnOiBbNC4yXSwgJzYnOiBbNi4xLCA2LjRdIH1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZ3JvdXBCeShbJ29uZScsICd0d28nLCAndGhyZWUnXSwgJ2xlbmd0aCcpO1xuICAgICAqIC8vID0+IHsgJzMnOiBbJ29uZScsICd0d28nXSwgJzUnOiBbJ3RocmVlJ10gfVxuICAgICAqL1xuICAgIHZhciBncm91cEJ5ID0gY3JlYXRlQWdncmVnYXRvcihmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICAgIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldIDogcmVzdWx0W2tleV0gPSBbXSkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiBrZXlzIGdlbmVyYXRlZCBmcm9tIHRoZSByZXN1bHRzIG9mIHJ1bm5pbmdcbiAgICAgKiBlYWNoIGVsZW1lbnQgb2YgdGhlIGNvbGxlY3Rpb24gdGhyb3VnaCB0aGUgZ2l2ZW4gY2FsbGJhY2suIFRoZSBjb3JyZXNwb25kaW5nXG4gICAgICogdmFsdWUgb2YgZWFjaCBrZXkgaXMgdGhlIGxhc3QgZWxlbWVudCByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyB0aGUga2V5LlxuICAgICAqIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7XG4gICAgICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29tcG9zZWQgYWdncmVnYXRlIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGtleXMgPSBbXG4gICAgICogICB7ICdkaXInOiAnbGVmdCcsICdjb2RlJzogOTcgfSxcbiAgICAgKiAgIHsgJ2Rpcic6ICdyaWdodCcsICdjb2RlJzogMTAwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5pbmRleEJ5KGtleXMsICdkaXInKTtcbiAgICAgKiAvLyA9PiB7ICdsZWZ0JzogeyAnZGlyJzogJ2xlZnQnLCAnY29kZSc6IDk3IH0sICdyaWdodCc6IHsgJ2Rpcic6ICdyaWdodCcsICdjb2RlJzogMTAwIH0gfVxuICAgICAqXG4gICAgICogXy5pbmRleEJ5KGtleXMsIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShrZXkuY29kZSk7IH0pO1xuICAgICAqIC8vID0+IHsgJ2EnOiB7ICdkaXInOiAnbGVmdCcsICdjb2RlJzogOTcgfSwgJ2QnOiB7ICdkaXInOiAncmlnaHQnLCAnY29kZSc6IDEwMCB9IH1cbiAgICAgKlxuICAgICAqIF8uaW5kZXhCeShjaGFyYWN0ZXJzLCBmdW5jdGlvbihrZXkpIHsgdGhpcy5mcm9tQ2hhckNvZGUoa2V5LmNvZGUpOyB9LCBTdHJpbmcpO1xuICAgICAqIC8vID0+IHsgJ2EnOiB7ICdkaXInOiAnbGVmdCcsICdjb2RlJzogOTcgfSwgJ2QnOiB7ICdkaXInOiAncmlnaHQnLCAnY29kZSc6IDEwMCB9IH1cbiAgICAgKi9cbiAgICB2YXIgaW5kZXhCeSA9IGNyZWF0ZUFnZ3JlZ2F0b3IoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyB0aGUgbWV0aG9kIG5hbWVkIGJ5IGBtZXRob2ROYW1lYCBvbiBlYWNoIGVsZW1lbnQgaW4gdGhlIGBjb2xsZWN0aW9uYFxuICAgICAqIHJldHVybmluZyBhbiBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGludm9rZWQgbWV0aG9kLiBBZGRpdGlvbmFsIGFyZ3VtZW50c1xuICAgICAqIHdpbGwgYmUgcHJvdmlkZWQgdG8gZWFjaCBpbnZva2VkIG1ldGhvZC4gSWYgYG1ldGhvZE5hbWVgIGlzIGEgZnVuY3Rpb24gaXRcbiAgICAgKiB3aWxsIGJlIGludm9rZWQgZm9yLCBhbmQgYHRoaXNgIGJvdW5kIHRvLCBlYWNoIGVsZW1lbnQgaW4gdGhlIGBjb2xsZWN0aW9uYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBpbnZva2Ugb3JcbiAgICAgKiAgdGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0gey4uLip9IFthcmddIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIG1ldGhvZCB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGludm9rZWQgbWV0aG9kLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmludm9rZShbWzUsIDEsIDddLCBbMywgMiwgMV1dLCAnc29ydCcpO1xuICAgICAqIC8vID0+IFtbMSwgNSwgN10sIFsxLCAyLCAzXV1cbiAgICAgKlxuICAgICAqIF8uaW52b2tlKFsxMjMsIDQ1Nl0sIFN0cmluZy5wcm90b3R5cGUuc3BsaXQsICcnKTtcbiAgICAgKiAvLyA9PiBbWycxJywgJzInLCAnMyddLCBbJzQnLCAnNScsICc2J11dXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52b2tlKGNvbGxlY3Rpb24sIG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBhcmdzID0gc2xpY2UoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIGlzRnVuYyA9IHR5cGVvZiBtZXRob2ROYW1lID09ICdmdW5jdGlvbicsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBBcnJheSh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInID8gbGVuZ3RoIDogMCk7XG5cbiAgICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmVzdWx0WysraW5kZXhdID0gKGlzRnVuYyA/IG1ldGhvZE5hbWUgOiB2YWx1ZVttZXRob2ROYW1lXSkuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdmFsdWVzIGJ5IHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uXG4gICAgICogdGhyb3VnaCB0aGUgY2FsbGJhY2suIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aFxuICAgICAqIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgY29sbGVjdFxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgdGhlIHJlc3VsdHMgb2YgZWFjaCBgY2FsbGJhY2tgIGV4ZWN1dGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5tYXAoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIG51bSAqIDM7IH0pO1xuICAgICAqIC8vID0+IFszLCA2LCA5XVxuICAgICAqXG4gICAgICogXy5tYXAoeyAnb25lJzogMSwgJ3R3byc6IDIsICd0aHJlZSc6IDMgfSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBudW0gKiAzOyB9KTtcbiAgICAgKiAvLyA9PiBbMywgNiwgOV0gKHByb3BlcnR5IG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkIGFjcm9zcyBlbnZpcm9ubWVudHMpXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubWFwKGNoYXJhY3RlcnMsICduYW1lJyk7XG4gICAgICogLy8gPT4gWydiYXJuZXknLCAnZnJlZCddXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFwKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuXG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICByZXN1bHRbaW5kZXhdID0gY2FsbGJhY2soY29sbGVjdGlvbltpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgcmVzdWx0WysraW5kZXhdID0gY2FsbGJhY2sodmFsdWUsIGtleSwgY29sbGVjdGlvbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIG1heGltdW0gdmFsdWUgb2YgYSBjb2xsZWN0aW9uLiBJZiB0aGUgY29sbGVjdGlvbiBpcyBlbXB0eSBvclxuICAgICAqIGZhbHNleSBgLUluZmluaXR5YCBpcyByZXR1cm5lZC4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkXG4gICAgICogZm9yIGVhY2ggdmFsdWUgaW4gdGhlIGNvbGxlY3Rpb24gdG8gZ2VuZXJhdGUgdGhlIGNyaXRlcmlvbiBieSB3aGljaCB0aGUgdmFsdWVcbiAgICAgKiBpcyByYW5rZWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgICAqIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWF4aW11bSB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5tYXgoWzQsIDIsIDgsIDZdKTtcbiAgICAgKiAvLyA9PiA4XG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8ubWF4KGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikgeyByZXR1cm4gY2hyLmFnZTsgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLm1heChjaGFyYWN0ZXJzLCAnYWdlJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH07XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWF4KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgICAgcmVzdWx0ID0gY29tcHV0ZWQ7XG5cbiAgICAgIC8vIGFsbG93cyB3b3JraW5nIHdpdGggZnVuY3Rpb25zIGxpa2UgYF8ubWFwYCB3aXRob3V0IHVzaW5nXG4gICAgICAvLyB0aGVpciBgaW5kZXhgIGFyZ3VtZW50IGFzIGEgY2FsbGJhY2tcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJyAmJiB0aGlzQXJnICYmIHRoaXNBcmdbY2FsbGJhY2tdID09PSBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjayA9PSBudWxsICYmIGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICAgIGlmICh2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IChjYWxsYmFjayA9PSBudWxsICYmIGlzU3RyaW5nKGNvbGxlY3Rpb24pKVxuICAgICAgICAgID8gY2hhckF0Q2FsbGJhY2tcbiAgICAgICAgICA6IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG5cbiAgICAgICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB2YXIgY3VycmVudCA9IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgICAgaWYgKGN1cnJlbnQgPiBjb21wdXRlZCkge1xuICAgICAgICAgICAgY29tcHV0ZWQgPSBjdXJyZW50O1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBtaW5pbXVtIHZhbHVlIG9mIGEgY29sbGVjdGlvbi4gSWYgdGhlIGNvbGxlY3Rpb24gaXMgZW1wdHkgb3JcbiAgICAgKiBmYWxzZXkgYEluZmluaXR5YCBpcyByZXR1cm5lZC4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkXG4gICAgICogZm9yIGVhY2ggdmFsdWUgaW4gdGhlIGNvbGxlY3Rpb24gdG8gZ2VuZXJhdGUgdGhlIGNyaXRlcmlvbiBieSB3aGljaCB0aGUgdmFsdWVcbiAgICAgKiBpcyByYW5rZWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgICAqIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWluaW11bSB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5taW4oWzQsIDIsIDgsIDZdKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8ubWluKGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikgeyByZXR1cm4gY2hyLmFnZTsgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubWluKGNoYXJhY3RlcnMsICdhZ2UnKTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9O1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1pbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGNvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgICAgcmVzdWx0ID0gY29tcHV0ZWQ7XG5cbiAgICAgIC8vIGFsbG93cyB3b3JraW5nIHdpdGggZnVuY3Rpb25zIGxpa2UgYF8ubWFwYCB3aXRob3V0IHVzaW5nXG4gICAgICAvLyB0aGVpciBgaW5kZXhgIGFyZ3VtZW50IGFzIGEgY2FsbGJhY2tcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJyAmJiB0aGlzQXJnICYmIHRoaXNBcmdbY2FsbGJhY2tdID09PSBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjayA9PSBudWxsICYmIGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IChjYWxsYmFjayA9PSBudWxsICYmIGlzU3RyaW5nKGNvbGxlY3Rpb24pKVxuICAgICAgICAgID8gY2hhckF0Q2FsbGJhY2tcbiAgICAgICAgICA6IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG5cbiAgICAgICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB2YXIgY3VycmVudCA9IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgICAgaWYgKGN1cnJlbnQgPCBjb21wdXRlZCkge1xuICAgICAgICAgICAgY29tcHV0ZWQgPSBjdXJyZW50O1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBwcm9wZXJ0eSBmcm9tIGFsbCBlbGVtZW50cyBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIHBsdWNrLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5wbHVjayhjaGFyYWN0ZXJzLCAnbmFtZScpO1xuICAgICAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICAgICAqL1xuICAgIHZhciBwbHVjayA9IG1hcDtcblxuICAgIC8qKlxuICAgICAqIFJlZHVjZXMgYSBjb2xsZWN0aW9uIHRvIGEgdmFsdWUgd2hpY2ggaXMgdGhlIGFjY3VtdWxhdGVkIHJlc3VsdCBvZiBydW5uaW5nXG4gICAgICogZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uIHRocm91Z2ggdGhlIGNhbGxiYWNrLCB3aGVyZSBlYWNoIHN1Y2Nlc3NpdmVcbiAgICAgKiBjYWxsYmFjayBleGVjdXRpb24gY29uc3VtZXMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgcHJldmlvdXMgZXhlY3V0aW9uLiBJZlxuICAgICAqIGBhY2N1bXVsYXRvcmAgaXMgbm90IHByb3ZpZGVkIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBjb2xsZWN0aW9uIHdpbGwgYmVcbiAgICAgKiB1c2VkIGFzIHRoZSBpbml0aWFsIGBhY2N1bXVsYXRvcmAgdmFsdWUuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2BcbiAgICAgKiBhbmQgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOyAoYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGZvbGRsLCBpbmplY3RcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBJbml0aWFsIHZhbHVlIG9mIHRoZSBhY2N1bXVsYXRvci5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBzdW0gPSBfLnJlZHVjZShbMSwgMiwgM10sIGZ1bmN0aW9uKHN1bSwgbnVtKSB7XG4gICAgICogICByZXR1cm4gc3VtICsgbnVtO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IDZcbiAgICAgKlxuICAgICAqIHZhciBtYXBwZWQgPSBfLnJlZHVjZSh7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfSwgZnVuY3Rpb24ocmVzdWx0LCBudW0sIGtleSkge1xuICAgICAqICAgcmVzdWx0W2tleV0gPSBudW0gKiAzO1xuICAgICAqICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgKiB9LCB7fSk7XG4gICAgICogLy8gPT4geyAnYSc6IDMsICdiJzogNiwgJ2MnOiA5IH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWR1Y2UoY29sbGVjdGlvbiwgY2FsbGJhY2ssIGFjY3VtdWxhdG9yLCB0aGlzQXJnKSB7XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgIHZhciBub2FjY3VtID0gYXJndW1lbnRzLmxlbmd0aCA8IDM7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgNCk7XG5cbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAobm9hY2N1bSkge1xuICAgICAgICAgIGFjY3VtdWxhdG9yID0gY29sbGVjdGlvblsrK2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICBhY2N1bXVsYXRvciA9IG5vYWNjdW1cbiAgICAgICAgICAgID8gKG5vYWNjdW0gPSBmYWxzZSwgdmFsdWUpXG4gICAgICAgICAgICA6IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucmVkdWNlYCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIGVsZW1lbnRzXG4gICAgICogb2YgYSBgY29sbGVjdGlvbmAgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGZvbGRyXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgYWNjdW11bGF0b3IuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgbGlzdCA9IFtbMCwgMV0sIFsyLCAzXSwgWzQsIDVdXTtcbiAgICAgKiB2YXIgZmxhdCA9IF8ucmVkdWNlUmlnaHQobGlzdCwgZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS5jb25jYXQoYik7IH0sIFtdKTtcbiAgICAgKiAvLyA9PiBbNCwgNSwgMiwgMywgMCwgMV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWR1Y2VSaWdodChjb2xsZWN0aW9uLCBjYWxsYmFjaywgYWNjdW11bGF0b3IsIHRoaXNBcmcpIHtcbiAgICAgIHZhciBub2FjY3VtID0gYXJndW1lbnRzLmxlbmd0aCA8IDM7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgNCk7XG4gICAgICBmb3JFYWNoUmlnaHQoY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGFjY3VtdWxhdG9yID0gbm9hY2N1bVxuICAgICAgICAgID8gKG5vYWNjdW0gPSBmYWxzZSwgdmFsdWUpXG4gICAgICAgICAgOiBjYWxsYmFjayhhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBvcHBvc2l0ZSBvZiBgXy5maWx0ZXJgIHRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGVsZW1lbnRzIG9mIGFcbiAgICAgKiBjb2xsZWN0aW9uIHRoYXQgdGhlIGNhbGxiYWNrIGRvZXMgKipub3QqKiByZXR1cm4gdHJ1ZXkgZm9yLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgZmFpbGVkIHRoZSBjYWxsYmFjayBjaGVjay5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG9kZHMgPSBfLnJlamVjdChbMSwgMiwgMywgNCwgNSwgNl0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICUgMiA9PSAwOyB9KTtcbiAgICAgKiAvLyA9PiBbMSwgMywgNV1cbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnJlamVjdChjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9XVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5yZWplY3QoY2hhcmFjdGVycywgeyAnYWdlJzogMzYgfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVqZWN0KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICByZXR1cm4gZmlsdGVyKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gIWNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYSByYW5kb20gZWxlbWVudCBvciBgbmAgcmFuZG9tIGVsZW1lbnRzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNhbXBsZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW25dIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gc2FtcGxlLlxuICAgICAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBBbGxvd3Mgd29ya2luZyB3aXRoIGZ1bmN0aW9ucyBsaWtlIGBfLm1hcGBcbiAgICAgKiAgd2l0aG91dCB1c2luZyB0aGVpciBgaW5kZXhgIGFyZ3VtZW50cyBhcyBgbmAuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSByYW5kb20gc2FtcGxlKHMpIG9mIGBjb2xsZWN0aW9uYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5zYW1wbGUoWzEsIDIsIDMsIDRdKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiBfLnNhbXBsZShbMSwgMiwgMywgNF0sIDIpO1xuICAgICAqIC8vID0+IFszLCAxXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNhbXBsZShjb2xsZWN0aW9uLCBuLCBndWFyZCkge1xuICAgICAgaWYgKGNvbGxlY3Rpb24gJiYgdHlwZW9mIGNvbGxlY3Rpb24ubGVuZ3RoICE9ICdudW1iZXInKSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSB2YWx1ZXMoY29sbGVjdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uID8gY29sbGVjdGlvbltiYXNlUmFuZG9tKDAsIGNvbGxlY3Rpb24ubGVuZ3RoIC0gMSldIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgdmFyIHJlc3VsdCA9IHNodWZmbGUoY29sbGVjdGlvbik7XG4gICAgICByZXN1bHQubGVuZ3RoID0gbmF0aXZlTWluKG5hdGl2ZU1heCgwLCBuKSwgcmVzdWx0Lmxlbmd0aCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygc2h1ZmZsZWQgdmFsdWVzLCB1c2luZyBhIHZlcnNpb24gb2YgdGhlIEZpc2hlci1ZYXRlc1xuICAgICAqIHNodWZmbGUuIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlci1ZYXRlc19zaHVmZmxlLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNodWZmbGUuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IHNodWZmbGVkIGNvbGxlY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uc2h1ZmZsZShbMSwgMiwgMywgNCwgNSwgNl0pO1xuICAgICAqIC8vID0+IFs0LCAxLCA2LCAzLCA1LCAyXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNodWZmbGUoY29sbGVjdGlvbikge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBBcnJheSh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInID8gbGVuZ3RoIDogMCk7XG5cbiAgICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFyIHJhbmQgPSBiYXNlUmFuZG9tKDAsICsraW5kZXgpO1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gcmVzdWx0W3JhbmRdO1xuICAgICAgICByZXN1bHRbcmFuZF0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzaXplIG9mIHRoZSBgY29sbGVjdGlvbmAgYnkgcmV0dXJuaW5nIGBjb2xsZWN0aW9uLmxlbmd0aGAgZm9yIGFycmF5c1xuICAgICAqIGFuZCBhcnJheS1saWtlIG9iamVjdHMgb3IgdGhlIG51bWJlciBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGZvciBvYmplY3RzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGluc3BlY3QuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgY29sbGVjdGlvbi5sZW5ndGhgIG9yIG51bWJlciBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnNpemUoWzEsIDJdKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiBfLnNpemUoeyAnb25lJzogMSwgJ3R3byc6IDIsICd0aHJlZSc6IDMgfSk7XG4gICAgICogLy8gPT4gM1xuICAgICAqXG4gICAgICogXy5zaXplKCdwZWJibGVzJyk7XG4gICAgICogLy8gPT4gN1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNpemUoY29sbGVjdGlvbikge1xuICAgICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG4gICAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyA/IGxlbmd0aCA6IGtleXMoY29sbGVjdGlvbikubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY2FsbGJhY2sgcmV0dXJucyBhIHRydWV5IHZhbHVlIGZvciAqKmFueSoqIGVsZW1lbnQgb2YgYVxuICAgICAqIGNvbGxlY3Rpb24uIFRoZSBmdW5jdGlvbiByZXR1cm5zIGFzIHNvb24gYXMgaXQgZmluZHMgYSBwYXNzaW5nIHZhbHVlIGFuZFxuICAgICAqIGRvZXMgbm90IGl0ZXJhdGUgb3ZlciB0aGUgZW50aXJlIGNvbGxlY3Rpb24uIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0b1xuICAgICAqIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgYW55XG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZWQgdGhlIGNhbGxiYWNrIGNoZWNrLFxuICAgICAqICBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uc29tZShbbnVsbCwgMCwgJ3llcycsIGZhbHNlXSwgQm9vbGVhbik7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAsICdibG9ja2VkJzogdHJ1ZSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uc29tZShjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uc29tZShjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAxIH0pO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gc29tZShjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAoKHJlc3VsdCA9IGNhbGxiYWNrKGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gIShyZXN1bHQgPSBjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gISFyZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiBlbGVtZW50cywgc29ydGVkIGluIGFzY2VuZGluZyBvcmRlciBieSB0aGUgcmVzdWx0cyBvZlxuICAgICAqIHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiB0aHJvdWdoIHRoZSBjYWxsYmFjay4gVGhpcyBtZXRob2RcbiAgICAgKiBwZXJmb3JtcyBhIHN0YWJsZSBzb3J0LCB0aGF0IGlzLCBpdCB3aWxsIHByZXNlcnZlIHRoZSBvcmlnaW5hbCBzb3J0IG9yZGVyXG4gICAgICogb2YgZXF1YWwgZWxlbWVudHMuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aFxuICAgICAqIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNvbGxlY3Rpb25cbiAgICAgKiB3aWxsIGJlIHNvcnRlZCBieSBlYWNoIHByb3BlcnR5IHZhbHVlLlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHNvcnRlZCBlbGVtZW50cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5zb3J0QnkoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIE1hdGguc2luKG51bSk7IH0pO1xuICAgICAqIC8vID0+IFszLCAxLCAyXVxuICAgICAqXG4gICAgICogXy5zb3J0QnkoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIHRoaXMuc2luKG51bSk7IH0sIE1hdGgpO1xuICAgICAqIC8vID0+IFszLCAxLCAyXVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdhZ2UnOiA0MCB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAgJ2FnZSc6IDI2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYWdlJzogMzAgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLm1hcChfLnNvcnRCeShjaGFyYWN0ZXJzLCAnYWdlJyksIF8udmFsdWVzKTtcbiAgICAgKiAvLyA9PiBbWydiYXJuZXknLCAyNl0sIFsnZnJlZCcsIDMwXSwgWydiYXJuZXknLCAzNl0sIFsnZnJlZCcsIDQwXV1cbiAgICAgKlxuICAgICAqIC8vIHNvcnRpbmcgYnkgbXVsdGlwbGUgcHJvcGVydGllc1xuICAgICAqIF8ubWFwKF8uc29ydEJ5KGNoYXJhY3RlcnMsIFsnbmFtZScsICdhZ2UnXSksIF8udmFsdWVzKTtcbiAgICAgKiAvLyA9ID4gW1snYmFybmV5JywgMjZdLCBbJ2Jhcm5leScsIDM2XSwgWydmcmVkJywgMzBdLCBbJ2ZyZWQnLCA0MF1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gc29ydEJ5KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBpc0FyciA9IGlzQXJyYXkoY2FsbGJhY2spLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyA/IGxlbmd0aCA6IDApO1xuXG4gICAgICBpZiAoIWlzQXJyKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIH1cbiAgICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSwgY29sbGVjdGlvbikge1xuICAgICAgICB2YXIgb2JqZWN0ID0gcmVzdWx0WysraW5kZXhdID0gZ2V0T2JqZWN0KCk7XG4gICAgICAgIGlmIChpc0Fycikge1xuICAgICAgICAgIG9iamVjdC5jcml0ZXJpYSA9IG1hcChjYWxsYmFjaywgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAob2JqZWN0LmNyaXRlcmlhID0gZ2V0QXJyYXkoKSlbMF0gPSBjYWxsYmFjayh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBvYmplY3QuaW5kZXggPSBpbmRleDtcbiAgICAgICAgb2JqZWN0LnZhbHVlID0gdmFsdWU7XG4gICAgICB9KTtcblxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgIHJlc3VsdC5zb3J0KGNvbXBhcmVBc2NlbmRpbmcpO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSByZXN1bHRbbGVuZ3RoXTtcbiAgICAgICAgcmVzdWx0W2xlbmd0aF0gPSBvYmplY3QudmFsdWU7XG4gICAgICAgIGlmICghaXNBcnIpIHtcbiAgICAgICAgICByZWxlYXNlQXJyYXkob2JqZWN0LmNyaXRlcmlhKTtcbiAgICAgICAgfVxuICAgICAgICByZWxlYXNlT2JqZWN0KG9iamVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoZSBgY29sbGVjdGlvbmAgdG8gYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gY29udmVydC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBjb252ZXJ0ZWQgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIChmdW5jdGlvbigpIHsgcmV0dXJuIF8udG9BcnJheShhcmd1bWVudHMpLnNsaWNlKDEpOyB9KSgxLCAyLCAzLCA0KTtcbiAgICAgKiAvLyA9PiBbMiwgMywgNF1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b0FycmF5KGNvbGxlY3Rpb24pIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uICYmIHR5cGVvZiBjb2xsZWN0aW9uLmxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gc2xpY2UoY29sbGVjdGlvbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWVzKGNvbGxlY3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIG9mIGVhY2ggZWxlbWVudCBpbiBhIGBjb2xsZWN0aW9uYCB0byB0aGUgZ2l2ZW5cbiAgICAgKiBgcHJvcGVydGllc2Agb2JqZWN0LCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgYWxsIGVsZW1lbnRzIHRoYXQgaGF2ZSBlcXVpdmFsZW50XG4gICAgICogcHJvcGVydHkgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBmaWx0ZXIgYnkuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgZ2l2ZW4gcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ3BldHMnOiBbJ2hvcHB5J10gfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAncGV0cyc6IFsnYmFieSBwdXNzJywgJ2Rpbm8nXSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8ud2hlcmUoY2hhcmFjdGVycywgeyAnYWdlJzogMzYgfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAncGV0cyc6IFsnaG9wcHknXSB9XVxuICAgICAqXG4gICAgICogXy53aGVyZShjaGFyYWN0ZXJzLCB7ICdwZXRzJzogWydkaW5vJ10gfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCwgJ3BldHMnOiBbJ2JhYnkgcHVzcycsICdkaW5vJ10gfV1cbiAgICAgKi9cbiAgICB2YXIgd2hlcmUgPSBmaWx0ZXI7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgd2l0aCBhbGwgZmFsc2V5IHZhbHVlcyByZW1vdmVkLiBUaGUgdmFsdWVzIGBmYWxzZWAsIGBudWxsYCxcbiAgICAgKiBgMGAsIGBcIlwiYCwgYHVuZGVmaW5lZGAsIGFuZCBgTmFOYCBhcmUgYWxsIGZhbHNleS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmNvbXBhY3QoWzAsIDEsIGZhbHNlLCAyLCAnJywgM10pO1xuICAgICAqIC8vID0+IFsxLCAyLCAzXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBhY3QoYXJyYXkpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBleGNsdWRpbmcgYWxsIHZhbHVlcyBvZiB0aGUgcHJvdmlkZWQgYXJyYXlzIHVzaW5nIHN0cmljdFxuICAgICAqIGVxdWFsaXR5IGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcHJvY2Vzcy5cbiAgICAgKiBAcGFyYW0gey4uLkFycmF5fSBbdmFsdWVzXSBUaGUgYXJyYXlzIG9mIHZhbHVlcyB0byBleGNsdWRlLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZGlmZmVyZW5jZShbMSwgMiwgMywgNCwgNV0sIFs1LCAyLCAxMF0pO1xuICAgICAqIC8vID0+IFsxLCAzLCA0XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpZmZlcmVuY2UoYXJyYXkpIHtcbiAgICAgIHJldHVybiBiYXNlRGlmZmVyZW5jZShhcnJheSwgYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlLCAxKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kYCBleGNlcHQgdGhhdCBpdCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZmlyc3RcbiAgICAgKiBlbGVtZW50IHRoYXQgcGFzc2VzIHRoZSBjYWxsYmFjayBjaGVjaywgaW5zdGVhZCBvZiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYC0xYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYWdlJzogMzYsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgICdibG9ja2VkJzogZmFsc2UgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiBfLmZpbmRJbmRleChjaGFyYWN0ZXJzLCBmdW5jdGlvbihjaHIpIHtcbiAgICAgKiAgIHJldHVybiBjaHIuYWdlIDwgMjA7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gMlxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kSW5kZXgoY2hhcmFjdGVycywgeyAnYWdlJzogMzYgfSk7XG4gICAgICogLy8gPT4gMFxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kSW5kZXgoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKTtcbiAgICAgKiAvLyA9PiAxXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBpZiAoY2FsbGJhY2soYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kSW5kZXhgIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHNcbiAgICAgKiBvZiBhIGBjb2xsZWN0aW9uYCBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYC0xYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYWdlJzogMzYsICdibG9ja2VkJzogdHJ1ZSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IGZhbHNlIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgICdibG9ja2VkJzogdHJ1ZSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8uZmluZExhc3RJbmRleChjaGFyYWN0ZXJzLCBmdW5jdGlvbihjaHIpIHtcbiAgICAgKiAgIHJldHVybiBjaHIuYWdlID4gMzA7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gMVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kTGFzdEluZGV4KGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDM2IH0pO1xuICAgICAqIC8vID0+IDBcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmluZExhc3RJbmRleChjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+IDJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kTGFzdEluZGV4KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoY2FsbGJhY2soYXJyYXlbbGVuZ3RoXSwgbGVuZ3RoLCBhcnJheSkpIHtcbiAgICAgICAgICByZXR1cm4gbGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZmlyc3QgZWxlbWVudCBvciBmaXJzdCBgbmAgZWxlbWVudHMgb2YgYW4gYXJyYXkuIElmIGEgY2FsbGJhY2tcbiAgICAgKiBpcyBwcm92aWRlZCBlbGVtZW50cyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheSBhcmUgcmV0dXJuZWQgYXMgbG9uZ1xuICAgICAqIGFzIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZFxuICAgICAqIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGhlYWQsIHRha2VcbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fG51bWJlcnxzdHJpbmd9IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgZWxlbWVudCBvciB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJldHVybi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yXG4gICAgICogIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCJcbiAgICAgKiAgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudChzKSBvZiBgYXJyYXlgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmZpcnN0KFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gMVxuICAgICAqXG4gICAgICogXy5maXJzdChbMSwgMiwgM10sIDIpO1xuICAgICAqIC8vID0+IFsxLCAyXVxuICAgICAqXG4gICAgICogXy5maXJzdChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSA8IDM7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gWzEsIDJdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdibG9ja2VkJzogZmFsc2UsICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAncGViYmxlcycsICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICduYScgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpcnN0KGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgJ2Jsb2NrZWQnOiB0cnVlLCAnZW1wbG95ZXInOiAnc2xhdGUnIH1dXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnBsdWNrKF8uZmlyc3QoY2hhcmFjdGVycywgeyAnZW1wbG95ZXInOiAnc2xhdGUnIH0pLCAnbmFtZScpO1xuICAgICAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpcnN0KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIG4gPSAwLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnbnVtYmVyJyAmJiBjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoICYmIGNhbGxiYWNrKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgICAgIG4rKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbiA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAobiA9PSBudWxsIHx8IHRoaXNBcmcpIHtcbiAgICAgICAgICByZXR1cm4gYXJyYXkgPyBhcnJheVswXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCAwLCBuYXRpdmVNaW4obmF0aXZlTWF4KDAsIG4pLCBsZW5ndGgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGbGF0dGVucyBhIG5lc3RlZCBhcnJheSAodGhlIG5lc3RpbmcgY2FuIGJlIHRvIGFueSBkZXB0aCkuIElmIGBpc1NoYWxsb3dgXG4gICAgICogaXMgdHJ1ZXksIHRoZSBhcnJheSB3aWxsIG9ubHkgYmUgZmxhdHRlbmVkIGEgc2luZ2xlIGxldmVsLiBJZiBhIGNhbGxiYWNrXG4gICAgICogaXMgcHJvdmlkZWQgZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheSBpcyBwYXNzZWQgdGhyb3VnaCB0aGUgY2FsbGJhY2sgYmVmb3JlXG4gICAgICogZmxhdHRlbmluZy4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlXG4gICAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBhcnJheSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NoYWxsb3c9ZmFsc2VdIEEgZmxhZyB0byByZXN0cmljdCBmbGF0dGVuaW5nIHRvIGEgc2luZ2xlIGxldmVsLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5mbGF0dGVuKFsxLCBbMl0sIFszLCBbWzRdXV1dKTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgMywgNF07XG4gICAgICpcbiAgICAgKiBfLmZsYXR0ZW4oWzEsIFsyXSwgWzMsIFtbNF1dXV0sIHRydWUpO1xuICAgICAqIC8vID0+IFsxLCAyLCAzLCBbWzRdXV07XG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDMwLCAncGV0cyc6IFsnaG9wcHknXSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAsICdwZXRzJzogWydiYWJ5IHB1c3MnLCAnZGlubyddIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5mbGF0dGVuKGNoYXJhY3RlcnMsICdwZXRzJyk7XG4gICAgICogLy8gPT4gWydob3BweScsICdiYWJ5IHB1c3MnLCAnZGlubyddXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmxhdHRlbihhcnJheSwgaXNTaGFsbG93LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgLy8ganVnZ2xlIGFyZ3VtZW50c1xuICAgICAgaWYgKHR5cGVvZiBpc1NoYWxsb3cgIT0gJ2Jvb2xlYW4nICYmIGlzU2hhbGxvdyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXNBcmcgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSAodHlwZW9mIGlzU2hhbGxvdyAhPSAnZnVuY3Rpb24nICYmIHRoaXNBcmcgJiYgdGhpc0FyZ1tpc1NoYWxsb3ddID09PSBhcnJheSkgPyBudWxsIDogaXNTaGFsbG93O1xuICAgICAgICBpc1NoYWxsb3cgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIGFycmF5ID0gbWFwKGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZUZsYXR0ZW4oYXJyYXksIGlzU2hhbGxvdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYHZhbHVlYCBpcyBmb3VuZCB1c2luZ1xuICAgICAqIHN0cmljdCBlcXVhbGl0eSBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuIElmIHRoZSBhcnJheSBpcyBhbHJlYWR5IHNvcnRlZFxuICAgICAqIHByb3ZpZGluZyBgdHJ1ZWAgZm9yIGBmcm9tSW5kZXhgIHdpbGwgcnVuIGEgZmFzdGVyIGJpbmFyeSBzZWFyY2guXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tIG9yIGB0cnVlYFxuICAgICAqICB0byBwZXJmb3JtIGEgYmluYXJ5IHNlYXJjaCBvbiBhIHNvcnRlZCBhcnJheS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSBvciBgLTFgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmluZGV4T2YoWzEsIDIsIDMsIDEsIDIsIDNdLCAyKTtcbiAgICAgKiAvLyA9PiAxXG4gICAgICpcbiAgICAgKiBfLmluZGV4T2YoWzEsIDIsIDMsIDEsIDIsIDNdLCAyLCAzKTtcbiAgICAgKiAvLyA9PiA0XG4gICAgICpcbiAgICAgKiBfLmluZGV4T2YoWzEsIDEsIDIsIDIsIDMsIDNdLCAyLCB0cnVlKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICAgICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggPT0gJ251bWJlcicpIHtcbiAgICAgICAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICAgICAgZnJvbUluZGV4ID0gKGZyb21JbmRleCA8IDAgPyBuYXRpdmVNYXgoMCwgbGVuZ3RoICsgZnJvbUluZGV4KSA6IGZyb21JbmRleCB8fCAwKTtcbiAgICAgIH0gZWxzZSBpZiAoZnJvbUluZGV4KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHNvcnRlZEluZGV4KGFycmF5LCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpbmRleF0gPT09IHZhbHVlID8gaW5kZXggOiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbGwgYnV0IHRoZSBsYXN0IGVsZW1lbnQgb3IgbGFzdCBgbmAgZWxlbWVudHMgb2YgYW4gYXJyYXkuIElmIGFcbiAgICAgKiBjYWxsYmFjayBpcyBwcm92aWRlZCBlbGVtZW50cyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheSBhcmUgZXhjbHVkZWQgZnJvbVxuICAgICAqIHRoZSByZXN1bHQgYXMgbG9uZyBhcyB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVleS4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kXG4gICAgICogdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBhcnJheSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8bnVtYmVyfHN0cmluZ30gW2NhbGxiYWNrPTFdIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBleGNsdWRlLiBJZiBhIHByb3BlcnR5IG5hbWUgb3JcbiAgICAgKiAgb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIlxuICAgICAqICBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIHNsaWNlIG9mIGBhcnJheWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaW5pdGlhbChbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IFsxLCAyXVxuICAgICAqXG4gICAgICogXy5pbml0aWFsKFsxLCAyLCAzXSwgMik7XG4gICAgICogLy8gPT4gWzFdXG4gICAgICpcbiAgICAgKiBfLmluaXRpYWwoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHtcbiAgICAgKiAgIHJldHVybiBudW0gPiAxO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IFsxXVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYmxvY2tlZCc6IGZhbHNlLCAnZW1wbG95ZXInOiAnc2xhdGUnIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYmxvY2tlZCc6IHRydWUsICAnZW1wbG95ZXInOiAnc2xhdGUnIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYmxvY2tlZCc6IHRydWUsICAnZW1wbG95ZXInOiAnbmEnIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5pbml0aWFsKGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgICdibG9ja2VkJzogZmFsc2UsICdlbXBsb3llcic6ICdzbGF0ZScgfV1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ucGx1Y2soXy5pbml0aWFsKGNoYXJhY3RlcnMsIHsgJ2VtcGxveWVyJzogJ25hJyB9KSwgJ25hbWUnKTtcbiAgICAgKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0aWFsKGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIG4gPSAwLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnbnVtYmVyJyAmJiBjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGxlbmd0aDtcbiAgICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgICB3aGlsZSAoaW5kZXgtLSAmJiBjYWxsYmFjayhhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgICBuKys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG4gPSAoY2FsbGJhY2sgPT0gbnVsbCB8fCB0aGlzQXJnKSA/IDEgOiBjYWxsYmFjayB8fCBuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCAwLCBuYXRpdmVNaW4obmF0aXZlTWF4KDAsIGxlbmd0aCAtIG4pLCBsZW5ndGgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMgcHJlc2VudCBpbiBhbGwgcHJvdmlkZWQgYXJyYXlzIHVzaW5nXG4gICAgICogc3RyaWN0IGVxdWFsaXR5IGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXldIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2Ygc2hhcmVkIHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pbnRlcnNlY3Rpb24oWzEsIDIsIDNdLCBbNSwgMiwgMSwgNF0sIFsyLCAxXSk7XG4gICAgICogLy8gPT4gWzEsIDJdXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXSxcbiAgICAgICAgICBhcmdzSW5kZXggPSAtMSxcbiAgICAgICAgICBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICBjYWNoZXMgPSBnZXRBcnJheSgpLFxuICAgICAgICAgIGluZGV4T2YgPSBnZXRJbmRleE9mKCksXG4gICAgICAgICAgdHJ1c3RJbmRleE9mID0gaW5kZXhPZiA9PT0gYmFzZUluZGV4T2YsXG4gICAgICAgICAgc2VlbiA9IGdldEFycmF5KCk7XG5cbiAgICAgIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzW2FyZ3NJbmRleF07XG4gICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpIHtcbiAgICAgICAgICBhcmdzLnB1c2godmFsdWUpO1xuICAgICAgICAgIGNhY2hlcy5wdXNoKHRydXN0SW5kZXhPZiAmJiB2YWx1ZS5sZW5ndGggPj0gbGFyZ2VBcnJheVNpemUgJiZcbiAgICAgICAgICAgIGNyZWF0ZUNhY2hlKGFyZ3NJbmRleCA/IGFyZ3NbYXJnc0luZGV4XSA6IHNlZW4pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGFycmF5ID0gYXJnc1swXSxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgb3V0ZXI6XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgY2FjaGUgPSBjYWNoZXNbMF07XG4gICAgICAgIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuXG4gICAgICAgIGlmICgoY2FjaGUgPyBjYWNoZUluZGV4T2YoY2FjaGUsIHZhbHVlKSA6IGluZGV4T2Yoc2VlbiwgdmFsdWUpKSA8IDApIHtcbiAgICAgICAgICBhcmdzSW5kZXggPSBhcmdzTGVuZ3RoO1xuICAgICAgICAgIChjYWNoZSB8fCBzZWVuKS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB3aGlsZSAoLS1hcmdzSW5kZXgpIHtcbiAgICAgICAgICAgIGNhY2hlID0gY2FjaGVzW2FyZ3NJbmRleF07XG4gICAgICAgICAgICBpZiAoKGNhY2hlID8gY2FjaGVJbmRleE9mKGNhY2hlLCB2YWx1ZSkgOiBpbmRleE9mKGFyZ3NbYXJnc0luZGV4XSwgdmFsdWUpKSA8IDApIHtcbiAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd2hpbGUgKGFyZ3NMZW5ndGgtLSkge1xuICAgICAgICBjYWNoZSA9IGNhY2hlc1thcmdzTGVuZ3RoXTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgcmVsZWFzZU9iamVjdChjYWNoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlbGVhc2VBcnJheShjYWNoZXMpO1xuICAgICAgcmVsZWFzZUFycmF5KHNlZW4pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBsYXN0IGVsZW1lbnQgb3IgbGFzdCBgbmAgZWxlbWVudHMgb2YgYW4gYXJyYXkuIElmIGEgY2FsbGJhY2sgaXNcbiAgICAgKiBwcm92aWRlZCBlbGVtZW50cyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheSBhcmUgcmV0dXJuZWQgYXMgbG9uZyBhcyB0aGVcbiAgICAgKiBjYWxsYmFjayByZXR1cm5zIHRydWV5LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkXG4gICAgICogd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxudW1iZXJ8c3RyaW5nfSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uIElmIGEgcHJvcGVydHkgbmFtZSBvclxuICAgICAqICBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiXG4gICAgICogIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGxhc3QgZWxlbWVudChzKSBvZiBgYXJyYXlgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmxhc3QoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiAzXG4gICAgICpcbiAgICAgKiBfLmxhc3QoWzEsIDIsIDNdLCAyKTtcbiAgICAgKiAvLyA9PiBbMiwgM11cbiAgICAgKlxuICAgICAqIF8ubGFzdChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSA+IDE7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gWzIsIDNdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdibG9ja2VkJzogZmFsc2UsICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAncGViYmxlcycsICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICduYScgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnBsdWNrKF8ubGFzdChjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpLCAnbmFtZScpO1xuICAgICAqIC8vID0+IFsnZnJlZCcsICdwZWJibGVzJ11cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubGFzdChjaGFyYWN0ZXJzLCB7ICdlbXBsb3llcic6ICduYScgfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAncGViYmxlcycsICdibG9ja2VkJzogdHJ1ZSwgJ2VtcGxveWVyJzogJ25hJyB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxhc3QoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgbiA9IDAsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdudW1iZXInICYmIGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gbGVuZ3RoO1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIHdoaWxlIChpbmRleC0tICYmIGNhbGxiYWNrKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgICAgIG4rKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbiA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAobiA9PSBudWxsIHx8IHRoaXNBcmcpIHtcbiAgICAgICAgICByZXR1cm4gYXJyYXkgPyBhcnJheVtsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCBuYXRpdmVNYXgoMCwgbGVuZ3RoIC0gbikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBsYXN0IG9jY3VycmVuY2Ugb2YgYHZhbHVlYCBpcyBmb3VuZCB1c2luZyBzdHJpY3RcbiAgICAgKiBlcXVhbGl0eSBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuIElmIGBmcm9tSW5kZXhgIGlzIG5lZ2F0aXZlLCBpdCBpcyB1c2VkXG4gICAgICogYXMgdGhlIG9mZnNldCBmcm9tIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9YXJyYXkubGVuZ3RoLTFdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSBvciBgLTFgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmxhc3RJbmRleE9mKFsxLCAyLCAzLCAxLCAyLCAzXSwgMik7XG4gICAgICogLy8gPT4gNFxuICAgICAqXG4gICAgICogXy5sYXN0SW5kZXhPZihbMSwgMiwgMywgMSwgMiwgM10sIDIsIDMpO1xuICAgICAqIC8vID0+IDFcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsYXN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICAgICAgdmFyIGluZGV4ID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaW5kZXggPSAoZnJvbUluZGV4IDwgMCA/IG5hdGl2ZU1heCgwLCBpbmRleCArIGZyb21JbmRleCkgOiBuYXRpdmVNaW4oZnJvbUluZGV4LCBpbmRleCAtIDEpKSArIDE7XG4gICAgICB9XG4gICAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIHByb3ZpZGVkIHZhbHVlcyBmcm9tIHRoZSBnaXZlbiBhcnJheSB1c2luZyBzdHJpY3QgZXF1YWxpdHkgZm9yXG4gICAgICogY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAgICAgKiBAcGFyYW0gey4uLip9IFt2YWx1ZV0gVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBhcnJheSA9IFsxLCAyLCAzLCAxLCAyLCAzXTtcbiAgICAgKiBfLnB1bGwoYXJyYXksIDIsIDMpO1xuICAgICAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAgICAgKiAvLyA9PiBbMSwgMV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwdWxsKGFycmF5KSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBhcmdzSW5kZXggPSAwLFxuICAgICAgICAgIGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aCxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgICAgIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICB2YWx1ZSA9IGFyZ3NbYXJnc0luZGV4XTtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGluZGV4LS0sIDEpO1xuICAgICAgICAgICAgbGVuZ3RoLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiBudW1iZXJzIChwb3NpdGl2ZSBhbmQvb3IgbmVnYXRpdmUpIHByb2dyZXNzaW5nIGZyb21cbiAgICAgKiBgc3RhcnRgIHVwIHRvIGJ1dCBub3QgaW5jbHVkaW5nIGBlbmRgLiBJZiBgc3RhcnRgIGlzIGxlc3MgdGhhbiBgc3RvcGAgYVxuICAgICAqIHplcm8tbGVuZ3RoIHJhbmdlIGlzIGNyZWF0ZWQgdW5sZXNzIGEgbmVnYXRpdmUgYHN0ZXBgIGlzIHNwZWNpZmllZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBvZiB0aGUgcmFuZ2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV0gVGhlIHZhbHVlIHRvIGluY3JlbWVudCBvciBkZWNyZW1lbnQgYnkuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IHJhbmdlIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnJhbmdlKDQpO1xuICAgICAqIC8vID0+IFswLCAxLCAyLCAzXVxuICAgICAqXG4gICAgICogXy5yYW5nZSgxLCA1KTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgMywgNF1cbiAgICAgKlxuICAgICAqIF8ucmFuZ2UoMCwgMjAsIDUpO1xuICAgICAqIC8vID0+IFswLCA1LCAxMCwgMTVdXG4gICAgICpcbiAgICAgKiBfLnJhbmdlKDAsIC00LCAtMSk7XG4gICAgICogLy8gPT4gWzAsIC0xLCAtMiwgLTNdXG4gICAgICpcbiAgICAgKiBfLnJhbmdlKDEsIDQsIDApO1xuICAgICAqIC8vID0+IFsxLCAxLCAxXVxuICAgICAqXG4gICAgICogXy5yYW5nZSgwKTtcbiAgICAgKiAvLyA9PiBbXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICAgIHN0YXJ0ID0gK3N0YXJ0IHx8IDA7XG4gICAgICBzdGVwID0gdHlwZW9mIHN0ZXAgPT0gJ251bWJlcicgPyBzdGVwIDogKCtzdGVwIHx8IDEpO1xuXG4gICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIH1cbiAgICAgIC8vIHVzZSBgQXJyYXkobGVuZ3RoKWAgc28gZW5naW5lcyBsaWtlIENoYWtyYSBhbmQgVjggYXZvaWQgc2xvd2VyIG1vZGVzXG4gICAgICAvLyBodHRwOi8veW91dHUuYmUvWEFxSXBHVThaWmsjdD0xN20yNXNcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heCgwLCBjZWlsKChlbmQgLSBzdGFydCkgLyAoc3RlcCB8fCAxKSkpLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBzdGFydDtcbiAgICAgICAgc3RhcnQgKz0gc3RlcDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgZWxlbWVudHMgZnJvbSBhbiBhcnJheSB0aGF0IHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5IGZvclxuICAgICAqIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIHJlbW92ZWQgZWxlbWVudHMuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2BcbiAgICAgKiBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgYXJyYXkgPSBbMSwgMiwgMywgNCwgNSwgNl07XG4gICAgICogdmFyIGV2ZW5zID0gXy5yZW1vdmUoYXJyYXksIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICUgMiA9PSAwOyB9KTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAgICAgKiAvLyA9PiBbMSwgMywgNV1cbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGV2ZW5zKTtcbiAgICAgKiAvLyA9PiBbMiwgNCwgNl1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW1vdmUoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBpbmRleC0tLCAxKTtcbiAgICAgICAgICBsZW5ndGgtLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3Bwb3NpdGUgb2YgYF8uaW5pdGlhbGAgdGhpcyBtZXRob2QgZ2V0cyBhbGwgYnV0IHRoZSBmaXJzdCBlbGVtZW50IG9yXG4gICAgICogZmlyc3QgYG5gIGVsZW1lbnRzIG9mIGFuIGFycmF5LiBJZiBhIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIGVsZW1lbnRzXG4gICAgICogYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXkgYXJlIGV4Y2x1ZGVkIGZyb20gdGhlIHJlc3VsdCBhcyBsb25nIGFzIHRoZVxuICAgICAqIGNhbGxiYWNrIHJldHVybnMgdHJ1ZXkuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAgICAgKiB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgZHJvcCwgdGFpbFxuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8bnVtYmVyfHN0cmluZ30gW2NhbGxiYWNrPTFdIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBleGNsdWRlLiBJZiBhIHByb3BlcnR5IG5hbWUgb3JcbiAgICAgKiAgb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIlxuICAgICAqICBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIHNsaWNlIG9mIGBhcnJheWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ucmVzdChbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IFsyLCAzXVxuICAgICAqXG4gICAgICogXy5yZXN0KFsxLCAyLCAzXSwgMik7XG4gICAgICogLy8gPT4gWzNdXG4gICAgICpcbiAgICAgKiBfLnJlc3QoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHtcbiAgICAgKiAgIHJldHVybiBudW0gPCAzO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IFszXVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYmxvY2tlZCc6IHRydWUsICAnZW1wbG95ZXInOiAnc2xhdGUnIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYmxvY2tlZCc6IGZhbHNlLCAgJ2VtcGxveWVyJzogJ3NsYXRlJyB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdwZWJibGVzJywgJ2Jsb2NrZWQnOiB0cnVlLCAnZW1wbG95ZXInOiAnbmEnIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5wbHVjayhfLnJlc3QoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKSwgJ25hbWUnKTtcbiAgICAgKiAvLyA9PiBbJ2ZyZWQnLCAncGViYmxlcyddXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnJlc3QoY2hhcmFjdGVycywgeyAnZW1wbG95ZXInOiAnc2xhdGUnIH0pO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ3BlYmJsZXMnLCAnYmxvY2tlZCc6IHRydWUsICdlbXBsb3llcic6ICduYScgfV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXN0KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnbnVtYmVyJyAmJiBjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIHZhciBuID0gMCxcbiAgICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCAmJiBjYWxsYmFjayhhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgICBuKys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG4gPSAoY2FsbGJhY2sgPT0gbnVsbCB8fCB0aGlzQXJnKSA/IDEgOiBuYXRpdmVNYXgoMCwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCBuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2VzIGEgYmluYXJ5IHNlYXJjaCB0byBkZXRlcm1pbmUgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoIGEgdmFsdWVcbiAgICAgKiBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBhIGdpdmVuIHNvcnRlZCBhcnJheSBpbiBvcmRlciB0byBtYWludGFpbiB0aGUgc29ydFxuICAgICAqIG9yZGVyIG9mIHRoZSBhcnJheS4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkIGZvclxuICAgICAqIGB2YWx1ZWAgYW5kIGVhY2ggZWxlbWVudCBvZiBgYXJyYXlgIHRvIGNvbXB1dGUgdGhlaXIgc29ydCByYW5raW5nLiBUaGVcbiAgICAgKiBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ7ICh2YWx1ZSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBldmFsdWF0ZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IGF0IHdoaWNoIGB2YWx1ZWAgc2hvdWxkIGJlIGluc2VydGVkXG4gICAgICogIGludG8gYGFycmF5YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5zb3J0ZWRJbmRleChbMjAsIDMwLCA1MF0sIDQwKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnNvcnRlZEluZGV4KFt7ICd4JzogMjAgfSwgeyAneCc6IDMwIH0sIHsgJ3gnOiA1MCB9XSwgeyAneCc6IDQwIH0sICd4Jyk7XG4gICAgICogLy8gPT4gMlxuICAgICAqXG4gICAgICogdmFyIGRpY3QgPSB7XG4gICAgICogICAnd29yZFRvTnVtYmVyJzogeyAndHdlbnR5JzogMjAsICd0aGlydHknOiAzMCwgJ2ZvdXJ0eSc6IDQwLCAnZmlmdHknOiA1MCB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIF8uc29ydGVkSW5kZXgoWyd0d2VudHknLCAndGhpcnR5JywgJ2ZpZnR5J10sICdmb3VydHknLCBmdW5jdGlvbih3b3JkKSB7XG4gICAgICogICByZXR1cm4gZGljdC53b3JkVG9OdW1iZXJbd29yZF07XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gMlxuICAgICAqXG4gICAgICogXy5zb3J0ZWRJbmRleChbJ3R3ZW50eScsICd0aGlydHknLCAnZmlmdHknXSwgJ2ZvdXJ0eScsIGZ1bmN0aW9uKHdvcmQpIHtcbiAgICAgKiAgIHJldHVybiB0aGlzLndvcmRUb051bWJlclt3b3JkXTtcbiAgICAgKiB9LCBkaWN0KTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICovXG4gICAgZnVuY3Rpb24gc29ydGVkSW5kZXgoYXJyYXksIHZhbHVlLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGxvdyA9IDAsXG4gICAgICAgICAgaGlnaCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogbG93O1xuXG4gICAgICAvLyBleHBsaWNpdGx5IHJlZmVyZW5jZSBgaWRlbnRpdHlgIGZvciBiZXR0ZXIgaW5saW5pbmcgaW4gRmlyZWZveFxuICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayA/IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMSkgOiBpZGVudGl0eTtcbiAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUpO1xuXG4gICAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxO1xuICAgICAgICAoY2FsbGJhY2soYXJyYXlbbWlkXSkgPCB2YWx1ZSlcbiAgICAgICAgICA/IGxvdyA9IG1pZCArIDFcbiAgICAgICAgICA6IGhpZ2ggPSBtaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gbG93O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdW5pcXVlIHZhbHVlcywgaW4gb3JkZXIsIG9mIHRoZSBwcm92aWRlZCBhcnJheXMgdXNpbmdcbiAgICAgKiBzdHJpY3QgZXF1YWxpdHkgZm9yIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheV0gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBjb21iaW5lZCB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8udW5pb24oWzEsIDIsIDNdLCBbNSwgMiwgMSwgNF0sIFsyLCAxXSk7XG4gICAgICogLy8gPT4gWzEsIDIsIDMsIDUsIDRdXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5pb24oKSB7XG4gICAgICByZXR1cm4gYmFzZVVuaXEoYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGR1cGxpY2F0ZS12YWx1ZS1mcmVlIHZlcnNpb24gb2YgYW4gYXJyYXkgdXNpbmcgc3RyaWN0IGVxdWFsaXR5XG4gICAgICogZm9yIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLiBJZiB0aGUgYXJyYXkgaXMgc29ydGVkLCBwcm92aWRpbmdcbiAgICAgKiBgdHJ1ZWAgZm9yIGBpc1NvcnRlZGAgd2lsbCB1c2UgYSBmYXN0ZXIgYWxnb3JpdGhtLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkXG4gICAgICogZWFjaCBlbGVtZW50IG9mIGBhcnJheWAgaXMgcGFzc2VkIHRocm91Z2ggdGhlIGNhbGxiYWNrIGJlZm9yZSB1bmlxdWVuZXNzXG4gICAgICogaXMgY29tcHV0ZWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgICAqIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgdW5pcXVlXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU29ydGVkPWZhbHNlXSBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBgYXJyYXlgIGlzIHNvcnRlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIGR1cGxpY2F0ZS12YWx1ZS1mcmVlIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnVuaXEoWzEsIDIsIDEsIDMsIDFdKTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgM11cbiAgICAgKlxuICAgICAqIF8udW5pcShbMSwgMSwgMiwgMiwgM10sIHRydWUpO1xuICAgICAqIC8vID0+IFsxLCAyLCAzXVxuICAgICAqXG4gICAgICogXy51bmlxKFsnQScsICdiJywgJ0MnLCAnYScsICdCJywgJ2MnXSwgZnVuY3Rpb24obGV0dGVyKSB7IHJldHVybiBsZXR0ZXIudG9Mb3dlckNhc2UoKTsgfSk7XG4gICAgICogLy8gPT4gWydBJywgJ2InLCAnQyddXG4gICAgICpcbiAgICAgKiBfLnVuaXEoWzEsIDIuNSwgMywgMS41LCAyLCAzLjVdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIHRoaXMuZmxvb3IobnVtKTsgfSwgTWF0aCk7XG4gICAgICogLy8gPT4gWzEsIDIuNSwgM11cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8udW5pcShbeyAneCc6IDEgfSwgeyAneCc6IDIgfSwgeyAneCc6IDEgfV0sICd4Jyk7XG4gICAgICogLy8gPT4gW3sgJ3gnOiAxIH0sIHsgJ3gnOiAyIH1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5pcShhcnJheSwgaXNTb3J0ZWQsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAvLyBqdWdnbGUgYXJndW1lbnRzXG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkICE9ICdib29sZWFuJyAmJiBpc1NvcnRlZCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXNBcmcgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSAodHlwZW9mIGlzU29ydGVkICE9ICdmdW5jdGlvbicgJiYgdGhpc0FyZyAmJiB0aGlzQXJnW2lzU29ydGVkXSA9PT0gYXJyYXkpID8gbnVsbCA6IGlzU29ydGVkO1xuICAgICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2VVbmlxKGFycmF5LCBpc1NvcnRlZCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgZXhjbHVkaW5nIGFsbCBwcm92aWRlZCB2YWx1ZXMgdXNpbmcgc3RyaWN0IGVxdWFsaXR5IGZvclxuICAgICAqIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmaWx0ZXIuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbdmFsdWVdIFRoZSB2YWx1ZXMgdG8gZXhjbHVkZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLndpdGhvdXQoWzEsIDIsIDEsIDAsIDMsIDEsIDRdLCAwLCAxKTtcbiAgICAgKiAvLyA9PiBbMiwgMywgNF1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB3aXRob3V0KGFycmF5KSB7XG4gICAgICByZXR1cm4gYmFzZURpZmZlcmVuY2UoYXJyYXksIHNsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgdGhhdCBpcyB0aGUgc3ltbWV0cmljIGRpZmZlcmVuY2Ugb2YgdGhlIHByb3ZpZGVkIGFycmF5cy5cbiAgICAgKiBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TeW1tZXRyaWNfZGlmZmVyZW5jZS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXldIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnhvcihbMSwgMiwgM10sIFs1LCAyLCAxLCA0XSk7XG4gICAgICogLy8gPT4gWzMsIDUsIDRdXG4gICAgICpcbiAgICAgKiBfLnhvcihbMSwgMiwgNV0sIFsyLCAzLCA1XSwgWzMsIDQsIDVdKTtcbiAgICAgKiAvLyA9PiBbMSwgNCwgNV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB4b3IoKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgICBpZiAoaXNBcnJheShhcnJheSkgfHwgaXNBcmd1bWVudHMoYXJyYXkpKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IHJlc3VsdFxuICAgICAgICAgICAgPyBiYXNlVW5pcShiYXNlRGlmZmVyZW5jZShyZXN1bHQsIGFycmF5KS5jb25jYXQoYmFzZURpZmZlcmVuY2UoYXJyYXksIHJlc3VsdCkpKVxuICAgICAgICAgICAgOiBhcnJheTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdCB8fCBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIGdyb3VwZWQgZWxlbWVudHMsIHRoZSBmaXJzdCBvZiB3aGljaCBjb250YWlucyB0aGUgZmlyc3RcbiAgICAgKiBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gYXJyYXlzLCB0aGUgc2Vjb25kIG9mIHdoaWNoIGNvbnRhaW5zIHRoZSBzZWNvbmRcbiAgICAgKiBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gYXJyYXlzLCBhbmQgc28gb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgdW56aXBcbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5XSBBcnJheXMgdG8gcHJvY2Vzcy5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZ3JvdXBlZCBlbGVtZW50cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy56aXAoWydmcmVkJywgJ2Jhcm5leSddLCBbMzAsIDQwXSwgW3RydWUsIGZhbHNlXSk7XG4gICAgICogLy8gPT4gW1snZnJlZCcsIDMwLCB0cnVlXSwgWydiYXJuZXknLCA0MCwgZmFsc2VdXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHppcCgpIHtcbiAgICAgIHZhciBhcnJheSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzIDogYXJndW1lbnRzWzBdLFxuICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBtYXgocGx1Y2soYXJyYXksICdsZW5ndGgnKSkgOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoKTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IHBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIGZyb20gYXJyYXlzIG9mIGBrZXlzYCBhbmQgYHZhbHVlc2AuIFByb3ZpZGVcbiAgICAgKiBlaXRoZXIgYSBzaW5nbGUgdHdvIGRpbWVuc2lvbmFsIGFycmF5LCBpLmUuIGBbW2tleTEsIHZhbHVlMV0sIFtrZXkyLCB2YWx1ZTJdXWBcbiAgICAgKiBvciB0d28gYXJyYXlzLCBvbmUgb2YgYGtleXNgIGFuZCBvbmUgb2YgY29ycmVzcG9uZGluZyBgdmFsdWVzYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBvYmplY3RcbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBUaGUgYXJyYXkgb2Yga2V5cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzPVtdXSBUaGUgYXJyYXkgb2YgdmFsdWVzLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBnaXZlbiBrZXlzIGFuZFxuICAgICAqICBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy56aXBPYmplY3QoWydmcmVkJywgJ2Jhcm5leSddLCBbMzAsIDQwXSk7XG4gICAgICogLy8gPT4geyAnZnJlZCc6IDMwLCAnYmFybmV5JzogNDAgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHppcE9iamVjdChrZXlzLCB2YWx1ZXMpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGtleXMgPyBrZXlzLmxlbmd0aCA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0ge307XG5cbiAgICAgIGlmICghdmFsdWVzICYmIGxlbmd0aCAmJiAhaXNBcnJheShrZXlzWzBdKSkge1xuICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVzW2luZGV4XTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkpIHtcbiAgICAgICAgICByZXN1bHRba2V5WzBdXSA9IGtleVsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGV4ZWN1dGVzIGBmdW5jYCwgd2l0aCAgdGhlIGB0aGlzYCBiaW5kaW5nIGFuZFxuICAgICAqIGFyZ3VtZW50cyBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgb25seSBhZnRlciBiZWluZyBjYWxsZWQgYG5gIHRpbWVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdGhlIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGJlZm9yZVxuICAgICAqICBgZnVuY2AgaXMgZXhlY3V0ZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcmVzdHJpY3RlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHNhdmVzID0gWydwcm9maWxlJywgJ3NldHRpbmdzJ107XG4gICAgICpcbiAgICAgKiB2YXIgZG9uZSA9IF8uYWZ0ZXIoc2F2ZXMubGVuZ3RoLCBmdW5jdGlvbigpIHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKCdEb25lIHNhdmluZyEnKTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIF8uZm9yRWFjaChzYXZlcywgZnVuY3Rpb24odHlwZSkge1xuICAgICAqICAgYXN5bmNTYXZlKHsgJ3R5cGUnOiB0eXBlLCAnY29tcGxldGUnOiBkb25lIH0pO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IGxvZ3MgJ0RvbmUgc2F2aW5nIScsIGFmdGVyIGFsbCBzYXZlcyBoYXZlIGNvbXBsZXRlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFmdGVyKG4sIGZ1bmMpIHtcbiAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoLS1uIDwgMSkge1xuICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2BcbiAgICAgKiBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgcHJlcGVuZHMgYW55IGFkZGl0aW9uYWwgYGJpbmRgIGFyZ3VtZW50cyB0byB0aG9zZVxuICAgICAqIHByb3ZpZGVkIHRvIHRoZSBib3VuZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnXSBBcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYm91bmQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBmdW5jID0gZnVuY3Rpb24oZ3JlZXRpbmcpIHtcbiAgICAgKiAgIHJldHVybiBncmVldGluZyArICcgJyArIHRoaXMubmFtZTtcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogZnVuYyA9IF8uYmluZChmdW5jLCB7ICduYW1lJzogJ2ZyZWQnIH0sICdoaScpO1xuICAgICAqIGZ1bmMoKTtcbiAgICAgKiAvLyA9PiAnaGkgZnJlZCdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiaW5kKGZ1bmMsIHRoaXNBcmcpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMlxuICAgICAgICA/IGNyZWF0ZVdyYXBwZXIoZnVuYywgMTcsIHNsaWNlKGFyZ3VtZW50cywgMiksIG51bGwsIHRoaXNBcmcpXG4gICAgICAgIDogY3JlYXRlV3JhcHBlcihmdW5jLCAxLCBudWxsLCBudWxsLCB0aGlzQXJnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyBtZXRob2RzIG9mIGFuIG9iamVjdCB0byB0aGUgb2JqZWN0IGl0c2VsZiwgb3ZlcndyaXRpbmcgdGhlIGV4aXN0aW5nXG4gICAgICogbWV0aG9kLiBNZXRob2QgbmFtZXMgbWF5IGJlIHNwZWNpZmllZCBhcyBpbmRpdmlkdWFsIGFyZ3VtZW50cyBvciBhcyBhcnJheXNcbiAgICAgKiBvZiBtZXRob2QgbmFtZXMuIElmIG5vIG1ldGhvZCBuYW1lcyBhcmUgcHJvdmlkZWQgYWxsIHRoZSBmdW5jdGlvbiBwcm9wZXJ0aWVzXG4gICAgICogb2YgYG9iamVjdGAgd2lsbCBiZSBib3VuZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmluZCBhbmQgYXNzaWduIHRoZSBib3VuZCBtZXRob2RzIHRvLlxuICAgICAqIEBwYXJhbSB7Li4uc3RyaW5nfSBbbWV0aG9kTmFtZV0gVGhlIG9iamVjdCBtZXRob2QgbmFtZXMgdG9cbiAgICAgKiAgYmluZCwgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgbWV0aG9kIG5hbWVzIG9yIGFycmF5cyBvZiBtZXRob2QgbmFtZXMuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHZpZXcgPSB7XG4gICAgICogICAnbGFiZWwnOiAnZG9jcycsXG4gICAgICogICAnb25DbGljayc6IGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZygnY2xpY2tlZCAnICsgdGhpcy5sYWJlbCk7IH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5iaW5kQWxsKHZpZXcpO1xuICAgICAqIGpRdWVyeSgnI2RvY3MnKS5vbignY2xpY2snLCB2aWV3Lm9uQ2xpY2spO1xuICAgICAqIC8vID0+IGxvZ3MgJ2NsaWNrZWQgZG9jcycsIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmluZEFsbChvYmplY3QpIHtcbiAgICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCBmYWxzZSwgMSkgOiBmdW5jdGlvbnMob2JqZWN0KSxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGZ1bmNzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGZ1bmNzW2luZGV4XTtcbiAgICAgICAgb2JqZWN0W2tleV0gPSBjcmVhdGVXcmFwcGVyKG9iamVjdFtrZXldLCAxLCBudWxsLCBudWxsLCBvYmplY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsIGludm9rZXMgdGhlIG1ldGhvZCBhdCBgb2JqZWN0W2tleV1gXG4gICAgICogYW5kIHByZXBlbmRzIGFueSBhZGRpdGlvbmFsIGBiaW5kS2V5YCBhcmd1bWVudHMgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIGJvdW5kXG4gICAgICogZnVuY3Rpb24uIFRoaXMgbWV0aG9kIGRpZmZlcnMgZnJvbSBgXy5iaW5kYCBieSBhbGxvd2luZyBib3VuZCBmdW5jdGlvbnMgdG9cbiAgICAgKiByZWZlcmVuY2UgbWV0aG9kcyB0aGF0IHdpbGwgYmUgcmVkZWZpbmVkIG9yIGRvbid0IHlldCBleGlzdC5cbiAgICAgKiBTZWUgaHR0cDovL21pY2hhdXguY2EvYXJ0aWNsZXMvbGF6eS1mdW5jdGlvbi1kZWZpbml0aW9uLXBhdHRlcm4uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRoZSBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZC5cbiAgICAgKiBAcGFyYW0gey4uLip9IFthcmddIEFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBib3VuZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG9iamVjdCA9IHtcbiAgICAgKiAgICduYW1lJzogJ2ZyZWQnLFxuICAgICAqICAgJ2dyZWV0JzogZnVuY3Rpb24oZ3JlZXRpbmcpIHtcbiAgICAgKiAgICAgcmV0dXJuIGdyZWV0aW5nICsgJyAnICsgdGhpcy5uYW1lO1xuICAgICAqICAgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgZnVuYyA9IF8uYmluZEtleShvYmplY3QsICdncmVldCcsICdoaScpO1xuICAgICAqIGZ1bmMoKTtcbiAgICAgKiAvLyA9PiAnaGkgZnJlZCdcbiAgICAgKlxuICAgICAqIG9iamVjdC5ncmVldCA9IGZ1bmN0aW9uKGdyZWV0aW5nKSB7XG4gICAgICogICByZXR1cm4gZ3JlZXRpbmcgKyAneWEgJyArIHRoaXMubmFtZSArICchJztcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogZnVuYygpO1xuICAgICAqIC8vID0+ICdoaXlhIGZyZWQhJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJpbmRLZXkob2JqZWN0LCBrZXkpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMlxuICAgICAgICA/IGNyZWF0ZVdyYXBwZXIoa2V5LCAxOSwgc2xpY2UoYXJndW1lbnRzLCAyKSwgbnVsbCwgb2JqZWN0KVxuICAgICAgICA6IGNyZWF0ZVdyYXBwZXIoa2V5LCAzLCBudWxsLCBudWxsLCBvYmplY3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiB0aGUgcHJvdmlkZWQgZnVuY3Rpb25zLFxuICAgICAqIHdoZXJlIGVhY2ggZnVuY3Rpb24gY29uc3VtZXMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICAgICAqIEZvciBleGFtcGxlLCBjb21wb3NpbmcgdGhlIGZ1bmN0aW9ucyBgZigpYCwgYGcoKWAsIGFuZCBgaCgpYCBwcm9kdWNlcyBgZihnKGgoKSkpYC5cbiAgICAgKiBFYWNoIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBbZnVuY10gRnVuY3Rpb25zIHRvIGNvbXBvc2UuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29tcG9zZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciByZWFsTmFtZU1hcCA9IHtcbiAgICAgKiAgICdwZWJibGVzJzogJ3BlbmVsb3BlJ1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgZm9ybWF0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAqICAgbmFtZSA9IHJlYWxOYW1lTWFwW25hbWUudG9Mb3dlckNhc2UoKV0gfHwgbmFtZTtcbiAgICAgKiAgIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihmb3JtYXR0ZWQpIHtcbiAgICAgKiAgIHJldHVybiAnSGl5YSAnICsgZm9ybWF0dGVkICsgJyEnO1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgd2VsY29tZSA9IF8uY29tcG9zZShncmVldCwgZm9ybWF0KTtcbiAgICAgKiB3ZWxjb21lKCdwZWJibGVzJyk7XG4gICAgICogLy8gPT4gJ0hpeWEgUGVuZWxvcGUhJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gICAgICB2YXIgZnVuY3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgbGVuZ3RoID0gZnVuY3MubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmNzW2xlbmd0aF0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgIGxlbmd0aCA9IGZ1bmNzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICBhcmdzID0gW2Z1bmNzW2xlbmd0aF0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gd2hpY2ggYWNjZXB0cyBvbmUgb3IgbW9yZSBhcmd1bWVudHMgb2YgYGZ1bmNgIHRoYXQgd2hlblxuICAgICAqIGludm9rZWQgZWl0aGVyIGV4ZWN1dGVzIGBmdW5jYCByZXR1cm5pbmcgaXRzIHJlc3VsdCwgaWYgYWxsIGBmdW5jYCBhcmd1bWVudHNcbiAgICAgKiBoYXZlIGJlZW4gcHJvdmlkZWQsIG9yIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgb25lIG9yIG1vcmUgb2YgdGhlXG4gICAgICogcmVtYWluaW5nIGBmdW5jYCBhcmd1bWVudHMsIGFuZCBzbyBvbi4gVGhlIGFyaXR5IG9mIGBmdW5jYCBjYW4gYmUgc3BlY2lmaWVkXG4gICAgICogaWYgYGZ1bmMubGVuZ3RoYCBpcyBub3Qgc3VmZmljaWVudC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5PWZ1bmMubGVuZ3RoXSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGN1cnJpZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjdXJyaWVkID0gXy5jdXJyeShmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICogICBjb25zb2xlLmxvZyhhICsgYiArIGMpO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogY3VycmllZCgxKSgyKSgzKTtcbiAgICAgKiAvLyA9PiA2XG4gICAgICpcbiAgICAgKiBjdXJyaWVkKDEsIDIpKDMpO1xuICAgICAqIC8vID0+IDZcbiAgICAgKlxuICAgICAqIGN1cnJpZWQoMSwgMiwgMyk7XG4gICAgICogLy8gPT4gNlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGN1cnJ5KGZ1bmMsIGFyaXR5KSB7XG4gICAgICBhcml0eSA9IHR5cGVvZiBhcml0eSA9PSAnbnVtYmVyJyA/IGFyaXR5IDogKCthcml0eSB8fCBmdW5jLmxlbmd0aCk7XG4gICAgICByZXR1cm4gY3JlYXRlV3JhcHBlcihmdW5jLCA0LCBudWxsLCBudWxsLCBudWxsLCBhcml0eSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBkZWxheSB0aGUgZXhlY3V0aW9uIG9mIGBmdW5jYCB1bnRpbCBhZnRlclxuICAgICAqIGB3YWl0YCBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgaXQgd2FzIGludm9rZWQuXG4gICAgICogUHJvdmlkZSBhbiBvcHRpb25zIG9iamVjdCB0byBpbmRpY2F0ZSB0aGF0IGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvblxuICAgICAqIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gU3Vic2VxdWVudCBjYWxsc1xuICAgICAqIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgY2FsbC5cbiAgICAgKlxuICAgICAqIE5vdGU6IElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAgYGZ1bmNgIHdpbGwgYmUgY2FsbGVkXG4gICAgICogb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiBpc1xuICAgICAqIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBjYWxsZWQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXSBTcGVjaWZ5IGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXhcbiAgICAgKiB2YXIgbGF6eUxheW91dCA9IF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApO1xuICAgICAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBsYXp5TGF5b3V0KTtcbiAgICAgKlxuICAgICAqIC8vIGV4ZWN1dGUgYHNlbmRNYWlsYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzXG4gICAgICogalF1ZXJ5KCcjcG9zdGJveCcpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICAgICAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICAgICAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIGVuc3VyZSBgYmF0Y2hMb2dgIGlzIGV4ZWN1dGVkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzXG4gICAgICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICAgICAqIHNvdXJjZS5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7XG4gICAgICogICAnbWF4V2FpdCc6IDEwMDBcbiAgICAgKiB9LCBmYWxzZSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgdmFyIGFyZ3MsXG4gICAgICAgICAgbWF4VGltZW91dElkLFxuICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICBzdGFtcCxcbiAgICAgICAgICB0aGlzQXJnLFxuICAgICAgICAgIHRpbWVvdXRJZCxcbiAgICAgICAgICB0cmFpbGluZ0NhbGwsXG4gICAgICAgICAgbGFzdENhbGxlZCA9IDAsXG4gICAgICAgICAgbWF4V2FpdCA9IGZhbHNlLFxuICAgICAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICB9XG4gICAgICB3YWl0ID0gbmF0aXZlTWF4KDAsIHdhaXQpIHx8IDA7XG4gICAgICBpZiAob3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICB2YXIgbGVhZGluZyA9IHRydWU7XG4gICAgICAgIHRyYWlsaW5nID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgIGxlYWRpbmcgPSBvcHRpb25zLmxlYWRpbmc7XG4gICAgICAgIG1heFdhaXQgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucyAmJiAobmF0aXZlTWF4KHdhaXQsIG9wdGlvbnMubWF4V2FpdCkgfHwgMCk7XG4gICAgICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICAgICAgfVxuICAgICAgdmFyIGRlbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93KCkgLSBzdGFtcCk7XG4gICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICAgIGlmIChtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChtYXhUaW1lb3V0SWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaXNDYWxsZWQgPSB0cmFpbGluZ0NhbGw7XG4gICAgICAgICAgbWF4VGltZW91dElkID0gdGltZW91dElkID0gdHJhaWxpbmdDYWxsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICAgICAgbGFzdENhbGxlZCA9IG5vdygpO1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICAgICAgYXJncyA9IHRoaXNBcmcgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBtYXhEZWxheWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aW1lb3V0SWQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgfVxuICAgICAgICBtYXhUaW1lb3V0SWQgPSB0aW1lb3V0SWQgPSB0cmFpbGluZ0NhbGwgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh0cmFpbGluZyB8fCAobWF4V2FpdCAhPT0gd2FpdCkpIHtcbiAgICAgICAgICBsYXN0Q2FsbGVkID0gbm93KCk7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXRJZCAmJiAhbWF4VGltZW91dElkKSB7XG4gICAgICAgICAgICBhcmdzID0gdGhpc0FyZyA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHN0YW1wID0gbm93KCk7XG4gICAgICAgIHRoaXNBcmcgPSB0aGlzO1xuICAgICAgICB0cmFpbGluZ0NhbGwgPSB0cmFpbGluZyAmJiAodGltZW91dElkIHx8ICFsZWFkaW5nKTtcblxuICAgICAgICBpZiAobWF4V2FpdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB2YXIgbGVhZGluZ0NhbGwgPSBsZWFkaW5nICYmICF0aW1lb3V0SWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFtYXhUaW1lb3V0SWQgJiYgIWxlYWRpbmcpIHtcbiAgICAgICAgICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHJlbWFpbmluZyA9IG1heFdhaXQgLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKSxcbiAgICAgICAgICAgICAgaXNDYWxsZWQgPSByZW1haW5pbmcgPD0gMDtcblxuICAgICAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICAgICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgICAgICAgICBtYXhUaW1lb3V0SWQgPSBjbGVhclRpbWVvdXQobWF4VGltZW91dElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKCFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICAgIG1heFRpbWVvdXRJZCA9IHNldFRpbWVvdXQobWF4RGVsYXllZCwgcmVtYWluaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ2FsbGVkICYmIHRpbWVvdXRJZCkge1xuICAgICAgICAgIHRpbWVvdXRJZCA9IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aW1lb3V0SWQgJiYgd2FpdCAhPT0gbWF4V2FpdCkge1xuICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlYWRpbmdDYWxsKSB7XG4gICAgICAgICAgaXNDYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ2FsbGVkICYmICF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgICAgIGFyZ3MgPSB0aGlzQXJnID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWZlcnMgZXhlY3V0aW5nIHRoZSBgZnVuY2AgZnVuY3Rpb24gdW50aWwgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXMgY2xlYXJlZC5cbiAgICAgKiBBZGRpdGlvbmFsIGFyZ3VtZW50cyB3aWxsIGJlIHByb3ZpZGVkIHRvIGBmdW5jYCB3aGVuIGl0IGlzIGludm9rZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVmZXIuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnXSBBcmd1bWVudHMgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVyIGlkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmRlZmVyKGZ1bmN0aW9uKHRleHQpIHsgY29uc29sZS5sb2codGV4dCk7IH0sICdkZWZlcnJlZCcpO1xuICAgICAqIC8vIGxvZ3MgJ2RlZmVycmVkJyBhZnRlciBvbmUgb3IgbW9yZSBtaWxsaXNlY29uZHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWZlcihmdW5jKSB7XG4gICAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIH1cbiAgICAgIHZhciBhcmdzID0gc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7IH0sIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBgZnVuY2AgZnVuY3Rpb24gYWZ0ZXIgYHdhaXRgIG1pbGxpc2Vjb25kcy4gQWRkaXRpb25hbCBhcmd1bWVudHNcbiAgICAgKiB3aWxsIGJlIHByb3ZpZGVkIHRvIGBmdW5jYCB3aGVuIGl0IGlzIGludm9rZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVsYXkuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdhaXQgVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgZXhlY3V0aW9uLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lciBpZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5kZWxheShmdW5jdGlvbih0ZXh0KSB7IGNvbnNvbGUubG9nKHRleHQpOyB9LCAxMDAwLCAnbGF0ZXInKTtcbiAgICAgKiAvLyA9PiBsb2dzICdsYXRlcicgYWZ0ZXIgb25lIHNlY29uZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlbGF5KGZ1bmMsIHdhaXQpIHtcbiAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgdmFyIGFyZ3MgPSBzbGljZShhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTsgfSwgd2FpdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbWVtb2l6ZXMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuIElmIGByZXNvbHZlcmAgaXNcbiAgICAgKiBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBjYWNoZSBrZXkgZm9yIHN0b3JpbmcgdGhlIHJlc3VsdFxuICAgICAqIGJhc2VkIG9uIHRoZSBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGVcbiAgICAgKiBmaXJzdCBhcmd1bWVudCBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgY2FjaGUga2V5LlxuICAgICAqIFRoZSBgZnVuY2AgaXMgZXhlY3V0ZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIG1lbW9pemVkIGZ1bmN0aW9uLlxuICAgICAqIFRoZSByZXN1bHQgY2FjaGUgaXMgZXhwb3NlZCBhcyB0aGUgYGNhY2hlYCBwcm9wZXJ0eSBvbiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZXNvbHZlcl0gQSBmdW5jdGlvbiB1c2VkIHRvIHJlc29sdmUgdGhlIGNhY2hlIGtleS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXppbmcgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBmaWJvbmFjY2kgPSBfLm1lbW9pemUoZnVuY3Rpb24obikge1xuICAgICAqICAgcmV0dXJuIG4gPCAyID8gbiA6IGZpYm9uYWNjaShuIC0gMSkgKyBmaWJvbmFjY2kobiAtIDIpO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogZmlib25hY2NpKDkpXG4gICAgICogLy8gPT4gMzRcbiAgICAgKlxuICAgICAqIHZhciBkYXRhID0ge1xuICAgICAqICAgJ2ZyZWQnOiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfSxcbiAgICAgKiAgICdwZWJibGVzJzogeyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiAvLyBtb2RpZnlpbmcgdGhlIHJlc3VsdCBjYWNoZVxuICAgICAqIHZhciBnZXQgPSBfLm1lbW9pemUoZnVuY3Rpb24obmFtZSkgeyByZXR1cm4gZGF0YVtuYW1lXTsgfSwgXy5pZGVudGl0eSk7XG4gICAgICogZ2V0KCdwZWJibGVzJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEgfVxuICAgICAqXG4gICAgICogZ2V0LmNhY2hlLnBlYmJsZXMubmFtZSA9ICdwZW5lbG9wZSc7XG4gICAgICogZ2V0KCdwZWJibGVzJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdwZW5lbG9wZScsICdhZ2UnOiAxIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gICAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIH1cbiAgICAgIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2FjaGUgPSBtZW1vaXplZC5jYWNoZSxcbiAgICAgICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleVByZWZpeCArIGFyZ3VtZW50c1swXTtcblxuICAgICAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChjYWNoZSwga2V5KVxuICAgICAgICAgID8gY2FjaGVba2V5XVxuICAgICAgICAgIDogKGNhY2hlW2tleV0gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfVxuICAgICAgbWVtb2l6ZWQuY2FjaGUgPSB7fTtcbiAgICAgIHJldHVybiBtZW1vaXplZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGV4ZWN1dGUgYGZ1bmNgIG9uY2UuIFJlcGVhdCBjYWxscyB0b1xuICAgICAqIHRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGNhbGwuIFRoZSBgZnVuY2AgaXMgZXhlY3V0ZWRcbiAgICAgKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgaW5pdGlhbGl6ZSA9IF8ub25jZShjcmVhdGVBcHBsaWNhdGlvbik7XG4gICAgICogaW5pdGlhbGl6ZSgpO1xuICAgICAqIGluaXRpYWxpemUoKTtcbiAgICAgKiAvLyBgaW5pdGlhbGl6ZWAgZXhlY3V0ZXMgYGNyZWF0ZUFwcGxpY2F0aW9uYCBvbmNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25jZShmdW5jKSB7XG4gICAgICB2YXIgcmFuLFxuICAgICAgICAgIHJlc3VsdDtcblxuICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChyYW4pIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAvLyBjbGVhciB0aGUgYGZ1bmNgIHZhcmlhYmxlIHNvIHRoZSBmdW5jdGlvbiBtYXkgYmUgZ2FyYmFnZSBjb2xsZWN0ZWRcbiAgICAgICAgZnVuYyA9IG51bGw7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgaW52b2tlcyBgZnVuY2Agd2l0aCBhbnkgYWRkaXRpb25hbFxuICAgICAqIGBwYXJ0aWFsYCBhcmd1bWVudHMgcHJlcGVuZGVkIHRvIHRob3NlIHByb3ZpZGVkIHRvIHRoZSBuZXcgZnVuY3Rpb24uIFRoaXNcbiAgICAgKiBtZXRob2QgaXMgc2ltaWxhciB0byBgXy5iaW5kYCBleGNlcHQgaXQgZG9lcyAqKm5vdCoqIGFsdGVyIHRoZSBgdGhpc2AgYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwYXJ0aWFsbHkgYXBwbHkgYXJndW1lbnRzIHRvLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHBhcnRpYWxseSBhcHBsaWVkIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihncmVldGluZywgbmFtZSkgeyByZXR1cm4gZ3JlZXRpbmcgKyAnICcgKyBuYW1lOyB9O1xuICAgICAqIHZhciBoaSA9IF8ucGFydGlhbChncmVldCwgJ2hpJyk7XG4gICAgICogaGkoJ2ZyZWQnKTtcbiAgICAgKiAvLyA9PiAnaGkgZnJlZCdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJ0aWFsKGZ1bmMpIHtcbiAgICAgIHJldHVybiBjcmVhdGVXcmFwcGVyKGZ1bmMsIDE2LCBzbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnBhcnRpYWxgIGV4Y2VwdCB0aGF0IGBwYXJ0aWFsYCBhcmd1bWVudHMgYXJlXG4gICAgICogYXBwZW5kZWQgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwYXJ0aWFsbHkgYXBwbHkgYXJndW1lbnRzIHRvLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHBhcnRpYWxseSBhcHBsaWVkIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgZGVmYXVsdHNEZWVwID0gXy5wYXJ0aWFsUmlnaHQoXy5tZXJnZSwgXy5kZWZhdWx0cyk7XG4gICAgICpcbiAgICAgKiB2YXIgb3B0aW9ucyA9IHtcbiAgICAgKiAgICd2YXJpYWJsZSc6ICdkYXRhJyxcbiAgICAgKiAgICdpbXBvcnRzJzogeyAnanEnOiAkIH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogZGVmYXVsdHNEZWVwKG9wdGlvbnMsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG4gICAgICpcbiAgICAgKiBvcHRpb25zLnZhcmlhYmxlXG4gICAgICogLy8gPT4gJ2RhdGEnXG4gICAgICpcbiAgICAgKiBvcHRpb25zLmltcG9ydHNcbiAgICAgKiAvLyA9PiB7ICdfJzogXywgJ2pxJzogJCB9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFydGlhbFJpZ2h0KGZ1bmMpIHtcbiAgICAgIHJldHVybiBjcmVhdGVXcmFwcGVyKGZ1bmMsIDMyLCBudWxsLCBzbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBleGVjdXRlZCwgd2lsbCBvbmx5IGNhbGwgdGhlIGBmdW5jYCBmdW5jdGlvblxuICAgICAqIGF0IG1vc3Qgb25jZSBwZXIgZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gUHJvdmlkZSBhbiBvcHRpb25zIG9iamVjdCB0b1xuICAgICAqIGluZGljYXRlIHRoYXQgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlXG4gICAgICogb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbFxuICAgICAqIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBjYWxsLlxuICAgICAqXG4gICAgICogTm90ZTogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCBgZnVuY2Agd2lsbCBiZSBjYWxsZWRcbiAgICAgKiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIGlzXG4gICAgICogaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGV4ZWN1dGlvbnMgdG8uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPXRydWVdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXSBTcGVjaWZ5IGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGF2b2lkIGV4Y2Vzc2l2ZWx5IHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB3aGlsZSBzY3JvbGxpbmdcbiAgICAgKiB2YXIgdGhyb3R0bGVkID0gXy50aHJvdHRsZSh1cGRhdGVQb3NpdGlvbiwgMTAwKTtcbiAgICAgKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgdGhyb3R0bGVkKTtcbiAgICAgKlxuICAgICAqIC8vIGV4ZWN1dGUgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlc1xuICAgICAqIGpRdWVyeSgnLmludGVyYWN0aXZlJykub24oJ2NsaWNrJywgXy50aHJvdHRsZShyZW5ld1Rva2VuLCAzMDAwMDAsIHtcbiAgICAgKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gICAgICogfSkpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICAgIGxlYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gb3B0aW9ucy5sZWFkaW5nIDogbGVhZGluZztcbiAgICAgICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyBvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gICAgICB9XG4gICAgICBkZWJvdW5jZU9wdGlvbnMubGVhZGluZyA9IGxlYWRpbmc7XG4gICAgICBkZWJvdW5jZU9wdGlvbnMubWF4V2FpdCA9IHdhaXQ7XG4gICAgICBkZWJvdW5jZU9wdGlvbnMudHJhaWxpbmcgPSB0cmFpbGluZztcblxuICAgICAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGRlYm91bmNlT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcHJvdmlkZXMgYHZhbHVlYCB0byB0aGUgd3JhcHBlciBmdW5jdGlvbiBhcyBpdHNcbiAgICAgKiBmaXJzdCBhcmd1bWVudC4gQWRkaXRpb25hbCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGZ1bmN0aW9uIGFyZSBhcHBlbmRlZFxuICAgICAqIHRvIHRob3NlIHByb3ZpZGVkIHRvIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLiBUaGUgd3JhcHBlciBpcyBleGVjdXRlZCB3aXRoXG4gICAgICogdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gd3JhcHBlciBUaGUgd3JhcHBlciBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHAgPSBfLndyYXAoXy5lc2NhcGUsIGZ1bmN0aW9uKGZ1bmMsIHRleHQpIHtcbiAgICAgKiAgIHJldHVybiAnPHA+JyArIGZ1bmModGV4dCkgKyAnPC9wPic7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBwKCdGcmVkLCBXaWxtYSwgJiBQZWJibGVzJyk7XG4gICAgICogLy8gPT4gJzxwPkZyZWQsIFdpbG1hLCAmYW1wOyBQZWJibGVzPC9wPidcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB3cmFwKHZhbHVlLCB3cmFwcGVyKSB7XG4gICAgICByZXR1cm4gY3JlYXRlV3JhcHBlcih3cmFwcGVyLCAxNiwgW3ZhbHVlXSk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG9iamVjdCA9IHsgJ25hbWUnOiAnZnJlZCcgfTtcbiAgICAgKiB2YXIgZ2V0dGVyID0gXy5jb25zdGFudChvYmplY3QpO1xuICAgICAqIGdldHRlcigpID09PSBvYmplY3Q7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvZHVjZXMgYSBjYWxsYmFjayBib3VuZCB0byBhbiBvcHRpb25hbCBgdGhpc0FyZ2AuIElmIGBmdW5jYCBpcyBhIHByb3BlcnR5XG4gICAgICogbmFtZSB0aGUgY3JlYXRlZCBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgZm9yIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKiBJZiBgZnVuY2AgaXMgYW4gb2JqZWN0IHRoZSBjcmVhdGVkIGNhbGxiYWNrIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHNcbiAgICAgKiB0aGF0IGNvbnRhaW4gdGhlIGVxdWl2YWxlbnQgb2JqZWN0IHByb3BlcnRpZXMsIG90aGVyd2lzZSBpdCB3aWxsIHJldHVybiBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7Kn0gW2Z1bmM9aWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgY2FsbGJhY2suXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGNhbGxiYWNrLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRoZSBjYWxsYmFjayBhY2NlcHRzLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHdyYXAgdG8gY3JlYXRlIGN1c3RvbSBjYWxsYmFjayBzaG9ydGhhbmRzXG4gICAgICogXy5jcmVhdGVDYWxsYmFjayA9IF8ud3JhcChfLmNyZWF0ZUNhbGxiYWNrLCBmdW5jdGlvbihmdW5jLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAqICAgdmFyIG1hdGNoID0gL14oLis/KV9fKFtnbF10KSguKykkLy5leGVjKGNhbGxiYWNrKTtcbiAgICAgKiAgIHJldHVybiAhbWF0Y2ggPyBmdW5jKGNhbGxiYWNrLCB0aGlzQXJnKSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAqICAgICByZXR1cm4gbWF0Y2hbMl0gPT0gJ2d0JyA/IG9iamVjdFttYXRjaFsxXV0gPiBtYXRjaFszXSA6IG9iamVjdFttYXRjaFsxXV0gPCBtYXRjaFszXTtcbiAgICAgKiAgIH07XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBfLmZpbHRlcihjaGFyYWN0ZXJzLCAnYWdlX19ndDM4Jyk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUNhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gICAgICB2YXIgdHlwZSA9IHR5cGVvZiBmdW5jO1xuICAgICAgaWYgKGZ1bmMgPT0gbnVsbCB8fCB0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VDcmVhdGVDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCk7XG4gICAgICB9XG4gICAgICAvLyBoYW5kbGUgXCJfLnBsdWNrXCIgc3R5bGUgY2FsbGJhY2sgc2hvcnRoYW5kc1xuICAgICAgaWYgKHR5cGUgIT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KGZ1bmMpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BzID0ga2V5cyhmdW5jKSxcbiAgICAgICAgICBrZXkgPSBwcm9wc1swXSxcbiAgICAgICAgICBhID0gZnVuY1trZXldO1xuXG4gICAgICAvLyBoYW5kbGUgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2sgc2hvcnRoYW5kc1xuICAgICAgaWYgKHByb3BzLmxlbmd0aCA9PSAxICYmIGEgPT09IGEgJiYgIWlzT2JqZWN0KGEpKSB7XG4gICAgICAgIC8vIGZhc3QgcGF0aCB0aGUgY29tbW9uIGNhc2Ugb2YgcHJvdmlkaW5nIGFuIG9iamVjdCB3aXRoIGEgc2luZ2xlXG4gICAgICAgIC8vIHByb3BlcnR5IGNvbnRhaW5pbmcgYSBwcmltaXRpdmUgdmFsdWVcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgIHZhciBiID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgcmV0dXJuIGEgPT09IGIgJiYgKGEgIT09IDAgfHwgKDEgLyBhID09IDEgLyBiKSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIHZhciBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcblxuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBiYXNlSXNFcXVhbChvYmplY3RbcHJvcHNbbGVuZ3RoXV0sIGZ1bmNbcHJvcHNbbGVuZ3RoXV0sIG51bGwsIHRydWUpKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoZSBjaGFyYWN0ZXJzIGAmYCwgYDxgLCBgPmAsIGBcImAsIGFuZCBgJ2AgaW4gYHN0cmluZ2AgdG8gdGhlaXJcbiAgICAgKiBjb3JyZXNwb25kaW5nIEhUTUwgZW50aXRpZXMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGVzY2FwZS5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5lc2NhcGUoJ0ZyZWQsIFdpbG1hLCAmIFBlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiAnRnJlZCwgV2lsbWEsICZhbXA7IFBlYmJsZXMnXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXNjYXBlKHN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZyA9PSBudWxsID8gJycgOiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlVW5lc2NhcGVkSHRtbCwgZXNjYXBlSHRtbENoYXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIGl0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBvYmplY3QgPSB7ICduYW1lJzogJ2ZyZWQnIH07XG4gICAgICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBmdW5jdGlvbiBwcm9wZXJ0aWVzIG9mIGEgc291cmNlIG9iamVjdCB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIElmIGBvYmplY3RgIGlzIGEgZnVuY3Rpb24gbWV0aG9kcyB3aWxsIGJlIGFkZGVkIHRvIGl0cyBwcm90b3R5cGUgYXMgd2VsbC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW29iamVjdD1sb2Rhc2hdIG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBmdW5jdGlvbnMgdG8gYWRkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY2hhaW49dHJ1ZV0gU3BlY2lmeSB3aGV0aGVyIHRoZSBmdW5jdGlvbnMgYWRkZWQgYXJlIGNoYWluYWJsZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgICAgKiAgIHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBfLm1peGluKHsgJ2NhcGl0YWxpemUnOiBjYXBpdGFsaXplIH0pO1xuICAgICAqIF8uY2FwaXRhbGl6ZSgnZnJlZCcpO1xuICAgICAqIC8vID0+ICdGcmVkJ1xuICAgICAqXG4gICAgICogXygnZnJlZCcpLmNhcGl0YWxpemUoKS52YWx1ZSgpO1xuICAgICAqIC8vID0+ICdGcmVkJ1xuICAgICAqXG4gICAgICogXy5taXhpbih7ICdjYXBpdGFsaXplJzogY2FwaXRhbGl6ZSB9LCB7ICdjaGFpbic6IGZhbHNlIH0pO1xuICAgICAqIF8oJ2ZyZWQnKS5jYXBpdGFsaXplKCk7XG4gICAgICogLy8gPT4gJ0ZyZWQnXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWl4aW4ob2JqZWN0LCBzb3VyY2UsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBjaGFpbiA9IHRydWUsXG4gICAgICAgICAgbWV0aG9kTmFtZXMgPSBzb3VyY2UgJiYgZnVuY3Rpb25zKHNvdXJjZSk7XG5cbiAgICAgIGlmICghc291cmNlIHx8ICghb3B0aW9ucyAmJiAhbWV0aG9kTmFtZXMubGVuZ3RoKSkge1xuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgICBjdG9yID0gbG9kYXNoV3JhcHBlcjtcbiAgICAgICAgc291cmNlID0gb2JqZWN0O1xuICAgICAgICBvYmplY3QgPSBsb2Rhc2g7XG4gICAgICAgIG1ldGhvZE5hbWVzID0gZnVuY3Rpb25zKHNvdXJjZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgY2hhaW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucykgJiYgJ2NoYWluJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIGNoYWluID0gb3B0aW9ucy5jaGFpbjtcbiAgICAgIH1cbiAgICAgIHZhciBjdG9yID0gb2JqZWN0LFxuICAgICAgICAgIGlzRnVuYyA9IGlzRnVuY3Rpb24oY3Rvcik7XG5cbiAgICAgIGZvckVhY2gobWV0aG9kTmFtZXMsIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBvYmplY3RbbWV0aG9kTmFtZV0gPSBzb3VyY2VbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmIChpc0Z1bmMpIHtcbiAgICAgICAgICBjdG9yLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNoYWluQWxsID0gdGhpcy5fX2NoYWluX18sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9fd3JhcHBlZF9fLFxuICAgICAgICAgICAgICAgIGFyZ3MgPSBbdmFsdWVdO1xuXG4gICAgICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseShvYmplY3QsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKGNoYWluIHx8IGNoYWluQWxsKSB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gcmVzdWx0ICYmIGlzT2JqZWN0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXN1bHQgPSBuZXcgY3RvcihyZXN1bHQpO1xuICAgICAgICAgICAgICByZXN1bHQuX19jaGFpbl9fID0gY2hhaW5BbGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldmVydHMgdGhlICdfJyB2YXJpYWJsZSB0byBpdHMgcHJldmlvdXMgdmFsdWUgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG9cbiAgICAgKiB0aGUgYGxvZGFzaGAgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGxvZGFzaCA9IF8ubm9Db25mbGljdCgpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgICBjb250ZXh0Ll8gPSBvbGREYXNoO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBuby1vcGVyYXRpb24gZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBvYmplY3QgPSB7ICduYW1lJzogJ2ZyZWQnIH07XG4gICAgICogXy5ub29wKG9iamVjdCkgPT09IHVuZGVmaW5lZDtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm9vcCgpIHtcbiAgICAgIC8vIG5vIG9wZXJhdGlvbiBwZXJmb3JtZWRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBVbml4IGVwb2NoXG4gICAgICogKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBzdGFtcCA9IF8ubm93KCk7XG4gICAgICogXy5kZWZlcihmdW5jdGlvbigpIHsgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTsgfSk7XG4gICAgICogLy8gPT4gbG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXG4gICAgICovXG4gICAgdmFyIG5vdyA9IGlzTmF0aXZlKG5vdyA9IERhdGUubm93KSAmJiBub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoZSBnaXZlbiB2YWx1ZSBpbnRvIGFuIGludGVnZXIgb2YgdGhlIHNwZWNpZmllZCByYWRpeC5cbiAgICAgKiBJZiBgcmFkaXhgIGlzIGB1bmRlZmluZWRgIG9yIGAwYCBhIGByYWRpeGAgb2YgYDEwYCBpcyB1c2VkIHVubGVzcyB0aGVcbiAgICAgKiBgdmFsdWVgIGlzIGEgaGV4YWRlY2ltYWwsIGluIHdoaWNoIGNhc2UgYSBgcmFkaXhgIG9mIGAxNmAgaXMgdXNlZC5cbiAgICAgKlxuICAgICAqIE5vdGU6IFRoaXMgbWV0aG9kIGF2b2lkcyBkaWZmZXJlbmNlcyBpbiBuYXRpdmUgRVMzIGFuZCBFUzUgYHBhcnNlSW50YFxuICAgICAqIGltcGxlbWVudGF0aW9ucy4gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyNFLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcGFyc2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtyYWRpeF0gVGhlIHJhZGl4IHVzZWQgdG8gaW50ZXJwcmV0IHRoZSB2YWx1ZSB0byBwYXJzZS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBuZXcgaW50ZWdlciB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5wYXJzZUludCgnMDgnKTtcbiAgICAgKiAvLyA9PiA4XG4gICAgICovXG4gICAgdmFyIHBhcnNlSW50ID0gbmF0aXZlUGFyc2VJbnQod2hpdGVzcGFjZSArICcwOCcpID09IDggPyBuYXRpdmVQYXJzZUludCA6IGZ1bmN0aW9uKHZhbHVlLCByYWRpeCkge1xuICAgICAgLy8gRmlyZWZveCA8IDIxIGFuZCBPcGVyYSA8IDE1IGZvbGxvdyB0aGUgRVMzIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBvZiBgcGFyc2VJbnRgXG4gICAgICByZXR1cm4gbmF0aXZlUGFyc2VJbnQoaXNTdHJpbmcodmFsdWUpID8gdmFsdWUucmVwbGFjZShyZUxlYWRpbmdTcGFjZXNBbmRaZXJvcywgJycpIDogdmFsdWUsIHJhZGl4IHx8IDApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgXCJfLnBsdWNrXCIgc3R5bGUgZnVuY3Rpb24sIHdoaWNoIHJldHVybnMgdGhlIGBrZXlgIHZhbHVlIG9mIGFcbiAgICAgKiBnaXZlbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gcmV0cmlldmUuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogdmFyIGdldE5hbWUgPSBfLnByb3BlcnR5KCduYW1lJyk7XG4gICAgICpcbiAgICAgKiBfLm1hcChjaGFyYWN0ZXJzLCBnZXROYW1lKTtcbiAgICAgKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAgICAgKlxuICAgICAqIF8uc29ydEJ5KGNoYXJhY3RlcnMsIGdldE5hbWUpO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LCB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHByb3BlcnR5KGtleSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2R1Y2VzIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIGBtaW5gIGFuZCBgbWF4YCAoaW5jbHVzaXZlKS4gSWYgb25seSBvbmVcbiAgICAgKiBhcmd1bWVudCBpcyBwcm92aWRlZCBhIG51bWJlciBiZXR3ZWVuIGAwYCBhbmQgdGhlIGdpdmVuIG51bWJlciB3aWxsIGJlXG4gICAgICogcmV0dXJuZWQuIElmIGBmbG9hdGluZ2AgaXMgdHJ1ZXkgb3IgZWl0aGVyIGBtaW5gIG9yIGBtYXhgIGFyZSBmbG9hdHMgYVxuICAgICAqIGZsb2F0aW5nLXBvaW50IG51bWJlciB3aWxsIGJlIHJldHVybmVkIGluc3RlYWQgb2YgYW4gaW50ZWdlci5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21pbj0wXSBUaGUgbWluaW11bSBwb3NzaWJsZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21heD0xXSBUaGUgbWF4aW11bSBwb3NzaWJsZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtmbG9hdGluZz1mYWxzZV0gU3BlY2lmeSByZXR1cm5pbmcgYSBmbG9hdGluZy1wb2ludCBudW1iZXIuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBhIHJhbmRvbSBudW1iZXIuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ucmFuZG9tKDAsIDUpO1xuICAgICAqIC8vID0+IGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCA1XG4gICAgICpcbiAgICAgKiBfLnJhbmRvbSg1KTtcbiAgICAgKiAvLyA9PiBhbHNvIGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCA1XG4gICAgICpcbiAgICAgKiBfLnJhbmRvbSg1LCB0cnVlKTtcbiAgICAgKiAvLyA9PiBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBiZXR3ZWVuIDAgYW5kIDVcbiAgICAgKlxuICAgICAqIF8ucmFuZG9tKDEuMiwgNS4yKTtcbiAgICAgKiAvLyA9PiBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBiZXR3ZWVuIDEuMiBhbmQgNS4yXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4LCBmbG9hdGluZykge1xuICAgICAgdmFyIG5vTWluID0gbWluID09IG51bGwsXG4gICAgICAgICAgbm9NYXggPSBtYXggPT0gbnVsbDtcblxuICAgICAgaWYgKGZsb2F0aW5nID09IG51bGwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtaW4gPT0gJ2Jvb2xlYW4nICYmIG5vTWF4KSB7XG4gICAgICAgICAgZmxvYXRpbmcgPSBtaW47XG4gICAgICAgICAgbWluID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbm9NYXggJiYgdHlwZW9mIG1heCA9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBmbG9hdGluZyA9IG1heDtcbiAgICAgICAgICBub01heCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChub01pbiAmJiBub01heCkge1xuICAgICAgICBtYXggPSAxO1xuICAgICAgfVxuICAgICAgbWluID0gK21pbiB8fCAwO1xuICAgICAgaWYgKG5vTWF4KSB7XG4gICAgICAgIG1heCA9IG1pbjtcbiAgICAgICAgbWluID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1heCA9ICttYXggfHwgMDtcbiAgICAgIH1cbiAgICAgIGlmIChmbG9hdGluZyB8fCBtaW4gJSAxIHx8IG1heCAlIDEpIHtcbiAgICAgICAgdmFyIHJhbmQgPSBuYXRpdmVSYW5kb20oKTtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZU1pbihtaW4gKyAocmFuZCAqIChtYXggLSBtaW4gKyBwYXJzZUZsb2F0KCcxZS0nICsgKChyYW5kICsnJykubGVuZ3RoIC0gMSkpKSksIG1heCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZVJhbmRvbShtaW4sIG1heCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgdGhlIHZhbHVlIG9mIHByb3BlcnR5IGBrZXlgIG9uIGBvYmplY3RgLiBJZiBga2V5YCBpcyBhIGZ1bmN0aW9uXG4gICAgICogaXQgd2lsbCBiZSBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBvYmplY3RgIGFuZCBpdHMgcmVzdWx0IHJldHVybmVkLFxuICAgICAqIGVsc2UgdGhlIHByb3BlcnR5IHZhbHVlIGlzIHJldHVybmVkLiBJZiBgb2JqZWN0YCBpcyBmYWxzZXkgdGhlbiBgdW5kZWZpbmVkYFxuICAgICAqIGlzIHJldHVybmVkLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIHJlc29sdmUuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0ge1xuICAgICAqICAgJ2NoZWVzZSc6ICdjcnVtcGV0cycsXG4gICAgICogICAnc3R1ZmYnOiBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgcmV0dXJuICdub25zZW5zZSc7XG4gICAgICogICB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIF8ucmVzdWx0KG9iamVjdCwgJ2NoZWVzZScpO1xuICAgICAqIC8vID0+ICdjcnVtcGV0cydcbiAgICAgKlxuICAgICAqIF8ucmVzdWx0KG9iamVjdCwgJ3N0dWZmJyk7XG4gICAgICogLy8gPT4gJ25vbnNlbnNlJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc3VsdChvYmplY3QsIGtleSkge1xuICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odmFsdWUpID8gb2JqZWN0W2tleV0oKSA6IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgbWljcm8tdGVtcGxhdGluZyBtZXRob2QgdGhhdCBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXNcbiAgICAgKiB3aGl0ZXNwYWNlLCBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgICAgKlxuICAgICAqIE5vdGU6IEluIHRoZSBkZXZlbG9wbWVudCBidWlsZCwgYF8udGVtcGxhdGVgIHV0aWxpemVzIHNvdXJjZVVSTHMgZm9yIGVhc2llclxuICAgICAqIGRlYnVnZ2luZy4gU2VlIGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL2RldmVsb3BlcnRvb2xzL3NvdXJjZW1hcHMvI3RvYy1zb3VyY2V1cmxcbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHByZWNvbXBpbGluZyB0ZW1wbGF0ZXMgc2VlOlxuICAgICAqIGh0dHA6Ly9sb2Rhc2guY29tL2N1c3RvbS1idWlsZHNcbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIENocm9tZSBleHRlbnNpb24gc2FuZGJveGVzIHNlZTpcbiAgICAgKiBodHRwOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vc3RhYmxlL2V4dGVuc2lvbnMvc2FuZGJveGluZ0V2YWwuaHRtbFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZW1wbGF0ZSB0ZXh0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBkYXRhIG9iamVjdCB1c2VkIHRvIHBvcHVsYXRlIHRoZSB0ZXh0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSBbb3B0aW9ucy5lc2NhcGVdIFRoZSBcImVzY2FwZVwiIGRlbGltaXRlci5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gW29wdGlvbnMuZXZhbHVhdGVdIFRoZSBcImV2YWx1YXRlXCIgZGVsaW1pdGVyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5pbXBvcnRzXSBBbiBvYmplY3QgdG8gaW1wb3J0IGludG8gdGhlIHRlbXBsYXRlIGFzIGxvY2FsIHZhcmlhYmxlcy5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gW29wdGlvbnMuaW50ZXJwb2xhdGVdIFRoZSBcImludGVycG9sYXRlXCIgZGVsaW1pdGVyLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbc291cmNlVVJMXSBUaGUgc291cmNlVVJMIG9mIHRoZSB0ZW1wbGF0ZSdzIGNvbXBpbGVkIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhcmlhYmxlXSBUaGUgZGF0YSBvYmplY3QgdmFyaWFibGUgbmFtZS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb258c3RyaW5nfSBSZXR1cm5zIGEgY29tcGlsZWQgZnVuY3Rpb24gd2hlbiBubyBgZGF0YWAgb2JqZWN0XG4gICAgICogIGlzIGdpdmVuLCBlbHNlIGl0IHJldHVybnMgdGhlIGludGVycG9sYXRlZCB0ZXh0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgXCJpbnRlcnBvbGF0ZVwiIGRlbGltaXRlciB0byBjcmVhdGUgYSBjb21waWxlZCB0ZW1wbGF0ZVxuICAgICAqIHZhciBjb21waWxlZCA9IF8udGVtcGxhdGUoJ2hlbGxvIDwlPSBuYW1lICU+Jyk7XG4gICAgICogY29tcGlsZWQoeyAnbmFtZSc6ICdmcmVkJyB9KTtcbiAgICAgKiAvLyA9PiAnaGVsbG8gZnJlZCdcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIHRoZSBcImVzY2FwZVwiIGRlbGltaXRlciB0byBlc2NhcGUgSFRNTCBpbiBkYXRhIHByb3BlcnR5IHZhbHVlc1xuICAgICAqIF8udGVtcGxhdGUoJzxiPjwlLSB2YWx1ZSAlPjwvYj4nLCB7ICd2YWx1ZSc6ICc8c2NyaXB0PicgfSk7XG4gICAgICogLy8gPT4gJzxiPiZsdDtzY3JpcHQmZ3Q7PC9iPidcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIHRoZSBcImV2YWx1YXRlXCIgZGVsaW1pdGVyIHRvIGdlbmVyYXRlIEhUTUxcbiAgICAgKiB2YXIgbGlzdCA9ICc8JSBfLmZvckVhY2gocGVvcGxlLCBmdW5jdGlvbihuYW1lKSB7ICU+PGxpPjwlLSBuYW1lICU+PC9saT48JSB9KTsgJT4nO1xuICAgICAqIF8udGVtcGxhdGUobGlzdCwgeyAncGVvcGxlJzogWydmcmVkJywgJ2Jhcm5leSddIH0pO1xuICAgICAqIC8vID0+ICc8bGk+ZnJlZDwvbGk+PGxpPmJhcm5leTwvbGk+J1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIEVTNiBkZWxpbWl0ZXIgYXMgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIGRlZmF1bHQgXCJpbnRlcnBvbGF0ZVwiIGRlbGltaXRlclxuICAgICAqIF8udGVtcGxhdGUoJ2hlbGxvICR7IG5hbWUgfScsIHsgJ25hbWUnOiAncGViYmxlcycgfSk7XG4gICAgICogLy8gPT4gJ2hlbGxvIHBlYmJsZXMnXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgaW50ZXJuYWwgYHByaW50YCBmdW5jdGlvbiBpbiBcImV2YWx1YXRlXCIgZGVsaW1pdGVyc1xuICAgICAqIF8udGVtcGxhdGUoJzwlIHByaW50KFwiaGVsbG8gXCIgKyBuYW1lKTsgJT4hJywgeyAnbmFtZSc6ICdiYXJuZXknIH0pO1xuICAgICAqIC8vID0+ICdoZWxsbyBiYXJuZXkhJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgYSBjdXN0b20gdGVtcGxhdGUgZGVsaW1pdGVyc1xuICAgICAqIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICAgKiAgICdpbnRlcnBvbGF0ZSc6IC97eyhbXFxzXFxTXSs/KX19L2dcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy50ZW1wbGF0ZSgnaGVsbG8ge3sgbmFtZSB9fSEnLCB7ICduYW1lJzogJ211c3RhY2hlJyB9KTtcbiAgICAgKiAvLyA9PiAnaGVsbG8gbXVzdGFjaGUhJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIGBpbXBvcnRzYCBvcHRpb24gdG8gaW1wb3J0IGpRdWVyeVxuICAgICAqIHZhciBsaXN0ID0gJzwlIGpxLmVhY2gocGVvcGxlLCBmdW5jdGlvbihuYW1lKSB7ICU+PGxpPjwlLSBuYW1lICU+PC9saT48JSB9KTsgJT4nO1xuICAgICAqIF8udGVtcGxhdGUobGlzdCwgeyAncGVvcGxlJzogWydmcmVkJywgJ2Jhcm5leSddIH0sIHsgJ2ltcG9ydHMnOiB7ICdqcSc6IGpRdWVyeSB9IH0pO1xuICAgICAqIC8vID0+ICc8bGk+ZnJlZDwvbGk+PGxpPmJhcm5leTwvbGk+J1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIGBzb3VyY2VVUkxgIG9wdGlvbiB0byBzcGVjaWZ5IGEgY3VzdG9tIHNvdXJjZVVSTCBmb3IgdGhlIHRlbXBsYXRlXG4gICAgICogdmFyIGNvbXBpbGVkID0gXy50ZW1wbGF0ZSgnaGVsbG8gPCU9IG5hbWUgJT4nLCBudWxsLCB7ICdzb3VyY2VVUkwnOiAnL2Jhc2ljL2dyZWV0aW5nLmpzdCcgfSk7XG4gICAgICogY29tcGlsZWQoZGF0YSk7XG4gICAgICogLy8gPT4gZmluZCB0aGUgc291cmNlIG9mIFwiZ3JlZXRpbmcuanN0XCIgdW5kZXIgdGhlIFNvdXJjZXMgdGFiIG9yIFJlc291cmNlcyBwYW5lbCBvZiB0aGUgd2ViIGluc3BlY3RvclxuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIGB2YXJpYWJsZWAgb3B0aW9uIHRvIGVuc3VyZSBhIHdpdGgtc3RhdGVtZW50IGlzbid0IHVzZWQgaW4gdGhlIGNvbXBpbGVkIHRlbXBsYXRlXG4gICAgICogdmFyIGNvbXBpbGVkID0gXy50ZW1wbGF0ZSgnaGkgPCU9IGRhdGEubmFtZSAlPiEnLCBudWxsLCB7ICd2YXJpYWJsZSc6ICdkYXRhJyB9KTtcbiAgICAgKiBjb21waWxlZC5zb3VyY2U7XG4gICAgICogLy8gPT4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAqICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgICAqICAgX19wICs9ICdoaSAnICsgKChfX3QgPSAoIGRhdGEubmFtZSApKSA9PSBudWxsID8gJycgOiBfX3QpICsgJyEnO1xuICAgICAqICAgcmV0dXJuIF9fcDtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgYHNvdXJjZWAgcHJvcGVydHkgdG8gaW5saW5lIGNvbXBpbGVkIHRlbXBsYXRlcyBmb3IgbWVhbmluZ2Z1bFxuICAgICAqIC8vIGxpbmUgbnVtYmVycyBpbiBlcnJvciBtZXNzYWdlcyBhbmQgYSBzdGFjayB0cmFjZVxuICAgICAqIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGN3ZCwgJ2pzdC5qcycpLCAnXFxcbiAgICAgKiAgIHZhciBKU1QgPSB7XFxcbiAgICAgKiAgICAgXCJtYWluXCI6ICcgKyBfLnRlbXBsYXRlKG1haW5UZXh0KS5zb3VyY2UgKyAnXFxcbiAgICAgKiAgIH07XFxcbiAgICAgKiAnKTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZXh0LCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAvLyBiYXNlZCBvbiBKb2huIFJlc2lnJ3MgYHRtcGxgIGltcGxlbWVudGF0aW9uXG4gICAgICAvLyBodHRwOi8vZWpvaG4ub3JnL2Jsb2cvamF2YXNjcmlwdC1taWNyby10ZW1wbGF0aW5nL1xuICAgICAgLy8gYW5kIExhdXJhIERva3Rvcm92YSdzIGRvVC5qc1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL29sYWRvL2RvVFxuICAgICAgdmFyIHNldHRpbmdzID0gbG9kYXNoLnRlbXBsYXRlU2V0dGluZ3M7XG4gICAgICB0ZXh0ID0gU3RyaW5nKHRleHQgfHwgJycpO1xuXG4gICAgICAvLyBhdm9pZCBtaXNzaW5nIGRlcGVuZGVuY2llcyB3aGVuIGBpdGVyYXRvclRlbXBsYXRlYCBpcyBub3QgZGVmaW5lZFxuICAgICAgb3B0aW9ucyA9IGRlZmF1bHRzKHt9LCBvcHRpb25zLCBzZXR0aW5ncyk7XG5cbiAgICAgIHZhciBpbXBvcnRzID0gZGVmYXVsdHMoe30sIG9wdGlvbnMuaW1wb3J0cywgc2V0dGluZ3MuaW1wb3J0cyksXG4gICAgICAgICAgaW1wb3J0c0tleXMgPSBrZXlzKGltcG9ydHMpLFxuICAgICAgICAgIGltcG9ydHNWYWx1ZXMgPSB2YWx1ZXMoaW1wb3J0cyk7XG5cbiAgICAgIHZhciBpc0V2YWx1YXRpbmcsXG4gICAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICAgIGludGVycG9sYXRlID0gb3B0aW9ucy5pbnRlcnBvbGF0ZSB8fCByZU5vTWF0Y2gsXG4gICAgICAgICAgc291cmNlID0gXCJfX3AgKz0gJ1wiO1xuXG4gICAgICAvLyBjb21waWxlIHRoZSByZWdleHAgdG8gbWF0Y2ggZWFjaCBkZWxpbWl0ZXJcbiAgICAgIHZhciByZURlbGltaXRlcnMgPSBSZWdFeHAoXG4gICAgICAgIChvcHRpb25zLmVzY2FwZSB8fCByZU5vTWF0Y2gpLnNvdXJjZSArICd8JyArXG4gICAgICAgIGludGVycG9sYXRlLnNvdXJjZSArICd8JyArXG4gICAgICAgIChpbnRlcnBvbGF0ZSA9PT0gcmVJbnRlcnBvbGF0ZSA/IHJlRXNUZW1wbGF0ZSA6IHJlTm9NYXRjaCkuc291cmNlICsgJ3wnICtcbiAgICAgICAgKG9wdGlvbnMuZXZhbHVhdGUgfHwgcmVOb01hdGNoKS5zb3VyY2UgKyAnfCQnXG4gICAgICAsICdnJyk7XG5cbiAgICAgIHRleHQucmVwbGFjZShyZURlbGltaXRlcnMsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGVWYWx1ZSwgaW50ZXJwb2xhdGVWYWx1ZSwgZXNUZW1wbGF0ZVZhbHVlLCBldmFsdWF0ZVZhbHVlLCBvZmZzZXQpIHtcbiAgICAgICAgaW50ZXJwb2xhdGVWYWx1ZSB8fCAoaW50ZXJwb2xhdGVWYWx1ZSA9IGVzVGVtcGxhdGVWYWx1ZSk7XG5cbiAgICAgICAgLy8gZXNjYXBlIGNoYXJhY3RlcnMgdGhhdCBjYW5ub3QgYmUgaW5jbHVkZWQgaW4gc3RyaW5nIGxpdGVyYWxzXG4gICAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UocmVVbmVzY2FwZWRTdHJpbmcsIGVzY2FwZVN0cmluZ0NoYXIpO1xuXG4gICAgICAgIC8vIHJlcGxhY2UgZGVsaW1pdGVycyB3aXRoIHNuaXBwZXRzXG4gICAgICAgIGlmIChlc2NhcGVWYWx1ZSkge1xuICAgICAgICAgIHNvdXJjZSArPSBcIicgK1xcbl9fZShcIiArIGVzY2FwZVZhbHVlICsgXCIpICtcXG4nXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2YWx1YXRlVmFsdWUpIHtcbiAgICAgICAgICBpc0V2YWx1YXRpbmcgPSB0cnVlO1xuICAgICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZVZhbHVlICsgXCI7XFxuX19wICs9ICdcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJwb2xhdGVWYWx1ZSkge1xuICAgICAgICAgIHNvdXJjZSArPSBcIicgK1xcbigoX190ID0gKFwiICsgaW50ZXJwb2xhdGVWYWx1ZSArIFwiKSkgPT0gbnVsbCA/ICcnIDogX190KSArXFxuJ1wiO1xuICAgICAgICB9XG4gICAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICAgIC8vIHRoZSBKUyBlbmdpbmUgZW1iZWRkZWQgaW4gQWRvYmUgcHJvZHVjdHMgcmVxdWlyZXMgcmV0dXJuaW5nIHRoZSBgbWF0Y2hgXG4gICAgICAgIC8vIHN0cmluZyBpbiBvcmRlciB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IGBvZmZzZXRgIHZhbHVlXG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgIH0pO1xuXG4gICAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgICAvLyBpZiBgdmFyaWFibGVgIGlzIG5vdCBzcGVjaWZpZWQsIHdyYXAgYSB3aXRoLXN0YXRlbWVudCBhcm91bmQgdGhlIGdlbmVyYXRlZFxuICAgICAgLy8gY29kZSB0byBhZGQgdGhlIGRhdGEgb2JqZWN0IHRvIHRoZSB0b3Agb2YgdGhlIHNjb3BlIGNoYWluXG4gICAgICB2YXIgdmFyaWFibGUgPSBvcHRpb25zLnZhcmlhYmxlLFxuICAgICAgICAgIGhhc1ZhcmlhYmxlID0gdmFyaWFibGU7XG5cbiAgICAgIGlmICghaGFzVmFyaWFibGUpIHtcbiAgICAgICAgdmFyaWFibGUgPSAnb2JqJztcbiAgICAgICAgc291cmNlID0gJ3dpdGggKCcgKyB2YXJpYWJsZSArICcpIHtcXG4nICsgc291cmNlICsgJ1xcbn1cXG4nO1xuICAgICAgfVxuICAgICAgLy8gY2xlYW51cCBjb2RlIGJ5IHN0cmlwcGluZyBlbXB0eSBzdHJpbmdzXG4gICAgICBzb3VyY2UgPSAoaXNFdmFsdWF0aW5nID8gc291cmNlLnJlcGxhY2UocmVFbXB0eVN0cmluZ0xlYWRpbmcsICcnKSA6IHNvdXJjZSlcbiAgICAgICAgLnJlcGxhY2UocmVFbXB0eVN0cmluZ01pZGRsZSwgJyQxJylcbiAgICAgICAgLnJlcGxhY2UocmVFbXB0eVN0cmluZ1RyYWlsaW5nLCAnJDE7Jyk7XG5cbiAgICAgIC8vIGZyYW1lIGNvZGUgYXMgdGhlIGZ1bmN0aW9uIGJvZHlcbiAgICAgIHNvdXJjZSA9ICdmdW5jdGlvbignICsgdmFyaWFibGUgKyAnKSB7XFxuJyArXG4gICAgICAgIChoYXNWYXJpYWJsZSA/ICcnIDogdmFyaWFibGUgKyAnIHx8ICgnICsgdmFyaWFibGUgKyAnID0ge30pO1xcbicpICtcbiAgICAgICAgXCJ2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGVcIiArXG4gICAgICAgIChpc0V2YWx1YXRpbmdcbiAgICAgICAgICA/ICcsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xcbicgK1xuICAgICAgICAgICAgXCJmdW5jdGlvbiBwcmludCgpIHsgX19wICs9IF9fai5jYWxsKGFyZ3VtZW50cywgJycpIH1cXG5cIlxuICAgICAgICAgIDogJztcXG4nXG4gICAgICAgICkgK1xuICAgICAgICBzb3VyY2UgK1xuICAgICAgICAncmV0dXJuIF9fcFxcbn0nO1xuXG4gICAgICAvLyBVc2UgYSBzb3VyY2VVUkwgZm9yIGVhc2llciBkZWJ1Z2dpbmcuXG4gICAgICAvLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL3R1dG9yaWFscy9kZXZlbG9wZXJ0b29scy9zb3VyY2VtYXBzLyN0b2Mtc291cmNldXJsXG4gICAgICB2YXIgc291cmNlVVJMID0gJ1xcbi8qXFxuLy8jIHNvdXJjZVVSTD0nICsgKG9wdGlvbnMuc291cmNlVVJMIHx8ICcvbG9kYXNoL3RlbXBsYXRlL3NvdXJjZVsnICsgKHRlbXBsYXRlQ291bnRlcisrKSArICddJykgKyAnXFxuKi8nO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gRnVuY3Rpb24oaW1wb3J0c0tleXMsICdyZXR1cm4gJyArIHNvdXJjZSArIHNvdXJjZVVSTCkuYXBwbHkodW5kZWZpbmVkLCBpbXBvcnRzVmFsdWVzKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQoZGF0YSk7XG4gICAgICB9XG4gICAgICAvLyBwcm92aWRlIHRoZSBjb21waWxlZCBmdW5jdGlvbidzIHNvdXJjZSBieSBpdHMgYHRvU3RyaW5nYCBtZXRob2QsIGluXG4gICAgICAvLyBzdXBwb3J0ZWQgZW52aXJvbm1lbnRzLCBvciB0aGUgYHNvdXJjZWAgcHJvcGVydHkgYXMgYSBjb252ZW5pZW5jZSBmb3JcbiAgICAgIC8vIGlubGluaW5nIGNvbXBpbGVkIHRlbXBsYXRlcyBkdXJpbmcgdGhlIGJ1aWxkIHByb2Nlc3NcbiAgICAgIHJlc3VsdC5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBjYWxsYmFjayBgbmAgdGltZXMsIHJldHVybmluZyBhbiBhcnJheSBvZiB0aGUgcmVzdWx0c1xuICAgICAqIG9mIGVhY2ggY2FsbGJhY2sgZXhlY3V0aW9uLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkXG4gICAgICogd2l0aCBvbmUgYXJndW1lbnQ7IChpbmRleCkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBleGVjdXRlIHRoZSBjYWxsYmFjay5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSByZXN1bHRzIG9mIGVhY2ggYGNhbGxiYWNrYCBleGVjdXRpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBkaWNlUm9sbHMgPSBfLnRpbWVzKDMsIF8ucGFydGlhbChfLnJhbmRvbSwgMSwgNikpO1xuICAgICAqIC8vID0+IFszLCA2LCA0XVxuICAgICAqXG4gICAgICogXy50aW1lcygzLCBmdW5jdGlvbihuKSB7IG1hZ2UuY2FzdFNwZWxsKG4pOyB9KTtcbiAgICAgKiAvLyA9PiBjYWxscyBgbWFnZS5jYXN0U3BlbGwobilgIHRocmVlIHRpbWVzLCBwYXNzaW5nIGBuYCBvZiBgMGAsIGAxYCwgYW5kIGAyYCByZXNwZWN0aXZlbHlcbiAgICAgKlxuICAgICAqIF8udGltZXMoMywgZnVuY3Rpb24obikgeyB0aGlzLmNhc3Qobik7IH0sIG1hZ2UpO1xuICAgICAqIC8vID0+IGFsc28gY2FsbHMgYG1hZ2UuY2FzdFNwZWxsKG4pYCB0aHJlZSB0aW1lc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRpbWVzKG4sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICBuID0gKG4gPSArbikgPiAtMSA/IG4gOiAwO1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgICAgIGNhbGxiYWNrID0gYmFzZUNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAxKTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gY2FsbGJhY2soaW5kZXgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW52ZXJzZSBvZiBgXy5lc2NhcGVgIHRoaXMgbWV0aG9kIGNvbnZlcnRzIHRoZSBIVE1MIGVudGl0aWVzXG4gICAgICogYCZhbXA7YCwgYCZsdDtgLCBgJmd0O2AsIGAmcXVvdDtgLCBhbmQgYCYjMzk7YCBpbiBgc3RyaW5nYCB0byB0aGVpclxuICAgICAqIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVycy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gdW5lc2NhcGUuXG4gICAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIHN0cmluZy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy51bmVzY2FwZSgnRnJlZCwgQmFybmV5ICZhbXA7IFBlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiAnRnJlZCwgQmFybmV5ICYgUGViYmxlcydcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmVzY2FwZShzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzdHJpbmcgPT0gbnVsbCA/ICcnIDogU3RyaW5nKHN0cmluZykucmVwbGFjZShyZUVzY2FwZWRIdG1sLCB1bmVzY2FwZUh0bWxDaGFyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSB1bmlxdWUgSUQuIElmIGBwcmVmaXhgIGlzIHByb3ZpZGVkIHRoZSBJRCB3aWxsIGJlIGFwcGVuZGVkIHRvIGl0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcHJlZml4XSBUaGUgdmFsdWUgdG8gcHJlZml4IHRoZSBJRCB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuaXF1ZSBJRC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy51bmlxdWVJZCgnY29udGFjdF8nKTtcbiAgICAgKiAvLyA9PiAnY29udGFjdF8xMDQnXG4gICAgICpcbiAgICAgKiBfLnVuaXF1ZUlkKCk7XG4gICAgICogLy8gPT4gJzEwNSdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgICAgIHZhciBpZCA9ICsraWRDb3VudGVyO1xuICAgICAgcmV0dXJuIFN0cmluZyhwcmVmaXggPT0gbnVsbCA/ICcnIDogcHJlZml4KSArIGlkO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGBsb2Rhc2hgIG9iamVjdCB0aGF0IHdyYXBzIHRoZSBnaXZlbiB2YWx1ZSB3aXRoIGV4cGxpY2l0XG4gICAgICogbWV0aG9kIGNoYWluaW5nIGVuYWJsZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ2hhaW5pbmdcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHdyYXBwZXIgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdhZ2UnOiAzNiB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAgJ2FnZSc6IDQwIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIHZhciB5b3VuZ2VzdCA9IF8uY2hhaW4oY2hhcmFjdGVycylcbiAgICAgKiAgICAgLnNvcnRCeSgnYWdlJylcbiAgICAgKiAgICAgLm1hcChmdW5jdGlvbihjaHIpIHsgcmV0dXJuIGNoci5uYW1lICsgJyBpcyAnICsgY2hyLmFnZTsgfSlcbiAgICAgKiAgICAgLmZpcnN0KClcbiAgICAgKiAgICAgLnZhbHVlKCk7XG4gICAgICogLy8gPT4gJ3BlYmJsZXMgaXMgMSdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGFpbih2YWx1ZSkge1xuICAgICAgdmFsdWUgPSBuZXcgbG9kYXNoV3JhcHBlcih2YWx1ZSk7XG4gICAgICB2YWx1ZS5fX2NoYWluX18gPSB0cnVlO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZXMgYGludGVyY2VwdG9yYCB3aXRoIHRoZSBgdmFsdWVgIGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQgdGhlblxuICAgICAqIHJldHVybnMgYHZhbHVlYC4gVGhlIHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kXG4gICAgICogY2hhaW4gaW4gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpblxuICAgICAqIHRoZSBjaGFpbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb3ZpZGUgdG8gYGludGVyY2VwdG9yYC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpbnRlcmNlcHRvciBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8oWzEsIDIsIDMsIDRdKVxuICAgICAqICAudGFwKGZ1bmN0aW9uKGFycmF5KSB7IGFycmF5LnBvcCgpOyB9KVxuICAgICAqICAucmV2ZXJzZSgpXG4gICAgICogIC52YWx1ZSgpO1xuICAgICAqIC8vID0+IFszLCAyLCAxXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRhcCh2YWx1ZSwgaW50ZXJjZXB0b3IpIHtcbiAgICAgIGludGVyY2VwdG9yKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzIGV4cGxpY2l0IG1ldGhvZCBjaGFpbmluZyBvbiB0aGUgd3JhcHBlciBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBjaGFpblxuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENoYWluaW5nXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHdyYXBwZXIgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHdpdGhvdXQgZXhwbGljaXQgY2hhaW5pbmdcbiAgICAgKiBfKGNoYXJhY3RlcnMpLmZpcnN0KCk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfVxuICAgICAqXG4gICAgICogLy8gd2l0aCBleHBsaWNpdCBjaGFpbmluZ1xuICAgICAqIF8oY2hhcmFjdGVycykuY2hhaW4oKVxuICAgICAqICAgLmZpcnN0KClcbiAgICAgKiAgIC5waWNrKCdhZ2UnKVxuICAgICAqICAgLnZhbHVlKCk7XG4gICAgICogLy8gPT4geyAnYWdlJzogMzYgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdyYXBwZXJDaGFpbigpIHtcbiAgICAgIHRoaXMuX19jaGFpbl9fID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2R1Y2VzIHRoZSBgdG9TdHJpbmdgIHJlc3VsdCBvZiB0aGUgd3JhcHBlZCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBuYW1lIHRvU3RyaW5nXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ2hhaW5pbmdcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcgcmVzdWx0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfKFsxLCAyLCAzXSkudG9TdHJpbmcoKTtcbiAgICAgKiAvLyA9PiAnMSwyLDMnXG4gICAgICovXG4gICAgZnVuY3Rpb24gd3JhcHBlclRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLl9fd3JhcHBlZF9fKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0cyB0aGUgd3JhcHBlZCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBuYW1lIHZhbHVlT2ZcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyB2YWx1ZVxuICAgICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB3cmFwcGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfKFsxLCAyLCAzXSkudmFsdWVPZigpO1xuICAgICAqIC8vID0+IFsxLCAyLCAzXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdyYXBwZXJWYWx1ZU9mKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX193cmFwcGVkX187XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBhZGQgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIHdyYXBwZWQgdmFsdWVzIHdoZW4gY2hhaW5pbmdcbiAgICBsb2Rhc2guYWZ0ZXIgPSBhZnRlcjtcbiAgICBsb2Rhc2guYXNzaWduID0gYXNzaWduO1xuICAgIGxvZGFzaC5hdCA9IGF0O1xuICAgIGxvZGFzaC5iaW5kID0gYmluZDtcbiAgICBsb2Rhc2guYmluZEFsbCA9IGJpbmRBbGw7XG4gICAgbG9kYXNoLmJpbmRLZXkgPSBiaW5kS2V5O1xuICAgIGxvZGFzaC5jaGFpbiA9IGNoYWluO1xuICAgIGxvZGFzaC5jb21wYWN0ID0gY29tcGFjdDtcbiAgICBsb2Rhc2guY29tcG9zZSA9IGNvbXBvc2U7XG4gICAgbG9kYXNoLmNvbnN0YW50ID0gY29uc3RhbnQ7XG4gICAgbG9kYXNoLmNvdW50QnkgPSBjb3VudEJ5O1xuICAgIGxvZGFzaC5jcmVhdGUgPSBjcmVhdGU7XG4gICAgbG9kYXNoLmNyZWF0ZUNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2s7XG4gICAgbG9kYXNoLmN1cnJ5ID0gY3Vycnk7XG4gICAgbG9kYXNoLmRlYm91bmNlID0gZGVib3VuY2U7XG4gICAgbG9kYXNoLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgbG9kYXNoLmRlZmVyID0gZGVmZXI7XG4gICAgbG9kYXNoLmRlbGF5ID0gZGVsYXk7XG4gICAgbG9kYXNoLmRpZmZlcmVuY2UgPSBkaWZmZXJlbmNlO1xuICAgIGxvZGFzaC5maWx0ZXIgPSBmaWx0ZXI7XG4gICAgbG9kYXNoLmZsYXR0ZW4gPSBmbGF0dGVuO1xuICAgIGxvZGFzaC5mb3JFYWNoID0gZm9yRWFjaDtcbiAgICBsb2Rhc2guZm9yRWFjaFJpZ2h0ID0gZm9yRWFjaFJpZ2h0O1xuICAgIGxvZGFzaC5mb3JJbiA9IGZvckluO1xuICAgIGxvZGFzaC5mb3JJblJpZ2h0ID0gZm9ySW5SaWdodDtcbiAgICBsb2Rhc2guZm9yT3duID0gZm9yT3duO1xuICAgIGxvZGFzaC5mb3JPd25SaWdodCA9IGZvck93blJpZ2h0O1xuICAgIGxvZGFzaC5mdW5jdGlvbnMgPSBmdW5jdGlvbnM7XG4gICAgbG9kYXNoLmdyb3VwQnkgPSBncm91cEJ5O1xuICAgIGxvZGFzaC5pbmRleEJ5ID0gaW5kZXhCeTtcbiAgICBsb2Rhc2guaW5pdGlhbCA9IGluaXRpYWw7XG4gICAgbG9kYXNoLmludGVyc2VjdGlvbiA9IGludGVyc2VjdGlvbjtcbiAgICBsb2Rhc2guaW52ZXJ0ID0gaW52ZXJ0O1xuICAgIGxvZGFzaC5pbnZva2UgPSBpbnZva2U7XG4gICAgbG9kYXNoLmtleXMgPSBrZXlzO1xuICAgIGxvZGFzaC5tYXAgPSBtYXA7XG4gICAgbG9kYXNoLm1hcFZhbHVlcyA9IG1hcFZhbHVlcztcbiAgICBsb2Rhc2gubWF4ID0gbWF4O1xuICAgIGxvZGFzaC5tZW1vaXplID0gbWVtb2l6ZTtcbiAgICBsb2Rhc2gubWVyZ2UgPSBtZXJnZTtcbiAgICBsb2Rhc2gubWluID0gbWluO1xuICAgIGxvZGFzaC5vbWl0ID0gb21pdDtcbiAgICBsb2Rhc2gub25jZSA9IG9uY2U7XG4gICAgbG9kYXNoLnBhaXJzID0gcGFpcnM7XG4gICAgbG9kYXNoLnBhcnRpYWwgPSBwYXJ0aWFsO1xuICAgIGxvZGFzaC5wYXJ0aWFsUmlnaHQgPSBwYXJ0aWFsUmlnaHQ7XG4gICAgbG9kYXNoLnBpY2sgPSBwaWNrO1xuICAgIGxvZGFzaC5wbHVjayA9IHBsdWNrO1xuICAgIGxvZGFzaC5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgIGxvZGFzaC5wdWxsID0gcHVsbDtcbiAgICBsb2Rhc2gucmFuZ2UgPSByYW5nZTtcbiAgICBsb2Rhc2gucmVqZWN0ID0gcmVqZWN0O1xuICAgIGxvZGFzaC5yZW1vdmUgPSByZW1vdmU7XG4gICAgbG9kYXNoLnJlc3QgPSByZXN0O1xuICAgIGxvZGFzaC5zaHVmZmxlID0gc2h1ZmZsZTtcbiAgICBsb2Rhc2guc29ydEJ5ID0gc29ydEJ5O1xuICAgIGxvZGFzaC50YXAgPSB0YXA7XG4gICAgbG9kYXNoLnRocm90dGxlID0gdGhyb3R0bGU7XG4gICAgbG9kYXNoLnRpbWVzID0gdGltZXM7XG4gICAgbG9kYXNoLnRvQXJyYXkgPSB0b0FycmF5O1xuICAgIGxvZGFzaC50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgbG9kYXNoLnVuaW9uID0gdW5pb247XG4gICAgbG9kYXNoLnVuaXEgPSB1bmlxO1xuICAgIGxvZGFzaC52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgbG9kYXNoLndoZXJlID0gd2hlcmU7XG4gICAgbG9kYXNoLndpdGhvdXQgPSB3aXRob3V0O1xuICAgIGxvZGFzaC53cmFwID0gd3JhcDtcbiAgICBsb2Rhc2gueG9yID0geG9yO1xuICAgIGxvZGFzaC56aXAgPSB6aXA7XG4gICAgbG9kYXNoLnppcE9iamVjdCA9IHppcE9iamVjdDtcblxuICAgIC8vIGFkZCBhbGlhc2VzXG4gICAgbG9kYXNoLmNvbGxlY3QgPSBtYXA7XG4gICAgbG9kYXNoLmRyb3AgPSByZXN0O1xuICAgIGxvZGFzaC5lYWNoID0gZm9yRWFjaDtcbiAgICBsb2Rhc2guZWFjaFJpZ2h0ID0gZm9yRWFjaFJpZ2h0O1xuICAgIGxvZGFzaC5leHRlbmQgPSBhc3NpZ247XG4gICAgbG9kYXNoLm1ldGhvZHMgPSBmdW5jdGlvbnM7XG4gICAgbG9kYXNoLm9iamVjdCA9IHppcE9iamVjdDtcbiAgICBsb2Rhc2guc2VsZWN0ID0gZmlsdGVyO1xuICAgIGxvZGFzaC50YWlsID0gcmVzdDtcbiAgICBsb2Rhc2gudW5pcXVlID0gdW5pcTtcbiAgICBsb2Rhc2gudW56aXAgPSB6aXA7XG5cbiAgICAvLyBhZGQgZnVuY3Rpb25zIHRvIGBsb2Rhc2gucHJvdG90eXBlYFxuICAgIG1peGluKGxvZGFzaCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIGFkZCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gdW53cmFwcGVkIHZhbHVlcyB3aGVuIGNoYWluaW5nXG4gICAgbG9kYXNoLmNsb25lID0gY2xvbmU7XG4gICAgbG9kYXNoLmNsb25lRGVlcCA9IGNsb25lRGVlcDtcbiAgICBsb2Rhc2guY29udGFpbnMgPSBjb250YWlucztcbiAgICBsb2Rhc2guZXNjYXBlID0gZXNjYXBlO1xuICAgIGxvZGFzaC5ldmVyeSA9IGV2ZXJ5O1xuICAgIGxvZGFzaC5maW5kID0gZmluZDtcbiAgICBsb2Rhc2guZmluZEluZGV4ID0gZmluZEluZGV4O1xuICAgIGxvZGFzaC5maW5kS2V5ID0gZmluZEtleTtcbiAgICBsb2Rhc2guZmluZExhc3QgPSBmaW5kTGFzdDtcbiAgICBsb2Rhc2guZmluZExhc3RJbmRleCA9IGZpbmRMYXN0SW5kZXg7XG4gICAgbG9kYXNoLmZpbmRMYXN0S2V5ID0gZmluZExhc3RLZXk7XG4gICAgbG9kYXNoLmhhcyA9IGhhcztcbiAgICBsb2Rhc2guaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICBsb2Rhc2guaW5kZXhPZiA9IGluZGV4T2Y7XG4gICAgbG9kYXNoLmlzQXJndW1lbnRzID0gaXNBcmd1bWVudHM7XG4gICAgbG9kYXNoLmlzQXJyYXkgPSBpc0FycmF5O1xuICAgIGxvZGFzaC5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG4gICAgbG9kYXNoLmlzRGF0ZSA9IGlzRGF0ZTtcbiAgICBsb2Rhc2guaXNFbGVtZW50ID0gaXNFbGVtZW50O1xuICAgIGxvZGFzaC5pc0VtcHR5ID0gaXNFbXB0eTtcbiAgICBsb2Rhc2guaXNFcXVhbCA9IGlzRXF1YWw7XG4gICAgbG9kYXNoLmlzRmluaXRlID0gaXNGaW5pdGU7XG4gICAgbG9kYXNoLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuICAgIGxvZGFzaC5pc05hTiA9IGlzTmFOO1xuICAgIGxvZGFzaC5pc051bGwgPSBpc051bGw7XG4gICAgbG9kYXNoLmlzTnVtYmVyID0gaXNOdW1iZXI7XG4gICAgbG9kYXNoLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG4gICAgbG9kYXNoLmlzUGxhaW5PYmplY3QgPSBpc1BsYWluT2JqZWN0O1xuICAgIGxvZGFzaC5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuICAgIGxvZGFzaC5pc1N0cmluZyA9IGlzU3RyaW5nO1xuICAgIGxvZGFzaC5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuICAgIGxvZGFzaC5sYXN0SW5kZXhPZiA9IGxhc3RJbmRleE9mO1xuICAgIGxvZGFzaC5taXhpbiA9IG1peGluO1xuICAgIGxvZGFzaC5ub0NvbmZsaWN0ID0gbm9Db25mbGljdDtcbiAgICBsb2Rhc2gubm9vcCA9IG5vb3A7XG4gICAgbG9kYXNoLm5vdyA9IG5vdztcbiAgICBsb2Rhc2gucGFyc2VJbnQgPSBwYXJzZUludDtcbiAgICBsb2Rhc2gucmFuZG9tID0gcmFuZG9tO1xuICAgIGxvZGFzaC5yZWR1Y2UgPSByZWR1Y2U7XG4gICAgbG9kYXNoLnJlZHVjZVJpZ2h0ID0gcmVkdWNlUmlnaHQ7XG4gICAgbG9kYXNoLnJlc3VsdCA9IHJlc3VsdDtcbiAgICBsb2Rhc2gucnVuSW5Db250ZXh0ID0gcnVuSW5Db250ZXh0O1xuICAgIGxvZGFzaC5zaXplID0gc2l6ZTtcbiAgICBsb2Rhc2guc29tZSA9IHNvbWU7XG4gICAgbG9kYXNoLnNvcnRlZEluZGV4ID0gc29ydGVkSW5kZXg7XG4gICAgbG9kYXNoLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgbG9kYXNoLnVuZXNjYXBlID0gdW5lc2NhcGU7XG4gICAgbG9kYXNoLnVuaXF1ZUlkID0gdW5pcXVlSWQ7XG5cbiAgICAvLyBhZGQgYWxpYXNlc1xuICAgIGxvZGFzaC5hbGwgPSBldmVyeTtcbiAgICBsb2Rhc2guYW55ID0gc29tZTtcbiAgICBsb2Rhc2guZGV0ZWN0ID0gZmluZDtcbiAgICBsb2Rhc2guZmluZFdoZXJlID0gZmluZDtcbiAgICBsb2Rhc2guZm9sZGwgPSByZWR1Y2U7XG4gICAgbG9kYXNoLmZvbGRyID0gcmVkdWNlUmlnaHQ7XG4gICAgbG9kYXNoLmluY2x1ZGUgPSBjb250YWlucztcbiAgICBsb2Rhc2guaW5qZWN0ID0gcmVkdWNlO1xuXG4gICAgbWl4aW4oZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc291cmNlID0ge31cbiAgICAgIGZvck93bihsb2Rhc2gsIGZ1bmN0aW9uKGZ1bmMsIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgaWYgKCFsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdKSB7XG4gICAgICAgICAgc291cmNlW21ldGhvZE5hbWVdID0gZnVuYztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gc291cmNlO1xuICAgIH0oKSwgZmFsc2UpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBhZGQgZnVuY3Rpb25zIGNhcGFibGUgb2YgcmV0dXJuaW5nIHdyYXBwZWQgYW5kIHVud3JhcHBlZCB2YWx1ZXMgd2hlbiBjaGFpbmluZ1xuICAgIGxvZGFzaC5maXJzdCA9IGZpcnN0O1xuICAgIGxvZGFzaC5sYXN0ID0gbGFzdDtcbiAgICBsb2Rhc2guc2FtcGxlID0gc2FtcGxlO1xuXG4gICAgLy8gYWRkIGFsaWFzZXNcbiAgICBsb2Rhc2gudGFrZSA9IGZpcnN0O1xuICAgIGxvZGFzaC5oZWFkID0gZmlyc3Q7XG5cbiAgICBmb3JPd24obG9kYXNoLCBmdW5jdGlvbihmdW5jLCBtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgY2FsbGJhY2thYmxlID0gbWV0aG9kTmFtZSAhPT0gJ3NhbXBsZSc7XG4gICAgICBpZiAoIWxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0pIHtcbiAgICAgICAgbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXT0gZnVuY3Rpb24obiwgZ3VhcmQpIHtcbiAgICAgICAgICB2YXIgY2hhaW5BbGwgPSB0aGlzLl9fY2hhaW5fXyxcbiAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYyh0aGlzLl9fd3JhcHBlZF9fLCBuLCBndWFyZCk7XG5cbiAgICAgICAgICByZXR1cm4gIWNoYWluQWxsICYmIChuID09IG51bGwgfHwgKGd1YXJkICYmICEoY2FsbGJhY2thYmxlICYmIHR5cGVvZiBuID09ICdmdW5jdGlvbicpKSlcbiAgICAgICAgICAgID8gcmVzdWx0XG4gICAgICAgICAgICA6IG5ldyBsb2Rhc2hXcmFwcGVyKHJlc3VsdCwgY2hhaW5BbGwpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2VtYW50aWMgdmVyc2lvbiBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgKi9cbiAgICBsb2Rhc2guVkVSU0lPTiA9ICcyLjQuMSc7XG5cbiAgICAvLyBhZGQgXCJDaGFpbmluZ1wiIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlclxuICAgIGxvZGFzaC5wcm90b3R5cGUuY2hhaW4gPSB3cmFwcGVyQ2hhaW47XG4gICAgbG9kYXNoLnByb3RvdHlwZS50b1N0cmluZyA9IHdyYXBwZXJUb1N0cmluZztcbiAgICBsb2Rhc2gucHJvdG90eXBlLnZhbHVlID0gd3JhcHBlclZhbHVlT2Y7XG4gICAgbG9kYXNoLnByb3RvdHlwZS52YWx1ZU9mID0gd3JhcHBlclZhbHVlT2Y7XG5cbiAgICAvLyBhZGQgYEFycmF5YCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gdW53cmFwcGVkIHZhbHVlc1xuICAgIGZvckVhY2goWydqb2luJywgJ3BvcCcsICdzaGlmdCddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IGFycmF5UmVmW21ldGhvZE5hbWVdO1xuICAgICAgbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2hhaW5BbGwgPSB0aGlzLl9fY2hhaW5fXyxcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcy5fX3dyYXBwZWRfXywgYXJndW1lbnRzKTtcblxuICAgICAgICByZXR1cm4gY2hhaW5BbGxcbiAgICAgICAgICA/IG5ldyBsb2Rhc2hXcmFwcGVyKHJlc3VsdCwgY2hhaW5BbGwpXG4gICAgICAgICAgOiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gYWRkIGBBcnJheWAgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIHRoZSBleGlzdGluZyB3cmFwcGVkIHZhbHVlXG4gICAgZm9yRWFjaChbJ3B1c2gnLCAncmV2ZXJzZScsICdzb3J0JywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBhcnJheVJlZlttZXRob2ROYW1lXTtcbiAgICAgIGxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuYy5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgYEFycmF5YCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gbmV3IHdyYXBwZWQgdmFsdWVzXG4gICAgZm9yRWFjaChbJ2NvbmNhdCcsICdzbGljZScsICdzcGxpY2UnXSwgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBhcnJheVJlZlttZXRob2ROYW1lXTtcbiAgICAgIGxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBsb2Rhc2hXcmFwcGVyKGZ1bmMuYXBwbHkodGhpcy5fX3dyYXBwZWRfXywgYXJndW1lbnRzKSwgdGhpcy5fX2NoYWluX18pO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsb2Rhc2g7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBleHBvc2UgTG8tRGFzaFxuICB2YXIgXyA9IHJ1bkluQ29udGV4dCgpO1xuXG4gIC8vIHNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMgbGlrZSByLmpzIGNoZWNrIGZvciBjb25kaXRpb24gcGF0dGVybnMgbGlrZSB0aGUgZm9sbG93aW5nOlxuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBFeHBvc2UgTG8tRGFzaCB0byB0aGUgZ2xvYmFsIG9iamVjdCBldmVuIHdoZW4gYW4gQU1EIGxvYWRlciBpcyBwcmVzZW50IGluXG4gICAgLy8gY2FzZSBMby1EYXNoIGlzIGxvYWRlZCB3aXRoIGEgUmVxdWlyZUpTIHNoaW0gY29uZmlnLlxuICAgIC8vIFNlZSBodHRwOi8vcmVxdWlyZWpzLm9yZy9kb2NzL2FwaS5odG1sI2NvbmZpZy1zaGltXG4gICAgcm9vdC5fID0gXztcblxuICAgIC8vIGRlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvLCB0aHJvdWdoIHBhdGggbWFwcGluZywgaXQgY2FuIGJlXG4gICAgLy8gcmVmZXJlbmNlZCBhcyB0aGUgXCJ1bmRlcnNjb3JlXCIgbW9kdWxlXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbiAgLy8gY2hlY2sgZm9yIGBleHBvcnRzYCBhZnRlciBgZGVmaW5lYCBpbiBjYXNlIGEgYnVpbGQgb3B0aW1pemVyIGFkZHMgYW4gYGV4cG9ydHNgIG9iamVjdFxuICBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG4gICAgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTXG4gICAgaWYgKG1vZHVsZUV4cG9ydHMpIHtcbiAgICAgIChmcmVlTW9kdWxlLmV4cG9ydHMgPSBfKS5fID0gXztcbiAgICB9XG4gICAgLy8gaW4gTmFyd2hhbCBvciBSaGlubyAtcmVxdWlyZVxuICAgIGVsc2Uge1xuICAgICAgZnJlZUV4cG9ydHMuXyA9IF87XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIGluIGEgYnJvd3NlciBvciBSaGlub1xuICAgIHJvb3QuXyA9IF87XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXdCYXNlLmV4dGVuZCh7XG5cdGlkOiBcImRldGFpbFwiLFxuXHR0ZW1wbGF0ZSA6IHJlcXVpcmUoXCIuLy4uL3RlbXBsYXRlcy9kZXRhaWwudHBsXCIpLCBcblx0ZXZlbnRzOiB7XG5cdFx0J2NsaWNrIC50cmsnOiAnc2VuZFRyYWNraW5nRXZlbnQnXG5cdH0sXG5cdHNlbmRUcmFja2luZ0V2ZW50OiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBjYXRlZ29yeSA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0ZWdvcnknKTtcblx0XHRcdHZhciBsYWJlbCA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFiZWwnKTtcblx0XHRcdHZhciBldmVudFN0ciA9IGNhdGVnb3J5ICsgXCIgXCIgKyBsYWJlbDtcblx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50JywgY2F0ZWdvcnksICdjbGljaycsIGxhYmVsKTtcblx0XHQvL1x0Y29uc29sZS5sb2coZXZlbnRTdHIpO1xuXHR9LFxuXHRpbml0OiBmdW5jdGlvbigpe1x0XHRcdFxuXHRcdHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7IGRldGFpbDpcIlwifSApKTtcblx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0fSxcblx0YmluZEV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHR0aGlzLiQoXCIuaGVhci1pY29uXCIpLnNob3coKTtcblx0XHR0aGlzLiRlbC5maW5kKCcuY2xvc2UnKS5vbignY2xpY2snLCBfdGhpcy5oaWRlLmJpbmQoX3RoaXMpKTtcblx0XHR0aGlzLiRlbC5maW5kKCcuaGVhci1saW5rJykub24oJ2NsaWNrJywgX3RoaXMudG9nZ2xlQXVkaW8uYmluZChfdGhpcykpO1xuXHRcdHRoaXMuJGVsLmZpbmQoJy5oZWFyLWxpbmsnKS5ob3Zlcihcblx0XHRcdCBmdW5jdGlvbigpe1xuXHRcdFx0XHRUd2Vlbk1heC5mcm9tVG8oICQodGhpcykuZmluZCgnLmhlYXItcHVsc2UnKSwgMSwgeyBzY2FsZVg6IDEsIHNjYWxlWTogMSwgYXV0b0FscGhhOiAxIH0seyBzY2FsZVg6IDEuNSwgc2NhbGVZOiAxLjUsIGRpc3BsYXk6ICdibG9jaycsIGF1dG9BbHBoYTogMCwgZWFzZTogQ2lyYy5lYXNlT3V0IH0pO1xuXHRcdFx0XHRUd2Vlbk1heC5mcm9tVG8oICQodGhpcykuZmluZCgnLmhlYXItYm9yZGVyJyksIDEsIHsgc2NhbGVYOiAxLCBzY2FsZVk6IDEgfSx7IHNjYWxlWDogLjg1LCBzY2FsZVk6IC44NSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRUd2Vlbk1heC50byggJCh0aGlzKS5maW5kKCcuaGVhci1ib3JkZXInKSwgMSwgeyBjc3M6eyBib3JkZXJDb2xvcjpcIiM2NjY2NjZcIiwgYm9yZGVyV2lkdGg6IDIgfSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRUd2Vlbk1heC50byggJCh0aGlzKS5maW5kKCcuaGVhci10ZXh0JyksIDEsIHsgY29sb3I6XCIjMDAwXCIsIGVhc2U6IEV4cG8uZWFzZU91dCB9KTtcblx0XHRcdCB9LFxuXHRcdFx0IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFR3ZWVuTWF4LnRvKCAkKHRoaXMpLmZpbmQoJy5oZWFyLWJvcmRlcicpLCAxLCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFR3ZWVuTWF4LnRvKCAkKHRoaXMpLmZpbmQoJy5oZWFyLWJvcmRlcicpLCAxLCB7IGNzczp7IGJvcmRlckNvbG9yOlwiI2NjY2NjY1wiLCBib3JkZXJXaWR0aDogMSB9LCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFR3ZWVuTWF4LnRvKCAkKHRoaXMpLmZpbmQoJy5oZWFyLXRleHQnKSwgMSwgeyBjb2xvcjpcIiM0ZTRlNGVcIiwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0IH1cblx0XHQpO1xuXHRcdHRoaXMuY2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXJjbGUtcHJvZ3Jlc3NcIik7XG5cdFx0dGhpcy5jaXJjbGUuY3R4ID0gdGhpcy5jaXJjbGUuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdHRoaXMuYXVkaW8gPSB0aGlzLiRlbC5maW5kKCcuaW5mby1hdWRpbycpWzBdO1xuXHRcdHRoaXMuYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBmdW5jdGlvbigpe1xuXHRcdFx0X3RoaXMuJChcIi5wYXVzZVwiKS5mYWRlT3V0KDIwMCk7XG5cdFx0XHRfdGhpcy4kKFwiLnBsYXlcIikuZmFkZUluKDIwMCk7XG5cdFx0XHRcblx0XHRcdF90aGlzLmNpcmNsZS5jdHguY2xlYXJSZWN0ICggMCAsIDAgLCAxMDAsIDEwMCApO1xuXHRcdFx0d2luZG93LmNsZWFySW50ZXJ2YWwoX3RoaXMuYXVkaW9JbnRlcnZhbCk7XG5cdFx0fSlcblx0fSxcblx0dG9nZ2xlQXVkaW86IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRpZiAodGhpcy5hdWRpby5kdXJhdGlvbiA+IDAgJiYgIXRoaXMuYXVkaW8ucGF1c2VkKSB7XG5cdFx0XHR0aGlzLiQoXCIucGF1c2VcIikuZmFkZU91dCgyMDApO1xuXHRcdFx0dGhpcy4kKFwiLnBsYXlcIikuZmFkZUluKDIwMCk7XG5cdFx0XHRcblx0XHQgICAgdGhpcy5hdWRpby5wYXVzZSgpO1xuXHRcdCAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmF1ZGlvSW50ZXJ2YWwpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHQgICAgdGhpcy5hdWRpby5wbGF5KCk7XG5cblx0XHQgICAgdGhpcy4kKFwiLnBhdXNlXCIpLmZhZGVJbigyMDApO1xuXHRcdCAgICB0aGlzLiQoXCIucGxheVwiKS5mYWRlT3V0KDIwMCk7XG5cdFx0ICAgIHRoaXMuJChcIi5oZWFyLWljb25cIikuZmFkZU91dCgyMDApO1xuXHRcdCAgICAvL3N0YXJ0IGRyYXdpbmcgY2lyY2xlXG5cdFx0ICAgIHRoaXMuYXVkaW9JbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdF90aGlzLmRyYXdDaXJjbGUoKTtcblx0XHRcdH0sIDEwKTtcblx0XHR9XG5cdFx0XG5cdH0sXG5cdGdldEF1ZGlvUHJvZ3Jlc3M6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHBlcmNlbnQgPSB0aGlzLmF1ZGlvLmN1cnJlbnRUaW1lIC8gdGhpcy5hdWRpby5kdXJhdGlvbjtcblx0XHRyZXR1cm4gMiAqIHBlcmNlbnQ7XG5cdH0sXG5cdGRyYXdDaXJjbGU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHByb2dyZXNzID0gdGhpcy5nZXRBdWRpb1Byb2dyZXNzKCk7XG5cdFx0dGhpcy5jaXJjbGUuY3R4LmNsZWFyUmVjdCAoIDAgLCAwICwgMTAwLCAxMDAgKTtcblx0XHR0aGlzLmNpcmNsZS5jdHguYmVnaW5QYXRoKCk7XG5cdFx0dGhpcy5jaXJjbGUuY3R4LmFyYyg1MCwgNTAsIDQ5LCAwLCBwcm9ncmVzcyAqIE1hdGguUEkpO1xuXHRcdHRoaXMuY2lyY2xlLmN0eC5saW5lV2lkdGggPSAyO1xuXHRcdHRoaXMuY2lyY2xlLmN0eC5zdHJva2VTdHlsZSA9ICcjNjc2NzY3Jztcblx0XHR0aGlzLmNpcmNsZS5jdHguc3Ryb2tlKCk7XG5cdFx0Ly90aGlzLmNpcmNsZS5jdHgud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkPXRydWU7XG5cblx0fSxcdFxuXHR1cGRhdGVDb250ZW50OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHR0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe2RldGFpbDogY29udGVudH0pKTtcblx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0fSxcblx0c2hvdzogZnVuY3Rpb24oKXtcblx0XG5cdFx0dGhpcy4kZWwuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuXHRcdFxuXHRcdHRoYXQgPSB0aGlzO1xuXHRcdHZhciAkdyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmRldGFpbC1iYWNrZ3JvdW5kJyksIDEuNzUsIHsgeDogJHcsIGF1dG9BbHBoYTogMCB9LCB7IHg6IDAsIGF1dG9BbHBoYTogMSwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCB9KTtcblx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5kZXRhaWwtaW5uZXInKSwgMS41LCB7IHg6ICR3IH0sIHsgeDogMCwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IC4yNSB9ICk7XG5cdFx0XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuZGV0YWlsLWlubmVyIC5kZXRhaWwtaWNvbicpLCAxLjUsIHsgYXV0b0FscGhhOiAwLCB4OiAxMDAgfSwgeyBhdXRvQWxwaGE6IDEsIHg6IDAsIGVhc2U6IFBvd2VyNC5lYXNlSW5PdXQsIGRlbGF5OiAuNSB9ICk7XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuZGV0YWlsLWlubmVyIC5jb250ZW50JyksIDEuNSwgeyBhdXRvQWxwaGE6IDAsIHg6IDIwMCB9LCB7IGF1dG9BbHBoYTogMSwgeDogMCwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IC41IH0gKTtcblx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5kZXRhaWwtaW5uZXIgLmhlYXItbGluaycpLCAxLjUsIHsgYXV0b0FscGhhOiAwIH0sIHsgYXV0b0FscGhhOiAxLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBkZWxheTogLjc1LCBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmhlYXItcHVsc2UnKSwgMS41LCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxLCBhdXRvQWxwaGE6IDEgfSx7IHNjYWxlWDogMS41LCBzY2FsZVk6IDEuNSwgZGlzcGxheTogJ2Jsb2NrJywgYXV0b0FscGhhOiAwLCBlYXNlOiBDaXJjLmVhc2VPdXQsIGRlbGF5OiAxLCByZXBlYXQ6IC0xLCByZXBlYXREZWxheTogMSB9KTtcblx0XHR9fSk7XG5cdFx0XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuZGV0YWlsLWlubmVyIC5jbG9zZScpLCAxLjUsIHsgYXV0b0FscGhhOiAwIH0sIHsgYXV0b0FscGhhOiAxLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBkZWxheTogMiB9ICk7XG5cdFx0XG5cdFx0Ly8gSElERSBCT1RUT00gTkFWXG5cdFx0Ly9Ud2Vlbk1heC50byggJCgnLmJvdHRvbS1uYXYnKSwgMSwgeyB5OiA4MCwgYXV0b0FscGhhOiAwLCBlYXNlOiBQb3dlcjQuZWFzZUluIH0pO1xuXHRcdFxuXHR9LFxuXHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdGlmKHRoaXMuYXVkaW9JbnRlcnZhbCl7XG5cdFx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmF1ZGlvSW50ZXJ2YWwpO1xuXHRcdH1cblx0XG5cdFx0XG5cdFx0dGhpcy5nbG9iYWwudHJpZ2dlcihcImhpZGVEZXRhaWxcIik7XG5cdFx0XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHZhciAkdyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YoJCgnLmhlYXItcHVsc2UnKSk7XG5cdFx0VHdlZW5NYXgudG8oICQoJy5kZXRhaWwtYmFja2dyb3VuZCcpLCAxLjY1LCB7IGF1dG9BbHBoYTogMCB9ICk7XG5cdFx0VHdlZW5NYXgudG8oICQoJy5kZXRhaWwtYmFja2dyb3VuZCcpLCAxLjUsIHsgeDogJHcsIGVhc2U6IFBvd2VyNC5lYXNlSW5PdXQsIGRlbGF5OiAuMTUgfSApO1xuXHRcdFR3ZWVuTWF4LnRvKCAkKCcuZGV0YWlsLWlubmVyICcpLCAxLjUsIHsgeDogJHcsIGVhc2U6IFBvd2VyNC5lYXNlSW5PdXQsIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhhdC4kZWwuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdFx0fX0pO1xuXHRcdFxuXHRcdC8vIFNIT1cgQk9UVE9NIE5BVlxuXHRcdC8vVHdlZW5NYXgudG8oICQoJy5ib3R0b20tbmF2JyksIDEsIHsgeTogMCwgYXV0b0FscGhhOiAxLCBlYXNlOiBQb3dlcjQuZWFzZU91dCwgZGVsYXk6IDEgfSk7XG5cdFx0XG5cdFx0Ly8gQ0FMTCBUTyBDTE9TRSBERVRBSUwgSU4gR0kgSVRFTVxuXG5cdFx0Ly9zdG9wIGF1ZGlvXG5cdFx0dGhpcy4kZWwuZmluZCgnLmluZm8tYXVkaW8nKVswXS5wYXVzZSgpO1xuXHR9XG59KTtcblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXdCYXNlLmV4dGVuZCh7XG5cblx0XHRpZDogXCJmb290ZXJcIixcblx0XHR0ZW1wbGF0ZSA6IHJlcXVpcmUoXCIuLy4uL3RlbXBsYXRlcy9mb290ZXIudHBsXCIpLCBcblxuXHRcdGV2ZW50czoge1xuXHRcdFx0XG5cdFx0fSwgXG5cblx0XHRpbml0OiBmdW5jdGlvbigpe1x0XHRcdFxuXHRcdFx0dGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHtrZXk6XCJmb290ZXJcIn0pKTtcblx0XHRcdFxuXHRcdH0sXG5cblxufSk7IiwidmFyIEltZ1NlcVx0XHRcdFx0PVx0cmVxdWlyZShcIi4vdXRpbGl0aWVzL2ltZ19zZXF1ZW5jZS5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlld0Jhc2UuZXh0ZW5kKHtcblxuXHRcdGNsYXNzTmFtZTogXCJnLWl0ZW1cIixcblx0XHR0ZW1wbGF0ZSA6IHJlcXVpcmUoXCIuLy4uL3RlbXBsYXRlcy9nYWxsZXJ5LWl0ZW0udHBsXCIpLFxuXHRcdHRlbXBsYXRlMiA6IHJlcXVpcmUoXCIuLy4uL3RlbXBsYXRlcy9nYWxsZXJ5LWl0ZW0taW50cm8udHBsXCIpLCBcblx0XHRpZDogMTEyMzU0LFxuXHRcdGV2ZW50czoge1xuXHRcdFx0J2NsaWNrIC50cmsnOiAnc2VuZFRyYWNraW5nRXZlbnQnXG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdFx0Ly9QQVVTRVxuIFx0XHRcdC8vY29uc29sZS5sb2coXCJnYWwgaXRlbVwiLHRoaXMub3B0aW9ucyk7XG5cdFx0XHRpZihwYXJzZUludCh0aGlzLm9wdGlvbnMuZ2FsbGVyeUl0ZW0udHlwZSkgPT0gMSl7XG5cdFx0XHRcdHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7a2V5OlwiZ2FsbGVyeS1pdGVtXCIsaW5kZXg6IHRoaXMub3B0aW9ucy5pbmRleCwgZ2FsbGVyeUl0ZW06IHRoaXMub3B0aW9ucy5nYWxsZXJ5SXRlbX0pKTtcdFx0XHRcdFx0XG5cdFx0XHRcdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLmdhbGxlcnlJdGVtLnNpZ09wdGlvbnM7XG5cdFxuXHRcdFx0XHR2YXIgZGV2aWNlID0gdGhpcy5nbG9iYWwuYXR0cmlidXRlcy5jaGVja3MuZGV2aWNlLnR5cGU7XG5cdFx0XHRcdHZhciBjbnYgPSB0aGlzLiRlbC5maW5kKCcuc2lnJylbMF07XG5cdFx0XHRcdC8vaWYgKGRldmljZSA9PSBcImRlc2t0b3BcIil7XG5cdFx0XHRcdFx0Y252LndpZHRoID0gb3B0aW9ucy5pbWcudjJ3O1xuXHRcdFx0XHRcdGNudi5oZWlnaHQgPSBvcHRpb25zLmltZy52Mmg7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhjbnYud2lkdGgpO1xuXHRcdFx0XHQvLyB9ZWxzZXsgLy9mb3IgbW9iaWxlLT4gb3ZlcndyaXRlIGRlZmF1bHRzIHdpdGggbW9iaWxlIHZhbHVlc1xuXHRcdFx0XHQvLyBcdGNudi53aWR0aCA9IG9wdGlvbnMuaW1nLndNb2JpbGU7XG5cdFx0XHRcdC8vIFx0Y252LmhlaWdodCA9IG9wdGlvbnMuaW1nLmhNb2JpbGU7XG5cdFx0XHRcdC8vIFx0b3B0aW9ucy5iYXNlVVJMID0gIG9wdGlvbnMuYmFzZVVSTE1vYmlsZTtcblx0XHRcdFx0Ly8gXHRvcHRpb25zLmltZy53ID0gIG9wdGlvbnMuaW1nLndNb2JpbGU7XG5cdFx0XHRcdC8vIFx0b3B0aW9ucy5pbWcuaCA9ICBvcHRpb25zLmltZy5oTW9iaWxlO1x0XG5cdFx0XHRcdC8vIH1cblx0XHRcdFx0Ly92MlxuXG5cdFx0XHRcdG9wdGlvbnMuY2FudmFzID0gY252O1xuXHRcdFx0XHR0aGlzLmltZ1NlcSA9IG5ldyBJbWdTZXEob3B0aW9ucyk7XHRcdFx0XHRcdFxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZTIoe2tleTpcImdhbGxlcnktaXRlbVwiLGluZGV4OiB0aGlzLm9wdGlvbnMuaW5kZXgsIGdhbGxlcnlJdGVtOiB0aGlzLm9wdGlvbnMuZ2FsbGVyeUl0ZW19KSk7XG5cdFx0XHR9XG5cdFx0XHQkKFwiLmdhbGxlcnktaXRlbXNcIikuYXBwZW5kKHRoaXMuJGVsKTtcblx0XHRcdHRoaXMuJGVsLmNzcyhcImhlaWdodFwiLCAkKHdpbmRvdykuaGVpZ2h0KCkpO1xuXHRcdFx0XG5cdFx0XHQvLyBTQ0FMRSBET1dOIEFMTCBTSUdOQVRVUkVTXG5cdFx0XHQvL1R3ZWVuTWF4LnNldCggJCgnLnNpZycpLCB7IHNjYWxlWDogLjY1LCBzY2FsZVk6IC42NSwgeTogMjAgfSk7XG5cdFx0XHR2YXIgamQgPSAkKCcuc2lnJylbMF07XG5cdFx0XHR2YXIga3QgPSAkKCcuc2lnJylbMV07XG5cdFx0XHRUd2Vlbk1heC5zZXQoICQoamQpLCB7IHk6IDMwfSk7XG5cdFx0XHRUd2Vlbk1heC5zZXQoICQoa3QpLCB7IHNjYWxlWDogMC44LCBzY2FsZVk6IDAuOH0pO1xuXHRcdFx0Ly9Ud2Vlbk1heC5zZXQoICQodG0pLCB7eTogMH0pO1xuXHRcdFx0XG5cdFx0XHR2YXIgJHcgPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRcdGlmICgkdyA8IDEwMDApICR3ID0gMTAwMDtcblx0XHRcdHRoaXMuJGVsLmNzcyhcIndpZHRoXCIsICR3KTtcblx0XHRcdHRoaXMuJGVsLmNzcyhcIm1hcmdpblJpZ2h0XCIsICgkdyAgKiAuNSkpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0XHR9LFxuXHRcdHNlbmRUcmFja2luZ0V2ZW50OiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBjYXRlZ29yeSA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0ZWdvcnknKTtcblx0XHRcdHZhciBsYWJlbCA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFiZWwnKTtcblx0XHRcdHZhciBldmVudFN0ciA9IGNhdGVnb3J5ICsgXCIgXCIgKyBsYWJlbDtcblx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50JywgY2F0ZWdvcnksICdjbGljaycsIGxhYmVsKTtcblx0XHRcdC8vY29uc29sZS5sb2coZXZlbnRTdHIpO1xuXHRcdH0sXG5cdFx0YmluZEV2ZW50czogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuZ2xvYmFsLm9uKFwiaGlkZVBsYXllclwiLHRoaXMuY2xvc2VQbGF5ZXIuYmluZCh0aGlzKSk7XG5cdFx0XHR0aGlzLmdsb2JhbC5vbihcImhpZGVEZXRhaWxcIix0aGlzLmNsb3NlRGV0YWlsLmJpbmQodGhpcykpO1x0XHRcdFxuICAgICAgICBcdCQod2luZG93KS5vbihcInJlc2l6ZVwiLCB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMpKTtcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdGlmKHRoaXMub3B0aW9ucy5nYWxsZXJ5SXRlbS50eXBlID09IDEpe1xuXHRcdFx0XHR0aGlzLiRlbC5maW5kKCcudmlldy1saW5rJykub24oXCJjbGlja1wiLCB0aGlzLm9wZW5EZXRhaWwuYmluZCh0aGlzKSk7XG5cdFx0XHRcdHRoaXMuJGVsLmZpbmQoJy52aWV3LXZpZGVvJykub24oXCJjbGlja1wiLCB0aGlzLm9wZW5QbGF5ZXIuYmluZCh0aGlzKSk7XHRcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuJGVsLmZpbmQoJy52aWV3LWxpbmsnKS5ob3Zlcihcblx0XHRcdFx0XHQgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdC8vIFRJTUVSXG5cdFx0XHRcdFx0XHR0aGF0Lmdsb2JhbC50cmlnZ2VyKFwic3RvcHRpbWVyXCIpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0IFx0VHdlZW5NYXguZnJvbVRvKCAkKHRoaXMpLmZpbmQoJy52aWV3LXB1bHNlJyksIDEsIHsgc2NhbGVYOiAxLCBzY2FsZVk6IDEsIGF1dG9BbHBoYTogMSB9LHsgc2NhbGVYOiAxLjUsIHNjYWxlWTogMS41LCBkaXNwbGF5OiAnYmxvY2snLCBhdXRvQWxwaGE6IDAsIGVhc2U6IENpcmMuZWFzZU91dCB9KTtcblx0XHRcdFx0XHQgXHRUd2Vlbk1heC5mcm9tVG8oICQodGhpcykuZmluZCgnLnZpZXctYm9yZGVyJyksIDEsIHsgc2NhbGVYOiAxLCBzY2FsZVk6IDEgfSx7IHNjYWxlWDogLjg1LCBzY2FsZVk6IC44NSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRcdCBcdFR3ZWVuTWF4LnRvKCAkKHRoaXMpLmZpbmQoJy52aWV3LWJvcmRlcicpLCAxLCB7IGNzczp7IGJvcmRlckNvbG9yOlwiIzY2NjY2NlwiLCBib3JkZXJXaWR0aDogMiB9LCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFx0IFx0VHdlZW5NYXgudG8oICQodGhpcykuZmluZCgnLnZpZXctdGV4dCcpLCAxLCB7IGNvbG9yOlwiIzAwMFwiLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFx0IH0sXG5cdFx0XHRcdFx0IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQvLyBUSU1FUlxuXHRcdFx0XHRcdFx0dGhhdC5nbG9iYWwudHJpZ2dlcihcInN0YXJ0dGltZXJcIik7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHQgXHRUd2Vlbk1heC50byggJCh0aGlzKS5maW5kKCcudmlldy1ib3JkZXInKSwgMSwgeyBzY2FsZVg6IDEsIHNjYWxlWTogMSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRcdCBcdFR3ZWVuTWF4LnRvKCAkKHRoaXMpLmZpbmQoJy52aWV3LWJvcmRlcicpLCAxLCB7IGNzczp7IGJvcmRlckNvbG9yOlwiI2NjY2NjY1wiLCBib3JkZXJXaWR0aDogMSB9LCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFx0IFx0VHdlZW5NYXgudG8oICQodGhpcykuZmluZCgnLnZpZXctdGV4dCcpLCAxLCB7IGNvbG9yOlwiIzY2NjY2NlwiLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFx0IH1cblx0XHRcdFx0KTtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuJGVsLmZpbmQoJy52aWV3LXZpZGVvJykuaG92ZXIoXG5cdFx0XHRcdFx0IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQvLyBUSU1FUlxuXHRcdFx0XHRcdFx0dGhhdC5nbG9iYWwudHJpZ2dlcihcInN0b3B0aW1lclwiKTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdCBcdFR3ZWVuTWF4LmZyb21UbyggJCh0aGlzKS5maW5kKCcudmlldy1wdWxzZScpLCAxLCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxLCBhdXRvQWxwaGE6IDEgfSx7IHNjYWxlWDogMS41LCBzY2FsZVk6IDEuNSwgZGlzcGxheTogJ2Jsb2NrJywgYXV0b0FscGhhOiAwLCBlYXNlOiBDaXJjLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFx0IFx0VHdlZW5NYXguZnJvbVRvKCAkKHRoaXMpLmZpbmQoJy52aWV3LWJvcmRlcicpLCAxLCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxIH0seyBzY2FsZVg6IC44NSwgc2NhbGVZOiAuODUsIGVhc2U6IEV4cG8uZWFzZU91dCB9KTtcblx0XHRcdFx0XHQgXHRUd2Vlbk1heC50byggJCh0aGlzKS5maW5kKCcudmlldy1ib3JkZXInKSwgMSwgeyBjc3M6eyBib3JkZXJDb2xvcjpcIiM2NjY2NjZcIiwgYm9yZGVyV2lkdGg6IDIgfSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRcdCBcdFR3ZWVuTWF4LnRvKCAkKHRoaXMpLmZpbmQoJy52aWV3LXRleHQnKSwgMSwgeyBjb2xvcjpcIiMwMDBcIiwgLypyb3RhdGlvblk6IDM2MCwgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IDYwMCwgKi9lYXNlOiBDaXJjLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFx0IH0sXG5cdFx0XHRcdFx0IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQvLyBUSU1FUlxuXHRcdFx0XHRcdFx0dGhhdC5nbG9iYWwudHJpZ2dlcihcInN0YXJ0dGltZXJcIik7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHQgXHRUd2Vlbk1heC50byggJCh0aGlzKS5maW5kKCcudmlldy1ib3JkZXInKSwgMSwgeyBzY2FsZVg6IDEsIHNjYWxlWTogMSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRcdCBcdFR3ZWVuTWF4LnRvKCAkKHRoaXMpLmZpbmQoJy52aWV3LWJvcmRlcicpLCAxLCB7IGNzczp7IGJvcmRlckNvbG9yOlwiI2NjY2NjY1wiLCBib3JkZXJXaWR0aDogMSB9LCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFx0IFx0VHdlZW5NYXgudG8oICQodGhpcykuZmluZCgnLnZpZXctdGV4dCcpLCAxLCB7IGNvbG9yOlwiIzY2NjY2NlwiLCAvKnJvdGF0aW9uWTogMCwgKi9lYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFx0IH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0b3BlbkRldGFpbDogZnVuY3Rpb24oKXtcblx0XHRcdFx0XG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRUd2Vlbk1heC5mcm9tVG8oIHRoaXMuJGVsLCAxLCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxLCB9LHsgc2NhbGVYOiAuOSwgc2NhbGVZOiAuOSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0VHdlZW5NYXguZnJvbVRvKCB0aGlzLiRlbCwgMS43NSwgeyB4OiAwLCBhdXRvQWxwaGE6IDEgfSx7IHg6IC0kKHdpbmRvdykud2lkdGgoKSwgYXV0b0FscGhhOiAwLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBkZWxheTogLjUsIG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGF0Lmdsb2JhbC50cmlnZ2VyKFwiZ2l0ZW06c2VsZWN0OmRldGFpbFwiLCB7Y29udGVudDogdGhhdC5vcHRpb25zLmdhbGxlcnlJdGVtLCBpZHg6IHRoYXQub3B0aW9ucy5pbmRleH0pO1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcInBvc3QgZ2FsLWl0ZW0gb3BlbkRldGFpbFwiLCB0aGF0Lm9wdGlvbnMuZ2FsbGVyeUl0ZW0pO1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyh0aGF0KVxuXHRcdFx0fX0pO1xuXHRcdFx0XG5cdFx0XHRUd2Vlbk1heC5zZXQoICQoJy5jb3ZlcicpLCB7IGRpc3BsYXk6ICdibG9jaycgfSApO1xuXHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCQoJy5uYXYtaXRlbScpLCAxLCB7IHk6IDYwLCBlYXNlOiBQb3dlcjQuZWFzZU91dCB9LCAuMSApO1xuXHRcdFx0VHdlZW5NYXgudG8oJCgnLmRvd25sb2FkLWxpbmtzJyksIDEsIHsgeTogNjAsIGVhc2U6IFBvd2VyNC5lYXNlT3V0LCBkZWxheTogLjUgfSk7XG5cdFx0XHRcblx0XHRcdC8vIFRJTUVSIElOIENBU0UgVElNRVIgV0FTIFJFU1RBUlRFRCBGUk9NIEJVVFRPTiBIT1ZFUiBPVVRcblx0XHRcdHRoaXMuZ2xvYmFsLnRyaWdnZXIoXCJzZXRvdmVybGF5bW9kZVwiLCB0cnVlKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXG5cdFx0XHRcdHRoYXQuZ2xvYmFsLnRyaWdnZXIoXCJzdG9wdGltZXJcIilcblx0XHRcdCB9LCAxMDAwKTtcblx0XHRcblx0XHR9LFxuXHRcdG9wZW5QbGF5ZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRUd2Vlbk1heC5mcm9tVG8oIHRoaXMuJGVsLCAxLCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxLCB9LHsgc2NhbGVYOiAuOSwgc2NhbGVZOiAuOSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0VHdlZW5NYXguZnJvbVRvKCB0aGlzLiRlbCwgMS43NSwgeyB4OiAwLCBhdXRvQWxwaGE6IDEgfSx7IHg6IC0kKHdpbmRvdykud2lkdGgoKSwgYXV0b0FscGhhOiAwLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBkZWxheTogLjUgLCBvblN0YXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhhdC5nbG9iYWwudHJpZ2dlcihcImdpdGVtOnNlbGVjdDp2aWRlb1wiLCB7Y29udGVudDogdGhhdC5vcHRpb25zLmdhbGxlcnlJdGVtLCBpZHg6IHRoYXQub3B0aW9ucy5pbmRleH0pO1xuXHRcdFx0fX0pO1xuXHRcdFx0XG5cdFx0XHRUd2Vlbk1heC5zZXQoICQoJy5jb3ZlcicpLCB7IGRpc3BsYXk6ICdibG9jaycgfSApO1xuXHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCQoJy5uYXYtaXRlbScpLCAxLCB7IHk6IDYwLCBlYXNlOiBQb3dlcjQuZWFzZU91dCB9LCAuMSApO1xuXHRcdFx0VHdlZW5NYXgudG8oJCgnLmRvd25sb2FkLWxpbmtzJyksIDEsIHsgeTogNjAsIGVhc2U6IFBvd2VyNC5lYXNlT3V0LCBkZWxheTogLjUgfSk7XG5cdFx0XHRcblx0XHRcdC8vIFRJTUVSIElOIENBU0UgVElNRVIgV0FTIFJFU1RBUlRFRCBGUk9NIEJVVFRPTiBIT1ZFUiBPVVRcblx0XHRcdHRoaXMuZ2xvYmFsLnRyaWdnZXIoXCJzZXRvdmVybGF5bW9kZVwiLCB0cnVlKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXG5cdFx0XHRcdHRoYXQuZ2xvYmFsLnRyaWdnZXIoXCJzdG9wdGltZXJcIilcblx0XHRcdCB9LCAxMDAwKTtcblx0XHR9LFxuXHRcdGNsb3NlRGV0YWlsOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0VHdlZW5NYXguZnJvbVRvKCB0aGlzLiRlbCwgMS43NSwgeyB4OiAtJCh3aW5kb3cpLndpZHRoKCksIGF1dG9BbHBoYTogMCB9LHsgeDogMCwgYXV0b0FscGhhOiAxLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0IH0pO1xuXHRcdFx0VHdlZW5NYXgudG8oIHRoaXMuJGVsLCAxLCB7IHNjYWxlWDogMSwgc2NhbGVZOiAxLCBlYXNlOiBFeHBvLmVhc2VPdXQsIGRlbGF5OiAxLjc1IH0pO1xuXHRcdFx0XG5cdFx0XHRUd2Vlbk1heC5zZXQoICQoJy5jb3ZlcicpLCB7IGRpc3BsYXk6ICdub25lJyB9ICk7XG5cdFx0XHRUd2Vlbk1heC5zdGFnZ2VyVG8oJCgnLm5hdi1pdGVtJyksIDEsIHsgeTogMCwgZWFzZTogUG93ZXI0LmVhc2VPdXQsIGRlbGF5OiAxIH0sIC4xICk7XG5cdFx0XHRUd2Vlbk1heC50bygkKCcuZG93bmxvYWQtbGlua3MnKSwgMSwgeyB5OiAwLCBlYXNlOiBQb3dlcjQuZWFzZU91dCwgZGVsYXk6IDEuNSB9KTtcblx0XHRcdFxuXHRcdFx0Ly8gVElNRVJcblx0XHRcdHRoaXMuZ2xvYmFsLnRyaWdnZXIoXCJzZXRvdmVybGF5bW9kZVwiLCBmYWxzZSk7XG5cdFx0XHR0aGlzLmdsb2JhbC50cmlnZ2VyKFwic3RhcnR0aW1lclwiKTtcblx0XHR9LFxuXHRcdGNsb3NlUGxheWVyOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0VHdlZW5NYXguZnJvbVRvKCB0aGlzLiRlbCwgMS43NSwgeyB4OiAtJCh3aW5kb3cpLndpZHRoKCksIGF1dG9BbHBoYTogMCB9LHsgeDogMCwgYXV0b0FscGhhOiAxLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCB9KTtcblx0XHRcdFR3ZWVuTWF4LnRvKCB0aGlzLiRlbCwgMSwgeyBzY2FsZVg6IDEsIHNjYWxlWTogMSwgZWFzZTogRXhwby5lYXNlT3V0LCBkZWxheTogMS43NSB9KTtcblx0XHRcdFxuXHRcdFx0VHdlZW5NYXguc2V0KCAkKCcuY292ZXInKSwgeyBkaXNwbGF5OiAnbm9uZScgfSApO1xuXHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCQoJy5uYXYtaXRlbScpLCAxLCB7IHk6IDAsIGVhc2U6IFBvd2VyNC5lYXNlT3V0LCBkZWxheTogMSB9LCAuMSApO1xuXHRcdFx0VHdlZW5NYXgudG8oJCgnLmRvd25sb2FkLWxpbmtzJyksIDEsIHsgeTogMCwgZWFzZTogUG93ZXI0LmVhc2VPdXQsIGRlbGF5OiAxLjUgfSk7XG5cdFx0XHRcblx0XHRcdC8vIFRJTUVSXG5cdFx0XHR0aGlzLmdsb2JhbC50cmlnZ2VyKFwic2V0b3ZlcmxheW1vZGVcIiwgZmFsc2UpO1xuXHRcdFx0dGhpcy5nbG9iYWwudHJpZ2dlcihcInN0YXJ0dGltZXJcIik7XG5cdFx0fSxcblx0XHRyZXNpemU6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLiRlbC5jc3MoXCJoZWlnaHRcIiwgJCh3aW5kb3cpLmhlaWdodCgpKTtcblx0XHRcdC8vdGhpcy4kZWwuY3NzKFwid2lkdGhcIiwgJCh3aW5kb3cpLndpZHRoKCkgKiAxLjI1KTtcblx0XHRcdFxuXHRcdFx0dmFyICR3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0XHRpZiAoJHcgPCAxMDAwKSAkdyA9IDEwMDA7XG5cdFx0XHR0aGlzLiRlbC5jc3MoXCJ3aWR0aFwiLCAkdyk7XG5cdFx0XHR0aGlzLiRlbC5jc3MoXCJtYXJnaW5SaWdodFwiLCAoJHcgICogLjUpKTtcblx0XHR9IFxufSk7ICIsIlxudmFyIEdhbGxlcnlJdGVtcyBcdFx0XHQ9IFx0cmVxdWlyZShcIi4vR2FsbGVyeUl0ZW1zLmpzXCIpO1xudmFyIEdhbGxlcnlOYXZcdFx0XHRcdD1cdHJlcXVpcmUoXCIuL0dhbGxlcnlOYXYuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlld0Jhc2UuZXh0ZW5kKHtcblx0XG5cdGlkOiBcImdhbGxlcnlcIixcblx0dGVtcGxhdGUgOiByZXF1aXJlKFwiLi8uLi90ZW1wbGF0ZXMvZ2FsbGVyeS50cGxcIiksIFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCl7IFxuXHRcdC8vY29uc29sZS5sb2codGhpcyk7XHQgXG5cdFx0dmFyIGRhdGEgPSB0aGlzLm9wdGlvbnMuZGF0YTtcblx0XHR0aGlzLm1vZGVsID0gbmV3IEJhY2tib25lLk1vZGVsKClcdFx0XG5cdFx0dGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHtrZXk6XCJnYWxsZXJ5XCJ9KSk7XG5cdFx0XG5cdFx0Ly9jcmVhdGUgZ2FsIGl0ZW1zIGNvbnRhaW5lclxuXHRcdHRoaXMuZ2FsbGVyeUl0ZW1zID0gbmV3IEdhbGxlcnlJdGVtcyh7ZGF0YTogZGF0YSwgZ2xvYmFsOnRoaXMuZ2xvYmFsLCBsb2NhbDogdGhpcy5tb2RlbH0pO1xuXHRcdC8vY3JlYXRlIG5hdlxuXHRcdHRoaXMubmF2ID0gbmV3IEdhbGxlcnlOYXYoe2RhdGE6IGRhdGEsIGdsb2JhbDp0aGlzLmdsb2JhbCwgbG9jYWw6IHRoaXMubW9kZWx9KTtcblx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0XHRcblx0XHR2YXIgJHcgPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRpZiAoJHcgPCAxMDAwKSAkdyA9IDEwMDA7XG5cdFx0XG5cdFx0Ly92YXIgZnVsbFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCkgKiAxLjI1ICogNiA7XG5cdFx0dmFyIGZ1bGxXaWR0aCA9ICR3ICogMS41ICogNiA7XG5cdFx0dGhpcy4kZWwuY3NzKFwid2lkdGhcIiwgZnVsbFdpZHRoKTtcblx0XHRcblx0XHQvL3ZhciAkdyA9ICQod2luZG93KTtcblx0XHQvL3RoaXMuZ2lXaWR0aCA9ICR3LndpZHRoKCkgKiAxLjI1O1xuXHRcdHRoaXMuZ2lXaWR0aCA9ICR3ICogMS41O1xuXHRcdFxuXHRcdHRoaXMuY3VycmVudElkID0gMDtcblx0XHRcblx0XHR0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG5cdFx0XG5cdFx0Ly8gQUNUSVZJVFkgVElNRVJcblx0XHR0aGlzLnRpbWVySW50ZXJhY3Rpb247XG5cdFx0dGhpcy5pbk1vZGFsID0gZmFsc2U7XG5cdH0sXG5cdGJpbmRFdmVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMubW9kZWwub24oJ2dpdGVtOnNlbGVjdDpkZXRhaWwnLCB0aGlzLmhhbmRsZURldGFpbFNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5tb2RlbC5vbignZ2l0ZW06c2VsZWN0OnZpZGVvJywgdGhpcy5oYW5kbGVTZWxlY3RWaWRlby5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5tb2RlbC5vbignbmF2OnNlbGVjdCcsIHRoaXMuaGFuZGxlU2VsZWN0TmF2LmJpbmQodGhpcykpO1xuXHRcdFxuXHRcdHRoaXMuZ2xvYmFsLm9uKFwic3RhcnR0aW1lclwiLHRoaXMuc3RhcnRUaW1lci5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmdsb2JhbC5vbihcInN0b3B0aW1lclwiLHRoaXMuc3RvcFRpbWVyLmJpbmQodGhpcykpO1xuXHRcdHRoaXMuZ2xvYmFsLm9uKFwiY2hlY2t0aW1lclwiLHRoaXMuY2hlY2tUaW1lci5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmdsb2JhbC5vbihcInNldG92ZXJsYXltb2RlXCIsdGhpcy5zZXRPdmVybGF5TW9kZS5iaW5kKHRoaXMpKTtcblx0XHRcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJrZXlkb3duXCIsIHRoaXMuaGFuZGxlS2V5UHJlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIC8vJChcImJvZHlcIikub24oXCJtb3VzZXdoZWVsXCIsIHRoaXMuaGFuZGxlTW91c2VXaGVlbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIHRoaXMucmVzaXplLmJpbmQodGhpcykpO1xuXHR9LFxuXHRoYW5kbGVNb3VzZVdoZWVsOiBmdW5jdGlvbihldmVudCwgZGVsdGEpe1xuXHRcdGlmICggdGhpcy5pblRyYW5zaXRpb24gKSByZXR1cm47XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgdGFyZ2V0SWQgPSB0aGlzLmN1cnJlbnRJZDtcblx0XHRpZiAoZGVsdGEgPiAwKSB7XG5cdFx0XHR0YXJnZXRJZC0tXG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldElkKytcblx0XHR9XG5cdFx0dGhpcy5oYW5kbGVTZWxlY3ROYXYodGFyZ2V0SWQpO1xuXHR9LFxuXHRoYW5kbGVTZWxlY3ROYXY6IGZ1bmN0aW9uKGlkKXtcblx0XHRpZiAoaWQgPiA0KSBpZCA9IDQ7XG5cdFx0aWYgKGlkIDwgMSkgaWQgPSAwO1xuXHRcdGlmICh0aGlzLmN1cnJlbnRJZCA9PSBpZCkgcmV0dXJuO1xuXHRcdHRoaXMuc2Nyb2xsVG9JdGVtKGlkKTtcblx0fSxcblx0c2Nyb2xsVG9JdGVtOiBmdW5jdGlvbihpZCl7XG5cdFx0dGhpcy5pblRyYW5zaXRpb24gPSB0cnVlO1xuXHRcdHZhciBuZXdQb3NpdGlvbiA9IE1hdGguZmxvb3IodGhpcy5naVdpZHRoICogaWQpO1xuXHRcdHZhciBjdXJQb3NpdGlvbiA9IE1hdGguZmxvb3IodGhpcy5naVdpZHRoICogdGhpcy5jdXJyZW50SWQpO1xuXHRcdHRoYXQgPSB0aGlzO1xuXHRcdFxuXHRcdC8vIENPVkVSIFVQIFRIRSBOQVYgU08gSVQgSVNOVCBDTElDS0FCTEVcblx0XHRUd2Vlbk1heC5zZXQoICQoJy5ib3R0b20tbmF2LWNvdmVyJyksIHsgZGlzcGxheTogJ2Jsb2NrJyB9ICk7XG5cdFx0XG5cdFx0Ly8gTkVXIFNDUk9MTElOR1xuXHRcdC8vVHdlZW5NYXgua2lsbEFsbChmYWxzZSwgdHJ1ZSwgZmFsc2UpO1xuXHRcdFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YoJCgnLmdhbGxlcnktaW5uZXInKSk7XG5cdFx0VHdlZW5NYXgudG8oICQoJy5nYWxsZXJ5LWlubmVyJyksIDMsIHsgeDogLW5ld1Bvc2l0aW9uLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBkZWxheTogLjUsXG5cdFx0XHRvblN0YXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhhdC5uYXYudXBkYXRlU2VsZWN0ZWQoaWQpO1xuXHRcdFx0fSwgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoYXQuaW5UcmFuc2l0aW9uID0gZmFsc2U7XG5cdFx0XHRcdFR3ZWVuTWF4LnNldCggJCgnLmJvdHRvbS1uYXYtY292ZXInKSwgeyBkaXNwbGF5OiAnbm9uZScgfSApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdFxuXHRcdC8vIE5PIEFOSU1BVElPTlMgSUYgQUxSRUFEWSBUSEVSRVxuXHRcdGlmICggbmV3UG9zaXRpb24gPT0gY3VyUG9zaXRpb24gKSByZXR1cm47XG5cdFx0XG5cdFx0Ly8gU0lHTkFUVVJFIERSQVdJTkcgUkVTVEFSVFx0XG5cdFx0aWYgKGlkICE9IDApIHtcblx0XHRcdHRoYXQuZ2FsbGVyeUl0ZW1zLmdhbGxlcnlJdGVtc1tpZF0uaW1nU2VxLmdvVG8oMCk7XG5cdFx0XHR0aGF0LmdhbGxlcnlJdGVtcy5nYWxsZXJ5SXRlbXNbaWRdLmltZ1NlcS5wYXVzZSgpO1xuXHRcdH1cblx0XHRcblx0XHQvLyBHRU5FUklDIEFOSU1BVElPTlNcblx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5nLWl0ZW06ZXEoJyArIGlkICsgJykgLm1hZGUtYnknKSwgMiwgeyBhdXRvQWxwaGE6IDAgfSwgeyBhdXRvQWxwaGE6IDEsIGVhc2U6IEV4cG8uRWFzZU91dCwgZGVsYXk6IDIgfSApO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmctaXRlbTplcSgnICsgaWQgKyAnKSAuc2lnJyksIC41LCB7IGF1dG9BbHBoYTogMCB9LCB7IGF1dG9BbHBoYTogMSwgZGVsYXk6IDEsIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKGlkICE9IDApIHtcblx0XHRcdFx0dGhhdC5nYWxsZXJ5SXRlbXMuZ2FsbGVyeUl0ZW1zW2lkXS5pbWdTZXEuYmVnaW4oKTtcblx0XHRcdH1cblx0XHR9fSk7XG5cdFx0XG5cdFx0Ly8gRElSRUNUSU9OIFNQRUNJRklDIEFOSU1BVElPTlNcblx0XHRpZiAoIG5ld1Bvc2l0aW9uID4gY3VyUG9zaXRpb24gKXtcblx0XHRcdC8vIE5FVyBTRUNUSU9OIElURU1TXG5cdFx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5nLWl0ZW06ZXEoJyArIGlkICsgJykgLmZpbG0taWNvbicpLCAzLjUsIHsgeDogNTAwIH0sIHsgeDogMCwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IC41IH0gKTtcblx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8oICQoJy5nLWl0ZW06ZXEoJyArIGlkICsgJykgLmJ0bi1jaXJjbGUgLnZpZXctdGV4dCcpLCAzLCB7IHg6IDUwIH0sIHsgeDogMCwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IC41IH0sIC4xICk7XG5cdFx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCAkKCcuZy1pdGVtOmVxKCcgKyBpZCArICcpIC5idG4tY2lyY2xlIC52aWV3LXRleHQnKSwgMywgeyBhdXRvQWxwaGE6IDAgfSwgeyBhdXRvQWxwaGE6IDEsIGRlbGF5OiAyLjUgfSwgLjI1ICk7XG5cdFx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCAkKCcuZy1pdGVtOmVxKCcgKyBpZCArICcpIC5idG4tY2lyY2xlIC52aWV3LXJpZ2h0JyksIC4yNSwgeyBoZWlnaHQ6IDAgfSwgeyBoZWlnaHQ6IDEwMCwgZWFzZTogUG93ZXIwLmVhc2VJbiwgZGVsYXk6IDIuNSB9LCAuMjUgKTtcblx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8oICQoJy5nLWl0ZW06ZXEoJyArIGlkICsgJykgLmJ0bi1jaXJjbGUgLnZpZXctbGVmdCcpLCAuMjUsIHsgaGVpZ2h0OiAwIH0sIHsgaGVpZ2h0OiAxMDAsIGVhc2U6IFBvd2VyMC5lYXNlb3V0LCBkZWxheTogMi43NSB9LCAuMjUgKTtcblx0XHRcdC8vIE9MRCBTRUNUSU9OIElURU1TXG5cdFx0XHRUd2Vlbk1heC50byggJCgnLmctaXRlbTplcSgnICsgdGhpcy5jdXJyZW50SWQgKyAnKSAuZmlsbS1pY29uJyksIDMsIHsgeDogLTUwMCwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IC41IH0gKTtcblx0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBORVcgU0VDVElPTiBJVEVNU1xuXHRcdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuZy1pdGVtOmVxKCcgKyBpZCArICcpIC5maWxtLWljb24nKSwgMy41LCB7IHg6IC01MDAgfSwgeyB4OiAwLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBkZWxheTogLjUgfSApO1xuXHRcdFx0VHdlZW5NYXguc3RhZ2dlckZyb21UbyggJCgnLmctaXRlbTplcSgnICsgaWQgKyAnKSAuYnRuLWNpcmNsZSAudmlldy10ZXh0JyksIDMsIHsgeDogLTUwIH0sIHsgeDogMCwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IC41IH0sIC0uMSApO1xuXHRcdFx0VHdlZW5NYXguc3RhZ2dlckZyb21UbyggJCgnLmctaXRlbTplcSgnICsgaWQgKyAnKSAuYnRuLWNpcmNsZSAudmlldy10ZXh0JyksIDMsIHsgYXV0b0FscGhhOiAwIH0sIHsgYXV0b0FscGhhOiAxLCBkZWxheTogMyB9LCAtLjI1ICk7XG5cdFx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCAkKCcuZy1pdGVtOmVxKCcgKyBpZCArICcpIC5idG4tY2lyY2xlIC52aWV3LXJpZ2h0JyksIC4yNSwgeyBoZWlnaHQ6IDAgfSwgeyBoZWlnaHQ6IDEwMCwgZWFzZTogUG93ZXIwLmVhc2VJbiwgZGVsYXk6IDMgfSwgLS4yNSApO1xuXHRcdFx0VHdlZW5NYXguc3RhZ2dlckZyb21UbyggJCgnLmctaXRlbTplcSgnICsgaWQgKyAnKSAuYnRuLWNpcmNsZSAudmlldy1sZWZ0JyksIC4yNSwgeyBoZWlnaHQ6IDAgfSwgeyBoZWlnaHQ6IDEwMCwgZWFzZTogUG93ZXIwLmVhc2VvdXQsIGRlbGF5OiAzLjI1IH0sIC0uMjUgKTtcblx0XHRcdC8vIE9MRCBTRUNUSU9OIElURU1TXG5cdFx0XHRUd2Vlbk1heC50byggJCgnLmctaXRlbTplcSgnICsgdGhpcy5jdXJyZW50SWQgKyAnKSAuZmlsbS1pY29uJyksIDMsIHsgeDogNTAwLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBkZWxheTogLjUgfSApO1xuXHRcdH1cblxuXHRcdC8vIFNFVCBXSEVSRSBXRSBBUkUgQVRcblx0XHR0aGlzLmN1cnJlbnRJZCA9IGlkO1xuXHRcdFxuXHR9LFxuXHRoYW5kbGVLZXlQcmVzczogZnVuY3Rpb24oZSl7XG5cdFx0aWYgKCB0aGlzLmluVHJhbnNpdGlvbiApIHJldHVybjtcblx0XHR2YXIga2V5Q29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoLCBhcnJvdyA9IHtsZWZ0OiAzNywgdXA6IDM4LCByaWdodDogMzksIGRvd246IDQwIH07XG5cdFx0dmFyIHRhcmdldElkID0gdGhpcy5jdXJyZW50SWQ7XG5cdFx0c3dpdGNoIChrZXlDb2RlKSB7XG5cdFx0XHRjYXNlIGFycm93LnVwOlxuXHRcdFx0Y2FzZSBhcnJvdy5sZWZ0OlxuXHRcdFx0XHR0YXJnZXRJZC0tO1xuXHRcdFx0XHR0aGlzLmdsb2JhbC50cmlnZ2VyKFwic3RhcnR0aW1lclwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIGFycm93LmRvd246XG5cdFx0XHRjYXNlIGFycm93LnJpZ2h0OlxuXHRcdFx0XHR0aGlzLmdsb2JhbC50cmlnZ2VyKFwic3RhcnR0aW1lclwiKTtcblx0XHRcdFx0dGFyZ2V0SWQrKztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHRoaXMuaGFuZGxlU2VsZWN0TmF2KHRhcmdldElkKTtcblx0fSxcblx0aGFuZGxlRGV0YWlsU2VsZWN0OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHQvL2NvbnNvbGUubG9nKFwiZ2FsIGhhbmRsZSBzZWxlY3QgY29udGVudFwiLGNvbnRlbnQpO1xuXHRcdHRoaXMudHJpZ2dlcihcInNlbGVjdERldGFpbFwiLCBjb250ZW50KTtcblx0fSxcblx0aGFuZGxlU2VsZWN0VmlkZW86IGZ1bmN0aW9uKGNvbnRlbnQsIGlkeCl7XG5cdFx0XG5cdFx0dGhpcy50cmlnZ2VyKFwic2VsZWN0VmlkZW9cIiwgY29udGVudCk7XG5cdH0sXG5cdHN0YXJ0VGltZXI6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5zdG9wVGltZXIoKTtcblx0XHQvL2NvbnNvbGUubG9nKFwiU1RBUlQgVElNRVJcIik7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHRoaXMudGltZXJJbnRlcmFjdGlvbiA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGF0LmNoZWNrVGltZXIoKTtcblx0XHR9LCAxMDAwMCk7XG5cdH0sXG5cdHN0b3BUaW1lcjogZnVuY3Rpb24oKXtcblx0XHQvL2NvbnNvbGUubG9nKFwiU1RPUCBUSU1FUlwiKTtcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lckludGVyYWN0aW9uKTtcblx0XHR0aGlzLnRpbWVySW50ZXJhY3Rpb24gPSAwO1xuXHR9LFxuXHRjaGVja1RpbWVyOiBmdW5jdGlvbigpe1xuXHRcdC8vY29uc29sZS5sb2coXCJDSEVDSyBUSU1FUlwiKTtcblx0XHRpZiAoIHRoaXMuaW5UcmFuc2l0aW9uIHx8IHRoaXMuaW5Nb2RhbCApIHtcblx0XHRcdC8vIFNJVEUgSVMgTU9WSU5HLiBKVVNUIFJFU1RBUlQgVElNRVIuXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEdPIFRPIFRIRSBORVhUIFNFQ1RJT05cblx0XHRcdHZhciB0YXJnZXRJZCA9IHRoaXMuY3VycmVudElkO1xuXHRcdFx0XHR0YXJnZXRJZCsrO1xuXHRcdFx0aWYgKHRhcmdldElkID4gNCkgdGFyZ2V0SWQgPSAwO1xuXHRcdFx0dGhpcy5oYW5kbGVTZWxlY3ROYXYodGFyZ2V0SWQpO1xuXHRcdH07XG5cdFx0dGhpcy5zdG9wVGltZXIoKTtcblx0XHR0aGlzLnN0YXJ0VGltZXIoKTtcblx0fSxcblx0c2V0T3ZlcmxheU1vZGU6IGZ1bmN0aW9uKGJvb2xlYW4pe1xuXHRcdHRoaXMuaW5Nb2RhbCA9IGJvb2xlYW47XG5cdH0sXG5cdHJlc2l6ZTogZnVuY3Rpb24oKXtcdFx0XG5cdFx0dmFyICR3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0aWYgKCR3IDwgMTAwMCkgJHcgPSAxMDAwO1xuXHRcdHZhciBmdWxsV2lkdGggPSAkdyAqIDEuNSAqIDYgO1xuXHRcdHRoaXMuJGVsLmNzcyhcIndpZHRoXCIsIGZ1bGxXaWR0aCk7XG5cdFx0dGhpcy5naVdpZHRoID0gJHcgKiAxLjU7XG5cdFx0XG5cdFx0VHdlZW5NYXguc2V0KCAkKCcuZ2FsbGVyeS1pbm5lcicpLCB7IHg6IC0odGhpcy5naVdpZHRoICogdGhpcy5jdXJyZW50SWQpIH0gKTtcblx0fVxufSk7ICAiLCJ2YXIgR2FsbGVyeUl0ZW0gICAgICAgICAgICAgPSAgIHJlcXVpcmUoXCIuL0dJdGVtLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3QmFzZS5leHRlbmQoe1xuXG5cdFx0dGVtcGxhdGUgOiByZXF1aXJlKFwiLi8uLi90ZW1wbGF0ZXMvZ2FsbGVyeS1pdGVtcy50cGxcIiksIFxuXG5cdFx0aW5pdDogZnVuY3Rpb24oKXtcdFx0XHRcblx0XHRcdHZhciBkYXRhID0gdGhpcy5vcHRpb25zLmRhdGE7XG5cdFx0XHR0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe2tleTpcImdhbGxlcnktaXRlbXNcIn0pKTtcblx0XHRcdCQoXCIuZ2FsbGVyeS1pbm5lclwiKS5hcHBlbmQodGhpcy4kZWwpO1xuXHRcdFx0Ly9jcmVhdGUgZ2FsbGVyeSBpdGVtc1xuXHRcdFx0dGhpcy5nYWxsZXJ5SXRlbXMgPSBbXTtcblx0XHRcdGZvcihpPTA7aTxkYXRhLmdhbGxlcnlJdGVtcy5sZW5ndGg7aSsrKXtcblx0XHRcdFx0dmFyIGdhbGxlcnlJdGVtID0gbmV3IEdhbGxlcnlJdGVtKHtpbmRleDogaSwgZ2FsbGVyeUl0ZW06IGRhdGEuZ2FsbGVyeUl0ZW1zW2ldLCBnbG9iYWw6IHRoaXMuZ2xvYmFsLCBsb2NhbDogdGhpcy5sb2NhbH0pO1xuXHRcdFx0XHR0aGlzLmdhbGxlcnlJdGVtcy5wdXNoKGdhbGxlcnlJdGVtKTtcblx0XHRcdFx0Z2FsbGVyeUl0ZW0ub24oJ3NlbGVjdERldGFpbCcsIHRoaXMuaGFuZGxlU2VsZWN0RGV0YWlsLmJpbmQodGhpcykpO1xuXHRcdFx0XHRnYWxsZXJ5SXRlbS5vbignc2VsZWN0VmlkZW8nLCB0aGlzLmhhbmRsZVNlbGVjdFZpZGVvLmJpbmQodGhpcykpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQkKFwiLmdhbGxlcnktaXRlbXNcIikuY3NzKFwiaGVpZ2h0XCIsICQod2luZG93KS5oZWlnaHQoKSk7XG5cdFx0XHRcblx0XHRcdHRoaXMuYmluZEV2ZW50cygpO1xuXHRcdH0sXG5cdFx0YmluZEV2ZW50czogZnVuY3Rpb24oKXtcbiAgICAgICAgXHQkKHdpbmRvdykub24oXCJyZXNpemVcIiwgdGhpcy5yZXNpemUuYmluZCh0aGlzKSk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWxlY3REZXRhaWw6IGZ1bmN0aW9uKGluZGV4KXtcblx0XHR2YXIgY29udGVudCA9IHRoaXMub3B0aW9ucy5kYXRhLmdhbGxlcnlJdGVtc1tpbmRleC5pZHhdO1xuXHRcdHRoaXMudHJpZ2dlcihcInNlbGVjdERldGFpbFwiLCB7Y29udGVudDogY29udGVudH0pO1xuXHRcdH0sXG5cdFx0aGFuZGxlU2VsZWN0VmlkZW86IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHZhciBjb250ZW50ID0gdGhpcy5vcHRpb25zLmRhdGEuZ2FsbGVyeUl0ZW1zW2luZGV4LmlkeF07XG5cdFx0XHRcblx0XHRcdC8vdW5zZWxlY3Qgb3RoZXIgaXRlbXNcblx0XHRcdC8vY29uc29sZS5sb2coXCJnYWwgaGFuZGxlIHNlbGVjdHZpZGVvIGluZGV4XCIsaW5kZXgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImdhbCBoYW5kbGUgc2VsZWN0dmlkZW8gY29udGVudFwiLGNvbnRlbnQpO1xuXHRcdFx0Ly90aGlzLnRyaWdnZXIoXCJzZWxlY3RWaWRlb1wiLCB7Y29udGVudDogY29udGVudCwgaWR4OiBpbmRleC5pZHh9KTtcblx0XHR9LFxuXHRcdHJlc2l6ZTogZnVuY3Rpb24oKXtcblx0XHRcdCQoXCIuZ2FsbGVyeS1pdGVtc1wiKS5jc3MoXCJoZWlnaHRcIiwgJCh3aW5kb3cpLmhlaWdodCgpKTtcblx0XHR9IFxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3QmFzZS5leHRlbmQoe1xuXHR0ZW1wbGF0ZSA6IHJlcXVpcmUoXCIuLy4uL3RlbXBsYXRlcy9nYWxsZXJ5LW5hdi50cGxcIiksIFxuXHRpbml0OiBmdW5jdGlvbigpe1x0XHRcdFxuXHRcdHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7a2V5OlwiZ2FsbGVyeS1uYXZcIn0pKTtcblx0XHQkKFwiLm1haW5cIikuYXBwZW5kKHRoaXMuJGVsKTtcblx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0XHR0aGlzLiRlbC5maW5kKFwiLm5hdjBcIikuYWRkQ2xhc3MoXCJzZWxlY3RlZFwiKTtcblx0XHRcblx0XHRpZiAobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIldpblwiKSE9LTEpe1xuXHRcdCAgICAgLy9JdCBpcyBXaW5kb3dzXG5cdFx0ICAgICB0aGlzLiQoXCIubmFtZVwiKS5jc3MoXCJ0b3BcIiwgXCI3cHhcIik7XG5cdFx0fWVsc2UgaWYobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIkxpbnV4XCIpIT0tMSl7XG5cdFx0ICAgICAvL0l0IGlzIExpbnV4XG4gXHRcdCAgICAgdGhpcy4kKFwiLm5hbWVcIikuY3NzKFwidG9wXCIsIFwiNHB4XCIpO1xuXHRcdH1lbHNlIGlmKG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNYWNcIikhPS0xKXtcblx0XHQgICAgIC8vSXQgaXMgTWFjXG4gXHRcdCAgICAgdGhpcy4kKFwiLm5hbWVcIikuY3NzKFwidG9wXCIsIFwiNHB4XCIpO1xuXHRcdH1cblxuXHR9LFxuXHRiaW5kRXZlbnRzOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuJGVsLmZpbmQoXCIudHJrXCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5zZW5kVHJhY2tpbmdFdmVudC5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmdsb2JhbC5vbihcImRlZXBsaW5rXCIsdGhpcy5oYW5kbGVEZWVwTGluay5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLiRlbC5maW5kKCcubmF2LWl0ZW0nKS5vbignY2xpY2snLCB0aGlzLnNjcm9sbE5hdi5iaW5kKHRoaXMpKTtcblx0XHRcblx0XHR0aGF0ID0gdGhpcztcblx0XHR0aGlzLiRlbC5maW5kKCcuYm90dG9tLW5hdicpLmhvdmVyKFxuXHRcdFx0IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCAvLyBUSU1FUlxuXHRcdFx0XHR0aGF0Lmdsb2JhbC50cmlnZ2VyKFwic3RvcHRpbWVyXCIpO1xuXHRcdFxuXHRcdFx0XHQvL1R3ZWVuTWF4LnRvKCAkKCcuZ2FsbGVyeS1pbm5lcicpLCAxLCB7IHk6IC03MCwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRUd2Vlbk1heC50byggJCgnLmJhci1leHRyYScpLCAxLCB7IHk6IC02MCwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCQoJy5uYXYtaXRlbScpLCAuNzUsIHsgeTogLTUwLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSwgLjA1ICk7XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLmJhci1ib3R0b20nKSwgLjc1LCB7IHk6IDM1LCBlYXNlOiBFeHBvLmVhc2VPdXQgfSwgLjA1ICk7XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLmJhci1sZWZ0JyksIC43NSwgeyB5OiAxNSwgZWFzZTogRXhwby5lYXNlT3V0IH0sIC4wNSApO1xuXHRcdFx0XHRcblx0XHRcdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuaWNvbicpLCAuNzUsIHsgeTogMCwgYXV0b0FscGhhOiAxIH0sIHsgeTogMCwgYXV0b0FscGhhOiAwLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSApO1xuXHRcdFx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5pY29uYmlnJyksIC43NSwgeyB5OiAzMCwgYXV0b0FscGhhOiAwIH0sIHsgeTogMTAsIGF1dG9BbHBoYTogMSwgZGlzcGxheTogXCJibG9ja1wiLCBlYXNlOiBFeHBvLmVhc2VPdXQsIGRlbGF5OiAuMSB9KTtcblx0XHRcdFx0XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLm51bScpLCAuNzUsIHsgeTogMCwgYXV0b0FscGhhOiAwLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSwgLjA1ICk7XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLm51bSAubnVtYmVyMScpLCAuNzUsIHsgeTogLTIwLCBhdXRvQWxwaGE6IDAsIGVhc2U6IEV4cG8uZWFzZU91dCAgfSwgLjA1ICk7XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLm51bSAubnVtYmVyMicpLCAuNzUsIHsgeTogLTIwLCBhdXRvQWxwaGE6IDAsIGVhc2U6IEV4cG8uZWFzZU91dCwgZGVsYXk6IC4xICB9LCAuMDUgKTtcblx0XHRcdFx0XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8oICQoJy5udW1iaWcnKSwgLjc1LCB7IHk6IDAsIGF1dG9BbHBoYTogMCB9LCB7IHk6IDAsIGF1dG9BbHBoYTogMSwgZGlzcGxheTogXCJibG9ja1wiLCBlYXNlOiBFeHBvLmVhc2VPdXQgIH0sIC4wNSApO1xuXHRcdFx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCAkKCcubnVtYmlnIC5udW1iZXIxJyksIC43NSwgeyB5OiAxMCwgYXV0b0FscGhhOiAwIH0sIHsgeTogMCwgYXV0b0FscGhhOiAxLCBlYXNlOiBFeHBvLmVhc2VPdXQgIH0sIC4wNSApO1xuXHRcdFx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCAkKCcubnVtYmlnIC5udW1iZXIyJyksIC43NSwgeyB5OiAxMCwgYXV0b0FscGhhOiAwIH0sIHsgeTogMCwgYXV0b0FscGhhOiAxLCBlYXNlOiBFeHBvLmVhc2VPdXQsIGRlbGF5OiAuMSAgfSwgLjA1ICk7XG5cdFx0XHRcdFxuXHRcdFx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCAkKCcuZmlyc3QnKSwgLjc1LCB7IHk6IDE1LCBhdXRvQWxwaGE6IDAgfSwgeyB5OiAwLCBhdXRvQWxwaGE6IDEsIGRpc3BsYXk6IFwiYmxvY2tcIiwgZWFzZTogRXhwby5lYXNlT3V0IH0sIC4wNSApO1xuXHRcdFx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCAkKCcubGFzdCcpLCAuNzUsIHsgeTogMTUsIGF1dG9BbHBoYTogMCB9LCB7IHk6IDAsIGF1dG9BbHBoYTogMSwgZGlzcGxheTogXCJibG9ja1wiLCBlYXNlOiBFeHBvLmVhc2VPdXQsIGRlbGF5OiAuMSB9LCAuMDUgKTtcblx0XHRcdFx0XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8oICQoJy5hbmltLWRsJyksIC43NSwgeyB5OiAwIH0sIHsgeTogLTMwLCBlYXNlOiBFeHBvLmVhc2VPdXQsIGRlbGF5OiAuMyB9LCAuMDUgKTtcblx0XHRcdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuZG93bmxvYWQtbGlua3MgcCcpLCAuNzUsIHsgeTogMCB9LCB7IHk6IC0zMCwgZWFzZTogRXhwby5lYXNlT3V0LCBkZWxheTogLjQgfSApO1xuXHRcdFx0IH0sXG5cdFx0XHQgZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly8gVElNRVJcblx0XHRcdFx0dGhhdC5nbG9iYWwudHJpZ2dlcihcInN0YXJ0dGltZXJcIik7XG5cdFx0XHRcdCBcblx0XHRcdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiggJCgnLmJhci1leHRyYScpICk7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YoICQoJy5uYXYtaXRlbScpICk7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YoICQoJy5iYXItYm90dG9tJykgKTtcblx0XHRcdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiggJCgnLmJhci1sZWZ0JykgKTtcblx0XHRcdFx0IFxuXHRcdFx0XHRUd2VlbkxpdGUua2lsbFR3ZWVuc09mKCAkKCcuaWNvbicpKTtcblx0XHRcdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiggJCgnLmljb25iaWcnKSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRUd2VlbkxpdGUua2lsbFR3ZWVuc09mKCAkKCcubnVtJykpO1xuXHRcdFx0XHRUd2VlbkxpdGUua2lsbFR3ZWVuc09mKCAkKCcubnVtIC5udW1iZXIxJykgKTtcblx0XHRcdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiggJCgnLm51bSAubnVtYmVyMicpICk7XG5cdFx0XHRcdFxuXHRcdFx0XHRUd2VlbkxpdGUua2lsbFR3ZWVuc09mKCAkKCcubnVtYmlnJykgKTtcblx0XHRcdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiggJCgnLm51bWJpZyAubnVtYmVyMScpICk7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YoICQoJy5udW1iaWcgLm51bWJlcjInKSApO1xuXHRcdFx0XHRcblx0XHRcdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiggJCgnLmZpcnN0JykgKTtcblx0XHRcdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiggJCgnLmxhc3QnKSApO1xuXHRcdFx0XHRcblx0XHRcdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiggJCgnLmFuaW0tZGwnKSApO1xuXHRcdFx0XHRUd2VlbkxpdGUua2lsbFR3ZWVuc09mKCAkKCcuZG93bmxvYWQtbGlua3MgcCcpICk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvL1R3ZWVuTWF4LnRvKCAkKCcuZ2FsbGVyeS1pbm5lcicpLCAxLCB7IHk6IDAsIGVhc2U6IEV4cG8uZWFzZU91dCB9KTtcblx0XHRcdFx0VHdlZW5NYXgudG8oICQoJy5iYXItZXh0cmEnKSwgMSwgeyB5OiAwLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRUd2Vlbk1heC50byggJCgnLmljb24nKSwgLjc1LCB7IHk6IDAsIGF1dG9BbHBoYTogMSwgZWFzZTogRXhwby5lYXNlT3V0LCBkZWxheTogLjEgfSk7XG5cdFx0XHRcdFR3ZWVuTWF4LnRvKCAkKCcuaWNvbmJpZycpLCAuNzUsIHsgeTogMzAsIGF1dG9BbHBoYTogMCwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCAkKCcubmF2LWl0ZW0nKSwgLjc1LCB7IHk6IDAsIGVhc2U6IEV4cG8uZWFzZU91dCB9LCAuMDUgKTtcblx0XHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCAkKCcuYmFyLWJvdHRvbScpLCAuNzUsIHsgeTogMCwgZWFzZTogRXhwby5lYXNlT3V0IH0sIC4wNSApO1xuXHRcdFx0XHRUd2Vlbk1heC5zdGFnZ2VyVG8gKCQoJy5iYXItbGVmdCcpLCAuNzUsIHsgeTogMCwgZWFzZTogRXhwby5lYXNlT3V0IH0sIC4wNSApO1xuXHRcdFx0XHRcblx0XHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCAkKCcubnVtJyksIC43NSwgeyB5OiAwLCBhdXRvQWxwaGE6IDEsIGVhc2U6IEV4cG8uZWFzZU91dCB9LCAuMDUgKTtcblx0XHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCAkKCcubnVtIC5udW1iZXIyJyksIC43NSwgeyB5OiAwLCBhdXRvQWxwaGE6IDEsIGVhc2U6IEV4cG8uZWFzZU91dCAgfSwgLjA1ICk7XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLm51bSAubnVtYmVyMScpLCAuNzUsIHsgeTogMCwgYXV0b0FscGhhOiAxLCBlYXNlOiBFeHBvLmVhc2VPdXQsIGRlbGF5OiAuMSB9LCAuMDUgKTtcblx0XHRcdFx0XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLm51bWJpZycpLCAuNzUsIHsgeTogMCwgYXV0b0FscGhhOiAwLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSwgLjA1ICk7XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLm51bWJpZyAubnVtYmVyMScpLCAuNSwgeyB5OiAwLCBhdXRvQWxwaGE6IDAsIGVhc2U6IEV4cG8uZWFzZU91dCAgfSwgLjA1ICk7XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLm51bWJpZyAubnVtYmVyMicpLCAuNSwgeyB5OiAwLCBhdXRvQWxwaGE6IDAsIGVhc2U6IEV4cG8uZWFzZU91dCwgZGVsYXk6IC4xIH0sIC4wNSApO1xuXHRcdFx0XHRcblx0XHRcdFx0VHdlZW5NYXguc3RhZ2dlclRvKCAkKCcubGFzdCcpLCAuNSwgeyB5OiAwLCBhdXRvQWxwaGE6IDAsIGVhc2U6IEV4cG8uZWFzZU91dCwgZGVsYXk6IDAgfSwgLjA1ICk7XG5cdFx0XHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyggJCgnLmZpcnN0JyksIC41LCB7IHk6IDAsIGF1dG9BbHBoYTogMCwgZWFzZTogRXhwby5lYXNlT3V0LCBkZWxheTogLjEgfSwgLjA1ICk7XG5cdFx0XHRcdFxuXHRcdFx0XHRUd2Vlbk1heC5zdGFnZ2VyVG8oICQoJy5hbmltLWRsJyksIC43NSwgeyB5OiAwLCBlYXNlOiBFeHBvLmVhc2VPdXQsIGRlbGF5OiAuMyB9LCAuMDUgKTtcblx0XHRcdFx0VHdlZW5NYXgudG8oICQoJy5kb3dubG9hZC1saW5rcyBwJyksIC43NSwgeyB5OiAwLCBlYXNlOiBFeHBvLmVhc2VPdXQsIGRlbGF5OiAuMjUgfSApO1xuXHRcdFx0IH1cblx0XHQpO1xuXHR9LFxuXHR1cGRhdGVTZWxlY3RlZDogZnVuY3Rpb24oaWR4KSB7IC8vaWRcblx0XHRmb3IoaT0wO2k8PTQ7aSsrKXtcblx0XHRcdGlmKGkgPT0gaWR4KXtcblx0XHRcdFx0dGhpcy4kZWwuZmluZChcIi5uYXZcIitpZHgpLmFkZENsYXNzKFwic2VsZWN0ZWRcIik7XHRcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aGlzLiRlbC5maW5kKFwiLm5hdlwiK2kpLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XHRcdFxuXHRcdFx0fVx0XG5cdFx0fVxuXHR9LFxuXHRzY3JvbGxOYXY6IGZ1bmN0aW9uKGUpe1xuXHRcdHZhciBpZCA9IHBhcnNlSW50KGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSk7XG5cdFx0dGhpcy5sb2NhbC50cmlnZ2VyKFwibmF2OnNlbGVjdFwiLCBpZCk7XG5cdH0sXG5cdGFycm93U2Nyb2xsOiBmdW5jdGlvbihlKXtcblxuXHR9LFxuXHRoYW5kbGVEZWVwTGluazogZnVuY3Rpb24oZGVlcGxpbmspe1xuXHRcdCQoIFwiLm5hdlwiICsgZGVlcGxpbmsgKS50cmlnZ2VyKCBcImNsaWNrXCIgKTtcblx0fSxcblx0c2VuZFRyYWNraW5nRXZlbnQ6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIGNhdGVnb3J5ID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1jYXRlZ29yeScpO1xuXHRcdFx0dmFyIGxhYmVsID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1sYWJlbCcpO1xuXHRcdFx0dmFyIGV2ZW50U3RyID0gY2F0ZWdvcnkgKyBcIiBcIiArIGxhYmVsO1xuXHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXRlZ29yeSwgJ2NsaWNrJywgbGFiZWwpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhldmVudFN0cik7XG5cdH1cbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWxCYXNlLmV4dGVuZCh7XG5cdFx0XG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHRcdFxuXHRcdH1cblx0XHRcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlld0Jhc2UuZXh0ZW5kKHtcblxuXHRcdGlkOiBcImhlYWRlclwiLFxuXHRcdHRlbXBsYXRlIDogcmVxdWlyZShcIi4vLi4vdGVtcGxhdGVzL2hlYWRlci50cGxcIiksIFxuXG5cdFx0ZXZlbnRzOiB7XG5cdFx0XHRcblx0XHR9LCBcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCl7XHRcdFx0XG5cdFx0XHR0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe2tleTpcImhlYWRlclwifSkpO1xuXHRcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdFxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3QmFzZS5leHRlbmQoe1xuXG5cdHRlbXBsYXRlIDogcmVxdWlyZShcIi4vLi4vdGVtcGxhdGVzL2ludHJvLnRwbFwiKSwgXG5cdGV2ZW50czoge1xuXHRcdFxuXHR9LCBcblxuXHRpbml0OiBmdW5jdGlvbigpe1x0XHRcdFxuXHRcdHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7a2V5OlwiaW50cm9cIn0pKTtcblx0XHR0aGlzLiRlbC5jc3MoXCJ3aWR0aFwiLCAkKHdpbmRvdykud2lkdGgoKSlcblx0XHRUd2Vlbk1heC5zZXQoICQoJyNsb2FkZXItcGFuZWwnKSwgeyBhdXRvQWxwaGE6IDAsIGRpc3BsYXk6ICdibG9jaycgfSApO1xuXHRcdFR3ZWVuTWF4LnNldCggJCgnI2ludHJvLXBhbmVsJyksIHsgYXV0b0FscGhhOiAwLCBkaXNwbGF5OiAnYmxvY2snIH0gKTtcblx0XHRUd2Vlbk1heC5zZXQoICQoJy5sb2FkZXItc3ByaXRlJyksIHsgc2NhbGVYOiAuOCwgc2NhbGVZOiAuOCB9ICk7XG5cdFx0XG5cdFx0dGhpcy5iaW5kRXZlbnRzKCk7XG5cdFxuXHRcdHRoaXMuc2hvd1ByZWxvYWRlcigpO1xuXHR9LFxuXHRiaW5kRXZlbnRzOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLiRlbC5maW5kKCcuaW50cm8tc2hvZScpLm9uKFwiY2xpY2tcIiwgdGhpcy5zZWxlY3RPcHRpb24uYmluZCh0aGlzKSk7XG4gICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5nbG9iYWwub24oXCJwcmVsb2FkZXI6cHJlbG9hZGVkXCIsdGhpcy5vblByZWxvYWRlZC5iaW5kKHRoaXMpKVxuXHR9LFxuXHRvblByZWxvYWRlZDogZnVuY3Rpb24oKXtcblx0XHR0aGlzLmhpZGVQcmVsb2FkZXIoKTtcblx0fSxcblx0c2hvd1ByZWxvYWRlcjogZnVuY3Rpb24oKXtcblx0XHR0aGF0ID0gdGhpcztcblx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJyNsb2FkZXItcGFuZWwnKSwgMSwgeyBhdXRvQWxwaGE6IDAgfSwgeyBhdXRvQWxwaGE6IDEsIGRpc3BsYXk6ICdibG9jaycsIGRlbGF5OiAxLCBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vdGhhdC5oaWRlUHJlbG9hZGVyKCk7XG5cdFx0fX0pO1xuXHR9LFxuXHRoaWRlUHJlbG9hZGVyOiBmdW5jdGlvbigpe1xuXHRcdHRoYXQgPSB0aGlzO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnI2xvYWRlci1wYW5lbCcpLCAyLCB7IGF1dG9BbHBoYTogMSB9LCB7IGF1dG9BbHBoYTogMCwgZGlzcGxheTogJ25vbmUnLCBkZWxheTogMSwgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGF0LnNob3dJbnRybygpO1xuXHRcdH19KTtcblx0fSxcblx0c2hvd0ludHJvOiBmdW5jdGlvbigpe1xuXHRcdHRoYXQgPSB0aGlzO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnI2ludHJvLXBhbmVsJyksIC4yNSwgeyBhdXRvQWxwaGE6IDAgfSwgeyBhdXRvQWxwaGE6IDEsIGRpc3BsYXk6ICdibG9jayd9KTtcblx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5pbnRybyBoMScpLCAyLCB7IHg6IDEwMCwgYXV0b0FscGhhOiAwIH0sIHsgeDogMCwgYXV0b0FscGhhOiAxLCBlYXNlOiBFeHBvLmVhc2VPdXQgfSApO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmludHJvIC51bmRlcmxpbmUnKSwgMSwgeyBzY2FsZVg6IC41ICwgYXV0b0FscGhhOiAwIH0sIHsgc2NhbGVYOiAxLCBhdXRvQWxwaGE6IDEsIHRyYW5zZm9ybU9yaWdpbjpcInJpZ2h0IHRvcFwiLCBlYXNlOiBFeHBvLkVhc2VPdXQgfSk7XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuaW50cm8gaDInKSwgMiwgeyB4OiAxMDAsIGF1dG9BbHBoYTogMCB9LCB7IHg6IDAsIGF1dG9BbHBoYTogMSwgZWFzZTogRXhwby5lYXNlT3V0LCBkZWxheTogLjI1IH0gKTtcblx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCAkKCcuaW50cm8gLmludHJvLXNob2UnKSwgMiwgeyB4OiAxMDAsIGF1dG9BbHBoYTogMCB9LCB7IHg6IDAsIGF1dG9BbHBoYTogMSwgZWFzZTogRXhwby5lYXNlT3V0IH0sIC4yNSApO1xuXHRcdC8vVHdlZW5NYXguZnJvbVRvKCAkKCcuaW50cm8gaDMnKSwgNCwgeyBhdXRvQWxwaGE6IDAgfSwgeyBhdXRvQWxwaGE6IDEsIGVhc2U6IEV4cG8uZWFzZU91dCwgZGVsYXk6IDIgfSk7XG5cdFx0XG5cdFx0Ly8gUVVJQ0sgVFlQRVdSSVRFUiBFRkZFQ1Rcblx0XHR2YXIgJHRhcmdldCA9ICQoXCIjaW50cm8tcGFuZWwgLnR5cGV3cml0ZXJcIik7XG5cdFx0dmFyICR0ZXh0ID0gJHRhcmdldC5odG1sKCk7XG5cdFx0JHRhcmdldC5odG1sKFxuXHRcdFx0JHRleHQucmVwbGFjZSgnPGJyPicsJ34nKVxuXHRcdFx0LnJlcGxhY2UoLy4vZywgJzxzcGFuIGNsYXNzPVwibGV0dGVyXCI+JCY8L3NwYW4+Jylcblx0XHRcdC5yZXBsYWNlKCd+JywgJzxicj4nIClcblx0XHQpO1xuXHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8oICQoJyNpbnRyby1wYW5lbCAubGV0dGVyJyksIC4wMSwgeyBhdXRvQWxwaGE6IDAgfSwgeyBhdXRvQWxwaGE6IDEgfSwgLjA1ICk7XG5cdFx0XG5cdFx0Ly8gNSBTRUNPTkQgREVMQVkgQkVGT1JFIElOVFJPIElTIFNLSVBQRURcblx0XHRUd2Vlbk1heC5kZWxheWVkQ2FsbCggNSwgdGhpcy5kZWVwbGlua0ludHJvLCBbMV0sIHRoaXMpO1xuXHR9LFxuXHRzZWxlY3RPcHRpb246IGZ1bmN0aW9uKGUpe1xuXHRcdHZhciBpZCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmluZGV4KCkpO1xuXHRcdHZhciBkZWVwbGluaztcblx0XHRcblx0XHRpZiAoaWQgPT0gNSkge1xuXHRcdFx0ZGVlcGxpbmsgPSAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZWVwbGluayA9IGlkICsgMTtcblx0XHR9XG5cdFx0VHdlZW5NYXgua2lsbERlbGF5ZWRDYWxsc1RvKHRoaXMuZGVlcGxpbmtJbnRybyk7XG5cdFx0dGhpcy5kZWVwbGlua0ludHJvKGRlZXBsaW5rKTtcblx0XHRcblx0XHQvLyByZW1vdmUgY2xpY2sgZXZlbnQgZnJvbSBzaG9lXG5cdFx0dGhpcy4kZWwuZmluZCgnLmludHJvLXNob2UnKS51bmJpbmQoXCJjbGlja1wiKTtcblx0fSxcblx0ZGVlcGxpbmtJbnRybzogZnVuY3Rpb24oZGVlcGxpbmspe1xuXHRcdHRoaXMuZ2xvYmFsLnRyaWdnZXIoXCJkZWVwbGlua1wiLGRlZXBsaW5rKTtcblx0XHR0aGlzLmhpZGVJbnRybyhkZWVwbGluayk7XG5cdH0sXG5cdGhpZGVJbnRybzogZnVuY3Rpb24oZGVlcGxpbmspe1xuXHRcdC8vIE1PVkUgVEhFIElOVFJPIFNFQ1RJT04gT1ZFUiBXSVRIIEVOVElSRSBHQUxMRVJZXG5cdFx0Ly92YXIgJHcgPSAkKHdpbmRvdykud2lkdGgoKSAqIDEuMjU7XG5cdFx0Ly92YXIgdGFyZ2V0UG9zaXRpb24gPSBNYXRoLmZsb29yKCR3ICogZGVlcGxpbmspO1xuXHRcdFxuXHRcdHZhciAkdyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdGlmICgkdyA8IDEwMDApICR3ID0gMTAwMDtcblx0XHR2YXIgdGFyZ2V0UG9zaXRpb24gPSBNYXRoLmZsb29yKCgkdyAgKiAxLjc1KSAqIGRlZXBsaW5rKTtcblx0XHRcblx0XHRUd2Vlbk1heC5zZXQoICQoJy5nLWl0ZW06ZXEoMCknKSwgeyBhdXRvQWxwaGE6IDAsIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnIH0pOyBcblx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5pbnRybycpLCAzLCB7IHg6IDAgfSwgeyB4OiAtdGFyZ2V0UG9zaXRpb24sIGVhc2U6IFBvd2VyNC5lYXNlSW5PdXQsIGRlbGF5OiAuNSB9KTtcblx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5pbnRybyBoMicpLCAxLCB7IGF1dG9BbHBoYTogMSB9LCB7IGF1dG9BbHBoYTogMCwgZGVsYXk6IC41IH0pO1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmludHJvJyksIDEsIHsgYXV0b0FscGhhOiAxIH0sIHsgYXV0b0FscGhhOiAwLCBkaXNwbGF5OiAnbm9uZScsIGRlbGF5OiAyLFxuXHRcdFx0b25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFR3ZWVuTWF4LnNldCggJCgnLmctaXRlbTplcSgwKScpLCB7IGF1dG9BbHBoYTogMSB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRcblx0XHQvLyBTSE9XIEJPVFRPTSBOQVZcblx0XHQvL1R3ZWVuTWF4LmZyb21UbyggJCgnLmJvdHRvbS1uYXYnKSwgMiwgeyB5OiA4MCwgYXV0b0FscGhhOiAwIH0sIHsgeTogMCwgYXV0b0FscGhhOiAxLCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBkZWxheTogMSB9KTtcblx0XHRUd2Vlbk1heC5zZXQoICQoJy5ib3R0b20tbmF2JyksIHsgeTogMCwgYXV0b0FscGhhOiAxIH0pO1xuXHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8oJCgnLm5hdi1pdGVtJyksIDEsIHsgeTogNjAgfSwgeyB5OiAwLCBlYXNlOiBQb3dlcjQuZWFzZU91dCwgZGVsYXk6IDIgfSwgLjEgKTtcblx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCQoJy5kb3dubG9hZC1saW5rcycpLCAxLCB7IHk6IDYwIH0sIHsgeTogMCwgZWFzZTogUG93ZXI0LmVhc2VPdXQsIGRlbGF5OiAyLjUgfSk7XG5cdFx0XG5cdFx0Ly8gU1RBUlQgVEhFIFNJVEUgVElNRVJcblx0XHR0aGlzLmdsb2JhbC50cmlnZ2VyKFwic3RhcnR0aW1lclwiKTtcblx0fSxcblx0cmVzaXplOiBmdW5jdGlvbigpe1xuXHRcdHZhciAkdyA9ICQod2luZG93KTtcblx0XHR2YXIgZnVsbFdpZHRoID0gJHcud2lkdGgoKTtcblx0XHR0aGlzLiRlbC5jc3MoXCJ3aWR0aFwiLCBmdWxsV2lkdGgpO1xuXHR9XG59KTsiLCJ2YXIgU2hhcmVzICAgICAgICAgICAgICA9ICAgcmVxdWlyZShcIi4vU29jaWFsLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXdCYXNlLmV4dGVuZCh7XG5cdGlkOiBcInBsYXllclwiLFxuXHR0ZW1wbGF0ZSA6IHJlcXVpcmUoXCIuLy4uL3RlbXBsYXRlcy9wbGF5ZXIudHBsXCIpLCBcblx0ZXZlbnRzOntcblx0XHQnY2xpY2sgLnBsYXktcGF1c2UnOiAndG9nZ2xlUGxheScsXG5cdFx0J2NsaWNrIC5tdXRlJzogJ3RvZ2dsZVNvdW5kJyxcblx0XHQnY2xpY2sgLmNsb3NlJzogJ2hpZGUnLFxuXHRcdCdjbGljayAuaG9tZSc6ICdoaWRlJyxcblx0XHQnY2xpY2sgLnJlcGxheSc6ICdyZXBsYXknLFxuXHRcdCdjbGljayAuYW5kcm9pZC1hcHAnOiAndG9QbGF5U3RvcmUnLFxuXHRcdCdjbGljayAuaW9zLWFwcCc6ICd0b0FwcFN0b3JlJyxcblx0XHQnY2xpY2sgLnRyayc6ICdzZW5kVHJhY2tpbmdFdmVudCdcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuaGFzUGxheWVkID0gZmFsc2U7XHRcdFx0XG5cdFx0dGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHtpZHg6LTF9KSk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImRhdGFcIix0aGlzLm9wdGlvbnMuZGF0YSk7XG5cdFx0LypwbGF5ZXIzNjAgPSBuZXcgaW1QbGF5ZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllckNvbnRhaW5lcicpKTtcblx0XHQvL2NvbnNvbGUubG9nKFwicGxheWVyMzYwIGxvYWRcIiwgdGhpcy5vcHRpb25zLmRhdGEuZ2FsbGVyeUl0ZW1zWzFdLnZpZGVvVVJMKTtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHBsYXllcjM2MC5vbkxvYWQgPSBmdW5jdGlvbihlKXtcblx0XHRcdC8vY29uc29sZS5sb2coXCJwbGF5ZXJMb2FkZWQhISFcIiwgX3RoaXMub3B0aW9ucy5kYXRhLmdhbGxlcnlJdGVtc1sxXS52aWRlb1VSTCk7XG5cdFx0XHRwbGF5ZXIzNjAubG9hZFNjZW5lUGx1Z2luKCdpbS5za2luLnNoYWRlcy5WaWRlb0JhcicsJ3BsdWdpbnMvSU1HdWkuc3dmJyk7XG5cdFx0Ly9cdHBsYXllcjM2MC5sb2FkVmlkZW8oX3RoaXMub3B0aW9ucy5kYXRhLmdhbGxlcnlJdGVtc1sxXS52aWRlb1VSTCk7XG5cdFx0fVxuXHRcdHBsYXllcjM2MC5pbml0KCcuLi9saWIvcGxheWVyLycpOyovXG5cdFx0Ly9jb25zb2xlLmxvZyhwbGF5ZXIzNjApO1xuXHRcdC8vY29uc29sZS5sb2coXCJzaGFyZXNcIix0aGlzLiRlbC5maW5kKCcuc2hhcmVzJykpO1xuXHRcdHRoaXMuYmluZEV2ZW50cygpO1xuXHRcdFxuXHRcdHRoaXMuY291bnRkb3duVGltZXI7XG5cdFx0dGhpcy5jb3VudGRvd25OdW1iZXIgPSA5O1xuXHRcdFxuXHR9LFxuXHRiaW5kRXZlbnRzOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuJGVsLmZpbmQoJy5za2lwJykub24oXCJjbGlja1wiLCB0aGlzLmNsb3NlSW5zdHJ1Y3Rpb25zLmJpbmQodGhpcykpO1xuXHQvL1x0dGhpcy4kZWwuZmluZCgnLmNsb3NlJykub24oJ2NsaWNrJywgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xuXHQvL1x0dGhpcy4kZWwuZmluZCgnLnBsYXktcGF1c2UnKS5vbignY2xpY2snLCB0aGlzLnRvZ2dsZVBsYXkuYmluZCh0aGlzKSk7IC8vd2FzIGRvdWJsZSBmaXJpbmdcblx0Ly9cdHRoaXMuJGVsLmZpbmQoJy5tdXRlJykub24oJ2NsaWNrJywgdGhpcy50b2dnbGVTb3VuZC5iaW5kKHRoaXMpKTtcblx0fSxcblx0cmVwbGF5OiBmdW5jdGlvbigpe1xuXHRcdHBsYXllcjM2MC5zZXRNZWRpYVByb3BlcnR5KFwiZnJhbWVudW1iZXJcIiwgMCk7XG5cdFx0cGxheWVyMzYwLnBsYXlWaWRlbygpO1xuXHRcdCQoJy5lbmQtc2NyZWVuJykuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcblx0fSxcblx0dG9nZ2xlUGxheTogZnVuY3Rpb24oKXtcblx0XHRpZih0aGlzLnBsYXlpbmcgPT0gdHJ1ZSl7XG5cdFx0XHR0aGlzLiQoJy5wYXVzZScpLmhpZGUoKTtcblx0XHRcdHRoaXMuJCgnLnBsYXknKS5zaG93KCk7XG5cdFx0XHR0aGlzLnBsYXlpbmc9IGZhbHNlO1xuXHRcdFx0cGxheWVyMzYwLnBhdXNlVmlkZW8oKTtcblx0XHR9ZWxzZXtcblx0XHRcdHRoaXMuJCgnLnBsYXknKS5oaWRlKCk7XG5cdFx0XHR0aGlzLiQoJy5wYXVzZScpLnNob3coKTtcblx0XHRcdHRoaXMucGxheWluZz0gdHJ1ZTtcblx0XHRcdHBsYXllcjM2MC5wbGF5VmlkZW8oKTtcblx0XHR9XG5cdH0sXG5cdHRvZ2dsZVNvdW5kOiBmdW5jdGlvbigpe1xuXHRcdGlmKHRoaXMubXV0ZWQgPT0gZmFsc2Upe1xuXHRcdFx0dGhpcy4kKCcuc291bmRPbicpLmhpZGUoKTtcblx0XHRcdHRoaXMuJCgnLnNvdW5kT2ZmJykuc2hvdygpO1xuXHRcdFx0dGhpcy5tdXRlZD0gdHJ1ZTtcblx0XHRcdHBsYXllcjM2MC5nZXRNZWRpYVByb3BlcnR5KFwidm9sdW1lXCIpOyAvL211c3QgZ2V0IGZpcnN0XG5cdFx0XHRwbGF5ZXIzNjAuc2V0TWVkaWFQcm9wZXJ0eShcInZvbHVtZVwiLCAwKTtcblx0XHR9ZWxzZXtcblx0XHRcdHRoaXMuJCgnLnNvdW5kT2ZmJykuaGlkZSgpO1xuXHRcdFx0dGhpcy4kKCcuc291bmRPbicpLnNob3coKTtcblx0XHRcdHRoaXMubXV0ZWQ9IGZhbHNlO1xuXHRcdFx0cGxheWVyMzYwLmdldE1lZGlhUHJvcGVydHkoXCJ2b2x1bWVcIik7IC8vbXVzdCBnZXQgZmlyc3Rcblx0XHRcdHBsYXllcjM2MC5zZXRNZWRpYVByb3BlcnR5KFwidm9sdW1lXCIsIDEpO1xuXHRcdH1cblx0fSxcblx0dG9BcHBTdG9yZTogZnVuY3Rpb24oKXtcblx0XHQvL3dpbmRvdy5sb2NhdGlvbiA9IFwiaHR0cHM6Ly9pdHVuZXMuYXBwbGUuY29tL3VzL2FwcC9pbi10aGVpci1jaHVja3MtMzYwLWV4cGVyaWVuY2UvaWQ5Njg4NDY5MTc/bXQ9OFwiO1xuXHRcdHdpbmRvdy5vcGVuKFwiaHR0cHM6Ly9pdHVuZXMuYXBwbGUuY29tL3VzL2FwcC9pbi10aGVpci1jaHVja3MtMzYwLWV4cGVyaWVuY2UvaWQ5Njg4NDY5MTc/bXQ9OFwiKTtcblx0XG5cdH0sXG5cdHRvUGxheVN0b3JlOiBmdW5jdGlvbigpe1xuXHRcdC8vd2luZG93LmxvY2F0aW9uID0gXCJodHRwczovL3BsYXkuZ29vZ2xlLmNvbS9zdG9yZS9hcHBzL2RldGFpbHM/aWQ9Y29tLmNvbnZlcnNlLmludGhlaXJjaHVja3NcIjtcblx0XHR3aW5kb3cub3BlbihcImh0dHBzOi8vcGxheS5nb29nbGUuY29tL3N0b3JlL2FwcHMvZGV0YWlscz9pZD1jb20uY29udmVyc2UuaW50aGVpcmNodWNrc1wiKTtcblx0fSxcblx0dXBkYXRlQ29udGVudDogZnVuY3Rpb24ob2JqKXtcblx0XHQvL3RoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7aWR4Om9iai5pZHh9KSk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImluZGV4XCIsb2JqLmlkeCk7XG5cdFx0Ly9zdGFydCBUaW1lclxuXHRcdHZhciBkID0gbmV3IERhdGUoKTtcbiAgICBcdHRoaXMuc3RhcnRUaW1lID0gZC5nZXRUaW1lKCk7XG5cdFx0dGhpcy5jcmVhdG9yID0gdGhpcy5vcHRpb25zLmRhdGEuZ2FsbGVyeUl0ZW1zW29iai5pZHhdLmNyZWF0b3I7XG5cdFx0dmFyIHRoZVVSTCA9IHRoaXMuZ2V0VVJMKG9iaik7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHQkLmFqYXgoe1xuXHRcdCAgZGF0YVR5cGU6ICdqc29uJyxcdFxuICAgICAgICAgIHVybDogdGhlVVJMLFxuXHQgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0ICAgICAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoIFwidGV4dC9wbGFpbjsgY2hhcnNldD14LXVzZXItZGVmaW5lZFwiICk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSlcblx0ICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKCBkYXRhICkge1xuXG5cdCAgICAgICAgICAgICAgdmFyIHZpZFVSTCA9IGRhdGEudmlkZW9zWzBdLnZpZGVvVXJsO1xuXHQgICAgICAgICAgICBcdF90aGlzLnNldFBsYXllcihvYmosIHZpZFVSTCk7XG5cdCAgICAgICAgICB9KTtcblx0fSxcblx0cGFkZGluZzogZnVuY3Rpb24obnVtLCBzaXplKXtcbiAgICBcdHZhciBzID0gXCIwMDAwMDAwMDBcIiArIG51bTtcbiAgICBcdHJldHVybiBzLnN1YnN0cihzLmxlbmd0aC1zaXplKTtcblx0fSxcblx0Z2V0VVJMOiBmdW5jdGlvbihvYmope1xuXHRcdHZhciBpZCA9IHBhcnNlSW50KHRoaXMub3B0aW9ucy5kYXRhLmdhbGxlcnlJdGVtc1tvYmouaWR4XS52aWRlb0lEKTtcblx0XHR2YXIgZmlyc3QgPSB0aGlzLnBhZGRpbmcocGFyc2VJbnQoaWQvMTAwMDAwMCksIDMpO1xuXHRcdHZhciBzZWNvbmQgPSB0aGlzLnBhZGRpbmcocGFyc2VJbnQoKGlkICUgMTAwMDAwMCkvMTAwMCksMyk7XG5cdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5kYXRhLmdhbGxlcnlJdGVtc1tvYmouaWR4XS52aWRlb0Jhc2VQYXRoICsgZmlyc3QgKyBcIi9cIiArIHNlY29uZCArIFwiL1wiICsgaWQgKyBcIi9zb3VyY2VcIjtcblx0fSwgXG5cdHNldFBsYXllcjogZnVuY3Rpb24ob2JqLCB2aWRVUkwpe1xuXHRcdHBsYXllcjM2MCA9IG5ldyBpbVBsYXllcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyQ29udGFpbmVyJykpO1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0dGhpcy50aGVJbnRlcnZhbCA9IG51bGw7XG5cdFx0cGxheWVyMzYwLm9uTG9hZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdC8vXHRjb25zb2xlLmxvZyhcInBsYXllckxvYWRlZCEhIVwiLCBfdGhpcy5vcHRpb25zLmRhdGEuZ2FsbGVyeUl0ZW1zW29iai5pZHhdLnZpZGVvVVJMKTtcblx0XHRcdHBsYXllcjM2MC5sb2FkU2NlbmVQbHVnaW4oJ2ltLnNraW4uc2hhZGVzLlZpZGVvQmFyJywncGx1Z2lucy9JTUd1aS5zd2YnKTtcblx0XHRcdC8vY29uc29sZS5sb2cocGxheWVyMzYwKTtcblx0XHRcdC8vY29uc29sZS5sb2coX3RoaXMub3B0aW9ucy5kYXRhLmdhbGxlcnlJdGVtc1tvYmouaWR4XS52aWRlb1VSTClcblx0XHRcdC8vIGNvbnNvbGUubG9nKHZpZFVSTCk7XG5cdFx0XHRwbGF5ZXIzNjAubG9hZFZpZGVvKHZpZFVSTCwwLHRydWUpO1xuXHRcdFx0Ly9URVNUIFVSTFNcblx0XHRcdFxuXHRcdFx0Ly8gcGxheWVyMzYwLmxvYWRWaWRlbyhfdGhpcy5vcHRpb25zLmRhdGEuZ2FsbGVyeUl0ZW1zW29iai5pZHhdLnRlc3RVUkwpO1xuXHRcdFx0X3RoaXMucGxheWluZyA9IHRydWU7XG5cdFx0XHRfdGhpcy5tdXRlZD0gZmFsc2U7XG5cdFx0XHRcblx0XHRcdHZhciBhbmdsZSA9IF90aGlzLm9wdGlvbnMuZGF0YS5nYWxsZXJ5SXRlbXNbb2JqLmlkeF0uYW5nbGVcblx0XHRcdHBsYXllcjM2MC5zZXRDYW1lcmFQcm9wZXJ0eSgnbWF4UGl0Y2gnLCA5MCk7XG5cdFx0XHRwbGF5ZXIzNjAuc2V0Q2FtZXJhUHJvcGVydHkoJ21pblBpdGNoJywgYW5nbGUpOyBcblx0XHRcdHBsYXllcjM2MC5zZXRDYW1lcmFQcm9wZXJ0eSgnbWF4Rm92JywgODApO1xuXHRcdFx0cGxheWVyMzYwLnNldENhbWVyYVByb3BlcnR5KCdtaW5Gb3YnLCA4MCk7XG5cdFx0XHQvKl90aGlzLnRoZUludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc29sZS5sb2cocGxheWVyMzYwLmdldENhbWVyYVByb3BlcnR5KFwicGl0Y2hcIikpO1xuXHRcdFx0fSwgMTAwMCk7Ki9cblx0XHRcdFxuXHRcdH1cblx0XHRwbGF5ZXIzNjAub25WaWRlb0V2ZW50ID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoIGUudHlwZT09aW1WaWRlb0V2ZW50VHlwZS5GaW5pc2hlZCApe1xuXHRcdFx0Ly9cdGNvbnNvbGUubG9nKCdbdmlkZW8gZXZlbnQ6ICcgKyBlLnR5cGUgKyAnXScpO1xuXHRcdFx0XHQvL1RSSUdHRVIgUkVQTEFZIFNDUkVFTlxuXHRcdFx0XHQkKCcuZW5kLXNjcmVlbicpLmNzcyhcImRpc3BsYXlcIixcImJsb2NrXCIpO1xuXHRcdFx0XHRfdGhpcy5jb21wbGV0ZWRUcmFja2luZ0V2ZW50KCk7XG5cdFx0XHR9IC8vZmlyZXMgYXQgdGhlIGVuZCBvZiB0aGUgdmlkZW8gXG5cdFx0XHRpZiggZS50eXBlPT1pbVZpZGVvRXZlbnRUeXBlLkZpcnN0RnJhbWUgKXtcblx0XHRcdC8vXHRjb25zb2xlLmxvZygnW3ZpZGVvIGV2ZW50OiAnICsgZS50eXBlICsgJ10nKTtcblx0XHRcdFx0X3RoaXMuJCgnLnBhdXNlJykuc2hvdygpO1xuXHRcdFx0XHRfdGhpcy4kKCcuc291bmRPbicpLnNob3coKTtcblx0XHRcdH0gLy9maXJlcyB3aGVuIHRoZSBmaXJzdCBmcmFtZSBpcyBzaG93biBcblx0XHRcdGlmKCBlLnR5cGU9PWltVmlkZW9FdmVudFR5cGUuRHVyYXRpb25DaGFuZ2VkICl7XG5cdFx0XHQvL1x0Y29uc29sZS5sb2coJ1t2aWRlbyBldmVudDogJyArIGUudHlwZSArICddJyk7XHRcblx0XHRcdH0gLy9maXJlcyBqdXN0IGFmdGVyIFBsYXlpbmcgd2hlbiB0aGUgZmlsZSBtZXRhZGF0YSBpcyByZWFkIFxuXHRcdFx0aWYoIGUudHlwZT09aW1WaWRlb0V2ZW50VHlwZS5QbGF5aW5nICl7XG5cdFx0XHQvL1x0Y29uc29sZS5sb2coJ1t2aWRlbyBldmVudDogJyArIGUudHlwZSArICddJyk7XG5cdFx0XHR9IC8vZmlyZXMgd2hlbiB2aWRlbyBmaWxlIGhlYWRlciBzdGFydHMgdG8gYmUgcmVhZCwgYmVmb3JlIGl0IGFjdHVhbGx5IHBsYXlzIFxuXHRcdFx0aWYgKGUudHlwZSA9PSBcImJ5dGVzLmxvYWRlZFwiKSB7XG5cdFx0XHRcblx0XHRcdFx0aWYoaGF2ZVRvdGFsID09IGZhbHNlKSB7XG5cdFx0XHRcdHRvdGFsQnl0ZXMgPSBwbGF5ZXIuZ2V0TWVkaWFQcm9wZXJ0eSgnYnl0ZXNUb3RhbCcpOyBoYXZlVG90YWwgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJ5dGVzTG9hZGVkID0gcGxheWVyLmdldE1lZGlhUHJvcGVydHkoJ2J5dGVzTG9hZGVkJyk7XG5cdFx0XHQvL1x0Y29uc29sZS5sb2coXCJtZWRpYSBwcm9wZXJ0eSBieXRlc0xvYWRlZDogXCIgKyBieXRlc0xvYWRlZCArIFwiIG9yIFwiICsgKGJ5dGVzTG9hZGVkKjEwMC90b3RhbEJ5dGVzKS50b0ZpeGVkKDIpICsgXCIgJVwiKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cGxheWVyMzYwLmluaXQoJy4uL2xpYi9wbGF5ZXIvJywgbnVsbCwge3dtb2RlOlwib3BhcXVlXCJ9KTtcblx0XHQvL2NvbnNvbGUubG9nKFwidXBkYXRlIGNvbnRlbnRcIiwgb2JqKTtcblx0XHQvL3RoaXMuc29jaWFscyA9IG5ldyBTaGFyZXMoe2NoYW5uZWxzOm9iai5jb250ZW50LnNvY2lhbCwgJGVsOnRoaXMuJGVsLmZpbmQoJy5zaGFyZXMnKX0pO1xuXHRcdHRoaXMuYmluZEV2ZW50cygpO1xuXHRcdFxuXG5cdFx0dGhpcy5zaG93KCk7XG5cdH0sXG5cdHNob3c6IGZ1bmN0aW9uKCl7XG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzLiRlbCk7XG5cdFx0dGhpcy4kZWwuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuXHRcdCQoJy5lbmQtc2NyZWVuJykuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcblx0XHQvLyBISURFIEJPVFRPTSBOQVZcblx0XHRUd2Vlbk1heC50byggJCgnLmJvdHRvbS1uYXYnKSwgMSwgeyB5OiA4MCwgYXV0b0FscGhhOiAwLCBlYXNlOiBQb3dlcjQuZWFzZUluIH0pO1xuXHRcdFxuXHRcdHZhciAkdyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLnBsYXllci1iYWNrZ3JvdW5kJyksIDEuNzUsIHsgeDogJHcsIGF1dG9BbHBoYTogMCB9LCB7IHg6IDAsIGF1dG9BbHBoYTogMSwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCB9KTtcblx0XHRUd2Vlbk1heC5mcm9tVG8oICQoJy5wbGF5ZXItaW5uZXInKSwgMS41LCB7IHg6ICR3IH0sIHsgeDogMCwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IC4yNSB9ICk7XG5cdFx0XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuaW5zdHJ1Y3Rpb25zJyksIDEsIHsgYXV0b0FscGhhOiAwIH0sIHsgYXV0b0FscGhhOiAxLCBkZWxheTogMiB9ICk7XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuaGVhZHBob25lcycpLCAyLCB7IGF1dG9BbHBoYTogMCwgeTogLTE1MCB9LCB7IGF1dG9BbHBoYTogMSwgeTogMCwgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IDIgfSApO1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLnN0YXR1cycpLCAxLCB7IGF1dG9BbHBoYTogMCB9LCB7IGF1dG9BbHBoYTogMSwgZGVsYXk6IDIuNSB9ICk7XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuc2tpcCcpLCAxLCB7IGF1dG9BbHBoYTogMCB9LCB7IGF1dG9BbHBoYTogMSwgZGVsYXk6IDMgfSApO1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmluc3RydWN0aW9uMScpLCAxLCB7IGF1dG9BbHBoYTogMSB9LCB7IGF1dG9BbHBoYTogMCwgZGVsYXk6IDUgfSApO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmluc3RydWN0aW9uMicpLCAxLCB7IGF1dG9BbHBoYTogMCB9LCB7IGF1dG9BbHBoYTogMSwgZGVsYXk6IDYgfSApO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmFycm93LWxlZnQnKSwgMSwgeyB4OiAxMDAsIGF1dG9BbHBoYTogMCB9LCB7IHg6IDAsIGF1dG9BbHBoYTogMSwgZGVsYXk6IDYgfSApO1xuXHRcdFR3ZWVuTWF4LmZyb21UbyggJCgnLmFycm93LXJpZ2h0JyksIDEsIHsgeDogLTEwMCwgYXV0b0FscGhhOiAwIH0sIHsgeDogMCwgYXV0b0FscGhhOiAxLCBkZWxheTogNiB9ICk7XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcucG9pbnRlcicpLCAxLCB7IHk6IDEwMCwgYXV0b0FscGhhOiAwIH0sIHsgeTogMCwgYXV0b0FscGhhOiAxLCBkZWxheTogNiB9ICk7XG5cblx0XHRUd2Vlbk1heC50byggJCgnLmluc3RydWN0aW9ucycpLCAxLCB7IGF1dG9BbHBoYTogMCwgZGVsYXk6IDksIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gU1RBUlQgUExBWUVSIEhFUkVcblx0XHRcdHBsYXllcjM2MC5wbGF5VmlkZW8oKTtcblx0XHR9fSk7XG5cdFx0XG5cdFx0dGhpcy5jb3VudGRvd25OdW1iZXIgPSA5O1xuXHRcdHRoaXMuY291bnRkb3duU3RhcnQoKTtcblx0fSxcblx0Y291bnRkb3duU3RhcnQ6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5jb3VudGRvd25OdW1iZXItLTtcblx0XHQkKCcuc3RhdHVzIHNwYW4nKS5odG1sKHRoaXMuY291bnRkb3duTnVtYmVyKTtcblx0XHRpZiAodGhpcy5jb3VudGRvd25OdW1iZXIgPT0gMCl7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5jb3VudGRvd25UaW1lcik7XG5cdFx0XHR0aGlzLmNvdW50ZG93blRpbWVyID0gMDtcblx0XHR9IGVsc2UgIHtcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdHRoaXMuY291bnRkb3duVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGF0LmNvdW50ZG93blN0YXJ0KCk7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9XG5cdH0sXG5cdHNlbmRWaWRlb1RpbWVFdmVudDogZnVuY3Rpb24oKXtcblx0XHR2YXIgZCA9IG5ldyBEYXRlKCk7XG4gICAgXHR0aGlzLmVuZFRpbWUgPSBkLmdldFRpbWUoKTtcbiAgICBcdHZhciB0aW1lU3BlbnQgPSBwYXJzZUludCgodGhpcy5lbmRUaW1lIC0gdGhpcy5zdGFydFRpbWUpLzEwMDApO1xuICAgIFx0dmFyIGNhdGVnb3J5ID0gIFwiZHVyYXRpb24td2F0Y2hlZFwiO1xuICAgIFx0dmFyIGxhYmVsID0gdGhpcy5jcmVhdG9yOyBcbiAgICBcdGdhKCdzZW5kJywgJ2V2ZW50JywgY2F0ZWdvcnksICd3YXRjaCcsIGxhYmVsLCB0aW1lU3BlbnQpO1xuICAgIFx0Ly9jb25zb2xlLmxvZyhjYXRlZ29yeSArIFwid2F0Y2ggXCIgKyBsYWJlbCArIHRpbWVTcGVudCk7XG5cdH0sXG5cdGNvbXBsZXRlZFRyYWNraW5nRXZlbnQ6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGNhdGVnb3J5ID0gXCJ2aWRlbyB3YXRjaGVkXCJcblx0XHR2YXIgbGFiZWwgPSB0aGlzLmNyZWF0b3I7IFxuICAgIFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXRlZ29yeSwgJ2NvbXBsZXRlZCcsIGxhYmVsKTtcbiAgICBcdC8vY29uc29sZS5sb2coY2F0ZWdvcnkgKyBcImNvbXBsZXRlZCBcIiArIGxhYmVsKTtcblx0fSxcblx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHR0aGlzLnNlbmRWaWRlb1RpbWVFdmVudCgpO1xuXHRcdC8vY29uc29sZS5sb2coXCJoaWRlIGVsbVwiKTtcblx0XHQkKCcucGxheSwgLnNvdW5kT24sIC5zb3VuZE9mZiwgLnBhdXNlLCAuZW5kLXNjcmVlbicpLmhpZGUoKTtcblx0XHQvL3dpbmRvdy5jbGVhckludGVydmFsKHRoaXMudGhlSW50ZXJ2YWwpO1xuXHRcdHRoaXMuZ2xvYmFsLnRyaWdnZXIoXCJoaWRlUGxheWVyXCIpO1xuXHRcdFxuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHR2YXIgJHcgPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRUd2Vlbk1heC50byggJCgnLnBsYXllci1iYWNrZ3JvdW5kJyksIDEuNjUsIHsgYXV0b0FscGhhOiAwIH0gKTtcblx0XHRUd2Vlbk1heC50byggJCgnLnBsYXllci1iYWNrZ3JvdW5kJyksIDEuNSwgeyB4OiAkdywgZWFzZTogUG93ZXI0LmVhc2VJbk91dCwgZGVsYXk6IC4xNSB9ICk7XG5cdFx0VHdlZW5NYXgudG8oICQoJy5wbGF5ZXItaW5uZXInKSwgMS41LCB7IHg6ICR3LCBlYXNlOiBQb3dlcjQuZWFzZUluT3V0LCBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoYXQuJGVsLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdH19KTtcblx0XHRcblx0XHQvLyBTSE9XIEJPVFRPTSBOQVZcblx0XHRUd2Vlbk1heC50byggJCgnLmJvdHRvbS1uYXYnKSwgMSwgeyB5OiAwLCBhdXRvQWxwaGE6IDEsIGVhc2U6IFBvd2VyNC5lYXNlT3V0LCBkZWxheTogMSB9KTtcblx0fSxcblx0Y2xvc2VJbnN0cnVjdGlvbnM6IGZ1bmN0aW9uKCl7XG5cdFx0VHdlZW5NYXguZnJvbVRvKCAkKCcuaW5zdHJ1Y3Rpb25zJyksIDEsIHsgYXV0b0FscGhhOiAxIH0seyBhdXRvQWxwaGE6IDAgfSApO1xuXHRcdHBsYXllcjM2MC5wbGF5VmlkZW8oKTtcblx0fSxcblx0c2VuZFRyYWNraW5nRXZlbnQ6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIGNhdGVnb3J5ID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1jYXRlZ29yeScpO1xuXHRcdFx0dmFyIGxhYmVsID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1sYWJlbCcpO1xuXHRcdFx0dmFyIGV2ZW50U3RyID0gY2F0ZWdvcnkgKyBcIiBcIiArIGxhYmVsO1xuXHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXRlZ29yeSwgJ2NsaWNrJywgbGFiZWwpO1xuXHRcdC8vXHRjb25zb2xlLmxvZyhldmVudFN0cik7XG5cdH1cbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlld0Jhc2UuZXh0ZW5kKHtcblxuXHRcdGlkOiBcInByZWxvYWRlclwiLFxuXHRcdHRlbXBsYXRlIDogcmVxdWlyZShcIi4vLi4vdGVtcGxhdGVzL3ByZWxvYWRlci50cGxcIiksIFxuXG5cdFx0ZXZlbnRzOiB7XG5cdFx0XHRcblx0XHR9LCBcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCl7XHRcdFx0XG5cdFx0XHR0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe2tleTpcInByZWxvYWRlclwifSkpO1xuXHRcdFx0Ly8kKFwiI2Nvbl9tYnlcIikuYXBwZW5kKHRoaXMuJGVsKTtcblx0XHRcdFxuXHRcdFx0dGhpcy5kZXZpY2UgPSB0aGlzLm9wdGlvbnMuZGV2aWNlO1xuXHRcdC8vXHRjb25zb2xlLmxvZyh0aGlzLmRldmljZSlcblx0XHRcdHRoaXMuZ2F0aGVyQXNzZXRzKClcblx0XHRcdHRoaXMucHJlbG9hZEFzc2V0cygpO1xuXHRcdFxuXHRcdH0sXG5cdFx0bGlzdE1vYmlsZUFzc2V0czogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMudG9wQXNzZXRzID0gdGhpcy5vcHRpb25zLmRhdGEuYXNzZXRzLm1vYmlsZS50b3A7XG5cdFx0XHQvL0dFTkVSQVRFIFNJR05BVFVSRSBTVFJJTkdTXG5cdFx0XHQvLyBmb3IoaT0wO2k8dGhpcy5nSXRlbXMubGVuZ3RoO2krKyl7XG5cdFx0XHQvLyBcdGlmKHRoaXMuZ0l0ZW1zW2ldLnR5cGUgPT0gMSl7XG5cdFx0XHQvLyBcdFx0dmFyIGdJdGVtID0gdGhpcy5nSXRlbXNbaV07XG5cdFx0XHQvLyBcdFx0dmFyIGZyYW1lcyA9IGdJdGVtLnNpZ09wdGlvbnMudG90YWxDb3VudFxuXHRcdFx0Ly8gXHQvL1x0Y29uc29sZS5sb2coZnJhbWVzKTtcblx0XHRcdC8vIFx0XHRmb3Ioaj0wO2o8ZnJhbWVzO2orKyl7XG5cdFx0XHQvLyBcdFx0XHR2YXIgdXJsID0gZ0l0ZW0uc2lnT3B0aW9ucy5iYXNlVVJMTW9iaWxlK2orXCIuXCIrZ0l0ZW0uc2lnT3B0aW9ucy5leHQ7XG5cdFx0XHQvLyBcdFx0XHR0aGlzLnRvcEFzc2V0cy5wdXNoKHVybCk7XG5cdFx0XHQvLyBcdFx0fVxuXHRcdFx0Ly8gXHR9XG5cdFx0XHQvLyB9XG5cdFx0XHRcdFx0XG5cdFx0fSxcblx0XHRsaXN0RGVza3RvcEFzc2V0czogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMudG9wQXNzZXRzID0gdGhpcy5vcHRpb25zLmRhdGEuYXNzZXRzLmRlc2t0b3AudG9wO1xuXHRcdFx0Ly9HRU5FUkFURSBTSUdOQVRVUkUgU1RSSU5HU1xuXHRcdFx0Zm9yKGk9MDtpPHRoaXMuZ0l0ZW1zLmxlbmd0aDtpKyspe1xuXHRcdFx0XHRpZih0aGlzLmdJdGVtc1tpXS50eXBlID09IDEpe1xuXHRcdFx0XHRcdHZhciBnSXRlbSA9IHRoaXMuZ0l0ZW1zW2ldO1xuXHRcdFx0XHRcdHZhciBmcmFtZXMgPSBnSXRlbS5zaWdPcHRpb25zLnRvdGFsQ291bnRcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGZyYW1lcyk7XG5cdFx0XHRcdFx0Zm9yKGo9MDtqPGZyYW1lcztqKyspe1xuXHRcdFx0XHRcdFx0dmFyIHVybCA9IGdJdGVtLnNpZ09wdGlvbnMuYmFzZVVSTCtqK1wiLlwiK2dJdGVtLnNpZ09wdGlvbnMuZXh0O1xuXHRcdFx0XHRcdFx0dGhpcy50b3BBc3NldHMucHVzaCh1cmwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVx0XG5cdFx0fSxcblx0XHRnYXRoZXJBc3NldHM6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmdJdGVtcyA9IHRoaXMub3B0aW9ucy5kYXRhLmdhbGxlcnlJdGVtcztcblx0XHRcdHRoaXMuc2lnVVJMUyA9IFtdO1xuXHRcdFx0aWYodGhpcy5kZXZpY2UgPT0gXCJkZXNrdG9wXCIpe1xuXHRcdFx0XHR0aGlzLmxpc3REZXNrdG9wQXNzZXRzKCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGhpcy5saXN0TW9iaWxlQXNzZXRzKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwcmVsb2FkQXNzZXRzOiBmdW5jdGlvbigpe1xuXHRcdFx0Ly9jb25zb2xlLmxvZyh0aGlzLnRvcEFzc2V0cyk7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dmFyIGFzc2V0c0xvYWRlZCA9IDA7XG5cdFx0XHR2YXIgaTtcblx0XHRcdFxuXHQgICAgICAgIHZhciBpbWcgPSBudWxsO1xuXHQgICAgICAgIFxuXHQgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMudG9wQXNzZXRzLmxlbmd0aDsgaSsrKXtcblx0ICAgICAgICAgICAgLy8gbmV3IGltYWdlIGNyZWF0ZWQsIG92ZXJ3cml0ZXMgcHJldmlvdXMgaW1hZ2Ugd2l0aGluIHRoZSBmb3IgbG9vcFxuXHQgICAgICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0ICAgICAgICAgICAgLy8gc2V0IHRoZSBzcmMgYXR0cmlidXRlIHBhdGggdG8gdGhlIGltYWdlIGZpbGUgbmFtZXMgaW4gdGhlIGZvciBsb29wXG5cdCAgICAgICAgICAgIGltZy5zcmMgPSB0aGlzLnRvcEFzc2V0c1tpXTtcblx0ICAgICAgICAgICAgJChpbWcpLm9uKCdsb2FkJywgZnVuY3Rpb24oaSl7IFxuXHQgICAgICAgICAgICBcdGFzc2V0c0xvYWRlZCsrXG5cdCAgICAgICAgICAgIFx0dmFyIHBlcmNlbnRhZ2UgPSBNYXRoLmZsb29yKGFzc2V0c0xvYWRlZC8gX3RoaXMudG9wQXNzZXRzLmxlbmd0aCAqIDEwMCk7XG5cdCAgICAgICAgICAgIFx0JChcIi5wcmVsb2FkZXItcGVyY2VudGFnZVwiKS5odG1sKHBlcmNlbnRhZ2UpO1xuXHQgICAgICAgICAgICBcdCQoXCIubG9hZGVyLXBlcmNlbnRhZ2VcIikuaHRtbChwZXJjZW50YWdlKTtcblx0ICAgICAgICAgICAgXHQvL2NvbnNvbGUubG9nKHBlcmNlbnRhZ2UpO1xuXHQgICAgICAgICAgICBcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKXtcblx0ICAgICAgICAgICAgXHRcdC8vJChcIi5wcmVsb2FkZXItcGVyY2VudGFnZVwiKS5oaWRlKCk7XG5cdCAgICAgICAgICAgIFx0XHRfdGhpcy5nbG9iYWwudHJpZ2dlcihcInByZWxvYWRlcjpwcmVsb2FkZWRcIik7XG5cdCAgICAgICAgICAgIFx0fVxuXHQgICAgICAgICAgICBcdFxuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAvLyBpZiBsYXN0IGFycmF5IGluZGV4LCBzZXQgb25sb2FkIGNvbXBsZXRlIGhhbmRsZXJcblx0ICAgICAgICAgICAgLy8gaWYoaSA9PSAodGhpcy50b3BBc3NldHMubGVuZ3RoIC0gMSkpe1xuXHQgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAvLyAgICAgdmFyIHRoZWltZyA9IGltZztcblx0ICAgICAgICAgICBcblx0ICAgICAgICAgICAgLy8gICAgICQodGhlaW1nKS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7IFxuXHQgICAgICAgICAgICAvLyAgICAgICAgICAgIC8vIF90aGlzLmdsb2JhbC50cmlnZ2VyKFwicHJlbG9hZGVyOnByZWxvYWRlZFwiKTtcblx0ICAgICAgICAgICAgLy8gICAgICAgIH0pXG5cdCAgICAgICAgICAgICAgICAgXG5cdCAgICAgICAgICAgIC8vIH1cblx0ICAgICAgICB9XG5cdCAgICAgICBcblx0XHR9XG5cblxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3QmFzZS5leHRlbmQoe1xuXG5cdFx0aWQ6IFwic29jaWFsc1wiLFxuXHR0ZW1wbGF0ZSA6IHJlcXVpcmUoXCIuLy4uL3RlbXBsYXRlcy9zb2NpYWxzLnRwbFwiKSxcbiAgICAgICAgc29jaWFsVGVtcGxhdGVzOiB7XG4gICAgICAgICAgICBmYWNlYm9vazogICc8ZGl2IGNsYXNzPVwic29jaWFsIGljb24tZmFjZWJvb2tcIj5mYjwvZGl2PicsXG4gICAgICAgICAgICBwaW50ZXJlc3Q6ICc8ZGl2IGNsYXNzPVwic29jaWFsIGljb24tcGludGVyZXN0XCI+cGluPC9kaXY+JyxcbiAgICAgICAgICAgIHR1bWJscjogICAgJzxkaXYgY2xhc3M9XCJzb2NpYWwgaWNvbi10dW1ibHJcIj50YmxyPC9kaXY+JyxcbiAgICAgICAgICAgIHR3aXR0ZXI6ICAgJzxkaXYgY2xhc3M9XCJzb2NpYWwgaWNvbi10d2l0dGVyXCI+dHc8L2Rpdj4nXG4gICAgICAgIH0sXG5cdFx0XG5cblx0XHRpbml0OiBmdW5jdGlvbigpe1x0XHRcblx0XHRcdHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7ZGF0YTpcIlwifSkpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnU0hBUkVTJywgdGhpcy4kZWxbMF0pICA7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5vcHRpb25zLnR3aXR0ZXIuc2hhcmUpXG4gICAgICAgICAgICAvL3RoaXMuYmluZEV2ZW50cygpO1xuICAgICAgICAgICAgLy92YXIgc29jaWFsID0gdGhpcy5vcHRpb25zLmNvbnRlbnQuc29jaWFsXG4gICAgICAgICAgIFxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLm9wdGlvbnMuY2hhbm5lbHMubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jb250YWluZXInKS5hcHBlbmQodGhpcy5zb2NpYWxUZW1wbGF0ZXNbdGhpcy5vcHRpb25zLmNoYW5uZWxzW2ldLnR5cGVdKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgICAgICAgICBcblx0XHR9LFxuICAgICAgICBiaW5kRXZlbnRzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuaWNvbi1mYWNlYm9vaycpLm9uKCdjbGljaycsIHRoaXMuc2hhcmVGYWNlYm9vay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLmljb24tdHdpdHRlcicpLm9uKCdjbGljaycsIHRoaXMuc2hhcmVUd2l0dGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuaWNvbi1waW50ZXJlc3QnKS5vbignY2xpY2snLCB0aGlzLnNoYXJlUGludGVyZXN0LmJpbmQodGhpcykpO1xuICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuaWNvbi10dW1ibHInKS5vbignY2xpY2snLCB0aGlzLnNoYXJlVHVtYmxyLmJpbmQodGhpcykpO1xuICAgICAgICB9LFxuICAgICAgICAvLyB0aGlzIHNob3VsZCBvbmx5IGJlIHVzZWQgZm9yIG1haW4gc2l0ZSBzaGFyZVxuICAgICAgICBzaGFyZUZhY2Vib29rOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3NoYXJlRmFjZWJvb2snLCBvcHRpb25zKTtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICAgICAgICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHZhciBzaXRlID0gZW5jb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMudXJsKTtcblxuICAgICAgICAgICAgdmFyIHNoYXJlVVJMID0gJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci5waHA/dT0nICsgc2l0ZSA7XG4gICAgICAgICAgICB0aGlzLm9wZW5XaW5kb3coc2hhcmVVUkwsICdGYWNlYm9vaycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNoYXJlRmFjZWJvb2tEeW5hbWljOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gJ3RpdGxlPScgKyBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy50aXRsZSk7XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSAnZGVzY3JpcHRpb249JyArIGVuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIHZhciBpbWcgPSAnaW1nPScgKyBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy5pbWcpO1xuICAgICAgICAgICAgdmFyIHJlZGlyVVJMID0gJ3JlZGlyZWN0VVJMPScgKyBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy5yZWRpcmVjdFVSTCk7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gW3JlZGlyVVJMLCB0aXRsZSwgZGVzY3JpcHRpb24sIGltZ107XG5cbiAgICAgICAgICAgIC8vIGdlbmVyaWMgc2hhcmUgdXJsXG4gICAgICAgICAgICB2YXIgc2hhcmVVcmwgPSBFLlNJVEVfUk9PVCArICdzaGFyZT8nICsgcGFyYW1zLmpvaW4oJyYnKTtcblxuICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2cocGFyYW1zKTtcbiAgICAgICAgICBcbiAgICAgICAgICAgIFNvY2lhbFNlcnZpY2Uuc2hhcmVGYWNlYm9vayh7XG4gICAgICAgICAgICAgICAgdXJsOiBzaGFyZVVybFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hhcmVUd2l0dGVyOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3NoYXJlVHdpdHRlcicsIG9wdGlvbnMpO1xuICAgICAgICAgICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZGVmYXVsdCcsXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICAgICAvKiBpZiggb3B0aW9ucy51cmwubGVuZ3RoICsgb3B0aW9ucy5kZXNjcmlwdGlvbi5sZW5ndGggPiAxNDApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInR3ZWV0IGNoYXJhY3RlcnMgPjE0MDogXCIsIG9wdGlvbnMudXJsLmxlbmd0aCArIG9wdGlvbnMuZGVzY3JpcHRpb24ubGVuZ3RoKTtcbiAgICAgICAgICAgIH0qL1xuICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZW5jb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMudXJsLmxlbmd0aCA+IDEpe1xuICAgICAgICAgICAgICAgIHZhciBzaXRlID0gZW5jb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMudXJsKTtcbiAgICAgICAgICAgICAgICB2YXIgc2hhcmVVUkwgPSAnaHR0cDovL3R3aXR0ZXIuY29tL3NoYXJlP3RleHQ9JyArIGRlc2NyaXB0aW9uICsgJyZ1cmw9JyArIHNpdGU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgdmFyIHNoYXJlVVJMID0gJ2h0dHA6Ly90d2l0dGVyLmNvbS9zaGFyZT90ZXh0PScgKyBkZXNjcmlwdGlvbjsgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMub3BlbldpbmRvdyhzaGFyZVVSTCwgJ1R3aXR0ZXInKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaGFyZVR1bWJscjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzaGFyZVR1bWJscicsIG9wdGlvbnMpO1xuICAgICAgICAgICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICBpbWc6IFwiXCIsXG4gICAgICAgICAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgICAgICAgICBkZXNjOiBcIlwiLFxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIC8vdmFyIHNpdGUgPSAnJnU9JyArIGVuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLnVybCk7XG4gICAgICAgICAgICAvL3ZhciB0aXRsZSA9IG9wdGlvbnMudGl0bGUgPyAnJnQ9JyArIGVuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLnRpdGxlKSA6ICcnO1xuICAgICAgICAgICAgLy92YXIgc2hhcmVVUkwgPSAnaHR0cDovL3R1bWJsci5jb20vc2hhcmU/cz0mdj0zJyArIHRpdGxlICsgc2l0ZTtcbiAgICAgICAgICAgIC8vIHZhciBzaXRlID0gIGVuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLnVybCk7XG4gICAgICAgICAgICB2YXIgc2l0ZSA9ICBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy51cmwpO1xuICAgICAgICAgICAgdmFyIHBob3RvID0gZW5jb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMuaW1nKTtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9ICBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy50aXRsZSk7XG4gICAgICAgICAgICB2YXIgZGVzYyA9ICBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy5kZXNjKTtcbiAgICAgICAgICAgIHZhciBzaGFyZVVSTF9wID0gXCIvL3d3dy50dW1ibHIuY29tL3NoYXJlL3Bob3RvP3NvdXJjZT1cIiArIHBob3RvICsgXCImY2FwdGlvbj1cIiArIGRlc2MgKyBcIiZjbGlja190aHJ1PVwiICsgc2l0ZTtcbiAgICAgICAgICAgIC8vIHZhciBzaGFyZVVSTD0gJ2h0dHA6Ly93d3cudHVtYmxyLmNvbS9zaGFyZS9saW5rP3VybD0nICsgc2l0ZSArICcmbmFtZT0nICsgdGl0bGUgKyAnJmRlc2NyaXB0aW9uPScrIGRlc2M7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5vcGVuV2luZG93KHNoYXJlVVJMX3AsICdUdW1ibHInKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaGFyZVBpbnRlcmVzdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzaGFyZVBpbnRlcmVzdCcsIG9wdGlvbnMpO1xuICAgICAgICAgICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWVkaWE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1ZpZGVvOiBmYWxzZVxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHZhciBtZWRpYSA9IG9wdGlvbnMubWVkaWEgPyAnJm1lZGlhPScgKyBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy5tZWRpYSkgOiAnJztcbiAgICAgICAgICAgIHZhciBpc1ZpZGVvID0gb3B0aW9ucy5pc1ZpZGVvID8gJyZpc1ZpZGVvPXRydWUnIDogJyc7XG4gICAgICAgICAgICB2YXIgc2l0ZSA9IGVuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLnVybCk7XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uID8gJyZkZXNjcmlwdGlvbj0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMuZGVzY3JpcHRpb24pIDogJyc7XG4gICAgICAgICAgICB2YXIgc2hhcmVVUkwgPSAnaHR0cDovL3BpbnRlcmVzdC5jb20vcGluL2NyZWF0ZS9idXR0b24vP3VybD0nICsgc2l0ZSArIGRlc2NyaXB0aW9uICsgbWVkaWEgKyBpc1ZpZGVvO1xuICAgICAgICAgICAgdGhpcy5vcGVuV2luZG93KHNoYXJlVVJMLCAnUGludGVyZXN0Jyk7XG4gICAgICAgIH0sXG5cbiAgICBcblxuICAgIG9wZW5XaW5kb3c6IGZ1bmN0aW9uKHVybCwgdGl0bGUpIHtcbiAgICAgICAgdmFyIHdpZHRoID0gNTc1LFxuICAgICAgICAgICAgaGVpZ2h0ID0gNDI1LFxuICAgICAgICAgICAgb3B0cyA9XG4gICAgICAgICAgICAgICAgJyx3aWR0aD0nICsgd2lkdGggK1xuICAgICAgICAgICAgICAgICcsaGVpZ2h0PScgKyBoZWlnaHQ7XG4gICAgICAgIHdpbmRvdy5vcGVuKHVybCwgdGl0bGUsIG9wdHMpO1xuICAgIH1cblxufSk7IiwiXG52YXIgUm91dGVyICAgICAgICAgICAgICA9ICAgcmVxdWlyZShcIi4vcm91dGVyLmpzXCIpO1xudmFyIEdsb2JhbEV2ZW50TW9kZWwgXHQ9IFx0cmVxdWlyZShcIi4vR2xvYmFsRXZlbnRNb2RlbC5qc1wiKTtcbnZhciBDaGVja3MgICAgICAgICAgICAgID0gICByZXF1aXJlKFwiLi91dGlsaXRpZXMvY2hlY2tzL2NoZWNrcy5qc1wiKTtcbnZhciBEYXRhVXRpbCAgICAgICAgICAgID0gICByZXF1aXJlKFwiLi91dGlsaXRpZXMvRGF0YS5qc1wiKTsgXG52YXIgSTE4biAgICAgICAgICAgICAgICA9ICAgcmVxdWlyZShcIi4vdXRpbGl0aWVzL0kxOG4uanNcIik7IFxudmFyIFByZWxvYWRlciAgICAgICAgICAgPSAgIHJlcXVpcmUoXCIuL1ByZWxvYWRlci5qc1wiKTtcblxudmFyIEhlYWRlciAgICAgICAgICAgICAgPSAgIHJlcXVpcmUoXCIuL0hlYWRlci5qc1wiKTsgXG52YXIgRm9vdGVyICAgICAgICAgICAgICA9ICAgcmVxdWlyZShcIi4vRm9vdGVyLmpzXCIpO1xudmFyIEludHJvICAgICAgICAgICAgICAgPSAgIHJlcXVpcmUoXCIuL0ludHJvLmpzXCIpO1xudmFyIE1vYmlsZUludHJvICAgICAgICAgPSAgIHJlcXVpcmUoXCIuL21vYmlsZS1pbnRyby5qc1wiKTtcbnZhciBHYWxsZXJ5ICAgICAgICAgICAgID0gICByZXF1aXJlKFwiLi9HYWxsZXJ5LmpzXCIpO1xudmFyIERldGFpbCAgICAgICAgICAgICAgPSAgIHJlcXVpcmUoXCIuL0RldGFpbC5qc1wiKTtcbnZhciBQbGF5ZXIgICAgICAgICAgICAgID0gICByZXF1aXJlKFwiLi9QbGF5ZXIuanNcIik7XG5cbnZhciBTb2NpYWwgICAgICAgICAgICAgID0gICByZXF1aXJlKFwiLi9Tb2NpYWwuanNcIik7XG52YXIgQXVkaW8gICAgICAgICAgICAgICA9ICAgcmVxdWlyZShcIi4vdXRpbGl0aWVzL0F1ZGlvLmpzXCIpOyBcbnZhciBNb2JpbGVHYWxsZXJ5ICAgICAgID0gICByZXF1aXJlKFwiLi9tb2JpbGUtZ2FsbGVyeS5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoeyBcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvYXBwLnRwbCcpLFxuICBcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJGVsID0gb3B0aW9ucy4kZWw7XG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSgpKSA7XG4gICAgICAgIHRoaXMuaW5pdFNlcXVlbmNlKCk7XG4gICAgfSxcbiAgICBpbml0U2VxdWVuY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBTZXF1ZW5jZShcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7IGZuOnRoaXMuc2V0dXBPYmouYmluZCh0aGlzKSB9LFxuICAgICAgICAgICAgICAgIHsgZm46dGhpcy5ydW5DaGVja3MuYmluZCh0aGlzKSwgbzpbJ3Jlc3VsdHMnXSB9LFxuICAgICAgICAgICAgICAgIHsgZm46dGhpcy5nZXREYXRhLmJpbmQodGhpcyksIG86WydkYXRhJ10gfSxcbiAgICAgICAgICAgICAgICB7IGZuOnRoaXMuY3JlYXRlU2hhcmVzLmJpbmQodGhpcyksIGk6WydkYXRhJ119LFxuICAgICAgICAgICAgICAgIHsgZm46dGhpcy5zZXR1cEVudmlyb25tZW50LmJpbmQodGhpcyksIGk6WydyZXN1bHRzJ10gfSxcbiAgICAgICAgICAgICAgICB7IGZuOnRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpIH0vLyxcbiAgICAgICAgICAgICAgLy8gIHsgZm46dGhpcy5zZXR1cFJvdXRlci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWQ6IHRoaXMuZmluaXNoZWRJbml0LmJpbmQodGhpcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH0sXG4gICAgY3JlYXRlU2hhcmVzOiBmdW5jdGlvbihkYXRhLCBjYil7XG4gICAgICAgIC8vdGhpcy5zaGFyZXMgPSBuZXcgU29jaWFsKHtjaGFubmVsczpkYXRhLnRvcC5zb2NpYWwsICRlbDp0aGlzLiRlbC5maW5kKCcuc2hhcmVzJyl9KTtcbiAgICAgICAgY2IoKTtcbiAgICB9LFxuICAgIHNldHVwT2JqOiBmdW5jdGlvbihjYil7XG4gICAgXHR0aGlzLm1vZGVsIFx0PSBuZXcgR2xvYmFsRXZlbnRNb2RlbCgpO1xuICAgIFx0Ly90aGlzLnJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcbiAgICBcdHRoaXMuY2hlY2tzID0gbmV3IENoZWNrcygpO1xuICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgICAgIHRoaXMuaTE4biA9IG5ldyBJMThuKCk7XG4gICAgICAgIHRoaXMuZGF0YVV0aWwgPSBuZXcgRGF0YVV0aWwoKTtcbiAgICAgICAgY2IoKTtcbiAgICB9LFxuICAgIGJpbmRFdmVudHM6IGZ1bmN0aW9uKGNiKXtcbiAgICAgICAgdGhpcy5tb2RlbC5vbignZ2l0ZW06c2VsZWN0OmRldGFpbCcsIHRoaXMuaGFuZGxlR2FsbGVyeVNlbGVjdERldGFpbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5tb2RlbC5vbignZ2l0ZW06c2VsZWN0OnZpZGVvJywgdGhpcy5oYW5kbGVHYWxsZXJ5U2VsZWN0VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgIFxuICAgICAgICBjYigpO1xuICAgIH0sXG4gICAgZmluaXNoZWRJbml0OiBmdW5jdGlvbihvYmope1xuICAgICAgICB0aGlzLm1vZGVsLmNoZWNrc1Jlc3VsdHMgPSBvYmoucmVzdWx0czsgIFxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAvLyBjb25zb2xlLmxvZygnZmluaXNoZWQgaW5pdCcpXG4gICAgfSxcbiAgICBydW5DaGVja3M6IGZ1bmN0aW9uKGNiKXtcbiAgICAgICAgdGhpcy5jaGVja3MucnVuKGNiKTtcbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGNiKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5kYXRhVXRpbC5nZXREYXRhKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIF90aGlzLm1vZGVsLnNldCgnYXBwZGF0YScsZGF0YSk7XG4gICAgICAgICAgICBjYihkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZXR1cEVudmlyb25tZW50OiBmdW5jdGlvbihyZXN1bHRzLCBjYil7XG4gICAgICAgIHRoaXMubW9kZWwuc2V0KFwiY2hlY2tzXCIsIHJlc3VsdHMpO1xuICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLm1vZGVsLmdldCgnYXBwZGF0YScpO1xuICAgICAgICBpZihyZXN1bHRzLmRldmljZS50eXBlID09IFwiZGVza3RvcFwiKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKFwiZGVza3RvcFwiKTtcbiAgICAgICAgICAgIHRoaXMuaW50cm8gPSBuZXcgSW50cm8oe2dsb2JhbDogdGhpcy5tb2RlbCwgZGF0YTpkYXRhLCAkZWw6dGhpcy4kZWwuZmluZCgnLmludHJvJyl9KTtcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZGVyID0gbmV3IFByZWxvYWRlcih7Z2xvYmFsOiB0aGlzLm1vZGVsLCBkZXZpY2U6IHJlc3VsdHMuZGV2aWNlLnR5cGUsIGRhdGE6ZGF0YSwgJGVsOnRoaXMuJGVsLmZpbmQoJy5wcmVsb2FkZXInKX0pO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXIgPSBuZXcgSGVhZGVyKHtkYXRhOmRhdGEsICRlbDp0aGlzLiRlbC5maW5kKCcuaGVhZGVyJyl9KTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gbmV3IEZvb3Rlcih7ZGF0YTpkYXRhLCAkZWw6dGhpcy4kZWwuZmluZCgnLmZvb3RlcicpfSk7XG4gICAgICAgICAgICB0aGlzLmRldGFpbCA9IG5ldyBEZXRhaWwoe2dsb2JhbDogdGhpcy5tb2RlbCwgZGF0YTpkYXRhLCAkZWw6dGhpcy4kZWwuZmluZCgnLmRldGFpbCcpfSk7XG4gICAgICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoe2dsb2JhbDogdGhpcy5tb2RlbCwgZGF0YTpkYXRhLCAkZWw6dGhpcy4kZWwuZmluZCgnLnBsYXllcicpfSk7XG4gICAgICAgICAgICB0aGlzLnBhZ2UgPSBuZXcgR2FsbGVyeSh7Z2xvYmFsOiB0aGlzLm1vZGVsLCBkYXRhOmRhdGEsICRlbDp0aGlzLiRlbC5maW5kKCcubWFpbicpfSk7ICAgICAgICBcblxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5pbnRybycpLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5tb2JpbGUtaW50cm8nKS5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLmludHJvID0gbmV3IE1vYmlsZUludHJvKHtnbG9iYWw6IHRoaXMubW9kZWwsIGRhdGE6ZGF0YSwgJGVsOnRoaXMuJGVsLmZpbmQoJy5tb2JpbGUtaW50cm8nKX0pO1xuICAgICAgICAgICAgdGhpcy5wcmVsb2FkZXIgPSBuZXcgUHJlbG9hZGVyKHtnbG9iYWw6IHRoaXMubW9kZWwsIGRldmljZTogcmVzdWx0cy5kZXZpY2UudHlwZSwgZGF0YTpkYXRhLCAkZWw6dGhpcy4kZWwuZmluZCgnLnByZWxvYWRlcicpfSk7XG4gICAgICAgICAgICB0aGlzLm1vYmlsZUdhbCA9IG5ldyBNb2JpbGVHYWxsZXJ5KHtnbG9iYWw6IHRoaXMubW9kZWwsIGRldmljZTogcmVzdWx0cy5kZXZpY2UsIGRhdGE6ZGF0YSwgJGVsOnRoaXMuJGVsLmZpbmQoJy5tb2JpbGUnKX0pOyAgICAgICAgICAgIFxuICAgICAgICB9ICAgICAgXG4gICAgICAgIFxuICAgICAgICBjYigpO1xuICAgIH0sXG4gICAgc2V0dXBSb3V0ZXI6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VTbHVnID0gXCJcIjtcbiAgICAgICAgZnVuY3Rpb24gcGFnZVJvdXRlKGxvYykge1xuICAgICAgICAgICAgaWYoX3RoaXMuaW5pdGlhbGl6ZWQpeyAgIFxuICAgICAgICAgICAgICAgIF90aGlzLmNoYW5nZVBhZ2UoJ2dhbGxlcnknKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlUGFnZSgnZ2FsbGVyeScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm91dGVyLm9uKCdyb3V0ZTpob21lJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYWdlUm91dGUoJ2dhbGxlcnknKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucm91dGVyLm9uKCdyb3V0ZTpnYWxsZXJ5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwYWdlUm91dGUoJ2dhbGxlcnknKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucm91dGVyLnN0YXJ0KCk7XG4gICAgICAgIFxuICAgICAgICBjYigpO1xuICAgIH0sXG4gICAgaGFuZGxlR2FsbGVyeVNlbGVjdERldGFpbDogZnVuY3Rpb24oY29udGVudCl7XG4gICAgICAgIHRoaXMuZGV0YWlsLnVwZGF0ZUNvbnRlbnQoY29udGVudC5jb250ZW50KTtcbiAgICAgICAgdGhpcy5kZXRhaWwuc2hvdygpO1xuICAgIH0sXG4gICAgaGFuZGxlR2FsbGVyeVNlbGVjdFZpZGVvOiBmdW5jdGlvbihvYmope1xuXHQgICB0aGlzLmNyZWF0ZVBsYXllcihvYmopO1xuICAgIH0sXG4gICAgY2hhbmdlUGFnZTogZnVuY3Rpb24oc2x1Zyl7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5tb2RlbC5nZXQoJ2FwcGRhdGEnKTtcblxuICAgICAgICBzd2l0Y2goc2x1Zykge1xuICAgICAgICAgICAgY2FzZSBcImhvbWVcIiA6XG4gICAgICAgICAgICBjYXNlIFwiZ2FsbGVyeVwiOiAgXG4gICAgICAgICAgICAgICAgIHRoaXMubmV3cGFnZSA9IG5ldyBHYWxsZXJ5KHtnbG9iYWw6IHRoaXMubW9kZWwsIGRhdGE6ZGF0YSwgJGVsOnRoaXMuJGVsLmZpbmQoJy5tYWluJyl9KTsgXG4gICAgICAgICAgICAgICAgIHRoaXMucGFnZS5leGl0KCk7XG4gICAgICAgICAgICAgICAgIHRoaXMucGFnZSA9IHRoaXMubmV3cGFnZTtcbiAgICAgICAgICAgICAgICAgdGhpcy5uZXdwYWdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgdGhpcy5wYWdlLmVudGVyKCk7XG4gICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VTbHVnID0gXCJnYWxsZXJ5XCI7XG4gICAgICAgICAgICAgICAgIHRoaXMubW9kZWwub24oJ2dpdGVtOnNlbGVjdDpkZXRhaWwnLCB0aGlzLmhhbmRsZUdhbGxlcnlTZWxlY3REZXRhaWwuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgIHRoaXMubW9kZWwub24oJ2dpdGVtOnNlbGVjdDp2aWRlbycsIHRoaXMuaGFuZGxlR2FsbGVyeVNlbGVjdFZpZGVvLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBcbiAgICB9LFxuICAgIGNyZWF0ZVBhZ2U6IGZ1bmN0aW9uKHNsdWcpe1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMubW9kZWwuZ2V0KCdhcHBkYXRhJyk7XG4gICAgICAgIHN3aXRjaChzbHVnKSB7XG4gICAgICAgICAgICBjYXNlIFwiaG9tZVwiIDpcbiAgICAgICAgICAgIGNhc2UgXCJnYWxsZXJ5XCI6XG4gICAgICAgICAgICAgICAgIHRoaXMucGFnZSA9IG5ldyBHYWxsZXJ5KHtnbG9iYWw6IHRoaXMubW9kZWwsIGRhdGE6ZGF0YSwgJGVsOnRoaXMuJGVsLmZpbmQoJy5tYWluJyl9KTtcbiAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZVNsdWcgPSBcImdhbGxlcnlcIjtcbiAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5vbignZ2l0ZW06c2VsZWN0OmRldGFpbCcsIHRoaXMuaGFuZGxlR2FsbGVyeVNlbGVjdERldGFpbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5vbignZ2l0ZW06c2VsZWN0OnZpZGVvJywgdGhpcy5oYW5kbGVHYWxsZXJ5U2VsZWN0VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IFxuICAgIH0sXG4gICAgY3JlYXRlUGxheWVyOmZ1bmN0aW9uKG9iail7XG4gICAgICAgIC8vY29uc29sZS5sb2coY29udGVudClcbiAgICAgICAgIHRoaXMucGxheWVyLnVwZGF0ZUNvbnRlbnQob2JqKTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy90aGlzLnByZWxvYWRlci5kb3N0b21lYWtzamRuO1xuICAgIH1cbn0pO1xuXG4iLCJ2YXIgSW1nU2VxXHRcdFx0XHQ9XHRyZXF1aXJlKFwiLi91dGlsaXRpZXMvaW1nX3NlcXVlbmNlLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3QmFzZS5leHRlbmQoe1xuXG5cdFx0XG5cdFx0dGVtcGxhdGUgOiByZXF1aXJlKFwiLi8uLi90ZW1wbGF0ZXMvbW9iaWxlLWdhbGxlcnkudHBsXCIpLCBcblxuXHRcdGV2ZW50czoge1xuXHRcdFx0J2NsaWNrIC5tb2JpbGUtZ2FsbGVyeScgOiAnbmV4dFNsaWRlJyxcblx0XHRcdCdjbGljayAuc2hvZSc6ICd0b1doaWNoU3RvcmUnLFxuXHRcdFx0J2NsaWNrIC5hbmRyb2lkLWFwcCc6ICd0b1BsYXlTdG9yZScsXG5cdFx0XHQnY2xpY2sgLmlvcy1hcHAnOiAndG9BcHBTdG9yZScsXG5cdFx0XHQnY2xpY2sgLnRyayc6ICdzZW5kVHJhY2tpbmdFdmVudCdcblx0XHR9LCBcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCl7XG5cblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe2tleTpcIm1vYmlsZS1nYWxsZXJ5XCJ9KSk7XG5cdFx0XHRcblx0XHRcdHRoaXMuc2xpZGVJZHggPSAwO1xuXHRcdFx0dGhpcy5pbWdTZXEgPSBbXTtcblx0XHRcdHZhciB3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cblx0XHRcdFR3ZWVuTWF4LnRvKCB0aGlzLiQoJy5tb2JpbGUtZ2FsbGVyeScpLnBhcmVudCgpLCAwLCB7IHg6IHd9KTtcdFxuXHRcdFx0Ly9PRkZTRVQgU0hPRVMgQU5EIFNJR1Ncblx0XHRcdHRoaXMuc2hvZXMgPSAkKFwiLnNob2VcIik7XG5cdFx0XHR0aGlzLnNpZ3MgPSAkKFwiLnNpZ1wiKTtcblx0XHRcdHRoaXMubWFkZUJ5ID0gJChcIi5tYWRlLWJ5XCIpO1xuXHRcdFx0dGhpcy51bmRlcmxpbmVzID0gJChcIi51bmRlckxpbmVcIik7XG5cdFx0XHQvL2hpZGUgc2hvZXMvdW5kZXJsaW5lc1xuXHRcdFx0Ly8gZm9yKGk9MDsgaTwgdGhpcy5zaG9lcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHQvLyBcdGlmKGklMj09MCl7XG5cdFx0XHQvLyBcdFx0dmFyIHMgPSAtMTtcblx0XHRcdC8vIFx0XHRUd2Vlbk1heC50byh0aGlzLnVuZGVybGluZXNbaV0sIDAsIHtzY2FsZVg6IDAuMDAxLCBvcGFjaXR5OjB9KTtcblx0XHRcdC8vIFx0XHQvL1R3ZWVuTWF4LnRvKHRoaXMuc2lnc1tpXSwgMCwge29wYWNpdHk6MSwgeDogMjV9KTtcblx0XHRcdC8vIFx0fWVsc2V7XG5cdFx0XHQvLyBcdFx0dmFyIHMgPSAxO1xuXHRcdFx0Ly8gXHRcdFR3ZWVuTWF4LnRvKHRoaXMudW5kZXJsaW5lc1tpXSwgMCwge3NjYWxlWDogMC4wMDEsIG9wYWNpdHk6MH0pO1xuXHRcdFx0Ly8gXHRcdC8vVHdlZW5NYXgudG8odGhpcy5zaWdzW2ldLCAwLCB7b3BhY2l0eToxLCB4OiAxNTB9KTtcblx0XHRcdC8vIFx0fVxuXHRcdFx0Ly8gXHRUd2Vlbk1heC50byh0aGlzLnNob2VzW2ldLCAwLHtvcGFjaXR5OjAsIHg6IDIwMCotc30pO1xuXHRcdFx0Ly8gXHQvL1R3ZWVuTWF4LnRvKHRoaXMubWFkZUJ5W2ldLCAwLHtvcGFjaXR5OjAsIHg6IDEwMCotc30pO1xuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0Ly8gXHR0aGlzLmxvYWRTaWcoaSsxKTtcdFxuXHRcdFx0Ly8gfVxuXHRcdFx0dmFyIGpkID0gJCgnLmpvYW5uYS1zaG9lJylbMF07XG5cdFx0XHR2YXIga3QgPSAkKCcua2luZy1zaG9lJylbMF07XG5cdFx0XHR2YXIgcmUgPSAkKCcucm9uLXNob2UnKVswXTtcblx0XHRcdC8vVHdlZW5NYXguc2V0KCAkKGpkKSwgeyBzY2FsZVg6IDEuMDUsIHNjYWxlWTogMS4wNX0pO1xuXHRcdFx0VHdlZW5NYXguc2V0KCAkKGt0KSwgeyBzY2FsZVg6IDAuOTUsIHNjYWxlWTogMC45NX0pO1xuXHRcdFx0Ly9Ud2Vlbk1heC5zZXQoICQocmUpLCB7IHNjYWxlWDogMC45Miwgc2NhbGVZOiAwLjkyfSk7XG5cdFx0XHR0aGlzLnNob2VzLmFkZENsYXNzKFwiZWFzZVwiKTtcblx0XHRcdHRoaXMuc2lncy5hZGRDbGFzcyhcImVhc2VcIik7XG5cdFx0XHR0aGlzLm1hZGVCeS5hZGRDbGFzcyhcImVhc2VcIik7XG5cdFx0XHR0aGlzLnVuZGVybGluZXMuYWRkQ2xhc3MoXCJlYXNlU2xvd1wiKTtcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xuXHRcdFx0XHR2YXIgc2xpZGUgPSAkKCcuc2xpZGVyLWNvbnRhaW5lcicpW2ldO1xuXHRcdFx0XHRUd2Vlbk1heC50byggc2xpZGUsIDAsIHsgeDogdyB9KTtcblx0XHRcdH07XG5cdFx0XHQvL2hpZGUgaW5mb1xuXHRcdFx0Ly8gdmFyIHRsID0gbmV3IFRpbWVsaW5lTWF4KHt9KTtcblx0XHRcdC8vIHZhciBpdGVtcyA9ICQoXCIuaW5mbyA+IGxpXCIpXG5cdFx0XHQvLyB0bC50byhpdGVtcywgMCwge3g6MzAsIG9wYWNpdHk6IDB9KTtcblxuXHRcdFx0VHdlZW5NYXgudG8oICQoJy5jdXJyZW50VGV4dCA+IGxpJyksIDAsIHsgeDogNjAsIG9wYWNpdHk6IDAgfSk7XG5cdFx0XHR2YXIgZTEgPSAkKFwiLmN1cnJlbnRUZXh0ID4gbGlcIilbMF07XG5cdFx0XHR2YXIgZTIgPSAkKFwiLmN1cnJlbnRUZXh0ID4gbGlcIilbMV07XG5cdFx0XHRcblx0XHRcdC8vJChcIi5jdXJyZW50VGV4dFwiKS5yZW1vdmVDbGFzcyhcImVhc2VcIik7XG5cdFx0XHRUd2Vlbk1heC50byhbZTEsIGUyXSwgMCwge3g6ODAsIG9wYWNpdHk6IDB9KTtcblx0XHRcdCQoXCIuY3VycmVudFRleHQgaDFcIikuYWRkQ2xhc3MoXCJlYXNlXCIpO1xuXHRcdFx0dmFyIGNiID0gdGhpcy4kKFwiLmNhcmRib2FyZC1nb2dnbGVzXCIpO1xuXHRcdFx0dmFyIGgxID0gdGhpcy4kKFwiaDFcIik7XG5cdFx0XHRUd2Vlbk1heC50byhjYiwgMCwge3g6NzB9KTtcblx0XHRcdFR3ZWVuTWF4LnRvKGgxLCAwLCB7eDo1MCwgb3BhY2l0eTogMH0pO1xuXHRcdFx0Y2IuYWRkQ2xhc3MoXCJlYXNlXCIpO1xuXHRcdFx0aDEuYWRkQ2xhc3MoXCJlYXNlTWVkXCIpO1x0XG5cdFx0XHQvL3RoaXMubG9hZFRleHQoKTtcblx0XHRcdHRoaXMuaW5mb1RyaWdnZXJlZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy5qb2FubmFUcmlnZ2VyZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMua2luZ1RyaWdnZXJlZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy50aG9tYXNUcmlnZ2VyZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMucm9uVHJpZ2dlcmVkID0gZmFsc2U7XG5cdFx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0XHRcdHRoaXMuJGVsLmFkZENsYXNzKFwiY29sbGFwc2VcIik7XG5cdFx0XHRcblx0XHR9LFxuXHRcdHNlbmRUcmFja2luZ0V2ZW50OiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBjYXRlZ29yeSA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0ZWdvcnknKTtcblx0XHRcdHZhciBsYWJlbCA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFiZWwnKTtcblx0XHRcdFxuXHRcdFx0dmFyIGV2ZW50U3RyID0gY2F0ZWdvcnkgKyBcIiBcIiArIGxhYmVsO1xuXHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBjYXRlZ29yeSwgJ2NsaWNrJywgbGFiZWwpO1xuXHRcdH0sXG5cdFx0YmluZEV2ZW50czogZnVuY3Rpb24oKXtcblx0XHRcdC8vdGhpcy5zY3JvbGxUcmlnZ2VyID0gXy5kZWJvdW5jZSh0aGlzLnNjcm9sbFRyaWdnZXJGdW4sIDEwMClcblx0XHRcdCQoXCIjY29uX21ieVwiKS5vbihcInNjcm9sbFwiLCB0aGlzLnNjcm9sbFRyaWdnZXJGdW4uYmluZCh0aGlzKSk7XG5cdFx0XHR0aGlzLmdsb2JhbC5vbihcImludHJvOmxlYXZpbmdcIix0aGlzLm9uSW50cm9MZWZ0LmJpbmQodGhpcykpXG5cblx0XHR9LFxuXHRcdHRvQXBwU3RvcmU6IGZ1bmN0aW9uKCl7XG5cdFx0XHR3aW5kb3cub3BlbihcImh0dHBzOi8vaXR1bmVzLmFwcGxlLmNvbS91cy9hcHAvaW4tdGhlaXItY2h1Y2tzLTM2MC1leHBlcmllbmNlL2lkOTY4ODQ2OTE3P210PThcIik7XG5cdFx0fSxcblx0XHR0b1BsYXlTdG9yZTogZnVuY3Rpb24oKXtcblx0XHRcdHdpbmRvdy5vcGVuKFwiaHR0cHM6Ly9wbGF5Lmdvb2dsZS5jb20vc3RvcmUvYXBwcy9kZXRhaWxzP2lkPWNvbS5jb252ZXJzZS5pbnRoZWlyY2h1Y2tzXCIpO1xuXHRcdH0sXG5cdFx0dG9XaGljaFN0b3JlOiBmdW5jdGlvbigpe1xuXHRcdFx0aWYodGhpcy5vcHRpb25zLmRldmljZS5vcyA9PSAnaU9TJyl7XG5cdFx0XHRcdHRoaXMudG9BcHBTdG9yZSgpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRoaXMudG9QbGF5U3RvcmUoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG9uSW50cm9MZWZ0OiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy4kZWwucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZVwiKTtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHQvL1NsaWRlIGluXG5cdFx0XHRUd2Vlbk1heC50byggdGhpcy4kKCcubW9iaWxlLWdhbGxlcnknKS5wYXJlbnQoKSwgMCwgeyB4OiAwfSk7XG5cdFx0XHR2YXIgZTEgPSAkKFwiLmN1cnJlbnRUZXh0ID4gbGlcIilbMF07XG5cdFx0XHR2YXIgZTIgPSAkKFwiLmN1cnJlbnRUZXh0ID4gbGlcIilbMV07XG5cdFx0XHR2YXIgY2IgPSB0aGlzLiQoXCIuY2FyZGJvYXJkLWdvZ2dsZXNcIik7XG5cdFx0XHRUd2Vlbk1heC50byhlMSwgMCwge3g6MCwgb3BhY2l0eTogMSwgZGVsYXk6IDAuM30pO1xuXHRcdFx0VHdlZW5NYXgudG8oZTIsIDAsIHt4OjAsIG9wYWNpdHk6IDEsIGRlbGF5OiAwLjR9KTtcblxuXHRcdFx0VHdlZW5NYXgudG8oY2IsIDAsIHt4OjB9KTtcblx0XHRcdHZhciBoMSA9IHRoaXMuJChcImgxXCIpO1xuXHRcdFx0VHdlZW5NYXgudG8oaDEsIDAsIHt4OjAsIG9wYWNpdHk6IDF9KTtcdFx0XG5cdFx0XHQvL1N0YXJ0IEdhbGxlcnlcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdF90aGlzLm5leHRTbGlkZSgpO1xuXHRcdFx0fSwgMzUwMCk7XG5cblx0XHR9LFxuXHRcdHNjcm9sbFRyaWdnZXJGdW46IGZ1bmN0aW9uKGUpe1xuXHRcdFx0Ly9jb25zb2xlLmxvZygkKHdpbmRvdykuc2Nyb2xsVG9wKCkpO1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdFxuXHRcdFx0XHR2YXIgc3QgPSAkKFwiI2Nvbl9tYnlcIikuc2Nyb2xsVG9wKCk7XG5cblx0XHRcdFx0aWYoc3QgPiAzMCAmJiBfdGhpcy5pbmZvVHJpZ2dlcmVkID09IGZhbHNlKXtcblx0XHRcdFx0XHRfdGhpcy5pbmZvVHJpZ2dlcmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRfdGhpcy5sb2FkVGV4dCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHN0ID4gMzQ1ICYmIF90aGlzLmpvYW5uYVRyaWdnZXJlZCA9PSBmYWxzZSl7XG5cdFx0XHRcdFx0X3RoaXMuam9hbm5hVHJpZ2dlcmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRfdGhpcy5zbGlkZUluU2hvZSgwKTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRfdGhpcy5wbGF5U2lnKDEpO1xuXHRcdFx0XHRcdH0sIDQwMCkgO1xuXHRcdFx0XHRcdFxuXHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoc3QgPiA2MzAgJiYgX3RoaXMua2luZ1RyaWdnZXJlZCA9PSBmYWxzZSl7XG5cdFx0XHRcdFx0X3RoaXMua2luZ1RyaWdnZXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0X3RoaXMuc2xpZGVJblNob2UoMSk7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0X3RoaXMucGxheVNpZygyKTtcblx0XHRcdFx0XHR9LCA0MDApIDtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHN0ID4gOTgwICYmIF90aGlzLnRob21hc1RyaWdnZXJlZCA9PSBmYWxzZSl7XG5cdFx0XHRcdFx0X3RoaXMudGhvbWFzVHJpZ2dlcmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRfdGhpcy5zbGlkZUluU2hvZSgyKTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRfdGhpcy5wbGF5U2lnKDMpO1xuXHRcdFx0XHRcdH0sIDQwMCkgO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoc3QgPiAxMzIwICYmIF90aGlzLnJvblRyaWdnZXJlZCA9PSBmYWxzZSl7XG5cdFx0XHRcdFx0X3RoaXMucm9uVHJpZ2dlcmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRfdGhpcy5zbGlkZUluU2hvZSgzKTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRfdGhpcy5wbGF5U2lnKDQpO1xuXHRcdFx0XHRcdH0sIDQwMCkgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdH0sXG5cdFx0c2xpZGVJblNob2U6IGZ1bmN0aW9uKGlkeCl7XG5cdFx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRcdGlmKGlkeCUyPT0wKXtcblx0XHRcdFx0XHR2YXIgcyA9IC0xO1xuXHRcdFx0XHRcdC8vVHdlZW5NYXgudG8odGhpcy5zaWdzW2lkeF0sIDAsIHtvcGFjaXR5OiAxfSk7XG5cdFx0XHRcdFx0VHdlZW5NYXgudG8odGhpcy5tYWRlQnlbaWR4XSwgMCwge29wYWNpdHk6IDEsIHg6IDB9KTtcblx0XHRcdFx0XHRUd2Vlbk1heC50byh0aGlzLnVuZGVybGluZXNbaWR4XSwgMCwge2RlbGF5OiAwLjcsIHNjYWxlWDogMSwgb3BhY2l0eTogMX0pOy8vLCB4OiAyNX0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR2YXIgcyA9IDE7XG5cdFx0XHRcdFx0VHdlZW5NYXgudG8odGhpcy5tYWRlQnlbaWR4XSwgMCwge29wYWNpdHk6IDEsIHg6IDB9KTtcblx0XHRcdFx0XHQvL1R3ZWVuTWF4LnRvKHRoaXMuc2lnc1tpZHhdLCAwLCB7b3BhY2l0eTogMSwgeDogMTUwfSk7XG5cdFx0XHRcdFx0VHdlZW5NYXgudG8odGhpcy51bmRlcmxpbmVzW2lkeF0sIDAsIHtkZWxheTogMC43LCBzY2FsZVg6IDEsIG9wYWNpdHk6IDF9KTsvLywgeDogMTUwfSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0VHdlZW5NYXgudG8odGhpcy5zaG9lc1tpZHhdLCAwLHtvcGFjaXR5OiAxLCB4OiAwfSk7XHRcdFxuXHRcdFx0XG5cdFx0fSxcblx0XHRsb2FkVGV4dDpmdW5jdGlvbigpe1xuXHRcdFx0XG5cdFx0XHR2YXIgaXRlbXMgPSAkKFwiLmluZm8gPiBsaVwiKVxuXHRcdFx0XG5cdFx0XHR2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoe30pO1xuXHRcdFx0XG5cdFx0XHQkKFwiLmluZm9cIikuYWRkQ2xhc3MoXCJzbGlkZUVhc2VcIik7XG5cdFx0XHRmb3IoaT0wO2k8aXRlbXMubGVuZ3RoO2krKyl7XG5cdFx0XHR2YXIgaWR4ID0gaTtcdFxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbihpZHgpe1xuXHRcdFx0XHR0bC50byhpdGVtc1tpZHhdLCAwLCB7eDowLCBvcGFjaXR5OiAxfSk7XG5cdFx0XHR9LCAyNTAqaSwgaWR4KSA7XHRcblx0XHRcdH1cblx0XHR9LFxuXHRcdGxvYWRTaWc6IGZ1bmN0aW9uKGlkeCl7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHRoaXMub3B0aW9ucy5kYXRhLmdhbGxlcnlJdGVtc1tpZHhdKTtcblx0XHRcdHZhciBjbnYgPSB0aGlzLiRlbC5maW5kKCcuc2lnJylbaWR4LTFdO1xuXHRcdFx0dmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuZGF0YS5nYWxsZXJ5SXRlbXNbaWR4XS5zaWdPcHRpb25zO1x0XG5cdFx0XHRjbnYud2lkdGggPSBvcHRpb25zLmltZy52Mnc7XG5cdFx0XHRjbnYuaGVpZ2h0ID0gb3B0aW9ucy5pbWcudjJoO1xuXHRcdFx0b3B0aW9ucy5iYXNlVVJMID0gIG9wdGlvbnMuYmFzZVVSTE1vYmlsZTtcblx0XHRcdG9wdGlvbnMuaW1nLncgPSAgb3B0aW9ucy5pbWcudjJ3O1xuXHRcdFx0b3B0aW9ucy5pbWcuaCA9ICBvcHRpb25zLmltZy52Mmg7XHRcblx0XHRcdG9wdGlvbnMuY2FudmFzID0gY252O1xuXHRcdFx0dGhpcy5pbWdTZXFbaWR4XSA9IG5ldyBJbWdTZXEob3B0aW9ucyk7XHRcblx0XHR9LFxuXHRcdHBsYXlTaWc6IGZ1bmN0aW9uKGlkeCl7XG5cdFx0XHR0aGlzLmltZ1NlcVtpZHhdLmJlZ2luKCk7XG5cdFx0fSxcblx0XHRuZXh0U2xpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgdyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdFx0dmFyIHRsID0gbmV3IFRpbWVsaW5lTWF4KHt9KTtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdGlmKHRoaXMuc2xpZGVJZHggPT0gNClcblx0XHRcdFx0dGhpcy5zbGlkZUlkeCA9IDA7XG5cdFx0XHR2YXIgZW5kID0gdyAqICg0IC0gdGhpcy5zbGlkZUlkeCk7XG5cdFx0XHR2YXIgdGhpcmQgPSB3ICogKDMgLSB0aGlzLnNsaWRlSWR4KTtcblx0XHRcdHZhciBvZmZzZXQgPSB3ICogdGhpcy5zbGlkZUlkeDtcblx0XHRcdCQoIFwiLnNsaWRlci1jb250YWluZXJcIiApLnJlbW92ZUNsYXNzKFwibmV4dFwiKTtcblx0XHRcdCQoIFwiLnNsaWRlci1jb250YWluZXJcIiApLnJlbW92ZUNsYXNzKFwiY3VycmVudFwiKTtcblx0XHRcdCQoIFwiLnNsaWRlci1jb250YWluZXJcIiApLnJlbW92ZUNsYXNzKFwib3V0XCIpO1xuXHRcdFx0JCggXCIuY2FwdGlvblwiICkucmVtb3ZlQ2xhc3MoXCJuZXh0VGV4dFwiKTtcblx0XHRcdCQoIFwiLmNhcHRpb25cIiApLnJlbW92ZUNsYXNzKFwiY3VycmVudFRleHRcIik7XG5cdFx0XHQkKCBcIi5jYXB0aW9uXCIgKS5yZW1vdmVDbGFzcyhcIm91dFRleHRcIik7XG5cdFx0XHQkKCBcIi5zbGlkZXItY29udGFpbmVyXCIgKS5hZGRDbGFzcyhmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHQgIHZhciBhZGRlZENsYXNzO1xuXHRcdFx0IFxuXHRcdFx0ICBpZiAoIGluZGV4ID09PSBfdGhpcy5zbGlkZUlkeCApIHtcblx0XHRcdCAgICBhZGRlZENsYXNzID0gXCJjdXJyZW50XCI7XG5cdFx0XHQgICBcblx0XHRcdCAgfVxuXHRcdFx0ICBlbHNlIGlmICggaW5kZXggPT09IF90aGlzLnNsaWRlSWR4ICsgMSkge1xuXHRcdFx0ICAgIGFkZGVkQ2xhc3MgPSBcIm5leHRcIjtcblx0XHRcdCAgIFxuXHRcdFx0ICB9ZWxzZSBpZihfdGhpcy5zbGlkZUlkeCA9PSAzICYmIGluZGV4ID09IDApe1xuXHRcdFx0ICBcdGFkZGVkQ2xhc3MgPSBcIm5leHRcIlxuXHRcdFx0ICB9XG5cblx0XHRcdCAgZWxzZXtcblx0XHRcdCAgXHRcdGFkZGVkQ2xhc3M9XCJvdXRcIlxuXHRcdFx0ICB9XG5cdFx0XHQgXG5cdFx0XHQgIHJldHVybiBhZGRlZENsYXNzO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCBcIi5jYXB0aW9uXCIgKS5hZGRDbGFzcyhmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHQgIHZhciBhZGRlZENsYXNzO1xuXHRcdFx0ICBpZiAoIGluZGV4ID09PSBfdGhpcy5zbGlkZUlkeCApIHtcblx0XHRcdCAgICBhZGRlZENsYXNzID0gXCJjdXJyZW50VGV4dFwiOyBcblx0XHRcdCAgfVxuXHRcdFx0ICBlbHNlIGlmICggaW5kZXggPT09IF90aGlzLnNsaWRlSWR4ICsgMSkge1xuXHRcdFx0ICAgIGFkZGVkQ2xhc3MgPSBcIm5leHRUZXh0XCI7XG5cdFx0XHQgIH1lbHNlIGlmKF90aGlzLnNsaWRlSWR4ID09IDMgJiYgaW5kZXggPT0gMCl7XG5cdFx0XHQgIFx0YWRkZWRDbGFzcyA9IFwibmV4dFRleHRcIlxuXHRcdFx0ICB9XG5cdFx0XHQgIGVsc2V7XG5cdFx0XHQgIFx0XHRhZGRlZENsYXNzPVwib3V0VGV4dFwiXG5cdFx0XHQgIH1cblx0XHRcdCBcblx0XHRcdCAgcmV0dXJuIGFkZGVkQ2xhc3M7XG5cdFx0XHR9KTtcblx0XHRcdC8vJCgnLnNsaWRlci1jb250YWluZXInKS5nZXQodGhpcy5zbGlkZUlkeCkuYWRkQ2xhc3MoXCJjdXJyZW50XCIpO1xuXHRcdFx0Ly8kKCcuc2xpZGVyLWNvbnRhaW5lcicpW3RoaXMuc2xpZGVJZHgrMV0uYWRkQ2xhc3MoXCJuZXh0XCIpO1xuXHRcdFx0XG5cdFx0XHRcblx0XHRcdFR3ZWVuTWF4LnRvKCAkKCcubmV4dCcpLCAwLCB7IHg6IDAgfSk7XHRcdFxuXHRcdFx0XHRcblx0XHRcdFR3ZWVuTWF4LnRvKCAkKCcuY3VycmVudCcpLCAwLCB7IHg6IC13IH0pO1xuXHRcdFx0XG5cdFx0XHRUd2Vlbk1heC50byggJCgnLm91dCcpLCAwLjAxLCB7IHg6IHcgfSk7XG5cdFx0XHR2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoe30pO1xuXHRcdFx0dmFyIGUxID0gJChcIi5uZXh0VGV4dCA+IGxpXCIpWzBdO1xuXHRcdFx0dmFyIGUyID0gJChcIi5uZXh0VGV4dCA+IGxpXCIpWzFdO1xuXG5cdFx0XHQkKFwiLm5leHRUZXh0XCIpLnJlbW92ZUNsYXNzKFwiZWFzZVwiKTtcblx0XHRcdHRsLnRvKFtlMSwgZTJdLCAwLCB7eDo3MCwgb3BhY2l0eTogMH0pO1xuXG5cdFx0XHQgdGwudG8oZTEsIDAsIHt4OjAsIG9wYWNpdHk6IDEsIGRlbGF5OiAwLjN9KTtcblx0XHRcdCB0bC50byhlMiwgMCwge3g6MCwgb3BhY2l0eTogMSwgZGVsYXk6IDAuNH0pO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQoXCIubmV4dFRleHRcIikuYWRkQ2xhc3MoXCJlYXNlXCIpO1xuXHRcdFx0fSwgMjApIFxuXHRcdFx0Ly9Ud2Vlbk1heC50byggJCgnLm5leHRUZXh0JyksIDAsIHsgeDogIDAgfSk7XHRcdFxuXHRcdFx0XHRcblx0XHRcdC8vVHdlZW5NYXgudG8oICQoJy5jdXJyZW50VGV4dCA+IGxpJyksIDAsIHsgeDogMTAwLCBvcGFjaXR5OiAwIH0pO1xuXHRcdFx0XG5cdFx0XHQvL2FuaW1hdGUgc2xpZGVzIGFuZCBwb3Agb2ZmIHRvcCBvZiBzbGlkZXIgZnJvbSBodG1sIHN0YWNrIGFuZCBhZGQgdG8gZW5kKD8pXG5cdFx0XHR0aGlzLnNsaWRlSWR4Kys7XG5cdFx0XHRcblx0XHR9LFxuXHRcdFxuXHRcdFxuXHRcdFxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3QmFzZS5leHRlbmQoe1xuXG5cdHRlbXBsYXRlIDogcmVxdWlyZShcIi4vLi4vdGVtcGxhdGVzL21vYmlsZS1pbnRyby50cGxcIiksIFxuXHRldmVudHM6IHtcblx0XHRcblx0fSwgXG5cblx0aW5pdDogZnVuY3Rpb24oKXtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1x0XHRcdFxuXHRcdHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7a2V5OlwiaW50cm9cIn0pKTtcblx0XHR0aGlzLiRlbC5jc3MoXCJ3aWR0aFwiLCAkKHdpbmRvdykud2lkdGgoKSlcblx0XHR0aGlzLiRlbC5jc3MoXCJoZWlnaHRcIiwgJCh3aW5kb3cpLmhlaWdodCgpKVxuXHRcdHRoaXMuJGVsLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcblx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0XHR0aGlzLnZpZXdlZEludHJvID0gZmFsc2U7XG5cdFx0dGhpcy5zaG93UHJlbG9hZGVyKCk7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0X3RoaXMudmlld2VkSW50cm8gPSB0cnVlO1xuXHRcdH0sIDIwMDApOyAvL3Nob3cgaW50cm8gYXRsZWFzdCAyIHNlY29uZFxuXHR9LFxuXHRiaW5kRXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIHRoaXMucmVzaXplLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmdsb2JhbC5vbihcInByZWxvYWRlcjpwcmVsb2FkZWRcIix0aGlzLm9uUHJlbG9hZGVkLmJpbmQodGhpcykpXG5cdH0sXG5cdG9uUHJlbG9hZGVkOiBmdW5jdGlvbigpe1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0aWYodGhpcy52aWV3ZWRJbnRybyA9PSB0cnVlKXtcblx0XHRcdHRoaXMuaGlkZVByZWxvYWRlcigpO1xuXHRcdFx0dGhpcy5oaWRlSW50cm8oKTtcblx0XHRcdHZhciB3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0XHR0aGlzLmdsb2JhbC50cmlnZ2VyKFwiaW50cm86bGVhdmluZ1wiKTtcblx0XHRcdFR3ZWVuTWF4LnRvKCB0aGlzLiQoJy5sb2FkZXItcGFuZWwnKS5wYXJlbnQoKSwgMCwgeyB4OiAtd30pO1x0XHRcblx0XHR9ZWxzZXtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0X3RoaXMub25QcmVsb2FkZWQoKTtcblx0XHRcdH0sIDIwMClcblx0XHR9XG5cdFx0XG5cdH0sXG5cdHNob3dQcmVsb2FkZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XG5cdH0sXG5cdGhpZGVQcmVsb2FkZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XG5cdH0sXG5cdHNob3dJbnRybzogZnVuY3Rpb24oKXtcblx0XHRcblx0fSxcblx0XG5cdGhpZGVJbnRybzogZnVuY3Rpb24oKXtcblx0XHR0aGlzLiRlbC5mYWRlT3V0KCk7IC8vVE9ETyBhbmltYXRlIG91dFx0XHRcblx0fSxcblx0cmVzaXplOiBmdW5jdGlvbigpe1xuXHRcdHZhciAkdyA9ICQod2luZG93KTtcblx0XHR2YXIgZnVsbFdpZHRoID0gJHcud2lkdGgoKTtcblx0XHR0aGlzLiRlbC5jc3MoXCJ3aWR0aFwiLCBmdWxsV2lkdGgpO1xuXHR9XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlJvdXRlci5leHRlbmQoe1xuXG4gICAgICAgIHJvdXRlczoge1xuICAgICAgICAgICAgXCJcIjogXCJob21lXCIsXG4gICAgICAgICAgLy8gIFwiZ2FsbGVyeVwiOiAgXCJnYWxsZXJ5XCIsIFxuICAgICAgICAgIC8vICBcImdhbGxlcnkvOmlkXCI6IFx0XCJkZXRhaWxcIixcbiAgICAgICAgICAvLyAgXCJwbGF5ZXIvOmlkXCI6IFwicGxheWVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdEJhY2tib25lLmhpc3Rvcnkuc3RhcnQoKTtcbiAgICAgICAgfVxufSk7ICIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWxCYXNlLmV4dGVuZCh7XG5cdFx0Ly9jb250cm9sIGdsb2JhbCBhdWRpb1xuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcblx0XHR9XG5cdFx0XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXdCYXNlLmV4dGVuZCh7XG5cblx0XHRpbml0OiBmdW5jdGlvbigpe1x0XHRcdFxuXHRcdFx0XG5cdFx0fSxcblx0XHRcblx0XHRnZXREYXRhOiBmdW5jdGlvbihjYil7XG5cdFx0XHQvLy9jb25zb2xlLmxvZyhcImdldHRpbmcgZGF0YVwiKTtcblx0XHRcdGNiKHtcblx0XHRcdFx0YXNzZXRzOiB7XG5cdFx0XHRcdFx0ZGVza3RvcDp7XG5cdFx0XHRcdFx0XHR0b3A6IFtcIi4vaW1hZ2VzL0pvYW5uYS5wbmdcIixcIi4vaW1hZ2VzL0tpbmcucG5nXCIsXCIuL2ltYWdlcy9UaG9tYXMucG5nXCIsXCIuL2ltYWdlcy9Sb24ucG5nXCIsXCIuL2ltYWdlcy9jYXJkYm9hcmQuanBnXCJdLFxuXHRcdFx0XHRcdFx0c2Vjb25kOiBbXCIuL2ltYWdlcy9Kb2FubmFfdG9wLnBuZ1wiLFwiLi9pbWFnZXMvS2luZ190b3AucG5nXCIsXCIuL2ltYWdlcy9UaG9tYXNfdG9wLnBuZ1wiLFwiLi9pbWFnZXMvUm9uX3RvcC5wbmdcIl0sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtb2JpbGU6e1xuXHRcdFx0XHRcdFx0dG9wOiBbXCIuL2ltYWdlcy9tb2JpbGUvSm9hbm5hLnBuZ1wiLFwiLi9pbWFnZXMvbW9iaWxlL0tpbmcucG5nXCIsXCIuL2ltYWdlcy9tb2JpbGUvVGhvbWFzLnBuZ1wiLFwiLi9pbWFnZXMvbW9iaWxlL1Jvbi5wbmdcIixcIi4vaW1hZ2VzL2NhcmRib2FyZC1tb2JpbGUucG5nXCIsXCIuL2ltYWdlcy9zbGlkZXIvam9hbm5hLmpwZ1wiLFwiLi9pbWFnZXMvc2xpZGVyL2tpbmcuanBnXCIsXCIuL2ltYWdlcy9zbGlkZXIvcm9uLmpwZ1wiLFwiLi9pbWFnZXMvc2xpZGVyL3Rob21hcy5qcGdcIl0sXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRvcDoge1xuXHRcdFx0XHRcdHNvY2lhbDogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJmYWNlYm9va1wiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAxXCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiXG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwidHdpdHRlclwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAxXCJcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJ0dW1ibHJcIixcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogXCJudW1iZXIgMVwiLFxuXHRcdFx0XHRcdFx0XHRcdGltZzogXCJodHRwOi8vd3d3LmZyZWVsYXJnZWltYWdlcy5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMTQvMTIvQ29udmVyc2VfTG9nb18wNC5qcGdcIixcblx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogXCJudW1iZXIgMSBkZXNjcmlwdGlvblwiXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInBpbnRlcmVzdFwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAxXCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiLFxuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBcIm51bWJlciAxIGRlc2NyaXB0aW9uXCJcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdhbGxlcnlJdGVtczpbXG5cblx0XHRcdFx0XHR7XHRcblx0XHRcdFx0XHRcdHR5cGU6IDIsXG5cdFx0XHRcdFx0XHR0aXRsZTpcIlZpZXcgd2l0aCBvciB3aXRob3V0IGNhcmRib2FyZCBnb2dnbGVzXCIsXG5cdFx0XHRcdFx0XHRpbWc6IFwiaW1hZ2VzL2NhcmRib2FyZC5qcGdcIixcblx0XHRcdFx0XHRcdGluZm86IFwiVmlldyBvbmxpbmUgbm93IG9yIGRvd25sb2FkIHRoZSBhcHAgdG8gbW92ZSBhcm91bmQgZXZlcnkgY29ybmVyIG9mIHRoZSBleHBlcmllbmNlIGJ5IHNoaWZ0aW5nIHlvdXIgaGFuZGhlbGQgZGV2aWNlIGluIGRpZmZlcmVudCBkaXJlY3Rpb25zLjxicj48YnI+VXNlIDxhIGNsYXNzPSBcXFwidHJrXFxcIiBkYXRhLWNhdGVnb3J5PVxcXCJkZXNrdG9wOmxpbmtcXFwiIGRhdGEtbGFiZWw9XFxcImJ1eS1jYXJkYm9hcmRcXFwiIGhyZWY9XFxcImh0dHA6Ly93d3cua25veGxhYnMuY29tL1xcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPmNhcmRib2FyZCBnb2dnbGVzPC9hPiBmb3IgdGhlIGZ1bGx5IGltbWVyc2l2ZSBleHBlcmllbmNlLlwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XHRcblx0XHRcdFx0XHRcdHNpZ09wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHR0b3RhbENvdW50OjkxLFxuXHRcdFx0XHRcdFx0XHRcdGV4dDoncG5nJyxcblx0XHRcdFx0XHRcdFx0XHRpbWc6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGg6MTY1LFxuXHRcdFx0XHRcdFx0XHRcdFx0dzo2MDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRoTW9iaWxlOiAxNDgsXG5cdFx0XHRcdFx0XHRcdFx0XHR3TW9iaWxlOiA1MjEsXG5cdFx0XHRcdFx0XHRcdFx0XHR2Mmg6IDIwMCxcblx0XHRcdFx0XHRcdFx0XHRcdHYydzogMzkwXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdC8vY2FudmFzOiBjbnYsXG5cdFx0XHRcdFx0XHRcdFx0XHRsb29wOmZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdFx0c3BlZWQ6MzAsXG5cdFx0XHRcdFx0XHRcdFx0XHRhdXRvU3RhcnQ6ZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0XHRsb2FkZWRJbWFnZXM6IFtdLFxuXHRcdFx0XHRcdFx0XHRcdFx0YmFzZVVSTDonLi9pbWFnZXMvU2lnbmF0dXJlcy92Mi9Kb2FubmEvSm9hbm5hXycsXG5cdFx0XHRcdFx0XHRcdFx0XHRiYXNlVVJMTW9iaWxlOiAnLi9pbWFnZXMvU2lnbmF0dXJlcy92Mi9Kb2FubmEvSm9hbm5hXydcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNvY2lhbDogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJmYWNlYm9va1wiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAxXCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiXG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwidHdpdHRlclwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAxXCJcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJ0dW1ibHJcIixcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogXCJudW1iZXIgMVwiLFxuXHRcdFx0XHRcdFx0XHRcdGltZzogXCJodHRwOi8vd3d3LmZyZWVsYXJnZWltYWdlcy5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMTQvMTIvQ29udmVyc2VfTG9nb18wNC5qcGdcIixcblx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogXCJudW1iZXIgMSBkZXNjcmlwdGlvblwiXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInBpbnRlcmVzdFwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAxXCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiLFxuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBcIm51bWJlciAxIGRlc2NyaXB0aW9uXCJcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0XHR0eXBlOiAxLFxuXHRcdFx0XHRcdFx0bGFiZWw6XCJqb2FubmEtZGVsYW5lXCIsXG5cdFx0XHRcdFx0XHRjcmVhdG9yOiBcIkpvYW5uYSBEZUxhbmVcIixcblx0XHRcdFx0XHRcdHRpdGxlOiBcIlN0ZXAgaW50byBhIHdvcmxkIG9mIHpvbWJpZXM8YnI+d2l0aCBhY3RyZXNzIEpvYW5uYSBEZUxhbmUuXCIsXG5cdFx0XHRcdFx0XHRpbWc6IFwiaW1hZ2VzL0pvYW5uYS5wbmdcIixcblx0XHRcdFx0XHRcdGltZ0RldGFpbDogXCJpbWFnZXMvSm9hbm5hX3RvcC5wbmdcIixcblx0XHRcdFx0XHRcdGF1ZGlvRGV0YWlsOiBcImF1ZGlvL0pvYW5uYS5tcDNcIixcblx0XHRcdFx0XHRcdHNoYXJlSW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiLFxuXHRcdFx0XHRcdFx0dmlkZW9VUkw6IFwiaHR0cDovL3d3dy5jZG4uY29udmVyc2UudG9vbG9mbmFkcml2ZS5jb20vWm9tYmllX0xfMS5tcDRcIixcblx0XHRcdFx0XHRcdHRlc3RVUkw6IFwiaHR0cDovL3d3dy5jZG4uY29udmVyc2UudG9vbG9mbmFkcml2ZS5jb20vWm9tYmllX0Rlc2t0b3AubXA0XCIsXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHZpZGVvSUQ6IFwiMjc4N1wiLFxuXHRcdFx0XHRcdFx0dmlkZW9CYXNlUGF0aDogXCJodHRwOi8vczMuYW1hem9uYXdzLmNvbS9pbTM2MC1hcHBzLzU2YkppZktEdiUyQkNGWGJYY294d0wvc291cmNlcy9cIixcblx0XHRcdFx0XHRcdGFuZ2xlOiAtMzgsXG5cdFx0XHRcdFx0XHRpbmZvOiBcIkpvYW5uYSBEZUxhbmUgaXMgYW4gYWN0cmVzcyBsaXZpbmcgaW4gTEEgcHVyc3VpbmcgaGVyIGRyZWFtcyBvZiB0aGUgYmlnIHNjcmVlbi4gUmVjZW50bHkgc2hlIHBsYXllZCBhIGdydWVzb21lIHJvbGUgb2YgYSB6b21iaWUgZXh0cmEgYW5kIHNjYXJlZCBldmVuIGhlcnNlbGYuPGJyPjxicj4mcXVvdDtCZWluZyBhbiBhY3RyZXNzIGluIExvcyBBbmdlbGVzLi4uaXQgaXNuJ3QgZWFzeS4gQnV0IGlmIGl0J3MgeW91ciBkcmVhbSwgaXQncyB3b3J0aCBpdC4mcXVvdDtcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2lnT3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHR0b3RhbENvdW50OjEwMSxcblx0XHRcdFx0XHRcdFx0ZXh0OidwbmcnLFxuXHRcdFx0XHRcdFx0XHRpbWc6IHtcblx0XHRcdFx0XHRcdFx0XHRoOjI1OCxcblx0XHRcdFx0XHRcdFx0XHR3OjYwMCxcblx0XHRcdFx0XHRcdFx0XHRoTW9iaWxlOiAxOTIsXG5cdFx0XHRcdFx0XHRcdFx0d01vYmlsZTogNDM2LFxuXHRcdFx0XHRcdFx0XHRcdHYyaDogMjAwLFxuXHRcdFx0XHRcdFx0XHRcdHYydzogMzkwXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0Ly9jYW52YXM6IGNudixcblx0XHRcdFx0XHRcdFx0XHRsb29wOmZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdHNwZWVkOjMwLFxuXHRcdFx0XHRcdFx0XHRcdGF1dG9TdGFydDpmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRsb2FkZWRJbWFnZXM6IFtdLFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgYmFzZVVSTDonLi9pbWFnZXMvU2lnbmF0dXJlcy92Mi9LaW5ndHVmZi9LaW5ndHVmZl8nLFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgYmFzZVVSTE1vYmlsZTogJy4vaW1hZ2VzL1NpZ25hdHVyZXMvdjIvS2luZ3R1ZmYvS2luZ3R1ZmZfJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNvY2lhbDogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJmYWNlYm9va1wiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAyXCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiXG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwidHdpdHRlclwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAyXCJcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJ0dW1ibHJcIixcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogXCJudW1iZXIgMlwiLFxuXHRcdFx0XHRcdFx0XHRcdGltZzogXCJodHRwOi8vd3d3LmZyZWVsYXJnZWltYWdlcy5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMTQvMTIvQ29udmVyc2VfTG9nb18wNC5qcGdcIixcblx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogXCJudW1iZXIgMSBkZXNjcmlwdGlvblwiXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInBpbnRlcmVzdFwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAyXCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiLFxuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBcIm51bWJlciAxIGRlc2NyaXB0aW9uXCJcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0XHR0eXBlOiAxLFxuXHRcdFx0XHRcdFx0bGFiZWw6XCJraW5nLXR1ZmZcIixcblx0XHRcdFx0XHRcdGNyZWF0b3I6IFwiS2luZyBUdWZmXCIsXG5cdFx0XHRcdFx0XHR0aXRsZTogXCJTdGVwIGludG8gdGhlIHBzeWNoZWRlbGljIG1pbmQ8YnI+b2YgbXVzaWNpYW4gS2luZyBUdWZmLlwiLFxuXHRcdFx0XHRcdFx0aW1nOiBcImltYWdlcy9LaW5nLnBuZ1wiLFxuXHRcdFx0XHRcdFx0aW1nRGV0YWlsOiBcImltYWdlcy9LaW5nX3RvcC5wbmdcIixcblx0XHRcdFx0XHRcdGF1ZGlvRGV0YWlsOiBcImF1ZGlvL0tpbmcubXAzXCIsXG5cdFx0XHRcdFx0XHRzaGFyZUltZzogXCJodHRwOi8vd3d3LmxvZ29xdWl6Y2hlYXQuY29tL2xldmVscy9nYW1lcy9hbmRyb2lkL2J1YmJsZS1xdWl6LWdhbWVzX2xvZ28tcXVpei9sZXZlbC0zL2NvbnZlcnNlLmpwZ1wiLFxuXHRcdFx0XHRcdFx0dmlkZW9VUkw6IFwiaHR0cDovL3d3dy5jZG4uY29udmVyc2UudG9vbG9mbmFkcml2ZS5jb20va3RfNS5tb3ZcIixcblx0XHRcdFx0XHRcdHRlc3RVUkw6IFwiaHR0cDovL3d3dy5jZG4uY29udmVyc2UudG9vbG9mbmFkcml2ZS5jb20vS2luZ1R1ZmZfRGVza3RvcC5tcDRcIixcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmlkZW9JRDogXCIyNzg4XCIsXG5cdFx0XHRcdFx0XHR2aWRlb0Jhc2VQYXRoOiBcImh0dHA6Ly9zMy5hbWF6b25hd3MuY29tL2ltMzYwLWFwcHMvNTZiSmlmS0R2JTJCQ0ZYYlhjb3h3TC9zb3VyY2VzL1wiLFxuXHRcdFx0XHRcdFx0YW5nbGU6IC0zMixcblx0XHRcdFx0XHRcdGluZm86IFwiS2luZyBUdWZmLCBhbHNvIGtub3duIGJ5IGhpcyBtb3RoZXIgYXMgJ0t5bGUnLCBpcyBxdWlja2x5IGJlY29taW5nIGEgcm9jayBhbmQgcm9sbCBtYWluc3RheS4gV2l0aCBoaXMgZWRneSBzdHlsZSBhbmQgcHN5Y2hlZGVsaWMgbHlyaWNzLCBLaW5nIFR1ZmYgdGFrZXMgdXMgb24gYSBqb3VybmV5IHRocm91Z2ggaGlzIG1pbmQgd2l0aCBldmVyeSB0cmFjay4gPGJyPjxicj4mcXVvdDtTb21ldGhpbmcgdGhhdCB3b3VsZCBpbnNwaXJlIG1lIGlzIGFuIG9sZCBtYW4gd2l0aCBvbmUgdG9vdGggb3IgbWluaSBncmlsbGVkIGNoZWVzZS4mcXVvdDtcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2lnT3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHR0b3RhbENvdW50OjU5LFxuXHRcdFx0XHRcdFx0XHRleHQ6J3BuZycsXG5cdFx0XHRcdFx0XHRcdGltZzoge1xuXHRcdFx0XHRcdFx0XHRcdGg6MTkwLFxuXHRcdFx0XHRcdFx0XHRcdHc6NjAwLFxuXHRcdFx0XHRcdFx0XHRcdGhNb2JpbGU6MTMwLFxuXHRcdFx0XHRcdFx0XHRcdHdNb2JpbGU6NDA4LFxuXHRcdFx0XHRcdFx0XHRcdHYyaDogMjAwLFxuXHRcdFx0XHRcdFx0XHRcdHYydzogMzkwIFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdC8vY2FudmFzOiBjbnYsXG5cdFx0XHRcdFx0XHRcdFx0bG9vcDpmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRzcGVlZDozMCxcblx0XHRcdFx0XHRcdFx0XHRhdXRvU3RhcnQ6ZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0bG9hZGVkSW1hZ2VzOiBbXSxcblx0XHRcdFx0ICAgICAgICAgICAgICAgIGJhc2VVUkw6Jy4vaW1hZ2VzL1NpZ25hdHVyZXMvdjIvVGhvbWFzL1Rob21hc18nLFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgYmFzZVVSTE1vYmlsZTogJy4vaW1hZ2VzL1NpZ25hdHVyZXMvdjIvVGhvbWFzL1Rob21hc18nXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0c29jaWFsOiBbXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImZhY2Vib29rXCIsXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IFwibnVtYmVyIDNcIixcblx0XHRcdFx0XHRcdFx0XHRpbWc6IFwiaHR0cDovL3d3dy5mcmVlbGFyZ2VpbWFnZXMuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE0LzEyL0NvbnZlcnNlX0xvZ29fMDQuanBnXCJcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJ0d2l0dGVyXCIsXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IFwibnVtYmVyIDNcIlxuXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInR1bWJsclwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciAzXCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiLFxuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBcIm51bWJlciAxIGRlc2NyaXB0aW9uXCJcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwicGludGVyZXN0XCIsXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IFwibnVtYmVyIDNcIixcblx0XHRcdFx0XHRcdFx0XHRpbWc6IFwiaHR0cDovL3d3dy5mcmVlbGFyZ2VpbWFnZXMuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE0LzEyL0NvbnZlcnNlX0xvZ29fMDQuanBnXCIsXG5cdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IFwibnVtYmVyIDEgZGVzY3JpcHRpb25cIlxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdHR5cGU6IDEsXG5cdFx0XHRcdFx0XHRsYWJlbDpcInRob21hcy1taWRsYW5lXCIsXG5cdFx0XHRcdFx0XHRjcmVhdG9yOiBcIlRob21hcyBNaWRsYW5lXCIsXG5cdFx0XHRcdFx0XHR0aXRsZTogXCJTdGVwIGludG8gcGxhY2VzIHVua25vd248YnI+d2l0aCB1cmJhbiBleHBsb3JlciBUaG9tYXMgTWlkbGFuZS5cIixcblx0XHRcdFx0XHRcdGltZzogXCJpbWFnZXMvVGhvbWFzLnBuZ1wiLFxuXHRcdFx0XHRcdFx0aW1nRGV0YWlsOiBcImltYWdlcy9UaG9tYXNfdG9wLnBuZ1wiLFxuXHRcdFx0XHRcdFx0YXVkaW9EZXRhaWw6IFwiYXVkaW8vVGhvbWFzLm1wM1wiLFxuXHRcdFx0XHRcdFx0c2hhcmVJbWc6IFwiaHR0cDovL2ZjMDguZGV2aWFudGFydC5uZXQvZnM3MS9mLzIwMTMvMjg5L2YvMS9jb252ZXJzZV9sb2dvXzFfYnlfbXJfbG9nby1kNnFvN2toLmpwZ1wiLFxuXHRcdFx0XHRcdFx0dmlkZW9VUkw6IFwiaHR0cDovL3d3dy5jZG4uY29udmVyc2UudG9vbG9mbmFkcml2ZS5jb20vdGhvbWFzXzMubXA0XCIsXG5cdFx0XHRcdFx0XHR0ZXN0VVJMOiBcImh0dHA6Ly93d3cuY2RuLmNvbnZlcnNlLnRvb2xvZm5hZHJpdmUuY29tL1VyYmFuX0Rlc2t0b3AubXA0XCIsXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHZpZGVvSUQ6IFwiMjc4OVwiLFxuXHRcdFx0XHRcdFx0dmlkZW9CYXNlUGF0aDogXCJodHRwOi8vczMuYW1hem9uYXdzLmNvbS9pbTM2MC1hcHBzLzU2YkppZktEdiUyQkNGWGJYY294d0wvc291cmNlcy9cIixcblx0XHRcdFx0XHRcdGFuZ2xlOiAtNTAsXG5cdFx0XHRcdFx0XHRpbmZvOiBcIlRob21hcyBNaWRsYW5lIGlzIGFuIHVyYmFuIGV4cGxvcmVyIHRoYXQgaGFpbHMgZnJvbSBMb25kb24sIEVuZ2xhbmQuIEhlIGZpbmRzIGFkdmVudHVyZSBpbiBleHBsb3JpbmcgdGhlIGRhcmtlc3QgYW5kIGRlZXBlc3QgY2F2ZXJucyB0aGF0IGhpcyBjaXR5IGhhcyB0byBvZmZlci48YnI+PGJyPiZxdW90O1NvbWUgc2F5IHRoZSBjaXR5IGlzIGp1c3QgZm9yIHNob3BwaW5nLiBJIHRoaW5rIGl0J3MgZm9yIG1lZXRpbmcgbmV3IHBlb3BsZSBhbmQgZXhwbG9yaW5nIG5ldyBwbGFjZXMuJnF1b3Q7XCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNpZ09wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0dG90YWxDb3VudDo4Myxcblx0XHRcdFx0XHRcdFx0ZXh0OidwbmcnLFxuXHRcdFx0XHRcdFx0XHRpbWc6IHtcblx0XHRcdFx0XHRcdFx0XHRoOjI1OCxcblx0XHRcdFx0XHRcdFx0XHR3OjYwMCxcblx0XHRcdFx0XHRcdFx0XHRoTW9iaWxlOjIzMyxcblx0XHRcdFx0XHRcdFx0XHR3TW9iaWxlOjU2Nyxcblx0XHRcdFx0XHRcdFx0XHR2Mmg6IDIwMCxcblx0XHRcdFx0XHRcdFx0XHR2Mnc6IDM5MFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdC8vY2FudmFzOiBjbnYsXG5cdFx0XHRcdFx0XHRcdFx0bG9vcDpmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRzcGVlZDozMCxcblx0XHRcdFx0XHRcdFx0XHRhdXRvU3RhcnQ6ZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0bG9hZGVkSW1hZ2VzOiBbXSxcblx0XHRcdFx0ICAgICAgICAgICAgICAgIGJhc2VVUkw6Jy4vaW1hZ2VzL1NpZ25hdHVyZXMvdjIvRW5nbGlzaC9FbmdsaXNoXycsXG5cdFx0XHRcdCAgICAgICAgICAgICAgICBiYXNlVVJMTW9iaWxlOiAnLi9pbWFnZXMvU2lnbmF0dXJlcy92Mi9FbmdsaXNoL0VuZ2xpc2hfJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNvY2lhbDogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJmYWNlYm9va1wiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciA0XCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiXG5cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwidHdpdHRlclwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciA0XCJcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJ0dW1ibHJcIixcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogXCJudW1iZXIgNFwiLFxuXHRcdFx0XHRcdFx0XHRcdGltZzogXCJodHRwOi8vd3d3LmZyZWVsYXJnZWltYWdlcy5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMTQvMTIvQ29udmVyc2VfTG9nb18wNC5qcGdcIixcblx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogXCJudW1iZXIgMSBkZXNjcmlwdGlvblwiXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInBpbnRlcmVzdFwiLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm51bWJlciA0XCIsXG5cdFx0XHRcdFx0XHRcdFx0aW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiLFxuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBcIm51bWJlciAxIGRlc2NyaXB0aW9uXCJcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0XHR0eXBlOiAxLFxuXHRcdFx0XHRcdFx0bGFiZWw6XCJyb24tZW5nbGlzaFwiLFxuXHRcdFx0XHRcdFx0Y3JlYXRvcjogXCJSb24gRW5nbGlzaFwiLFxuXHRcdFx0XHRcdFx0dGl0bGU6IFwiU3RlcCBvbnRvIGFuIExBIHNreXNjcmFwZXIgd2l0aDxicj5hcnRpc3QgUm9uIEVuZ2xpc2guXCIsXG5cdFx0XHRcdFx0XHRpbWc6IFwiaW1hZ2VzL1Jvbi5wbmdcIixcblx0XHRcdFx0XHRcdGltZ0RldGFpbDogXCJpbWFnZXMvUm9uX3RvcC5wbmdcIixcblx0XHRcdFx0XHRcdGF1ZGlvRGV0YWlsOiBcImF1ZGlvL1Jvbi5tcDNcIixcblx0XHRcdFx0XHRcdHNoYXJlSW1nOiBcImh0dHA6Ly93d3cuZnJlZWxhcmdlaW1hZ2VzLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNC8xMi9Db252ZXJzZV9Mb2dvXzA0LmpwZ1wiLFxuXHRcdFx0XHRcdFx0dmlkZW9VUkw6IFwiaHR0cDovL3d3dy5jZG4uY29udmVyc2UudG9vbG9mbmFkcml2ZS5jb20vZW5nbGlzaF8yLm1wNFwiLFxuXHRcdFx0XHRcdFx0dGVzdFVSTDogXCJodHRwOi8vd3d3LmNkbi5jb252ZXJzZS50b29sb2ZuYWRyaXZlLmNvbS9Sb29mdG9wX0Rlc2t0b3BfMDIubXA0XCIsXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHZpZGVvSUQ6IFwiMjc4NlwiLFxuXHRcdFx0XHRcdFx0dmlkZW9CYXNlUGF0aDogXCJodHRwOi8vczMuYW1hem9uYXdzLmNvbS9pbTM2MC1hcHBzLzU2YkppZktEdiUyQkNGWGJYY294d0wvc291cmNlcy9cIixcblx0XHRcdFx0XHRcdGFuZ2xlOiAtMzQsXG5cdFx0XHRcdFx0XHRpbmZvOiBcIlJvbiBFbmdsaXNoIGlzIGEgY3VsdHVyYWwgaWNvbiB0aGF0IGhhcyBjaGFuZ2VkIHRoZSBnYW1lIGluIGFydC4gSGUgaXMga25vd24gZm9yIHB1c2hpbmcgdGhlIGVudmVsb3BlIGNyZWF0aXZlbHkgYW5kIHBvbGl0aWNhbGx5IGFuZCBpc24ndCBhZnJhaWQgdG8gcnVmZmxlIHNvbWUgZmVhdGhlcnMgYWxvbmcgdGhlIHdheS48YnI+PGJyPiZxdW90O0kgdHJ5IHRvIG1ha2UgYmlnIHBvbGl0aWNhbCBwb2ludHMgd2l0aG91dCBwaXNzaW5nIGFueW9uZSBvZmYuIFdoaWNoIGlzIHByZXR0eSBtdWNoIGltcG9zc2libGUuJnF1b3Q7XCJcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XVxuXG5cdFx0XHR9KVxuXHRcdH1cblxufSk7IiwiLy9hcGkgZm9yIGludGVybmF0aW9uYWxpemF0aW9uIFxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbEJhc2UuZXh0ZW5kKHtcblx0XHRcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuXHRcdFx0XG5cdFx0fVxuXHRcdFxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbEJhc2UuZXh0ZW5kKHtcbi8vY2hlY2sgYnJvd3NlciB0byBzaG93IGZhbGwgYmFjayBpZiBuZWNlc3NhcnlcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCl7XHRcdFx0XG5cdFx0XHRcblx0XHR9LFxuXG5cdFx0cnVuOiBmdW5jdGlvbigpe1xuXHRcdFx0bmF2aWdhdG9yLnNheXN3aG89IChmdW5jdGlvbigpe1xuXHRcdFx0ICAgIHZhciB1YT0gbmF2aWdhdG9yLnVzZXJBZ2VudCwgdGVtLCBcblx0XHRcdCAgICBNPSB1YS5tYXRjaCgvKG9wZXJhfGNocm9tZXxzYWZhcml8ZmlyZWZveHxtc2llfHRyaWRlbnQoPz1cXC8pKVxcLz9cXHMqKFxcZCspL2kpIHx8IFtdO1xuXHRcdFx0ICAgIGlmKC90cmlkZW50L2kudGVzdChNWzFdKSl7XG5cdFx0XHQgICAgICAgIHRlbT0gIC9cXGJydlsgOl0rKFxcZCspL2cuZXhlYyh1YSkgfHwgW107XG5cdFx0XHQgICAgICAgIHJldHVybiAnSUUgJysodGVtWzFdIHx8ICcnKTtcblx0XHRcdCAgICB9XG5cdFx0XHQgICAgaWYoTVsxXT09PSAnQ2hyb21lJyl7XG5cdFx0XHQgICAgICAgIHRlbT0gdWEubWF0Y2goL1xcYk9QUlxcLyhcXGQrKS8pXG5cdFx0XHQgICAgICAgIGlmKHRlbSE9IG51bGwpIHJldHVybiAnT3BlcmEgJyt0ZW1bMV07XG5cdFx0XHQgICAgfVxuXHRcdFx0ICAgIE09IE1bMl0/IFtNWzFdLCBNWzJdXTogW25hdmlnYXRvci5hcHBOYW1lLCBuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgJy0/J107XG5cdFx0XHQgICAgaWYoKHRlbT0gdWEubWF0Y2goL3ZlcnNpb25cXC8oXFxkKykvaSkpIT0gbnVsbCkgTS5zcGxpY2UoMSwgMSwgdGVtWzFdKTtcblx0XHRcdCAgICByZXR1cm4gTS5qb2luKCcgJyk7XG5cdFx0XHR9KSgpO1xuXHRcdFx0dmFyIGJyb3dzZXIgPSBuYXZpZ2F0b3Iuc2F5c3doby5zcGxpdChcIiBcIilbMF07XG5cdFx0XHR2YXIgdmVyc2lvbiA9IG5hdmlnYXRvci5zYXlzd2hvLnNwbGl0KFwiIFwiKVsxXTtcblx0XHRcdC8vY29uc29sZS5sb2coJ3J1bm5pbmcgYnJvd3NlciBjaGVjaycpXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NvbXBsZXRlJywge1xuXHRcdFx0XHRuYW1lOidicm93c2VyJyxcblx0XHRcdFx0cmVzdWx0Ontcblx0XHRcdFx0XHRicm93c2VyOiBicm93c2VyLFxuXHRcdFx0XHRcdHZlcnNpb246IHZlcnNpb25cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9XG5cbn0pOyIsInZhciBEZXZpY2UgPSBcdFx0XHRyZXF1aXJlKFwiLi9kZXZpY2UuanNcIik7XG52YXIgQnJvd3NlciA9IFx0XHRcdHJlcXVpcmUoXCIuL2Jyb3dzZXIuanNcIik7XG4vL3ZhciBSZWdpb24gPVx0XHRcdHJlcXVpcmUoXCIuL3JlZ2lvbi5qc1wiKTtcbi8vdmFyIExhbmd1YWdlID0gXHRcdFx0cmVxdWlyZShcIi4vbGFuZ3VhZ2UuanNcIik7XG4vL3ZhciBCYW5kd2lkdGggPSBcdFx0cmVxdWlyZShcIi4vYmFuZHdpZHRoLmpzXCIpO1xuLy92YXIgV2ViZ2wgPSBcdFx0XHRyZXF1aXJlKFwiLi93ZWJnbC5qc1wiKTtcbiBcbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWxCYXNlLmV4dGVuZCh7XG5cdFx0cmVzdWx0czoge30sXG5cdFx0aW5pdDogZnVuY3Rpb24oKXtcdFxuXHRcdFx0dGhpcy5jcmVhdGVPYmplY3RzKCk7XG5cdFx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0XHR9LFxuXHRcdGNyZWF0ZU9iamVjdHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5kZXZpY2UgPSBuZXcgRGV2aWNlKCk7XG5cdFx0XHR0aGlzLmJyb3dzZXIgPSBuZXcgQnJvd3NlcigpO1x0XG5cdFx0XHQvL3RoaXMucmVnaW9uID0gbmV3IFJlZ2lvbigpO1x0XHRcblx0XHRcdC8vdGhpcy5sYW5ndWFnZSA9IG5ldyBMYW5ndWFnZSgpO1xuXHRcdFx0Ly90aGlzLmJhbmR3aWR0aCA9IG5ldyBCYW5kd2lkdGgoKTtcblx0XHRcdC8vdGhpcy53ZWJHbCA9IG5ldyBXZWJnbCgpO1xuXHRcdH0sXG5cdFx0YmluZEV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmRldmljZS5vbignY29tcGxldGUnLHRoaXMuaGFuZGxlQ29tcGxldGUuYmluZCh0aGlzKSk7XG5cdFx0XHR0aGlzLmJyb3dzZXIub24oJ2NvbXBsZXRlJyx0aGlzLmhhbmRsZUNvbXBsZXRlLmJpbmQodGhpcykpO1xuXHRcdFx0Ly90aGlzLnJlZ2lvbi5vbignY29tcGxldGUnLHRoaXMuaGFuZGxlQ29tcGxldGUuYmluZCh0aGlzKSk7XG5cdFx0XHQvL3RoaXMubGFuZ3VhZ2Uub24oJ2NvbXBsZXRlJyx0aGlzLmhhbmRsZUNvbXBsZXRlLmJpbmQodGhpcykpO1xuXHRcdFx0Ly90aGlzLmJhbmR3aWR0aC5vbignY29tcGxldGUnLHRoaXMuaGFuZGxlQ29tcGxldGUuYmluZCh0aGlzKSk7XG5cdFx0XHQvL3RoaXMud2ViR2wub24oJ2NvbXBsZXRlJyx0aGlzLmhhbmRsZUNvbXBsZXRlLmJpbmQodGhpcykpO1xuXHRcdH0sXG5cdFx0aGFuZGxlQ29tcGxldGU6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHRoaXMucmVzdWx0c1tlLm5hbWVdID0gZS5yZXN1bHQ7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGUucmVzdWx0KTtcblx0XHRcdGlmKCBcblx0XHRcdFx0dGhpcy5yZXN1bHRzLmRldmljZSAmJiBcblx0XHRcdFx0dGhpcy5yZXN1bHRzLmJyb3dzZXIgLy8mJiBcblx0XHRcdFx0Ly90aGlzLnJlc3VsdHMucmVnaW9uICYmIFxuXHRcdFx0XHQvL3RoaXMucmVzdWx0cy5sYW5ndWFnZSAmJiBcblx0XHRcdFx0Ly90aGlzLnJlc3VsdHMuYmFuZHdpZHRoICYmXHRcdFx0XHRcblx0XHRcdFx0Ly90aGlzLnJlc3VsdHMud2ViZ2wgXG5cdFx0XHQpIHtcblxuXHRcdFx0XHR0aGlzLmNvbXBsZXRlKClcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cnVuOiBmdW5jdGlvbihjYil7XG5cdFx0XHR0aGlzLmNiID0gY2Jcblx0XHRcdHRoaXMuZGV2aWNlLnJ1bigpO1xuXHRcdFx0dGhpcy5icm93c2VyLnJ1bigpO1xuXHRcdFx0Ly90aGlzLnJlZ2lvbi5ydW4oKTtcblx0XHRcdC8vdGhpcy5sYW5ndWFnZS5ydW4oKTtcblx0XHRcdC8vdGhpcy5iYW5kd2lkdGgucnVuKCk7XG5cdFx0XHQvL3RoaXMud2ViR2wucnVuKCk7XG5cdFx0fSxcblx0XHRjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZih0aGlzLmNiICYmIHR5cGVvZiB0aGlzLmNiID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXMuY2IodGhpcy5yZXN1bHRzKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjb21wbGV0ZScsdGhpcy5yZXN1bHRzKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlld0Jhc2UuZXh0ZW5kKHtcblxuXHRcdGluaXQ6IGZ1bmN0aW9uKCl7XHRcdFx0XG5cblx0XHR9LFxuXHRcdHJ1bjogZnVuY3Rpb24oKXtcblx0XHQvL1x0Y29uc29sZS5sb2coXCJydW5uaW5nIGRldmljZSBjaGVja1wiKTtcblx0XHRcdHZhciBtb2JpbGVPUyA9IG51bGw7XG5cdFx0XHR2YXIgcmVzdWx0O1xuXHRcdFx0dmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblx0XHRcdGlmKHVhLm1hdGNoKC9BbmRyb2lkL2kpKSB7XG5cdFx0XHRcdG1vYmlsZU9TID0gJ0FuZHJvaWQnO1xuXHRcdFx0fSBlbHNlIGlmKCB1YS5tYXRjaCgvQmxhY2tCZXJyeS9pKSl7XG5cdFx0ICAgIFx0bW9iaWxlT1MgPSAnQmxhY2tCZXJyeSc7XG5cdFx0ICAgIH0gZWxzZSBpZiggdWEubWF0Y2goL2lQaG9uZS9pKSkge1xuXHRcdCAgICBcdG1vYmlsZU9TID0gJ2lPUyc7XG5cdFx0ICAgIH0gZWxzZSBpZiggdWEubWF0Y2goL2lQYWQvaSkpIHtcblx0XHQgICAgXHRtb2JpbGVPUyA9ICdpT1MnO1xuXHRcdCAgICB9IGVsc2UgaWYoIHVhLm1hdGNoKC9pUG9kL2kpKSB7XG5cdFx0ICAgIFx0bW9iaWxlT1MgPSAnaU9TJztcblx0XHQgICAgfSBlbHNlIGlmICh1YS5tYXRjaCgvT3BlcmEgTWluaS9pKSl7XG5cdCAgICAgICAgXHRtb2JpbGVPUyA9ICdPcGVyYSc7XG5cdCAgICAgICAgfSBlbHNlIGlmKHVhLm1hdGNoKC9JRU1vYmlsZS9pKSl7XG5cdCAgICAgICAgXHRtb2JpbGVPUyA9ICdXaW5kb3dzJztcblx0XHQgICAgfVxuXHRcdCAgICBpZihtb2JpbGVPUykge1xuXHRcdCAgICBcdHJlc3VsdCA9IHtcblx0XHQgICAgXHRcdHR5cGU6ICdtb2JpbGUnLFxuXHRcdCAgICBcdFx0b3M6IG1vYmlsZU9TXG5cdFx0ICAgIFx0XHQvL3ZlcnNpb246IG5lZWRzIHRvIGJlIGFkZGVkXHRcdCAgICBcdFx0XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9ZWxzZSB7XG5cdFx0ICAgIFx0cmVzdWx0ID0ge1xuXHRcdCAgICBcdFx0dHlwZTogJ2Rlc2t0b3AnLFxuXHRcdCAgICBcdFx0b3M6IHRoaXMub3MoKVxuXHRcdCAgICBcdH1cblxuXHRcdCAgICB9XG5cdFx0ICBcdC8vIHJlc3VsdCA9IHtcblx0ICAgIC8vIFx0XHR0eXBlOiAnbW9iaWxlJyAvL3Rlc3QgbW9iaWxlIG9uIGRlc2t0b3Bcblx0ICAgIC8vIFx0fSBcblx0XHQgICAgdGhpcy50cmlnZ2VyKCdjb21wbGV0ZScsIHtcblx0XHRcdFx0bmFtZTonZGV2aWNlJyxcblx0XHRcdFx0cmVzdWx0OiByZXN1bHRcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRvczogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgT1NOYW1lO1xuXHRcdFx0aWYgKG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJXaW5cIikhPS0xKSBPU05hbWU9XCJXaW5kb3dzXCI7XG5cdFx0XHRpZiAobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1hY1wiKSE9LTEpIE9TTmFtZT1cIk1hY09TXCI7XG5cdFx0XHRpZiAobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIlgxMVwiKSE9LTEpIE9TTmFtZT1cIlVOSVhcIjtcblx0XHRcdGlmIChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTGludXhcIikhPS0xKSBPU05hbWU9XCJMaW51eFwiO1xuXHRcdFx0cmV0dXJuIE9TTmFtZTtcblx0XHR9XG5cbn0pOyIsIi8qXG4gICAgVE8gRE9cbiAgICAgICAgLSBhZGQgcHJlbG9hZGluZ1xuKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgY29uZmlnOiB7XG5cbiAgICB9LFxuICAgIHN0YXRlOiB7fSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc2V0Q29uZmlnKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgICAgICAgaWYodGhpcy5jb25maWcuYXV0b1N0YXJ0KSB7XG4gICAgICAgICAgICB0aGlzLmJlZ2luKCk7XG4gICAgICAgIH1cbiAgICAgICAvLyB0aGlzLnByZWxvYWQoKTtcbiAgICB9LFxuICAgIHByZWxvYWQ6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBpbWcgPSBudWxsO1xuICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLmNvbmZpZy50b3RhbENvdW50OyBpKyspe1xuICAgICAgICAgICAgLy8gbmV3IGltYWdlIGNyZWF0ZWQsIG92ZXJ3cml0ZXMgcHJldmlvdXMgaW1hZ2Ugd2l0aGluIHRoZSBmb3IgbG9vcFxuICAgICAgICAgICAgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAvLyBzZXQgdGhlIHNyYyBhdHRyaWJ1dGUgcGF0aCB0byB0aGUgaW1hZ2UgZmlsZSBuYW1lcyBpbiB0aGUgZm9yIGxvb3BcbiAgICAgICAgICAgIGltZy5zcmMgPSB0aGlzLmNvbmZpZy5iYXNlVVJMK2krXCIuXCIrdGhpcy5jb25maWcuZXh0O1xuICAgICAgICAgICAgLy8gaWYgbGFzdCBhcnJheSBpbmRleCwgc2V0IG9ubG9hZCBjb21wbGV0ZSBoYW5kbGVyXG4gICAgICAgICAgICBpZihpID09ICh0aGlzLmNvbmZpZy50b3RhbENvdW50IC0gMSkpe1xuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSB0aGlzLmltYWdlc0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwicHJlbG9hZGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc3RvcmUgdGhlIGltYWdlIG9iamVjdCB0byB0aGUgaW1hZ2VzIGFycmF5XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5sb2FkZWRJbWFnZXMucHVzaChpbWcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRDb25maWc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBvcHRpb25zXG5cbiAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbmZpZyk7XG4gICAgICAgIHRoaXMuY29uZmlnLmN0eCA9IHRoaXMuY29uZmlnLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7IFxuICAgIH0sXG4gICAgYmVnaW46IGZ1bmN0aW9uKCkge1xuICAgICAvLyAgIGNvbnNvbGUubG9nKFwiYmVnaW5cIiwgdGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUuYmVndW4gPSB0cnVlO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuc3RhdGUuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUuY2FsbChfdGhpcyxfdGhpcy5pbmNyZW1lbnQpO1xuICAgICAgICB9LCAxMDAwL3RoaXMuY29uZmlnLnNwZWVkKVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmxvYWRlZEltYWdlc1t0aGlzLnN0YXRlLmN1cnJlbnRJbmRleF0pIHtcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coX3RoaXMuY29uZmlnLmNhbnZhcy53aWR0aCk7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jdHguY2xlYXJSZWN0KDAsMCxfdGhpcy5jb25maWcuY2FudmFzLndpZHRoLCBfdGhpcy5jb25maWcuY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jdHguZHJhd0ltYWdlKHRoaXMuY29uZmlnLmxvYWRlZEltYWdlc1t0aGlzLnN0YXRlLmN1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICAgICAgMCwgMCwgX3RoaXMuY29uZmlnLmltZy52MncsIF90aGlzLmNvbmZpZy5pbWcudjJoKTsvLyBkaW1lbnNpb25zIGFuZCBwb3NpdGlvbnMgbmVlZHMgdG8gYmUgY2hhbmdlZCBcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChfdGhpcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBpbSA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICBpbS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY29uZmlnLmxvYWRlZEltYWdlc1tfdGhpcy5zdGF0ZS5jdXJyZW50SW5kZXhdID0gaW07XG4gICAgICAgICAgICAgICAgX3RoaXMuY29uZmlnLmN0eC5jbGVhclJlY3QoMCwwLF90aGlzLmNvbmZpZy5jYW52YXMud2lkdGgsIF90aGlzLmNvbmZpZy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jb25maWcuY3R4LmRyYXdJbWFnZShpbSwgXG4gICAgICAgICAgICAgICAgICAgIDAsIDAsIF90aGlzLmNvbmZpZy5pbWcudjJ3LCBfdGhpcy5jb25maWcuaW1nLnYyaCk7Ly8gZGltZW5zaW9ucyBhbmQgcG9zaXRpb25zIG5lZWRzIHRvIGJlIGNoYW5nZWQgXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2sgJiYgdHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKF90aGlzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpbS5zcmMgPSB0aGlzLmNvbmZpZy5iYXNlVVJMK3RoaXMuc3RhdGUuY3VycmVudEluZGV4K1wiLlwiK3RoaXMuY29uZmlnLmV4dFxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmN1cnJlbnRJbmRleCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluY3JlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuc3RhdGUuY3VycmVudEluZGV4PHRoaXMuY29uZmlnLnRvdGFsQ291bnQtMSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50SW5kZXgrKztcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMuY29uZmlnLmxvb3ApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudEluZGV4ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudEluZGV4ID0gMDtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5pbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlLmludGVydmFsKVxuICAgIH0sXG4gICAgcmVzdW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXRoaXMuc3RhdGUuYmVndW4pIHtcbiAgICAgICAgICAgIHRoaXMuYmVnaW4oKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpc1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKF90aGlzLmluY3JlbWVudClcbiAgICAgICAgICAgIH0sIDEwMDAvdGhpcy5jb25maWcuc3BlZWQpXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRJbmRleCsrXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSxcbiAgICBwcmV2aW91czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuY3VycmVudEluZGV4LS1cbiAgICAgICAgdXBkYXRlKClcbiAgICB9LFxuICAgIGdvVG86IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRJbmRleCA9IG51bTtcbiAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH0sXG4gICAgdHJhc2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuaW50ZXJ2YWwpO1xuICAgIH1cbn0pIiwidmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG5vYmogfHwgKG9iaiA9IHt9KTtcbnZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbndpdGggKG9iaikge1xuX19wICs9ICc8c2NyaXB0PihmdW5jdGlvbihpLHMsbyxnLHIsYSxtKXtpW1xcJ0dvb2dsZUFuYWx5dGljc09iamVjdFxcJ109cjtpW3JdPWlbcl18fGZ1bmN0aW9uKCl7XFxuXFx0XFx0ICAoaVtyXS5xPWlbcl0ucXx8W10pLnB1c2goYXJndW1lbnRzKX0saVtyXS5sPTEqbmV3IERhdGUoKTthPXMuY3JlYXRlRWxlbWVudChvKSxcXG5cXHRcXHQgIG09cy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTthLmFzeW5jPTE7YS5zcmM9ZzttLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsbSlcXG5cXHRcXHQgIH0pKHdpbmRvdyxkb2N1bWVudCxcXCdzY3JpcHRcXCcsXFwnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzXFwnLFxcJ2dhXFwnKTtcXG5cXG5cXHRcXHQgIGdhKFxcJ2NyZWF0ZVxcJywgXFwnVUEtNjAwNzY2NjMtMVxcJywgXFwnYXV0b1xcJyk7XFxuXFx0XFx0ICBnYShcXCdzZW5kXFwnLCBcXCdwYWdldmlld1xcJyk7PC9zY3JpcHQ+PGRpdiBjbGFzcz1cIm1haW5cIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW50cm9cIj48L2Rpdj48ZGl2IGNsYXNzPVwiaGVhZGVyXCI+PC9kaXY+PGRpdiBjbGFzcz1cImZvb3RlclwiPjwvZGl2PjxkaXYgY2xhc3M9XCJjb3ZlclwiPjwvZGl2PjxkaXYgY2xhc3M9XCJkZXRhaWxcIj48L2Rpdj48ZGl2IGNsYXNzPVwicGxheWVyXCI+PC9kaXY+PGRpdiBjbGFzcz1cInNoYXJlc1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJtb2JpbGVcIj48L2Rpdj48ZGl2IGNsYXNzPVwibW9iaWxlLWludHJvXCI+PC9kaXY+PGRpdiBjbGFzcz1cInByZWxvYWRlclwiPjwvZGl2Pic7XG5cbn1cbnJldHVybiBfX3Bcbn07IiwidmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG5vYmogfHwgKG9iaiA9IHt9KTtcbnZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbndpdGggKG9iaikge1xuX19wICs9ICc8ZGl2IGNsYXNzPVwiZGV0YWlsLWJhY2tncm91bmRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiZGV0YWlsLWlubmVyXCI+PGltZyBjbGFzcz1cImRldGFpbC1pY29uXCIgc3JjPVwiJyArXG4oKF9fdCA9IChkZXRhaWwuaW1nRGV0YWlsKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCI+PGRpdiBjbGFzcz1cImNvbnRlbnRcIj48aDEgY2xhc3M9XCJ0aXRsZVwiPicgK1xuKChfX3QgPSAoZGV0YWlsLmNyZWF0b3IpKSA9PSBudWxsID8gJycgOiBfX3QpICtcbic8L2gxPjxkaXYgY2xhc3M9XCJpbmZvXCI+JyArXG4oKF9fdCA9IChkZXRhaWwuaW5mbykpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJzwvZGl2PjxkaXYgY2xhc3M9XCJkb3dubG9hZC1saW5rc1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJidHNcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaGVhci1saW5rIGJ0bi1jaXJjbGVcIj48ZGl2IGNsYXNzPVwiaGVhci1wdWxzZVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJoZWFyLWJvcmRlclwiPjwvZGl2PjxkaXYgY2xhc3M9XCJoZWFyLWljb24gdHJrXCIgZGF0YS1jYXRlZ29yeT1cImRlc2t0b3A6ZGV0YWlsOnBsYXlcIiBkYXRhLWxhYmVsPVwiJyArXG4oKF9fdCA9IChkZXRhaWwuY3JlYXRvcikpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJwbGF5XCI+PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Ym94PVwiMCAwIDE3LjYgMjBcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxkZWZzPjwvZGVmcz48cG9seWdvbiBmaWxsPVwiIzg5ODg4QVwiIHBvaW50cz1cIjAsMCAxNy42LDEwIDAsMjAgXCI+PC9wb2x5Z29uPjwvc3ZnPjwvZGl2PjxkaXYgY2xhc3M9XCJwYXVzZVwiPjxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4bWxuczphPVwiaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wL1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld2JveD1cIjAgMCAyMCAxOS44XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48ZGVmcz48L2RlZnM+PHJlY3QgeT1cIjBcIiBmaWxsPVwiIzg5ODg4QVwiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjE5LjhcIj48L3JlY3Q+PHJlY3QgeD1cIjEzXCIgeT1cIjBcIiBmaWxsPVwiIzg5ODg4QVwiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjE5LjhcIj48L3JlY3Q+PC9zdmc+PC9kaXY+PGRpdiBjbGFzcz1cImhlYXItdGV4dFwiPkhlYXIgTW9yZSBGcm9tPGJyPicgK1xuKChfX3QgPSAoZGV0YWlsLmNyZWF0b3IpKSA9PSBudWxsID8gJycgOiBfX3QpICtcbic8L2Rpdj48Y2FudmFzIGlkPVwiY2lyY2xlLXByb2dyZXNzXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIj48L2NhbnZhcz48L2Rpdj48YXVkaW8gY2xhc3M9XCJpbmZvLWF1ZGlvXCI+PHNvdXJjZSBzcmM9XCInICtcbigoX190ID0gKGRldGFpbC5hdWRpb0RldGFpbCkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiIHR5cGU9XCJhdWRpby9tcGVnXCI+PC9zb3VyY2U+PC9hdWRpbz48L2Rpdj48ZGl2IGNsYXNzPVwiY2xvc2VcIj5YPC9kaXY+PC9kaXY+JztcblxufVxucmV0dXJuIF9fcFxufTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxkaXYgY2xhc3M9XCJmb290ZXItaW5uZXJcIj48L2Rpdj4nO1xuXG59XG5yZXR1cm4gX19wXG59OyIsInZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xub2JqIHx8IChvYmogPSB7fSk7XG52YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG53aXRoIChvYmopIHtcbl9fcCArPSAnPGltZyBjbGFzcz1cImZpbG0taWNvblwiIHNyYz1cIicgK1xuKChfX3QgPSAoZ2FsbGVyeUl0ZW0uaW1nKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCI+PGRpdiBjbGFzcz1cImctaXRlbS1pbm5lclwiPjxoMSBjbGFzcz1cImhlYWRsaW5lXCI+JyArXG4oKF9fdCA9IChnYWxsZXJ5SXRlbS50aXRsZSkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJzwvaDE+PHAgY2xhc3M9XCJkZXNjcmlwdGlvblwiPicgK1xuKChfX3QgPSAoZ2FsbGVyeUl0ZW0uaW5mbykpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJzwvcD48L2Rpdj4nO1xuXG59XG5yZXR1cm4gX19wXG59OyIsInZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xub2JqIHx8IChvYmogPSB7fSk7XG52YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG53aXRoIChvYmopIHtcbl9fcCArPSAnPGRpdiBjbGFzcz1cImctaXRlbS1pbm5lclwiPjxkaXYgY2xhc3M9XCJzaWduYXR1cmVcIj48Y2FudmFzIGNsYXNzPVwic2lnXCI+PC9jYW52YXM+PGRpdiBjbGFzcz1cInVuZGVybGluZVwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ0aXRsZVwiPicgK1xuKChfX3QgPSAoZ2FsbGVyeUl0ZW0udGl0bGUpKSA9PSBudWxsID8gJycgOiBfX3QpICtcbic8L2Rpdj48ZGl2IGNsYXNzPVwiYnRuLXdyYXBwZXJcIj48ZGl2IGNsYXNzPVwidmlldy12aWRlbyBidG4tY2lyY2xlIHRya1wiIGRhdGEtY2F0ZWdvcnk9XCJkZXNrdG9wOnZpZXczNjBcIiBkYXRhLWxhYmVsPVwiJyArXG4oKF9fdCA9IChnYWxsZXJ5SXRlbS5sYWJlbCkpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiPjxkaXYgY2xhc3M9XCJ2aWV3LXB1bHNlXCI+PC9kaXY+PGRpdiBjbGFzcz1cInZpZXctbGVmdFwiPjxkaXYgY2xhc3M9XCJ2aWV3LWJvcmRlclwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ2aWV3LXJpZ2h0XCI+PGRpdiBjbGFzcz1cInZpZXctYm9yZGVyXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cInZpZXctdGV4dFwiPlZpZXc8YnI+Jm5ic3A7MzYwJmRlZzs8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwidmlldy1saW5rIGJ0bi1jaXJjbGUgdHJrXCIgZGF0YS1jYXRlZ29yeT1cImRlc2t0b3A6bGVhcm4tbW9yZVwiIGRhdGEtbGFiZWw9XCInICtcbigoX190ID0gKGdhbGxlcnlJdGVtLmxhYmVsKSkgPT0gbnVsbCA/ICcnIDogX190KSArXG4nXCI+PGRpdiBjbGFzcz1cInZpZXctcHVsc2VcIj48L2Rpdj48ZGl2IGNsYXNzPVwidmlldy1sZWZ0XCI+PGRpdiBjbGFzcz1cInZpZXctYm9yZGVyXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cInZpZXctcmlnaHRcIj48ZGl2IGNsYXNzPVwidmlldy1ib3JkZXJcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwidmlldy10ZXh0XCI+TGVhcm48YnI+TW9yZTwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjxpbWcgY2xhc3M9XCJmaWxtLWljb25cIiBzcmM9XCInICtcbigoX190ID0gKGdhbGxlcnlJdGVtLmltZykpID09IG51bGwgPyAnJyA6IF9fdCkgK1xuJ1wiPic7XG5cbn1cbnJldHVybiBfX3Bcbn07IiwidmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG5vYmogfHwgKG9iaiA9IHt9KTtcbnZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbndpdGggKG9iaikge1xuX19wICs9ICc8ZGl2IGNsYXNzPVwiZ2FsbGVyeS1pdGVtc1wiPjxkaXYgY2xhc3M9XCJnYWxsZXJ5LWxpbmVcIj48L2Rpdj48L2Rpdj4nO1xuXG59XG5yZXR1cm4gX19wXG59OyIsInZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xub2JqIHx8IChvYmogPSB7fSk7XG52YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG53aXRoIChvYmopIHtcbl9fcCArPSAnPGRpdiBjbGFzcz1cImJvdHRvbS1uYXZcIj48ZGl2IGNsYXNzPVwiYmFyLWV4dHJhXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdHRvbS1uYXYtd3JhcHBlclwiPjxkaXYgY2xhc3M9XCJuYXYtY29udGFpbmVyXCI+PGRpdiBjbGFzcz1cIm5hdjAgbmF2LWl0ZW0gdHJrXCIgZGF0YS1pZD1cIjBcIiBkYXRhLWNhdGVnb3J5PVwiZGVza3RvcDpuYXZcIiBkYXRhLWxhYmVsPVwiaG9tZVwiPjxkaXYgY2xhc3M9XCJiYXItYm90dG9tXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJhci1sZWZ0XCI+PC9kaXY+PGRpdiBjbGFzcz1cIm51bVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJuYW1lXCI+PGRpdiBjbGFzcz1cImZpcnN0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImxhc3RcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwibnVtYmlnXCI+PC9kaXY+PGRpdiBjbGFzcz1cImljb25cIj48c3ZnIGNsYXNzPVwiY2JcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Ym94PVwiMCAwIDQ1LjkgMjUuNVwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA0NS45IDI1LjVcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHByZXNlcnZlYXNwZWN0cmF0aW89XCJ4TWlkWU1pZCBtZWV0XCI+PHBhdGggZD1cIk00My42LDIuMmgtMC44VjEuNGMwLTAuOC0wLjYtMS40LTEuNC0xLjRINi42QzUuOSwwLDUuMiwwLjYsNS4yLDEuNHYwLjlINC41Yy0xLjMsMC0yLjMsMS0yLjMsMi4zdjIuN0gxLjRcXG5cXHRDMC42LDcuMywwLDcuOSwwLDguN3YzLjljMCwwLjgsMC42LDEuNCwxLjQsMS40bDAuOCwwdjkuM2MwLDEuMywxLDIuMywyLjMsMi4zaDE0LjRjMSwwLDEuOC0wLjYsMi4yLTEuNWwwLjktMi4zYzAuOC0yLDMuNi0yLDQuMywwXFxuXFx0bDAuOSwyLjNjMC4zLDAuOSwxLjIsMS41LDIuMiwxLjVoMTQuNGMxLjMsMCwyLjMtMSwyLjMtMi4zVjQuNkM0NS45LDMuMyw0NC45LDIuMiw0My42LDIuMnogTTEzLjcsMTljLTIuOCwwLTUuMS0yLjMtNS4xLTUuMVxcblxcdHMyLjMtNS4xLDUuMS01LjFzNS4xLDIuMyw1LjEsNS4xUzE2LjUsMTksMTMuNywxOXogTTM0LjQsMTljLTIuOCwwLTUuMS0yLjMtNS4xLTUuMXMyLjMtNS4xLDUuMS01LjFjMi44LDAsNS4xLDIuMyw1LjEsNS4xXFxuXFx0UzM3LjMsMTksMzQuNCwxOXpcIj48L3BhdGg+PC9zdmc+PC9kaXY+PGRpdiBjbGFzcz1cImljb25iaWdcIj48c3ZnIGNsYXNzPVwiY2JcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Ym94PVwiMCAwIDQ1LjkgMjUuNVwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA0NS45IDI1LjVcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHByZXNlcnZlYXNwZWN0cmF0aW89XCJ4TWlkWU1pZCBtZWV0XCI+PHBhdGggZD1cIk00My42LDIuMmgtMC44VjEuNGMwLTAuOC0wLjYtMS40LTEuNC0xLjRINi42QzUuOSwwLDUuMiwwLjYsNS4yLDEuNHYwLjlINC41Yy0xLjMsMC0yLjMsMS0yLjMsMi4zdjIuN0gxLjRcXG5cXHRDMC42LDcuMywwLDcuOSwwLDguN3YzLjljMCwwLjgsMC42LDEuNCwxLjQsMS40bDAuOCwwdjkuM2MwLDEuMywxLDIuMywyLjMsMi4zaDE0LjRjMSwwLDEuOC0wLjYsMi4yLTEuNWwwLjktMi4zYzAuOC0yLDMuNi0yLDQuMywwXFxuXFx0bDAuOSwyLjNjMC4zLDAuOSwxLjIsMS41LDIuMiwxLjVoMTQuNGMxLjMsMCwyLjMtMSwyLjMtMi4zVjQuNkM0NS45LDMuMyw0NC45LDIuMiw0My42LDIuMnogTTEzLjcsMTljLTIuOCwwLTUuMS0yLjMtNS4xLTUuMVxcblxcdHMyLjMtNS4xLDUuMS01LjFzNS4xLDIuMyw1LjEsNS4xUzE2LjUsMTksMTMuNywxOXogTTM0LjQsMTljLTIuOCwwLTUuMS0yLjMtNS4xLTUuMXMyLjMtNS4xLDUuMS01LjFjMi44LDAsNS4xLDIuMyw1LjEsNS4xXFxuXFx0UzM3LjMsMTksMzQuNCwxOXpcIj48L3BhdGg+PC9zdmc+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIm5hdjEgbmF2LWl0ZW0gdHJrXCIgZGF0YS1jYXRlZ29yeT1cImRlc2t0b3A6bmF2XCIgZGF0YS1sYWJlbD1cImpvYW5uYS1kZWxhbmVcIiBkYXRhLWlkPVwiMVwiPjxkaXYgY2xhc3M9XCJiYXItYm90dG9tXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJhci1sZWZ0XCI+PC9kaXY+PGRpdiBjbGFzcz1cIm51bVwiPjxkaXYgY2xhc3M9XCJudW1iZXIxXCI+MDwvZGl2PjxkaXYgY2xhc3M9XCJudW1iZXIyXCI+MTwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJudW1iaWdcIj48ZGl2IGNsYXNzPVwibnVtYmVyMVwiPjA8L2Rpdj48ZGl2IGNsYXNzPVwibnVtYmVyMlwiPjE8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwibmFtZVwiPjxkaXYgY2xhc3M9XCJmaXJzdFwiPkpvYW5uYTwvZGl2PjxkaXYgY2xhc3M9XCJsYXN0XCI+RGVMYW5lPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIm5hdjIgbmF2LWl0ZW0gdHJrXCIgZGF0YS1jYXRlZ29yeT1cImRlc2t0b3A6bmF2XCIgZGF0YS1sYWJlbD1cImtpbmctdHVmZlwiIGRhdGEtaWQ9XCIyXCI+PGRpdiBjbGFzcz1cImJhci1ib3R0b21cIj48L2Rpdj48ZGl2IGNsYXNzPVwiYmFyLWxlZnRcIj48L2Rpdj48ZGl2IGNsYXNzPVwibnVtXCI+PGRpdiBjbGFzcz1cIm51bWJlcjFcIj4wPC9kaXY+PGRpdiBjbGFzcz1cIm51bWJlcjJcIj4yPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIm51bWJpZ1wiPjxkaXYgY2xhc3M9XCJudW1iZXIxXCI+MDwvZGl2PjxkaXYgY2xhc3M9XCJudW1iZXIyXCI+MjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJuYW1lXCI+PGRpdiBjbGFzcz1cImZpcnN0XCI+S2luZzwvZGl2PjxkaXYgY2xhc3M9XCJsYXN0XCI+VHVmZjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJuYXYzIG5hdi1pdGVtIHRya1wiIGRhdGEtY2F0ZWdvcnk9XCJkZXNrdG9wOm5hdlwiIGRhdGEtbGFiZWw9XCJ0aG9tYXMtbWlkbGFuZVwiIGRhdGEtaWQ9XCIzXCI+PGRpdiBjbGFzcz1cImJhci1ib3R0b21cIj48L2Rpdj48ZGl2IGNsYXNzPVwiYmFyLWxlZnRcIj48L2Rpdj48ZGl2IGNsYXNzPVwibnVtXCI+PGRpdiBjbGFzcz1cIm51bWJlcjFcIj4wPC9kaXY+PGRpdiBjbGFzcz1cIm51bWJlcjJcIj4zPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIm51bWJpZ1wiPjxkaXYgY2xhc3M9XCJudW1iZXIxXCI+MDwvZGl2PjxkaXYgY2xhc3M9XCJudW1iZXIyXCI+MzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJuYW1lXCI+PGRpdiBjbGFzcz1cImZpcnN0XCI+VGhvbWFzPC9kaXY+PGRpdiBjbGFzcz1cImxhc3RcIj5NaWRsYW5lPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIm5hdjQgbmF2LWl0ZW0gdHJrXCIgZGF0YS1jYXRlZ29yeT1cImRlc2t0b3A6bmF2XCIgZGF0YS1sYWJlbD1cInJvbi1lbmdsaXNoXCIgZGF0YS1pZD1cIjRcIj48ZGl2IGNsYXNzPVwiYmFyLWJvdHRvbVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJiYXItbGVmdFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJiYXItbGVmdFwiIHN0eWxlPVwibGVmdDogYXV0bzsgcmlnaHQ6IDBcIj48L2Rpdj48ZGl2IGNsYXNzPVwibnVtXCI+PGRpdiBjbGFzcz1cIm51bWJlcjFcIj4wPC9kaXY+PGRpdiBjbGFzcz1cIm51bWJlcjJcIj40PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIm51bWJpZ1wiPjxkaXYgY2xhc3M9XCJudW1iZXIxXCI+MDwvZGl2PjxkaXYgY2xhc3M9XCJudW1iZXIyXCI+NDwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJuYW1lXCI+PGRpdiBjbGFzcz1cImZpcnN0XCI+Um9uPC9kaXY+PGRpdiBjbGFzcz1cImxhc3RcIj5FbmdsaXNoPC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImRvd25sb2FkLWxpbmtzXCI+PGEgaHJlZj1cImh0dHBzOi8vcGxheS5nb29nbGUuY29tL3N0b3JlL2FwcHMvZGV0YWlscz9pZD1jb20uY29udmVyc2UuaW50aGVpcmNodWNrc1wiIGNsYXNzPVwiZ29vZ2xlLXBsYXkgYW5pbS1kbCB0cmtcIiB0YXJnZXQ9XCJfYmxhbmtcIiBkYXRhLWNhdGVnb3J5PVwiZGVza3RvcDpuYXY6ZG93bmxvYWRzXCIgZGF0YS1sYWJlbD1cImFuZHJvaWQtYXBwXCI+R29vZ2xlIFBsYXk8L2E+IDxhIGhyZWY9XCJodHRwczovL2l0dW5lcy5hcHBsZS5jb20vdXMvYXBwL2luLXRoZWlyLWNodWNrcy0zNjAtZXhwZXJpZW5jZS9pZDk2ODg0NjkxNz9tdD04XCIgY2xhc3M9XCJhcHAtc3RvcmUgYW5pbS1kbCB0cmtcIiB0YXJnZXQ9XCJfYmxhbmtcIiBkYXRhLWNhdGVnb3J5PVwiZGVza3RvcDpuYXY6ZG93bmxvYWRzXCIgZGF0YS1sYWJlbD1cImlvcy1hcHBcIj5BcHAgU3RvcmU8L2E+PHA+R2V0IHRoZSAzNjAmZGVnOyBBcHAgRXhwZXJpZW5jZTwvcD48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiYm90dG9tLW5hdi1jb3ZlclwiPjwvZGl2Pic7XG5cbn1cbnJldHVybiBfX3Bcbn07IiwidmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG5vYmogfHwgKG9iaiA9IHt9KTtcbnZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbndpdGggKG9iaikge1xuX19wICs9ICc8ZGl2IGNsYXNzPVwiZ2FsbGVyeS1pbm5lclwiPjwvZGl2PjxkaXYgY2xhc3M9XCJyZXNpemUteW91ci1icm93c2VyXCI+PGRpdiBjbGFzcz1cInJlc2l6ZS10ZXh0XCI+PHA+UGxlYXNlIGV4cGFuZCB5b3VyIHdpbmRvdyB0byBnZXQgdGhlIGZ1bGwgZXhwZXJpZW5jZSBvciBqdXN0IGRvd25sb2FkIHRoZSBhcHAuPC9wPjxhIGhyZWY9XCJodHRwczovL3BsYXkuZ29vZ2xlLmNvbS9zdG9yZS9hcHBzL2RldGFpbHM/aWQ9Y29tLmNvbnZlcnNlLmludGhlaXJjaHVja3NcIiBjbGFzcz1cImdvb2dsZS1wbGF5XCI+R29vZ2xlIFBsYXk8L2E+IDxhIGhyZWY9XCJodHRwczovL2l0dW5lcy5hcHBsZS5jb20vdXMvYXBwL2luLXRoZWlyLWNodWNrcy0zNjAtZXhwZXJpZW5jZS9pZDk2ODg0NjkxNz9tdD04XCIgY2xhc3M9XCJhcHAtc3RvcmVcIj5BcHAgU3RvcmU8L2E+PC9kaXY+PC9kaXY+JztcblxufVxucmV0dXJuIF9fcFxufTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxkaXYgY2xhc3M9XCJoZWFkZXItaW5uZXJcIj48ZGl2IGNsYXNzPVwibWFpbi1oZWFkZXJcIj48L2Rpdj48ZGl2IGNsYXNzPVwic3ViLWhlYWRlclwiPjwvZGl2PjwvZGl2Pic7XG5cbn1cbnJldHVybiBfX3Bcbn07IiwidmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG5vYmogfHwgKG9iaiA9IHt9KTtcbnZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbndpdGggKG9iaikge1xuX19wICs9ICc8ZGl2IGNsYXNzPVwiaW50cm8taW5uZXJcIj48ZGl2IGlkPVwiaW50cm8tcGFuZWxcIj48aDE+SW4gVGhlaXIgQ2h1Y2tzPC9oMT48aDI+PHNwYW4+QSAzNjAmZGVnOyBFeHBlcmllbmNlPC9zcGFuPjwvaDI+PGRpdiBjbGFzcz1cImludHJvLXNob2VzXCI+PGltZyBjbGFzcz1cImludHJvLXNob2VcIiBzcmM9XCJpbWFnZXMvSm9hbm5hLnBuZ1wiPiA8aW1nIGNsYXNzPVwiaW50cm8tc2hvZVwiIHNyYz1cImltYWdlcy9LaW5nLnBuZ1wiPiA8aW1nIGNsYXNzPVwiaW50cm8tc2hvZVwiIHNyYz1cImltYWdlcy9UaG9tYXMucG5nXCI+IDxpbWcgY2xhc3M9XCJpbnRyby1zaG9lXCIgc3JjPVwiaW1hZ2VzL1Jvbi5wbmdcIj48L2Rpdj48aDMgY2xhc3M9XCJ0eXBld3JpdGVyXCI+RXhwZXJpZW5jZSBldmVyeSBzY3VmZiwgc3RhaW48YnI+YW5kIHJpcCB0aHJvdWdoIHRoZWlyIGV5ZXMuPC9oMz48L2Rpdj48ZGl2IGlkPVwibG9hZGVyLXBhbmVsXCI+PGRpdiBjbGFzcz1cImxvYWRlci1sb2dvXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJpbWFnZXMvQ29udmVyc2VfTG9nb18wNC5wbmdcIj48ZGl2IGNsYXNzPVwiZ3JlZXRpbmdcIj5NYWRlIGJ5IHlvdTwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJsb2FkZXItc3ByaXRlXCI+PGRpdiBjbGFzcz1cImxvYWRlci1wZXJjZW50YWdlXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+JztcblxufVxucmV0dXJuIF9fcFxufTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxkaXYgY2xhc3M9XCJtb2JpbGUtZ2FsbGVyeVwiPjxkaXYgZGF0YS1jYXRlZ29yeT1cIm1vYmlsZTpnYWxsZXJ5XCIgZGF0YS1sYWJlbD1cImpvYW5uYS1kZWxhbmVcIiBjbGFzcz1cInRyayBzbGlkZXItY29udGFpbmVyXCI+PGRpdiBjbGFzcz1cInNsaWRlci1pbWcgam9hbm5hXCI+PC9kaXY+PHVsIGNsYXNzPVwiY2FwdGlvbiBjdXJyZW50VGV4dFwiPjxsaT5TdGVwIGludG8gYSB3b3JsZCBvZiB6b21iaWVzPC9saT48bGk+d2l0aCBhY3RyZXNzIEpvYW5uYSBEZUxhbmU8L2xpPjwvdWw+PC9kaXY+PGRpdiBkYXRhLWNhdGVnb3J5PVwibW9iaWxlOmdhbGxlcnlcIiBkYXRhLWxhYmVsPVwia2luZy10dWZmXCIgY2xhc3M9XCJ0cmsgc2xpZGVyLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJzbGlkZXItaW1nIGtpbmdcIj48L2Rpdj48dWwgY2xhc3M9XCJjYXB0aW9uIG5leHRUZXh0XCI+PGxpPlN0ZXAgaW50byB0aGUgcHN5Y2hlZGVsaWMgbWluZDwvbGk+PGxpPm9mIG11c2ljaWFuIEtpbmcgVHVmZjwvbGk+PC91bD48L2Rpdj48ZGl2IGRhdGEtY2F0ZWdvcnk9XCJtb2JpbGU6Z2FsbGVyeVwiIGRhdGEtbGFiZWw9XCJ0aG9tYXMtbWlkbGFuZVwiIGNsYXNzPVwidHJrIHNsaWRlci1jb250YWluZXJcIj48ZGl2IGNsYXNzPVwic2xpZGVyLWltZyB0aG9tYXNcIj48L2Rpdj48dWwgY2xhc3M9XCJjYXB0aW9uXCI+PGxpPlN0ZXAgaW50byBwbGFjZXMgdW5rbm93biB3aXRoPC9saT48bGk+dXJiYW4gZXhwbG9yZXIgVGhvbWFzIE1pZGxhbmU8L2xpPjwvdWw+PC9kaXY+PGRpdiBkYXRhLWNhdGVnb3J5PVwibW9iaWxlOmdhbGxlcnlcIiBkYXRhLWxhYmVsPVwicm9uLWVuZ2xpc2hcIiBjbGFzcz1cInRyayBzbGlkZXItY29udGFpbmVyXCI+PGRpdiBjbGFzcz1cInNsaWRlci1pbWcgcm9uXCI+PC9kaXY+PHVsIGNsYXNzPVwiY2FwdGlvblwiPjxsaT5TdGVwIG9udG8gYW4gTEEgc2t5c2NhcGVyPC9saT48bGk+d2l0aCBhcnRpc3QgUm9uIEVuZ2xpc2g8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGltZyBjbGFzcz1cImNhcmRib2FyZC1nb2dnbGVzXCIgc3JjPVwiLi9pbWFnZXMvY2FyZGJvYXJkLW1vYmlsZS5wbmdcIj48cCBjbGFzcz1cImJ0bi1jYXB0aW9uXCI+R2V0IHRoZSAzNjAmZGVnIGFwcCBleHBlcmllbmNlOjwvcD48ZGl2IGNsYXNzPVwiZG93bmxvYWQtbGlua3NcIj48c3ZnIGRhdGEtY2F0ZWdvcnk9XCJtb2JpbGU6YnV0dG9uOmFuZHJvaWQtYXBwXCIgY2xhc3M9XCJhbmRyb2lkLWFwcCB0cmtcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjEzNy42cHhcIiBoZWlnaHQ9XCI0NS45cHhcIiB2aWV3Ym94PVwiMCAwIDEzNy42IDQ1LjlcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMTM3LjYgNDUuOVwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGRlZnM+PC9kZWZzPjxnPjxwYXRoIHN0cm9rZT1cIiNGRkZGRkZcIiBzdHJva2Utd2lkdGg9XCIxLjVcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCIgZD1cIk0xMjUuMiwzNi4xYzAsMy41LTIuNiw1LjctNi4xLDUuN0gxNi4zXFxuXFx0XFx0XFx0Yy0zLjUsMC02LjMtMi44LTYuMy02LjNWOC43YzAtMy41LDIuOC02LjMsNi4zLTYuM2gxMDIuOGMzLjUsMCw2LjEsMi44LDYuMSw2LjNWMzYuMXpcIj48L3BhdGg+PHBhdGggZD1cIk0xMzcuNiw0Mi43YzAsMS44LTEuNCwzLjItMy4yLDMuMkgzLjJjLTEuOCwwLTMuMi0xLjQtMy4yLTMuMlYzLjJDMCwxLjQsMS40LDAsMy4yLDBoMTMxLjJjMS44LDAsMy4yLDEuNCwzLjIsMy4yVjQyLjd6XCI+PC9wYXRoPjxnPjxnPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk04OC43LDMwLjdsLTAuOSwwLjhjLTAuMiwwLjEtMC40LDAuMi0wLjYsMC4zYy0wLjYsMC4zLTEuMiwwLjMtMS44LDAuM2MtMC42LDAtMS41LDAtMi40LTAuN1xcblxcdFxcdFxcdFxcdFxcdGMtMS4zLTAuOS0xLjgtMi41LTEuOC0zLjhjMC0yLjgsMi4zLTQuMiw0LjEtNC4yYzAuNywwLDEuMywwLjIsMS45LDAuNWMwLjksMC42LDEuMSwxLjQsMS4zLDEuOGwtNC4zLDEuN2wtMS40LDAuMVxcblxcdFxcdFxcdFxcdFxcdGMwLjUsMi4zLDIsMy42LDMuNywzLjZDODcuNSwzMS4yLDg4LjEsMzEsODguNywzMC43Qzg4LjcsMzAuNyw4OC44LDMwLjYsODguNywzMC43eiBNODYuMSwyNi4xYzAuMy0wLjEsMC41LTAuMiwwLjUtMC41XFxuXFx0XFx0XFx0XFx0XFx0YzAtMC43LTAuOC0xLjYtMS44LTEuNmMtMC43LDAtMi4xLDAuNi0yLjEsMi41YzAsMC4zLDAsMC42LDAuMSwxTDg2LjEsMjYuMXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTc5LjgsMzAuNWMwLDAuNywwLjEsMC44LDAuNywwLjljMC4zLDAsMC42LDAuMSwwLjksMC4xbC0wLjcsMC40aC0zLjJjMC40LTAuNSwwLjUtMC42LDAuNS0xdi0wLjRcXG5cXHRcXHRcXHRcXHRcXHRsMC0xMC44aC0xLjRsMS40LTAuN2gyLjZjLTAuNiwwLjMtMC43LDAuNS0wLjgsMS4yTDc5LjgsMzAuNXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTc0LjksMjQuNGMwLjQsMC4zLDEuMywxLjEsMS4zLDIuNGMwLDEuMy0wLjgsMi0xLjUsMi42Yy0wLjIsMC4yLTAuNSwwLjUtMC41LDAuOWMwLDAuNCwwLjMsMC42LDAuNSwwLjhcXG5cXHRcXHRcXHRcXHRcXHRsMC43LDAuNWMwLjgsMC43LDEuNSwxLjMsMS41LDIuNWMwLDEuNy0xLjYsMy40LTQuOCwzLjRjLTIuNiwwLTMuOS0xLjItMy45LTIuNmMwLTAuNywwLjMtMS42LDEuNC0yLjJjMS4xLTAuNywyLjYtMC44LDMuNS0wLjhcXG5cXHRcXHRcXHRcXHRcXHRjLTAuMy0wLjMtMC41LTAuNy0wLjUtMS4yYzAtMC4zLDAuMS0wLjUsMC4yLTAuN2MtMC4yLDAtMC40LDAtMC42LDBjLTEuOSwwLTMtMS40LTMtMi44YzAtMC44LDAuNC0xLjgsMS4yLTIuNFxcblxcdFxcdFxcdFxcdFxcdGMxLTAuOCwyLjMtMSwzLjItMWgzLjdMNzYsMjQuNEg3NC45eiBNNzMuNiwzMi40Yy0wLjEsMC0wLjIsMC0wLjQsMGMtMC4yLDAtMS4xLDAtMS45LDAuM2MtMC40LDAuMS0xLjYsMC42LTEuNiwxLjlcXG5cXHRcXHRcXHRcXHRcXHRjMCwxLjMsMS4yLDIuMiwzLjIsMi4yYzEuNywwLDIuNy0wLjgsMi43LTJDNzUuNiwzMy45LDc1LDMzLjQsNzMuNiwzMi40eiBNNzQuMSwyOWMwLjQtMC40LDAuNS0xLDAuNS0xLjNjMC0xLjMtMC44LTMuMy0yLjMtMy4zXFxuXFx0XFx0XFx0XFx0XFx0Yy0wLjUsMC0xLDAuMi0xLjMsMC42Yy0wLjMsMC40LTAuNCwwLjktMC40LDEuM2MwLDEuMiwwLjcsMy4yLDIuMywzLjJDNzMuMywyOS41LDczLjgsMjkuMiw3NC4xLDI5elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNjMuNywzMi4xYy0yLjksMC00LjQtMi4yLTQuNC00LjNjMC0yLjQsMS45LTQuNCw0LjctNC40YzIuNywwLDQuMywyLjEsNC4zLDQuM1xcblxcdFxcdFxcdFxcdFxcdEM2OC4zLDI5LjksNjYuNiwzMi4xLDYzLjcsMzIuMXogTTY1LjksMzAuN2MwLjQtMC42LDAuNS0xLjMsMC41LTJjMC0xLjYtMC44LTQuNi0zLTQuNmMtMC42LDAtMS4yLDAuMi0xLjYsMC42XFxuXFx0XFx0XFx0XFx0XFx0Yy0wLjcsMC42LTAuOCwxLjQtMC44LDIuMmMwLDEuOCwwLjksNC43LDMuMSw0LjdDNjQuOCwzMS42LDY1LjUsMzEuMyw2NS45LDMwLjd6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk01NCwzMi4xYy0yLjksMC00LjQtMi4yLTQuNC00LjNjMC0yLjQsMS45LTQuNCw0LjctNC40YzIuNywwLDQuMywyLjEsNC4zLDQuM0M1OC42LDI5LjksNTcsMzIuMSw1NCwzMi4xXFxuXFx0XFx0XFx0XFx0XFx0eiBNNTYuMywzMC43YzAuNC0wLjYsMC41LTEuMywwLjUtMmMwLTEuNi0wLjgtNC42LTMtNC42Yy0wLjYsMC0xLjIsMC4yLTEuNiwwLjZjLTAuNywwLjYtMC44LDEuNC0wLjgsMi4yYzAsMS44LDAuOSw0LjcsMy4xLDQuN1xcblxcdFxcdFxcdFxcdFxcdEM1NS4yLDMxLjYsNTUuOSwzMS4zLDU2LjMsMzAuN3pcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTQ4LjUsMzEuNWwtMi40LDAuNmMtMSwwLjItMS45LDAuMy0yLjgsMC4zYy00LjcsMC02LjUtMy40LTYuNS02LjFjMC0zLjMsMi41LTYuMyw2LjgtNi4zXFxuXFx0XFx0XFx0XFx0XFx0YzAuOSwwLDEuOCwwLjEsMi42LDAuNGMxLjMsMC40LDEuOSwwLjgsMi4yLDEuMWwtMS40LDEuM2wtMC42LDAuMWwwLjQtMC43Yy0wLjYtMC42LTEuNi0xLjYtMy42LTEuNmMtMi43LDAtNC43LDItNC43LDVcXG5cXHRcXHRcXHRcXHRcXHRjMCwzLjIsMi4zLDYuMiw2LDYuMmMxLjEsMCwxLjYtMC4yLDIuMi0wLjR2LTIuN2wtMi42LDAuMWwxLjQtMC43aDMuNmwtMC40LDAuNGMtMC4xLDAuMS0wLjEsMC4xLTAuMiwwLjNjMCwwLjIsMCwwLjYsMCwwLjhcXG5cXHRcXHRcXHRcXHRcXHRWMzEuNXpcIj48L3BhdGg+PC9nPjxnPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk05My45LDMwLjh2NC42SDkzVjIzLjdoMC45VjI1YzAuNi0wLjksMS43LTEuNSwyLjktMS41YzIuMywwLDMuOCwxLjcsMy44LDQuNGMwLDIuNy0xLjUsNC41LTMuOCw0LjVcXG5cXHRcXHRcXHRcXHRcXHRDOTUuNywzMi4zLDk0LjYsMzEuNyw5My45LDMwLjh6IE05OS43LDI3LjljMC0yLjEtMS4xLTMuNi0zLTMuNmMtMS4yLDAtMi4zLDAuOS0yLjgsMS43djMuOGMwLjUsMC44LDEuNiwxLjgsMi44LDEuOFxcblxcdFxcdFxcdFxcdFxcdEM5OC42LDMxLjUsOTkuNywyOS45LDk5LjcsMjcuOXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTEwMS45LDMyLjFWMjAuNGgwLjl2MTEuN0gxMDEuOXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTExMy4xLDM0LjZjMC4yLDAuMSwwLjUsMC4xLDAuNywwLjFjMC42LDAsMC45LTAuMiwxLjMtMWwwLjctMS41bC0zLjYtOC42aDFsMy4xLDcuNGwzLjEtNy40aDFMMTE2LDM0XFxuXFx0XFx0XFx0XFx0XFx0Yy0wLjUsMS4xLTEuMiwxLjYtMi4yLDEuNmMtMC4zLDAtMC43LTAuMS0wLjktMC4xTDExMy4xLDM0LjZ6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMTAuNCwzMi4xYy0wLjEtMC4zLTAuMS0wLjYtMC4xLTAuOGMwLTAuMiwwLTAuNCwwLTAuN2MtMC4zLDAuNS0wLjgsMC44LTEuMywxLjFcXG5cXHRcXHRcXHRcXHRcXHRjLTAuNiwwLjMtMS4xLDAuNS0xLjgsMC41Yy0wLjksMC0xLjYtMC4yLTIuMS0wLjdjLTAuNS0wLjQtMC43LTEtMC43LTEuOGMwLTAuOCwwLjQtMS40LDEuMS0xLjljMC43LTAuNSwxLjYtMC43LDIuOC0wLjdoMi4xXFxuXFx0XFx0XFx0XFx0XFx0di0xLjFjMC0wLjYtMC4yLTEuMS0wLjYtMS40Yy0wLjQtMC4zLTEtMC41LTEuOC0wLjVjLTAuNywwLTEuMiwwLjItMS43LDAuNWMtMC40LDAuMy0wLjYsMC43LTAuNiwxLjJoLTAuOWwwLDBcXG5cXHRcXHRcXHRcXHRcXHRjMC0wLjYsMC4zLTEuMiwwLjktMS43YzAuNi0wLjUsMS40LTAuNywyLjQtMC43YzEsMCwxLjgsMC4yLDIuNCwwLjdjMC42LDAuNSwwLjksMS4yLDAuOSwyLjF2NC4yYzAsMC4zLDAsMC42LDAuMSwwLjlcXG5cXHRcXHRcXHRcXHRcXHRjMCwwLjMsMC4xLDAuNiwwLjIsMC44SDExMC40eiBNMTA3LjIsMzEuNGMwLjgsMCwxLjMtMC4yLDEuOS0wLjVjMC42LTAuMywxLTAuOCwxLjItMS4zVjI4aC0yLjFjLTAuOCwwLTEuNSwwLjItMiwwLjVcXG5cXHRcXHRcXHRcXHRcXHRjLTAuNSwwLjQtMC44LDAuOC0wLjgsMS4zYzAsMC41LDAuMiwwLjksMC41LDEuMkMxMDYuMSwzMS4zLDEwNi42LDMxLjQsMTA3LjIsMzEuNHpcIj48L3BhdGg+PC9nPjwvZz48Zz48cG9seWdvbiBmaWxsPVwiI0YxRjJGMlwiIHBvaW50cz1cIjIwLjgsMjUuNCAyMy43LDIyLjQgMjMuNywyMi40IDIwLjgsMjUuNCAxMS40LDE2IDExLjQsMTYgMjAuOCwyNS40IDExLjQsMzQuOCAxMS40LDM0LjggXFxuXFx0XFx0XFx0XFx0MjAuOCwyNS40IDIzLjcsMjguMyAyMy43LDI4LjMgXFx0XFx0XCI+PC9wb2x5Z29uPjxwYXRoIGZpbGw9XCIjRjFGMkYyXCIgZD1cIk0yMy43LDIyLjRsLTExLjQtNi4zQzEyLDE2LDExLjcsMTUuOSwxMS40LDE2bDkuNCw5LjRMMjMuNywyMi40elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0YxRjJGMlwiIGQ9XCJNMjMuNywyOC4zbDMuOS0yLjFjMC44LTAuNCwwLjgtMS4xLDAtMS42bC0zLjktMi4ybC0yLjksMi45TDIzLjcsMjguM3pcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGMUYyRjJcIiBkPVwiTTExLjQsMTZjLTAuMywwLjEtMC42LDAuNS0wLjYsMWwwLDE2LjhjMCwwLjUsMC4yLDAuOSwwLjYsMWw5LjQtOS40TDExLjQsMTZ6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRjFGMkYyXCIgZD1cIk0xMS40LDM0LjhjMC4yLDAuMSwwLjUsMCwwLjktMC4xbDExLjQtNi4zbC0yLjktMi45TDExLjQsMzQuOHpcIj48L3BhdGg+PC9nPjxnPjxnPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk00MS45LDEzLjdsLTAuNC0xLjFoLTIuNmwtMC40LDEuMWgtMS4xbDIuMi01LjdoMS4zbDIuMiw1LjdINDEuOXogTTQwLjIsOC45bC0xLDIuN2gyLjFMNDAuMiw4Ljl6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk00Ny44LDEzLjdsLTMtNC4xdjQuMWgtMVY3LjloMWwyLjksNHYtNGgxdjUuN0g0Ny44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNTAuMiwxMy43VjcuOWgyLjFjMS44LDAsMywxLjIsMywyLjljMCwxLjctMS4yLDIuOS0zLDIuOUg1MC4yeiBNNTQuMywxMC44YzAtMS4xLTAuNy0yLTItMmgtMS4xdjRoMS4xXFxuXFx0XFx0XFx0XFx0XFx0QzUzLjYsMTIuOCw1NC4zLDExLjksNTQuMywxMC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNTkuOCwxMy43bC0xLjMtMi4xaC0xdjIuMWgtMVY3LjloMi41YzEuMSwwLDEuOSwwLjcsMS45LDEuOGMwLDEtMC43LDEuNi0xLjQsMS43bDEuNCwyLjJINTkuOHpcXG5cXHRcXHRcXHRcXHRcXHQgTTU5LjksOS43YzAtMC41LTAuNC0wLjktMS0wLjloLTEuNHYxLjhoMS40QzU5LjUsMTAuNiw1OS45LDEwLjMsNTkuOSw5Ljd6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk02MS45LDEwLjhjMC0xLjcsMS4yLTMsMi45LTNjMS43LDAsMi45LDEuMywyLjksM2MwLDEuNy0xLjIsMy0yLjksM0M2My4xLDEzLjgsNjEuOSwxMi41LDYxLjksMTAuOHpcXG5cXHRcXHRcXHRcXHRcXHQgTTY2LjcsMTAuOGMwLTEuMi0wLjctMi4xLTEuOS0yLjFjLTEuMiwwLTEuOSwwLjktMS45LDIuMWMwLDEuMiwwLjcsMi4xLDEuOSwyLjFDNjYsMTIuOSw2Ni43LDEyLDY2LjcsMTAuOHpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTY4LjksMTMuN1Y3LjloMXY1LjdINjguOXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTcxLjQsMTMuN1Y3LjloMi4xYzEuOCwwLDMsMS4yLDMsMi45YzAsMS43LTEuMiwyLjktMywyLjlINzEuNHogTTc1LjUsMTAuOGMwLTEuMS0wLjctMi0yLTJoLTEuMXY0aDEuMVxcblxcdFxcdFxcdFxcdFxcdEM3NC43LDEyLjgsNzUuNSwxMS45LDc1LjUsMTAuOHpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTg0LjEsMTMuN2wtMC40LTEuMWgtMi42bC0wLjQsMS4xaC0xLjFsMi4yLTUuN0g4M2wyLjIsNS43SDg0LjF6IE04Mi40LDguOWwtMSwyLjdoMi4xTDgyLjQsOC45elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNODYuMSwxMy43VjcuOWgyLjVjMS4yLDAsMS45LDAuOCwxLjksMS44YzAsMS0wLjcsMS44LTEuOSwxLjhoLTEuNXYyLjFIODYuMXogTTg5LjQsOS43XFxuXFx0XFx0XFx0XFx0XFx0YzAtMC41LTAuNC0wLjktMS0wLjloLTEuNHYxLjhoMS40Qzg5LDEwLjYsODkuNCwxMC4zLDg5LjQsOS43elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNOTEuNSwxMy43VjcuOUg5NGMxLjIsMCwxLjksMC44LDEuOSwxLjhjMCwxLTAuNywxLjgtMS45LDEuOGgtMS41djIuMUg5MS41eiBNOTQuOSw5LjdcXG5cXHRcXHRcXHRcXHRcXHRjMC0wLjUtMC40LTAuOS0xLTAuOWgtMS40djEuOGgxLjRDOTQuNSwxMC42LDk0LjksMTAuMyw5NC45LDkuN3pcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTk5LjEsMTAuOGMwLTEuNywxLjItMywyLjktM2MxLjcsMCwyLjksMS4zLDIuOSwzYzAsMS43LTEuMiwzLTIuOSwzQzEwMC4zLDEzLjgsOTkuMSwxMi41LDk5LjEsMTAuOHpcXG5cXHRcXHRcXHRcXHRcXHQgTTEwMy45LDEwLjhjMC0xLjItMC43LTIuMS0xLjktMi4xYy0xLjIsMC0xLjksMC45LTEuOSwyLjFjMCwxLjIsMC43LDIuMSwxLjksMi4xQzEwMy4yLDEyLjksMTAzLjksMTIsMTAzLjksMTAuOHpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTExMC4xLDEzLjdsLTMtNC4xdjQuMWgtMVY3LjloMWwyLjksNHYtNGgxdjUuN0gxMTAuMXpcIj48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+IDxzdmcgZGF0YS1jYXRlZ29yeT1cIm1vYmlsZTpidXR0b246aW9zLWFwcFwiIGNsYXNzPVwiaW9zLWFwcCB0cmtcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjEzNy42cHhcIiBoZWlnaHQ9XCI0NS40cHhcIiB2aWV3Ym94PVwiMCAwIDEzNy42IDQ1LjRcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMTM3LjYgNDUuNFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGRlZnM+PC9kZWZzPjxnPjxwYXRoIGQ9XCJNMTM3LjYsNDIuMmMwLDEuOC0xLjQsMy4yLTMuMiwzLjJIMy4yQzEuNCw0NS40LDAsNDQsMCw0Mi4ydi0zOUMwLDEuNCwxLjQsMCwzLjIsMGgxMzEuMmMxLjgsMCwzLjIsMS40LDMuMiwzLjJWNDIuMnpcIj48L3BhdGg+PGc+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTI2LjgsMjIuOGMwLTMuNiwyLjktNS4zLDMuMS01LjRjLTEuNy0yLjUtNC4zLTIuOC01LjItMi44Yy0yLjItMC4yLTQuMywxLjMtNS40LDEuM1xcblxcdFxcdFxcdGMtMS4xLDAtMi45LTEuMy00LjctMS4zYy0yLjQsMC00LjYsMS40LTUuOCwzLjZDNi4yLDIyLjUsOCwyOC45LDEwLjUsMzIuNWMxLjIsMS43LDIuNiwzLjcsNC41LDMuNmMxLjgtMC4xLDIuNS0xLjIsNC43LTEuMlxcblxcdFxcdFxcdGMyLjIsMCwyLjgsMS4yLDQuNywxLjFjMS45LDAsMy4yLTEuNyw0LjMtMy41YzEuNC0yLDItMy45LDItNEMzMC42LDI4LjUsMjYuOSwyNy4xLDI2LjgsMjIuOHpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTIzLjMsMTIuMmMxLTEuMiwxLjYtMi45LDEuNS00LjZjLTEuNCwwLjEtMy4yLDEtNC4yLDIuMmMtMC45LDEuMS0xLjcsMi44LTEuNSw0LjRcXG5cXHRcXHRcXHRDMjAuNiwxNC4zLDIyLjIsMTMuNCwyMy4zLDEyLjJ6XCI+PC9wYXRoPjwvZz48Zz48ZGVmcz48cGF0aCBpZD1cIlNWR0lEXzFfXCIgZD1cIk0xMzcuNiw0MS44YzAsMS44LTEuNCwzLjItMy4yLDMuMkgzLjJDMS40LDQ1LDAsNDMuNiwwLDQxLjhWMy42YzAtMS44LDEuNC0zLjIsMy4yLTMuMmgxMzEuMlxcblxcdFxcdFxcdFxcdGMxLjgsMCwzLjIsMS40LDMuMiwzLjJWNDEuOHpcIj48L3BhdGg+PC9kZWZzPjxjbGlwcGF0aCBpZD1cIlNWR0lEXzJfXCI+PHVzZSB4bGluazpocmVmPVwiI1NWR0lEXzFfXCIgb3ZlcmZsb3c9XCJ2aXNpYmxlXCI+PC9jbGlwcGF0aD48L2c+PGc+PGc+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTUyLjIsMzVoLTIuNWwtMS40LTQuNGgtNC44TDQyLjEsMzVoLTIuNWw0LjgtMTQuOGgzTDUyLjIsMzV6IE00Ny45LDI4LjhsLTEuMy0zLjlcXG5cXHRcXHRcXHRcXHRjLTAuMS0wLjQtMC40LTEuMy0wLjctMi44aDBjLTAuMSwwLjYtMC40LDEuNi0wLjcsMi44bC0xLjIsMy45SDQ3Ljl6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk02NC41LDI5LjVjMCwxLjgtMC41LDMuMy0xLjUsNC4zYy0wLjksMC45LTIsMS40LTMuMywxLjRjLTEuNCwwLTIuNC0wLjUtMy4xLTEuNXY1LjZoLTIuNFYyNy44XFxuXFx0XFx0XFx0XFx0YzAtMS4xLDAtMi4zLTAuMS0zLjVoMi4xbDAuMSwxLjdoMGMwLjgtMS4zLDItMS45LDMuNi0xLjljMS4zLDAsMi4zLDAuNSwzLjIsMS41QzY0LjEsMjYuNSw2NC41LDI3LjksNjQuNSwyOS41eiBNNjIuMSwyOS42XFxuXFx0XFx0XFx0XFx0YzAtMS0wLjItMS45LTAuNy0yLjZjLTAuNS0wLjctMS4yLTEuMS0yLjEtMS4xYy0wLjYsMC0xLjEsMC4yLTEuNiwwLjZjLTAuNSwwLjQtMC44LDAuOS0wLjksMS41Yy0wLjEsMC4zLTAuMSwwLjUtMC4xLDAuN3YxLjhcXG5cXHRcXHRcXHRcXHRjMCwwLjgsMC4yLDEuNCwwLjcsMmMwLjUsMC41LDEuMSwwLjgsMS45LDAuOGMwLjksMCwxLjYtMC4zLDIuMS0xQzYxLjgsMzEuNiw2Mi4xLDMwLjcsNjIuMSwyOS42elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNzYuOCwyOS41YzAsMS44LTAuNSwzLjMtMS41LDQuM2MtMC45LDAuOS0yLDEuNC0zLjMsMS40Yy0xLjQsMC0yLjQtMC41LTMuMS0xLjV2NS42aC0yLjRWMjcuOFxcblxcdFxcdFxcdFxcdGMwLTEuMSwwLTIuMy0wLjEtMy41aDIuMWwwLjEsMS43aDBjMC44LTEuMywyLTEuOSwzLjYtMS45YzEuMywwLDIuMywwLjUsMy4yLDEuNUM3Ni40LDI2LjUsNzYuOCwyNy45LDc2LjgsMjkuNXogTTc0LjQsMjkuNlxcblxcdFxcdFxcdFxcdGMwLTEtMC4yLTEuOS0wLjctMi42Yy0wLjUtMC43LTEuMi0xLjEtMi4xLTEuMWMtMC42LDAtMS4xLDAuMi0xLjYsMC42Yy0wLjUsMC40LTAuOCwwLjktMC45LDEuNWMtMC4xLDAuMy0wLjEsMC41LTAuMSwwLjd2MS44XFxuXFx0XFx0XFx0XFx0YzAsMC44LDAuMiwxLjQsMC43LDJjMC41LDAuNSwxLjEsMC44LDEuOSwwLjhjMC45LDAsMS42LTAuMywyLjEtMUM3NC4xLDMxLjYsNzQuNCwzMC43LDc0LjQsMjkuNnpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTkwLjUsMzAuOGMwLDEuMy0wLjQsMi4zLTEuMywzLjFjLTEsMC45LTIuMywxLjMtNCwxLjNjLTEuNiwwLTIuOS0wLjMtMy44LTAuOWwwLjUtMlxcblxcdFxcdFxcdFxcdGMxLDAuNiwyLjIsMC45LDMuNCwwLjljMC45LDAsMS42LTAuMiwyLjEtMC42YzAuNS0wLjQsMC44LTAuOSwwLjgtMS42YzAtMC42LTAuMi0xLjEtMC42LTEuNWMtMC40LTAuNC0xLjEtMC44LTItMS4xXFxuXFx0XFx0XFx0XFx0Yy0yLjYtMS0zLjktMi40LTMuOS00LjNjMC0xLjIsMC41LTIuMiwxLjQtM2MwLjktMC44LDIuMS0xLjIsMy42LTEuMmMxLjQsMCwyLjUsMC4yLDMuNCwwLjdsLTAuNiwxLjljLTAuOC0wLjUtMS44LTAuNy0yLjktMC43XFxuXFx0XFx0XFx0XFx0Yy0wLjgsMC0xLjUsMC4yLTIsMC42Yy0wLjQsMC40LTAuNiwwLjgtMC42LDEuM2MwLDAuNiwwLjIsMS4xLDAuNywxLjVjMC40LDAuNCwxLjEsMC43LDIuMiwxLjFjMS4zLDAuNSwyLjIsMS4xLDIuOCwxLjhcXG5cXHRcXHRcXHRcXHRDOTAuMiwyOC45LDkwLjUsMjkuOCw5MC41LDMwLjh6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk05OC40LDI2aC0yLjZ2NS4yYzAsMS4zLDAuNSwyLDEuNCwyYzAuNCwwLDAuOCwwLDEuMS0wLjFsMC4xLDEuOGMtMC41LDAuMi0xLjEsMC4zLTEuOCwwLjNcXG5cXHRcXHRcXHRcXHRjLTAuOSwwLTEuNy0wLjMtMi4yLTAuOWMtMC41LTAuNi0wLjgtMS41LTAuOC0yLjlWMjZoLTEuNnYtMS44aDEuNnYtMmwyLjMtMC43djIuN2gyLjZWMjZ6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMTAuMiwyOS41YzAsMS42LTAuNSwzLTEuNCw0LjFjLTEsMS4xLTIuMywxLjYtMy45LDEuNmMtMS42LDAtMi44LTAuNS0zLjgtMS42Yy0wLjktMS0xLjQtMi40LTEuNC0zLjlcXG5cXHRcXHRcXHRcXHRjMC0xLjcsMC41LTMsMS40LTQuMWMxLTEuMSwyLjMtMS42LDMuOS0xLjZjMS42LDAsMi44LDAuNSwzLjgsMS42QzEwOS44LDI2LjYsMTEwLjIsMjcuOSwxMTAuMiwyOS41eiBNMTA3LjgsMjkuNlxcblxcdFxcdFxcdFxcdGMwLTEtMC4yLTEuOC0wLjYtMi41Yy0wLjUtMC44LTEuMi0xLjMtMi4xLTEuM2MtMSwwLTEuNywwLjQtMi4yLDEuM2MtMC40LDAuNy0wLjYsMS42LTAuNiwyLjZjMCwxLDAuMiwxLjgsMC42LDIuNVxcblxcdFxcdFxcdFxcdGMwLjUsMC44LDEuMiwxLjMsMi4yLDEuM2MwLjksMCwxLjYtMC40LDIuMS0xLjNDMTA3LjUsMzEuNCwxMDcuOCwzMC42LDEwNy44LDI5LjZ6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMTgsMjYuNGMtMC4yLDAtMC41LTAuMS0wLjctMC4xYy0wLjgsMC0xLjUsMC4zLTEuOSwwLjljLTAuNCwwLjYtMC42LDEuMy0wLjYsMi4xVjM1aC0yLjR2LTcuM1xcblxcdFxcdFxcdFxcdGMwLTEuMiwwLTIuNC0wLjEtMy40aDIuMWwwLjEsMmgwLjFjMC4zLTAuNywwLjYtMS4zLDEuMi0xLjdjMC41LTAuNCwxLjEtMC42LDEuNy0wLjZjMC4yLDAsMC40LDAsMC42LDBMMTE4LDI2LjRMMTE4LDI2LjR6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMjguNiwyOS4xYzAsMC40LDAsMC44LTAuMSwxLjFoLTcuMWMwLDEuMSwwLjQsMS45LDEsMi40YzAuNiwwLjUsMS40LDAuNywyLjMsMC43YzEuMSwwLDItMC4yLDIuOS0wLjVcXG5cXHRcXHRcXHRcXHRsMC40LDEuNmMtMSwwLjQtMi4yLDAuNy0zLjYsMC43Yy0xLjcsMC0zLTAuNS0zLjktMS41Yy0wLjktMS0xLjQtMi4zLTEuNC0zLjljMC0xLjYsMC40LTMsMS4zLTRjMC45LTEuMSwyLjItMS43LDMuNy0xLjdcXG5cXHRcXHRcXHRcXHRjMS41LDAsMi43LDAuNiwzLjUsMS43QzEyOC4zLDI2LjYsMTI4LjYsMjcuOCwxMjguNiwyOS4xeiBNMTI2LjMsMjguNWMwLTAuNy0wLjEtMS4zLTAuNS0xLjhjLTAuNC0wLjctMS0xLTEuOS0xXFxuXFx0XFx0XFx0XFx0Yy0wLjgsMC0xLjQsMC4zLTEuOSwxYy0wLjQsMC41LTAuNiwxLjEtMC43LDEuOEwxMjYuMywyOC41TDEyNi4zLDI4LjV6XCI+PC9wYXRoPjwvZz48Zz48Zz48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNDIuOCwxNC45Yy0wLjcsMC0xLjIsMC0xLjctMC4xVjcuNmMwLjYtMC4xLDEuMy0wLjIsMi0wLjJjMi43LDAsNCwxLjMsNCwzLjVcXG5cXHRcXHRcXHRcXHRcXHRDNDcuMSwxMy41LDQ1LjYsMTQuOSw0Mi44LDE0Ljl6IE00My4yLDguNGMtMC40LDAtMC43LDAtMC45LDAuMXY1LjVjMC4xLDAsMC40LDAsMC44LDBjMS44LDAsMi44LTEsMi44LTIuOVxcblxcdFxcdFxcdFxcdFxcdEM0NS44LDkuMyw0NC45LDguNCw0My4yLDguNHpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTUxLDE0LjljLTEuNSwwLTIuNS0xLjEtMi41LTIuN2MwLTEuNiwxLTIuOCwyLjYtMi44YzEuNSwwLDIuNSwxLjEsMi41LDIuN1xcblxcdFxcdFxcdFxcdFxcdEM1My42LDEzLjgsNTIuNSwxNC45LDUxLDE0Ljl6IE01MSwxMC4zYy0wLjgsMC0xLjQsMC44LTEuNCwxLjljMCwxLjEsMC42LDEuOSwxLjQsMS45YzAuOCwwLDEuNC0wLjgsMS40LTEuOVxcblxcdFxcdFxcdFxcdFxcdEM1Mi40LDExLjEsNTEuOCwxMC4zLDUxLDEwLjN6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk02Mi40LDkuNmwtMS42LDUuM2gtMS4xTDU5LDEyLjVjLTAuMi0wLjYtMC4zLTEuMS0wLjQtMS43aDBjLTAuMSwwLjYtMC4yLDEuMS0wLjQsMS43bC0wLjcsMi4zaC0xLjFcXG5cXHRcXHRcXHRcXHRcXHRsLTEuNS01LjNoMS4ybDAuNiwyLjVjMC4xLDAuNiwwLjMsMS4yLDAuNCwxLjdoMGMwLjEtMC40LDAuMi0xLDAuNC0xLjdsMC43LTIuNWgxbDAuNywyLjVjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdoMFxcblxcdFxcdFxcdFxcdFxcdGMwLjEtMC41LDAuMi0xLjEsMC40LTEuN2wwLjYtMi41TDYyLjQsOS42TDYyLjQsOS42elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNjguNCwxNC44aC0xLjJ2LTNjMC0wLjktMC40LTEuNC0xLjEtMS40Yy0wLjcsMC0xLjIsMC42LTEuMiwxLjN2My4xaC0xLjJ2LTMuOGMwLTAuNSwwLTEsMC0xLjVoMVxcblxcdFxcdFxcdFxcdFxcdGwwLjEsMC44aDBjMC4zLTAuNiwxLTAuOSwxLjctMC45YzEuMSwwLDEuOCwwLjgsMS44LDIuMkw2OC40LDE0LjhMNjguNCwxNC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNzEuNiwxNC44aC0xLjJWNy4xaDEuMlYxNC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNzUuOSwxNC45Yy0xLjUsMC0yLjUtMS4xLTIuNS0yLjdjMC0xLjYsMS0yLjgsMi42LTIuOGMxLjUsMCwyLjUsMS4xLDIuNSwyLjdcXG5cXHRcXHRcXHRcXHRcXHRDNzguNSwxMy44LDc3LjUsMTQuOSw3NS45LDE0Ljl6IE03NS45LDEwLjNjLTAuOCwwLTEuNCwwLjgtMS40LDEuOWMwLDEuMSwwLjYsMS45LDEuNCwxLjljMC44LDAsMS40LTAuOCwxLjQtMS45XFxuXFx0XFx0XFx0XFx0XFx0Qzc3LjMsMTEuMSw3Ni44LDEwLjMsNzUuOSwxMC4zelwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNODMuMSwxNC44TDgzLDE0LjJoMGMtMC40LDAuNS0wLjksMC43LTEuNSwwLjdjLTAuOSwwLTEuNi0wLjctMS42LTEuNWMwLTEuMywxLjEtMiwzLjEtMnYtMC4xXFxuXFx0XFx0XFx0XFx0XFx0YzAtMC43LTAuNC0xLTEuMS0xYy0wLjUsMC0xLDAuMS0xLjQsMC40bC0wLjItMC44YzAuNS0wLjMsMS4xLTAuNSwxLjgtMC41YzEuNCwwLDIuMSwwLjcsMi4xLDIuMnYxLjljMCwwLjUsMCwwLjksMC4xLDEuM1xcblxcdFxcdFxcdFxcdFxcdEw4My4xLDE0LjhMODMuMSwxNC44eiBNODMsMTIuMmMtMS4zLDAtMS45LDAuMy0xLjksMS4xYzAsMC42LDAuMywwLjgsMC44LDAuOGMwLjYsMCwxLjEtMC41LDEuMS0xLjFWMTIuMnpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTg5LjgsMTQuOEw4OS43LDE0aDBjLTAuMywwLjYtMC45LDEtMS43LDFjLTEuMywwLTIuMi0xLjEtMi4yLTIuN2MwLTEuNiwxLTIuOCwyLjMtMi44XFxuXFx0XFx0XFx0XFx0XFx0YzAuNywwLDEuMiwwLjIsMS41LDAuN2gwdi0zaDEuMnY2LjNjMCwwLjUsMCwxLDAsMS40SDg5Ljh6IE04OS42LDExLjdjMC0wLjctMC41LTEuNC0xLjItMS40Yy0wLjksMC0xLjQsMC44LTEuNCwxLjhcXG5cXHRcXHRcXHRcXHRcXHRjMCwxLjEsMC41LDEuOCwxLjQsMS44YzAuNywwLDEuMy0wLjYsMS4zLTEuNFYxMS43elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNOTguMiwxNC45Yy0xLjUsMC0yLjUtMS4xLTIuNS0yLjdjMC0xLjYsMS0yLjgsMi42LTIuOGMxLjUsMCwyLjUsMS4xLDIuNSwyLjdcXG5cXHRcXHRcXHRcXHRcXHRDMTAwLjgsMTMuOCw5OS44LDE0LjksOTguMiwxNC45eiBNOTguMiwxMC4zYy0wLjgsMC0xLjQsMC44LTEuNCwxLjljMCwxLjEsMC42LDEuOSwxLjQsMS45YzAuOCwwLDEuNC0wLjgsMS40LTEuOVxcblxcdFxcdFxcdFxcdFxcdEM5OS42LDExLjEsOTkuMSwxMC4zLDk4LjIsMTAuM3pcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTEwNy4xLDE0LjhoLTEuMnYtM2MwLTAuOS0wLjQtMS40LTEuMS0xLjRjLTAuNywwLTEuMiwwLjYtMS4yLDEuM3YzLjFoLTEuMnYtMy44YzAtMC41LDAtMSwwLTEuNWgxXFxuXFx0XFx0XFx0XFx0XFx0bDAuMSwwLjhoMGMwLjMtMC42LDEtMC45LDEuNy0wLjljMS4xLDAsMS44LDAuOCwxLjgsMi4yVjE0Ljh6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMTUsMTAuNGgtMS4zVjEzYzAsMC43LDAuMiwxLDAuNywxYzAuMiwwLDAuNCwwLDAuNS0wLjFsMCwwLjljLTAuMiwwLjEtMC41LDAuMS0wLjksMC4xXFxuXFx0XFx0XFx0XFx0XFx0Yy0wLjksMC0xLjUtMC41LTEuNS0xLjh2LTIuN2gtMC44VjkuNmgwLjh2LTFsMS4xLTAuM3YxLjNoMS4zVjEwLjR6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMjEuMSwxNC44SDEyMHYtM2MwLTAuOS0wLjQtMS40LTEuMS0xLjRjLTAuNiwwLTEuMiwwLjQtMS4yLDEuMnYzLjJoLTEuMlY3LjFoMS4ydjMuMmgwXFxuXFx0XFx0XFx0XFx0XFx0YzAuNC0wLjYsMC45LTAuOSwxLjYtMC45YzEuMSwwLDEuOCwwLjksMS44LDIuMlYxNC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNMTI3LjUsMTIuNUgxMjRjMCwxLDAuNywxLjYsMS43LDEuNmMwLjUsMCwxLTAuMSwxLjQtMC4ybDAuMiwwLjhjLTAuNSwwLjItMS4xLDAuMy0xLjgsMC4zXFxuXFx0XFx0XFx0XFx0XFx0Yy0xLjYsMC0yLjYtMS0yLjYtMi43YzAtMS42LDEtMi44LDIuNS0yLjhjMS4zLDAsMi4yLDEsMi4yLDIuNUMxMjcuNSwxMi4xLDEyNy41LDEyLjMsMTI3LjUsMTIuNXogTTEyNi40LDExLjZcXG5cXHRcXHRcXHRcXHRcXHRjMC0wLjgtMC40LTEuNC0xLjItMS40Yy0wLjcsMC0xLjIsMC42LTEuMywxLjRIMTI2LjR6XCI+PC9wYXRoPjwvZz48L2c+PC9nPjwvZz48L3N2Zz48L2Rpdj48aDE+SW4gVGhlaXIgQ2h1Y2tzPC9oMT48aDE+QSAzNjAmZGVnOyBFeHBlcmllbmNlPC9oMT48ZGl2IGNsYXNzPVwidmVydC1kaXZpZGVyXCI+PC9kaXY+PHVsIGNsYXNzPVwiaW5mb1wiPjxsaT5Eb3dubG9hZCB0aGUgYXBwIGFuZDwvbGk+PGxpPmV4cGVyaWVuY2UgZXZlcnkgc2N1ZmYsIHN0YWluPC9saT48bGk+YW5kIHJpcCB0aHJvdWdoIHRoZWlyIGV5ZXMuPC9saT48L3VsPjx1bCBjbGFzcz1cImluZm9cIj48bGk+TW92ZSBhcm91bmQgZXZlcnkgY29ybmVyIG9mPC9saT48bGk+dGhlIGV4cGVyaWVuY2UgYnkgc2hpZnRpbmcgeW91cjwvbGk+PGxpPmhhbmRoZWxkIGRldmljZSBpbiBkaWZmZXJlbnQ8L2xpPjxsaT5kaXJlY3Rpb25zLiBVc2UgY2FyZGJvYXJkPC9saT48bGk+Z29nZ2xlcyBmb3IgdGhlIGZ1bGx5IGltbWVyc2l2ZTwvbGk+PGxpPmV4cGVyaWVuY2UuPC9saT48L3VsPjxkaXYgY2xhc3M9XCJzaG9lc1wiPjxkaXYgY2xhc3M9XCJqb2FubmFcIj48aW1nIGRhdGEtY2F0ZWdvcnk9XCJtb2JpbGU6c2hvZVwiIGRhdGEtbGFiZWw9XCJqb2FubmEtZGVsYW5lXCIgY2xhc3M9XCJqb2FubmEtc2hvZSBzaG9lIHRya1wiIHNyYz1cIi4vaW1hZ2VzL0pvYW5uYS5wbmdcIj48ZGl2IGNsYXNzPVwic2lnbmF0dXJlXCI+PGRpdiBjbGFzcz1cInVuZGVyTGluZVwiPjwvZGl2PjxpbWcgc3JjPVwiLi9pbWFnZXMvU2lnbmF0dXJlcy92Mi9Kb2FubmEvSm9hbm5hXzkwLnBuZ1wiIGNsYXNzPVwic2lnXCI+PC9kaXY+PHAgY2xhc3M9XCJtYWRlLWJ5XCI+TWFkZSBieSBKb2FubmEgRGVMYW5lPC9wPjwvZGl2PjxkaXYgY2xhc3M9XCJraW5nXCI+PGltZyBkYXRhLWNhdGVnb3J5PVwibW9iaWxlOnNob2VcIiBkYXRhLWxhYmVsPVwia2luZy10dWZmXCIgY2xhc3M9XCJraW5nLXNob2Ugc2hvZSB0cmtcIiBzcmM9XCIuL2ltYWdlcy9LaW5nLnBuZ1wiPjxkaXYgY2xhc3M9XCJzaWduYXR1cmVcIj48ZGl2IGNsYXNzPVwidW5kZXJMaW5lXCI+PC9kaXY+PGltZyBzcmM9XCIuL2ltYWdlcy9TaWduYXR1cmVzL3YyL0tpbmd0dWZmL0tpbmd0dWZmXzk5LnBuZ1wiIGNsYXNzPVwic2lnXCI+PC9kaXY+PHAgY2xhc3M9XCJtYWRlLWJ5XCI+TWFkZSBieSBLaW5nIFR1ZmY8L3A+PC9kaXY+PGRpdiBjbGFzcz1cInRob21hc1wiPjxpbWcgZGF0YS1jYXRlZ29yeT1cIm1vYmlsZTpzaG9lXCIgZGF0YS1sYWJlbD1cInRob21hcy1taWRsYW5lXCIgY2xhc3M9XCJ0aG9tYXMtc2hvZSBzaG9lIHRya1wiIHNyYz1cIi4vaW1hZ2VzL1Rob21hcy5wbmdcIj48ZGl2IGNsYXNzPVwic2lnbmF0dXJlXCI+PGRpdiBjbGFzcz1cInVuZGVyTGluZVwiPjwvZGl2PjxpbWcgc3JjPVwiLi9pbWFnZXMvU2lnbmF0dXJlcy92Mi9UaG9tYXMvVGhvbWFzXzU5LnBuZ1wiIGNsYXNzPVwic2lnXCI+PC9kaXY+PHAgY2xhc3M9XCJtYWRlLWJ5XCI+TWFkZSBieSBUaG9tYXMgTWlkbGFuZTwvcD48L2Rpdj48ZGl2IGNsYXNzPVwicm9uXCI+PGltZyBkYXRhLWNhdGVnb3J5PVwibW9iaWxlOnNob2VcIiBkYXRhLWxhYmVsPVwicm9uLWVuZ2xpc2hcIiBjbGFzcz1cInJvbi1zaG9lIHNob2UgdHJrXCIgc3JjPVwiLi9pbWFnZXMvUm9uLnBuZ1wiPjxkaXYgY2xhc3M9XCJzaWduYXR1cmVcIj48ZGl2IGNsYXNzPVwidW5kZXJMaW5lXCI+PC9kaXY+PGltZyBzcmM9XCIuL2ltYWdlcy9TaWduYXR1cmVzL3YyL0VuZ2xpc2gvRW5nbGlzaF84Mi5wbmdcIiBjbGFzcz1cInNpZ1wiPjwvZGl2PjxwIGNsYXNzPVwibWFkZS1ieVwiPk1hZGUgYnkgUm9uIEVuZ2xpc2g8L3A+PC9kaXY+PC9kaXY+JztcblxufVxucmV0dXJuIF9fcFxufTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxkaXYgaWQ9XCJpbnRyby1wYW5lbFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJsb2FkZXItcGFuZWxcIj48aW1nIGNsYXNzPVwibG9nb1wiIHNyYz1cIi4vaW1hZ2VzL2xvYWRlci5wbmdcIj48ZGl2IGNsYXNzPVwibG9hZGVyLXNwcml0ZVwiPjxkaXYgY2xhc3M9XCJwcmVsb2FkZXItcGVyY2VudGFnZVwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJsb2FkZXJcIj48L2Rpdj48L2Rpdj4nO1xuXG59XG5yZXR1cm4gX19wXG59OyIsInZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xub2JqIHx8IChvYmogPSB7fSk7XG52YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG53aXRoIChvYmopIHtcbl9fcCArPSAnPGRpdiBjbGFzcz1cInBsYXllci1iYWNrZ3JvdW5kXCI+PC9kaXY+PGRpdiBjbGFzcz1cInBsYXllci1pbm5lclwiPjxkaXYgaWQ9XCJwbGF5ZXJDb250YWluZXJcIiBjbGFzcz1cImZ1bGxcIj48L2Rpdj48ZGl2PlZpZGVvJyArXG4oKF9fdCA9IChpZHggKzEpKSA9PSBudWxsID8gJycgOiBfX3QpICtcbic8L2Rpdj48ZGl2IGNsYXNzPVwiY2xvc2VcIj5YPC9kaXY+PGRpdiBjbGFzcz1cInNoYXJlc1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnN0cnVjdGlvbnNcIj48ZGl2IGNsYXNzPVwiaW5zdHJ1Y3Rpb24gaW5zdHJ1Y3Rpb24xXCI+PGgxPlB1dCBvbiB5b3VyIGhlYWRwaG9uZXM8L2gxPjxkaXYgY2xhc3M9XCJoZWFkcGhvbmVzXCI+PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJoZWFkcGhvbmVzXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Ym94PVwiMCAwIDUxNCAzNjAuMlwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA1MTQgMzYwLjJcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxnPjxwYXRoIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiI0E3QTlBQ1wiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCIgZD1cIk00Ny45LDIxMWMwLTExNS40LDkzLjYtMjA5LDIwOS0yMDlcXG4gICAgICAgICAgICAgICAgICAgICAgICBzMjA5LDkzLjYsMjA5LDIwOVwiPjwvcGF0aD48cGF0aCBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiNBN0E5QUNcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiIGQ9XCJNMTA5LjksMzU4LjJINzguNWMtMC44LDAtMS40LTAuNi0xLjQtMS40VjE5OS43XFxuICAgICAgICAgICAgICAgICAgICAgICAgYzAtMC44LDAuNi0xLjQsMS40LTEuNGgzMS40YzAuOCwwLDEuNCwwLjYsMS40LDEuNHYxNTcuMUMxMTEuMywzNTcuNiwxMTAuNywzNTguMiwxMDkuOSwzNTguMnpcIj48L3BhdGg+PHBhdGggZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjQTdBOUFDXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIiBkPVwiTTUzLjYsMzQxLjZjMCw0LjUtNC4xLDcuOS04LjUsN1xcbiAgICAgICAgICAgICAgICAgICAgICAgIEMyMC43LDM0MywyLDMxMy42LDIsMjc4LjNzMTguNy02NC43LDQzLjEtNzAuM2M0LjMtMSw4LjUsMi41LDguNSw3VjM0MS42elwiPjwvcGF0aD48cGF0aCBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiNBN0E5QUNcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiIGQ9XCJNNDA0LjEsMzU4LjJoMzEuNGMwLjgsMCwxLjQtMC42LDEuNC0xLjRWMTk5LjdcXG4gICAgICAgICAgICAgICAgICAgICAgICBjMC0wLjgtMC42LTEuNC0xLjQtMS40aC0zMS40Yy0wLjgsMC0xLjQsMC42LTEuNCwxLjR2MTU3LjFDNDAyLjcsMzU3LjYsNDAzLjQsMzU4LjIsNDA0LjEsMzU4LjJ6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiI0E3QTlBQ1wiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCIgZD1cIk00NjAuNCwzNDEuNmMwLDQuNSw0LjEsNy45LDguNSw3XFxuICAgICAgICAgICAgICAgICAgICAgICAgYzI0LjUtNS42LDQzLjEtMzQuOSw0My4xLTcwLjNzLTE4LjctNjQuNy00My4xLTcwLjNjLTQuMy0xLTguNSwyLjUtOC41LDdWMzQxLjZ6XCI+PC9wYXRoPjwvZz48L3N2Zz48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5zdHJ1Y3Rpb24gaW5zdHJ1Y3Rpb24yXCI+PGgxPkNsaWNrIGFuZCBkcmFnIHRvIGV4cGxvcmU8L2gxPjxkaXYgY2xhc3M9XCJtb3VzZS1kcmFnXCI+PGRpdiBjbGFzcz1cInBvaW50ZXJcIj48c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cInBvaW50ZXJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeG1sbnM6YT1cImh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVTVkdWaWV3ZXJFeHRlbnNpb25zLzMuMC9cIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdib3g9XCIwIDAgMTUgMzBcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMTUgMzBcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxwb2x5Z29uIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiI0ZGRkZGRlwiIHBvaW50cz1cIjAuOCwzLjUgMS41LDIyLjYgNiwxOS4xIDkuNiwyNi41IDEzLjIsMjQuOSA5LjYsMTcuNCAxNC4yLDE2LjEgXCIgc3R5bGU9XCJzdHJva2Utd2lkdGg6Ljc1XCI+PC9wb2x5Z29uPjwvc3ZnPjwvZGl2PjxkaXYgY2xhc3M9XCJhcnJvdy1sZWZ0XCI+PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Ym94PVwiMCAwIDUxIDE2LjRcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTEgMTYuNFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PGxpbmUgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjQTdBOUFDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHgxPVwiMi4yXCIgeTE9XCI4LjJcIiB4Mj1cIjUwXCIgeTI9XCI4LjJcIj48L2xpbmU+PHBvbHlnb24gZmlsbD1cIiNBN0E5QUNcIiBwb2ludHM9XCI4LjgsMTYuNCAxMC4yLDE0LjkgMi45LDguMiAxMC4yLDEuNSA4LjgsMCAwLDguMlwiPjwvcG9seWdvbj48L2c+PC9zdmc+PC9kaXY+PGRpdiBjbGFzcz1cImFycm93LXJpZ2h0XCI+PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Ym94PVwiMCAwIDUxIDE2LjRcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTEgMTYuNFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PGxpbmUgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjQTdBOUFDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHgxPVwiNDcuOFwiIHkxPVwiOC4yXCIgeDI9XCIwXCIgeTI9XCI4LjJcIj48L2xpbmU+PHBvbHlnb24gZmlsbD1cIiNBN0E5QUNcIiBwb2ludHM9XCI0MS4yLDAgMzkuOCwxLjUgNDcuMSw4LjIgMzkuOCwxNC45IDQxLjIsMTYuNCA1MCw4LjJcIj48L3BvbHlnb24+PC9nPjwvc3ZnPjwvZGl2PjwvZGl2PjwvZGl2PjxoMiBjbGFzcz1cInN0YXR1c1wiPkV4cGVyaWVuY2UgYmVnaW5zPGJyPmluIDxzcGFuPjU8L3NwYW4+IHNlY29uZHM8L2gyPjxkaXYgY2xhc3M9XCJza2lwXCI+LSBTa2lwIC08L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiZW5kLXNjcmVlblwiPjxkaXYgY2xhc3M9XCJvcHRpb25zXCI+PGRpdiBjbGFzcz1cImhvbWUgdHJrXCIgZGF0YS1jYXRlZ29yeT1cImRlc2t0b3A6cGxheWVyXCIgZGF0YS1sYWJlbD1cImhvbWVcIj48ZGl2IGNsYXNzPVwibGFiZWxzXCI+SG9tZTwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJyZXBsYXkgdHJrXCIgZGF0YS1jYXRlZ29yeT1cImRlc2t0b3A6cGxheWVyXCIgZGF0YS1sYWJlbD1cInJlcGxheVwiPjxkaXYgY2xhc3M9XCJsYWJlbHNcIj5SZXBsYXk8L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiZG93bmxvYWQtYnRuc1wiPjxzdmcgY2xhc3M9XCJhbmRyb2lkLWFwcCB0cmtcIiBkYXRhLWNhdGVnb3J5PVwiZGVza3RvcDpwbGF5ZXI6YXBwYnRuc1wiIGRhdGEtbGFiZWw9XCJhbmRyb2lkLWFwcFwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeG1sbnM6YT1cImh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVTVkdWaWV3ZXJFeHRlbnNpb25zLzMuMC9cIiB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiMTM3LjZweFwiIGhlaWdodD1cIjQ1LjlweFwiIHZpZXdib3g9XCIwIDAgMTM3LjYgNDUuOVwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCAxMzcuNiA0NS45XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48ZGVmcz48L2RlZnM+PGc+PHBhdGggc3Ryb2tlPVwiI0ZGRkZGRlwiIHN0cm9rZS13aWR0aD1cIjEuNVwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIiBkPVwiTTEyNS4yLDM2LjFjMCwzLjUtMi42LDUuNy02LjEsNS43SDE2LjNcXG4gICAgICAgICAgICAgICAgYy0zLjUsMC02LjMtMi44LTYuMy02LjNWOC43YzAtMy41LDIuOC02LjMsNi4zLTYuM2gxMDIuOGMzLjUsMCw2LjEsMi44LDYuMSw2LjNWMzYuMXpcIj48L3BhdGg+PHBhdGggZD1cIk0xMzcuNiw0Mi43YzAsMS44LTEuNCwzLjItMy4yLDMuMkgzLjJjLTEuOCwwLTMuMi0xLjQtMy4yLTMuMlYzLjJDMCwxLjQsMS40LDAsMy4yLDBoMTMxLjJjMS44LDAsMy4yLDEuNCwzLjIsMy4yVjQyLjd6XCI+PC9wYXRoPjxnPjxnPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk04OC43LDMwLjdsLTAuOSwwLjhjLTAuMiwwLjEtMC40LDAuMi0wLjYsMC4zYy0wLjYsMC4zLTEuMiwwLjMtMS44LDAuM2MtMC42LDAtMS41LDAtMi40LTAuN1xcbiAgICAgICAgICAgICAgICAgICAgICAgIGMtMS4zLTAuOS0xLjgtMi41LTEuOC0zLjhjMC0yLjgsMi4zLTQuMiw0LjEtNC4yYzAuNywwLDEuMywwLjIsMS45LDAuNWMwLjksMC42LDEuMSwxLjQsMS4zLDEuOGwtNC4zLDEuN2wtMS40LDAuMVxcbiAgICAgICAgICAgICAgICAgICAgICAgIGMwLjUsMi4zLDIsMy42LDMuNywzLjZDODcuNSwzMS4yLDg4LjEsMzEsODguNywzMC43Qzg4LjcsMzAuNyw4OC44LDMwLjYsODguNywzMC43eiBNODYuMSwyNi4xYzAuMy0wLjEsMC41LTAuMiwwLjUtMC41XFxuICAgICAgICAgICAgICAgICAgICAgICAgYzAtMC43LTAuOC0xLjYtMS44LTEuNmMtMC43LDAtMi4xLDAuNi0yLjEsMi41YzAsMC4zLDAsMC42LDAuMSwxTDg2LjEsMjYuMXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTc5LjgsMzAuNWMwLDAuNywwLjEsMC44LDAuNywwLjljMC4zLDAsMC42LDAuMSwwLjksMC4xbC0wLjcsMC40aC0zLjJjMC40LTAuNSwwLjUtMC42LDAuNS0xdi0wLjRcXG4gICAgICAgICAgICAgICAgICAgICAgICBsMC0xMC44aC0xLjRsMS40LTAuN2gyLjZjLTAuNiwwLjMtMC43LDAuNS0wLjgsMS4yTDc5LjgsMzAuNXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTc0LjksMjQuNGMwLjQsMC4zLDEuMywxLjEsMS4zLDIuNGMwLDEuMy0wLjgsMi0xLjUsMi42Yy0wLjIsMC4yLTAuNSwwLjUtMC41LDAuOWMwLDAuNCwwLjMsMC42LDAuNSwwLjhcXG4gICAgICAgICAgICAgICAgICAgICAgICBsMC43LDAuNWMwLjgsMC43LDEuNSwxLjMsMS41LDIuNWMwLDEuNy0xLjYsMy40LTQuOCwzLjRjLTIuNiwwLTMuOS0xLjItMy45LTIuNmMwLTAuNywwLjMtMS42LDEuNC0yLjJjMS4xLTAuNywyLjYtMC44LDMuNS0wLjhcXG4gICAgICAgICAgICAgICAgICAgICAgICBjLTAuMy0wLjMtMC41LTAuNy0wLjUtMS4yYzAtMC4zLDAuMS0wLjUsMC4yLTAuN2MtMC4yLDAtMC40LDAtMC42LDBjLTEuOSwwLTMtMS40LTMtMi44YzAtMC44LDAuNC0xLjgsMS4yLTIuNFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGMxLTAuOCwyLjMtMSwzLjItMWgzLjdMNzYsMjQuNEg3NC45eiBNNzMuNiwzMi40Yy0wLjEsMC0wLjIsMC0wLjQsMGMtMC4yLDAtMS4xLDAtMS45LDAuM2MtMC40LDAuMS0xLjYsMC42LTEuNiwxLjlcXG4gICAgICAgICAgICAgICAgICAgICAgICBjMCwxLjMsMS4yLDIuMiwzLjIsMi4yYzEuNywwLDIuNy0wLjgsMi43LTJDNzUuNiwzMy45LDc1LDMzLjQsNzMuNiwzMi40eiBNNzQuMSwyOWMwLjQtMC40LDAuNS0xLDAuNS0xLjNjMC0xLjMtMC44LTMuMy0yLjMtMy4zXFxuICAgICAgICAgICAgICAgICAgICAgICAgYy0wLjUsMC0xLDAuMi0xLjMsMC42Yy0wLjMsMC40LTAuNCwwLjktMC40LDEuM2MwLDEuMiwwLjcsMy4yLDIuMywzLjJDNzMuMywyOS41LDczLjgsMjkuMiw3NC4xLDI5elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNjMuNywzMi4xYy0yLjksMC00LjQtMi4yLTQuNC00LjNjMC0yLjQsMS45LTQuNCw0LjctNC40YzIuNywwLDQuMywyLjEsNC4zLDQuM1xcbiAgICAgICAgICAgICAgICAgICAgICAgIEM2OC4zLDI5LjksNjYuNiwzMi4xLDYzLjcsMzIuMXogTTY1LjksMzAuN2MwLjQtMC42LDAuNS0xLjMsMC41LTJjMC0xLjYtMC44LTQuNi0zLTQuNmMtMC42LDAtMS4yLDAuMi0xLjYsMC42XFxuICAgICAgICAgICAgICAgICAgICAgICAgYy0wLjcsMC42LTAuOCwxLjQtMC44LDIuMmMwLDEuOCwwLjksNC43LDMuMSw0LjdDNjQuOCwzMS42LDY1LjUsMzEuMyw2NS45LDMwLjd6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk01NCwzMi4xYy0yLjksMC00LjQtMi4yLTQuNC00LjNjMC0yLjQsMS45LTQuNCw0LjctNC40YzIuNywwLDQuMywyLjEsNC4zLDQuM0M1OC42LDI5LjksNTcsMzIuMSw1NCwzMi4xXFxuICAgICAgICAgICAgICAgICAgICAgICAgeiBNNTYuMywzMC43YzAuNC0wLjYsMC41LTEuMywwLjUtMmMwLTEuNi0wLjgtNC42LTMtNC42Yy0wLjYsMC0xLjIsMC4yLTEuNiwwLjZjLTAuNywwLjYtMC44LDEuNC0wLjgsMi4yYzAsMS44LDAuOSw0LjcsMy4xLDQuN1xcbiAgICAgICAgICAgICAgICAgICAgICAgIEM1NS4yLDMxLjYsNTUuOSwzMS4zLDU2LjMsMzAuN3pcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTQ4LjUsMzEuNWwtMi40LDAuNmMtMSwwLjItMS45LDAuMy0yLjgsMC4zYy00LjcsMC02LjUtMy40LTYuNS02LjFjMC0zLjMsMi41LTYuMyw2LjgtNi4zXFxuICAgICAgICAgICAgICAgICAgICAgICAgYzAuOSwwLDEuOCwwLjEsMi42LDAuNGMxLjMsMC40LDEuOSwwLjgsMi4yLDEuMWwtMS40LDEuM2wtMC42LDAuMWwwLjQtMC43Yy0wLjYtMC42LTEuNi0xLjYtMy42LTEuNmMtMi43LDAtNC43LDItNC43LDVcXG4gICAgICAgICAgICAgICAgICAgICAgICBjMCwzLjIsMi4zLDYuMiw2LDYuMmMxLjEsMCwxLjYtMC4yLDIuMi0wLjR2LTIuN2wtMi42LDAuMWwxLjQtMC43aDMuNmwtMC40LDAuNGMtMC4xLDAuMS0wLjEsMC4xLTAuMiwwLjNjMCwwLjIsMCwwLjYsMCwwLjhcXG4gICAgICAgICAgICAgICAgICAgICAgICBWMzEuNXpcIj48L3BhdGg+PC9nPjxnPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk05My45LDMwLjh2NC42SDkzVjIzLjdoMC45VjI1YzAuNi0wLjksMS43LTEuNSwyLjktMS41YzIuMywwLDMuOCwxLjcsMy44LDQuNGMwLDIuNy0xLjUsNC41LTMuOCw0LjVcXG4gICAgICAgICAgICAgICAgICAgICAgICBDOTUuNywzMi4zLDk0LjYsMzEuNyw5My45LDMwLjh6IE05OS43LDI3LjljMC0yLjEtMS4xLTMuNi0zLTMuNmMtMS4yLDAtMi4zLDAuOS0yLjgsMS43djMuOGMwLjUsMC44LDEuNiwxLjgsMi44LDEuOFxcbiAgICAgICAgICAgICAgICAgICAgICAgIEM5OC42LDMxLjUsOTkuNywyOS45LDk5LjcsMjcuOXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTEwMS45LDMyLjFWMjAuNGgwLjl2MTEuN0gxMDEuOXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTExMy4xLDM0LjZjMC4yLDAuMSwwLjUsMC4xLDAuNywwLjFjMC42LDAsMC45LTAuMiwxLjMtMWwwLjctMS41bC0zLjYtOC42aDFsMy4xLDcuNGwzLjEtNy40aDFMMTE2LDM0XFxuICAgICAgICAgICAgICAgICAgICAgICAgYy0wLjUsMS4xLTEuMiwxLjYtMi4yLDEuNmMtMC4zLDAtMC43LTAuMS0wLjktMC4xTDExMy4xLDM0LjZ6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMTAuNCwzMi4xYy0wLjEtMC4zLTAuMS0wLjYtMC4xLTAuOGMwLTAuMiwwLTAuNCwwLTAuN2MtMC4zLDAuNS0wLjgsMC44LTEuMywxLjFcXG4gICAgICAgICAgICAgICAgICAgICAgICBjLTAuNiwwLjMtMS4xLDAuNS0xLjgsMC41Yy0wLjksMC0xLjYtMC4yLTIuMS0wLjdjLTAuNS0wLjQtMC43LTEtMC43LTEuOGMwLTAuOCwwLjQtMS40LDEuMS0xLjljMC43LTAuNSwxLjYtMC43LDIuOC0wLjdoMi4xXFxuICAgICAgICAgICAgICAgICAgICAgICAgdi0xLjFjMC0wLjYtMC4yLTEuMS0wLjYtMS40Yy0wLjQtMC4zLTEtMC41LTEuOC0wLjVjLTAuNywwLTEuMiwwLjItMS43LDAuNWMtMC40LDAuMy0wLjYsMC43LTAuNiwxLjJoLTAuOWwwLDBcXG4gICAgICAgICAgICAgICAgICAgICAgICBjMC0wLjYsMC4zLTEuMiwwLjktMS43YzAuNi0wLjUsMS40LTAuNywyLjQtMC43YzEsMCwxLjgsMC4yLDIuNCwwLjdjMC42LDAuNSwwLjksMS4yLDAuOSwyLjF2NC4yYzAsMC4zLDAsMC42LDAuMSwwLjlcXG4gICAgICAgICAgICAgICAgICAgICAgICBjMCwwLjMsMC4xLDAuNiwwLjIsMC44SDExMC40eiBNMTA3LjIsMzEuNGMwLjgsMCwxLjMtMC4yLDEuOS0wLjVjMC42LTAuMywxLTAuOCwxLjItMS4zVjI4aC0yLjFjLTAuOCwwLTEuNSwwLjItMiwwLjVcXG4gICAgICAgICAgICAgICAgICAgICAgICBjLTAuNSwwLjQtMC44LDAuOC0wLjgsMS4zYzAsMC41LDAuMiwwLjksMC41LDEuMkMxMDYuMSwzMS4zLDEwNi42LDMxLjQsMTA3LjIsMzEuNHpcIj48L3BhdGg+PC9nPjwvZz48Zz48cG9seWdvbiBmaWxsPVwiI0YxRjJGMlwiIHBvaW50cz1cIjIwLjgsMjUuNCAyMy43LDIyLjQgMjMuNywyMi40IDIwLjgsMjUuNCAxMS40LDE2IDExLjQsMTYgMjAuOCwyNS40IDExLjQsMzQuOCAxMS40LDM0LjggXFxuICAgICAgICAgICAgICAgICAgICAyMC44LDI1LjQgMjMuNywyOC4zIDIzLjcsMjguMyAgICAgICBcIj48L3BvbHlnb24+PHBhdGggZmlsbD1cIiNGMUYyRjJcIiBkPVwiTTIzLjcsMjIuNGwtMTEuNC02LjNDMTIsMTYsMTEuNywxNS45LDExLjQsMTZsOS40LDkuNEwyMy43LDIyLjR6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRjFGMkYyXCIgZD1cIk0yMy43LDI4LjNsMy45LTIuMWMwLjgtMC40LDAuOC0xLjEsMC0xLjZsLTMuOS0yLjJsLTIuOSwyLjlMMjMuNywyOC4zelwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0YxRjJGMlwiIGQ9XCJNMTEuNCwxNmMtMC4zLDAuMS0wLjYsMC41LTAuNiwxbDAsMTYuOGMwLDAuNSwwLjIsMC45LDAuNiwxbDkuNC05LjRMMTEuNCwxNnpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGMUYyRjJcIiBkPVwiTTExLjQsMzQuOGMwLjIsMC4xLDAuNSwwLDAuOS0wLjFsMTEuNC02LjNsLTIuOS0yLjlMMTEuNCwzNC44elwiPjwvcGF0aD48L2c+PGc+PGc+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTQxLjksMTMuN2wtMC40LTEuMWgtMi42bC0wLjQsMS4xaC0xLjFsMi4yLTUuN2gxLjNsMi4yLDUuN0g0MS45eiBNNDAuMiw4LjlsLTEsMi43aDIuMUw0MC4yLDguOXpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTQ3LjgsMTMuN2wtMy00LjF2NC4xaC0xVjcuOWgxbDIuOSw0di00aDF2NS43SDQ3Ljh6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk01MC4yLDEzLjdWNy45aDIuMWMxLjgsMCwzLDEuMiwzLDIuOWMwLDEuNy0xLjIsMi45LTMsMi45SDUwLjJ6IE01NC4zLDEwLjhjMC0xLjEtMC43LTItMi0yaC0xLjF2NGgxLjFcXG4gICAgICAgICAgICAgICAgICAgICAgICBDNTMuNiwxMi44LDU0LjMsMTEuOSw1NC4zLDEwLjh6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk01OS44LDEzLjdsLTEuMy0yLjFoLTF2Mi4xaC0xVjcuOWgyLjVjMS4xLDAsMS45LDAuNywxLjksMS44YzAsMS0wLjcsMS42LTEuNCwxLjdsMS40LDIuMkg1OS44elxcbiAgICAgICAgICAgICAgICAgICAgICAgICBNNTkuOSw5LjdjMC0wLjUtMC40LTAuOS0xLTAuOWgtMS40djEuOGgxLjRDNTkuNSwxMC42LDU5LjksMTAuMyw1OS45LDkuN3pcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTYxLjksMTAuOGMwLTEuNywxLjItMywyLjktM2MxLjcsMCwyLjksMS4zLDIuOSwzYzAsMS43LTEuMiwzLTIuOSwzQzYzLjEsMTMuOCw2MS45LDEyLjUsNjEuOSwxMC44elxcbiAgICAgICAgICAgICAgICAgICAgICAgICBNNjYuNywxMC44YzAtMS4yLTAuNy0yLjEtMS45LTIuMWMtMS4yLDAtMS45LDAuOS0xLjksMi4xYzAsMS4yLDAuNywyLjEsMS45LDIuMUM2NiwxMi45LDY2LjcsMTIsNjYuNywxMC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNjguOSwxMy43VjcuOWgxdjUuN0g2OC45elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNzEuNCwxMy43VjcuOWgyLjFjMS44LDAsMywxLjIsMywyLjljMCwxLjctMS4yLDIuOS0zLDIuOUg3MS40eiBNNzUuNSwxMC44YzAtMS4xLTAuNy0yLTItMmgtMS4xdjRoMS4xXFxuICAgICAgICAgICAgICAgICAgICAgICAgQzc0LjcsMTIuOCw3NS41LDExLjksNzUuNSwxMC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNODQuMSwxMy43bC0wLjQtMS4xaC0yLjZsLTAuNCwxLjFoLTEuMWwyLjItNS43SDgzbDIuMiw1LjdIODQuMXogTTgyLjQsOC45bC0xLDIuN2gyLjFMODIuNCw4Ljl6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk04Ni4xLDEzLjdWNy45aDIuNWMxLjIsMCwxLjksMC44LDEuOSwxLjhjMCwxLTAuNywxLjgtMS45LDEuOGgtMS41djIuMUg4Ni4xeiBNODkuNCw5LjdcXG4gICAgICAgICAgICAgICAgICAgICAgICBjMC0wLjUtMC40LTAuOS0xLTAuOWgtMS40djEuOGgxLjRDODksMTAuNiw4OS40LDEwLjMsODkuNCw5Ljd6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk05MS41LDEzLjdWNy45SDk0YzEuMiwwLDEuOSwwLjgsMS45LDEuOGMwLDEtMC43LDEuOC0xLjksMS44aC0xLjV2Mi4xSDkxLjV6IE05NC45LDkuN1xcbiAgICAgICAgICAgICAgICAgICAgICAgIGMwLTAuNS0wLjQtMC45LTEtMC45aC0xLjR2MS44aDEuNEM5NC41LDEwLjYsOTQuOSwxMC4zLDk0LjksOS43elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNOTkuMSwxMC44YzAtMS43LDEuMi0zLDIuOS0zYzEuNywwLDIuOSwxLjMsMi45LDNjMCwxLjctMS4yLDMtMi45LDNDMTAwLjMsMTMuOCw5OS4xLDEyLjUsOTkuMSwxMC44elxcbiAgICAgICAgICAgICAgICAgICAgICAgICBNMTAzLjksMTAuOGMwLTEuMi0wLjctMi4xLTEuOS0yLjFjLTEuMiwwLTEuOSwwLjktMS45LDIuMWMwLDEuMiwwLjcsMi4xLDEuOSwyLjFDMTAzLjIsMTIuOSwxMDMuOSwxMiwxMDMuOSwxMC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNMTEwLjEsMTMuN2wtMy00LjF2NC4xaC0xVjcuOWgxbDIuOSw0di00aDF2NS43SDExMC4xelwiPjwvcGF0aD48L2c+PC9nPjwvZz48L3N2Zz4gPHN2ZyBjbGFzcz1cImlvcy1hcHAgdHJrXCIgZGF0YS1jYXRlZ29yeT1cImRlc2t0b3A6cGxheWVyOmFwcGJ0bnNcIiBkYXRhLWxhYmVsPVwiaW9zLWFwcFwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeG1sbnM6YT1cImh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVTVkdWaWV3ZXJFeHRlbnNpb25zLzMuMC9cIiB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiMTM3LjZweFwiIGhlaWdodD1cIjQ1LjRweFwiIHZpZXdib3g9XCIwIDAgMTM3LjYgNDUuNFwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCAxMzcuNiA0NS40XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48ZGVmcz48L2RlZnM+PGc+PHBhdGggZD1cIk0xMzcuNiw0Mi4yYzAsMS44LTEuNCwzLjItMy4yLDMuMkgzLjJDMS40LDQ1LjQsMCw0NCwwLDQyLjJ2LTM5QzAsMS40LDEuNCwwLDMuMiwwaDEzMS4yYzEuOCwwLDMuMiwxLjQsMy4yLDMuMlY0Mi4yelwiPjwvcGF0aD48Zz48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNMjYuOCwyMi44YzAtMy42LDIuOS01LjMsMy4xLTUuNGMtMS43LTIuNS00LjMtMi44LTUuMi0yLjhjLTIuMi0wLjItNC4zLDEuMy01LjQsMS4zXFxuICAgICAgICAgICAgICAgIGMtMS4xLDAtMi45LTEuMy00LjctMS4zYy0yLjQsMC00LjYsMS40LTUuOCwzLjZDNi4yLDIyLjUsOCwyOC45LDEwLjUsMzIuNWMxLjIsMS43LDIuNiwzLjcsNC41LDMuNmMxLjgtMC4xLDIuNS0xLjIsNC43LTEuMlxcbiAgICAgICAgICAgICAgICBjMi4yLDAsMi44LDEuMiw0LjcsMS4xYzEuOSwwLDMuMi0xLjcsNC4zLTMuNWMxLjQtMiwyLTMuOSwyLTRDMzAuNiwyOC41LDI2LjksMjcuMSwyNi44LDIyLjh6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0yMy4zLDEyLjJjMS0xLjIsMS42LTIuOSwxLjUtNC42Yy0xLjQsMC4xLTMuMiwxLTQuMiwyLjJjLTAuOSwxLjEtMS43LDIuOC0xLjUsNC40XFxuICAgICAgICAgICAgICAgIEMyMC42LDE0LjMsMjIuMiwxMy40LDIzLjMsMTIuMnpcIj48L3BhdGg+PC9nPjxnPjxkZWZzPjxwYXRoIGlkPVwiU1ZHSURfMV9cIiBkPVwiTTEzNy42LDQxLjhjMCwxLjgtMS40LDMuMi0zLjIsMy4ySDMuMkMxLjQsNDUsMCw0My42LDAsNDEuOFYzLjZjMC0xLjgsMS40LTMuMiwzLjItMy4yaDEzMS4yXFxuICAgICAgICAgICAgICAgICAgICBjMS44LDAsMy4yLDEuNCwzLjIsMy4yVjQxLjh6XCI+PC9wYXRoPjwvZGVmcz48Y2xpcHBhdGggaWQ9XCJTVkdJRF8yX1wiPjx1c2UgeGxpbms6aHJlZj1cIiNTVkdJRF8xX1wiIG92ZXJmbG93PVwidmlzaWJsZVwiPjwvY2xpcHBhdGg+PC9nPjxnPjxnPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk01Mi4yLDM1aC0yLjVsLTEuNC00LjRoLTQuOEw0Mi4xLDM1aC0yLjVsNC44LTE0LjhoM0w1Mi4yLDM1eiBNNDcuOSwyOC44bC0xLjMtMy45XFxuICAgICAgICAgICAgICAgICAgICBjLTAuMS0wLjQtMC40LTEuMy0wLjctMi44aDBjLTAuMSwwLjYtMC40LDEuNi0wLjcsMi44bC0xLjIsMy45SDQ3Ljl6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk02NC41LDI5LjVjMCwxLjgtMC41LDMuMy0xLjUsNC4zYy0wLjksMC45LTIsMS40LTMuMywxLjRjLTEuNCwwLTIuNC0wLjUtMy4xLTEuNXY1LjZoLTIuNFYyNy44XFxuICAgICAgICAgICAgICAgICAgICBjMC0xLjEsMC0yLjMtMC4xLTMuNWgyLjFsMC4xLDEuN2gwYzAuOC0xLjMsMi0xLjksMy42LTEuOWMxLjMsMCwyLjMsMC41LDMuMiwxLjVDNjQuMSwyNi41LDY0LjUsMjcuOSw2NC41LDI5LjV6IE02Mi4xLDI5LjZcXG4gICAgICAgICAgICAgICAgICAgIGMwLTEtMC4yLTEuOS0wLjctMi42Yy0wLjUtMC43LTEuMi0xLjEtMi4xLTEuMWMtMC42LDAtMS4xLDAuMi0xLjYsMC42Yy0wLjUsMC40LTAuOCwwLjktMC45LDEuNWMtMC4xLDAuMy0wLjEsMC41LTAuMSwwLjd2MS44XFxuICAgICAgICAgICAgICAgICAgICBjMCwwLjgsMC4yLDEuNCwwLjcsMmMwLjUsMC41LDEuMSwwLjgsMS45LDAuOGMwLjksMCwxLjYtMC4zLDIuMS0xQzYxLjgsMzEuNiw2Mi4xLDMwLjcsNjIuMSwyOS42elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNzYuOCwyOS41YzAsMS44LTAuNSwzLjMtMS41LDQuM2MtMC45LDAuOS0yLDEuNC0zLjMsMS40Yy0xLjQsMC0yLjQtMC41LTMuMS0xLjV2NS42aC0yLjRWMjcuOFxcbiAgICAgICAgICAgICAgICAgICAgYzAtMS4xLDAtMi4zLTAuMS0zLjVoMi4xbDAuMSwxLjdoMGMwLjgtMS4zLDItMS45LDMuNi0xLjljMS4zLDAsMi4zLDAuNSwzLjIsMS41Qzc2LjQsMjYuNSw3Ni44LDI3LjksNzYuOCwyOS41eiBNNzQuNCwyOS42XFxuICAgICAgICAgICAgICAgICAgICBjMC0xLTAuMi0xLjktMC43LTIuNmMtMC41LTAuNy0xLjItMS4xLTIuMS0xLjFjLTAuNiwwLTEuMSwwLjItMS42LDAuNmMtMC41LDAuNC0wLjgsMC45LTAuOSwxLjVjLTAuMSwwLjMtMC4xLDAuNS0wLjEsMC43djEuOFxcbiAgICAgICAgICAgICAgICAgICAgYzAsMC44LDAuMiwxLjQsMC43LDJjMC41LDAuNSwxLjEsMC44LDEuOSwwLjhjMC45LDAsMS42LTAuMywyLjEtMUM3NC4xLDMxLjYsNzQuNCwzMC43LDc0LjQsMjkuNnpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTkwLjUsMzAuOGMwLDEuMy0wLjQsMi4zLTEuMywzLjFjLTEsMC45LTIuMywxLjMtNCwxLjNjLTEuNiwwLTIuOS0wLjMtMy44LTAuOWwwLjUtMlxcbiAgICAgICAgICAgICAgICAgICAgYzEsMC42LDIuMiwwLjksMy40LDAuOWMwLjksMCwxLjYtMC4yLDIuMS0wLjZjMC41LTAuNCwwLjgtMC45LDAuOC0xLjZjMC0wLjYtMC4yLTEuMS0wLjYtMS41Yy0wLjQtMC40LTEuMS0wLjgtMi0xLjFcXG4gICAgICAgICAgICAgICAgICAgIGMtMi42LTEtMy45LTIuNC0zLjktNC4zYzAtMS4yLDAuNS0yLjIsMS40LTNjMC45LTAuOCwyLjEtMS4yLDMuNi0xLjJjMS40LDAsMi41LDAuMiwzLjQsMC43bC0wLjYsMS45Yy0wLjgtMC41LTEuOC0wLjctMi45LTAuN1xcbiAgICAgICAgICAgICAgICAgICAgYy0wLjgsMC0xLjUsMC4yLTIsMC42Yy0wLjQsMC40LTAuNiwwLjgtMC42LDEuM2MwLDAuNiwwLjIsMS4xLDAuNywxLjVjMC40LDAuNCwxLjEsMC43LDIuMiwxLjFjMS4zLDAuNSwyLjIsMS4xLDIuOCwxLjhcXG4gICAgICAgICAgICAgICAgICAgIEM5MC4yLDI4LjksOTAuNSwyOS44LDkwLjUsMzAuOHpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTk4LjQsMjZoLTIuNnY1LjJjMCwxLjMsMC41LDIsMS40LDJjMC40LDAsMC44LDAsMS4xLTAuMWwwLjEsMS44Yy0wLjUsMC4yLTEuMSwwLjMtMS44LDAuM1xcbiAgICAgICAgICAgICAgICAgICAgYy0wLjksMC0xLjctMC4zLTIuMi0wLjljLTAuNS0wLjYtMC44LTEuNS0wLjgtMi45VjI2aC0xLjZ2LTEuOGgxLjZ2LTJsMi4zLTAuN3YyLjdoMi42VjI2elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNMTEwLjIsMjkuNWMwLDEuNi0wLjUsMy0xLjQsNC4xYy0xLDEuMS0yLjMsMS42LTMuOSwxLjZjLTEuNiwwLTIuOC0wLjUtMy44LTEuNmMtMC45LTEtMS40LTIuNC0xLjQtMy45XFxuICAgICAgICAgICAgICAgICAgICBjMC0xLjcsMC41LTMsMS40LTQuMWMxLTEuMSwyLjMtMS42LDMuOS0xLjZjMS42LDAsMi44LDAuNSwzLjgsMS42QzEwOS44LDI2LjYsMTEwLjIsMjcuOSwxMTAuMiwyOS41eiBNMTA3LjgsMjkuNlxcbiAgICAgICAgICAgICAgICAgICAgYzAtMS0wLjItMS44LTAuNi0yLjVjLTAuNS0wLjgtMS4yLTEuMy0yLjEtMS4zYy0xLDAtMS43LDAuNC0yLjIsMS4zYy0wLjQsMC43LTAuNiwxLjYtMC42LDIuNmMwLDEsMC4yLDEuOCwwLjYsMi41XFxuICAgICAgICAgICAgICAgICAgICBjMC41LDAuOCwxLjIsMS4zLDIuMiwxLjNjMC45LDAsMS42LTAuNCwyLjEtMS4zQzEwNy41LDMxLjQsMTA3LjgsMzAuNiwxMDcuOCwyOS42elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNMTE4LDI2LjRjLTAuMiwwLTAuNS0wLjEtMC43LTAuMWMtMC44LDAtMS41LDAuMy0xLjksMC45Yy0wLjQsMC42LTAuNiwxLjMtMC42LDIuMVYzNWgtMi40di03LjNcXG4gICAgICAgICAgICAgICAgICAgIGMwLTEuMiwwLTIuNC0wLjEtMy40aDIuMWwwLjEsMmgwLjFjMC4zLTAuNywwLjYtMS4zLDEuMi0xLjdjMC41LTAuNCwxLjEtMC42LDEuNy0wLjZjMC4yLDAsMC40LDAsMC42LDBMMTE4LDI2LjRMMTE4LDI2LjR6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMjguNiwyOS4xYzAsMC40LDAsMC44LTAuMSwxLjFoLTcuMWMwLDEuMSwwLjQsMS45LDEsMi40YzAuNiwwLjUsMS40LDAuNywyLjMsMC43YzEuMSwwLDItMC4yLDIuOS0wLjVcXG4gICAgICAgICAgICAgICAgICAgIGwwLjQsMS42Yy0xLDAuNC0yLjIsMC43LTMuNiwwLjdjLTEuNywwLTMtMC41LTMuOS0xLjVjLTAuOS0xLTEuNC0yLjMtMS40LTMuOWMwLTEuNiwwLjQtMywxLjMtNGMwLjktMS4xLDIuMi0xLjcsMy43LTEuN1xcbiAgICAgICAgICAgICAgICAgICAgYzEuNSwwLDIuNywwLjYsMy41LDEuN0MxMjguMywyNi42LDEyOC42LDI3LjgsMTI4LjYsMjkuMXogTTEyNi4zLDI4LjVjMC0wLjctMC4xLTEuMy0wLjUtMS44Yy0wLjQtMC43LTEtMS0xLjktMVxcbiAgICAgICAgICAgICAgICAgICAgYy0wLjgsMC0xLjQsMC4zLTEuOSwxYy0wLjQsMC41LTAuNiwxLjEtMC43LDEuOEwxMjYuMywyOC41TDEyNi4zLDI4LjV6XCI+PC9wYXRoPjwvZz48Zz48Zz48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNDIuOCwxNC45Yy0wLjcsMC0xLjIsMC0xLjctMC4xVjcuNmMwLjYtMC4xLDEuMy0wLjIsMi0wLjJjMi43LDAsNCwxLjMsNCwzLjVcXG4gICAgICAgICAgICAgICAgICAgICAgICBDNDcuMSwxMy41LDQ1LjYsMTQuOSw0Mi44LDE0Ljl6IE00My4yLDguNGMtMC40LDAtMC43LDAtMC45LDAuMXY1LjVjMC4xLDAsMC40LDAsMC44LDBjMS44LDAsMi44LTEsMi44LTIuOVxcbiAgICAgICAgICAgICAgICAgICAgICAgIEM0NS44LDkuMyw0NC45LDguNCw0My4yLDguNHpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTUxLDE0LjljLTEuNSwwLTIuNS0xLjEtMi41LTIuN2MwLTEuNiwxLTIuOCwyLjYtMi44YzEuNSwwLDIuNSwxLjEsMi41LDIuN1xcbiAgICAgICAgICAgICAgICAgICAgICAgIEM1My42LDEzLjgsNTIuNSwxNC45LDUxLDE0Ljl6IE01MSwxMC4zYy0wLjgsMC0xLjQsMC44LTEuNCwxLjljMCwxLjEsMC42LDEuOSwxLjQsMS45YzAuOCwwLDEuNC0wLjgsMS40LTEuOVxcbiAgICAgICAgICAgICAgICAgICAgICAgIEM1Mi40LDExLjEsNTEuOCwxMC4zLDUxLDEwLjN6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk02Mi40LDkuNmwtMS42LDUuM2gtMS4xTDU5LDEyLjVjLTAuMi0wLjYtMC4zLTEuMS0wLjQtMS43aDBjLTAuMSwwLjYtMC4yLDEuMS0wLjQsMS43bC0wLjcsMi4zaC0xLjFcXG4gICAgICAgICAgICAgICAgICAgICAgICBsLTEuNS01LjNoMS4ybDAuNiwyLjVjMC4xLDAuNiwwLjMsMS4yLDAuNCwxLjdoMGMwLjEtMC40LDAuMi0xLDAuNC0xLjdsMC43LTIuNWgxbDAuNywyLjVjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdoMFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGMwLjEtMC41LDAuMi0xLjEsMC40LTEuN2wwLjYtMi41TDYyLjQsOS42TDYyLjQsOS42elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNjguNCwxNC44aC0xLjJ2LTNjMC0wLjktMC40LTEuNC0xLjEtMS40Yy0wLjcsMC0xLjIsMC42LTEuMiwxLjN2My4xaC0xLjJ2LTMuOGMwLTAuNSwwLTEsMC0xLjVoMVxcbiAgICAgICAgICAgICAgICAgICAgICAgIGwwLjEsMC44aDBjMC4zLTAuNiwxLTAuOSwxLjctMC45YzEuMSwwLDEuOCwwLjgsMS44LDIuMkw2OC40LDE0LjhMNjguNCwxNC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNzEuNiwxNC44aC0xLjJWNy4xaDEuMlYxNC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNNzUuOSwxNC45Yy0xLjUsMC0yLjUtMS4xLTIuNS0yLjdjMC0xLjYsMS0yLjgsMi42LTIuOGMxLjUsMCwyLjUsMS4xLDIuNSwyLjdcXG4gICAgICAgICAgICAgICAgICAgICAgICBDNzguNSwxMy44LDc3LjUsMTQuOSw3NS45LDE0Ljl6IE03NS45LDEwLjNjLTAuOCwwLTEuNCwwLjgtMS40LDEuOWMwLDEuMSwwLjYsMS45LDEuNCwxLjljMC44LDAsMS40LTAuOCwxLjQtMS45XFxuICAgICAgICAgICAgICAgICAgICAgICAgQzc3LjMsMTEuMSw3Ni44LDEwLjMsNzUuOSwxMC4zelwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNODMuMSwxNC44TDgzLDE0LjJoMGMtMC40LDAuNS0wLjksMC43LTEuNSwwLjdjLTAuOSwwLTEuNi0wLjctMS42LTEuNWMwLTEuMywxLjEtMiwzLjEtMnYtMC4xXFxuICAgICAgICAgICAgICAgICAgICAgICAgYzAtMC43LTAuNC0xLTEuMS0xYy0wLjUsMC0xLDAuMS0xLjQsMC40bC0wLjItMC44YzAuNS0wLjMsMS4xLTAuNSwxLjgtMC41YzEuNCwwLDIuMSwwLjcsMi4xLDIuMnYxLjljMCwwLjUsMCwwLjksMC4xLDEuM1xcbiAgICAgICAgICAgICAgICAgICAgICAgIEw4My4xLDE0LjhMODMuMSwxNC44eiBNODMsMTIuMmMtMS4zLDAtMS45LDAuMy0xLjksMS4xYzAsMC42LDAuMywwLjgsMC44LDAuOGMwLjYsMCwxLjEtMC41LDEuMS0xLjFWMTIuMnpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTg5LjgsMTQuOEw4OS43LDE0aDBjLTAuMywwLjYtMC45LDEtMS43LDFjLTEuMywwLTIuMi0xLjEtMi4yLTIuN2MwLTEuNiwxLTIuOCwyLjMtMi44XFxuICAgICAgICAgICAgICAgICAgICAgICAgYzAuNywwLDEuMiwwLjIsMS41LDAuN2gwdi0zaDEuMnY2LjNjMCwwLjUsMCwxLDAsMS40SDg5Ljh6IE04OS42LDExLjdjMC0wLjctMC41LTEuNC0xLjItMS40Yy0wLjksMC0xLjQsMC44LTEuNCwxLjhcXG4gICAgICAgICAgICAgICAgICAgICAgICBjMCwxLjEsMC41LDEuOCwxLjQsMS44YzAuNywwLDEuMy0wLjYsMS4zLTEuNFYxMS43elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNOTguMiwxNC45Yy0xLjUsMC0yLjUtMS4xLTIuNS0yLjdjMC0xLjYsMS0yLjgsMi42LTIuOGMxLjUsMCwyLjUsMS4xLDIuNSwyLjdcXG4gICAgICAgICAgICAgICAgICAgICAgICBDMTAwLjgsMTMuOCw5OS44LDE0LjksOTguMiwxNC45eiBNOTguMiwxMC4zYy0wLjgsMC0xLjQsMC44LTEuNCwxLjljMCwxLjEsMC42LDEuOSwxLjQsMS45YzAuOCwwLDEuNC0wLjgsMS40LTEuOVxcbiAgICAgICAgICAgICAgICAgICAgICAgIEM5OS42LDExLjEsOTkuMSwxMC4zLDk4LjIsMTAuM3pcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTEwNy4xLDE0LjhoLTEuMnYtM2MwLTAuOS0wLjQtMS40LTEuMS0xLjRjLTAuNywwLTEuMiwwLjYtMS4yLDEuM3YzLjFoLTEuMnYtMy44YzAtMC41LDAtMSwwLTEuNWgxXFxuICAgICAgICAgICAgICAgICAgICAgICAgbDAuMSwwLjhoMGMwLjMtMC42LDEtMC45LDEuNy0wLjljMS4xLDAsMS44LDAuOCwxLjgsMi4yVjE0Ljh6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMTUsMTAuNGgtMS4zVjEzYzAsMC43LDAuMiwxLDAuNywxYzAuMiwwLDAuNCwwLDAuNS0wLjFsMCwwLjljLTAuMiwwLjEtMC41LDAuMS0wLjksMC4xXFxuICAgICAgICAgICAgICAgICAgICAgICAgYy0wLjksMC0xLjUtMC41LTEuNS0xLjh2LTIuN2gtMC44VjkuNmgwLjh2LTFsMS4xLTAuM3YxLjNoMS4zVjEwLjR6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0xMjEuMSwxNC44SDEyMHYtM2MwLTAuOS0wLjQtMS40LTEuMS0xLjRjLTAuNiwwLTEuMiwwLjQtMS4yLDEuMnYzLjJoLTEuMlY3LjFoMS4ydjMuMmgwXFxuICAgICAgICAgICAgICAgICAgICAgICAgYzAuNC0wLjYsMC45LTAuOSwxLjYtMC45YzEuMSwwLDEuOCwwLjksMS44LDIuMlYxNC44elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNMTI3LjUsMTIuNUgxMjRjMCwxLDAuNywxLjYsMS43LDEuNmMwLjUsMCwxLTAuMSwxLjQtMC4ybDAuMiwwLjhjLTAuNSwwLjItMS4xLDAuMy0xLjgsMC4zXFxuICAgICAgICAgICAgICAgICAgICAgICAgYy0xLjYsMC0yLjYtMS0yLjYtMi43YzAtMS42LDEtMi44LDIuNS0yLjhjMS4zLDAsMi4yLDEsMi4yLDIuNUMxMjcuNSwxMi4xLDEyNy41LDEyLjMsMTI3LjUsMTIuNXogTTEyNi40LDExLjZcXG4gICAgICAgICAgICAgICAgICAgICAgICBjMC0wLjgtMC40LTEuNC0xLjItMS40Yy0wLjcsMC0xLjIsMC42LTEuMywxLjRIMTI2LjR6XCI+PC9wYXRoPjwvZz48L2c+PC9nPjwvZz48L3N2Zz48L2Rpdj48ZGl2IGNsYXNzPVwiUGxheWVyVUlcIj48ZGl2IGNsYXNzPVwicGxheS1wYXVzZVwiPjxkaXYgY2xhc3M9XCJwbGF5XCI+PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjE3LjZweFwiIGhlaWdodD1cIjIwcHhcIiB2aWV3Ym94PVwiMCAwIDE3LjYgMjBcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMTcuNiAyMFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGRlZnM+PC9kZWZzPjxwb2x5Z29uIGZpbGw9XCIjRkZGRkZGXCIgcG9pbnRzPVwiMCwwIDE3LjYsMTAgMCwyMCBcIj48L3BvbHlnb24+PC9zdmc+PC9kaXY+PGRpdiBjbGFzcz1cInBhdXNlXCI+PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjIwcHhcIiBoZWlnaHQ9XCIxOS44cHhcIiB2aWV3Ym94PVwiMCAwIDIwIDE5LjhcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMjAgMTkuOFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGRlZnM+PC9kZWZzPjxyZWN0IHk9XCIwXCIgZmlsbD1cIiNGRkZGRkZcIiB3aWR0aD1cIjdcIiBoZWlnaHQ9XCIxOS44XCI+PC9yZWN0PjxyZWN0IHg9XCIxM1wiIHk9XCIwXCIgZmlsbD1cIiNGRkZGRkZcIiB3aWR0aD1cIjdcIiBoZWlnaHQ9XCIxOS44XCI+PC9yZWN0Pjwvc3ZnPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJtdXRlXCI+PGRpdiBjbGFzcz1cInNvdW5kT25cIj48c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeG1sbnM6YT1cImh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVTVkdWaWV3ZXJFeHRlbnNpb25zLzMuMC9cIiB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiMzFweFwiIGhlaWdodD1cIjI0LjVweFwiIHZpZXdib3g9XCIwIDAgMzEgMjQuNVwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCAzMSAyNC41XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48ZGVmcz48L2RlZnM+PGc+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTI1LjgsMjQuNWMtMC4yLDAtMC41LTAuMS0wLjctMC4zYy0wLjQtMC40LTAuNC0xLDAtMS40YzIuNS0yLjYsMy45LTYuNSwzLjktMTAuNWMwLTQuMS0xLjQtNy45LTMuOS0xMC41IGMtMC40LTAuNC0wLjQtMSwwLTEuNGMwLjQtMC40LDEtMC40LDEuNCwwYzIuOSwzLDQuNSw3LjMsNC41LDExLjlzLTEuNiw4LjktNC41LDExLjlDMjYuMywyNC40LDI2LjEsMjQuNSwyNS44LDI0LjV6XCI+PC9wYXRoPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0yMi41LDIxLjRjLTAuMywwLTAuNS0wLjEtMC43LTAuM2MtMC40LTAuNC0wLjQtMSwwLTEuNGMxLjgtMS44LDIuOS00LjUsMi45LTcuNGMwLTIuOS0xLjEtNS42LTIuOS03LjQgYy0wLjQtMC40LTAuNC0xLDAtMS40YzAuNC0wLjQsMS0wLjQsMS40LDBjMi4yLDIuMiwzLjUsNS40LDMuNSw4LjljMCwzLjUtMS4zLDYuNy0zLjUsOC45QzIzLDIxLjMsMjIuNywyMS40LDIyLjUsMjEuNHpcIj48L3BhdGg+PHBhdGggZmlsbD1cIiNGRkZGRkZcIiBkPVwiTTE5LjIsMTguMmMtMC4zLDAtMC42LTAuMS0wLjgtMC40Yy0wLjQtMC40LTAuMy0xLjEsMC4xLTEuNGMxLjEtMC45LDEuOC0yLjUsMS44LTQuMiBjMC0xLjctMC43LTMuMy0xLjgtNC4zYy0wLjQtMC4zLTAuNS0xLTAuMS0xLjRjMC4zLTAuNCwxLTAuNSwxLjQtMC4xYzEuNiwxLjMsMi42LDMuNSwyLjYsNS44YzAsMi4zLTAuOSw0LjUtMi41LDUuOCBDMTkuNiwxOC4yLDE5LjQsMTguMiwxOS4yLDE4LjJ6XCI+PC9wYXRoPjxwb2x5Z29uIGZpbGw9XCIjRkZGRkZGXCIgcG9pbnRzPVwiNC42LDYuNiAwLDYuNiAwLDE3LjkgNC42LDE3LjkgMTMuMSwyNC4yIDEzLjEsMC4yIFxcdFwiPjwvcG9seWdvbj48L2c+PC9zdmc+PC9kaXY+PGRpdiBjbGFzcz1cInNvdW5kT2ZmXCI+PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhtbG5zOmE9XCJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjMxLjRweFwiIGhlaWdodD1cIjI0cHhcIiB2aWV3Ym94PVwiMCAwIDMxLjQgMjRcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMzEuNCAyNFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGRlZnM+PC9kZWZzPjxnPjxwb2x5Z29uIGZpbGw9XCIjRkZGRkZGXCIgcG9pbnRzPVwiNC42LDYuMyAwLDYuMyAwLDE3LjcgNC42LDE3LjcgMTMuMSwyNCAxMy4xLDAgXFx0XCI+PC9wb2x5Z29uPjxwYXRoIGZpbGw9XCIjRkZGRkZGXCIgZD1cIk0zMC42LDE3LjljLTAuMiwwLTAuNC0wLjEtMC42LTAuM2wtMTEtMTFjLTAuMy0wLjMtMC4zLTAuOSwwLTEuMnMwLjktMC4zLDEuMiwwbDExLDExIGMwLjMsMC4zLDAuMywwLjksMCwxLjJDMzEsMTcuOSwzMC44LDE3LjksMzAuNiwxNy45elwiPjwvcGF0aD48cGF0aCBmaWxsPVwiI0ZGRkZGRlwiIGQ9XCJNMTkuNSwxNy45Yy0wLjIsMC0wLjQtMC4xLTAuNi0wLjNjLTAuMy0wLjMtMC4zLTAuOSwwLTEuMmwxMS0xMWMwLjMtMC4zLDAuOS0wLjMsMS4yLDBzMC4zLDAuOSwwLDEuMiBsLTExLDExQzIwLDE3LjksMTkuOCwxNy45LDE5LjUsMTcuOXpcIj48L3BhdGg+PC9nPjwvc3ZnPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pic7XG5cbn1cbnJldHVybiBfX3Bcbn07IiwidmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG5vYmogfHwgKG9iaiA9IHt9KTtcbnZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbndpdGggKG9iaikge1xuX19wICs9ICc8ZGl2IGNsYXNzPVwicHJlbG9hZC1pbm5lclwiPjxkaXYgY2xhc3M9XCJwZXJjZW50YWdlXCI+PC9kaXY+PC9kaXY+JztcblxufVxucmV0dXJuIF9fcFxufTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcbm9iaiB8fCAob2JqID0ge30pO1xudmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xud2l0aCAob2JqKSB7XG5fX3AgKz0gJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj48L2Rpdj4nO1xuXG59XG5yZXR1cm4gX19wXG59OyJdfQ==
