

var JS_ROOT_PATH = $('script[src*="onload_id_react_builder.js"]').attr('src').replace('onload_id_react_builder.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_id_react_builder.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/onload_id_react_builder.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_id_react_builder.js"></script>');
