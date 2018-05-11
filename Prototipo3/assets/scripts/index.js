var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/);

$(document).ready(function() {
    var _this = this;
    
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
		$('body').find('h1').append(_this.titulo);

        $spanTitulo = $('<strong>').html(_this.telas[0].aula + _this.telas[0].titulo);
        $('body').find('h2').append($spanTitulo);

		$.data(this, 'enterSite', setTimeout(function() {
			//verificaAltura();
			//selecionaMenu();
			clearTimeout($.data(this, 'enterSite'));
		}, 200));		
	}

	triggerWay = function(WayImage, idWay, pathWay, funcWay) {
		var waypoint = new Waypoint({
			element: document.getElementById(idWay),
			handler: function(direction) {
				$('#' + WayImage).attr('src', pathWay);
				
				if (funcWay) funcWay();

				this.destroy();
			},

			offset: '40%'
		});
	}
})
