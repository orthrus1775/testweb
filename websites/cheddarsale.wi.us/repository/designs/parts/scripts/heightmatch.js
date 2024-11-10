// heightmatch.js is to match one boxes height to another boxes height. 
// this will only make boxes bigger, not smaller. 
//
// requires jquery of course
//
// you can then adjust for any offset necessary (add some pixels to box1 or box2)
// use window.load instead of document.ready to make sure everything is loaded and the sizes are set
// 	<script>
// 		$(window).load(function(){
//		    Match.heightMatch('.leftColumn .graybox', '.centerColumn .graybox', 0, 42);
//		});
//	</script>
//

var Match = new (function Match() {
	this.heightMatch = function heightMatch(box1, box2, box1Adjust, box2Adjust) {
		if($(box1).height() > $(box2).height())
			$(box2).height($(box1).height());
		else if($(box2).height() > $(box1).height())
			$(box1).height($(box2).height());
		if(box1Adjust > 0)
			$(box1).height($(box1).height() + box1Adjust);
		if(box2Adjust > 0)
			$(box2).height($(box2).height() + box2Adjust);
	}

	this.heightMatch3 = function heightMatch3(box1, box2, box3, box1Adjust, box2Adjust, box3Adjust) {
		var a = $(box1).height()
		var b = $(box2).height()
		var c = $(box3).height()

		if(a > b && a > c){
			$(box2).height(a);
			$(box3).height(a);
		}
		else if (b > a && b > c){
			$(box1).height(b);
			$(box3).height(b);			
		}
		else if (c > a && c > b){
			$(box1).height(c);
			$(box2).height(c);			
		}

		if(box1Adjust > 0)
			$(box1).height($(box1).height() + box1Adjust);
		if(box2Adjust > 0)
			$(box2).height($(box2).height() + box2Adjust);
		if(box3Adjust > 0)
			$(box3).height($(box3).height() + box3Adjust);
	}

	this.classMatch = function classMatch(className) {
		var h = 0;
		var n = false;
		$(className).each(function () {
			if ($(this).css('display') == 'none') {
				n = true;
				$(this).css('display', 'block');
			}
			if ($(this).height() > h) {
				h = $(this).height();
			}
			if (n == true) {
				$(this).css('display', '');
				n = false;
			}
		});
		if (h > 0) {
			$(className).height(h);
		}
	}
	
	this.classMatch2 = function classMatch(className) {
		var h = 0;
		var n = '';
		$(className).each(function () {
			n = $(this).css('display');
			$(this).css('display', 'block');
			if ($(this).height() > h) {
				h = $(this).height();
			}
			$(this).css('display', n);
		});
		if (h > 0) {
			$(className).height(h);
		}
	}
	

})();
