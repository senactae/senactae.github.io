var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/);

$(document).ready(function() {
	var _this = this;
	var acc_Contraste = false;

	$.getJSON('assets/data/data.json', function(data) {
		carregaData(data);
	});

	function carregaData(data) {
		_this.modulo = data.curso.modulo;
		_this.titulo = data.curso.titulo;
		_this.logo = data.curso.logo;
		_this.telas = data.curso.conteudo.telas;
		_this.template = data.curso.template;

		initContent();
	}

	function initContent() {
		$('body').addClass(_this.template);
	}

	// ACESSIBILIDADE
	// CONTRASTE
	$('#btn-contraste').bind('touchstart click',function(e) {
		if (acc_Contraste) {
			acc_Contraste = false;
			$('body').removeClass('contraste').addClass(_this.template);

			$('body').find('img').each(function(index, value){
				$path = $(this).attr('src').split(".");
				$cut = $path[0].split('_contraste');
				console.log($cut);

				$(this).attr('src', $cut[0] + '.' + $path[1]);
			});
		} else {
			acc_Contraste = true;
			$('body').removeClass(_this.template).addClass('contraste');

			$('body').find('img').each(function(index, value){
				$path = $(this).attr('src').split(".");
				$path[0] += '_contraste';

				$(this).attr('src', $path.join('.'));
			});
		}

		e.preventDefault();
	});
	// TEXTO
	$('#btn-fonte').bind('touchstart click',function(e) {
		$('body').toggleClass('updateSize');
		
		if ($('body').hasClass('updateSize')) {
			$(this).html('Diminuir Fonte');
		} else {
			$(this).html('Aumentar Fonte'); }

		e.preventDefault();
	});
});