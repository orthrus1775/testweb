$(document).ready(function () {
    addNavSystems();
    addEvents();

    if ($('div.insideMainContent').text().length <= 10
        && $('div.insideLeftContent').text().length <= 10
        && $('div.insideRightContent').text().length <= 10) {
        $('div.mainContent').css('padding', 0);
        $('div.leftContent').css('padding', 0);
        $('div.rightContent').css('padding', 0);
        $('div.insideMainContent').css('padding', 0);
        $('div.insideLeftContent').css('padding', 0);
        $('div.insideRightContent').css('padding', 0);
    }
});

$(window).load(function () {
    $('.spacer').height($('.topbar').height());
});

function addNavSystems() {
    var $nav = $('.navDrop > nav.primary.mobilemenu');
    $nav.find("li.hasChildren").each(function () {
        if ($(this).hasClass('current')) {
            $(this).prepend($('<span class="plus open" tabindex="0"><span class="hidden">hide submenu</span><i class="fa fa-minus-square-o" aria-hidden="true"></i></span>'));
            $(this).children("ul").slideDown();
        } else
            $(this).prepend($('<span class="plus" tabindex="0"><span class="hidden">show submenu</span><i class="fa fa-plus-square-o" aria-hidden="true"></i></span>'));
    });
}

function addEvents() {
    $('.searchIcon').click(function () {
        if ($('div.searchDrop').is(':hidden')) {
            $('.searchDrop').slideDown();
            $('.searchField').focus();
        } else {
            $('.searchDrop').slideUp();
        }
    });
    $('.navIcon').click(function () {
        //$('.navDrop').slideToggle();
        if ($('div.navDrop').is(':hidden')) {
            $('.navDrop').slideDown();
            $('.topbar').addClass('scroll');
            $('body').addClass('noscroll');
        } else {
            $('.navDrop').slideUp();
            $('.topbar').removeClass('scroll');
            $('body').removeClass('noscroll');
        }
    })

    $('nav.mobilemenu span.plus').click(function () {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this).html('<i class="fa fa-plus-square-o" aria-hidden="true"></i>');
            $(this).parent().children("ul").slideUp();
        } else {
            $(this).addClass('open');
            $(this).html('<i class="fa fa-minus-square-o" aria-hidden="true"></i>');
            $(this).parent().children("ul").slideDown();
        }
    });

    $('nav.mobilemenu span.plus').keydown(function (e) {
        if (e.keyCode == 13) { $(this).click(); }
    });

    $(window).resize(function () {
        if ($(window).width() > 899) {
            if ($('div.searchDrop').not(':hidden')) {
                $('.searchDrop').slideUp();
            }
            if ($('div.navDrop').not(':hidden')) {
                $('.navDrop').slideUp();
            }
        }
        $('.spacer').height($('.topbar').height());
    });
}
