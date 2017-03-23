
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

var FaceBook_feature= (function() {

    var thisvar ='Feature cont !!!';
    var $cache = {};

    var init = function(){
        initElements();
        loadSDK();
        bindEvents();
    };

    var initElements = function(){
        $cache.facebook_url="https://www.facebook.com/";
        $cache.loginButton = $('#loginbuton');
        $cache.userSection = $('#userCont');
        $cache.userNameSpan = $('#userCont #userName');
        $cache.logoutButton = $('#userCont #logout');
        $cache.profileButton = $('#userCont #profile');
        $cache.garageButton = $('#userCont #garage');
        $cache.user= {id:'',name:'',email:''};

    };

    var loadSDK = function(){

        $.ajaxSetup({ cache: true });
        
        $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
            FB.init({
                appId: '1812415742342004',
                version: 'v2.7'
            });

            $('#loginbutton,#feedbutton').removeAttr('disabled');

            FB.getLoginStatus(function(response) {
                updateStatusCallback(response);
            });
        });

    };

    var bindEvents = function(){

    };

    var updateStatusCallback = function (response){

        console.log("FB SDK LOADED AND INITIATED !!");
        
        if (response.status === 'connected') {

            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            console.log(response.status);
            console.log("+uid: "+uid);
            console.log("+accessToken: "+accessToken);
            
            FB.api('/me',{fields: 'name,email'}, function(resp) {
                $cache.user.name = resp.name; 
                console.log($cache.user.name);
                $cache.user.id = resp.id;
                $cache.user.email = resp.email; 
                console.log($cache.user.email);
                $cache.user.connectionStat= 'connected';
                showUserSection($cache.user.name);
            });

        } else if (response.status === 'not_authorized') {
            console.log(response.status+" - The user is logged in to Facebook,but has not authenticated your app");
            showLoginButton();
            clearUserObj();
        } else {
            console.log(response.status+" - The user isn't logged in to Facebook (CODE 3!)");
            showLoginButton();
            clearUserObj();
        }
    };

    var showUserSection = function(username){
        $cache.loginButton.hide();
        $cache.userSection.show();

        if(username){
            $cache.userNameSpan.text(username);
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
    };

    return {
        init: init,
        fbuser: user;
        AAA: thisvar
    };

})();

var featuresObj = {

    init: function(){ 
        FaceBook_feature.init();
        mySlickInit.init();
    }

};
 
$(document).on('ready',featuresObj.init);
