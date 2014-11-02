/*global require, FT*/
var ads = require('../../main.js').init({
    dfp_site: 'ftcom.5887.video',
    dfp_zone: 'video',
    eid: 'oads'
});

    var player = videojs('content_video');

    var options = {
      id: 'content_video',
      adTagUrl: ads.buildURLForVideo('video','','').fullURL
    };


    player.ima(options);

    /*
    player.ima.requestAds();
    // On mobile devices, you must call initializeAdDisplayContainer as the result
    // of a user action (e.g. button click). If you do not make this call, the SDK
    // will make it for you, but not as the result of a user action. For more info
    // see our examples, all of which are set up to work on mobile devices.
    // player.ima.initializeAdDisplayContainer();
    player.play();

    */

    // Remove controls from the player on iPad to stop native controls from stealing
// our click
var contentPlayer =  document.getElementById('content_video_html5_api');
if (navigator.userAgent.match(/iPad/i) != null &&
    contentPlayer.hasAttribute('controls')) {
  contentPlayer.removeAttribute('controls');
}

// Initialize the ad container when the video player is clicked, but only the
// first time it's clicked.
var clickedOnce = false;
player.on('click', function() {
    if (!clickedOnce) {
      player.ima.initializeAdDisplayContainer();
      player.ima.requestAds();
      player.play();
      clickedOnce = true;
    }
});
