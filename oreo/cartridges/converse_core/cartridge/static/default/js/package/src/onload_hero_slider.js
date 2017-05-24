/*global 
app,
HomepageSlideshow
*/
// initialize app
jQuery(document).ready(function() {
    var slideShow = new HomepageSlideshow(app);    
    slideShow.init(); 
});
