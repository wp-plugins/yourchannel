<?php
/**
 * @package YourChannel
 * @version 0.6.2
 */
/*
	Plugin Name: YourChannel
	Plugin URI: http://plugin.builders/yourchannel/
	Description: YouTube channel on your website.
	Author: Plugin Builders
	Version: 0.6.2
	Author URI: http://plugin.builders/
	Text Domain: YourChannel
	Domain Path: languages
*/

class WPB_YourChannel{
	static $version = '0.6.2';
	static $version_file = '0.6.2';
	static $terms = array();
	static $playlist;
	static $st;
	static $so;
	
	function __construct(){
		self::translateTerms();
		add_action('admin_menu', array($this, 'createMenu'));
		add_action('admin_init', array($this, 'deploy'));
		add_action('plugins_loaded', array($this, 'loadTextDomain') );
		
		add_action('admin_enqueue_scripts', array($this, 'loadDashJs'));
		add_action('wp_enqueue_scripts', array($this, 'loadForFront'));
		
		add_action('wp_ajax_yrc_save', array($this, 'save'));
		add_action('wp_ajax_yrc_get', array($this, 'get'));
		add_action('wp_ajax_yrc_delete', array($this, 'delete'));
		add_action('wp_ajax_yrc_get_lang', array($this, 'getLang'));
		add_action('wp_ajax_yrc_save_lang', array($this, 'saveLang'));
		add_action('wp_ajax_yrc_delete_lang', array($this, 'deleteLang'));
		add_action('wp_ajax_yrc_clear_keys', array($this, 'clearKeys'));
		
		add_shortcode( 'yourchannel', array($this, 'shortcoode') );
		
		$this->free();
	}
	
	public function clearKeys(){
		delete_option('yrc_keys');
		echo 1; die();
	}
	
	public function createMenu(){
		add_submenu_page(
			'options-general.php',
			'YourChannel',
			'YourChannel',
			'manage_options',
			'yourchannel',
			array($this, 'pageTemplate')
		);
	}
	
	public function pageTemplate(){ ?>
		<div class="wrap">
			<div id="icon-themes" class="icon32"></div>
			<h2 class="wpb-inline" id="yrc-icon">Your<span class="wpb-inline">Channel</span></h2>
			<div id="yrc-wrapper" data-version="<?php echo self::$version; ?>">
				<img src="<?php echo site_url('wp-admin/images/spinner.gif'); ?>" id="yrc-init-loader"/>
			</div>
		</div>
		<?php
		$this->templates();
	}
	
	public function templates(){
		do_action('yrc_templates');
		include 'templates/templates.php';
	}
	
	public function deploy(){}
	
	public function loadDashJs($hook){
		if($hook === 'settings_page_yourchannel'){
			wp_enqueue_script('wp-color-picker');
			wp_register_script('yrc_script', plugins_url('/js/yrc-'.self::$version_file.'.js', __FILE__), array('jquery', 'underscore', 'wp-color-picker'), null, 1);
			wp_enqueue_script('yrc_script');
			wp_register_script('yrc_admin_settings', plugins_url('/js/admin-'.self::$version_file.'.js', __FILE__), array('yrc_script'), null, 1);
			wp_enqueue_script('yrc_admin_settings');
			wp_register_style('yrc_admin_style', plugins_url('/css/admin-'.self::$version_file.'.css', __FILE__));
			wp_enqueue_style('yrc_admin_style');
			wp_register_style('yrc_style', plugins_url('/css/style-'.self::$version_file.'.css', __FILE__));
			wp_enqueue_style('yrc_style');
			wp_enqueue_style('wp-color-picker');
		}	
	}
	
	public function loadForFront(){}
	
	public static function nins( $array, $key ){	//nothing if not set
		return isset( $array[$key] ) && $array[$key] ? strtolower( $array[$key] ) : '';
	}
	
