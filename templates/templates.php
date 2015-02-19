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
		<a class="button button-primary" href="http://plugin.builders/yourchannel">Upgrade for only 10$</a>
		<a class="button" href="http://plugin.builders/yourchannel">Demo</a>
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
			<div class="pbc-row-label wpb-inline">Username</div>
			<div class="pbc-row-field wpb-inline">
				<input name="user" value="<%= meta.user %>" class="wpb-raw" id="yrc-username"/>
				<div class="pbc-field wpb-inline">
					<a class="button" id="yrc-get-channel-id">Get channel id</a>
				</div>
			</div>
		</div>
			
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline">Channel</div>
			<div class="pbc-row-field wpb-inline">
				<input name="channel" value="<%= meta.channel %>" class="wpb-raw" readonly />
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