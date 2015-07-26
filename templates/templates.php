<script type="text/template" id="yrc-main-tmpl">
	<div id="yrc-channels" class="wpb-hidden yrc-content">
		<div class="yrc-content-header wpb-clr">
			<h2 class="wpb-float-left"><?php _e('Channels', 'YourChannel'); ?></h2>
			<div class="yrc-content-buttons wpb-float-right"></div>
		</div>
		<table class="widefat">
			<thead>
				<tr>
					<th><?php _e('Username', 'YourChannel'); ?></th>
					<th><?php _e('Channel', 'YourChannel'); ?></th>
					<th><?php _e('Shortcode', 'YourChannel'); ?></th>
					<th></th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
	<div id="yrc-editor"></div>
	<div id="yrc-live" class="wpb-hidden"></div>
	<div id="yrc-version-info" class="wpb-hidden" style="padding:.5em;border:1px solid #000;margin:.35em 0;">
		<h3><b><?php _e('New version', 'YourChannel'); ?>: <span class="yrc-version"></span></b></h3>
		<p><?php _e('If something seems off please edit and save your channel', 'YourChannel'); ?>.</p>
	</div>
	<div id="yrc-do-upgrade">
		<h3>Pro version features:</h3>
		<ul>
			<?php $this->proFeatures(); ?>
		</ul>
		<a class="button button-primary" href="http://plugin.builders/products/yourchannel/?from=wp&v=0.6.3">Upgrade</a>
		<a class="button" href="mailto:enquiry@plugin.builders?subject=YourChannel Enquiry">Pre-Purchase Question?</a>
	</div>
	<div id="pbc-feedback">
		<a class="button" href="mailto:suggest@plugin.builders?subject=Extend YourChannel"><?php _e('Suggest Feature', 'YourChannel'); ?></a>
		<a class="button" href="mailto:support@plugin.builders?subject=YourChannel Problem"><?php _e('Report Issue', 'YourChannel'); ?></a>
		<a class="button" href="https://wordpress.org/support/view/plugin-reviews/yourchannel?#postform" target="_blank"><?php _e('Write a review', 'YourChannel'); ?></a>
		<a class="button" href="http://plugin.builders/category/docs/yourchannel/" target="_blank"><?php _e('Docs & Troubleshooting', 'YourChannel'); ?></a>
	</div>
</script>				

