
var numImages;
var currentImage;
var frameDuration;
var playing;

var intervalID;

var thumbsWidth;
var animating = false;

var tStart = 0;
var tMoving = false;

var prevX = 0;
var prevY = 0;

var swipeTreshold = 6;

var expandIndex = 0;

var scrollID;

// Same as $(document).ready(function) to install a jQuery handler for when the document is ready.
$(function(){
	
	//banner animation

	numImages = 5;
	currentImage = 1;
	frameDuration = 5000; 
	playing = false;

	window.clearInterval(intervalID);

	// Switch image every frameDuration seconds
	intervalID = window.setInterval(function(){
		toNextImage();
	}, frameDuration);

	// Make the mpu display but transparent (including all children elements)
	// http://www.css3.info/introduction-opacity-rgba/
	$('#mpu-expand').css({
		'display':'block', 
		'opacity': '0' // causes all children elements to be included
	});
	// Transition smoothly (with CSS3, not jquery animation) to full opacity on the mpu
	$('#mpu-expand').transition({
		'opacity': '1'
	});

	// bindings
	// When the main mpu <a> is clicked/touched we prevent the browser from taking you to the URL and we expand the ad instead
	$('#mpu-expand').bind('click touch', function(e){
		e.preventDefault();
		expandAd();
	});

	// efficient wqy to bind events to multiple elements which may not exist yet in the DOM
	// we intercept when user starts to swipe in the overlay and store where they did it (x,y)
	// so we can work out whether they are swiping.
	$("body").on('touchstart', '#expand-overlay', function(e){
		 if (e.originalEvent.touches == undefined){
      var touch = e;
      } else{
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      }
		prevX = touch.pageX;
		prevY = touch.pageY;
	});
	
	// When swiping we prevent the browser from doing the default action (scrolling around, zooming)
	$("body").on('touchmove', '#expand-overlay', function(e){
		e.preventDefault();
	});

/*
	$("body").on('touchmove', 'video', function(e){
		alert('whoop');
	});

	$("body").on('touchmove', '#expand-video-holder', function(e){
		 if (e.originalEvent.touches == undefined){
      var touch = e;
      } else{
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      }

      var elm = $(this).offset();
      var x = touch.pageX - elm.left;
      var y = touch.pageY - elm.top;
      if(x < $(this).width() && x > 0){
	      if(y < $(this).height() && y > 0){
                  //CODE GOES HERE
			//alert(touch.pageX - prevX);
			var dX = touch.pageX - prevX;
			if (dX < -swipeTreshold){
				alert('right');
			}else if(dX > swipeTreshold){
				alert('left');
			}
	      }
      }

	});
*/
	// in the thumbnail viewport we let user swipe l/r to switch thumbnails
	$("body").on('touchmove', '#expand-thumbs-viewport', function(e){
		 if (e.originalEvent.touches == undefined){
      var touch = e;
      } else{
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      }

      var elm = $(this).offset();
      var x = touch.pageX - elm.left;
      var y = touch.pageY - elm.top;
      if(x < $(this).width() && x > 0){
	      if(y < $(this).height() && y > 0){
                  //CODE GOES HERE
			//alert(touch.pageX - prevX);
	      // If they have swiped enough we scroll the thumbnails appropriately   
			var dX = touch.pageX - prevX;
			if (dX < -swipeTreshold){
				thumbsRight();
			}else if(dX > swipeTreshold){
				thumbsLeft();
			}
	      }
      }

	});

	// The close button <a> on the interaction window prevent browser taking us to the URL and close the Ad.
	$("body").on('click touchstart', '#overlay-close', function(e){
		e.preventDefault();
		closeAd();
	});


   // Thumbnail left/right arrow handler moves to prev/next image
	$('body').on('click touchstart', '#expand-right-arrow', thumbsRight);
	$('body').on('click touchstart', '#expand-left-arrow', thumbsLeft);

	// When you click/tap on a specific thumbnail that one comes into view
	$('body').on('click', '#expand-thumbs-viewport a', thumbClick);

	// If the hash (#) part of the URL changes we must close the ad
	// Kodu feedback - should this be unbound when ad closed?
	$(window).bind('hashchange', function() {
	  closeAd();
	});	

});

