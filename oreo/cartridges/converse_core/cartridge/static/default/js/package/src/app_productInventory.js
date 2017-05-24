/*global _, window*/
// app.product.inventory
(function(app, $) {

    var msgElement = "<span/>";
    var levelNames;

    function allLevelsAreZero(levels, levelToExcept) {
        var levelExistsAndIsZero = function(levelName) {
            return levels[levelName] === 0;
        };
        return _.chain(levelNames)
            .without(levelToExcept)
            .every(levelExistsAndIsZero)
            .value();
    }

    var inventoryLevels = {
        IN_STOCK: {
            className: "in-stock-msg",
            getMessage: function(data) {
                return allLevelsAreZero(data.levels, "IN_STOCK") ?
                    app.resources.IN_STOCK : data.inStockMsg;
            }
        },

        PREORDER: {
            className: "preorder-msg red",
            getMessage: function(data) {
                return allLevelsAreZero(data.levels, "PREORDER") ?
                    app.resources.PREORDER : data.preOrderMsg;
            }
        },

        BACKORDER: {
            className: "backorder-msg red",
            getMessage: function(data) {
                return data.backOrderMsg;
            }
        },

        NOT_AVAILABLE: {
            className: "not-available-msg red",
            getMessage: function(data) {
                return allLevelsAreZero(data.levels, "NOT_AVAILABLE") ?
                    app.resources.NOT_AVAILABLE : String.format(app.resources.REMAIN_NOT_AVAILABLE, data.levels.NOT_AVAILABLE);
            }
        }
    };

    levelNames = _.keys(inventoryLevels);

    function appendToParentIfNotExists(className, avRoot) {
        var msg = avRoot.find("." + className);
        if (!msg.exists()) {
            msg = $(msgElement).addClass(className).appendTo(avRoot);
        }

        return msg;
    }

    function setAvailabilityMessage(data, avRoot) {
        _.each(inventoryLevels, function(levelInfo, levelName) {
            if (data.levels[levelName] > 0) {
                var availabilityMsg = levelInfo.getMessage(data);
                appendToParentIfNotExists(levelInfo.className, avRoot).text(availabilityMsg);
            }
        });
    }

    function _checkInstockDate(data, avRoot) {
        if (!_.isEmpty(data.inStockDate)) {
            if (data.levels.PREORDER >= 1) {
                var inStockDateMsg = String.format(app.resources.IN_STOCK_DATE, data.inStockDate);
                appendToParentIfNotExists("in-stock-date-msg red", avRoot).text(inStockDateMsg);
            }
        }
    }

    app.productInventory = {
        instockDate: _checkInstockDate,
        setAvailabilityMessage: setAvailabilityMessage
    };

}(window.app = window.app || {}, jQuery));
