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
			aspect: '16:9',
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
						$btn_menu = $('<button>').addClass('nav-chapter').attr('type', 'button').on('click', openMenuChapter).html('<i class="fa fa-bars" aria-hidden="true"></i>');
						
						$(xml).find('chapter').each(function(i) {
							var $name = $(this).children('nome').text();
							var $time = $(this).children('tempo').text();
							var $li = $('<li>').addClass('btn-chapter').data('start', $time).attr('id', 'btn_' + i).html($name);
		
							$ul.append($li);
							if ($(this).find('topico').length != 0) {
								$ul_Sub = $('<ul>').addClass('ul-subChapter');
								$(this).find('topico').each(function(j) {
									var $name_Sub = $(this).children('nome').text();
									var $time_Sub = $(this).children('tempo').text();
									var $li_Sub = $('<li>').addClass('btn-subChapter').data('start', $time_Sub).attr('id', 'btn_Sub' + j).html($name_Sub);
									$ul_Sub.append($li_Sub);
									
									$li_Sub.on('click', chapterClick);
								});
								$ul.append($ul_Sub);
							}

							$li.on('click', chapterClick);
						});
						
						$div.append($btn_fechar).append($ul);
						$this.append($btn_menu).append($div);

						/*$size = $('.ul-chapter').width();
						$('.ul-chapter').css('right', '-' + $size + 'px');
						$('.btn-fecharUl').css('width', $('.ul-chapter').width());*/
					}
				});
			}

			$this.html('<div id="' + defaults.id + '">');

			var deviceIsMobile = /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent);
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

			var subBar;
			var trackBar;
			var bottomBar;
			var ccVisible;
			var skinPlayer;
			var playerFull = false;
			var apiPanel;
			var altVideo;

			var contadorTempo = 0;
			var tempoVideo;
			var indexTempo;
			var guardaTempo;
			var isPlayed = false;

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
				aspectratio: defaults.aspect,
				key: "3jUpeUAo0SesZulNIlX3EOyzZmzvT0koHOR4UA==",
			}).setVolume(defaults.volume);
			
			playerVideo.on('ready', function(evt) {
				if (!iOS) {
					getBootstrapBreakpoint();

					$('.jw-text-duration').appendTo('.jw-controlbar-left-group');
					$('.jw-icon-fullscreen').addClass('hidden');

					if (subtitleArr != false) {
						skinPlayer = $this.find('.jw-skin-' + defaults.skin);

						newDiv = $('<div>').attr('id', defaults.id + '_track').addClass('player-captions').on('click', function() { playerVideo.pause(); });
						$this.append(newDiv);
						
						$this.find('.jw-captions').appendTo(newDiv);

						subBar = skinPlayer.find('.jw-controlbar').height();
						trackBar = $this.find('.player-captions').height();
						bottomBar = subBar + trackBar;

						ccVisible = playerVideo.getCurrentCaptions();
						if (ccVisible == 0) {					
							$this.find('.player-captions').css('display', 'none');
							$this.find('.jw-controlbar').css('bottom', -subBar);
						} else {
							$this.find('.player-captions').css('display', 'table');
							$this.find('.jw-controlbar').css('bottom', -bottomBar); }
					}

					if (defaults.xml != null) {
						/* MENU  - CAPÍTULOS */
						$heightVideo = $this.outerHeight(true);
						$('.menu-chapter').css('height', $heightVideo + 'px');
						$('.ul-chapter').css('height', $heightVideo + 'px').addClass('scroll-pane');
						$('.scroll-pane').jScrollPane({ verticalGutter: 0 });
					}
				}
			});

			playerVideo.on('play', function(evt) {
				if (!isPlayed) {
					/* LIGHTS
					$lights = $('<div>').addClass('jw-icon jw-icon-tooltip jw-icon-lights jw-reset jw-toggle jw-off').html('<div class="jw-overlay jw-reset"></div>');
					$lights.insertBefore('.jw-icon-fullscreen');
					$lights.off().on('click', toggleLights);
					$this.find('.jw-icon-volume').addClass('lights'); */

					isPlayed = true;
				}
			});

			playerVideo.on('fullscreen', function(evt) {
				if (!iOS) {
					playerFull = playerVideo.getFullscreen();
					
					if (playerFull) {
						$('.jw-captions').insertBefore('.jw-title'); 
						$this.find('.jw-controlbar').css('bottom', 0);
					} else {
						var ccLayer = $this.find('.player-captions');
						$('.jw-captions').appendTo(ccLayer); 

						if (ccVisible == 0) {
							$this.find('.jw-controlbar').css('bottom', -subBar);
						} else {
							$this.find('.jw-controlbar').css('bottom', -bottomBar); }
					}
				}
			});
			
			playerVideo.on('captionsChanged', function(evt) {
				if (!iOS) {
					ccVisible = evt.track;

					//$this.height('auto');
					resizePlayer();

					if (ccVisible == 0) {
						if (playerFull) { 
                            $this.find('.jw-controlbar').css('bottom', 0); 
                        } else {
							skinPlayer.find('.jw-controlbar').css('bottom', -subBar); }

						$heightVideo = $this.height() - subBar;
					} else {
                        if (playerFull) { 
                            $this.find('.jw-controlbar').css('bottom', 0); 
                        } else { 
							skinPlayer.find('.jw-controlbar').css('bottom', -bottomBar); }
							
						$heightVideo = $this.height() + bottomBar;
					}

					$this.find('.player-captions').slideToggle(200);
				}
			});

			playerVideo.on('time', function(evt) {
				tempoVideo = Math.floor(evt.position);

				if (defaults.xml != null) {
					$('.btn-chapter').each(function(index, element) {
						if (Math.floor(tempoVideo) == $(this).data('start')) {
							$('.btn-chapter').removeClass('selected').off().on('click', chapterClick);
							$(this).off().addClass('selected'); }
					});	

					$('.btn-subChapter').each(function(j, el) {
						if (Math.floor(tempoVideo) == $(this).data('start')) {
							$('.btn-subChapter').removeClass('selected').off().on('click', chapterClick);
							$(this).off().addClass('selected'); }
					});
				}
			});

			/*************************/
			// FUNÇÃO CINEMA
			function toggleLights() {
				$(this).toggleClass('jw-off');

				if ($(this).hasClass('jw-off')) {
					$('body').removeClass('lightsOn');
				} else {
					$('body').addClass('lightsOn'); }
			}
			/*************************/

			if (defaults.xml != null) {
				var $open = false;

				function openMenuChapter() { 
					$widthUl = $('.menu-chapter').width();
					
					if (!$open) {
						//$('.menu-chapter').animate({ 'width': ($widthUl) + 'px' }, 500);
						$('.nav-chapter').addClass('esconde');
						$('.menu-chapter').addClass('aberto').animate({ 'right': '0' }, 250);
						//playerVideo.pause(true);
						$open = true;
					} else {
						//$('.menu-chapter').animate({ 'width': '0' }, 500);
						$('.menu-chapter').removeClass('aberto').animate({ 'right': '-' + $widthUl + 'px' }, 300, function(){ 
							$('.nav-chapter').removeClass('esconde');
						});
						//playerVideo.play(true);
						$open = false;
					}
				}

				function chapterClick() {			
					playerVideo.seek($(this).data('start'));
					/*$('.btn-chapter').removeClass('selected').off().on('click', chapterClick);
					$('.btn-subChapter').removeClass('selected').off().on('click', chapterClick);*/
					$(this).off().addClass('selected');
				}
			}

			// Breakpoint
			function getBootstrapBreakpoint(){
				var w = $(document).innerWidth();
				var allClasses = 'video-xs video-sm video-md video-lg';

				if (w < 768) {
					$this.removeClass(allClasses).addClass('video-xs');
				} else if (w < 992) {
					$this.removeClass(allClasses).addClass('video-sm');
				} else if (w < 1200) {
					$this.removeClass(allClasses).addClass('video-md');
				} else {
					$this.removeClass(allClasses).addClass('video-lg');
				}
			}

			// RESIZE PLAYER 
			function resizePlayer() {
				clearTimeout(window.resizeEvt);

				getBootstrapBreakpoint();

				window.resizeEvt = setTimeout(function(){
					$this.height('auto');
					$('.menu-chapter').removeAttr('style').height('auto');

					$heightVideo = $this.outerHeight(true);
					
					$('.menu-chapter').css('height', $heightVideo + 'px');
					$('.ul-chapter').removeAttr('style').css('height', $heightVideo + 'px');
					$('.scroll-pane').jScrollPane({ verticalGutter: 0 });
            		
					clearTimeout(window.resizeEvt);
				}, 250);
			}

			// ATUALIZAR AO REDIMENSIONAR A JANELA
			$(window).resize(function(){
				resizePlayer();
			});
		});
	};
}(jQuery));