	public static function outputChannel( $user, $tag ){
		$user = strtolower( html_entity_decode($user) );
		$tag = strtolower( html_entity_decode($tag) );
		
		$keys = get_option('yrc_keys');
		$key = '';
		if(sizeof($keys) && is_array($keys)){
			foreach($keys as $k){
				if( ( strtolower( $k['user'] ) === $user ) && ( self::nins( $k, 'tag' ) === $tag ) ) {
					$key = $k['key']; break;
				}
			}	
		}
		return $key ? get_option( $key ) : '';
	}
	
	public function shortcoode($atts){
		$atts = shortcode_atts(
			array(
				'user' => '',
				'playlist' => '',
				'tag' => '',
				'search' => '',
				'own' => 1
			), $atts );
		return self::output( $atts['user'], $atts['playlist'],  $atts['tag'], $atts['search'], $atts['own']);
	}
	
	public static function output( $user, $playlist, $tag = '', $st = '', $so = '' ){ 
		self::$playlist = $playlist;
		self::$st = $st;
		self::$so = $so;
		$channel = self::outputChannel( $user, $tag );
		if(!$channel) return '<span id="yrc-wrong-shortcode"></span>';
		$channel = apply_filters('yrc_output', $channel);
		
		$url = plugins_url('/js/yrc-'.self::$version_file.'.js', __FILE__);
		$css_url = plugins_url('/css/style-'.self::$version_file.'.css', __FILE__);
		
		
		self::translateTerms();
		$terms = array(
			'form' => get_option('yrc_lang_terms'),
			'fui' => self::$terms['front_ui']
		);
		
		
		$terms['form'] = $terms['form'] ? $terms['form'] : self::$terms['form'];
	
		return '<div class="yrc-shell-cover" data-yrc-channel="'. htmlentities( json_encode($channel) ) .'" data-yrc-setup=""></div>
		<script>
			var YRC = YRC || {};
			(function(){
				if(!YRC.loaded){
					YRC.loaded = true;
					YRC.lang = '.json_encode( $terms ).';	
					var script = document.createElement("script");
						script.src = "'.$url.'";
						script.id = "yrc-script";
						document.querySelector("head").appendChild(script);
					var style = document.createElement("link");
						style.rel = "stylesheet";
						style.href = "'.$css_url.'";
						style.type = "text/css";
						document.querySelector("head").appendChild(style);
				} else { if(YRC.EM)YRC.EM.trigger("yrc.newchannel");}
			}());
		</script>';
	}
	
	
	/**
	
		Input
		
	**/
	
	
	public function save(){
		$down = $this->validate( $_POST['yrc_channel'] );
		
		if(!$down['meta']['channel'] || !$down['meta']['apikey']) {echo 0; die();}
		
		$re = null;
		$key = $down['meta']['key'];
		$down['meta']['user'] = stripslashes( $down['meta']['user'] );
		$down['meta']['tag'] = stripslashes( $down['meta']['tag'] );
		if(isset( $down['css'] )) $down['css'] = stripslashes( $down['css'] );
				
		if($key === 'nw'){
			$re = get_option('yrc_keys');
			$re = $re ? $re : array();
			$key = 'yrc_'.time();
			$re[] = array('key'=>$key, 'user'=>$down['meta']['user'], 'tag'=>$down['meta']['tag']);
			$re = update_option('yrc_keys', $re);
			$down['meta']['key'] = $key;
			$re = update_option($key, $down);
			$re = $re ? $key : $re;
		} else {
			$re = get_option('yrc_keys');
			forEach($re as &$r){
				$tag = true;
				if(isset($r['tag']) && !empty($r['tag'])) $tag = ($r['tag'] === $down['meta']['tag']);
				if($r['user'] !== $down['meta']['user']) $tag = true;
				if( ($r['key'] === $down['meta']['key']) && $tag ) {
					$r['user'] = $down['meta']['user'];
					$r['tag'] = $down['meta']['tag'];
					update_option('yrc_keys', $re);
					$re = update_option($down['meta']['key'], $down);
					break;
				}
			}
			$re = $key ? $key : $re;
		}
		wp_send_json($re);
	}
		
