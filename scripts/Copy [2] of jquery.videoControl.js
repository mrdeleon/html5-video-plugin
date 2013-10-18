/**
*	Instant HTML5 Video
*	Written by Michael De Leon	
*	http://www.inner-square.com
*	
*	Copyright (c) 2010 Michael De Leon (http://www.inner-square.com)
*
*	Built for jQuery library
*	http://www.jquery.com
*
*	Example markup
*	$(".expampleClass").instantVideoPlayer();
*	<div class="expampleClass"></div>
*
*
**/

(function($){
	$.fn.instantVideoPlayer = function(options){
		
		var defaults = {
			videoClass: "",
			controlsContainerClass: "videoControls",
			defaultControls: false,
			autoHideControls: false,
			autobuffer: false,
			poster: "",
			videoSource: "",
			m4vType: "video/mp4; codecs='avc1.42E01E, mp4a.40.2'",
			ogvType: "video/ogg; codecs='theora, vorbis'",
			webmType: "video/webm; codecs='vp8, vorbis'",
			videoPlayListURL: "",
			scrubber: true,
			timer: false,
			timeFollowScrubber: false,
			volumeOriantation: "horizontal",
			muteButton: true,
			volumeSliderFade: false,
			fallback: "your browser isn't cool enough to support the html5 video tag please upgrade to the lastest version of <a href='http://www.mozilla.com' title='firefox'>firefox</a> or <a href='http://www.chrome.com' title='google chrome'>google chrome</a>"
		};
		
		var options = $.extend(defaults, options);
		
		return this.each(function(i){
			document.createElement("video");
			
			var videoContainer	= $(this);
			var selector		= "._video" + i;
			
			var html5Video	 = "<video id='_video"+i+"'";
				options.videoClass != "" ? html5Video += "class='"+options.videoClass+"'" : "";
				options.defaultControls ? html5Video += "controls='controls'" : "";
				options.poster != "" ? html5Video += "poster='"+options.poster+"'" : "";
				html5Video += " autobuffer='"+options.defaultControls+"'>\n"
							 + "	<div class='noSupport'>\n"
							 + "		"+options.fallback+"\n"
							 + "	</div>\n"
							 + "</video>\n";
				$(videoContainer).html(html5Video);
				
				//Check to see if the browser supports canPlayType method if not
				//then browser doesn't support the video tag and returns false
				if(!$("video" , videoContainer)[0].canPlayType){return false;}
				
				if(!options.defaultControls){
				html5Video +="<div class='"+options.controlsContainerClass + " _video" +i+"'>\n"
							 + "	<span class='videoBtnPlayPause pause'>play</span>\n"
							 + "	<span class='videoProgressBarContainer'>\n"
				options.timer ? html5Video += "	<span class='videoTimer'>00:00</span>\n" : "";
				options.scrubber ? html5Video += "		<span class='videoScrubber'></span>" : "";
				html5Video +="		<span class='videoProgressBar'>"
							 + "			<span class='videoProgress'></span>"
							 + "		</span>"
							 + "	</span>\n"
							 + "	<span class='videoVolumeContainer "+ options.volumeOriantation +"'>\n";
				options.muteButton ? html5Video += "	<span class='videoBtnMute unmute'>mute</span>\n" : "";
				html5Video +="		<span class='videoVolumeSliderContainer'>\n"
							 + "			<span class='videoVolumeSlider'></span>\n"
							 + "		</span>\n"
							 + "	</span>\n"
							 + "</div>";
				}

			$(videoContainer).html(html5Video);
			
			var videoPlayer 			= $("video" , videoContainer)[0];
			var videoPlayerID 			= $("video" , videoContainer)[0].id;
			var controlsContainer		= $(selector);
			var btnPlayPause			= $(selector + " .videoBtnPlayPause");
			var progressBarContainer	= $(selector + " .videoProgressBarContainer");
			var progressBar 			= $(selector + " .videoProgressBar");
			var progress 				= $(selector + " .videoProgress");
			var scrubber				= $(selector + " .videoScrubber");
			var volumeContainer			= $(selector + " .videoVolumeContainer");
			var volumeSliderContainer	= $(selector + " .videoVolumeSliderContainer");
			var volumeSlider			= $(selector + " .videoVolumeSlider");
			var videoCurrentVolume;
			var scrubberOffset 			= ((scrubber.width() / progressBar.width()) * 100 ) / 2;
			var progressInterval;
			checkCanPlayType();
			
			// SETTING WIDTH AND HEIGHT BASE OFF OF USER SET CSS WIDTH AND HEIGHT ON THE MAIN CONTAINER
			$("#"+videoPlayerID).attr({"width" : videoContainer.width() , "height" : videoContainer.height()});

			function checkCanPlayType(){
				if(videoPlayer.canPlayType(options.m4vType) == "probably" || videoPlayer.canPlayType(options.m4vType) == "maybe"){
					$("#"+videoPlayerID).attr("src", options.videoSource+".m4v");					
				} else if(videoPlayer.canPlayType(options.ogvType) == "probably" || videoPlayer.canPlayType(options.ogvType) == "maybe"){
					$("#"+videoPlayerID).attr("src", options.videoSource+".ogv");	
				} else if(videoPlayer.canPlayType(options.webmType) == "probably" || videoPlayer.canPlayType(options.webmType) == "maybe"){
					$("#"+videoPlayerID).attr("src", options.videoSource+".webm");	
				} else {
					alert("no support");
				}
			}
			
			/*======= AUTO HIDE CONTROLS */
			if(options.autoHideControls){				
				videoContainer.mouseenter( function(){
					controlsContainer.fadeIn("fast");
				}).mouseleave( function(){
					controlsContainer.fadeOut("fast");
				});
			}
			
			/*======= WHEN VIDEO ENDS RESET */
			videoPlayer.addEventListener("ended", function() {
				window.clearInterval(progressInterval);
				options.timer ? window.clearInterval(updateTimerUI) : "";
				btnPlayPause.html("play").removeClass("play").addClass("pause");
			});
			
			
			/*=======TIMER CONTROLS */
			if(options.timer){
				var timer = $(selector + " .videoTimer");
				var timerInterval;
				var fillerTime;
				
				function updateTimerUI(){
					var time = Math.round(videoPlayer.currentTime);
					
					if(time < 10){
						fillerTime = "00:0";	
					} else if(time > 9){
						fillerTime = "00:";	
					}
					timer.html(fillerTime+time);
				}
			}
			
			
			/*======= VOLUME CONTROLS */
			if(options.volumeSliderFade){
				volumeSliderContainer.css("display","none");
				
				volumeContainer.mouseenter( function(){
					volumeSliderContainer.fadeIn("fast");
				}).mouseleave( function(){
					volumeSliderContainer.fadeOut("fast");
				});
			}
			
			if(options.muteButton){
				var btnMute	= $(selector + " .videoBtnMute");
				
				btnMute.click(function(){
					videoPlayer.muted = !videoPlayer.muted;
					if(videoPlayer.muted){
						$(this).removeClass("unmute").addClass("muted");
						options.volumeOriantation == "vertical" ? volumeSlider.css("height" , 0 ) : volumeSlider.css("width", 0);
					} else {
						$(this).removeClass("muted").addClass("unmuted");
						options.volumeOriantation == "vertical" ? 
							volumeSlider.css("height" , videoCurrentVolume * volumeSliderContainer.height() ) : 
							volumeSlider.css("width", videoCurrentVolume * volumeSliderContainer.width());
					}
				});
			}
			volumeSliderContainer.click(function(e){
				var sliderSizeCSS;
				
				if(options.volumeOriantation == "vertical"){
					var sliderHeight;
					var marginTopOffset;
					
					videoCurrentVolume = 1-((e.pageY - $(this).offset().top) / $(this).height());
					
					var constrained = volumeConstraints($(this));
					
					if(constrained == false){
						sliderHeight = volumeSliderContainer.height() - (e.pageY - $(this).offset().top);
						marginTopOffset = volumeSliderContainer.height() - sliderHeight;
					}
					sliderSizeCSS = {"height" : sliderHeight , "margin-top" : marginTopOffset};
				} else {
					var sliderWidth;
					videoCurrentVolume = (e.pageX - $(this).offset().left) / $(this).width();
					
					var constrained = volumeConstraints($(this));
					
					if(constrained == false){
						sliderWidth = e.pageX - $(this).offset().left;
					}
					sliderSizeCSS = {"width" : sliderWidth};
				}
				
				function volumeConstraints(element){
					if(options.volumeOriantation == "vertical"){
						if(videoCurrentVolume < .05){
							videoCurrentVolume = 0;
							sliderHeight = 0;	
							marginTopOffset = element.height();
						} else if(videoCurrentVolume > .95) {
							videoCurrentVolume = 1
							sliderHeight = element.height();	
							marginTopOffset = 0;
						} else {
							return false;	
						}
					} else {
						if(videoCurrentVolume < .05){
							videoCurrentVolume = 0;
							sliderWidth = 0;	
						} else if(videoCurrentVolume > .95) {
							videoCurrentVolume = 1
							sliderWidth = element.width();	
						} else {
							return false;	
						}
					}
				}
				
				volumeSlider.css(sliderSizeCSS);
				videoPlayer.volume = videoCurrentVolume;
			});
			
			
			/*======= PLAY AND PAUSE CONTROL */
			btnPlayPause.click(function(){
				videoPlayer.paused || videoPlayer.ended ? playVideo() : pauseVideo();
			});
			function playVideo(){
				videoPlayer.play();
				options.timer ? timerInterval = window.setInterval(updateTimerUI , 1000) : "";
				btnPlayPause.html("pause").removeClass("pause").addClass("play");
				
				setupProgressBar();
			}
			function pauseVideo(){
				videoPlayer.pause();
				btnPlayPause.html("play").removeClass("play").addClass("pause");
				
				window.clearTimeout(progressInterval);
			}
			
			
			/*======= PROGRESS BAR CONTROLS */
			function setupProgressBar() {
				
				/* RESET SCRUBBER AND PROGRESS BAR WHEN VIDEO FIRST STARTS */
				if(!progressInterval){
					options.scrubber ? scrubber.css("left", 0) : "";
					progress.css("width", 0);
				}
				progressInterval = window.setInterval(updateProgressBar,100);
			}						
			progressBar.click( function(e){
				progressPosition(e, this);
			});
				/* DRAG SCRUBBER CONTROLS */
			progressBarContainer.mousedown( function(){
				progressBarContainer.bind("mousemove", function(e){
					progressPosition(e, this);
				});
			}).mouseup( function(){
				progressBarContainer.unbind("mousemove");
			}).mouseleave( function(){
				progressBarContainer.unbind("mousemove");
			});
			function updateProgressBar(){
				var currentPercentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
		
				options.scrubber ? scrubber.css("left", currentPercentage - scrubberOffset+"%") : "";
				if(options.timer){
					options.timeFollowScrubber ? timer.css("left", currentPercentage + scrubberOffset+"%") : "";
				}
				progress.css("width", currentPercentage+"%");
			}
			function progressPosition(evt, target) {
				var clickPercentage = ((evt.pageX - $(target).offset().left) / $(target).width()) * 100;
				var newCurrentTime  = (clickPercentage*.01) * videoPlayer.duration;

				videoPlayer.currentTime = newCurrentTime;
				updateProgressBar();
			}
			
		});
	};
})(jQuery);