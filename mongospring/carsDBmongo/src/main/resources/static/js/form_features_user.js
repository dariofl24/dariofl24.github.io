var allFeatures = (function () {

    var $cache = {};

    var restApi_url = "/api/useradmin/";
    var form_url = "/admin/formuser?code=";

    var init = function () {
        initCache();
        bindEvents();
        fillForm();
    };

    var initCache = function () {
        console.log("initCache");

        $cache.action = "create";
    };

    var bindEvents = function () {

        $("#userForm").on("submit", function (event) {
            event.preventDefault();

            var data = new FormData(this);

            if (!validateForm(data)) {
                return;
            }

            var request = {};

            console.log(data);

            request.username = data.get("username");
            request.password = data.get("password");
            request.confirmPassword = data.get("confirmpassword");
            request.enabled = ("on" === data.get("enabled"));

            console.log(request);

            $.ajax({
                method: "POST",
                url: (restApi_url + $cache.action),
                data: JSON.stringify(request),
                processData: false,
                contentType: "application/json"
            }).done(function (msg) {

                alert("Data Saved: " + msg);
                console.log(msg);

                window.location.replace(form_url + msg.username);

            }).fail(function (msg) {
                console.log("Failed");
                console.log(msg);
            });

        });

    };

    var validateForm = function (data) {

        var username_vaid = data.get("username") != null;

        if (username_vaid) {
            $("input.uname").removeClass("validationError");
        } else {
            $("input.uname").addClass("validationError");
        }

        var pwd_valid = data.get("password") === data.get("confirmpassword");

        if (pwd_valid) {
            $("input.pwd").removeClass("validationError");
        } else {
            $("input.pwd").addClass("validationError");
        }

        return pwd_valid && username_vaid;
    }

    var fillForm = function () {

        var jsonString = $("#pjsonvalue").text();

        if (jsonString) {

            var obj = JSON.parse(jsonString);
            console.log(obj);

            $("input#username").val(obj.username);
            $("input#enabled").attr("checked", obj.enabled);

            $cache.action = "update";
        }

    };

    return {
        allinit: init
    };

})();

$(document).on('ready', allFeatures.allinit);
