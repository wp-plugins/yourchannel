var YRC = YRC || {};
jQuery(document).ready(function($){
	YRC.EM = YRC.EM || $({});
	YRC.template = YRC.template || {};
	YRC.counter = 0;
	
	function yrcStyle( sel, colors ){
		var css = 
			sel+' li.yrc-active{\
				border-bottom: 3px solid '+ colors.button.background +';\
			}\
			'+ sel +' .yrc-menu li{\
				color:'+ colors.item.background +'\
			}\
			'+ sel +' .yrc-video, '+ sel +' .yrc-banner, .yrc-placeholder-item, '+ sel +' .yrc-player, '+ sel +' .yrc-playlist-item{\
				background: '+ colors.item.background +';\
			}\
			'+ sel +' .yrc-section-action, '+ sel +' .yrc-load-more-button, .yrc-search button{\
				background: '+ colors.button.background +';\
				color: '+ colors.button.color +';\
				border:none;\
			}\
			'+ sel +' .yrc-banner{\
				color: '+ colors.color.text +';\
			}\
			'+ sel +' .yrc-stats svg .yrc-stat-icon{\
				fill: '+ colors.color.text +'\
			}\
			'+ sel +' a:link, '+ sel +' .yrc-playlist-item { color: '+ colors.color.link +'; }\
			';
			
		YRC.EM.trigger('yrc.style', [[sel, colors]]);
		$('head').append('<style class="yrc-stylesheet">'+ css + '</style>');	
	}

	function miti(stamp){
		stamp = +new Date - stamp;
		var days = Math.round( Math.floor( ( stamp/60000 )/60 )/24 );
		if(days < 7)
			stamp = days + ' day';
		else if( Math.round(days/7) < 9)
			stamp = Math.round(days/7) + ' week';
		else if( Math.round(days/30) < 12)
			stamp = Math.round(days/30) + ' month';
		else stamp = Math.round( days/365 ) + ' year';	
		stamp = stamp + ( parseInt( stamp.split(' ')[0] ) > 1 ? 's' : '');
		return stamp == '0 day' ? 'Today' : (stamp + ' ago');
	}	
	
	var watch_video = 'https://www.youtube.com/watch?v=';
	
	YRC.auth = {
		//'apikey': 'AIzaSyBHM34vx2jpa91sv4fk8VzaEHJbeL5UuZk',
		'baseUrl': function ( rl ){ return 'https://www.googleapis.com/youtube/v3/' + rl +'&key=' + this.apikey; },
		
		'url': function uuu(type, page, res_id, search){
			var url = ''; 
			switch(type){
				case 'Playlist':
					url = this.baseUrl('playlistItems?part=snippet%2C+contentDetails&maxResults=25&pageToken='+page+'&playlistId='+res_id);
				break;
				case 'Uploads':
					url = this.baseUrl('search?order='+ (search || 'viewCount') +'&part=snippet&channelId='+ res_id +'&type=video&pageToken='+page+'&maxResults=25');
				break;
				case 'channel':
					url = this.baseUrl('channels?part=contentDetails,snippet,statistics,brandingSettings&id='+ res_id);
				break;
				case 'Playlists':
					url = this.baseUrl('playlists?part=snippet,status,contentDetails&channelId='+ res_id +'&pageToken='+page+'&maxResults=25');
				break;
				case 'Search':
					url = this.baseUrl( YRC.searchUrl( page, res_id, search ) );
				break;
			}
			return url;
		}
	};
									
	YRC.extras = {
		'playlists': {'sel': ' .yrc-playlists', 'label': 'Playlists'},
		'uploads': {'sel': ' .yrc-uploads', 'label': 'Uploads'},
		'playlist': {'sel': ' .yrc-playlist-videos', 'label': 'Playlist'}
	};
	
	YRC.EM.trigger('yrc.extras');
	
	YRC.Base = function(){};
	
	YRC.Base.prototype = {
		'request': {'id':'', 'page':'', 'times':0},
		'criteria': '',
		
		'more': function( nextpage , more){
			this.request.page = nextpage;
			$(this.coresel).append( YRC.template.loadMoreButton(more) );
		},
		
		'moreEvent': function(){
			var yc = this;
			$('body').on('click', this.coresel+' .yrc-load-more-button', function(e){
				$(this).children('span').text('Loading...');
				yc.fetch();
			});
		},
		
		'channelOrId': function(){
			return (this.label === 'Playlist' ? this.request.id : (this.label === 'Search' ? (this.restrict_to_channel ? this.ref.channel : '') : this.ref.channel));
		},
		
		'fetch': function(){
			var url = YRC.auth.url( this.label, this.request.page, this.channelOrId(), this.criteria ), yc = this;
			$(this.coresel).addClass('yrc-loading-overlay');
			$.get(url, function(re){
				$(yc.coresel).removeClass('yrc-loading-overlay');
				yc.onResponse( re );
			});
		},
		
		'onResponse': function( re ){
			$(this.coresel+' .yrc-load-more-button').remove();
			if(!re.items.length)
				return this.nothingFound();
			this.request.times ++;
			if(re.nextPageToken) this.more( re.nextPageToken, re.pageInfo.totalResults - (this.request.times*25) );
			this.list( re.items );
		},
		
		'init': function(s, label){
			this.ref = s;
			this.label = YRC.extras[label].label;
			this.secsel = this.ref.sel + YRC.extras[label].sel;
			this.coresel = this.secsel;
			this.fetchAtSetup();
			this.moreEvent();
			this.events();
			return this;
		},
		
		'events': function(){},
		'fetchAtSetup': function(){ this.fetch(); },
		
		'list': function( items ){
			this.ref.listVideos( items, $(this.coresel), (this.label === 'Playlist'));
		},
		
		'nothingFound': function(){
			$(this.coresel + ' ul').html('Nothing found.');
			return false;
		}
	};
			
	Object.keys( YRC.extras ).forEach(function(section){
		section = YRC.extras[section].label;
		YRC[ section ] = function(){};
		YRC[ section ].prototype = new YRC.Base();
		YRC[ section ].prototype.constructor = YRC[ section ];
	});
							
	YRC.Playlist.prototype.fetchAtSetup = function(){};
			
	YRC.Playlists.prototype.list = function (lists){
		var cont = $(this.coresel), core = cont.children('.yrc-core');
		lists.forEach(function(list){
			core.append( YRC.template.playlistItem( list ) );
		});
		this.ref.adjust(core, '.yrc-playlist-item', this.ref.section);		
	};
						
	YRC.Playlists.prototype.events = function(){
		var yc = this, pl = this.ref.playlist;
		
		$('body').on('click', yc.secsel+' .yrc-playlist-item', function(e){ 
			pl.request.id = $(this).data('playlist');
			pl.request.page = '';
			pl.request.times = 0;
			$(yc.secsel).css('margin-top', function(){return -$(this).height(); });
			$(yc.secsel).append( YRC.template.subSectionBar( $(this).find('.yrc-playlist-meta div').text() ));
			pl.fetch();
		});
	};		
	
	YRC.EM.trigger('yrc.classes_defined');
		
	YRC.Setup = function(id, channel, host){
		this.id = id;
		this.data = channel;
		this.channel = channel.meta.channel;
		this.section = 'uploads';
		this.host = host;
		//this.host.parent().css('width', '100%');
		this.size.size(this);
		this.init();
		this.uploads = new YRC.Uploads().init(this, 'uploads');
		this.playlist = new YRC.Playlist().init(this, 'playlist');
		this.playlists = new YRC.Playlists().init(this, 'playlists');
		YRC.EM.trigger('yrc.setup', this);
		this.size.sections();
	};
	
	YRC.Setup.prototype = {
		'init': function( ){
			this.host.append('<div class="yrc-shell" id="yrc-shell-'+ this.id +'">'+ YRC.template.content +'</div>')
			this.sel = '#yrc-shell-'+ this.id;
			yrcStyle( this.sel, this.data.style.colors );
			this.load();
		},
		
		'load': function(){
			YRC.auth.apikey = this.data.meta.apikey;
			var yc = this, url = YRC.auth.baseUrl('channels?part=snippet,contentDetails,statistics,brandingSettings&id='+this.channel);
			//var channel = JSON.parse( localStorage.getItem( this.channel || '{}') );
			
			//if( !channel || ((+new Date - channel[1]) > 24*60*60*1000))
				$.get(url, function(re){ yc.deploy( re.items[0] ); });
			//else
				//yc.deploy( channel[0] );
		},
		
		'deploy': function(channel){
			//if(!channel) YRC.notFound();
			localStorage.setItem(channel.id, JSON.stringify([channel, +new Date]));
			var image = this.size.ww > 640 ? 'bannerTabletImageUrl' : 'bannerMobileImageUrl';
				image = channel.brandingSettings.image[ image ];
			var banners = $(this.sel).find('.yrc-banner');
				banners.css('background', 'url('+ (image || channel.brandingSettings.image.bannerImageUrl)+ ') no-repeat '+this.data.style.colors.item.background);
				banners.eq(0).append( YRC.template.header(channel) );
			//$(this.sel +' .yrc-stats span span').css('line-height', '40px');
			$(this.sel +' .yrc-stats').css('top', function(){ return 75 - ($(this).height()/2); })		
			this.events();
			YRC.EM.trigger('yrc.deployed', [[this.sel, channel.brandingSettings.channel.title]]);
		},
		
		'events': function(){
			var sel = this.sel, yc = this;
			$('body').on('click', sel+' .yrc-menu-item', function(e){ 
				var idx = $(this).index();
				yc.section = $(this).data('section');
				$(this).addClass('yrc-active').siblings().removeClass('yrc-active');
				$(sel+' .yrc-sections').css({'margin-left': (idx * -yc.size.ww), 'height': function(){
					return $(this).find('.yrc-section:eq('+ idx +')').height();
				}});
			});
			
			$('body').on('click', sel+' .yrc-sub-section-collapse span', function(e){ 
				var t = $(this);
				t.parents('.yrc-sub-section').css('margin-top', 0);
				window.setTimeout(function(){
					$(sel).find('.yrc-playlist-videos .yrc-core').empty().end().find('.yrc-playlist-videos .yrc-load-more-button').remove();
					t.parents('.yrc-sections').css('height', function(){ return $(this).find('.yrc-playlists').height(); });
					t.parents('li').remove();
				}, 500);
			});
						
			$('body').on('click', sel+' .yrc-video a', function(e){
				$(sel+' .yrc-player').remove();
				
				var idx = $(this).parent().index()+1;
					idx = idx - idx%yc.size.per_row;
					idx = idx ? idx : yc.size.per_row;
					
				var v = $(this).parents('ul').children('li');
					v = v.eq(idx-1) || v.last();
					v.after( YRC.template.player( $(this).parent().data('video') ) );
					
				$('html,body').animate({'scrollTop': $(sel+' .yrc-player').offset().top-30}, 'slow');
				$(sel+' .yrc-player').css('height', function(){
					return (9/16) * $(this).width();
				});
			});	
			
			$(window).on('resize', function(e){
				yc.size.resize();
			});
		},
		
		'size': {
			'size': function(ref){
				this.ref = ref || this.ref;
				var th = this.ref.host.css('height', $(window).height()+5);
				this.ww = this.ref.host.parent().width();
				this.ref.host.css('height', 'auto');
			},
			
			'resize': function(){
				this.size();
				this.sections();
				this.ref.adjust($(this.ref.sel+' .yrc-core'), '.yrc-video');
				this.ref.adjust($(this.ref.sel+' .yrc-core'), '.yrc-playlist-item');
			},
			
			'sections': function(){
				var yc = this, section;
				$(yc.ref.sel+'.yrc-shell, .yrc-section').css('width', this.ww);
				$(yc.ref.sel+' .yrc-sections').css({'width': this.ww*3, 'margin-left': function(){
					section = $(this).prev().find('.yrc-active').data('section');
					return -($(this).prev().find('.yrc-active').index() * yc.ww);
				}, 'height': function(){
					return $(this).find('.yrc-'+section).parent().height();
				}});
				$(yc.ref.sel+' .yrc-player').css('height', function(){
					return (9/16) * $(this).width();
				});
			}
		},
		
		'listVideos': function(vids, cont, res){
			var core = cont.children('.yrc-core');
			vids.forEach(function( vid ){
				core.append( YRC.template.video( vid, res ) );
			});
			this.adjust(core, '.yrc-video', this.section);	
			core.find('.yrc-video.yrc-just-listed img').load(function(e){
				$(this).addClass('yrc-full-scale');
			});	
			
			YRC.EM.trigger('yrc.videos_listed', [core]);
		},
		
		'adjust': function(core, item, section){
			var fw = 320, rem = 8, ww = this.size.ww;
			var in_row = Math.round(ww/fw);
			if(in_row > 1) ww -= (in_row - 1) * rem; 
			
			fw = ww/in_row;
			fw = fw > 320 ? 320 : fw;
			//if(this.data.style.fit) rem += (this.size.ww - ((fw*in_row) + (in_row-1)*rem)) / (in_row-1);
			
			window.setTimeout(function(){
				core.parents('.yrc-sections').css('height', function(){ return $(this).find('.yrc-'+section).parent().height(); });
			}, 50);
						
			var items = core.find(item); 
			var lastrow = items.length - (items.length % in_row) - 1;
			core.find(item+'.yrc-has-left').css('margin-left', 0).removeClass('yrc-has-left');
			
			core.find(item).css({'width': fw, 'margin-right': function(i){
				if(i > lastrow) $(this).css('margin-left', rem).addClass('yrc-has-left');
				if((i+1)%in_row) return rem;
				return 0;
			}}).addClass('yrc-full-scale');
			
			this.size.per_row = in_row;
			
		}
	};
		
	YRC.template.header = function(channel){
		return '<div class="yrc-brand pb-relative">\
				<div class="yrc-name pb-absolute">\
					<img src="'+ channel.snippet.thumbnails.default.url +'"/>\
					<span>'+ channel.brandingSettings.channel.title +'</span>\
				</div>\
				<div class="yrc-stats pb-absolute">\
					<span class="yrc-subs"></span>\
					<span class="yrc-videos pb-block">'+ YRC.template.vicon +'<span class="pb-inline">'+ YRC.template.num( channel.statistics.videoCount ) +'</span></span>\
					<span class="yrc-views pb-block">'+ YRC.template.eyecon +'<span class="pb-inline">'+ YRC.template.num( channel.statistics.viewCount ) +'</span></span>\
				</div>\
			</div>';
	};	
	
	YRC.template.search = YRC.template.search || function(){ return '';};
				
	YRC.template.content = 
		'<div class="yrc-banner"></div>\
		<div class="yrc-content">\
			<div class="yrc-menu pb-relative">\
				<ul class="yrc-menu-items">\
					<li class="pb-inline yrc-menu-item yrc-active" data-section="uploads">Videos</li>\
					<li class="pb-inline yrc-menu-item" data-section="playlists">Playlists</li>\
				</ul>\
			</div>\
			<div class="yrc-sections">\
				<div class="yrc-section pb-inline"><div class="yrc-uploads yrc-sub-section"><ul class="yrc-core"></ul></div>\
				</div><div class="yrc-section pb-inline">\
						<div class="yrc-playlists yrc-sub-section"><ul class="yrc-core"></ul></div>\
						<div class="yrc-playlist-videos yrc-sub-section"><ul class="yrc-core"></ul></div>\
				</div>' + YRC.template.search() +
			'</div>\
		</div>\
		<div class="yrc-banner"></div>';	
	
	YRC.template.loadMoreButton = function (more){
		return '<li class="yrc-load-more-button yrc-button"><span>'+ YRC.template.num(more) +' more</span></li>';
	};
	
	YRC.template.num = function( num ){
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	YRC.template.subSectionBar = function( title ){
		$('.yrc-section-action').remove();
		return '<li class="yrc-section-action">\
			<span class="yrc-sub-section-name">'+ title
			+'</span><span class="yrc-sub-section-collapse"><span>x</span></span>\
		</li>';
	};
	
	YRC.template.player = function( v ){
		return '<div class="yrc-player"><iframe style="width:100%;height:100%" src="http://www.youtube.com/embed/'+v+'?rel=0&amp;autoplay=1" frameborder="0" allowfullscreen=""></iframe></div>';
	};
	
	YRC.template.video = function(vid, res){
		var vid_id = res ? vid.snippet.resourceId.videoId : vid.id.videoId;
		var title = vid.snippet.title.length < 25 ? vid.snippet.title : (vid.snippet.title.substr(0, 25) + '...');
		return '<li data-video="'+ vid_id +'" class="yrc-video pb-inline yrc-just-listed"><a href="'+ watch_video + vid_id +'">\
			<img src="'+ (vid.snippet.thumbnails ? vid.snippet.thumbnails.medium.url : '') +'" class="yrc-thumb"/>\
			<div class="yrc-video-meta">\
				<div class="pb-inline yrc-name-date"><span class="yrc-video-title pb-block">'+ title +'</span>\
					<span class="yrc-video-date pb-block">'+ miti( new Date(vid.snippet.publishedAt) ) +'</span>\
				</div><div class="pb-inline yrc-ratings"></div>\
			</div>\
		</a></li>';
	};
	
	YRC.template.playlistItem = function( item ){
		var title = item.snippet.title.length < 20 ? item.snippet.title : (item.snippet.title.substr(0, 19) + '..');
		return '<li class="yrc-playlist-item pb-inline" data-playlist="'+ item.id +'">\
				<img src="'+ item.snippet.thumbnails['default'].url +'" class="pb-inline"\
				/><div class="pb-inline yrc-playlist-meta"><div class="pb-block">'+ title +'</div>\
					<span class="pb-block">'+ item.contentDetails.itemCount +' videos</span>\
					<span class="pb-block">'+ miti( new Date(item.snippet.publishedAt) ) +'</span></div>\
			</li>';
	};
	
	YRC.template.eyecon = '<svg height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden;"><path fill="#fff" stroke="#ffffff" d="M16,8.286C8.454,8.286,2.5,16,2.5,16S8.454,23.715,16,23.715C21.771,23.715,29.5,16,29.5,16S21.771,8.286,16,8.286ZM16,20.807C13.350999999999999,20.807,11.193,18.65,11.193,15.999999999999998S13.350999999999999,11.192999999999998,16,11.192999999999998S20.807000000000002,13.350999999999997,20.807000000000002,15.999999999999998S18.649,20.807,16,20.807ZM16,13.194C14.451,13.194,13.193999999999999,14.450000000000001,13.193999999999999,16C13.193999999999999,17.55,14.45,18.806,16,18.806C17.55,18.806,18.806,17.55,18.806,16C18.806,14.451,17.55,13.194,16,13.194Z" stroke-width="3" stroke-linejoin="round" opacity="0" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round; opacity: 0;"></path><path class="yrc-stat-icon" stroke="none" d="M16,8.286C8.454,8.286,2.5,16,2.5,16S8.454,23.715,16,23.715C21.771,23.715,29.5,16,29.5,16S21.771,8.286,16,8.286ZM16,20.807C13.350999999999999,20.807,11.193,18.65,11.193,15.999999999999998S13.350999999999999,11.192999999999998,16,11.192999999999998S20.807000000000002,13.350999999999997,20.807000000000002,15.999999999999998S18.649,20.807,16,20.807ZM16,13.194C14.451,13.194,13.193999999999999,14.450000000000001,13.193999999999999,16C13.193999999999999,17.55,14.45,18.806,16,18.806C17.55,18.806,18.806,17.55,18.806,16C18.806,14.451,17.55,13.194,16,13.194Z" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="0" y="0" width="32" height="32" r="0" rx="0" ry="0" fill="#000000" stroke="#000" opacity="0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0;"></rect></svg>';			
	YRC.template.vicon = '<svg height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden;"><path fill="#fff" stroke="#ffffff" d="M27.188,4.875V5.969H22.688V4.875H8.062V5.969H3.5619999999999994V4.875H2.5619999999999994V26.125H3.5619999999999994V25.031H8.062V26.125H22.686999999999998V25.031H27.186999999999998V26.125H28.436999999999998V4.875H27.188ZM8.062,23.719H3.5619999999999994V20.594H8.062V23.719ZM8.062,19.281H3.5619999999999994V16.156H8.062V19.281ZM8.062,14.844H3.5619999999999994V11.719H8.062V14.844ZM8.062,10.406H3.5619999999999994V7.281H8.062V10.406ZM11.247,20.59V9.754L20.628999999999998,15.172L11.247,20.59ZM27.188,23.719H22.688V20.594H27.188V23.719ZM27.188,19.281H22.688V16.156H27.188V19.281ZM27.188,14.844H22.688V11.719H27.188V14.844ZM27.188,10.406H22.688V7.281H27.188V10.406Z" stroke-width="3" stroke-linejoin="round" opacity="0" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round; opacity: 0;"></path><path class="yrc-stat-icon" stroke="none" d="M27.188,4.875V5.969H22.688V4.875H8.062V5.969H3.5619999999999994V4.875H2.5619999999999994V26.125H3.5619999999999994V25.031H8.062V26.125H22.686999999999998V25.031H27.186999999999998V26.125H28.436999999999998V4.875H27.188ZM8.062,23.719H3.5619999999999994V20.594H8.062V23.719ZM8.062,19.281H3.5619999999999994V16.156H8.062V19.281ZM8.062,14.844H3.5619999999999994V11.719H8.062V14.844ZM8.062,10.406H3.5619999999999994V7.281H8.062V10.406ZM11.247,20.59V9.754L20.628999999999998,15.172L11.247,20.59ZM27.188,23.719H22.688V20.594H27.188V23.719ZM27.188,19.281H22.688V16.156H27.188V19.281ZM27.188,14.844H22.688V11.719H27.188V14.844ZM27.188,10.406H22.688V7.281H27.188V10.406Z" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="0" y="0" width="32" height="32" r="0" rx="0" ry="0" fill="#000000" stroke="#000" opacity="0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0;"></rect></svg>';
		
	$('body').on('click', '.yrc-shell a', function(e){ e.preventDefault(); });	
	
	YRC.run = function(){
		$('.yrc-shell-cover').each(function(){
			if(!$(this).data('yrc-setup')){
				$(this).attr('data-yrc-setup', 1);
				new YRC.Setup(YRC.counter++, $(this).data('yrc-channel'), $(this));
			}
		});
	};
	YRC.run();
});