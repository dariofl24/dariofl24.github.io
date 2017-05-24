/*global $, app*/
$.hisrc.speedTest();
$(document).ready(function() {
    $("img.adaptive").hisrc({
        useTransparentGif: true
    });

    app.tabs.tabify(".tabified");
    app.footer.init();
});
