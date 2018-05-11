var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
if (iOS) { $('body').addClass('ios'); }

$(document).ready(function (e) {
    var totalMenus = 13;
    var currentPages = 0;
    var isPreviousEventComplete = true;
    var isDataAvailable = true;
    var scrollInicio = false;
    var dataClickControl = [];
    var totalPages = new Array();
    var menuPages = new Array();


    // CARREGAR O XML | MENU
    function carregaXML() {
        $.ajax({
            type: "GET",
            url: 'assets/xml/paginas.xml',
            dataType: "xml",
            success: function (xml) {
                var guardaPage;

                $(xml).find('pagina').each(function (i) {
                    var $name = $(this).children('nome').text();
                    var $link = $(this).children('link').text();
                    var $show = $(this).attr('show');

                    if ($show == 'true') {
                        $(".full-menu").append('<li><a href="' + $link + '" class="btn-menu" >' + $name + '</a></li>');
                        guardaPage = $link;
                    }

                    menuPages.push(guardaPage);
                    totalPages.push($link);
                });

                //				console.log(menuPages);
                selectActiveItem();
            }
        });
    }
    carregaXML();

    // SELECIONA A PÁGINA DA VEZ
    function selectActiveItem() {
        var sURL = window.location.pathname;
        var arrayURL = sURL.split("/");
        namePage = arrayURL[arrayURL.length - 1];

        numPage = namePage.substring(0, 2);
        $('.pages').append(numPage + ' de ' + totalPages.length);

        var guardaLink = $.inArray(namePage, totalPages);
        $('.full-menu').find('a').each(function () {
            if (menuPages[guardaLink] == $(this).attr('href')) {
                $(this).addClass('active').children('a').removeAttr('href');
            }
        });

    }

    var isOff = false;

    $('.nav-button').on('touchstart click', function (e) {
        console.log(isOff)
        e.preventDefault();
        $('header').addClass('hidden')
        if (isOff) {
            isOff = false;
            $('.overlayMenu').width('0%');
            $('.full-menu').css({
                'display': 'none'
            });
            $('html, body').css('overflow', 'auto');
            $('header').removeClass('hidden')
        } else {
            isOff = true;
            $('.overlayMenu').width('100%');
            $('.full-menu').css({
                'display': 'block'
            });
            $('html, body').css('overflow', 'hidden');
        }

        return false;
    });


    // ANCHOR TO TOP
    $('.goTop').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    /* SLIDER STOP */
    $('.carousel').carousel({
        interval: false
    }); 





})
