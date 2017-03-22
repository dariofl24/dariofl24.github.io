
var faceBookIntegrator = {

    init: function() {
        this.facebook_url="https://www.facebook.com/";
        this.loadSDK();
    },

    loadSDK: function() {

        var that = this;

        $.ajaxSetup({ cache: true });
        
        $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
            FB.init({
                appId: '1812415742342004',
                version: 'v2.7'
            });

            $('#loginbutton,#feedbutton').removeAttr('disabled');

            FB.getLoginStatus(that.updateStatusCallback);
        });

    },

    updateStatusCallback: function (response){

        console.log("FB SDK LOADED AND INITIATED !!");
        
        if (response.status === 'connected') {
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            console.log(response.status);
            console.log("+uid: "+uid);
            console.log("+accessToken: "+accessToken);
        } else if (response.status === 'not_authorized') {
            console.log(response.status+" - The user is logged in to Facebook,but has not authenticated your app");
        } else {
            console.log(response.status+" - The user isn't logged in to Facebook (CODE 3!)");
        }
    }

}//


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

var featuresObj = {

    init: function(){
        mySlickInit.init();
        faceBookIntegrator.init();
    }

};
 
$(document).on('ready',featuresObj.init);
