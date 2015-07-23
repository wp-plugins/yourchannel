var YC = YC || {'channels':{}};
	YC.lang = {'aui': yrc_lang_terms.aui};
	
jQuery(document).ready(function($){
	YC.EM = YC.EM || $({});

	YC.template = function(selector){
		return _.template($(selector).html());
	};
	
	YC.post = function(data, success, error){
		$.ajax({
			url: 'admin-ajax.php',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: success,
			error: error
		});
	};
	
	YC.channel = {};

	YC.channels.adminit = function(channel, key, is_new){
		if(!is_new) YRC.merge(channel, YC.dummy);
		channel.social = channel.social || {};
		YC.channel.data = channel;
		YC.channel.key = key;
		
		$('.yrc-content, #yrc-lang-form').addClass('wpb-hidden');
		$('#yrc-editor').html( YC.template('#yrc-form-tmpl')( YC.channel.data )).removeClass('wpb-hidden');
						
		YC.EM.trigger('yc.form');
						
		$('#yrc-live').removeClass('wpb-hidden');
		YC.channel.setup = new YRC.Setup(0, YC.channel.data, $('#yrc-live'));
	};
	
	YC.redraw = function(){
		$('style.yrc-stylesheet').remove();
		$('#yrc-live').empty();
		YC.channel.setup = new YRC.Setup(0, YC.channel.data, $('#yrc-live'));
	};

	$('body').on('change', 'input[name=apikey]', function(e){
		YC.channel.data.meta.apikey = $(this).val().trim();
		YRC.auth.apikey = $(this).val().trim();
	});

	$('body').on('click', '#yrc-get-channel-id', function(e){
		$('.pbc-form-message').text('').removeClass('pbc-form-error');
		if(!YC.channel.data.meta.apikey || YC.channel.data.meta.apikey.length != 39) return YC.formError('apikey');
		var user_box = $('#yrc-username'), channel_input = $('#yrc-channel');
			if(!user_box.val() && !channel_input.val()) return;
			
		YRC.auth.apikey = YRC.auth.apikey || YC.dummy.meta.apikey;	
		var uu = user_box.val() ? YRC.auth.baseUrl('channels?part=snippet,contentDetails,statistics&forUsername='+user_box.val().trim())
				: YRC.auth.baseUrl('channels?part=snippet,contentDetails,statistics&id='+channel_input.val().trim());
		ajax(uu, function(re){
			if(!re.items.length)
				$('#yrc-ac-error').text( (user_box.val() ? user_box.val() : channel_input.val()) + YC.lang.aui.does_not_exist ).addClass('pbc-form-error');
			else {
				if(user_box.val()) channel_input.val(re.items[0].id);
				else user_box.val(re.items[0].snippet.title);
				
				channel_input.val(re.items[0].id);
				YC.channel.data.meta.channel = re.items[0].id;
				YC.channel.data.meta.user = user_box.val();
				YC.channel.data.meta.channel_uploads = re.items[0].contentDetails.relatedPlaylists.uploads;
				YC.channel.data.meta.onlyonce = '';
				YC.redraw();
			}
		}, function(er){
			console.log(er);
		});
	});
	
	$('body').on('change', '#yrc-channel', function(e){ $('#yrc-username').val(''); });
	$('body').on('change', '#yrc-username', function(e){ $('#yrc-channel').val(''); });
	$('body').on('change', '#pbc-show-sections input', function(e){
		if(this.name === 'banner') $('#yrc-show-sub-button').toggleClass('wpb-force-hide');
		YC.channel.data.style[this.name] = this.checked ? true : '';
		if(YC.channel.data.style.search_on_top) YC.channel.data.style.search = true;
		YC.redraw();
	});
	
	$('body').on('change', 'input[name=video_meta], input[name=video_size]', function(e){
		if(this.name === 'video_size')
			YC.channel.data.style.video_style[0] = this.value;
		else 
			YC.channel.data.style.video_style = [(this.value === 'adjacent' ? 'adjacent' : YC.channel.data.style.video_style[0]), this.value];
		
		if(YC.channel.data.style.video_style[1] === 'adjacent'){
			YC.channel.data.style.video_style[0] = 'adjacent';
			$('input[value=small]').attr('checked', 'checked');
		} else {
			if(YC.channel.data.style.video_style[0] === 'adjacent')
				YC.channel.data.style.video_style[0] = 'small';
		}
		
		$('.yrc-video').removeClass('yrc-item-open yrc-item-none yrc-item-closed yrc-item-adjacent yrc-item-small yrc-item-large')
			.addClass('yrc-item-'+YC.channel.data.style.video_style[0]+' yrc-item-'+YC.channel.data.style.video_style[1]);	
		YC.channel.setup.size.resize();
	});

	function ajax(url, success, error){
		$.ajax({
			type: 'GET',
			url: url,
			success: success,
			error: error
		});
	}
	
	function rawValues( inputs ){
		var o = {};
		inputs.each(function(){
			if(this.type === 'radio'){
				if(this.checked) o[this.name] = this.value;
			} else if (this.type === 'checkbox') {
				o[this.name] = this.checked ? 1 : '';
			} else o[this.name] = this.value;
		});
		return o;
	}

	$('body').on('submit', '#pbc-form', function(e){
		e.preventDefault();
		$('.pbc-form-message').text('').removeClass('pbc-form-error');
		if(!YC.channel.data.meta.user || !YC.channel.data.meta.channel|| !YC.channel.data.meta.apikey) 
			return YC.formError('invalid');
		
		var o = rawValues($('input.wpb-raw'));
		YC.channel.data.style.player_mode = o.player_mode;
		YC.channel.data.style.truncate = o.truncate;
		YC.channel.data.style.rtl = o.rtl;
		YC.channel.data.style.thumb_margin = o.thumb_margin || 8;
		YC.channel.data.style.video_style = YC.channel.data.style.video_style.splice(0, 2);
		YC.channel.data.style.player_top = o.player_top;
		YC.channel.data.style.thumb_image_size = o.thumb_image_size;
		YC.channel.data.style.play_icon = o.play_icon;
		YC.channel.data.meta.onlyonce = o.onlyonce;
		
			
		YC.EM.trigger('yc.save', o);	
		
		$('.pbc-form-save .button-primary').text(YC.lang.aui.saving+'...');
		var is_new = (YC.channel.key === 'nw');
		delete YC.channel.data.meta.playlist;
		
		YC.post({'action': 'yrc_save', 'yrc_channel': YC.channel.data}, function(re){
			if(!re) YC.formError('invalid');
			
			YC.channel.data.meta.key = re;
			YC.channels.list(YC.channel.data, is_new);
			
			YC.channels[re] = YC.channel.data;
			YC.cleanForm();
		});
	});
	
	$('body').on('click', '#pbc-delete-form', function(e){
		$(this).text(YC.lang.aui.deleting+'...');
		YC.post({'action': 'yrc_delete', 'yrc_key': YC.channel.data.meta.key}, function(re){
			$('.pbc-down[data-down='+YC.channel.data.meta.key+']').remove();
			delete YC.channels[YC.channel.data.meta.key];
			YC.cleanForm();
			window.location.reload();
		});
	});
	
	YC.cleanForm = function(){
		delete YC.channels.nw;
		delete YC.channel.data;
		delete YC.channel.key;
		delete YC.channel.setup;
				
		$('style.yrc-stylesheet').remove();
		$('#yrc-editor, #yrc-live').empty();
		$('.yrc-content, #yrc-editor, #yrc-lang-form').toggleClass('wpb-hidden');
		$('#yrc-defined-css').addClass('wpb-hidden');
		$("html, body").animate({ scrollTop: 0 }, "slow");
	};
	
	YC.formError = function(code){
		var messages = {
			'apikey': YC.lang.aui.enter_api_key,
			'invalid': YC.lang.aui.invalid_inputs
		};
		$('.pbc-form-message').text( messages[code] ).addClass('pbc-form-error');
		return false;
	};
			
	YC.dummy = {
		'meta': {
			'user': 'mrsuicidesheep',
			'channel': 'UC5nc_ZtjKW1htCVZVRxlQAQ',
			'key': 'nw',
			'apikey': 'AIzaSyBHM34vx2jpa91sv4fk8VzaEHJbeL5UuZk',
			'channel_uploads': '',
			'onlyonce': '',
			'tag':''
		},
		
		'style': {
			'colors': {
				'item': {
					'background': '#fff'
				},
				'button': {
					'background': '#333',
					'color': '#fff'
				},
				'color': {
					'text': '#fff',
					'link': '#000'
				}
			},
			'fit': false,
			'playlists': true,
			'uploads': true,
			'video_style':['large', 'open'],
			'player_mode': 1,
			'truncate': 1,
			'rtl':'',
			'banner':true,
			'thumb_margin':8,
			'play_icon':'',
			'player_top':'title',
			'thumb_image_size':'medium'
		}
	};
		
	YC.lang.form_labels = {
		'Videos': 'Videos',
		'Playlists': 'Playlists',
		'Search': 'Search',
		'Loading': 'Loading',
		'more': 'more',
		'Nothing_found': 'Nothing found'
	};
		
	YC.lang.show = function(){
		$('#yrc-wrapper').append( YC.template('#yrc-lang-form-tmpl')({'terms': YRC.lang.form}) );
	};
		
	$('body').on('submit', '#yrc-lang-form', function(e){
		e.preventDefault(); var fo = $(this);
		YRC.lang.form = rawValues(fo.find('input'));
		fo.find('button').text(YC.lang.aui.saving+'....');
		YC.post({'action': 'yrc_save_lang', 'yrc_lang': YRC.lang.form}, function(re){
			fo.find('button').text(YC.lang.aui.save);
		});
	});
	
	$('body').on('click', '#yrc-delete-terms', function(e){
		e.preventDefault(); var a = $(this);
		a.text(YC.lang.aui.clearing+'....');
		YC.post({'action': 'yrc_delete_lang'}, function(re){
			a.text(YC.lang.aui.clear);
			window.location.reload();
		});
	});
	
	$('body').on('click', '#yrc-lang-form h2', function(e){
		$(this).next().toggleClass('wpb-zero');
	});
	
	$('body').on('click', '.pbc-field-toggler', function(e){
		$(this).next().toggleClass('wpb-force-hide');
	});
	
	YC.channels.remove = function(d){
		$('#yrc-channels tbody tr[data-down="'+d.meta.key+'"]').remove();
	};
		
	YC.channels.list = function(d, is_new){
		if(is_new)
			$('#yrc-channels tbody').append( YC.template('#yrc-channel-tmpl')(d) );
		else	
			$('#yrc-channels tbody tr[data-down="'+d.meta.key+'"]').replaceWith( YC.template('#yrc-channel-tmpl')(d) );
	};

	YC.channels.createNew = function(){
		var dum = JSON.parse( JSON.stringify( YC.dummy ) );
		YC.channels['nw'] = dum;
		YC.channels.adminit( dum, 'nw', true );
	};

	YC.versionCheck = function(){
		if(!window.localStorage) return false;
		if(localStorage.getItem('yrc_version') != $('#yrc-wrapper').data('version')) YC.newVersionInfo();
	};
	
	YC.newVersionInfo = function(){
		$('#yrc-version-info').removeClass('wpb-hidden');
		YC.setVersion();
	};
	
	YC.setVersion = function(){
		localStorage.setItem('yrc_version', $('#yrc-wrapper').data('version'));
	};
	
	YC.channels.deploy = function( channels ){
		$('#yrc-init-loader').addClass('wpb-hidden');
		channels.forEach(function(channel){
			YC.channels[ channel.meta.key ] = channel;
			YC.channels.list(channel, true);
		});
		
		if(channels.length){
			YC.dummy.meta.apikey = channels[0].meta.apikey;
			$('#yrc-channels, #yrc-editor').toggleClass('wpb-hidden');
			YC.versionCheck();
		} else {
			YC.channels.createNew();
			YC.setVersion();
		}
		
		$('#yrc-channels').on('click', 'tr.pbc-down .pbc-edit', function(e){
			YC.channels.adminit( YC.channels[ $(this).data('down') ], $(this).data('down') );
		});
		
		$('body').on('click', '#pbc-cancel-form', function(e){
			YC.cleanForm();
		});
		
		YC.EM.trigger('yc.deployed');
		YC.lang.show();
	};

	YC.channels.init = function(){
		YC.post({'action': 'yrc_get'}, function(re){		
			YC.channels.deploy(re);
		});
		$('#yrc-wrapper').append( YC.template('#yrc-main-tmpl') )
		YC.EM.trigger('yc.init');
	};

	YC.channels.init();

});