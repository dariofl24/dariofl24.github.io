

var JS_ROOT_PATH = $('script[src*="onload_qrcode.js"]').attr('src').replace('onload_qrcode.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_qrcode.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_qrcode.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_qrcode.js"></script>');
