
var mySlickInit = {

    init: function() {
        console.log("mySlickInit !!!!");
        $("section.regular").slick({
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        fade: true,
        arrows: true,
        autoplaySpeed: 4000,
        cssEase: 'linear'
      });

        $("section.featureshow").slick({
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        fade: true,
        arrows: false,
        autoplaySpeed: 3000,
        cssEase: 'linear'
      });

    }

};

var FB_USER;

var FaceBook_feature= (function($FB_USER) {

    var thisvar ='Feature cont !!!';
    var $cache = {};
    var myuser = {};

    var init = function(){
        var deferredObject = $.Deferred();

        initElements();
        loadSDK(deferredObject);
        bindEvents();

        return deferredObject.promise();
    };

    var initElements = function(){
        $cache.facebook_url="https://www.facebook.com/";
        $cache.loginButton = $('#loginbuton');
        $cache.userSection = $('#userCont');
        $cache.userNameSpan = $('#userCont #userName');
        $cache.logoutButton = $('#userCont #logout');
        $cache.profileButton = $('#userCont #profile');
        //$cache.garageButton = $('#userCont #garage');
        $cache.usericonhover = $('.usericon.hover');
        $cache.usericonnohover = $('.usericon.nohover');
        $cache.userpic = $('.userpic');
        $cache.user = {id:'',name:'',email:''};
        myuser = {};
    };

    var loadSDK = function(deferredObject){

        $.ajaxSetup({ cache: true });
        
        $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
            FB.init({
                appId: '1812415742342004',
                version: 'v2.8'
            });

            $('#loginbutton,#feedbutton').removeAttr('disabled');

            FB.getLoginStatus(function(response) {
                updateStatusCallback(response,deferredObject);
            });

        });

    };

    var bindEvents = function(){
        $cache.loginButton.click(performFBLogin);
        $cache.logoutButton.click(performFBLogout);
    };

    var performFBLogin = function(){
        console.log("Login !!!");

        FB.login(updateStatusCallback1, {scope: 'public_profile,email'});

    };

    var performFBLogout = function(){
        console.log("Logout ...");

        FB.logout(updateStatusCallback1);

    };

    var updateStatusCallback1 = function (response){
        var mock = {
            resolve: function(){
                console.log("Done !!!");
            }
        };

        updateStatusCallback(response,mock);

    };

    var updateStatusCallback = function (response,deferredObject){

        console.log("FB SDK LOADED AND INITIATED !!");
        
        if (response.status === 'connected') {

            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            console.log(response.status);
            console.log("+uid: "+uid);
            console.log("+accessToken: "+accessToken);
            
            FB.api('/me',{fields: 'name,email,picture'}, function(resp) {
                $cache.user.name = resp.name; 
                console.log($cache.user.name);
                $cache.user.id = resp.id;
                $cache.user.email = resp.email; 
                console.log($cache.user.email);
                console.log(resp.picture.data.url);
                $cache.user.connectionStat= 'connected';
                $FB_USER = $cache.user;
                myuser.name= resp.name; 
                showUserSection($cache.user.name,resp.picture.data.url);

                deferredObject.resolve();
            });

        } else if (response.status === 'not_authorized') {

            console.log(response.status+" - The user is logged in to Facebook,but has not authenticated your app");
            showLoginButton();
            clearUserObj();
            deferredObject.resolve();

        } else {

            console.log(response.status+" - The user isn't logged in to Facebook (CODE 3!)");
            showLoginButton();
            clearUserObj();
            deferredObject.resolve();

        }//if - else 
    };

    var showUserSection = function(username,picture){
        $cache.loginButton.hide();
        $cache.userSection.show();

        if(username){
            $cache.userNameSpan.text(username);
        }

        if(picture){

            $cache.usericonhover.removeClass('hover');
            $cache.usericonnohover.removeClass('nohover');
            $cache.usericonhover.hide();
            $cache.usericonnohover.hide();
            $cache.userpic.attr('src',picture);
            $cache.userpic.show();

        }else{
            $cache.usericonhover.addClass('hover');
            $cache.usericonnohover.addClass('nohover');
            $cache.usericonhover.show();
            $cache.usericonnohover.hide();
        }
    };

    var showLoginButton = function(){
        $cache.loginButton.show();
        $cache.userSection.hide();
    };

    var clearUserObj = function(){
        $cache.user.name = '';
        $cache.user.id = '';
        $cache.user.email = '';
        $cache.user.connectionStat= '';
        $cache.userNameSpan.text('');
        $FB_USER = $cache.user;
    };

    var getUser = function(){
        console.log("IN function::: "+$cache.user.name);
        return $cache.user;
    };

    return {
        init: init,
        getuser: getUser,
        AAA: thisvar,
        FBUSER: $FB_USER,
        cache: $cache,
        myuser: myuser
    };

})(FB_USER || {});


var MyGarage_feature= (function() {

    var garageURL = "https://dariofl24.github.io/mysupercars/user/garage.html";
    var $cache = {};

    var init = function(){
        initElements();
        bindEvents();

        console.log("GARAGE - Feature LOADED !!!!");
    };

    var initElements = function(){
        $cache.garageButton = $('#userCont #garage');
        $cache.garageserviceURL = 'http://localhost:8080/MyWebApp/GarageService';
        $cache.listContainer = $('#garageList');
        $cache.blocker = $('div.blocker');
    };

    var bindEvents = function(){

      $cache.garageButton.click( function(){
        console.log("==== garage :: "+FaceBook_feature.getuser().name);
        $(location).attr('href',garageURL);
      });

    };

    var loadGarage = function (){

        if( $('#mygarage').length > 0 ){

            console.log("+++ IN GARAGE");

            $.post($cache.garageserviceURL,{
                id: FaceBook_feature.getuser().id,
                name: FaceBook_feature.getuser().name,
                email: FaceBook_feature.getuser().email
            },
            function(data, status){
                console.log("Data: " + data + "\nStatus: " + status);

                if(status == 200){

                    $cache.blocker.hide();
                    $cache.listContainer.html(data);

                }else{
                    console.log("THERE IS NO GARAGE");
                    $cache.listContainer.html("<li> <p>There is no garage for the current user</p> </li>");
                }

            });

        }else{
            console.log("--- NOT IN GARAGE")
        }//if - else

    };

    return {
        init: init
    };

})();

var allFeatures = (function() { 

    var init = function(){

        mySlickInit.init();

        FaceBook_feature.init().done(function () {

            console.log("Executed after a delay");
            console.log("**** FB User::: "+ FaceBook_feature.getuser().name + " - "+ FaceBook_feature.cache.user.name 
            + " + " + FaceBook_feature.FBUSER.name + " + "+ FaceBook_feature.myuser.name);

            initSync();
        });

    };

    var initSync = function(){
        MyGarage_feature.init();

        initLast();
    };

    var initLast = function(){
        MyGarage_feature.loadGarage();
    };

    return {

        allinit: init

    };

})();


 
$(document).on('ready',allFeatures.allinit);