	public function get(){
		$keys = get_option('yrc_keys');
		$re = array();
		if($keys){
			forEach($keys as $key){
				$re[] = get_option($key['key']);
			}
		}
		wp_send_json($re);
	}
	
	public function delete(){
		$key = sanitize_text_field( $_POST['yrc_key'] );
		$keys = get_option('yrc_keys');
		$re = false;
		forEach($keys as $i=>$k){
			if($k['key'] === $key) {
				unset($keys[$i]);
				update_option('yrc_keys', $keys);
				$re = delete_option( $key );
				break;
			}
		}	
		echo $re;
		die();
	}
	
	public function getLang(){
		wp_send_json( get_option('yrc_lang_terms') );
	}
	
	public function saveLang(){
		$lang = $_POST['yrc_lang'];
		echo update_option('yrc_lang_terms', $lang);
		die();
	}
	
	public function deleteLang(){
		delete_option('yrc_lang_terms');
		echo 1;
		die();
	}
		
	/**
	
		Sanitizing
		
	**/
	
	public $fields = array();
	
	public function validate($ins){
		$rins = $this->validation( $ins );
		return $rins;
	}
	
	public function validation( $ins ){
		$rins = array();
		foreach($ins as $key=>$value){
			$rins[$key] = $this->validateField( $key, $value );
		}
		return $rins;
	}
	
	public function validateField( $k, $val ){
		if(is_array($val)){
			$clean_val = $this->validation( $val );
		} else {
			$clean_val = $this->cleanse(
				( array_key_exists($k, $this->fields) ? $this->fields[$k] : 'string' ),
			$val);
		}
		return $clean_val;
	}
	
	public function cleanse($type, $value){
		switch($type){
			case 'int':
				return intval($value);
				break;
			case 'url':
				return esc_url($value);
				break;
			default:
				return sanitize_text_field($value);
				break;
		} 
	}
	
