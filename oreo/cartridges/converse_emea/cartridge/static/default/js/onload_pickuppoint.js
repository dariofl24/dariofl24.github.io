






var JS_ROOT_PATH = $('script[src*="onload_pickuppoint.js"]').attr('src').replace('onload_pickuppoint.js','');
document.write('<script src="' + JS_ROOT_PATH + './lib/gmaps-0.4.21.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/pickuppoints/app_pickuppoint.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/pickuppoints/app_pickuppoint_menu.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/pickuppoints/app_pickuppoint_list.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/pickuppoints/app_pickuppoint_route.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/pickuppoints/app_pickuppoint_map.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/src/pickuppoints/onload_pickuppoint.js"></script>');
document.write('<script src="' + JS_ROOT_PATH + './package/onload_pickuppoint.js"></script>');