function expandAd(){

		//constructor

      // Kodu feedback -- why not put it in the main HTML content but display: none?
      // note margin 13px used in initExpand calculations later.
		var expandedAd = '<div id="expand-content" style="width:736px;height:652px;background: url(http://cs.kodudigital.com/ft/adserve/noble-mpu/noble-expanded-bg.png) rgba(200,200,200,1);color: #ffffff;position:relative;z-index:2000001;border-radius: 2px;">';
      expandedAd += '<a href="#" id="overlay-close" style="position: absolute; right:8px; top:8px;padding:4px 11px;border: solid 1px #AAAAAA;border-radius: 5px;color: #AAAAAA;text-decoration: none;background: transparent;">x</a>';
		expandedAd += '<div id="expand-video-holder" style="width: 640px;height: 360px;background: #000000;color: #ffffff;position: absolute;top: 96px;left: 48px;z-index: 2000002;">video holder</div>';
		expandedAd += '<div id="expand-thumbs" style="width: 736px;height: 94px;position: absolute;top: 505px;left: 0;">';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/arrow-left.png" id="expand-left-arrow" style="position: absolute;top: 27px;left: 5px;cursor: pointer;">';
      expandedAd += '<div id="expand-thumbs-viewport" style="width: 644px;height: 120px;position: absolute;top: 0;left: 47px;margin-left: -1px;overflow: hidden;">';
      expandedAd += '<ul style="width: 9999px;position: relative;margin: 0;margin-left: 2px;padding: 0;">';
      expandedAd += '<li style="float: left;margin-right: 13px;margin-top: 5px;list-style-type: none;">';
      expandedAd += '<a href="http://cs.kodudigital.com/ft/adserve/noble-mpu/movie-01.jpg" class="active caption" title="http://cs.kodudigital.com/ft/adserve/noble-mpu/caption-01.png">';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/thumb-01.jpg" style="box-shadow: 1px 2px 2px rgba(0,0,0,0.7);"></a>';
      expandedAd += '</li>';
      expandedAd += '<li style="float: left;margin-right: 13px;margin-top: 5px;list-style-type: none;">';
      expandedAd += '<a href="http://cs.kodudigital.com/ft/adserve/noble-mpu/movie-02.mp4" title="http://cs.kodudigital.com/ft/adserve/noble-mpu/caption-02.png" class="caption">';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/thumb-02.jpg" style="box-shadow: 1px 2px 2px rgba(0,0,0,0.7);"></a>';
      expandedAd += '</li>';
      expandedAd += '<li style="float: left;margin-right: 13px;margin-top: 5px;list-style-type: none;">';
      expandedAd += '<a href="http://cs.kodudigital.com/ft/adserve/noble-mpu/movie-03.jpg" alt="http://cs.kodudigital.com/ft/adserve/noble-mpu/hires-03.jpg" title="http://cs.kodudigital.com/ft/adserve/noble-mpu/caption-03.png" class="caption dl">';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/thumb-03.jpg" style="box-shadow: 1px 2px 2px rgba(0,0,0,0.7);"></a>';
      expandedAd += '</li>';
      expandedAd += '<li style="float: left;margin-right: 13px;margin-top: 5px;list-style-type: none;">';
      expandedAd += '<a href="http://cs.kodudigital.com/ft/adserve/noble-mpu/movie-04.jpg" alt="http://cs.kodudigital.com/ft/adserve/noble-mpu/brochure-04.pdf" title="http://cs.kodudigital.com/ft/adserve/noble-mpu/caption-04.png" class="caption dl">';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/thumb-04.jpg" style="box-shadow: 1px 2px 2px rgba(0,0,0,0.7);"></a>';
      expandedAd += '</li>';
      expandedAd += '<li style="float: left;margin-right: 13px;margin-top: 5px;list-style-type: none;">';
      expandedAd += '<a href="http://cs.kodudigital.com/ft/adserve/noble-mpu/movie-05.jpg">';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/thumb-05.jpg" style="box-shadow: 1px 2px 2px rgba(0,0,0,0.7);"></a>';
      expandedAd += '</li>';
      expandedAd += '<li style="float: left;margin-right: 13px;margin-top: 5px;list-style-type: none;">';
      expandedAd += '<a href="http://cs.kodudigital.com/ft/adserve/noble-mpu/movie-06.jpg">';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/thumb-06.jpg" style="box-shadow: 1px 2px 2px rgba(0,0,0,0.7);"></a>';
      expandedAd += '</li>';
      expandedAd += '</ul>';
      expandedAd += '</div>';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/arrow-right.png" id="expand-right-arrow" style="position: absolute;top: 27px;right: 5px;cursor: pointer;">';
      expandedAd += '</div>';
      expandedAd += '<a href="http://kodudigital.com/" target="_blank">';
      expandedAd += '<img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/cta.png" id="expand-cta" style="position: absolute;bottom: 15px;right: 46px;"></a>';
		expandedAd += '</div>';

		// Create a jquery object around a new HTML element before we insert it into the document.
		// This is the overlay which blocks the user from interacting with the application.
		// It starts off fully transparent but with a 70% (alpha) transparent background so you can still see the webapp through it.
		// Then we append the object to the document body to inject it.
		// kodu feedback - 1024 is that big enough for ipad3?
		$('<div style="width:1024px;height:1024px; background-color:rgba(0,0,0,0.7); opacity:0;position:absolute;z-index : 2000000;"></div>').attr({
			'id':'expand-overlay'
		}).appendTo('body'); 
	/*	
		$('<div><a href="#" id="overlay-close" style="position: absolute; right:20px; top:20px;padding:10px 15px;background:#00ff00;text-decoration: none;">x</a></div>').attr({
			'id':'expand-content'
		}).css({
			'width':'736px',
			'height':'652px', 
			'background-color':'rgba(0,0,0,1)', 
			'opacity':'0',
			'position':'absolute',
			'z-index':'2000001'
		}).appendTo('#expand-overlay');    
   */	


		// Inject the interactive content into the overlay div to make it visible
		//var expandedContent = '<div id="expand-content"><a href="#" id="overlay-close">x</a><div id="expanded-video-holder">video here</div></div>';
		$('#expand-overlay').append(expandedAd);

	
		initExpand();

		// Center the interactive content within the window viewport size
		$('#expand-content').css({
			'left':window.innerWidth/2-736/2,
			'top':window.innerHeight/2-652/2, 
			'position':'relative'

		});
		
      // Use CSS3 transition to make the overlay fully visible
		$('#expand-overlay').transition({
			'opacity': '1', 
			'duration':'500ms',
			'easing': 'in-out'
		});

/*
		$('body').css({
			'overflow':'hidden'
		});
*/		



		$(window).bind('orientationchange', function () {
				//alert('turnd\'');
/*
				$('#expand-overlay').transition({
					'width':window.innerWidth,
					'height':window.innerHeight+50, 
					'duration':'500ms'
				}, 500);
*/
				$('#expand-content').transition({
					'left':window.innerWidth/2-736/2,
					'top':window.innerHeight/2-652/2, 
					'duration':'500ms' 
				}, 100);
				if(window.innerWidth > window.innerHeight){

				window.scrollTo(0,1);
				}else{
				window.scrollTo(-100,1);
				}
		});
		/*
		scrollID = window.setInterval(function(){
		window.scroll(0, 1);
		}, 10);
		*/
		//alert(window.innerWidth, window.innerHeight);
}

