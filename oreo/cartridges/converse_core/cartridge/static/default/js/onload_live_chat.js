var JS_ROOT_PATH = $('script[src*="onload_live_chat.js"]').attr('src').replace('onload_live_chat.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_live_chat.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_live_chat.js"></script>');
