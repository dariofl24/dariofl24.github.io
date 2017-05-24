var JS_ROOT_PATH = $('script[src*="app.js"]').attr('src').replace('app.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_site.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/app.js"></script>');
