

var JS_ROOT_PATH = $('script[src*="onload_footer_UI.js"]').attr('src').replace('onload_footer_UI.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_footer.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_footer_UI.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_footer_UI.js"></script>');
