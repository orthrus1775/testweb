// Responsive specific javascript
var lastsize = 2000;

$(window).load(function () {
	resized();
	accordion();
	loadWeather();
	loadAirQuality();
	// clipImages();
	loadDocumentManager();
});

$(window).resize(function () {
	if ((Math.abs(lastsize - $(window).width())) > 100) {
		lastsize = $(window).width();
		resized();
	}
});

// used for iframe resizing
if (document.getElementById("massForm")) {
	window.addEventListener(
		"message",
		function (event) {
			let iframe = document.getElementById("massForm");
			let { height } = JSON.parse(event.data);
			if (height && height > 0 && iframe) {
				iframe.height = height + "px";
			}
		},
		false
	);
}

function resized() {
	if ($(window).width() > 900) {
		// reset the boxes, then size them according to the biggest for each group.
		$('.mainContent .responsivebox').css('height', 'auto');
		var sec = $('.mainContent section.box').has('.responsivebox')
		sec.each(function (index) {
			Match.classMatch($(this).find('.responsivebox'));
		});
	}
	else {
		$('.B_LIST .responsivebox').css('height', 'auto');
	}
}

function accordion() {
	$('.accordion article h2').addClass('closed');
	$('.accordion article h2').click(function () {
		if ($(this).hasClass('closed')) {
			$(this).parent().parent().find('.description').slideUp(500);
			$(this).parent().parent().find('h2.open').removeClass('open').addClass('closed');
			$(this).parent().parent().find('h2 button').children('i.fa-minus-square-o').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
			$(this).find('i').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
			$(this).attr("aria-expanded", "true");
			$(this).siblings('.description').slideDown(500).attr("aria-hidden", "false");
			$(this).removeClass('closed').addClass('open');
		}
		else {
			$(this).attr("aria-expanded", "false");
			$(this).siblings('.description').slideUp(500).attr("aria-hidden", "true");
			$(this).removeClass('open').addClass('closed');
			$(this).find('i').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
		}
	});
	$('.accordion .accordionall').click(function () {
		if ($(this).html() == "Expand All") {
			$(this).parent().find('article h2').attr("aria-expanded", "true").removeClass('closed').addClass('open');
			$(this).parent().find('article .description').slideDown(500).attr("aria-hidden", "false");
			$(this).parent().find('article h2 button').children('i.fa-plus-square-o').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
			$(this).html('Collapse All');
		}
		else {
			$(this).parent().find('article h2').attr("aria-expanded", "false").removeClass('open').addClass('closed');
			$(this).parent().find('article .description').slideUp(500).attr("aria-hidden", "true");
			$(this).parent().find('article h2 button').children('i.fa-minus-square-o').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
			$(this).html('Expand All');
		}
	});
	$('section .accordion').each(function (index) {
		$(this).find('h2').first().click();
	});
}

function loadWeather() {
    var url = "/govofficeservices/api/weather/GetWeather.ashx";
    if ($('.openweather').length) {
        $.getJSON(url, { format: "json" })
            .done(function (data) {
                let currenttemp = Math.round(data.main.temp * 10) / 10;
                let currentcond = data.weather[0].description;
                let currentlink = 'https://openweathermap.org/city/' + data.id;
                $('.openweather').append('<a href="' + currentlink + '" target="_blank">' + currenttemp + '°&nbsp;&nbsp;' + currentcond + '</a>');
            });
    }
}

function loadAirQuality() {
    var url = "/govofficeservices/api/weather/GetAirQuality.ashx";
    if ($('.airquality').length) {
        $.getJSON(url, { format: "json" })
            .done(function (data) {
				let aqi = data.list[0].main.aqi;
				let q = 'Good';
				switch (aqi) {
					case 2:	q = 'Fair';	break;
					case 3:	q = 'Moderate';	break;
					case 4:	q = 'Poor';	break;
					case 5:	q = 'Very Poor'; break;
					default: break;
				}
            $('.airquality').append(q);
        });
    }
}

function clipImages() {
	var clipImage = $('div.image.circle > img');
	var offset = 0;
	clipImage.each(function (index) {
		if ($(this).width() > $(this).height()) {
			$(this).css('clip-path', 'circle(' + (($(this).height() / 2) + 'px at 50% 50%)'));
		}
		else {
			$(this).css('clip-path', 'circle(' + (($(this).width() / 2) + 'px at 50% 50%)'));
		}
	});
	clipImage = $('div.image.square > img');
	clipImage.each(function (index) {
		if ($(this).width() > $(this).height()) {
			offset = ($(this).width() - $(this).height()) / 2;
			$(this).css('clip-path', 'inset(0 ' + offset + 'px 0 ' + offset + 'px)');
		}
		else {
			offset = ($(this).height() - $(this).width()) / 2;
			$(this).css('clip-path', 'inset(' + offset + 'px 0 ' + offset + 'px 0)');
		}
	});
}

