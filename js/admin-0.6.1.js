var YC=YC||{channels:{}};YC.lang={aui:yrc_lang_terms.aui},jQuery(document).ready(function(e){function a(a,n,t){e.ajax({type:"GET",url:a,success:n,error:t})}function n(e){var a={};return e.each(function(){"radio"===this.type?this.checked&&(a[this.name]=this.value):a[this.name]="checkbox"===this.type?this.checked?1:"":this.value}),a}YC.EM=YC.EM||e({}),YC.template=function(a){return _.template(e(a).html())},YC.post=function(a,n,t){e.ajax({url:"admin-ajax.php",type:"POST",data:a,dataType:"json",success:n,error:t})},YC.channel={},YC.channels.adminit=function(a,n,t){t||YRC.merge(a,YC.dummy),a.social=a.social||{},YC.channel.data=a,YC.channel.key=n,e("#yrc-channels, #yrc-lang-form").addClass("wpb-hidden"),e("#yrc-editor").html(YC.template("#yrc-form-tmpl")(YC.channel.data)).removeClass("wpb-hidden"),YC.EM.trigger("yc.form"),e("#yrc-live").removeClass("wpb-hidden"),YC.channel.setup=new YRC.Setup(0,YC.channel.data,e("#yrc-live"))},YC.redraw=function(){console.log("redraw"),e("style.yrc-stylesheet").remove(),e("body").off("click").on("click",".yrc-load-more-button",function(){}),e("#yrc-live").empty(),YC.channel.setup=new YRC.Setup(0,YC.channel.data,e("#yrc-live"))},e("body").on("change","input[name=apikey]",function(){YC.channel.data.meta.apikey=e(this).val().trim(),YRC.auth.apikey=e(this).val().trim()}),e("body").off("click","#yrc-get-channel-id").on("click","#yrc-get-channel-id",function(){if(e(".pbc-form-message").text("").removeClass("pbc-form-error"),!YC.channel.data.meta.apikey||39!=YC.channel.data.meta.apikey.length)return YC.formError("apikey");var n=e("#yrc-username"),t=e("input.wpb-raw[name=channel]"),c=e("#yrc-channel");if(n.val()||c.val()){YRC.auth.apikey=YRC.auth.apikey||YC.dummy.meta.apikey;var l=YRC.auth.baseUrl(n.val()?"channels?part=snippet,contentDetails,statistics&forUsername="+n.val().trim():"channels?part=snippet,contentDetails,statistics&id="+c.val().trim());a(l,function(a){a.items.length?(n.val()?c.val(a.items[0].id):n.val(a.items[0].snippet.title),t.val(a.items[0].id),YC.channel.data.meta.channel=a.items[0].id,YC.channel.data.meta.user=n.val(),YC.channel.data.meta.channel_uploads=a.items[0].contentDetails.relatedPlaylists.uploads,YC.channel.data.meta.onlyonce="",YC.redraw()):e("#yrc-ac-error").text((n.val()?n.val():c.val())+YC.lang.aui.does_not_exist).addClass("pbc-form-error")},function(e){console.log(e)})}}),e("body").on("change","#yrc-channel",function(){e("#yrc-username").val("")}),e("body").on("change","#yrc-username",function(){e("#yrc-channel").val("")}),e("body").on("change","#pbc-show-sections input",function(){YC.channel.data.style[this.name]=this.checked?!0:"",YC.channel.data.style.search_on_top&&(YC.channel.data.style.search=!0),YC.redraw()}),e("body").on("change","input[name=video_meta], input[name=video_size]",function(){"video_size"===this.name?YC.channel.data.style.video_style[0]=this.value:YC.channel.data.style.video_style=["adjacent"===this.value?"adjacent":YC.channel.data.style.video_style[0],this.value],"adjacent"===YC.channel.data.style.video_style[1]?(YC.channel.data.style.video_style[0]="adjacent",e("input[value=small]").attr("checked","checked")):"adjacent"===YC.channel.data.style.video_style[0]&&(YC.channel.data.style.video_style[0]="small"),e(".yrc-video").removeClass("yrc-item-open yrc-item-none yrc-item-closed yrc-item-adjacent yrc-item-small yrc-item-large").addClass("yrc-item-"+YC.channel.data.style.video_style[0]+" yrc-item-"+YC.channel.data.style.video_style[1]),YC.channel.setup.size.resize()}),e("body").on("submit","#pbc-form",function(a){if(a.preventDefault(),e(".pbc-form-message").text("").removeClass("pbc-form-error"),!YC.channel.data.meta.user||!YC.channel.data.meta.channel||!YC.channel.data.meta.apikey)return YC.formError("invalid");var t=n(e("input.wpb-raw"));YC.channel.data.style.player_mode=t.player_mode,YC.channel.data.style.truncate=t.truncate,YC.channel.data.style.rtl=t.rtl,YC.channel.data.style.thumb_margin=t.thumb_margin||8,YC.channel.data.style.video_style=YC.channel.data.style.video_style.splice(0,2),YC.channel.data.meta.onlyonce=t.onlyonce,YC.EM.trigger("yc.save",t),e(".pbc-form-save .button-primary").text(YC.lang.aui.saving+"...");var c="nw"===YC.channel.key;delete YC.channel.data.meta.playlist,YC.post({action:"yrc_save",yrc_channel:YC.channel.data},function(e){e||YC.formError("invalid"),YC.channel.data.meta.key=e,YC.channels.list(YC.channel.data,c),YC.channels[e]=YC.channel.data,YC.cleanForm()})}),e("body").on("click","#pbc-delete-form",function(){e(this).text(YC.lang.aui.deleting+"..."),YC.post({action:"yrc_delete",yrc_key:YC.channel.data.meta.key},function(){e(".pbc-down[data-down="+YC.channel.data.meta.key+"]").remove(),delete YC.channels[YC.channel.data.meta.key],YC.cleanForm(),window.location.reload()})}),YC.cleanForm=function(){delete YC.channels.nw,delete YC.channel.data,delete YC.channel.key,delete YC.channel.setup,e("style.yrc-stylesheet").remove(),e("#yrc-editor, #yrc-live").empty(),e("#yrc-channels, #yrc-editor, #yrc-lang-form").toggleClass("wpb-hidden"),e("#yrc-defined-css").addClass("wpb-hidden")},YC.formError=function(a){var n={apikey:YC.lang.aui.enter_api_key,invalid:YC.lang.aui.invalid_inputs};return e(".pbc-form-message").text(n[a]).addClass("pbc-form-error"),!1},YC.dummy={meta:{user:"mrsuicidesheep",channel:"UC5nc_ZtjKW1htCVZVRxlQAQ",key:"nw",apikey:"AIzaSyBHM34vx2jpa91sv4fk8VzaEHJbeL5UuZk",channel_uploads:"",onlyonce:"",tag:""},style:{colors:{item:{background:"#fff"},button:{background:"#333",color:"#fff"},color:{text:"#fff",link:"#000"}},fit:!1,playlists:!0,uploads:!0,video_style:["large","open"],player_mode:1,truncate:1,rtl:"",banner:!0,thumb_margin:8,play_icon:""}},YC.lang.form_labels={Videos:"Videos",Playlists:"Playlists",Search:"Search",Loading:"Loading",more:"more",Nothing_found:"Nothing found"},YC.lang.show=function(){e("#yrc-wrapper").append(YC.template("#yrc-lang-form-tmpl")({terms:YRC.lang.form}))},e("body").on("submit","#yrc-lang-form",function(a){a.preventDefault();var t=e(this);YRC.lang.form=n(t.find("input")),t.find(".button").text("Saving...."),YC.post({action:"yrc_save_lang",yrc_lang:YRC.lang.form},function(){t.find(".button").text("Save")})}),e("body").on("click","#yrc-lang-form h2",function(){e(this).next().toggleClass("wpb-zero")}),e("body").on("click",".pbc-field-toggler",function(){e(this).next().toggleClass("wpb-force-hide")}),YC.channels.remove=function(a){e('#yrc-channels tbody tr[data-down="'+a.meta.key+'"]').remove()},YC.channels.list=function(a,n){n?e("#yrc-channels tbody").append(YC.template("#yrc-channel-tmpl")(a)):e('#yrc-channels tbody tr[data-down="'+a.meta.key+'"]').replaceWith(YC.template("#yrc-channel-tmpl")(a))},YC.channels.createNew=function(){var e=JSON.parse(JSON.stringify(YC.dummy));YC.channels.nw=e,YC.channels.adminit(e,"nw",!0)},YC.versionCheck=function(){return window.localStorage?void(localStorage.getItem("yrc_version")!=e("#yrc-wrapper").data("version")&&YC.newVersionInfo()):!1},YC.newVersionInfo=function(){e("#yrc-version-info").removeClass("wpb-hidden"),YC.setVersion()},YC.setVersion=function(){localStorage.setItem("yrc_version",e("#yrc-wrapper").data("version"))},YC.channels.deploy=function(a){e("#yrc-init-loader").addClass("wpb-hidden"),a.forEach(function(e){YC.channels[e.meta.key]=e,YC.channels.list(e,!0)}),a.length?(YC.dummy.meta.apikey=a[0].meta.apikey,e("#yrc-channels, #yrc-editor").toggleClass("wpb-hidden"),YC.versionCheck()):(YC.channels.createNew(),YC.setVersion()),e("#yrc-channels").on("click","tr.pbc-down .pbc-edit",function(){YC.channels.adminit(YC.channels[e(this).data("down")],e(this).data("down"))}),e("body").on("click","#pbc-cancel-form",function(){YC.cleanForm()}),YC.EM.trigger("yc.deployed"),YC.lang.show()},YC.channels.init=function(){YC.post({action:"yrc_get"},function(e){YC.channels.deploy(e)}),e("#yrc-wrapper").append(YC.template("#yrc-main-tmpl")),YC.EM.trigger("yc.init")},YC.channels.init()});