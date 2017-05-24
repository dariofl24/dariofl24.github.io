





var JS_ROOT_PATH = $('script[src*="app.emea.js"]').attr('src').replace('app.emea.js','');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_cookie_popup.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_idealPayment_popup.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_nikeSite_popup.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_order_preview.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_email_signup.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/app_emea_modules_init.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/app.emea.js"></script>');