function closeAd(){
		$('#expand-overlay').transition({
			'opacity': '0', 
			'duration':'500ms'
		}, function(){
			//terminator
			$('#expand-overlay').remove();
			$(window).unbind('orientationchange');
			
			//window.clearInterval(scrollID);
		});

}



function toImage(num){

   // Use a CSS transform (instead of a jQuery animation) to fade out all the images
	$('.html5mpu img').transition({
		'opacity': '0', 
		'duration': '800ms'
	});

	// Use a CSS transform to fade in the Nth image
	$('.html5mpu img:nth-child(' + num + ')').transition({
		'opacity': '1', 
		'duration': '600ms'
	}, function(){
		currentImage = num;
	});

}

function toNextImage(){
	var tonum = currentImage+1;
	if (tonum > numImages) tonum = 1;

	toImage(tonum);

	/*
	setTimeout(function(){
		toNextImage();
	}, frameDuration);
	*/
}


// expanded stuff

function thumbsLeft(){

	var x = parseInt($('#expand-thumbs-viewport ul').css('x'));

	if(x < 0 && !animating){
		animating = true;

		if(x+163 == 0){ 
			$('#expand-left-arrow').transition({
				opacity: '0.2', 
				duration: '500ms', 
				easing: 'in-out'
			});
		} else {	

			if ($('#expand-right-arrow').css('opacity') != 1){
				$('#expand-right-arrow').transition({
					opacity: '1', 
					duration: '500ms', 
					easing: 'in-out'
				});
			}
		}

		$('#expand-thumbs-viewport ul').transition({
			x: '+=163px', 
			duration: '500ms', 
			easing: 'in-out'
		}, function(){
			animating = false;
			
		});
	}
}

