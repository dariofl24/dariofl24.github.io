

var JS_ROOT_PATH = $('script[src*="onload_chuckpromo.js"]').attr('src').replace('onload_chuckpromo.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_chuckpromo.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_chuckpromo.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_chuckpromo.js"></script>');
