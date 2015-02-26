var YC = YC || {'channels':{}};

jQuery(document).ready(function($){
	//delete YC.EM;
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
		YC.channel.data = channel;
		YC.channel.key = key;
		YC.EM.trigger('yc.before_form');
		
		$('#yrc-channels').addClass('wpb-hidden');
		$('#yrc-editor').html( YC.template('#yrc-form-tmpl')( YC.channel.data ))
			.removeClass('wpb-hidden');
			
		YC.EM.trigger('yc.form');
						
		$('#yrc-live').removeClass('wpb-hidden');
		new YRC.Setup(0, YC.channel.data, $('#yrc-live'));
	};

	$('body').on('change', 'input[name=apikey]', function(e){
		YC.channel.data.meta.apikey = $(this).val().trim();
		YRC.auth.apikey = $(this).val().trim();
	});

	$('body').on('click', '#yrc-get-channel-id', function(e){
		$('.pbc-form-message').text('').removeClass('pbc-form-error');
		if(!YC.channel.data.meta.apikey || YC.channel.data.meta.apikey.length != 39) return YC.formError('apikey');
		var user_box = $('#yrc-username'), channel_box = $('input.wpb-raw[name=channel]'), channel_input = $('#yrc-channel');
			if(!user_box.val() && !channel_input.val()) return;
			
		YRC.auth.apikey = YRC.auth.apikey || YC.dummy.meta.apikey;	
		var uu = user_box.val() ? YRC.auth.baseUrl('channels?part=snippet,contentDetails,statistics&forUsername='+user_box.val())
				: YRC.auth.baseUrl('channels?part=snippet,contentDetails,statistics&id='+channel_input.val());
		ajax(uu, function(re){
			if(!re.items.length) user_box.val() ? user_box.val(user_box.val() +' doesn\'t exist.') : channel_input.val(channel_input.val() +' doesn\'t exist.');
			else {
				if(user_box.val()) channel_input.val(re.items[0].id);
				else user_box.val(re.items[0].snippet.title);
				
				channel_box.val(re.items[0].id);
				YC.channel.data.meta.channel = re.items[0].id;
				YC.channel.data.meta.user = user_box.val();
				$('style.yrc-stylesheet').remove();
				$('#yrc-live').empty();
				new YRC.Setup(0, YC.channel.data, $('#yrc-live'));
			}
		}, function(er){
			console.log(er);
		});
	});
	
	$('body').on('change', '#yrc-channel', function(e){ $('#yrc-username').val(''); });
	$('body').on('change', '#yrc-username', function(e){ $('#yrc-channel').val(''); });

	function ajax(url, success, error){
		$.ajax({
			url: url,
			success: success,
			error: error
		});
	}
	
	function rawValues(){
		var o = {};
		$('input.wpb-raw').each(function(){
			o[$(this).attr('name')] = $(this).val();
		});
		return o;
	}

	$('body').on('submit', '#pbc-form', function(e){
		e.preventDefault();
		$('.pbc-form-message').text('').removeClass('pbc-form-error');
		if(!YC.channel.data.meta.user || !YC.channel.data.meta.channel|| !YC.channel.data.meta.apikey) 
			return YC.formError('invalid');
		
		$('.pbc-form-save .button-primary').text('Saving...');
		
		var is_new = (YC.channel.key == 'nw');
		
		YC.post({'action': 'yrc_save', 'yrc_channel': YC.channel.data}, function(re){
			if(!re) YC.formError('invalid');
			
			YC.channel.data.meta.key = re;
			YC.channels.list(YC.channel.data, is_new);
			
			YC.channels[re] = YC.channel.data;
			
			delete YC.channels.nw;
			delete YC.channel.data;
			delete YC.channel.key;
					
			$('#yrc-editor').empty();
			$('#yrc-channels, #yrc-editor').toggleClass('wpb-hidden');
			$('#yrc-live').empty();
		});
	});
	
	YC.formError = function(code){
		var messages = {
			'apikey': 'Please enter your API key.',
			'invalid': 'Your inputs are invalid, please have a look at them.'
		};
		$('.pbc-form-message').text( messages[code] ).addClass('pbc-form-error');
		return false;
	};
			
	YC.dummy = {
		'meta': {
			'user': 'mrsuicidesheep',
			'channel': 'UC5nc_ZtjKW1htCVZVRxlQAQ',
			'key': 'nw',
			'apikey': 'AIzaSyBHM34vx2jpa91sv4fk8VzaEHJbeL5UuZk'
		},
		
		'style': {
			'colors': {
				'item': {
					'background': '#35B9C5'
				},
				'button': {
					'background': '#D5226E',
					'color': '#F5E6EA'
				},
				'color': {
					'text': '#fff',
					'link': '#000'
				}
			},
			'fit': false
		}
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

	YC.channels.deploy = function( channels ){
		$('#yrc-init-loader').addClass('wpb-hidden');
		channels.forEach(function(channel){
			YC.channels[ channel.meta.key ] = channel;
			YC.channels.list(channel, true);
		});
		
		if(channels.length){
			YC.dummy.meta.apikey = channels[0].meta.apikey;
			$('#yrc-channels, #yrc-editor').toggleClass('wpb-hidden');
		} else {
			YC.channels.createNew();
		}
		
		$('#yrc-channels').on('click', 'tr.pbc-down .pbc-edit', function(e){
			YC.channels.adminit( YC.channels[ $(this).data('down') ], $(this).data('down') );
		});
		
		YC.EM.trigger('yc.deployed');
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