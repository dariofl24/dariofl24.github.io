/*global _*/
(function (app, $) {

    var parsleyFormInstance = $("<form></form>").parsley();
    var ParsleyForm = parsleyFormInstance.constructor;

    function ParsleyGroup(parsleyForm, groupName) {
        this.init(parsleyForm, groupName);
    }

    function migrateValidationItems() {
        var groupItems = this.items;
        var groupName = this.name;
        var formValidationItems = this.parsleyForm.items;

        _.each(formValidationItems, function(validationItem) {
            var itemGroup = validationItem.$element.data("group");
            if(itemGroup === groupName) {
                groupItems.push(validationItem);
            }
        });

        this.parsleyForm.items = _.difference(formValidationItems, groupItems);    
    }

    function initParsleyGroup(parsleyForm, groupName) {
        this.parsleyForm = parsleyForm;
        this.name  = groupName;
        this.options = parsleyForm.options;
        this.items = [];

        migrateValidationItems.call(this);    
    }

    $.extend(ParsleyGroup.prototype, {
        init: initParsleyGroup,
        validate: ParsleyForm.prototype.validate,
        addItem: ParsleyForm.prototype.addItem,
        removeItem: ParsleyForm.prototype.removeItem
    });

    function initGroups() {
        this.groups = [];
        var self = this;

        var groupElements = this.$element.find("[data-group]");
        _.chain(groupElements)
            .map(function(groupElement) { 
                return $(groupElement).data("group"); 
            })
            .uniq()
            .each(function(groupName) {
                self.addGroup(groupName); 
            });
    }

    function addGroup(groupName) {
        if(!_.has(this.groups, groupName)) {
            this.groups.push(new ParsleyGroup(this, groupName));
        }
    }

    function getGroup(groupName) {
        for(var i = 0, len = this.groups.length; i < len; i++) {
            if(this.groups[i].name === groupName) {
                return this.groups[i];
            }
        }
        return null;
    }

    function bindSubmitSources() {
        var self = this;
        var form = this.$element;

        form.on("keypress", this.options.inputs, function(e) {
            if (e.which === 13) {
                var groupName = $(e.currentTarget).data("group");
                if(groupName) {
                    var groupSubmitAction = form.find(_.sprintf("[data-group='%s']:submit", groupName));
                    if(groupSubmitAction.exists()) {
                        e.preventDefault();
                        groupSubmitAction.click();
                    }
                }
            }
        });

        form.on("click", ":submit", function(e) {
            var submitAction = $(e.currentTarget);
            self.submitedGroup = submitAction.data("group");
        });
    }

    var __init = ParsleyForm.prototype.init;
    function init(element, options, type) {
        __init.call(this, element, options, type);
        this.bindSubmitSources();
        this.initGroups();
    }

    var __validate = ParsleyForm.prototype.validate;
    function validate(event) {
        if(this.submitedGroup) {
            var group = this.getGroup(this.submitedGroup);
            return group.validate();
        }
        return __validate.call(this, event);
    }

    function initParsleyFormObject() {
        $.extend(ParsleyForm.prototype, {
            init: init,
            validate: validate,
            bindSubmitSources: bindSubmitSources,
            initGroups: initGroups,
            getGroup: getGroup,
            addGroup: addGroup
        });
    }

    app.parsleyForm = {
        init: function() {
            initParsleyFormObject();
        }
    };

}(window.app = window.app || {}, jQuery));
