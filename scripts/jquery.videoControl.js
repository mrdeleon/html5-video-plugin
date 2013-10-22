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
		var settings = $.extend($.fn.instantVideoPlayer.defaults, options);

		function createPlayerHTML(videoContainer, controlsClassname, i){
			var html5Video	 = "<video id='_video"+i+"'";
				settings.videoClass != "" ? html5Video += "class='"+settings.videoClass+"'" : "";
				settings.defaultControls ? html5Video += "controls='controls'" : "";
				settings.poster != "" ? html5Video += "poster='"+settings.poster+"'" : "";
				html5Video += " autobuffer='"+settings.defaultControls+"'>\n"
							 + "	<div class='noSupport'>\n"
							 + "		"+settings.fallback+"\n"
							 + "	</div>\n"
							 + "</video>\n";
							 
			$(videoContainer).html(html5Video);
			
			//Check to see if the browser supports canPlayType method if not
			//then browser doesn't support the video tag and returns false
			if(!$("video" , videoContainer)[0].canPlayType){return false;}
			
			if(!settings.defaultControls){
				html5Video +="<div class='"+settings.controlsContainerClass + " _video" +i+"'>\n"
							 + "	<span class='videoBtnPlayPause pause'>play</span>\n"
							 + "	<span class='videoProgressBarContainer'>\n"
				settings.timer ? html5Video += "	<span class='videoTimer'>00:00</span>\n" : "";
				settings.scrubber ? html5Video += "		<span class='videoScrubber'></span>" : "";
				html5Video +="		<span class='videoProgressBar'>"
							 + "			<span class='videoProgress'></span>"
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

		return this.each(function(i){
			var videoPlayerEvents = {
				play : function(){
					videoPlayer.play();
					settings.timer ? timerInterval = window.setInterval(updateTimerUI , 1000) : "";
					btnPlayPause.html("pause").removeClass("pause").addClass("play");
					
					setupProgressBar();
				},
				pause : function(){
					videoPlayer.pause();
					btnPlayPause.html("play").removeClass("play").addClass("pause");
					
					window.clearTimeout(progressInterval);
				},
				mute : function(passedBtnMute) {
					videoPlayer.muted = !videoPlayer.muted;
					if(videoPlayer.muted){
						$(passedBtnMute).removeClass("unmute").addClass("muted");
						settings.volumeOriantation == "vertical" ? volumeSlider.css("height" , 0 ) : volumeSlider.css("width", 0);
					} else {
						$(passedBtnMute).removeClass("muted").addClass("unmuted");
						settings.volumeOriantation == "vertical" ? 
							volumeSlider.css("height" , videoCurrentVolume * volumeSliderContainer.height() ) : 
							volumeSlider.css("width", videoCurrentVolume * volumeSliderContainer.width());
					}
				}
			};
			var videoContainer		= $(this);
			var controlsClassname	= "_video" + i;
			
			createPlayerHTML(videoContainer, controlsClassname, i);

			var videoPlayer 			= $("video" , videoContainer)[0];
			var videoPlayerID 			= $("video" , videoContainer)[0].id;
			var controlsContainer		= $(controlsClassname);
			var btnPlayPause			= $(".videoBtnPlayPause", videoContainer);
			var progressBarContainer	= $(".videoProgressBarContainer", videoContainer);
			var progressBar 			= $(".videoProgressBar", videoContainer);
			var progress 				= $(".videoProgress", videoContainer);
			var scrubber				= $(".videoScrubber", videoContainer);
			var volumeContainer			= $(".videoVolumeContainer", videoContainer);
			var volumeSliderContainer	= $(".videoVolumeSliderContainer", videoContainer);
			var volumeSlider			= $(".videoVolumeSlider", videoContainer);
			var videoCurrentVolume;
			var scrubberOffset 			= ((scrubber.width() / progressBar.width()) * 100 ) / 2;
			var progressInterval;
			checkCanPlayType();
			
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
			
			// SETTING WIDTH AND HEIGHT BASE OFF OF USER SET CSS WIDTH AND HEIGHT ON THE MAIN CONTAINER
			$("#"+videoPlayerID).attr({"width" : videoContainer.width() , "height" : videoContainer.height()});

			function checkCanPlayType(){
				if(videoPlayer.canPlayType(settings.safariType) == "probably" || videoPlayer.canPlayType(settings.safariType) == "maybe"){
					$("#"+videoPlayerID).attr("src", settings.videoSource+".m4v");					
				} else if(videoPlayer.canPlayType(settings.firefoxType) == "probably" || videoPlayer.canPlayType(settings.firefoxType) == "maybe"){
					$("#"+videoPlayerID).attr("src", settings.videoSource+".ogg");	
				} else if(videoPlayer.canPlayType(settings.chromeType) == "probably" || videoPlayer.canPlayType(settings.chromeType) == "maybe"){
					$("#"+videoPlayerID).attr("src", settings.videoSource+".webm");	
				} else {
					alert("no support");
				}
			}
			
			/*======= AUTO HIDE CONTROLS */
			if(settings.autoHideControls){				
				videoContainer.mouseenter( function(){
					controlsContainer.fadeIn("fast");
				}).mouseleave( function(){
					controlsContainer.fadeOut("fast");
				});
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
				
				if(settings.volumeOriantation == "vertical"){
					var sliderHeight;
					var marginTopOffset;
					var constrained = volumeConstraints($(this));
					
					videoCurrentVolume = 1-((e.pageY - $(this).offset().top) / $(this).height());
					
					if(constrained == false){
						sliderHeight = volumeSliderContainer.height() - (e.pageY - $(this).offset().top);
						marginTopOffset = volumeSliderContainer.height() - sliderHeight;
					}
					sliderSizeCSS = {"height" : sliderHeight , "margin-top" : marginTopOffset};
				} else {
					var sliderWidth;
					var constrained = volumeConstraints($(this));
					
					videoCurrentVolume = (e.pageX - $(this).offset().left) / $(this).width();
					
					if(constrained == false){
						sliderWidth = e.pageX - $(this).offset().left;
					}
					sliderSizeCSS = {"width" : sliderWidth};
				}
				
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
				
				volumeSlider.css(sliderSizeCSS);
				videoPlayer.volume = videoCurrentVolume;
			});
			
			/*======= PLAY AND PAUSE CONTROL */
			btnPlayPause.click(function(){			
				videoPlayer.paused || videoPlayer.ended ? videoPlayerEvents.play() : videoPlayerEvents.pause();
			});
			
			/*======= PROGRESS BAR CONTROLS */
			function setupProgressBar() {
				
				/* RESET SCRUBBER AND PROGRESS BAR WHEN VIDEO FIRST STARTS */
				if(!progressInterval){
					settings.scrubber ? scrubber.css("left", 0) : "";
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
		
				settings.scrubber ? scrubber.css("left", currentPercentage - scrubberOffset+"%") : "";
				if(settings.timer){
					settings.timeFollowScrubber ? timer.css("left", currentPercentage + scrubberOffset+"%") : "";
				}
				progress.css("width", currentPercentage+"%");
			}
			function progressPosition(evt, target) {
				var clickPercentage = ((evt.pageX - $(target).offset().left) / $(target).width()) * 100;
				var newCurrentTime  = (clickPercentage*.01) * videoPlayer.duration;

				videoPlayer.currentTime = newCurrentTime;
				updateProgressBar();
			}
			
			
			$(this).data({"video" : videoPlayerEvents});
		});
	};
	
	$.fn.instantVideoPlayer.defaults = {
		videoClass: "",
		controlsContainerClass: "videoControls",
		defaultControls: false,
		autoHideControls: false,
		autobuffer: false,
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