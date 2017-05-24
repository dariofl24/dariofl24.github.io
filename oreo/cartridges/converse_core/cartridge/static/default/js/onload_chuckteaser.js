

var JS_ROOT_PATH = $('script[src*="onload_chuckteaser.js"]').attr('src').replace('onload_chuckteaser.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_chuckteaser.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_chuckteaser.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_chuckteaser.js"></script>');
