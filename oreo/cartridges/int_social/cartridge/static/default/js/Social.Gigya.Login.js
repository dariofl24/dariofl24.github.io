/*******************************************************************
 *
 *  Invokes the Login.
 *
 ******************************************************************/

if (typeof(Social) == 'undefined') {
    Social = {};
}
if (!Social.Gigya) {
    Social.Gigya = {};
}

Social.Gigya.Login = function (moduleId) {
    var _moduleId = moduleId;

    var _defaultHeight = 17;
    var _defaultWidth = 100;
    var _defaultButtonStyle = 'standard';
    var _defaultButtonSize = 17;

    var _divParams = null;
    var _divContainer = null;
    var _height = _defaultHeight;
    var _width = _defaultWidth;
    var _buttonStyle = _defaultButtonStyle;
    var _buttonSize = _defaultButtonSize;
    var _showTerms = false;
    var _isActive = false;
    var _providers = null;
    var _containerId = null;
    var _loggedIn = false;

    new function () {
        $(document).bind("ready", initialize);
        $(window).bind("unload", dispose);
    };

    function initialize() {
        initializeElements();

        if (_isActive) {
            gigya.socialize.getUserInfo({callback: renderUI});
        }
    }

    function renderUI(response) {
        if (_containerId) {
            _divParams.parent().find('#gigyaLoginContainer').addClass('remove');
        }

        var params = {
            useHTML: true,
            context: { source: 'loginPlugin' },
            height: _height,
            width: _width,
            showTermsLink: _showTerms,
            buttonsStyle: _buttonStyle,
            hideGigyaLink: true,
            enabledProviders: _providers,
            sessionExpiration: 0, //expire when browser closed
            containerID: _divContainer.attr('id'),
            lastLoginIndication: 'none',
            UIConfig: '<config><body><controls><snbuttons buttonsize="' + _buttonSize + '" /></controls></body></config>'
        };

        if (!_loggedIn) {
            gigya.services.socialize.showLoginUI(params);
        }
    }

    function initializeElements() {
        _divParams = $('#divGigyaLoginParams' + _moduleId);
        _divContainer = $('#gigyaLoginContainer' + _moduleId);
        _height = _divParams.find('#txtGigyaLoginHeight').val() || _defaultHeight;
        _width = _divParams.find('#txtGigyaLoginWidth').val() || _defaultWidth;
        _buttonStyle = _divParams.find('#txtGigyaLoginButtonStyle').val() || _defaultButtonStyle;
        _buttonSize = _divParams.find('#txtGigyaLoginButtonSize').val() || _defaultButtonSize;
        _showTerms = _divParams.find('#txtGigyaLoginShowTerms').val() == 'true';
        _isActive = _divParams.find('#txtGigyaActive').val() == 'true';
        _providers = _divParams.find('#txtGigyaLoginProviders').val();
        _containerId = _divParams.find('#txtGigyaLoginContainer').val();
        _loggedIn = _divParams.find('#txtGigyaLoggedIn').val() == 'true';

        //if container is specified, trust the id to be unique
        if (_containerId) {
            _divContainer.addClass('remove');
            _divContainer = $('#' + _containerId);
        }
    }

    function dispose() {
        _divParams = null;
    }
};
