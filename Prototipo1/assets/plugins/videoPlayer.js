(function ( $ ) {
	$.fn.video_TAE = function(options) {		
		//var intervalo;
		var defaults = {
			id: null,
			auto: false,
			xml: null,
			capa: null,
			hd: false,
			video: null,
			skin: 'seven',
			legenda: null,
			materia: null,
			disciplina: null,
			volume: 75,
		};
		defaults = $.extend( {}, defaults, options );
		
		return this.each(function() {
			var $this = $(this);
			if (defaults.xml != null) carregaXML();
			
			// CARREGAR O XML | MENU DE CAPITULOS
			function carregaXML(){
				$.ajax({
					type: "GET",
					url: 'videos/' + defaults.xml + '.xml',
					dataType: "xml",
					success: function(xml) {
						$div = $('<div>').addClass('menu-chapter');
						$ul = $('<ul>').attr('id', 'ulCapitulos').addClass('ul-chapter');
						$btn_fechar = $('<div>').attr('id', 'btn-fecharUl').addClass('btn-fecharUl').html('X Fechar').on('click', openMenuChapter);
						$btn = $('<button>').addClass('nav-chapter').attr('type', 'button').on('click', openMenuChapter).html('<i class="fa fa-bars" aria-hidden="true"></i>');
						
						$(xml).find('chapter').each(function(i) {
							var $name = $(this).children('nome').text();
							var $time = $(this).children('tempo').text();
							var $li = $('<li>').addClass('btn-chapter').data('start', $time).attr('id', 'btn_' + i).html($name);
		
							$ul.append($li);
							$li.on('click', chapterClick);
						});
						
						$div.append($btn_fechar).append($ul);
						$this.append($btn).append($div);
						
						$size = $('.ul-chapter').width();
						$('.ul-chapter').css('right', '-' + $size + 'px');
						$('.btn-fecharUl').css('width', $('.ul-chapter').width());
					}
				});
			}

			$this.html('<div id="' + defaults.id + '">');

			var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
			var tipoLegenda = 'srt';
			if (iOS) { tipoLegenda = 'vtt'; }
			
			var subtitleArr;
			if (defaults.legenda != null) {
				subtitleArr = [{
					file: 'videos/' + defaults.legenda + '.' + tipoLegenda,
					label: 'Português',
					kind: 'captions',
					'default': false
				}];
			} else {
				subtitleArr	= false; };

			var isHD = defaults.hd;			
			var $obj;
			if (isHD == 'true') {
				$obj = [{
					file: 'videos/'+ defaults.video + '_360p.mp4',
					label: "360 SD",
					'default': true,
				}, {
					file: 'videos/'+ defaults.video + '_720p.mp4',
					label: "720 HD",
				}];
			} else {
				$obj = [{
					file: 'videos/'+ defaults.video + '.mp4',
					label: "360 SD",
					'default': true,
				}];
			}

			var skinPlayer;
			var playerVideo = jwplayer(defaults.id);			
			playerVideo.setup({
				autostart: defaults.auto,
				sources: $obj,
				tracks: subtitleArr,
				image: 'videos/' + defaults.capa,
			  	startparam: "start",
				start: 0,
				skin: { name: defaults.skin },
				width: "100%",
				aspectratio: "16:9",
				key: "3jUpeUAo0SesZulNIlX3EOyzZmzvT0koHOR4UA==",
			}).setVolume(defaults.volume);
			
			playerVideo.on('ready', function(evt) {
				if (!iOS) {
					$this.find('.jw-text-duration').appendTo($this.find('.jw-controlbar-left-group'));

					if (subtitleArr != false) {
						skinPlayer = $('.jw-skin-' + defaults.skin);

						newDiv = $('<div>').attr('id', defaults.id + '_track').addClass('track_sub').on('click', function() { playerVideo.pause(); });
						$this.append(newDiv);
						
						$this.find('.jw-captions').appendTo(newDiv);

						var subBar = skinPlayer.find('.jw-controlbar').height();
						var trackBar = $this.find('.track_sub').height();
						var bottomBar = subBar + trackBar;

						ccVisible = playerVideo.getCurrentCaptions();
						if (ccVisible == 0) {					
							$this.find('.track_sub').css('display', 'none');
							skinPlayer.find('.jw-controlbar').css('bottom', -subBar);
						} else {
							$this.find('.track_sub').css('display', 'table');
							skinPlayer.find('.jw-controlbar').css('bottom', -bottomBar); }
					}

					if (defaults.xml != null) {
						/* MENU  - CAPÍTULOS */
						$('.menu-chapter').css('height', $this.find('video').height() + 'px');
						altVideo = $this.find('video').height() - $('.btn-fecharUl').outerHeight(true);
						$('.ul-chapter').css('height', altVideo + 'px').addClass('scroll-pane');
						$('.scroll-pane').jScrollPane({ verticalGutter: 0 });
					}
				}
			});

			playerVideo.on('fullscreen', function(evt) {
				if (!iOS) {
					playerFull = playerVideo.getFullscreen();
					
					if (playerFull) {
						$this.find('.jw-captions').insertBefore('.jw-title'); 
					} else {
						var ccLayer = $this.find('.track_sub');
						$this.find('.jw-captions').appendTo(ccLayer); }
				}
			});
			
			playerVideo.on('captionsChanged', function(evt) {
				if (!iOS) {
					ccVisible = evt.track;

					var subBar = skinPlayer.find('.jw-controlbar').height();
					var trackBar = $this.find('.track_sub').height();
					var bottomBar = subBar + trackBar;

					if (ccVisible == 0) {
						skinPlayer.find('.jw-controlbar').animate({ bottom: -subBar }, 300);
					} else {
						skinPlayer.find('.jw-controlbar').animate({ bottom: -bottomBar }, 300); }
						
					$this.find('.track_sub').slideToggle(300);
				}
			});
			
			/*************************/

			if (defaults.xml != null) {
				playerVideo.on('time', function(evt) {
					$('.btn-chapter').each(function(index, element) {
						if (Math.floor(evt.position) == $(this).data('start')) {
							$('.btn-chapter').removeClass('selected').off().on('click', chapterClick);
							$(this).off().addClass('selected'); }
					});				
				});
				
				playerVideo.on('play', function(evt){
					if ($open) 
						$('.btn-fecharUl').trigger('click');
				});

				var $open = false;
				function openMenuChapter() { 
					$widthUl = $('.ul-chapter').width();
					
					if (!$open) {
						$('.menu-chapter').animate({ 'width': ($widthUl) + 'px' }, 500);
						$('.nav-chapter').fadeOut(200);
						$('.ul-chapter').animate({ 'right': '0' }, 500);
						playerVideo.pause(true);
						$open = true;
					} else {
						$('.menu-chapter').animate({ 'width': '0' }, 500);
						$('.nav-chapter').fadeIn(200);
						$('.ul-chapter').animate({ 'right': '-' + $widthUl + 'px' }, 500);
						playerVideo.play(true);
						$open = false;
					}
				}
				
				function chapterClick() {			
					playerVideo.seek($(this).data('start'));
					$('.btn-chapter').removeClass('selected').off().on('click', chapterClick);
					$(this).off().addClass('selected');
					
					openMenuChapter();
				}
			}
		});
	};
}(jQuery));