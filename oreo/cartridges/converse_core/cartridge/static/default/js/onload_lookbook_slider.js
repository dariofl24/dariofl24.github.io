

var JS_ROOT_PATH = $('script[src*="onload_lookbook_slider.js"]').attr('src').replace('onload_lookbook_slider.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_lookbook_slider.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_lookbook_slider.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_lookbook_slider.js"></script>');
