// global pause variable
window.menusPaused = false;

// menu nav controller object
function MenuNav(nav, options) {

	// set up the object
	var self = this;
	var $nav = $(nav);
	$nav[0].controller = this;
	var lastOver = null;
	var $otherMenuNavs = $(null);

	// information about self
	var isRightAligned = $nav.is(".horizontal.rightAligned");
	var isHorizontal = $nav.is(".horizontal");
	var isFullWidth = $nav.is(".horizontal.block.fullWidth");
	var isSlab = $nav.is(".horizontal.block.slab");
	var isSlabText = $nav.is(".horizontal.block.slab.slabtext") && $("nav.horizontal.block.slab.slabtext > div").is(".slabtext");
	var isSlabMaxTwo = $nav.is(".horizontal.block.slab.slabmaxtwocol");
	var isSlabMaxThree = $nav.is(".horizontal.block.slab.slabmaxthreecol");
	var isOneDeep = $nav.is(".horizontal.block.slab.onedeep");

	this.$menus = $nav.find("ul ul");

	this.options = $.extend({
		foo: "bar",
		leftOverlap: 5,
		topOverlap: 5,
		bounceOffset: 25,
		fadeOutDuration: 400
	}, options || {});

	function initialize() {

		// Add in the triangles
		createTriangles();

		if (isSlab) {
			buildSlab();
		}
		// find other menu navs to talk to
		$("nav.menu").each(function () {
			if (this !== $nav[0]) {
				$otherMenuNavs = $otherMenuNavs.add(this);
			}
		});

		// event delegates for all menus
		$nav.on("mouseenter", "ul li", onMouseEnter)
			.on("mouseleave", "ul li", onMouseLeave)
			// .on("blur", "ul li", onMouseLeave)
			.on("click", "ul li .triangle", arrowClick)
			.on("keydown", "ul li .triangle", arrowClick)
			.on("click", "ul li a", onLinkClicked)
			.on("touchstart", "ul li a", onLinkTouchStart)
			.on("touchmove", "ul li a", onLinkTouchMove)
			.on("touchend", "ul li a", onLinkTouchEnd);
	}

	function buildSlab() {
		var $topLevelSectionsWithChildren = $nav.children("ul").children("li").has("ul");
		$topLevelSectionsWithChildren.each(function (i) {
			var numOfCat = $(this).children("ul").children("li").length;
			//remove the deep links - they won't be shown, and they just mess up the counts
			$(this).children("ul").children("li").children("ul").children("li").children("ul").remove();
			if (isOneDeep)
				$(this).children("ul").children("li").children("ul").remove();
			var numOfLinks = numOfCat + $(this).children("ul").children("li").children("ul").children("li").length;
			if ((numOfCat >= 12 || numOfLinks >= 40 && numOfCat >= 4) && !isSlabMaxTwo && !isSlabMaxThree) {
				$(this).addClass("fourcol");
				var forth = parseInt(numOfLinks / 4);
				var cut = 0;
				var $links = $(this).children("ul").children("li").find("a").slice(forth, forth + 1);
				if ($links.parentsUntil("nav").length === 6)
					cut = $links.parent().parent().parent().index();
				else if ($links.parentsUntil("nav").length === 4)
					cut = $links.parent().index();
				if (numOfCat > 5 && cut < 3) cut++;
				if (cut == 0) cut = 1;
				$(this).children("ul").children("li").slice(0, cut).wrapAll("<li class='col one'><ul>");
				var $links = $(this).children("ul").children("li").find("a").slice(forth * 2, forth * 2 + 1);
				if ($links.parentsUntil("nav").length === 6)
					cut = $links.parent().parent().parent().index() + 1;
				else if ($links.parentsUntil("nav").length === 4)
					cut = $links.parent().index() + 1;
				$(this).children("ul").children("li").slice(1, cut).wrapAll("<li class='col two'><ul>");
				var $links = $(this).children("ul").children("li").find("a").slice(forth * 3, forth * 3 + 1);
				if ($links.parentsUntil("nav").length === 6)
					cut = $links.parent().parent().parent().index() + 1;
				else if ($links.parentsUntil("nav").length === 4)
					cut = $links.parent().index() + 1;
				$(this).children("ul").children("li").slice(2, cut).wrapAll("<li class='col three'><ul>");
				$(this).children("ul").children("li").slice(3).wrapAll("<li class='col four'><ul>");
			}
			else if ((numOfCat >= 9 || numOfLinks >= 30 && numOfCat >= 3) && !isSlabMaxTwo) {
				$(this).addClass("threecol");
				var third = parseInt(numOfLinks / 3);
				var cut = 0;
				var $links = $(this).children("ul").children("li").find("a").slice(third, third + 1);
				if ($links.parentsUntil("nav").length === 6) 
					cut = $links.parent().parent().parent().index();
				else if ($links.parentsUntil("nav").length === 4) 
					cut = $links.parent().index();
				if (numOfCat >= 5 && cut < 2) cut++;
				if (cut == 0) cut = 1;
				//console.log(cut);
				$(this).children("ul").children("li").slice(0, cut).wrapAll("<li class='col one'><ul>");
				var $links = $(this).children("ul").children("li").find("a").slice(third*2,third*2+1);
				if ($links.parentsUntil("nav").length === 6)
					cut = $links.parent().parent().parent().index() + 1;
				else if ($links.parentsUntil("nav").length === 4) 
					cut = $links.parent().index() + 1;
				$(this).children("ul").children("li").slice(1, cut).wrapAll("<li class='col two'><ul>");
				$(this).children("ul").children("li").slice(2).wrapAll("<li class='col three'><ul>");
			}
			else if (numOfCat >= 2 && numOfLinks >= 10) {
				$(this).addClass("twocol");
				var half = parseInt(numOfLinks / 2);
				var cut = 0;
				//find the middle
				var $links = $(this).children("ul").children("li").find("a").slice(half, half+1);
				if ($links.parentsUntil("nav").length === 6) 
					cut = $links.parent().parent().parent().index();
				else if ($links.parentsUntil("nav").length === 4) 
					cut = $links.parent().index();
				if (cut == 0) cut = 1;
				$(this).children("ul").children("li").slice(0, cut).wrapAll("<li class='col one'><ul>");
				$(this).children("ul").children("li").slice(1).wrapAll("<li class='col two'><ul>");
			}
			else {
				$(this).addClass("onecol");
				$(this).children("ul").children("li").slice(0).wrapAll("<li class='col one'><ul>");
			}
		});
		if (isSlabText) {
			$('div.slabtext').removeClass('hidden').detach().appendTo('nav.horizontal.block.slab.slabtext > ul > li > ul').wrap("<li class='slabtext'>");
		}
		else
		{
			$nav.removeClass('slabtext');
		}
	}

	function createTriangles() {
		if (isHorizontal) {
			var $topLevelSectionsWithChildren = $nav.children("ul").children("li").has("ul");
			$topLevelSectionsWithChildren.children("a").each(function (index, value) {
				$(value).attr('aria-haspopup', 'true').attr('aria-expanded', 'false')
				.append($("<button class='triangle' tabindex='0'><span class='hidden'>show submenu for " + $(value).text() + "</span>&#9660;</button>"));
			});
			if (!$nav.is(".slab")) {
				// add triangles to subsections
				$topLevelSectionsWithChildren.find("li").has("ul").children("a").each(function (index, value) {
					$(value).attr('aria-haspopup', 'true').attr('aria-expanded', 'false')
						.prepend($("<button class='triangle' tabindex='0'><span class='hidden'>show submenu for " + $(value).text() + "</span>&#9658;</button>"));
				});
			}
		} else {
			$nav.find("li").has("ul").children("a").each(function (index, value) {
				$(value).attr('aria-haspopup', 'true').attr('aria-expanded', 'false')
					.prepend($("<button class='triangle' tabindex='0'><span class='hidden'>show submenu for " + $(value).text() + "</span>&#9658;</button>"));
			});
		}
	}

	//  event handlers
	function onMouseEnter(event) {
		var $thisLI = $(this);	// the element the event landed on
		if (hasNoMenu($thisLI)) { return; } // we have no business here
		var $menuUL = $thisLI.children("ul");
		var $openSiblings = self.getOpenSiblingMenus($menuUL);

		// we're over a menu title, open the menu!
		if (!$thisLI.parent().parent().is("nav.horizontal.block") && $openSiblings.length) {
			if (isInRightBit(event, $thisLI) && fromAdjacent(this)) {
				// we should delay this open a bit to see if user was
				// aiming for an already open menu and is here by accident
				self.dwelledOpenTimer = setTimeout(function () {
					self.openMenu($menuUL);
				}, 500);
			} else { // nah, just open the menu right away
				if (self.dwelledOpenTimer) {
					clearTimeout(self.dwelledOpenTimer);
				}
				self.openMenu($menuUL);
			}
		} else { // no other sibling menus open, all clear
			if (isSlab)
				self.dwelledOpenTimer = setTimeout(function () { self.openMenu($menuUL); }, 400);
			else
				self.openMenu($menuUL);	
		}
		lastOver = this;
	}
	function arrowClick(event) {
		if (event.keyCode === 13 || event.type === 'click') {
			var $thisLI = $(this).parent().parent();	// the element the event landed on
			if (hasNoMenu($thisLI)) { return; } // we have no business here
			var $menuUL = $thisLI.children("ul");
			var $openSiblings = self.getOpenSiblingMenus($menuUL);

			if ($menuUL.hasClass('arrowclicked')) {
				$menuUL.removeClass('arrowclicked');
				// clearTimeout(self.dwelledOpenTimer);
				self.closeMenu($menuUL);
			}
			else {
				// we've clicked an arrow open the menu
				if (!$thisLI.parent().parent().is("nav.horizontal.block") && $openSiblings.length) {
					if (self.dwelledOpenTimer) { clearTimeout(self.dwelledOpenTimer); }
					self.openMenu($menuUL);
				} else { // no other sibling menus open, all clear
					self.openMenu($menuUL);
				}
				$menuUL.addClass('arrowclicked');
			}
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
	}
	function onMouseLeave() {
		var $this = $(this);	// the element the event landed on
		var $menu = $this.children("ul");
		if (hasNoMenu($this)) { return; } // we have no business here
		if ($menu.hasClass('arrowclicked')) { return; } 
		
		// if we leave the menu item's LI (which includes all its sub menus), we need to set a close timer
		this.closeTimer = setTimeout(function () {
			self.closeMenu($menu);
		}, 1000);

		// if this is a dwelled-upon rightmost third (or whatever) of an item, and cursor leaves it, we need to cancel the delayed open timer
		if (self.dwelledOpenTimer) {
			clearTimeout(self.dwelledOpenTimer);
		}
	}
	function onLinkClicked() {
		// console.log("onLinkClicked");
	}
	function onLinkTouchStart(event) {
		var firstTouch = event.originalEvent.touches[0];
		// console.log("onLinkTouchStart");

		// keep track of the movement of this touch.
		// SWIPE HANDLING DEPRECATED in favor of the global swipe tracking

		self.swipeDistance = 0;
		self.swipeOrigin = {
			x: firstTouch.pageX,
			y: firstTouch.pageY
		};

		event.preventDefault();
		event.stopPropagation();
	}
	function onLinkTouchMove(event) {
		// SWIPE HANDLING DEPRECATED in favor of the global swipe tracking
		var firstTouch = event.originalEvent.touches[0];
		var position = {
			x: firstTouch.pageX,
			y: firstTouch.pageY
		};
		self.swipeDistance = calculateSwipeDistance(position);

		// console.log("onLinkTouchMove");
		// console.log("swipeDistance = ", self.swipeDistance);

		// call preventDefault(), or else a mouseenter event will be synthesized
		event.preventDefault();
		event.stopPropagation();
	}
	function onLinkTouchEnd(event) {
		// console.log("onLinkTouchEnd");

		self.swipeDistance = 0;
		self.swipeOrigin = null;

		var $this = $(this),
			$li = $this.parent(),
			$menu = $li.children("ul");

		if (wasATap()) {
			// console.log("that was a tap.");
		}

		// alert("touched");
		// if there's no menu under this, we want it to act like a normal link.
		// if it has an already open menu, we want this second tap to be treated
		// as an attempt to navigate to the menu title's section.
		if (hasNoMenu($li) || $menu.is(".open")) {
			// go to the link
			// console.log("navigating to link...");
			window.location.href = $this.attr("href");
		} else {
			// console.log("opening menu.");
			self.openMenu($menu);
		}

		// call event.preventDefault(), or else a click event will be synthesized
		event.preventDefault();
		event.stopPropagation();
	}


	// event handler utilities

	function wasATap() {
		return (window.globalMenuNavController.swipeState === null ||
				(window.globalMenuNavController.swipeState &&
				 window.globalMenuNavController.swipeState.isARealSwipe === false));
	}

	function isInRightBit(event, $e) {
		var width = $e.outerWidth();
		var itemLeft = $e.offset().left;
		var bit = (itemLeft + ((8 / 10) * width));

		return (event.pageX > bit);
	}
	// returns true if the mouse arrived at "item" from an adjacent
	// menu title note: does NOT include those without any children
	// (and therefore a menu)
	function fromAdjacent(item) {
		var $neighbors = $(item).prev().add($(item).next());
		if ($neighbors.is($(lastOver))) {
			return true;
		} else {
			return false;
		}
	}

	//  actions
	this.openMenu = function openMenu(menu) {
		if (window.menusPaused) { return; }

		var $menu = $(menu);
		var $title = $menu.parent();

		// clear close timer and/or cancel animations
		if ($title[0].closeTimer) { clearTimeout($title[0].closeTimer); }

		if ($menu.is(".open")) {
			// the menu is still technically open, we just need to
			// stop it from animating closed if that's what it's doing
			$title.add($menu).removeClass("closing");
			$menu.stop().css("opacity", "");
		} else {
			// if we're in a deep subsection somewhere, and we're trying
			// to open the menu of its top-level ancestor, that top-level
			// section will (and should) be marked "open", so we need to
			// remember that so we don't blow that marker away once we
			// close the menu
			// if ($title.is(".open"))
			// 	$title.data("wasOpen", true);

			self.closeOtherMenuNavs();

			// this is necessary to get IE6/7 to play nice
			$menu.css({ visibility: "hidden" });

			// this seems verbose, but in profiling, this was the
			// fastest way to do it
			$title.addClass("open");
			$menu.addClass("open");
			$nav.addClass("open");
			$title.children('a').attr('aria-expanded', 'true');

			if (!isSlab)
				positionMenu($menu);

			// self.raiseBox();
			$menu.css({ visibility: "visible" });
			self.closeSiblingMenus($menu);

			if (isSlab) {
				var highestCol = 0;
				if ($menu.children('li.col.three').length)
					highestCol = Math.max(Math.max($menu.children('li.col.one').height(),$menu.children('li.col.two').height()), $menu.children('li.col.three').height());
				else if ($menu.children('li.col.two').length)
					highestCol = Math.max($menu.children('li.col.one').height(),$menu.children('li.col.two').height());
				else
					highestCol = $menu.children('li.col.one').height();
				if (isSlabText)
					highestCol = Math.max(highestCol, $menu.children('li.slabtext').height());		
				if (highestCol > 101)
					$menu.children('li.col').height(highestCol);				
			}
		}
	};

	this.closeMenu = function closeMenu(menu, closeImmediately) {
		var $menu = $(menu);
		if ($menu.length === 0 || window.menusPaused) { return; }
		var $title = $(menu).parent();

		function closeNow() {
			// clear any close timer still pending, we're going to close right
			// away instead
			if ($title[0].closeTimer) { clearTimeout($title[0].closeTimer); }

			// halt animations on descendants and self
			$menu.find("ul").andSelf().stop();

			// $title.removeClass("closing" + ($title.data("wasOpen") ? "" : " open"));
			$title.removeClass("closing open");
			$menu.removeClass("closing open");
			$title.children('a').attr('aria-expanded', 'false');


			if ($nav.find("ul.open").length === 0) {
				$nav.removeClass("open");
				// self.lowerBox();
			}

			// if it was in the middle of an animation before we
			// pulled the plug, reset it
			$menu.css({opacity: ""});

			// clean up any stray descendant menus
			closeDescendantMenus(menu);
		}

		if (closeImmediately || $title.siblings(".open").length) {
			closeNow();
		} else {
			$menu.add($menu.parent()).addClass("closing");
			$menu.animate({opacity: 0}, self.options.fadeOutDuration, function () {
				closeNow();
			});
		}
	};
	this.toggleMenu = function toggleMenu(menu) {
		var $menu = $(menu);
		// UNFINISHED
	};

	this.closeAllMenus = function closeAllMenus() {
		self.$menus.filter(".open").each(function (i, menu) {
			self.closeMenu(menu, true);
		});
	};

	function closeDescendantMenus(menu) {
		var $menu = $(menu);
		var $openChildren = $menu.children("li.open").children("ul");
		if ($openChildren.length) {
			$openChildren.each(function () {
				self.closeMenu(this, true);
			});
		}
	}

	// this should get moved into the global menu nav controller
	this.closeOtherMenuNavs = function closeOtherMenuNavs() {
		$otherMenuNavs.filter(".open").each(function () {
			this.controller.closeAllMenus();
		});
	};
	this.closeSiblingMenus = function closeSiblingMenus(menu) {
		var $title = $(menu).parent();
		$title.siblings(".open").children("ul").each(function () {
			self.closeMenu(this, true);
		});
	};

	//  accessors
	this.getSiblingMenus = function getSiblingMenus(menuUL) {
		return $(menuUL).parent().siblings("li").children("ul");
	};
	this.getOpenSiblingMenus = function getOpenSiblingMenus(menuUL) {
		return this.getSiblingMenus(menuUL).filter(".open");
	};
	this.getOrientation = function getOrientation() {
		return $nav.hasClass("vertical") ? "vertical" : "horizontal";
	};
	this.isSlab = function isSlab() {
		return $nav.hasClass("slab");
	};
	this.isSub = function isSub(menuUL) {
		var $parentSections = $(menuUL).parents("nav li");
		var depth = $parentSections.length - 1;
		return depth;
	};
	// function getMenuTitle(menuUL) {
	// 	return $(menuUL).parent().children("a").text();
	// }
	// takes an section's LI. returns true if the section has children
	function hasNoMenu(li) {
		var $menu = $(li).children("ul");
		return ($menu.length === 0 || (self.isSlab() && sectionLevel(li) > 0));
	}
	// returns the apparent "level" of a section. "home" and children of "home"
	// are level 0, the children of those are level 1, etc.
	function sectionLevel(li) {
		return $(li).parentsUntil("nav", "li").length;
	}
	// returns an integer. takes a current position object to compare against
	// the last recorded swipe origin position
	function calculateSwipeDistance(currentPosition) {
		var delta = lineLength(currentPosition.x, currentPosition.y,
							   self.swipeOrigin.x, self.swipeOrigin.y);
		return Math.round(Math.abs(delta));
	}



	// ===================================================
	//  internal positioning and utility functions
	// ===================================================


	// takes a menu (ul), and a positionInfo hash
	function calcLeft(menu, i) {
		var $menu = $(menu);

		if ($menu.parents(".bounced").length) {
			return -i.menu.outerWidth + self.options.leftOverlap;
		} else {
			if (self.getOrientation() === "vertical" || i.menu.isSub) {
				return i.parent.outerWidth - self.options.leftOverlap;
			} else { // horizontal
				if (isFullWidth && $("html").is(".mozilla-cell-context-bug")) {
					// work around FF's lack of position: relative on
					// display:table-cell elements
					return i.parent.position.left + i.navLink.position.left;
				} else if (isSlab) {
					return 0;
				} else if (isRightAligned) {
					// console.log(i.navLink.position.left);
					return i.navLink.position.left + (i.navLink.outerWidth - i.menu.outerWidth);
				}
				else {
					return i.navLink.position.left;
				}
				// return 0;
			}
		}
	}

	// takes a menu (ul), and a positionInfo hash
	function calcTop(menu, i) {
		var $menu = $(menu);
		var topBorder = parseInt($menu.css("border-top-width"), 10);
		var paddingTop = parseInt($menu.css("padding-top"), 10);
		if (isNaN(topBorder)) { topBorder = 0; }
		if (isNaN(paddingTop)) { paddingTop = 0; }
		var topOverlap = (topBorder + paddingTop);
		// var topOverlap = self.options.topOverlap;
		var top;

		if (self.getOrientation() === "vertical" || i.menu.isSub) {
			top = i.navLink.position.top - topOverlap;
		} else { // horizontal
			top = i.navLink.outerHeight + i.navLink.position.top;
		}

		return top;
	}

	// FIXME: this overreacts to tall root horizontal menus in short windows, like with open debuggers
	// takes a menu (ul), and a positionInfo hash
	function bounceBottom($menu, i) {
		// do the bottom bounce
		var bottomOverlap = (i.menu.offset.top + i.menu.outerHeight) - (i.window.height + i.window.scrollTop);
		if (bottomOverlap > 0) {
			var bouncedMenuTop = i.menu.position.top - bottomOverlap;

			// we don't bounce if this is a top-level horizontal menu
			if (isHorizontal && !self.isSub($menu[0])) { return; }

			// if the bottom bounce puts it beyond the top of the window, then just start at the top of the window.			
			//if (bouncedMenuTop < 0) bouncedMenuTop = (i.window.scrollTop - i.menu.offset.top);

			// keep accounting up to date
			i.menu.position.top = bouncedMenuTop;

			// move the menu
			$menu.css({ top: i.menu.position.top + "px" });
		}
	}

	// takes a menu (ul), and a positionInfo hash
	function bounceTop($menu, i) {
		// do the top bounce
		var topOverlap = i.window.scrollTop - i.menu.offset.top;
		// we don't bounce if this is a top-level horizontal menu
		if (isHorizontal && !self.isSub($menu[0])) { return; }

		console.log(i.menu.position.top);
		if (topOverlap > 0) {
			// keep accounting up to date
			i.menu.position.top = i.menu.position.top + topOverlap;
			$menu.css({ top: i.menu.position.top + "px" });
		}
		console.log(i.menu.position.top);
		if (i.menu.position.top < topOverlap) {
			i.menu.position.top = topOverlap;
			$menu.css({ top: i.menu.position.top + "px" });
		}
		console.log(i.menu.position.top);

	}

	// takes a menu (ul), and a positionInfo hash
	function bounceRight($menu, i) {
		// do the right edge bounce -- this one is more involved
		var rightOverlap =  i.window.width - (i.menu.offset.left + i.menu.outerWidth);
		if (rightOverlap < 0) {
			var bouncedMenuLeft = i.menu.position.left + rightOverlap;
			//var bouncedMenuLeft = i.menu.position.left - (2 * i.menu.outerWidth) + (2 * self.options.leftOverlap);

			// if this is a 1st level subsection's menu in a
			// horizontal nav, and we need to bounce, we should just
			// go left instead of doing a naive bounce, which will
			// obscure the subsection's title with the new submenu
			if (isHorizontal && i.menu.isSub === 1) {
				bouncedMenuLeft = -i.menu.outerWidth + self.options.leftOverlap;
			}

			$menu.css({ left: bouncedMenuLeft + "px" });

			// keep our accounting up to date
			i.menu.position.left = bouncedMenuLeft;
			$menu.addClass("bounced");

			// if this is a second sub-menu, offset it vertically a bit
			if (i.menu.isSub > 1) {
				// keep our accounting up to date
				i.menu.position.top = i.menu.position.top + self.options.bounceOffset;
				$menu.css({ top: i.menu.position.top + "px" });
			}
		}
		return false;
	}

	function matchTitleWidth($menu, i) {
		if (!isHorizontal) { return; }

		var titleWidth = $menu.closest("li").outerWidth();
		if (titleWidth > i.menu.outerWidth) {
			$menu.css({ width: titleWidth + 20 + "px" });
			// keep our accounting of the width up to date
			i.menu.outerWidth = $menu.outerWidth();
		}
	}

	function positionMenu(menu) {
		// menu must not be display:none when we get here
		var $menu = $(menu);
		var $navLink = $menu.parent().children("a");

		// EXPERIMENTAL STUFF, commented out for now
		// if ($menu[0].positioned) return;

		// var originalStyle = {
		// visibility: $menu.css("visibility"),
		// display: $menu.css("display")
		// };
		// $menu.css({visibility:"hidden", display:"block"});


		// capture all relevant position data, minus the calculated
		// position of the menu
		var positionInfo = {
			menu: {
				dom: $menu,
				outerHeight: $menu.outerHeight(),
				outerWidth: $menu.outerWidth(),
				// offset: $menu.offset(),
				// position: $menu.position(),
				offset: null,
				position: null,
				isSub: self.isSub($menu),
				$navLink: $navLink
			},
			parent: {
				outerWidth: $menu.parent().outerWidth(),
				outerHeight: $menu.parent().outerHeight(),
				position: $menu.parent().position()
			},
			navLink: {
				dom: $navLink,
				position: $navLink.position(),
				outerWidth: $navLink.outerWidth(),
				outerHeight: $navLink.outerHeight()
			},
			window: {
				width: $(window).width(),
				height: $(window).height(),
				scrollTop: $(window).scrollTop(),
				offset: $menu.offset()
			}
		};

		// place it, initially
		$menu.css({
			left: calcLeft($menu, positionInfo) + "px",
			top: calcTop($menu, positionInfo) + "px"
		});

		// now record the calculated position of the menu
		positionInfo.menu.offset = $menu.offset();
		positionInfo.menu.position = $menu.position();

		// make adjustments and do bounces
		if (!positionInfo.menu.isSub) {
			matchTitleWidth($menu, positionInfo);
		}
		bounceBottom($menu, positionInfo);
		bounceTop($menu, positionInfo);
		bounceRight($menu, positionInfo);

		// $menu.css(originalStyle);
		$menu[0].positioned = true;
	}

	//  do the setup
	initialize();
}

function GlobalMenuNavController()
{
	var self = this;

	this.swipeState = null;
	this.swipeThreshold = 5;

	// PUBLIC PROPERTIES
	this.navs = []; // list of all menu navs controllers

	// EVENT HANDLERS
	function onWindowKeyPress(event) {
		// console.log("got key press, code " + event.keyCode);
		if (event.keyCode === 80) {
			if (window.menusPaused) {
				// console.log("unpausing menus.");
				window.menusPaused = false;
			} else {
				if (getOpenMenus().length > 0) {
					// console.log("pausing menus.");
					window.menusPaused = true;
				}
			}
		}
	}

	function onWindowTouchMove(event) {
		var oe = event.originalEvent;

		// touch move, this means a scroll or something has happened that
		// shouldn't close all menus when the touch event ends.
		if (self.swipeState) {
			self.swipeState.currentPosition = {
				x: oe.touches[0].pageX,
				y: oe.touches[0].pageY
			};
			self.swipeState.swipeLength = calculateSwipeDistance(self.swipeState);
			self.swipeState.isARealSwipe = (self.swipeState.swipeLength >= self.swipeThreshold);

			// console.log("onWindowTouchMove: swipe length: " + self.swipeState.swipeLength + (self.swipeState.isARealSwipe ? "; real swipe now" : "; not a real swipe"));
		} else {
			self.swipeState =  {
				completed: false,
				currentPosition: {
					x: null,
					y: null
				},
				startPosition: {
					x: oe.touches[0].pageX,
					y: oe.touches[0].pageY
				}
			};
		}
	}

	function onWindowTouchEnd() {
		// var oe = event.originalEvent;
		// console.log("onWindowTouchEnd");
		if (self.swipeState && self.swipeState.isARealSwipe) {
			// console.log("self.swipeState.isARealSwipe = " + self.swipeState.isARealSwipe);
		}
		if (!self.swipeState || !self.swipeState.isARealSwipe) {
			closeAllMenus();
		}

		// above here was the last call for responding to the swipe state
		self.swipeState = null;
	}

	// ACTIONS
	function closeAllMenus() {
		// if the cancel flag is set, reset it and don't close the menus...but
		// just this once.
		// if (cancelCloseAll) {
		// 	cancelCloseAll = false;
		// 	return;
		// }
		$.each(self.navs, function () {
			this.closeAllMenus();
		});
	}
	this.initializeAllMenuNavs = function () {
		$("nav.menu").each(function (i, nav) {
			self.addNav(nav);
		});
	};

	this.addNav = function (navElement) {
		self.navs.push(new MenuNav(navElement));
	};



	// INFO FUNCTIONS

	function getOpenMenus() {
		return $("nav.menu li.open");
	}

	// returns an integer. takes a current position object to compare against
	// the last recorded swipe origin position
	function calculateSwipeDistance(swipeState) {
		var delta = lineLength(swipeState.currentPosition.x, swipeState.currentPosition.y,
							   swipeState.startPosition.x, swipeState.startPosition.y);
		return Math.round(Math.abs(delta));
	}

	// WIRE UP EVENTS

	$(window)
		.on("keyup", onWindowKeyPress)
		.on("touchmove", onWindowTouchMove)
		.on("touchend", onWindowTouchEnd);
}

// FREE FUNCTIONS
function lineLength(x, y, x0, y0) {
	return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

// BUG TESTS
// this tests for this bug:
// https://bugzilla.mozilla.org/show_bug.cgi?id=63895
function detectMozillaCellContextBug() {
	var debug = false;
	var $box = $("<ul id='fftest'style='" + (debug ? "" : "visibility:hidden;") + "padding:0;margin:0;display:table;position:absolute;top:0;left:0;'><li style='margin:0;background:blue;position:relative;display:table-cell;'>woo woo</li><li style='margin:0;background:blue;position:relative;display:table-cell;'>hahhaha<ul style='padding:0;display:block;position:absolute;left:0;top:0;'><li class='spud' style='margin:0;display:block;background:red;height:5px;width:5px;'></li></ul></li></ul>");

	// test
	var originalPosition = $(document.body).css("position");
	$(document.body).css("position", "static").append($box);
	var offsetLeft = $box.find(".spud").offset().left;
	var result = (offsetLeft === 0  && $.browser.mozilla);

	// clean up
	$(document.body).css("position", originalPosition);
	if (debug) {
		// console.log("spud offset: " + offsetLeft);
		// console.log("firefox context bug: " + (result ? "present" : "not present"));
	} else {
		$box.remove();
	}

	// report
	if (result) { $("html").addClass("mozilla-cell-context-bug"); }
	return result;
}

// instantiate controllers for each menu nav on the page
$(document).ready(function documentReady() {
	// fire up the global menu nav controller and init all menus navs
	var gmnc = window.globalMenuNavController = new GlobalMenuNavController();
	gmnc.initializeAllMenuNavs();

	// runtime test for nasty gecko bug
	// detectMozillaCellContextBug();
});
