html5-video-plugin
==================

An HTML5 video plugin with JQuery.
All video controls are styled with css.

Currrent Parameters
==================

videoClass: "",
defaultControls: false,
autoHideControls: false,
preload: "none", // auto | metadata | none
poster: "",
videoSource: "",
safariType: "video/mp4",
firefoxType: "video/ogg",
chromeType: "video/webm",
ie9Type: "",
videoPlayListURL: "",
scrubber: true,
timer: false,
timeFollowScrubber: false,
volumeOriantation: "horizontal",
muteButton: true,
volumeSliderFade: false,
fallback: "your browser isn't cool enough to support the html5 video tag please upgrade to the lastest version of <a href='http://www.mozilla.com' title='firefox'>firefox</a> or <a href='http://www.chrome.com' title='google chrome'>google chrome</a>"

Example Usage
==================

$("#videoDiv").instantVideoPlayer({
	scrubber: true,
	autoHideControls: true,
	videoSource: "http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo",
	timeFollowScrubber: true,
	timer: true,
	volumeOriantation: "vertical",
	volumeSliderFade: true,
	muteButton: true,
	preload: "auto"
});

API access
==================

var api = $("#videoDiv").data("video");

$(".btnPlay").click(function(){
	api.play(this);
});

$(".btnPause").click(function(){
	api.pause(this);
});

$(".btnMute").click(function(){
	api.mute(this);
	// Currently mute is both mute and unmute. It will toggle the volume on and off
});