	public function loadTextDomain(){
		load_plugin_textdomain( 'YourChannel', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}
	
	public static function translateTerms(){ 
		self::$terms['front_ui'] = array(
			'sort_by'  => __('Sort by', 'YourChannel'),
			'relevant'  => __('Relevant', 'YourChannel'),
			'latest'  => __('Latest', 'YourChannel'),
			'liked'  => __('Liked', 'YourChannel'),
			'title'  => __('Title', 'YourChannel'),
			'views'  => __('Views', 'YourChannel'),
			'duration'  => __('Duration', 'YourChannel'),
			'any'  => __('Any', 'YourChannel'),
			'_short'  => __('Short', 'YourChannel'),
			'medium'  => __('Medium', 'YourChannel'),
			'_long'  => __('Long', 'YourChannel'),
			'uploaded'  => __('Uploaded', 'YourChannel'),
			'all_time'  => __('All time', 'YourChannel'),
			'today'  => __('Today', 'YourChannel'),
			'ago'  => __('ago', 'YourChannel'),
			'last'  => __('Last', 'YourChannel'),
			'day'  => __('day', 'YourChannel'),
			'days'  => __('days', 'YourChannel'),
			'week'  => __('week', 'YourChannel'),
			'weeks'  => __('weeks', 'YourChannel'),
			'month'  => __('month', 'YourChannel'),
			'months'  => __('months', 'YourChannel'),
			'year'  => __('year', 'YourChannel'),
			'years'  => __('years', 'YourChannel'),
			'older'  => __('Older', 'YourChannel'),
			'wplocale' => get_locale()
		);
		
		self::$terms['form'] = array(
			'Videos'  => __('Videos', 'YourChannel'),
			'Playlists'  => __('Playlists', 'YourChannel'),
			'Search'  => __('Search', 'YourChannel'),
			'Loading'  => __('Loading', 'YourChannel'),
			'more'  => __('more', 'YourChannel'),
			'Nothing_found'  => __('Nothing found', 'YourChannel')
		);
	}
	
	
	/**		Free Version Specific	**/
	
	public function free(){
		add_action('admin_notices', array($this, 'showProFeature'));
		add_action('wp_ajax_yrc_upgrade_nag_dismiss', array($this, 'upgradeNagDismiss'));
	}
	
	public $nags = 13;
	public $max_nags = 4;
	public $nag_key = 'yrc_upgrade_nag_dismisses';
	
	public function upgradeNagDismisses( $add = false ){
		$nags = get_option($this->nag_key);
		$nags = $nags ? array((int)$nags[0], (int)$nags[1]) : array(0, 0);
		$nags[1] += ($nags[0] >= $this->nags) ? 1 : 0;
		$nags[0] = $nags[0] >= $this->nags ? 0 : (($add || $nags[0]) ? ($nags[0]+1) : $nags[0]);
		update_option($this->nag_key, $nags);
		return $nags;
	}
	
	public function upgradeNagDismiss(){
		$this->upgradeNagDismisses( true );
		echo 1;
		die();
	}
	
	public function showProFeature(){
		if( get_admin_page_title() === 'YourChannel' ) return false;
		
		$nags = $this->upgradeNagDismisses();
		if(($nags[0] && ($nags[0] <= $this->nags)) || ($nags[1] > $this->max_nags)) return false;
				
		$notice = $this->proFeatures( true ); ?>
			<div class="updated yrc-nag">
				<p>
					<span style="display:inline-block;width:90%;">
						<b>YourChannel Pro Feature: </b>
						<a href="http://plugin.builders/yourchannel?notice" target="_blank">
							<?php echo $notice; ?>
						</a>
					</span><span style="text-align:right;display:inline-block;width:10%;">
						<a href="#dismiss" id="yrc-later" style="color:#E68B8B;">X</a>
					</span>
				</p>
			</div>
			<script type="text/javascript">
				jQuery('body').on('click', '#yrc-later', function(e){
					e.preventDefault();
					jQuery('.yrc-nag p').html('Ok, we\'ll ask you again.');
					window.setTimeout(function(){
						jQuery('.yrc-nag').slideUp();
					}, 1000);
					jQuery.post('admin-ajax.php', {'action':'yrc_upgrade_nag_dismiss'}, function(re){
						console.log(re);
					});
				});
			</script>
		<?php	
		
		if($nags[1] === $this->max_nags){
			update_option( $this->nag_key, array((int)$nags[0], (int)$nags[1]+1) );
			echo '<div class="updated yrc-nag"><p>We won\'t ask you to upgrade anymore. Thanks for using <a href="http://plugin.builders/yourchannel?notice">YourChannel</a></p></div>';
		}	
	}
	
	public function proFeatures( $random = false ){
		$features = array(
			'Multiple channels.',		
			'List videos from a certain playlist in the <i>Videos</i> section.',
			'Let users search YouTube - can be restricted to your channel.',
			'Search bar below banner.',
			'Show videos by a search term. <b>New</b>',
			'Change colors to match with your site.',
			'Show video stats/ratings (2 styles).',
			'Limit number of videos on page.',
			'Ability to sort uploads (latest, most liked, most viewed).',
			'Autoplay next video. <b>New</b>',
			'Preload any or first video. <b>New</b>',
			'Custom CSS input. <b>New</b>',
			'Show a subscribe button (multiple styles).',
			'Show other social media links in banner.',
			'Widget.'
		);
		if($random) return $features[ rand(0, sizeof($features)-1) ];
		
		foreach($features as $f){
			echo '<li>'. $f .'</li>';
		}
	}	
} 

new WPB_YourChannel();
?>