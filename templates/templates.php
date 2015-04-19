<script type="text/template" id="yrc-main-tmpl">
	<div id="yrc-channels" class="wpb-hidden">
		<table class="widefat">
			<thead>
				<tr>
					<th>Username</th>
					<th>Channel</th>
					<th>Shortcode</th>
					<th></th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
	<div id="yrc-editor"></div>
	<div id="yrc-live" class="wpb-hidden"></div>
	<div id="yrc-version-info" class="wpb-hidden" style="padding:.5em;border:1px solid #000;margin:.35em 0;">
		<h3><b>New version: <span class="yrc-version"></span></b> We recommend you edit the channel and save it.</h3>
		<p><b>What's new: </b></p>
		<ul>
			<li>Choose what to display among Videos, Playlists, Banner etc.</li>
			<li>Check <b>Onlyonce</b> if some of your videos are missing.</li>
			<li>Some other tiny bug fixes.</li>
		</ul>
	</div>
	<div id="yrc-do-upgrade">
		<h3>Pro version features:</h3>
		<ul>
			<li>Multiple channels.</li>		
			<li>List videos from a certain playlist in the <i>Videos</i> section. <b>New</b></li>
			<li>Let users search YouTube - can be restricted to your channel.</li>
			<li>Search bar below banner. <b>New</b></li>
			<li>Change colors to match with your site.</li>
			<li>Show video stats/ratings (2 styles).</li>
			<li>Limit number of videos on page.</li>
			<li>Ability to sort uploads (latest, most liked, most viewed).</li>
			<li>Show a subscribe button.</li>
			<li>Show other social media links in banner.</li>
			<li>Widget.</li>
		</ul>
		<a class="button button-primary" href="http://plugin.builders/products/yourchannel/?from=wp&v=0.4.1">Upgrade</a>
		<a class="button" href="http://plugin.builders/yourchannel-demo/?from=wp&demo=premium&v=0.4.1">Demo</a>
		<a class="button" href="mailto:enquiry@plugin.builders?subject=YourChannel Enquiry">Pre-Purchase Question?</a>
	</div>
	<div id="pbc-feedback">
		<a class="button" href="mailto:suggest@plugin.builders?subject=Extend YourChannel">Suggest Feature</a>
		<a class="button" href="mailto:support@plugin.builders?subject=YourChannel Problem">Report Issue</a>
		<a class="button" href="https://wordpress.org/support/view/plugin-reviews/yourchannel?#postform" target="_blank">Rate It</a>
	</div>
</script>				

