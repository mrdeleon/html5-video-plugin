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
		
		function createPlayerHTML(videoContainer, settings){
			var html5Video = "<video";
				settings.videoClass != "" ? html5Video += "class='"+settings.videoClass+"'" : "";
				settings.defaultControls ? html5Video += "controls='controls'" : "";
				settings.poster != "" ? html5Video += "poster='"+settings.poster+"'" : "";
				html5Video += " preload='"+settings.defaultControls+"'"
						 + " width='" + videoContainer.width() +"'"
						 + " height='" + videoContainer.height() + "'>\n"
						 + "	<div class='noSupport'>\n"
						 + "		"+settings.fallback+"\n"
						 + "	</div>\n"
						 + "</video>\n";
							 
			$(videoContainer).html(html5Video);
			
			//Check to see if the browser supports canPlayType method if not
			//then browser doesn't support the video tag and returns false
			if(!$("video" , videoContainer)[0].canPlayType){return false;}
			
			if(!settings.defaultControls){
				html5Video +="<div class='videoControls'>\n"
							 + "	<span class='videoBtnPlayPause pause'>play</span>\n"
							 + "	<span class='videoProgressContainer'>\n"
				settings.timer ? html5Video += "	<span class='videoTimer'>00:00</span>\n" : "";
				settings.scrubber ? html5Video += "		<span class='videoScrubber'></span>" : "";
				html5Video +="		<span class='videoProgressBar'>"
							 + "			<span class='videoProgress'></span>"
							 + "			<span class='videoBuffer'></span>"
							 + "		</span>"
							 + "	</span>\n"
							 + "	<span class='videoVolumeContainer "+ settings.volumeOriantation +"'>\n";
				settings.muteButton ? html5Video += "	<span class='videoBtnMute unmute'>mute</span>\n" : "";
				html5Video +="		<span class='videoVolumeSliderContainer'>\n"
							 + "			<span class='videoVolumeSlider'></span>\n"
							 + "		</span>\n"
							 + "	</span>\n"
							 + "</div>";
			}

			$(videoContainer).html(html5Video);
		}
		
		function checkCanPlayType(videoPlayer, settings){
			if(videoPlayer.canPlayType(settings.safariType) == "probably" || videoPlayer.canPlayType(settings.safariType) == "maybe"){
				$(videoPlayer).attr("src", settings.videoSource+".ogg");					
			} else if(videoPlayer.canPlayType(settings.firefoxType) == "probably" || videoPlayer.canPlayType(settings.firefoxType) == "maybe"){
				$(videoPlayer).attr("src", settings.videoSource+".ogg");	
			} else if(videoPlayer.canPlayType(settings.chromeType) == "probably" || videoPlayer.canPlayType(settings.chromeType) == "maybe"){
				$(videoPlayer).attr("src", settings.videoSource+".webm");	
			} else {
				alert("no support");
			}
		}

		return this.each(function(i){
			var settings 			= $.extend({}, $.fn.instantVideoPlayer.defaults, options),
				videoContainer		= $(this),
				videoPlayerEvents	= {
					play : function(){
						videoPlayer.play();
						settings.timer ? timerInterval = window.setInterval(updateTimerUI , 1000) : "";
						btnPlayPause.html("pause").removeClass("pause").addClass("play");
						
						progressInterval = window.setInterval(updateProgressBar,100);
					},
					pause : function(){
						videoPlayer.pause();
						btnPlayPause.html("play").removeClass("play").addClass("pause");
						
						window.clearTimeout(progressInterval);
					},
					mute : function(passedBtnMute) {
						videoPlayer.muted = !videoPlayer.muted;
						if(videoPlayer.muted){
							if(settings.muteButton){
								$(btnMute).removeClass("unmute").addClass("muted");
							}
							
							$(passedBtnMute).removeClass("unmute").addClass("muted");
							settings.volumeOriantation == "vertical" ? volumeSlider.css("height" , 0 ) : volumeSlider.css("width", 0);
						} else {
							if(settings.muteButton){
								$(btnMute).removeClass("muted").addClass("unmuted");
							}
							
							$(passedBtnMute).removeClass("muted").addClass("unmuted");
							settings.volumeOriantation == "vertical" ? 
								volumeSlider.css("height" , videoCurrentVolume * volumeSliderContainer.height() ) : 
								volumeSlider.css("width", videoCurrentVolume * volumeSliderContainer.width());
						}
					}
				};

			createPlayerHTML(videoContainer, settings);

			var videoPlayer 			= $("video" , videoContainer)[0],
				controlsContainer		= $(".videoControls", videoContainer),
				btnPlayPause			= $(".videoBtnPlayPause", videoContainer),
				progressContainer		= $(".videoProgressContainer", videoContainer),
				progressBar 			= $(".videoProgressBar", videoContainer),
				progress 				= $(".videoProgress", videoContainer),
				buffer	 				= $(".videoBuffer", videoContainer),
				scrubber				= $(".videoScrubber", videoContainer),
				volumeContainer			= $(".videoVolumeContainer", videoContainer),
				volumeSliderContainer	= $(".videoVolumeSliderContainer", videoContainer),
				volumeSlider			= $(".videoVolumeSlider", videoContainer),
				videoCurrentVolume,
				scrubberOffset 			= ((scrubber.width() / progressBar.width()) * 100 ) / 2,
				progressInterval;

			checkCanPlayType(videoPlayer, settings);
			
			/*=======TIMER CONTROLS */
			if(settings.timer){
				var timer = $(".videoTimer", videoContainer);
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
			
			/*======= WHEN VIDEO ENDS RESET */
			videoPlayer.addEventListener("ended", function() {
				window.clearInterval(progressInterval);
				settings.timer ? window.clearInterval(updateTimerUI) : "";
				btnPlayPause.html("play").removeClass("play").addClass("pause");
			}, false);
			
			
			/*======= VOLUME CONTROLS */
			if(settings.volumeSliderFade){
				volumeSliderContainer.css("display","none");
				
				volumeContainer.mouseenter( function(){
					volumeSliderContainer.fadeIn("fast");
				}).mouseleave( function(){
					volumeSliderContainer.fadeOut("fast");
				});
			}
			
			if(settings.muteButton){
				var btnMute	= $(".videoBtnMute", videoContainer);
				
				btnMute.click(function(){
					videoPlayerEvents.mute(this);
				});
			}
			
			volumeSliderContainer.click(function(e){
				var sliderSizeCSS;
				var sliderHeight;
				
				if(settings.volumeOriantation == "vertical"){
					var marginTopOffset;
					var constrained = volumeConstraints($(this));
					
					videoCurrentVolume = 1-((e.pageY - $(this).offset().top) / $(this).height());
					
					if(constrained == false){
						sliderHeight = volumeSliderContainer.height() - (e.pageY - $(this).offset().top);
						marginTopOffset = volumeSliderContainer.height() - sliderHeight;
					}
					sliderSizeCSS = {"height" : sliderHeight , "margin-top" : marginTopOffset};
				} else {
					var constrained = volumeConstraints($(this));
					
					videoCurrentVolume = (e.pageX - $(this).offset().left) / $(this).width();
					
					if(constrained == false){
						sliderWidth = e.pageX - $(this).offset().left;
					}
					sliderSizeCSS = {"width" : sliderWidth};
				}
				
				volumeSlider.css(sliderSizeCSS);
				videoPlayer.volume = videoCurrentVolume;
			});
			
			function volumeConstraints(element){
				if(settings.volumeOriantation == "vertical"){
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
			
			/*======= PLAY AND PAUSE CONTROL */
			btnPlayPause.click(function(){			
				videoPlayer.paused || videoPlayer.ended ? videoPlayerEvents.play() : videoPlayerEvents.pause();
			});
			
			/*======= PROGRESS BAR CONTROLS */
			settings.scrubber ? scrubber.css("left", (scrubberOffset * -1) + "%") : "";	
							
			progressBar.click( function(e){
				progressPosition(e, this);
			});
			/* DRAG SCRUBBER CONTROLS */
			progressContainer.mousedown( function(){
				progressContainer.bind("mousemove", function(e){
					progressPosition(e, this);
				});
			}).mouseup( function(){
				progressContainer.unbind("mousemove");
			}).mouseleave( function(){
				progressContainer.unbind("mousemove");
			});
			
			function updateProgressBar(){
				var currentPercentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
				
				settings.scrubber ? scrubber.css("left", currentPercentage - scrubberOffset + "%") : "";
				if(settings.timer){
					settings.timeFollowScrubber ? timer.css("left", currentPercentage + scrubberOffset+"%") : "";
				}
				progress.css("width", currentPercentage+"%");
				
				if(insufficientBuffer()){ 
					videoPlayerEvents.pause();
				}
			}
			
			function progressPosition(evt, target) {
				var clickPercentage = ((evt.pageX - $(target).offset().left) / $(target).width()) * 100;
				var newCurrentTime  = (clickPercentage*.01) * videoPlayer.duration;

				videoPlayer.currentTime = newCurrentTime;
				updateProgressBar();
			}
			
			/*======= BUFFER PROGRESS BAR */
			function insufficientBuffer(){
				if((videoPlayer.buffered.end(0) - videoPlayer.currentTime) < 20){
					console.log("need more buffer");

					return true;
				}
				
				return false;
			}
			if(settings.preload === "auto"){
				$(videoPlayer).bind("progress", function(){

					if(!insufficientBuffer()){ 
						videoPlayerEvents.play();
					}
					console.log(videoPlayer.buffered.end(0) - videoPlayer.currentTime);
					
					var bufferPercentage = (videoPlayer.buffered.end(0) / videoPlayer.duration) * 100;
					buffer.css("width", bufferPercentage+"%");
					
					if(bufferPercentage <= 99.5){
						buffer.css("width", bufferPercentage+"%");
					} else {
						buffer.css("width", "100%");
						$(videoPlayer).unbind("progress");
					}
				});
			}
			
			/*======= AUTO HIDE CONTROLS */
			if(settings.autoHideControls){				
				videoContainer.mouseenter( function(){
					controlsContainer.fadeIn("fast");
				}).mouseleave( function(){
					controlsContainer.fadeOut("fast");
				});
			}
			
			$(this).data({"video" : videoPlayerEvents});
		});
		
		function debug(videoPlayer){
			console.log("isPaused ", videoPlayer.paused); // boolean
			console.log("isEnded ", videoPlayer.ended); // return true if playback has reached the end of the media
			console.log("defaultPlaybackRate ", videoPlayer.defaultPlaybackRate);
			console.log("isPlayed ", videoPlayer.played);
			console.log("isPlay ", videoPlayer.play);
			console.log("isPause ", videoPlayer.pause);
			console.log("isMuted ", videoPlayer.muted);
			console.log("volume ", videoPlayer.volume);
			console.log("isSeeking ", videoPlayer.seeking);
			console.log("isSeekable ", videoPlayer.seekable);
			console.log("timeupdate ", videoPlayer.timeupdate);
			console.log("volumechange ", videoPlayer.volumechange);
			console.log("videoWidth ", videoPlayer.videoWidth);
			console.log("videoHeight ", videoPlayer.videoHeight);
			console.log("currentSrc ", videoPlayer.currentSrc);
			console.log("canPlayType ", videoPlayer.canPlayType("video/mp4; codecs='avc1.42E01E, mp4a.40.2'")); //probably - maybe - ""
			console.log("networkState ", videoPlayer.networkState); // NETWORK_EMPTY = 0 , NETWORK_IDLE = 1 , NETWORK_LOADING = 2 , NETWORK_NO_SOURCE = 3
			console.log("readyState ", videoPlayer.readyState); // HAVE_NOTHING = 0 , HAVE_METADATA = 1 , HAVE_CURRENT_DATA = 2 , HAVE_FUTURE_DATA = 3 , HAVE_ENOUGH_DATA = 4
			console.log("load ", videoPlayer.load);
			console.log("buffered ", videoPlayer.buffered.start(0), videoPlayer.buffered.end(0));
			console.log("duration ", videoPlayer.duration);
			console.log("currentTime ", videoPlayer.currentTime);
			console.log("intialTime ", videoPlayer.initialTime);
		}
	};
	
	$.fn.instantVideoPlayer.defaults = {
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
	};
	
	
})(jQuery);