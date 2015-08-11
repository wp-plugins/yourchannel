var YRC=YRC||{};jQuery(document).ready(function(t){function e(e,s){var i=s.style.colors,a=e+" li.yrc-active{border-bottom: 3px solid "+i.button.background+";}"+e+" .yrc-menu li{color:"+i.color.link+";			}			"+e+" .yrc-item{				margin-bottom:"+(parseInt(s.style.thumb_margin)||8)+"px;			}			"+e+" .yrc-video, "+e+" .yrc-brand, .yrc-placeholder-item, "+e+" .yrc-playlist-item{				background: "+i.item.background+";			}			"+e+" .yrc-section-action, "+e+" .yrc-section-action, "+e+" .yrc-load-more-button, .yrc-search button, .yrc-player-bar, .yrc-player-bar span, .yrc-search-form-top button{				background: "+i.button.background+";				color: "+i.button.color+";				border:none;			}			"+e+" .yrc-section-action a{				color: "+i.button.color+";			}			.yrc-player-bar .yrc-close span{				color: "+i.button.background+";				background: "+i.button.color+";			}			"+e+" .yrc-brand{				color: "+i.color.text+";			}			"+e+" .yrc-search-form-top svg path{				fill: "+i.button.color+';			}			.yrc-loading-overlay:after{ content: "'+YRC.lang.form.Loading+'..."; }			'+e+" .yrc-stats svg .yrc-stat-icon{				fill: "+i.color.text+"			}			"+e+" a, "+e+" .yrc-playlist-item { color: "+i.color.link+"; }			"+e+" .yrc-item-title { height: "+(s.style.truncate?"1.5em":"auto")+"; }";"all"===s.style.play_icon&&(a+='.yrc-item .yrc-thumb:before{ content:""; }'),"hover"===s.style.play_icon&&(a+='.yrc-item:hover .yrc-thumb:before{ content:""; }'),t("head").append('<style class="yrc-stylesheet">'+a+"</style>"),YRC.EM.trigger("yrc.style",[[e,s]])}function s(t){t=+new Date-t;var e=Math.round(Math.floor(t/6e4/60)/24);return t=7>e?e+" "+(e>1?YRC.lang.fui.days:YRC.lang.fui.day):Math.round(e/7)<9?Math.round(e/7)+" "+(Math.round(e/7)>1?YRC.lang.fui.weeks:YRC.lang.fui.week):Math.round(e/30)<12?Math.round(e/30)+" "+(Math.round(e/30)>1?YRC.lang.fui.months:YRC.lang.fui.month):Math.round(e/365)+" "+(Math.round(e/365)>1?YRC.lang.fui.years:YRC.lang.fui.year),t=t==="0 "+YRC.lang.fui.day?YRC.lang.fui.today:t,t===YRC.lang.fui.today?t:"de_DE"===YRC.lang.fui.wplocale?YRC.lang.fui.ago+" "+t:t+" "+YRC.lang.fui.ago}function i(){var t=document.createElement("script");t.innerHTML="if (!window['YT']) {var YT = {loading: 0,loaded: 0};}if (!window['YTConfig']) {var YTConfig = {'host': 'http://www.youtube.com'};}if (!YT.loading) {YT.loading = 1;(function(){var l = [];YT.ready = function(f) {if (YT.loaded) {f();} else {l.push(f);}};window.onYTReady = function() {YT.loaded = 1;for (var i = 0; i < l.length; i++) {try {l[i]();} catch (e) {}}};YT.setConfig = function(c) {for (var k in c) {if (c.hasOwnProperty(k)) {YTConfig[k] = c[k];}}};var a = document.createElement('script');a.type = 'text/javascript';a.id = 'www-widgetapi-script';a.src = 'https:' + '//s.ytimg.com/yts/jsbin/www-widgetapi-vflYlgBFi/www-widgetapi.js';a.async = true;var b = document.getElementsByTagName('script')[0];b.parentNode.insertBefore(a, b);})();}";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}YRC.EM=YRC.EM||t({}),YRC.template=YRC.template||{},YRC.counter=0,window.onYouTubeIframeAPIReady=function(){console.log("YRC_API_LOADED"),YRC.EM.trigger("yrc.api_loaded")},i();var a="https://www.youtube.com/watch?v=";YRC.auth={baseUrl:function(t){return"https://www.googleapis.com/youtube/v3/"+t+"&key="+this.apikey},url:function(t,e,s,i,a,r){var n="";switch(t){case"Playlist":n=this.baseUrl("playlistItems?part=snippet%2C+contentDetails&maxResults="+a+"&pageToken="+e+"&playlistId="+s);break;case"Uploads":n=this.baseUrl(["se","ar","c","h"].join("")+"?order="+(i||["vi","ew","C","ou","nt"].join(""))+"&q="+r.t+"&part=snippet"+(r.own?"&channelId="+s:"")+"&type=video&pageToken="+e+"&maxResults="+a);break;case"channel":n=this.baseUrl("channels?part=contentDetails,snippet,statistics,brandingSettings&id="+s);break;case"Playlists":n=this.baseUrl("playlists?part=snippet,status,contentDetails&channelId="+s+"&pageToken="+e+"&maxResults="+a);break;case"Search":n=this.baseUrl(YRC.searchUrl(e,s,i,a));break;case"Custom":n=this.baseUrl("videos?part=contentDetails,statistics,snippet&id="+s)}return n}},YRC.extras={playlists:{sel:" .yrc-playlists",label:"Playlists"},uploads:{sel:" .yrc-uploads",label:"Uploads"},playlist:{sel:" .yrc-playlist-videos",label:"Playlist"}},YRC.EM.trigger("yrc.extras"),YRC.Base=function(){},YRC.Base.prototype={more:function(e,s){this.request.page=e,t(this.coresel).append(YRC.template.loadMoreButton(s))},moreEvent:function(){var e=this;t("body").off("click",this.coresel+" .yrc-load-more-button").on("click",this.coresel+" .yrc-load-more-button",function(){t(this).children("span").text(YRC.lang.form.more+"..."),e.fetch()})},channelOrId:function(){return"Custom"===this.temp_label?this.custom_vids.splice(0,this.per_page).join(","):"Playlist"===this.label||"Playlist"===this.temp_label?this.request.id:"Search"===this.label?this.restrict_to_channel?this.ref.channel:"":this.ref.channel},fetch:function(){var e=YRC.auth.url(this.temp_label||this.label,this.request.page,this.channelOrId(),this.criteria,this.per_page,this.vst),s=this;t(this.coresel).addClass("yrc-loading-overlay"),t.get(e,function(e){t(s.coresel).removeClass("yrc-loading-overlay"),s.onResponse(e)})},onResponse:function(e){return t(this.coresel+" .yrc-load-more-button").remove(),e.items.length?(this.request.times++,"Custom"===this.temp_label&&(e.nextPageToken=this.request.times*this.per_page<this.custom_vids_length,e.pageInfo.totalResults=this.custom_vids_length,e.items.forEach(function(t){t.snippet.resourceId={videoId:t.id}})),e.nextPageToken&&this.request.times*this.per_page<this.max&&this.more(e.nextPageToken,Math.min(this.max,e.pageInfo.totalResults)-this.request.times*this.per_page),void this.list(e.items)):this.nothingFound()},init:function(t,e){return this.page=0,this.ref=t,this.label=YRC.extras[e].label,this.secsel=this.ref.sel+YRC.extras[e].sel,this.max=window.parseInt(this.ref.data.meta.maxv)||1e4,this.coresel=this.secsel,this.request={id:"",page:"",times:0},this.criteria=this.ref.data.meta.default_sorting||"",this.per_page=window.parseInt(this.ref.data.meta.per_page)||25,this.fetchAtSetup(),this.moreEvent(),this.events(),this},events:function(){},fetchAtSetup:function(){this.fetch()},list:function(e){this.page++,e.forEach(function(t,s){"Private video"===t.snippet.title&&e.splice(s,1)}),this.ref.listVideos(e,t(this.coresel),"Playlist"===this.label||"Playlist"===this.temp_label||"Custom"===this.temp_label)},nothingFound:function(){return"Uploads"===this.label||this.ref.data.style.preload||t(this.coresel+" ul").html(YRC.lang.form.Nothing_found),!1}},Object.keys(YRC.extras).forEach(function(t){t=YRC.extras[t].label,YRC[t]=function(){},YRC[t].prototype=new YRC.Base,YRC[t].prototype.constructor=YRC[t]}),YRC.Uploads.prototype.fetchAtSetup=function(){this.ref.data.meta.search_own=void 0===this.ref.data.meta.search_own?1:this.ref.data.meta.search_own,this.vst={t:this.ref.data.meta.search_term||"",own:parseInt(this.ref.data.meta.search_own)},this.ref.data.meta.playlist&&(this.temp_label="Playlist",this.request.id=this.ref.data.meta.playlist),this.proSetup&&this.proSetup(),this.fetch()},YRC.Playlist.prototype.fetchAtSetup=function(){},YRC.Playlists.prototype.list=function(e){var s=t(this.coresel),i=s.children(".yrc-core");e.forEach(function(t){i.append(YRC.template.playlistItem(t))}),this.ref.adjust(i,".yrc-playlist-item",this.ref.section,!0)},YRC.Playlists.prototype.events=function(){var e=this,s=this.ref.playlist;t("body").on("click",e.secsel+" .yrc-playlist-item",function(){s.request.id=t(this).data("playlist"),s.request.page="",s.request.times=0,t(e.secsel).css("margin-top",function(){return-t(this).height()}).find(".yrc-section-action").remove(),t(e.secsel).append(YRC.template.subSectionBar(t(this).find(".yrc-item-meta div").text())),s.fetch()})},YRC.EM.trigger("yrc.classes_defined"),YRC.merge=function(t,e,s,i){for(var a in e)"object"!=typeof e[a]?void 0===t?s[i]=e:void 0===t[a]&&(t[a]=e[a]):YRC.merge(t[a],e[a],t,a)},YRC.backwardCompatible=function(t){var e={style:{video_style:["large","open"],thumb_image_size:"medium",player_top:"title",uploads:1,banner:1,menu:1}};return YRC.merge(t,e),YRC.EM.trigger("yrc.defaults",t),t},YRC.Setup=function(e,s,i){return s.meta.playlist&&(s.meta.onlyonce=!1),s.meta.onlyonce&&(s.meta.playlist=s.meta.channel_uploads,this.onlyonce=!0,s.meta.maxv=parseInt(s.meta.maxv)||0,s.meta.per_page=parseInt(s.meta.per_page)||50),s.meta.playlist||(s.meta.default_sorting="none"===s.meta.default_sorting?"":s.meta.default_sorting),s=YRC.backwardCompatible(s),i.find(".yrc-cu-pl").length&&(s.meta.custom=s.meta.custom_vids=i.find(".yrc-cu-pl").data("cupl").videos),this.id=e,this.data=s,this.channel=s.meta.channel,this.host=i,this.rtl=s.style.rtl?"yrc-rtl":"",this.player={},this.size=YRC.sizer(),this.active_sections={},this.data.style.playlists&&(this.active_sections.playlists=!0),this.data.style.search&&(this.active_sections.search=!0),this.data.style.uploads&&(this.active_sections.uploads=!0),this.size.size(this),this.init(),this.active_sections.uploads&&(this.uploads=(new YRC.Uploads).init(this,"uploads")),this.active_sections.playlists&&(this.playlist=(new YRC.Playlist).init(this,"playlist"),this.playlists=(new YRC.Playlists).init(this,"playlists")),YRC.EM.trigger("yrc.setup",this),t(this.sel+" .yrc-menu-items li:first-child").addClass("yrc-active"),this.section=t(this.sel+" .yrc-menu-items li:first-child").data("section"),this.size.sections(),this},YRC.Setup.prototype={init:function(){this.player_mode=window.parseInt(this.data.style.player_mode),this.data.style.rating_style="large"===this.data.style.video_style[0]?window.parseInt(this.data.style.rating_style):0,this.data.style.video_style.push(this.data.style.rating_style?"pie":"bar"),this.data.style.video_style.push(this.data.style.thumb_image_size),this.host.append('<div class="yrc-shell '+this.rtl+(YRC.is_pro?" yrc-pro-v":" yrc-free-v")+'" id="yrc-shell-'+this.id+'">'+YRC.template.content(this.active_sections)+"</div>"),this.sel="#yrc-shell-"+this.id,e(this.sel,this.data),this.load(),Object.keys(this.active_sections).length<2&&(YRC.is_pro&&(!YRC.is_pro||this.data.style.uploads&&this.data.style.menu)||t(this.sel+" .yrc-menu").addClass("pb-hidden"))},load:function(){YRC.auth.apikey=this.data.meta.apikey;var e=this,s=YRC.auth.baseUrl("channels?part=snippet,contentDetails,statistics,brandingSettings&id="+this.channel);this.data.style.banner?t.get(s,function(t){e.deploy(t.items[0])}):(this.events(),t(this.sel+" .yrc-banner").css("display","none"),YRC.EM.trigger("yrc.deployed",[[this.sel,this.data]]))},deploy:function(e){var s=this.size.ww>640?"bannerTabletImageUrl":"bannerMobileImageUrl";s=e.brandingSettings.image[s];var i=t(this.sel).find(".yrc-brand");i.css("background","url("+(s||e.brandingSettings.image.bannerImageUrl)+") no-repeat "+this.data.style.colors.item.background),i.eq(0).append(YRC.template.header(e)),t(this.sel+" .yrc-stats").css("top",function(){return 75-t(this).height()/2}),this.events(),YRC.EM.trigger("yrc.deployed",[[this.sel,this.data]])},events:function(){var e=this.sel,s=this;t("body").on("click",e+" .yrc-menu-item",function(){var i=t(this).index();s.section=t(this).data("section"),t(this).addClass("yrc-active").siblings().removeClass("yrc-active"),t(e+" .yrc-sections").css({height:function(){return t(this).find(".yrc-section:eq("+i+")").height()}}).css("margin-"+(s.rtl?"right":"left"),i*-s.size.ww),"search"===s.section?t(e+" .yrc-search-form-top").css("display","none"):t(e+" .yrc-search-form-top").css("display","")}),t("body").on("click",e+" .yrc-playlist-bar .yrc-close span",function(){var s=t(this);s.parents(".yrc-sub-section").css("margin-top",0),window.setTimeout(function(){t(e).find(".yrc-playlist-videos .yrc-core").empty().end().find(".yrc-playlist-videos .yrc-load-more-button").remove(),s.parents(".yrc-sections").css("height",function(){return t(this).find(".yrc-playlists").height()}),s.parents("li").remove()},500)}),t("body").on("click",e+" .yrc-video a",function(){YRC.play(s,e,t(this))}),t("body").on("click",".yrc-player-bar .yrc-close span",function(t){s.closePlayer(t)}),t(window).on("resize",function(){s.size.resize()}),t("body").on("click",".yrc-player-shell",function(e){t(e.target).is(".yrc-player-shell")||e.stopPropagation(),s.closePlayer(e)}),t(document).keyup(function(t){27==t.keyCode&&s.closePlayer(t)})},closePlayer:function(e){return e.isPropagationStopped&&e.isPropagationStopped()?!1:(this.player.player.destroy(),t(".yrc-player-shell").remove(),t(".yrc-onlyone-video").removeClass("yrc-onlyone-video"),t(this.sel+" .yrc-sections").css("height",this.player.list.parents(".yrc-section").height()),void(this.player={}))},listVideos:function(t,e,s){var i,a=e.children(".yrc-core"),r=1,n=this.uploads?this.uploads.criteria||"etad":"etad";"none"!==n&&(this.onlyonce||this.data.meta.playlist||this.data.meta.custom)?("date"===n||"title"===n||"etad"===n)&&(t.sort(function(t,e){return i="date"===n?new Date(t.snippet.publishedAt)<new Date(e.snippet.publishedAt):"title"===n?t.snippet.title>e.snippet.title:new Date(t.snippet.publishedAt)>new Date(e.snippet.publishedAt),i?1:-1}),r=0,this.lstVideos(t,a,s)):this.lstVideos(t,a,s),YRC.EM.trigger("yrc.videos_listed",[[a,t,this,r]])},lstVideos:function(e,s,i){this.data.style.pagination&&this.uploads.page>1&&(s.empty(),s.offset().top-t(window).scrollTop()<0&&t("html,body").animate({scrollTop:s.offset().top-50},"fast"));var a=this;e.forEach(function(t){s.append(YRC.template.video(t,i,a.data.style.video_style))}),s.find(".yrc-onlyone-video").removeClass("yrc-onlyone-video"),this.adjust(s,".yrc-video",this.section),s.find(".yrc-just-listed img").load(function(){t(this).parent().addClass("yrc-full-scale")}),this.first_loaded||this.preloading||(this.first_loaded=!0,YRC.EM.trigger("yrc.first_load",[[this,s]]))},adjust:function(e,s,i,a){var r=a||"small"!==this.data.style.video_style[0]?2:1,n=160*r,l=n,o=parseInt(this.data.style.thumb_margin)||8,c=this.size.ww,p=Math.round(c/l);p>1&&(c-=(p-1)*o),l=c/p,l=l>n?n:l;var h=e.find(s),d=this.rtl?"right":"left",y=h.length-h.length%p-1;e.find(s+".yrc-has-left").css("margin-"+d,0).removeClass("yrc-has-left"),e.find(s).css("width",l).css("margin-"+("left"===d?"right":"left"),function(e){return e>y&&t(this).css("margin-"+d,o).addClass("yrc-has-left"),(e+1)%p?o:0}).addClass("yrc-full-scale"),a||(this.size.per_row=p),e.parents(".yrc-sections").css("height","auto")}},YRC.play=function(e,s,i){t(".yrc-player-shell").remove();var a=i.parent();if(t(".yrc-onlyone-video").removeClass("yrc-onlyone-video"),a.siblings().length||a.addClass("yrc-onlyone-video"),e.player_mode){var r=a.index()+1;r-=r%e.size.per_row,r=r?r:e.size.per_row;var n=i.parents("ul").children("li");n=n.eq(r-1).length?n.eq(r-1):n.last(),n.after(YRC.template.player(a,e)),t("html,body").animate({scrollTop:t(s+" .yrc-player").offset().top-30},"slow")}else t("body").append(YRC.template.player(a,e,!0));t(s+" .yrc-sections").css("height","auto"),t(".yrc-player-frame").css("height",9/16*t(".yrc-player").width()),e.player.player=YRC.Player(e,!0),e.player.list=a.parent()},YRC.Player=function(t,e){return new YT.Player("yrc-player-frame",{events:{onReady:function(t){e&&t.target.playVideo()},onStateChange:function(e){YRC.EM.trigger("yrc.player_state_change",[[t,e]])}}})},YRC.sizer=function(){return{size:function(e){this.ref=e||this.ref;this.ref.host.css("height",t(window).height()+5);this.ww=this.ref.host.parent().width(),this.ref.host.css("height","auto").removeClass("yrc-mobile yrc-desktop").addClass(this.ww<481?"yrc-mobile":"yrc-desktop")},resize:function(){this.size(),this.sections(),this.ref.adjust(t(this.ref.sel+" .yrc-core"),".yrc-video"),this.ref.adjust(t(this.ref.sel+" .yrc-core"),".yrc-playlist-item","",!0),t(this.ref.sel+" .yrc-sections").css("height",t(this.ref.sel+" .yrc-"+this.ref.section).height());var e=this.ref;window.setTimeout(function(){t(e.sel+" .yrc-sections").css("height",t(e.sel+" .yrc-"+e.section).height())},250)},sections:function(){var e,s=this;t(s.ref.sel+".yrc-shell, "+s.ref.sel+" .yrc-section").css("width",this.ww),t(s.ref.sel+" .yrc-sections").css("width",this.ww*Object.keys(s.ref.active_sections).length).css("margin-"+(s.ref.rtl?"right":"left"),function(){return e=t(this).parent().find(".yrc-menu-items .yrc-active").data("section"),-(t(this).parent().find(".yrc-menu-items .yrc-active").index()*s.ww)}),t(s.ref.sel+" .yrc-sections").css("height","auto"),t(".yrc-player-frame").css("height",9/16*t(".yrc-player").width())}}},YRC.template.header=function(t){return'<div class="yrc-name pb-absolute">					<img src="'+t.snippet.thumbnails.default.url+'"/>					<span>'+t.brandingSettings.channel.title+'</span>				</div>				<div class="yrc-stats pb-absolute">					<span class="yrc-subs"></span>					<span class="yrc-videos pb-block">'+YRC.template.vicon+'<span class="pb-inline">'+YRC.template.num(t.statistics.videoCount)+'</span></span>					<span class="yrc-views pb-block">'+YRC.template.eyecon+'<span class="pb-inline">'+YRC.template.num(t.statistics.viewCount)+"</span></span>				</div>"},YRC.template.search=YRC.template.search||function(){return""},YRC.template.playlists='<div class="yrc-section pb-inline">								<div class="yrc-playlists yrc-sub-section"><ul class="yrc-core"></ul></div>								<div class="yrc-playlist-videos yrc-sub-section"><ul class="yrc-core"></ul></div>							</div>',YRC.template.content=function(t){return'<div class="yrc-banner pb-relative"><div class="yrc-brand pb-relative"></div></div>		<div class="yrc-content">			<div class="yrc-menu pb-relative">				<ul class="yrc-menu-items">'+(t.uploads?'<li class="pb-inline yrc-menu-item" data-section="uploads">'+YRC.lang.form.Videos+"</li>":"")+(t.playlists?'<li class="pb-inline yrc-menu-item" data-section="playlists">'+YRC.lang.form.Playlists+"</li>":"")+'</ul>			</div>			<div class="yrc-sections">'+(t.uploads?'<div class="yrc-section pb-inline"><div class="yrc-uploads yrc-sub-section"><ul class="yrc-core"></ul></div></div>':"")+(t.playlists?YRC.template.playlists:"")+(t.search?YRC.template.search():"")+'</div>		</div>		<div class="yrc-banner"><div class="yrc-brand pb-relative"></div></div>'},YRC.template.loadMoreButton=function(t){return'<li class="yrc-load-more-button yrc-button"><span>'+YRC.template.num(t)+" "+YRC.lang.form.more+"</span></li>"},YRC.template.num=function(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")},YRC.template.subSectionBar=function(t,e,s){return'<li class="yrc-section-action yrc-player-top-'+s+" "+(e?"yrc-player-bar":"yrc-playlist-bar")+'">			<span class="yrc-sub-section-name">'+t+'</span><span class="yrc-close"><span>x</span></span>		</li>'},YRC.template.playerTop=function(t,e){return[t.data("video"),t.find(".yrc-video-"+e).html()||""]},YRC.template.player=function(t,e,s){var i=e.data.style.player_top,a=this.playerTop(t,i);return'<div class="yrc-player-shell '+(s?"yrc-lightbox":"yrc-inline-player")+'" id="'+e.sel.replace("#","")+'-player-shell">			<div class="yrc-player">'+YRC.template.subSectionBar(a[1],!0,i)+'<div class="yrc-player-frame">					<iframe id="yrc-player-frame" style="width:100%;height:100%" src="//www.youtube.com/embed/'+a[0]+"?enablejsapi=1&rel=0&origin="+window.location.origin+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>					<span class="pb-absolute yrc-prev yrc-page-nav"><</span><span class="pb-absolute yrc-next yrc-page-nav">></span>				</div>			</div></div>'},YRC.template.video=function(t,e,i){var r=e?t.snippet.resourceId.videoId:t.id.videoId,n=i[0]+("adjacent"===i[0]?"":" yrc-item-"+i[1]);return'<li class="yrc-video yrc-item-'+n+' yrc-item pb-inline yrc-just-listed" data-video="'+r+'">			<a href="'+a+r+'" class="yrc-video-link pb-block">				<figure class="yrc-thumb pb-inline pb-relative"><img src="'+(t.snippet.thumbnails?t.snippet.thumbnails[i[3]].url:"")+'"/>				</figure><div class="yrc-item-meta pb-inline">					<div class="yrc-name-date yrc-nd-'+i[2]+'">						<span class="pb-block yrc-video-title yrc-item-title">'+t.snippet.title+'</span>						<span class="yrc-video-date">'+s(new Date(t.snippet.publishedAt))+'</span><span class="yrc-video-views"></span></div></div></a><div class="pb-hidden yrc-video-desc">'+YRC.template.urlify(t.snippet.description)+"</div>			</li>"},YRC.template.urlify=function(t){var e=/(https?:\/\/[^\s]+)/g;return t.replace(e,function(t){return'<a href="'+t+'" target="_blank">'+t+"</a>"})},YRC.template.playlistItem=function(t){return'<li class="yrc-playlist-item yrc-item-adjacent pb-inline yrc-item" data-playlist="'+t.id+'">				<figure class="yrc-thumb pb-inline yrc-full-scale"><img src="'+t.snippet.thumbnails["default"].url+'">					</figure><div class="pb-inline yrc-item-meta"><div class="pb-block yrc-item-title">'+t.snippet.title+'</div>					<span class="pb-block">'+t.contentDetails.itemCount+" "+YRC.lang.form.Videos.toLowerCase()+'</span>					<span class="pb-block">'+s(new Date(t.snippet.publishedAt))+"</span></div>			</li>"},YRC.template.eyecon='<svg height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden;"><path fill="#fff" stroke="#ffffff" d="M16,8.286C8.454,8.286,2.5,16,2.5,16S8.454,23.715,16,23.715C21.771,23.715,29.5,16,29.5,16S21.771,8.286,16,8.286ZM16,20.807C13.350999999999999,20.807,11.193,18.65,11.193,15.999999999999998S13.350999999999999,11.192999999999998,16,11.192999999999998S20.807000000000002,13.350999999999997,20.807000000000002,15.999999999999998S18.649,20.807,16,20.807ZM16,13.194C14.451,13.194,13.193999999999999,14.450000000000001,13.193999999999999,16C13.193999999999999,17.55,14.45,18.806,16,18.806C17.55,18.806,18.806,17.55,18.806,16C18.806,14.451,17.55,13.194,16,13.194Z" stroke-width="3" stroke-linejoin="round" opacity="0" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round; opacity: 0;"></path><path class="yrc-stat-icon" stroke="none" d="M16,8.286C8.454,8.286,2.5,16,2.5,16S8.454,23.715,16,23.715C21.771,23.715,29.5,16,29.5,16S21.771,8.286,16,8.286ZM16,20.807C13.350999999999999,20.807,11.193,18.65,11.193,15.999999999999998S13.350999999999999,11.192999999999998,16,11.192999999999998S20.807000000000002,13.350999999999997,20.807000000000002,15.999999999999998S18.649,20.807,16,20.807ZM16,13.194C14.451,13.194,13.193999999999999,14.450000000000001,13.193999999999999,16C13.193999999999999,17.55,14.45,18.806,16,18.806C17.55,18.806,18.806,17.55,18.806,16C18.806,14.451,17.55,13.194,16,13.194Z" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="0" y="0" width="32" height="32" r="0" rx="0" ry="0" fill="#000000" stroke="#000" opacity="0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0;"></rect></svg>',YRC.template.vicon='<svg height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden;"><path fill="#fff" stroke="#ffffff" d="M27.188,4.875V5.969H22.688V4.875H8.062V5.969H3.5619999999999994V4.875H2.5619999999999994V26.125H3.5619999999999994V25.031H8.062V26.125H22.686999999999998V25.031H27.186999999999998V26.125H28.436999999999998V4.875H27.188ZM8.062,23.719H3.5619999999999994V20.594H8.062V23.719ZM8.062,19.281H3.5619999999999994V16.156H8.062V19.281ZM8.062,14.844H3.5619999999999994V11.719H8.062V14.844ZM8.062,10.406H3.5619999999999994V7.281H8.062V10.406ZM11.247,20.59V9.754L20.628999999999998,15.172L11.247,20.59ZM27.188,23.719H22.688V20.594H27.188V23.719ZM27.188,19.281H22.688V16.156H27.188V19.281ZM27.188,14.844H22.688V11.719H27.188V14.844ZM27.188,10.406H22.688V7.281H27.188V10.406Z" stroke-width="3" stroke-linejoin="round" opacity="0" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round; opacity: 0;"></path><path class="yrc-stat-icon" stroke="none" d="M27.188,4.875V5.969H22.688V4.875H8.062V5.969H3.5619999999999994V4.875H2.5619999999999994V26.125H3.5619999999999994V25.031H8.062V26.125H22.686999999999998V25.031H27.186999999999998V26.125H28.436999999999998V4.875H27.188ZM8.062,23.719H3.5619999999999994V20.594H8.062V23.719ZM8.062,19.281H3.5619999999999994V16.156H8.062V19.281ZM8.062,14.844H3.5619999999999994V11.719H8.062V14.844ZM8.062,10.406H3.5619999999999994V7.281H8.062V10.406ZM11.247,20.59V9.754L20.628999999999998,15.172L11.247,20.59ZM27.188,23.719H22.688V20.594H27.188V23.719ZM27.188,19.281H22.688V16.156H27.188V19.281ZM27.188,14.844H22.688V11.719H27.188V14.844ZM27.188,10.406H22.688V7.281H27.188V10.406Z" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="0" y="0" width="32" height="32" r="0" rx="0" ry="0" fill="#000000" stroke="#000" opacity="0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0;"></rect></svg>',t("body").on("click",".yrc-content a",function(t){t.preventDefault()}),t("body").on("click",".yrc-shell .yrc-banner, .yrc-shell .yrc-sections",function(e){e.stopPropagation(),t(".yrc-sort-uploads").addClass("pb-hidden")}),YRC.run=function(t){return!t.attr("data-yrc-setup")&&t.length?(t.attr("data-yrc-setup",1),void new YRC.Setup(YRC.counter++,t.data("yrc-channel"),t)):void 0},YRC.lang=YRC.lang||yrc_lang_terms,window.location.origin||(window.location.origin=window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:"")),YRC.run(t(".yrc-shell-cover").eq(0)),YRC.EM.trigger("yrc.run")});