let map;
function initMap() {
	let locations = document.getElementsByClassName("hidden location");
	let addresses = document.getElementsByClassName("hidden address");
	let loc = '';
	let first = '';
	// Get the first location with values to center the map
	for (let i = 0; i < locations.length; i++) {
		loc = locations[i].innerHTML;
		if (loc.length > 0) {
			first = loc;
			break;
		}
	}
	if (first.length > 0) {
		let c = first.split(",");
		let myLatLng = { lat: parseFloat(c[0]), lng: parseFloat(c[1]) };
		//let myLatLng = new google.maps.LatLng(locations[0].innerHTML);
		map = new google.maps.Map(document.getElementById('dirmap'), {
			center: myLatLng,
			zoom: 12
		});
	}

	var markers = new Array();
	var infoWindow = new google.maps.InfoWindow();
	for (let i = 0; i < locations.length; i++) {
		let loc = locations[i].innerHTML;
		let addr = addresses[i].innerHTML;
		if (loc.length > 0) {
			let c = loc.split(",");
			if (c.length > 2) {
				let myLatLng = { lat: parseFloat(c[0]), lng: parseFloat(c[1]) };
				let cont = '<div class="info"><h3>' + c[2] + '</h3><div><p>' + addr + '</p></div></div>';
				const marker = new google.maps.Marker({
					position: myLatLng,
					map: map
				});
				markers[i] = marker;
				(function (marker) {
					google.maps.event.addListener(marker, "click", function (e) {
						if (infoWindow) {
							infoWindow.close();
						}
						infoWindow.setContent(cont);
						infoWindow.open(map, marker);
					});
				})(marker);
			}
		}
	}
	$('.showonmap').click(function () {
		let id = $(this).index('.showonmap');
		//console.log(j);
		google.maps.event.trigger(markers[id], 'click');
		document.getElementById('dirmap').scrollIntoView({ behavior: 'smooth', block: 'center' });
	});
}

$(document).ready(function() {
	if ($('.namesearch').length) {
		$('.namesearchbox i').click(function () {
			if ($(this).hasClass('fa-magnifying-glass')) {
				searchtitles();
			}
			else {
				resetsearchtitles();
			}
		});
		$(document).on('keyup', function(e) {
			if (e.key == "Enter") searchtitles();
			if (e.key == "Escape") resetsearchtitles();
		});
	}
});

function searchtitles() {
	let filter = $('.namesearch').val().toLowerCase();
	$('h2').each(function () {
		if ($(this).text().toLowerCase().indexOf(filter) > -1) {
			$(this).closest('article').addClass('found');
		}
		else {
			$(this).closest('article').addClass('filtered');
		}
	});
	$('i.fa-magnifying-glass').addClass('fa-circle-xmark').removeClass('fa-magnifying-glass');
}

function resetsearchtitles() {
	$('i.fa-circle-xmark').addClass('fa-magnifying-glass').removeClass('fa-circle-xmark');
	$('.filtered').removeClass('filtered');
	$('.found').removeClass('found');
}


// document manager
function loadDocumentManager() {
	if ($('.docmanfolder').length > 0) {
		$('.docmanContainer').each(function () {
			let c = $(this).attr('id');
			let f = c;
			$(this).attr('currentfolder', f);
			GetCurrentFolder(c, f);
		});
		rebindDocMan();
		$('#docmanSearchButton').click(function () {
			let c = $(this).closest('.docmanContainer').attr('id');
			let f = $(this).closest('.docmanContainer').attr('currentfolder');
			DocSearch(c, f);
		});
		$('.docmanSearch i.fa-magnifying-glass').click(function () {
			let c = $(this).closest('.docmanContainer').attr('id');
			let f = $(this).closest('.docmanContainer').attr('currentfolder');
			DocSearch(c, f);
		});
		$('.docsearch').on('keyup', function (e) {
			if (e.key == "Enter") {
				let c = $(this).closest('.docmanContainer').attr('id');
				let f = $(this).closest('.docmanContainer').attr('currentfolder');
				DocSearch(c, f);
			}
		});
	}
}

function DocSearch(c, f) {
	if ($('.docmanContainer#' + c + ' .docsearch').val().length > 0) {
		$('.docmanContainer#' + c + ' .subfolders').html('');
		let s = $('.docmanContainer#' + c).attr('sec');
		let k = $('.docmanContainer#' + c + ' .docsearch').val();
		// k = k.replace(/'/g, '');
		// k = k.replace(/-/g, '');
		// k = k.replace(/"/g, '');
		$.ajax({
			type: "GET",
			url: "/admin/dm/Public/SearchFolder/?folderid=" + f + "&sec=" + s + "&search=" + k ,
			cache: false,
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data) {
				let primary = '.docmanContainer#' + c;
				if ($(primary + ' div.breadcrumb > div:contains("Search Results")').length == 0) {
					$(primary + ' div.breadcrumb > div').append(' > <span id="s' + data.folderId + '">Search Results</span>');
				}
				$(primary + ' .docmanfolder .subfolders').append('<div class="headings"><div><i class="fa-regular fa-arrow-up"></i>Name</div><div>Last Modified Date</div><div><i class="fa-regular fa-arrow-right"></i></div></div>');

				$.each(data, function (i, file) {
					let df = String(file.fileDate);
					df = df.substring(0, df.indexOf('T'));
					if (df.startsWith('1900')) df = '';


					let fn = file.fileName;
					if (file.FileTitle != null && file.FileTitle.length > 0) fn = file.FileTitle;

					$(primary + ' .docmanfolder .subfolders').append('<div class="file" id="' + file.fileId + '"><div>' + GetFileIcon(file.fileType) + fn + '</div><div>' + df + '</div><div><i class="fa-solid fa-download"></i></div></div>');
				});
				rebindDocMan();
			},
			failure: function (data) { console.log('failure: ' + JSON.stringify(data)); },
			error: function (data) { console.log('error: ' + JSON.stringify(data)); }
		});
		$('.docmanContainer#' + c + ' .docsearch').val('');
	}
}

