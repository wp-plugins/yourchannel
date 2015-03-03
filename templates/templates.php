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
	<div id="yrc-do-upgrade">
		<h3>You should upgrade if you:</h3>
		<ul>
			<li>need to show multiple channels.</li>		
			<li>want to let users search YouTube - can be restricted to your channel.</li>
			<li>want to change colors to match with your site.</li>
			<li>want to show video stats/ratings.</li>
			<li>want the ability to sort uploads (latest, most liked, most viewed).</li>
			<li>need to show a subscribe button.</li>
		</ul>
		<a class="button button-primary" href="http://plugin.builders/yourchannel/?from=wp">Upgrade for only 10$</a>
		<a class="button" href="http://plugin.builders/yourchannel/?from=wp&demo=premium">Demo</a>
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
					<label class="pbc-field-label">Username:<input name="user" value="<%= meta.user %>" class="wpb-raw" id="yrc-username" placeholder="username"/></label><span> OR </span>
				</div></br></br>
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label">Channel ID:<input name="channel" value="<%= meta.channel %>" class="wpb-raw" id="yrc-channel" placeholder="channel"/></label>
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
					<label class="pbc-field-label">Playlists:<input type="checkbox" name="playlists" <%- style.playlists ? 'checked' : '' %> class="wpb-raw"/></label>
				</div>
			</div>
		</div>
														
		<div class="pbc-form-save">
			<div class="pbc-form-message"></div>
			<button class="button button-primary">Save</button>
			<button class="button">Cancel</button>
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