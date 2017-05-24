/*global _, window*/
(function(app, $) {

    function getDateHidden(parentContainer) {
        return parentContainer.find(".date-input-hidden");
    }

    function getDateInputContainer(parentContainer) {
        return parentContainer.find(".input-container");
    }

    function getDateSelectBoxes(parentContainer) {
        return parentContainer.find(".date-select-box").find("select");
    }

    function partsToDate(year, month, day) {
        var date = null;
        if (year && month && day) {
            date = new Date(year, month - 1, day);
            date.setHours(0, 0, 0, 0);
        }
        return date;
    }

    function partsToString(year, month, day) {
        return _.sprintf("%02d/%02d/%04d", month, day, year);
    }

    function stringToParts(str) {
        return str ? str.split("/") : [];
    }

    function dateToString(date) {
        return partsToString(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    function stringToDate(str) {
        var parts = stringToParts(str);
        if (parts.length === 3) {
            var month = parseInt(parts[0], 10),
                day = parseInt(parts[1], 10),
                year = parseInt(parts[2], 10);

            return partsToDate(year, month, day);
        }
        return null;
    }

    function isValidDate(year, month, day) {
        var date = partsToDate(year, month, day);
        return (date && date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year);
    }

    function setDateSelectBoxesValue(parentContainer, date) {
        if (date) {
            var selectBoxes = getDateSelectBoxes(parentContainer);
            selectBoxes.filter("#month").val(date.getMonth() + 1);
            selectBoxes.filter("#day").val(date.getDate());
            selectBoxes.filter("#year").val(date.getFullYear());
        }
    }

    function getDateSelectBoxesValue(parentContainer) {
        var selectBoxes = getDateSelectBoxes(parentContainer);
        var month = parseInt(selectBoxes.filter("#month").val(), 10),
            day = parseInt(selectBoxes.filter("#day").val(), 10),
            year = parseInt(selectBoxes.filter("#year").val(), 10);

        return isValidDate(year, month, day) ? partsToDate(year, month, day) : null;
    }

    function setDateInputValue(parentContainer, date) {
        var dateInputContainer = getDateInputContainer(parentContainer);
        var dateHidden = getDateHidden(parentContainer);
        if (date) {
            var dateStr = dateToString(date);
            dateHidden.val(dateStr);
            dateInputContainer.removeClass("error");
        } else {
            dateHidden.val("");
            dateInputContainer.addClass("error");
        }

        //TODO: to be made non-conditional and all the references of this class to be deleted once the Login or Register form will be migrated to parsley
        if (dateHidden.hasClass("validated-by-parsley")) {
            dateHidden.parsley("validate");
        }
    }

    function getDateInputValue(parentContainer) {
        var dateStr = getDateHidden(parentContainer).val();
        return stringToDate(dateStr);
    }

    function setDateSelectValue(parentContainer, date) {
        setDateSelectBoxesValue(parentContainer, date);
        setDateInputValue(parentContainer, date);
    }

    function getDateSelectValue(parentContainer) {
        return getDateSelectBoxesValue(parentContainer);
    }

    function bindDateSelectBoxes(parentContainer, selectBoxes) {
        selectBoxes.change(function() {
            var date = getDateSelectValue(parentContainer);
            setDateInputValue(parentContainer, date);
        });
    }

    function syncDateSelectComponent(parentContainer) {
        var date = getDateInputValue(parentContainer);
        setDateSelectBoxesValue(parentContainer, date);
    }

    function registerDateSelectComponent(parentContainer) {
        var selectBoxes = getDateSelectBoxes(parentContainer);
        bindDateSelectBoxes(parentContainer, selectBoxes);
        syncDateSelectComponent(parentContainer);
    }

    app.dateSelectComponent = {
        registerDateSelectComponent: registerDateSelectComponent,
        getDateSelectValue: getDateSelectValue,
        setDateSelectValue: setDateSelectValue
    };

}(window.app = window.app || {}, jQuery));
