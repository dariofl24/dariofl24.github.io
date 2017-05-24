


var JS_ROOT_PATH = $('script[src*="onload_tooltips.js"]').attr('src').replace('onload_tooltips.js','');
document.write('<script src="' + JS_ROOT_PATH + './lib/jquery/bootstrap-tooltip.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/conv_tooltips.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_tooltips.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_tooltips.js"></script>');