function thumbsRight(){
	
	var x = parseInt($('#expand-thumbs-viewport ul').css('x'));

	if(x > -thumbsWidth && !animating){
		animating = true;
			
		if(x-163 < -thumbsWidth){ 
			$('#expand-right-arrow').transition({
				opacity: '0.2', 
				duration: '500ms', 
				easing: 'in-out'
			});
		} else {	

			if ($('#expand-left-arrow').css('opacity') != 1){
				$('#expand-left-arrow').transition({
					opacity: '1', 
				duration: '500ms', 
				easing: 'in-out'
				});
			}
		}

		$('#expand-thumbs-viewport ul').transition({
			x: '-=163px', 
			duration: '500ms', 
			easing: 'in-out'
		}, function(){
			animating = false;
			
		});
	}
}

function initExpand(){

   // count the number of thumbnails present
	var numThumbs = $('#expand-thumbs-viewport ul').children().length;

	// thumbnails 150px wide, 13px margin between each -- 640???
	// working out how much of the thumbnail width lies outside the fixed width viewport.
	thumbsWidth = numThumbs * 150 + 13 * (numThumbs-1)-640;

	// Grab the target click URL from the first thumbnail <a>
	var url = $('#expand-thumbs-viewport ul li:first-child a').attr('href');

	// Put a border around the first thumbnail to indicate it is selected
	$('#expand-thumbs-viewport ul li:first-child a img').css({
		border: 'solid 2px #ffffff',
		margin: '-2px'
	});

   // kodu feedback ignore case of extension before comparison .toLowerCase()
	// or the ad spec has to indicate that asset file extensions need to be lowercase.
	var ext = url.substr(url.lastIndexOf('.') + 1);

	var addThis = '';

	// Depending on what the target of the thumbnail is, we inject an img or video element.
	if(ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif'){

		addThis = '<img src="'+ url +'">';

	} else if (ext == 'mp4'){
      // For a video, the thumbnail must be the same name with .jpg as file extension
	   // video poster image MUST be lowercase .jpg
		addThis = '<video controls poster="'+ url.substr(0,url.lastIndexOf('.')+1) + 'jpg' +'" width="640" height="360"><source src="'+ url +'"></video>';

	}

	// Whatever the first content was (image/video) inject it into the video holder
	$('#expand-video-holder').html(addThis);

   // <li style="float: left;margin-right: 13px;margin-top: 5px;list-style-type: none;">
	// <a href="http://cs.kodudigital.com/ft/adserve/noble-mpu/movie-03.jpg" 
	//    alt="http://cs.kodudigital.com/ft/adserve/noble-mpu/hires-03.jpg" 
	//    title="http://cs.kodudigital.com/ft/adserve/noble-mpu/caption-03.png" 
	//    class="caption dl">
   // <img src="http://cs.kodudigital.com/ft/adserve/noble-mpu/thumb-03.jpg" 
	//      style="box-shadow: 1px 2px 2px rgba(0,0,0,0.7);"></a>

	// Now we look for a caption class on the first thumbnail
	if($('#expand-thumbs-viewport ul li:first-child a').hasClass('caption')){

	   // If caption class is present then the caption image to use is in the title attribute
	   // and if the 'dl' class is also present then another url is present in the alt attribute
	   // this represents the website to go to when the thumbnail is clicked/tapped
		var addCaption = ''

		caption = $('#expand-thumbs-viewport ul li:first-child a').attr('title');

		if($('#expand-thumbs-viewport ul li:first-child a').hasClass('dl')){

			dlurl = $('#expand-thumbs-viewport ul li:first-child a').attr('alt');

			addCaption = '<a href="'+ dlurl +'" target="_blank"><img src="'+ caption +'" id="expand-caption" style="position: absolute;bottom: 173px;left: 47px;"></a>'; 

		} else {

			addCaption = '<img src="'+ caption +'" id="expand-caption" style="position: absolute;bottom: 173px;left: 47px;">'; 

		}

		$('#expand-content').append(addCaption);

	}

		$('#expand-thumbs-viewport ul').transition({
			x: '+=0px', 
			duration: '10ms'
		});

	// Initially the left arrow is 'disabled' so make it less intense.
	$('#expand-left-arrow').css({
		opacity: '0.2'
	});
}

