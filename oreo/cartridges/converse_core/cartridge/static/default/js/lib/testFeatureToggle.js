(function(app) {

    function getFeature(featureName) {
        return {};
    }

    function isFeatureEnabled(featureName) {
        return true;
    }

    app.featuretoggle = {
        Features: {},
        getFeature: getFeature,
        isFeatureEnabled: isFeatureEnabled
    };
}(window.app = window.app || {}));
