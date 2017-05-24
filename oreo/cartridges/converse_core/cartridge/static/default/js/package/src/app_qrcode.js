
(function(app, $) {

    app.converseQRCode = {

        getRecentInstagram : function(client_id, user_id, maxResults) {

            var api_url = 'https://api.instagram.com/v1/users/';

            $.getJSON(api_url + user_id + '/media/recent/?client_id=' + client_id + '&count=' + maxResults + '&callback=?', function(json) {
                
                var data = json.data;
                $(data).each(function () {
                    $('.row-one').append("<div class='thumb instagram'><a href='" + this.link + "' title='" + this.caption.text + "'><i class='insta_overlay'></i><img src='" + this.images.low_resolution.url + "' alt='" + this.caption.text + "'' /></a></div>");
                });
            });
        },

        getRecentYoutube : function(playlistId, api_key, maxResults) {

            var api_url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet';

            $.getJSON(api_url + '&maxResults=' + maxResults + '&playlistId=' + playlistId + '&key=' + api_key, function(json) {

                var data = json.items;
                $(data).each(function () {
                    var latestVideoId = this.snippet.resourceId.videoId;
                    $('.youtube').append("<iframe width='620' height='349' src='//www.youtube.com/embed/" + latestVideoId + "?rel=0' frameborder='0' allowfullscreen></iframe>");
                });
            });
        },

        getRecentSoundcloud : function(client_id, user_id) {

            var api_url = 'http://api.soundcloud.com/users/';
            $.getJSON(api_url + user_id + '/tracks.json?client_id=' + client_id, function(json) {
                var latestTrackId = json[0].id;
                $('.soundcloud').append("<iframe width='100%' height='450' scrolling='no' frameborder='no' src='https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/" + latestTrackId + "&hide_related=false&show_reposts=false&visual=true'></iframe>");
            });
        },

        initSoundcloud : function() {

            var client_id = app.qrprefs.soundcloudClientID;     // this soundcloud app client_id
            var user_id = app.qrprefs.soundcloudUserID;         // converse soundcloud numerical user id

            app.converseQRCode.getRecentSoundcloud(client_id, user_id);

        },

        initYoutube : function() {

            var playlistId = app.qrprefs.youtubePlaylistID;     // converse upload playlistId
            var api_key = app.qrprefs.youtubeApiKey;            // this google app api_key (registered at google developers)
            var maxResults = app.qrprefs.youtubeMaxResults;     // number of videos to load

            app.converseQRCode.getRecentYoutube(playlistId, api_key, maxResults);
        },

        initInstagram : function() {

            var client_id = app.qrprefs.instagramClientID;      // this instagram app client_id
            var user_id = app.qrprefs.instagramUserID;          // converse account numerical user id
            var maxResults = app.qrprefs.instagramMaxResults;   // number of photos to load

            app.converseQRCode.getRecentInstagram(client_id, user_id, maxResults);
        },

        init : function() {
            app.converseQRCode.initInstagram();
            app.converseQRCode.initYoutube();
            app.converseQRCode.initSoundcloud();
        }
    };
}(window.app = window.app || {}, jQuery));