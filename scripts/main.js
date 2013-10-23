$(document).ready(function() {	
	
	/*videoPlayer.ondurationchange = setupProgressBar();  OOODDDDD
	videoPlayer.ontimeupdate = setupProgressBar();*/
	
	
	/*console.log(videoPlayer.paused); // boolean
	console.log(videoPlayer.ended); // return true if playback has reached the end of the media
	console.log(videoPlayer.defaultPlaybackRate);
	console.log(videoPlayer.played);
	console.log(videoPlayer.play);
	console.log(videoPlayer.pause);
	console.log(videoPlayer.muted);
	console.log(videoPlayer.volume);
	console.log(videoPlayer.seeking);
	console.log(videoPlayer.seekable);
	console.log(videoPlayer.timeupdate);
	console.log(videoPlayer.volumechange);
	console.log(videoPlayer.videoWidth);
	console.log(videoPlayer.videoHeight);
	console.log(videoPlayer.currentSrc);
	console.log(videoPlayer.canPlayType("video/mp4; codecs='avc1.42E01E, mp4a.40.2'")); //probably - maybe - ""
	console.log(videoPlayer.networkState); // NETWORK_EMPTY = 0 , NETWORK_IDLE = 1 , NETWORK_LOADING = 2 , NETWORK_NO_SOURCE = 3
	console.log(videoPlayer.readyState); // HAVE_NOTHING = 0 , HAVE_METADATA = 1 , HAVE_CURRENT_DATA = 2 , HAVE_FUTURE_DATA = 3 , HAVE_ENOUGH_DATA = 4
	console.log(videoPlayer.load);
	console.log(videoPlayer.buffered);
	console.log(videoPlayer.duration);
	console.log(videoPlayer.currentTime);
	console.log(videoPlayer.initialTime);*/
	
	
	
	$("#one").instantVideoPlayer({
		scrubber: true,
		autoHideControls: true,
		videoSource: "video/video",
		timeFollowScrubber: true,
		timer: true,
		volumeOriantation: "vertical",
		volumeSliderFade: true,
		muteButton: true
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
	//console.log($.fn.instantVideoPlayer.defaults);
	$(".btnMute").click(function(){
		api2.mute(this);
	});
});



/*
videoPlayer.controls = false; //removes controls


*/