function rebindDocMan() {
	$('.docmanfolder .folder').unbind('click').on('click', function (e) {
		let c = $(this).closest('.docmanContainer').attr('id');
		let f = $(this).attr('id');
		GetCurrentFolder(c, f);
	});
	$('.docmanfolder .file').unbind('click').on('click', function (e) {
		let clickedfileid = $(this).attr('id');
		window.open('/admin/dm/Public/DownloadFile/?fileid=' + clickedfileid, '_blank', 'noreferrer');
	});
	$('.docmanContainer .breadcrumb > div > span').unbind('click').on('click', function (e) {
		let c = $(this).closest('.docmanContainer').attr('id');
		let f = $(this).attr('id').substring(1);
		$(this).nextAll().remove();
		GetCurrentFolder(c, f);
	})
}

function GetCurrentFolder(c, f) {
	$('.docmanContainer#' + c + ' .subfolders').html('');
	let primary = '.docmanContainer#' + c;
	let s = $(primary).attr('sec');
	$(primary).attr('currentfolder', f);
	$.ajax({
		type: "GET",
		url: "/admin/dm/Public/GetFolderById/?folderid=" + f + "&sec=" + s,
		cache: false,
		async: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			if (c == f)
				$(primary + ' div.breadcrumb > div').html('<span id="s' + data.folderId + '">' + data.folderName + '</span>');
			else {
				$active = $(primary + ' div.breadcrumb > div').find('#s' + f)
				if ($active.length == 0)
					$(primary + ' div.breadcrumb > div').append(' > <span id="s' + data.folderId + '">' + data.folderName + '</span>');
			}
			$(primary + ' .docmanfolder .subfolders').append('<div class="headings"><div><i class="fa-regular fa-arrow-up"></i>Name</div><div>Last Modified Date</div><div><i class="fa-regular fa-arrow-right"></i></div></div>');

			$.each(data.dmfolders, function (i, subfolder) {
				let d = String(subfolder.lastModified);
				d = d.substring(0, d.indexOf('T'));
				d = '';
				$(primary + ' .docmanfolder .subfolders').append('<div class="folder" id="' + subfolder.folderId + '"><div><i class="fa-solid fa-folder"></i>' + subfolder.folderName + '</div><div>' + d + '</div><div><i class="fa-regular fa-arrow-right"></i></div></div>');
			});
			$.each(data.dmfiles, function (i, file) {
				let df = String(file.fileDate);
				df = df.substring(0, df.indexOf('T'));

				let fn = file.fileName;
				if (file.FileTitle != null && file.FileTitle.length > 0) fn = file.FileTitle;
				$(primary + ' .docmanfolder .subfolders').append('<div class="file" id="' + file.fileId + '"><div>' + GetFileIcon(file.fileType) + fn + '</div><div>' + df + '</div><div><i class="fa-solid fa-download"></i></div></div>');
			});
			rebindDocMan();
		},
		failure: function (data) { console.log('failure: ' + JSON.stringify(data)); },
		error: function (data) {
			console.log('error: ' + JSON.stringify(data));
			if (data.status == 401) {
				$('div.breadcrumb').html('You will need to authenticate to see this content.');
				$('div.searchContainer').hide();

			}
		}
	});
}

function GetFileIcon(filetype) {
	switch (filetype.toLowerCase()) {
		case 'jpeg':
		case 'jpg':
		case 'png':
		case 'gif':
			return '<i class="fa-solid fa-file-image"></i>';
		case 'doc':
		case 'docx':
			return '<i class="fa-solid fa-file-word"></i>';
		case 'xls':
		case 'xlsx':
			return '<i class="fa-solid fa-file-excel"></i>';
		case 'pdf':
			return '<i class="fa-solid fa-file-pdf"></i>';
		case 'zip':
		case '7z':
			return '<i class="fa-solid fa-file-zipper"></i>';
		case 'avi':
		case 'm4v':
		case 'mp4':
		case 'mov':
		case 'mkv':
			return '<i class="fa-solid fa-file-video"></i>';
		case 'mp3':
		case 'ogg':
		case 'wav':
			return '<i class="fa-solid fa-file-audio"></i>';
		default:
			return '<i class="fa-solid fa-file"></i>';
	}
}
