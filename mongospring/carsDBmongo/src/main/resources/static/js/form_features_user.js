var allFeatures = (function() {

    var $cache = {};

    var init = function() {

        initCache();
        bindEvents();
        fillForm();
    };

    var initCache = function() {
        console.log("initCache");

        $cache.logo_url = $("#logo_url");
        $cache.logo_img = $("#logo_img");
        $cache.brandId = $("#id");


    };

    var bindEvents = function() {

        $cache.logo_url.change(function() {

            var url = $(this).val();

            if(url){

                $cache.logo_img.attr('src',url);

            }else{
                $cache.logo_img.attr('src','/images/default/image_not_available_300.jpg');
            }

        });

        $("#userForm").on("submit", function(event) {
            event.preventDefault();

            var data = new FormData(this);
            var request = {};
            console.log(data);
            request.name = data.get("name");
            request.password = data.get("password");
            request.active = data.get("active");

            console.log(request);


            $.ajax({
                method : "POST",
                url : "/api/useradmin/create",
                data : JSON.stringify(request),
                processData : false,
                contentType : "application/json"
            }).done(function(msg) {

                alert("Data Saved: " + msg);
                console.log(msg);

                $cache.brandId.val(msg.id);

                window.location.replace("/admin/formuser?code="+msg.code);

            }).fail(function(msg) {
                console.log("Failed");
                console.log(msg);

            });



        });

    };

    var fillForm = function() {

        var jsonString = $("#pjsonvalue").text();

        if (jsonString) {

            var obj = JSON.parse(jsonString);
            console.log(obj);

            $("#id").val(obj.id);
            $("#name").val(obj.name);
            $("#code").val(obj.code);
            $("#logo_url").val(obj.logo_url);

            if(obj.logo_url){
                $cache.logo_img.attr('src',obj.logo_url);
            }

        }

    };

    return {
        allinit : init
    };

})();

$(document).on('ready', allFeatures.allinit);
