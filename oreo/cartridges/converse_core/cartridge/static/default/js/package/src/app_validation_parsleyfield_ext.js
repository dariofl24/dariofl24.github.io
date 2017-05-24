/*global _*/
(function (app, $) {

    var parsleyFieldInstance = $("<input></input>").parsley();
    var ParsleyField = parsleyFieldInstance.constructor;

    var __manageValidationResult = ParsleyField.prototype.manageValidationResult;

    function getParsleyFieldValid() {
        return _.all(this.constraints, function(constraint) {
            return constraint.valid;
        });
    }

    function manageWithServerSideErrors() {
        this.constraints["servererror"].valid = false;
        __manageValidationResult.call(this);
        this.constraints["servererror"].valid = true;
        return getParsleyFieldValid.call(this);    
    }

    function manageValidationResult() {
        return _.isUndefined(this.constraints["servererror"]) ? 
            __manageValidationResult.call(this) :
            manageWithServerSideErrors.call(this);
    }

    function applyValidators() {
        var valid = null;

        for (var constraint in this.constraints) {
            if (this.constraints.hasOwnProperty(constraint)) {
                var result = false;

                if (constraint === 'type' && this.constraints[constraint].requirements === 'number') {
                    result = true;
                } else {
                    result = this.Validator.validators[this.constraints[constraint].name](this.val, this.constraints[constraint].requirements, this);
                }

                if ( false === result ) {
                    valid = false;
                    this.constraints[constraint].valid = valid;
                    this.options.listeners.onFieldError(this.element, this.constraints, this);
                } else if ( true === result ) {
                    this.constraints[constraint].valid = true;
                    valid = false !== valid;
                    this.options.listeners.onFieldSuccess(this.element, this.constraints, this);
                }
            }
        }

        return valid;
    }

    function initParsleyFieldObject() {
        $.extend(ParsleyField.prototype, {
            manageValidationResult: manageValidationResult,
            applyValidators: applyValidators
        });
    }

    app.parsleyField = {
        init: function() {
            initParsleyFieldObject();
        }
    };

}(window.app = window.app || {}, jQuery));
