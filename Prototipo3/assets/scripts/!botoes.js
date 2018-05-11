$('.bt-amplia').off().on('touchstart click', function (e) {
    console.log('clicou')
    var image = $(this).attr('data-img');
    $('.box-amplia .image-amplia').attr('src', 'assets/img/' + image + '_z.png')
    $('#amplia').removeClass('hidden');
    $('body').css('overflow', 'hidden');
});

$('.bt-fecha').off().on('touchstart click', function (e) {
    $('#amplia').addClass('hidden');
    $('body').css('overflow', 'auto');
});
