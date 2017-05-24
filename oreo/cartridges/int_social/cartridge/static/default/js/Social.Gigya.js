/*******************************************************************
 *
 *  Contains global setup and common utility script methods
 *
 ******************************************************************/

if (typeof(Social) == 'undefined') {
    Social = {};
}

Social.Gigya = new function () {

    var _this = this;
    var _socialLoginSuccessUrl = null;
    var _siteLoginSuccessUrl = null;
    var _siteRegistrationSuccessUrl = null;
    var _logoutUrl = null;

    //constructor
    new function () {
        $(document).bind("ready", initialize);
        $(window).bind("unload", dispose);
    };

    function initialize() {
        _socialLoginSuccessUrl = $('#txtGigyaSocialLoginSuccessUrl').val();
        _siteLoginSuccessUrl = $('#txtGigyaSiteLoginSuccessUrl').val();
        _siteRegistrationSuccessUrl = $('#txtGigyaSiteRegistrationSuccessUrl').val();
        _logoutUrl = $('#txtGigyaLogoutUrl').val();

        setupLoginNotification();
    }

    function constructSocialLoginSuccessUrl(evt) {
        return _socialLoginSuccessUrl +
            '?isSiteUID=' + evt.isSiteUID +
            '&UID=' + encodeURIComponent(evt.UID) +
            '&UIDSignature=' + encodeURIComponent(evt.UIDSignature) +
            '&signatureTimestamp=' + encodeURIComponent(evt.signatureTimestamp);
    }

    function fireEvent(eventType, eventData) {
        $(_this).trigger(eventType, eventData);
    }

    function dispose() {
        _this = null;
    }

    function setupLoginNotification() {
        gigya.socialize.addEventHandlers({
                onLogin: function(evt) {
                    var source = evt.context ? evt.context.source : null;
                    if (source === 'loginPlugin') {
                       performLogin(evt);
                    }
                },
                onLogout: function(evt) {
                }
            }
        );
    }

    function performLogin(evt) {
        var loginSuccessUrl = constructSocialLoginSuccessUrl(evt);
        submitAjaxRequest(loginSuccessUrl)
            .done(function(data, textStatus, jqXHR) {
                fireEvent("login", { data: data });
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                fireEvent("login", { textStatus: textStatus, errorThrown: errorThrown });
            });
    }

    function performLogout() {
        gigya.socialize.logout();
        submitAjaxRequest(_logoutUrl);
    }

    function completeSiteLogin() {
        submitAjaxRequest(_siteLoginSuccessUrl);
    }

    function completeSiteRegistration(UID) {
        submitAjaxRequest(_siteRegistrationSuccessUrl + (UID ? '?UID=' + encodeURIComponent(UID) : ''));
    }

    function submitAjaxRequest(url) {
        return $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true});
    }

    _this.completeSiteLogin = completeSiteLogin;
    _this.completeSiteRegistration = completeSiteRegistration;
    _this.performLogout = performLogout;
};
