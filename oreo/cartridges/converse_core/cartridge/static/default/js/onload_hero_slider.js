

var JS_ROOT_PATH = $('script[src*="onload_hero_slider.js"]').attr('src').replace('onload_hero_slider.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/hero_slider.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_hero_slider.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_hero_slider.js"></script>');
