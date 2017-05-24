var JS_ROOT_PATH = $('script[src*="onload_store_locator.js"]').attr('src').replace('onload_store_locator.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_store_locator.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_store_locator.js"></script>');
