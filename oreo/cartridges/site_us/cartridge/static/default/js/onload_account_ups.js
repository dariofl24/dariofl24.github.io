

var JS_ROOT_PATH = $('script[src*="onload_account_ups.js"]').attr('src').replace('onload_account_ups.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_account_ups.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_account_ups.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_account_ups.js"></script>');