// When a thumbnail image is clicked, we show that image in the larger viewport area or the video corresponding.
function thumbClick(e){

	e.preventDefault();
	var url = '';
	var caption = '';
	var dlurl = '';

	url = $(this).attr('href');

	// Identify the caption image or URL to download from the title and alt parameters.
	if ($(this).hasClass('caption')) {
	   caption = $(this).attr('title');
	}
	if ($(this).hasClass('dl')) {
	   dlurl = $(this).attr('alt');
	}
	
	// Get the image file extension type
	var ext = url.substr(url.lastIndexOf('.') + 1);

	var addThis = '';

	// FEEDBACK images may be uppercase in extension
	if(ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif'){

		addThis = '<img src="'+ url +'">';

	} else if (ext == 'mp4'){

		addThis = '<video controls poster="'+ url.substr(0,url.lastIndexOf('.')+1) + 'jpg' +'" width="640" height="360"><source src="'+ url +'"></video>';

	}
	$('#expand-video-holder').html(addThis);


	if($('#expand-content').find('#expand-caption')) $('#expand-caption').remove();

	if($(this).hasClass('caption')){

		var addCaption = ''

		caption = $(this).attr('title');

		if($(this).hasClass('dl')){

			dlurl = $(this).attr('alt');

			addCaption = '<a href="'+ dlurl +'" target="_blank"><img src="'+ caption +'" id="expand-caption" style="position: absolute;bottom: 173px;left: 47px;"></a>'; 

		} else {

			addCaption = '<img src="'+ caption +'" id="expand-caption" style="position: absolute;bottom: 173px;left: 47px;">'; 

		}

		$('#expand-content').append(addCaption);

	}


	$('#expand-thumbs-viewport').find('img').css({
		border: '0',
		margin: '0'
	});
	$(this).find('img').css({
		border: 'solid 2px #ffffff',
		margin: '-2px'
	});
		var k = $(this).parent().index();
		expandIndex = k;
		//$('#expand-content').append(k);
}

