$(document).ready(function() {		
	$("#one").instantVideoPlayer({
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
	
	$("#two").instantVideoPlayer({
		scrubber: false,
		autoHideControls: false,
		videoSource: "video/video",
		timeFollowScrubber: true,
		timer: true,
		volumeOriantation: "horizontal",
		volumeSliderFade: false,
		muteButton: true,
		fallback: "sdfdfsdfs"
	});
	
	var api = $("#one").data("video");
	var api2 = $("#two").data("video");
	console.log(api);
	api.play();
	//console.log($.fn.instantVideoPlayer.defaults);
	$(".btnMute").click(function(){
		api2.mute(this);
	});
});



/*
videoPlayer.controls = false; //removes controls


*/