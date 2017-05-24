/* global window */

// jquery extensions
(function($) {
    // params
    // toggleClass - required
    // triggerSelector - optional. the selector for the element that triggers the event handler. defaults to the child elements of the list.
    // eventName - optional. defaults to 'click'
    $.fn.toggledList = function(options) {
        if (!options.toggleClass) {
            return this;
        }

        var list = this;

        function handleToggle(e) {
            e.preventDefault();
            var classTarget = options.triggerSelector ? $(this).parent() : $(this);
            classTarget.toggleClass(options.toggleClass);
            // execute callback if exists
            if (options.callback) {
                options.callback();
            }
        }

        return list.on(options.eventName || "click", options.triggerSelector || list.children(), handleToggle);
    };

    $.fn.syncHeight = function() {
        function sortHeight(a, b) {
            return $(a).height() - $(b).height();
        }

        var arr = $.makeArray(this);
        arr.sort(sortHeight);
        return this.height($(arr[arr.length - 1]).height());
    };

    $.timer = function(timeout) {
        var deferred = $.Deferred();
        var promise = deferred.promise();

        var internalTimer = null;
        var resolveContext = this;
        var resolveArguments = Array.prototype.slice.call(arguments, 1);

        promise.clear = function () {
            window.clearTimeout(internalTimer);

            deferred.rejectWith(
                resolveContext,
                resolveArguments
            );
        };

        internalTimer = window.setTimeout(
            function () {
                deferred.resolveWith(
                    resolveContext,
                    resolveArguments
                );
                window.clearTimeout(internalTimer);
            },
            timeout
        );
        return deferred;
    };

    $.fn.switchEvent = (function() {

        function switch_1(eventName, handler) {
            this.off(eventName);
            this.on(eventName, handler);
        }

        function switch_2(eventName, selector, handler) {
            this.off(eventName, selector);
            this.on(eventName, selector, handler);
        }

        return function() {
            var args = Array.prototype.slice.call(arguments);

            if(args.length === 2) {
                switch_1.apply(this, args);
            } else if(args.length === 3) {
                switch_2.apply(this, args);
            }
            return this;
        };

    }());

}(jQuery));

// general extension functions
(function() {
    String.format = function(s) {
        /*var arg1 = 0;*/
        /*var s = arguments[arg1];*/
        var i, len = arguments.length - 1;
        for (i = 0; i < len; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    };
}());

jQuery.fn.exists = function() {
    return this.length > 0;
};

/*bugfix for toggleClass jqueryUI extension
the jquery ui animated toggle did not
work on the first click
if there was not a class defined already
for the element. this fixes that*/
jQuery.fn.extend({
        toggleClass: (function(orig) {
            return function(classNames, force, speed, easing, callback) {
                if (!this.attr("class")) {
                    this.attr("class", "");
                }

                if (typeof force === "boolean" || force === undefined) {
                    if (!speed) {
                        // without speed parameter
                        return orig.apply(this, arguments);
                    } else {
                        return jQuery.effects.animateClass.call(this, (force ? {
                                    add: classNames
                                } : {
                                    remove: classNames
                                }),
                            speed, easing, callback);
                    }
                } else {
                    // without force parameter
                    return jQuery.effects.animateClass.call(this, {
                            toggle: classNames
                        }, force, speed, easing);
                }
            };
        }(jQuery.fn.toggleClass))
    });
