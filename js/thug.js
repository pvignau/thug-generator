(function(){
	var width = 720;
	var height = 0;
	var streaming = false;
	var jqDwi = jQuery('.dealwithit');
	var tracker = new tracking.ObjectTracker('face');
	tracker.setInitialScale(4);
	tracker.setStepSize(2);
	tracker.setEdgesDensity(0.1);
	var secondsToGo = 3;
	var imageData = null;

	navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);
	var hasGetUserMedia = function() {
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia);
	};

	var errorCallback = function(e) {
		console.log('Reeeejected!', e);
	};

	// Thug Life Nigga
	var snapshot = function() {
		canvas.width = width;
		canvas.height = height;
		ctx.drawImage(video, 0, 0, width, height);
		imageData = canvas.toDataURL('image/webp')
		tracking.track('canvas', tracker);
	};

	var updateCountdown = function() {
		jQuery('#countdown').show();
		jQuery('.countdown').removeClass('on');
		jQuery('.countdown'+secondsToGo).addClass('on');
		secondsToGo--;
	};

	var clearImage = function() {
		jQuery('video').show();
		jQuery('#videoContainer').removeClass('transition desaturate');
		jQuery('#picture').attr('src', '');
		jqDwi.hide().css('top', 0).css('left', 0);
		jQuery('.thugLife').hide();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	if (navigator.getUserMedia) {
		var video = document.querySelector('video');
		var canvas = document.querySelector('canvas');
		var ctx = canvas.getContext('2d');
		navigator.getUserMedia({video: true}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
		}, errorCallback);
	} else {
		alert('Your browser can\'t deal with the thug !');
	}

	video.addEventListener('canplay', function(ev){
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth/width);
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			streaming = true;
		}
	}, false);

	tracker.on('track', function(event) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (event.data.length > 0) {
			document.querySelector('img').src = imageData;
			document.querySelector('audio').play();
			jQuery('#videoContainer').addClass('transition desaturate');
			jQuery('.thugLife').fadeIn(5000);
		}

		if (event.data.length === 0) {
			// No objects were detected in this frame.
		} else {
			event.data.forEach(function(rect) {
				jQuery('video').hide();
				jqDwi.height(rect.height * 0.30);
				jqDwi.width(rect.width * 0.9);
				jqDwi.css('top', rect.y - 100);
				jqDwi.css('left', rect.x );
				jqDwi.show();
				jqDwi.animate({
					top: rect.y + (rect.height * 0.25)
				}, 7500, function(){});
				return;
			});
		}
	});

	jQuery('.photo').on('click', function(){
		clearImage();
		updateCountdown();
		var interval = setInterval(function(){
			if (secondsToGo == 0) {
				this.clearInterval(interval);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				updateCountdown();
				// Hide countdown and set Flash overlay
				jQuery('#countdown').hide();
				jQuery('#overlay').show(10, function(){jQuery(this).fadeOut(1000)});
				// Reinit countdown
				secondsToGo = 3;
				snapshot();
			} else {
				updateCountdown();
			}
		}, 1000);
	});
	jQuery('.clear').on('click', clearImage);
})();