<script type="text/template" id="yrc-form-tmpl">
	<form class="pbc-pane" id="pbc-form">
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline">API key</div>
			<div class="pbc-row-field wpb-inline">
				<input name="apikey" value="<%= meta.apikey %>" class="wpb-raw"/>
			</div>
		</div>
	
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline">YouTube</div>
			<div class="pbc-row-field wpb-inline">
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label">Username: <input name="user" value="<%= meta.user %>" class="wpb-raw" id="yrc-username" placeholder="username"/></label><span> OR </span>
				</div></br></br>
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label">Channel ID: <input name="channel" value="<%= meta.channel %>" class="wpb-raw" id="yrc-channel" placeholder="channel"/></label>
				</div>
				<div class="pbc-field wpb-inline">
					<a class="button" id="yrc-get-channel-id">Check</a>
				</div>
				<div class="pbc-form-message" id="yrc-ac-error"></div>
			</div>
		</div>
			
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline">Channel</div>
			<div class="pbc-row-field wpb-inline">
				<input id="yrc-channel-input" name="channel" value="<%= meta.channel %>" class="wpb-raw" readonly />
			</div>
		</div>
		
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline">Show</div>
			<div class="pbc-row-field wpb-inline" id="pbc-show-sections">
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><input type="checkbox" name="uploads" <%- style.uploads ? 'checked' : '' %>/>: Videos </label>
				</div>

				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><input type="checkbox" name="playlists" <%- style.playlists ? 'checked' : '' %>/>: Playlists </label>
				</div>
				
				<% if(meta.search){ %>
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><input type="checkbox" name="search" <%- style.search ? 'checked' : '' %>/>: Search </label>
				</div>
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><input type="checkbox" name="search_on_top" <%- style.search_on_top ? 'checked' : '' %>/>: Search on Top </label>
				</div>
				<% } %>
				
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><input type="checkbox" name="banner" <%- style.banner ? 'checked' : '' %>/>: Banner </label>
				</div>
			</div>
		</div>
		
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline">Style</div>
			<div class="pbc-row-field wpb-inline" id="pbc-style-field">
			
				<div class="pbc-row">
					<div class="pbc-row-label wpb-inline">Video size</div>
					<div class="pbc-row-field wpb-inline">
						<div class="pbc-field wpb-inline">
							<label><input type="radio" name="video_size" value="small" class="wpb-raw" <%- style.video_style[0] === 'small' ? 'checked' : ''  %>/>Small</label>
						</div>
						
						<div class="pbc-field wpb-inline">
							<label><input type="radio" name="video_size" value="large" class="wpb-raw" <%- style.video_style[0] === 'large' ? 'checked' : ''  %>/>Large</label>
						</div>
					</div>
				</div>
				
				<div class="pbc-row">
					<div class="pbc-row-label wpb-inline">Video Meta</div>
					<div class="pbc-row-field wpb-inline">
						<div class="pbc-field wpb-inline">
							<label><input type="radio" name="video_meta" value="none" class="wpb-raw" <%- style.video_style[1] === 'none' ? 'checked' : ''  %>/>None</label>
						</div>
						
						<div class="pbc-field wpb-inline">
							<label><input type="radio" name="video_meta" value="open" class="wpb-raw" <%- style.video_style[1] === 'open' ? 'checked' : ''  %>/>Bottom</label>
						</div>
						
						<div class="pbc-field wpb-inline">
							<label><input type="radio" name="video_meta" value="adjacent" class="wpb-raw" <%- style.video_style[1] === 'adjacent' ? 'checked' : ''  %>/>Right</label>
						</div>
						
						<div class="pbc-field wpb-inline">
							<label><input type="radio" name="video_meta" value="closed" class="wpb-raw" <%- style.video_style[1] === 'closed' ? 'checked' : ''  %>/>Show on hover</label>
						</div>
					</div>
				</div>
				
				<div class="pbc-row">
					<div class="pbc-row-label wpb-inline">Player</div>
					<div class="pbc-row-field wpb-inline">
						<div class="pbc-field wpb-inline">
							<label><input type="radio" name="player_mode" value="1" class="wpb-raw" <%- parseInt(style.player_mode) ? 'checked' : ''  %>/>Inline</label>
						</div>
						
						<div class="pbc-field wpb-inline">
							<label><input type="radio" name="player_mode" value="0" class="wpb-raw" <%- parseInt(style.player_mode) ? '' : 'checked'  %>/>Lightbox</label>
						</div>
					</div>
				</div>
				
				<div class="pbc-row">
					<div class="pbc-row-label wpb-inline">Titles</div>
					<div class="pbc-row-field wpb-inline">
						<div class="pbc-field wpb-inline">
							<label><input type="checkbox" name="truncate" class="wpb-raw" <%- parseInt(style.truncate) ? 'checked' : ''  %>/>Truncate</label>
						</div>
					</div>
				</div>
				
				<div class="pbc-row">
					<div class="pbc-row-label wpb-inline">Direction</div>
					<div class="pbc-row-field wpb-inline">
						<div class="pbc-field wpb-inline">
							<label><input type="checkbox" name="rtl" class="wpb-raw" <%- parseInt(style.rtl) ? 'checked' : ''  %>/>RTL</label>
						</div>
					</div>
				</div>
				
			</div>
		</div>
		
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline">Only once</div>
			<div class="pbc-row-field wpb-inline">
				<label><input type="checkbox" <%- meta.onlyonce ? 'checked' : '' %> name="onlyonce" class="wpb-raw"/>Check this <b>ONLY IF</b> you've 50 or less videos and some are missing.</label>
			</div>
		</div>
														
		<div class="pbc-form-save">
			<div class="pbc-form-message"></div>
			<button class="button button-primary">Save</button>
			<% if(meta.key !== 'nw'){ %>
				<a class="button" id="pbc-cancel-form">Cancel</a>
				<a class="button" id="pbc-delete-form">Delete</a>
			<% } %>	
		</div>
	</form>
</script>

<script type="text/template" id="yrc-channel-tmpl">
	<tr data-down="<%= meta.key %>" class="pbc-down">
		<td><span><%= meta.user %></span></td>
		<td><span><%= meta.channel %></span></td>
		<td><span>[yourchannel user="<%= meta.user %>"]</span></td>
		<td><a class="button pbc-edit" data-down="<%= meta.key %>">Edit</a></td>
	</tr>
</script>

<script type="text/template" id="yrc-lang-form-tmpl">
	<form id="yrc-lang-form">
	<h2 class="wpb-pointer">Quick Translation</h2>
	<div id="pbc-lang-inputs" class="wpb-zero">
		<% for(var t in terms){ %>
			<div class="pbc-field wpb-inline">
				<label><%= YC.lang.terms[t] %><input type="text" name="<%= t %>" value="<%= terms[t] %>"/></label>
			</div>
		<% } %>
		<div><button class="button button-primary">Save</button></div>
	</div>
	</form>
</script>