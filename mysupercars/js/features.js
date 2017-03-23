
var faceBookIntegrator = {


    init :function(){
        this.initElements();
        this.loadSDK();
        this.bindEvents();
    },

    initElements: function() {
        this.facebook_url="https://www.facebook.com/";
        this.loginButton = $('#loginbuton');
        this.userSection = $('#userCont');
        this.userNameSpan = $('#userCont #userName');
        this.logoutButton = $('#userCont #logout');
        this.profileButton = $('#userCont #profile');
        this.garageButton = $('#userCont #garage');

        this.user= {
            id:'',
            name:'',
            email:''
        };
    },

    bindEvents: function() {
        this.loginButton.click(this.performFBLogin);
        this.logoutButton.click(this.performFBLogout);
    },

    performFBLogin: function() {
        
        FB.login(function(response) {
           // Person is now logged
          this.updateStatusCallback(response);
        }, {scope: 'public_profile,email'});

    },

    performFBLogout: function() {
        
        FB.logout(function(response) {
           // Person is now logged out
          this.updateStatusCallback(response);
        });

    },

    loadSDK: function() {

        $.ajaxSetup({ cache: true });
        
        $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
            FB.init({
                appId: '1812415742342004',
                version: 'v2.7'
            });

            $('#loginbutton,#feedbutton').removeAttr('disabled');

            FB.getLoginStatus(this.updateStatusCallback);
        });

    },

    updateStatusCallback: function (response){

        console.log("FB SDK LOADED AND INITIATED !!");
        var that = this;
        
        if (response.status === 'connected') {

            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            console.log(response.status);
            console.log("+uid: "+uid);
            console.log("+accessToken: "+accessToken);
            
            FB.api('/me',{fields: 'name,email'}, function(resp) {
                console.log("THIS :: "+that);
                this.user.name = resp.name;
                this.user.id = resp.id;
                this.user.email = resp.email;
                this.user.connectionStat= 'connected';
                this.showUserSection(this.user.name);
            });
            

        } else if (response.status === 'not_authorized') {
            console.log(response.status+" - The user is logged in to Facebook,but has not authenticated your app");
            this.showLoginButton();
            this.clearUserObj();

        } else {
            console.log(response.status+" - The user isn't logged in to Facebook (CODE 3!)");
            this.showLoginButton();
            this.clearUserObj();
        }
    },

    clearUserObj: function(){
        this.user.name = '';
        this.user.id = '';
        this.user.email = '';
        this.user.connectionStat= '';
    },

    showLoginButton: function(){
        this.loginButton.show();
        this.userSection.hide();
    },

    showUserSection: function(userNamet){
        this.loginButton.hide();
        this.userSection.show();

        if(userNamet){
            this.userNameSpan.text(userNamet);
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