<script type="text/template" id="yrc-form-tmpl">
	<form class="pbc-pane" id="pbc-form">
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline"><?php _e('API Key', 'YourChannel'); ?></div>
			<div class="pbc-row-field wpb-inline">
				<input name="apikey" value="<%= meta.apikey %>" class="wpb-raw"/>
			</div>
		</div>
	
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline"><?php _e('YouTube', 'YourChannel'); ?></div>
			<div class="pbc-row-field wpb-inline" id="yrc-user-fields">
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><?php _e('Username', 'YourChannel'); ?>: <input name="user" value="<%= meta.user %>" class="wpb-raw" id="yrc-username" placeholder="<?php _e('Username', 'YourChannel'); ?>"/><span> <?php _e('OR', 'YourChannel'); ?> </span></label>
				</div></br></br>
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><?php _e('Channel', 'YourChannel'); ?> <?php _e('ID', 'YourChannel'); ?>: <input name="channel" value="<%= meta.channel %>" class="wpb-raw" id="yrc-channel" placeholder="<?php _e('Channel', 'YourChannel'); ?>"/></label>
				</div>
				<div class="pbc-field wpb-inline">
					<a class="button" id="yrc-get-channel-id"><?php _e('Check', 'YourChannel'); ?></a>
				</div>
				<div class="pbc-form-message" id="yrc-ac-error"></div>
			</div>
		</div>
							
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline"><?php _e('Show', 'YourChannel'); ?></div>
			<div class="pbc-row-field wpb-inline" id="pbc-show-sections">
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><input type="checkbox" name="uploads" <%- style.uploads ? 'checked' : '' %>/>: <?php _e('Videos', 'YourChannel'); ?> </label>
				</div>

				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><input type="checkbox" name="playlists" <%- style.playlists ? 'checked' : '' %>/>: <?php _e('Playlists', 'YourChannel'); ?> </label>
				</div>
								
				<div class="pbc-field wpb-inline">
					<label class="pbc-field-label"><input type="checkbox" name="banner" <%- style.banner ? 'checked' : '' %>/>: <?php _e('Banner', 'YourChannel'); ?> </label>
				</div>
			</div>
		</div>
		
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline"><?php _e('Style', 'YourChannel'); ?></div>
			<div class="pbc-row-field wpb-inline">
				<a class="button pbc-field-toggler"><?php _e('Toggle', 'YourChannel'); ?></a>
				<div class="pbc-togglable-field wpb-force-hide" id="pbc-style-field">
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Thumb size', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline">
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="video_size" value="small" class="wpb-raw" <%- style.video_style[0] === 'small' ? 'checked' : ''  %>/><?php _e('Small', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="video_size" value="large" class="wpb-raw" <%- style.video_style[0] === 'large' ? 'checked' : ''  %>/><?php _e('Large', 'YourChannel'); ?></label>
							</div>
						</div>
					</div>
					
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Thumb image size', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline">
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="thumb_image_size" value="medium" class="wpb-raw" <%- style.thumb_image_size === 'medium' ? 'checked' : ''  %>/><?php _e('Medium', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="thumb_image_size" value="high" class="wpb-raw" <%- style.thumb_image_size === 'high' ? 'checked' : ''  %>/><?php _e('Large', 'YourChannel'); ?></label>
							</div>
						</div>
					</div>
					
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Play icon', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline">
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="play_icon" value="all" class="wpb-raw" <%- style.play_icon === 'all' ? 'checked' : ''  %>/><?php _e('Show', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="play_icon" value="hover" class="wpb-raw" <%- style.play_icon === 'hover' ? 'checked' : ''  %>/><?php _e('Show on Hover', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="play_icon" value="" class="wpb-raw" <%- style.play_icon === '' ? 'checked' : ''  %>/>None</label>
							</div>
						</div>
					</div>
					
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Video Meta', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline">
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="video_meta" value="none" class="wpb-raw" <%- style.video_style[1] === 'none' ? 'checked' : ''  %>/><?php _e('None', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="video_meta" value="open" class="wpb-raw" <%- style.video_style[1] === 'open' ? 'checked' : ''  %>/><?php _e('Bottom', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="video_meta" value="adjacent" class="wpb-raw" <%- style.video_style[1] === 'adjacent' ? 'checked' : ''  %>/><?php _e('Right', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="video_meta" value="closed" class="wpb-raw" <%- style.video_style[1] === 'closed' ? 'checked' : ''  %>/><?php _e('Show on Hover', 'YourChannel'); ?></label>
							</div>
						</div>
					</div>
					
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Player', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline" id="yrc-player-options">
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="player_mode" value="1" class="wpb-raw" <%- parseInt(style.player_mode) ? 'checked' : ''  %>/><?php _e('Inline', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="player_mode" value="0" class="wpb-raw" <%- parseInt(style.player_mode) ? '' : 'checked'  %>/><?php _e('Lightbox', 'YourChannel'); ?></label>
							</div>
						</div>
					</div>
					
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Player', 'YourChannel'); ?> <?php _e('top', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline">
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="player_top" value="title" class="wpb-raw" <%- (style.player_top === 'title') ? 'checked' : ''  %>/><?php _e('Title', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="player_top" value="desc" class="wpb-raw" <%- (style.player_top === 'desc') ? 'checked' : ''  %>/><?php _e('Description', 'YourChannel'); ?></label>
							</div>
							
							<div class="pbc-field wpb-inline">
								<label><input type="radio" name="player_top" value="hide" class="wpb-raw" <%- (style.player_top === 'hide') ? 'checked' : ''  %>/><?php _e('Hide', 'YourChannel'); ?></label>
							</div>
						</div>
					</div>
					
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Titles', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline">
							<div class="pbc-field wpb-inline">
								<label><input type="checkbox" name="truncate" class="wpb-raw" <%- style.truncate ? 'checked' : ''  %>/><?php _e('Single line', 'YourChannel'); ?></label>
							</div>
						</div>
					</div>
					
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Direction', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline">
							<div class="pbc-field wpb-inline">
								<label><input type="checkbox" name="rtl" class="wpb-raw" <%- style.rtl ? 'checked' : ''  %>/>RTL</label>
							</div>
						</div>
					</div>
					
					<div class="pbc-row">
						<div class="pbc-row-label wpb-inline"><?php _e('Thumb Margin', 'YourChannel'); ?></div>
						<div class="pbc-row-field wpb-inline">
							<label><input type="number" min="0" max="50" value="<%- (style.thumb_margin || 8) %>" name="thumb_margin" class="wpb-raw"/>px</label>
						</div>
					</div>
				</div>	
			</div>
		</div>
				
		<div class="pbc-row">
			<div class="pbc-row-label wpb-inline"><?php _e('Missing', 'YourChannel'); ?></div>
			<div class="pbc-row-field wpb-inline">
				<label><input type="checkbox" <%- meta.onlyonce ? 'checked' : '' %> name="onlyonce" class="wpb-raw"/><?php _e('Check this ONLY IF some videos are missing, HAS DRAWBACKS', 'YourChannel'); ?>.</label>
			</div>
		</div>
														
		<div class="pbc-form-save">
			<div class="pbc-form-message"></div>
			<button class="button button-primary"><?php _e('Save', 'YourChannel'); ?></button>
			<% if(meta.key !== 'nw'){ %>
				<a class="button" id="pbc-cancel-form"><?php _e('Cancel', 'YourChannel'); ?></a>
				<a class="button" id="pbc-delete-form"><?php _e('Delete', 'YourChannel'); ?></a>
			<% } %>	
		</div>
		
		</br><small><?php _e('Some style changes may not take effect in preview.', 'YourChannel'); ?></small>
	</form>
</script>

<script type="text/template" id="yrc-channel-tmpl">
	<tr data-down="<%= meta.key %>" class="pbc-down">
		<td><span><%= meta.user %></span></td>
		<td><span><%= meta.channel %></span></td>
		<td><span>[yourchannel user="<%= meta.user %>"<%- meta.tag ? ' tag="'+meta.tag+'"' : '' %>]</span></td>
		<td><a class="button pbc-edit" data-down="<%= meta.key %>"><?php _e('Edit', 'YourChannel'); ?></a></td>
	</tr>
</script>

<script type="text/template" id="yrc-lang-form-tmpl">
	<form id="yrc-lang-form">
	<h2 class="wpb-pointer"><?php _e('Quick Translation', 'YourChannel'); ?></h2>
	<div id="pbc-lang-inputs" class="wpb-zero">
		<% for(var t in terms){ %>
			<div class="pbc-field wpb-inline">
				<label><%= YC.lang.form_labels[t] %><input type="text" name="<%= t %>" value="<%= terms[t] %>"/></label>
			</div>
		<% } %>
		<div>
			<button class="button button-primary"><?php _e('Save', 'YourChannel'); ?></button>
			<a class="button" id="yrc-delete-terms"><?php _e('Clear', 'YourChannel'); ?></a>
		</div>
	</div>
	</form>
	<div id="yrc-defined-css" class="wpb-hidden">
		<h2 class="">CSS</h2>
		<ul>
			<li>Hide video views: <code>.yrc-video-views{ display:none; }</code></li>
			<li>Hide video date: <code>.yrc-video-date{ display:none; }</code></li>
			<li>Hide top banner: <code>.yrc-banner:first-child{ display:none; }</code></li>
			<li>Hide bottom banner: <code>.yrc-banner:last-child{ display:none; }</code></li>
			<li>Sorting dropdown background: <code>.yrc-sort-uploads{ background: white; }</code></li>
		</ul>
	</div>
</script>

<?php
	$admin_terms = array(
		'does_not_exist' => __("doesn't exist", 'YourChannel'),
		'saving' => __('Saving', 'YourChannel'),
		'enter_api_key' => __('Please enter your API key', 'YourChannel'),
		'invalid_inputs' => __('Your inputs are invalid, please have a look at them', 'YourChannel'),
		'save' => __('Save', 'YourChannel'),
		'edit' => __('Edit', 'YourChannel'),
		'deleting' => __('Deleting', 'YourChannel'),
		'clear' => __('Clear', 'YourChannel'),
		'clearing' => __('Clearing', 'YourChannel')
	);
	
	$admin_terms = apply_filters('yrc_admin_ui_terms', $admin_terms);
?>

<script>
	<?php WPB_YourChannel::translateTerms(); ?>
	var yrc_lang_terms = {
		'aui': <?php echo json_encode($admin_terms); ?>,
		'form': <?php $ft = get_option('yrc_lang_terms'); echo json_encode($ft ? $ft : WPB_YourChannel::$terms['form']); ?>,
		'fui': <?php echo json_encode(WPB_YourChannel::$terms['front_ui']); ?>
	}
</script>
