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

    },

    user: {
        id:'',
        name:'',
        email:''
    },

    bindEvents: function() {
        this.loginButton.click(this.performFBLogin);
        this.logoutButton.click(this.performFBLogout);
    },

    performFBLogin: function() {
        var that = this;

        FB.login(function(response) {
           // Person is now logged
          that.updateStatusCallback(response);
        }, {scope: 'public_profile,email'});

    },

    performFBLogout: function() {
        var that = this;

        FB.logout(function(response) {
           // Person is now logged out
          that.updateStatusCallback(response);
        });

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

            FB.getLoginStatus(function(response) {
                that.updateStatusCallback(response,that);
            });
        });

    },

    updateStatusCallback: function (response,that){

        console.log("FB SDK LOADED AND INITIATED !!");
        
        if (response.status === 'connected') {

            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            console.log(response.status);
            console.log("+uid: "+uid);
            console.log("+accessToken: "+accessToken);
            
            FB.api('/me',{fields: 'name,email'}, function(resp) {
                that.user.name = resp.name;
                that.user.id = resp.id;
                that.user.email = resp.email;
                that.user.connectionStat= 'connected';
                that.showUserSection(that.user.name);
            });
            

        } else if (response.status === 'not_authorized') {
            console.log(response.status+" - The user is logged in to Facebook,but has not authenticated your app");
            that.showLoginButton();
            that.clearUserObj();

        } else {
            console.log(response.status+" - The user isn't logged in to Facebook (CODE 3!)");
            that.showLoginButton();
            that.clearUserObj();
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