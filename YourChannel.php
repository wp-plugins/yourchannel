<?php
/**
 * @package YourChannel
 * @version 0.4.1
 */
/*
	Plugin Name: YourChannel
	Plugin URI: http://wordpress.org/plugins/yourchannel/
	Description: YouTube channel on your website.
	Author: Plugin Builders
	Version: 0.4.1
	Author URI: http://plugin.builders/
*/

class WPB_YourChannel{
	private $version = 0.4;
	
	function __construct(){
		add_action('admin_menu', array($this, 'createMenu'));
		add_action('admin_init', array($this, 'deploy'));
		
		add_action('admin_enqueue_scripts', array($this, 'loadDashJs'));
		add_action('wp_enqueue_scripts', array($this, 'loadForFront'));
		
		add_action('wp_ajax_yrc_save', array($this, 'save'));
		add_action('wp_ajax_yrc_get', array($this, 'get'));
		add_action('wp_ajax_yrc_delete', array($this, 'delete'));
		add_action('wp_ajax_yrc_get_lang', array($this, 'getLang'));
		add_action('wp_ajax_yrc_save_lang', array($this, 'saveLang'));
		
		add_shortcode( 'yourchannel', array($this, 'shortcoode') );
		
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
			<div id="yrc-wrapper" data-lang="<?php echo htmlentities( json_encode( get_option('yrc_lang_terms') ) ); ?>">
				<img src="<?php echo site_url('wp-admin/images/spinner.gif'); ?>" id="yrc-init-loader"/>
			</div>
		</div>
		<?php
		$this->templates();
	}
	
	public function templates(){
		include 'templates/templates.php';
		do_action('yrc_templates');
	}
	
	public function deploy(){}
	
	public function loadDashJs($hook){
		if($hook == 'settings_page_yourchannel'){
			wp_enqueue_script('wp-color-picker');
			wp_register_script('yrc_script', plugins_url('/js/yrc.js', __FILE__), array('jquery', 'underscore', 'wp-color-picker'), null, 1);
			wp_enqueue_script('yrc_script');
			wp_register_script('yrc_admin_settings', plugins_url('/js/admin.js', __FILE__), array('yrc_script'), null, 1);
			wp_enqueue_script('yrc_admin_settings');
			wp_register_style('yrc_admin_style', plugins_url('/css/admin.css', __FILE__));
			wp_enqueue_style('yrc_admin_style');
			wp_register_style('yrc_style', plugins_url('/css/style.css', __FILE__));
			wp_enqueue_style('yrc_style');
			wp_enqueue_style('wp-color-picker');
		}	
	}
	
	public function loadForFront(){
	}
	
	public static function outputChannel( $user ){
		$keys = get_option('yrc_keys');
		$key = '';
		if(sizeof($keys)){
			foreach($keys as $k){
				if( strtolower($k['user']) === strtolower($user)) {$key = $k['key']; break; }
			}	
		}
		return $key ? get_option( $key ) : '';
	}
	
	public function shortcoode($atts){
		$atts = shortcode_atts(
			array(
				'user' => '',
			), $atts );
			
		return self::output( $atts['user'] );
	}
	
	public static function output( $user ){ 
		$channel = self::outputChannel( $user );
		if(!$channel) return '<span id="yrc-wrong-shortcode"></span>';
		
		$url = plugins_url('/js/yrc.js', __FILE__);
		$css_url = plugins_url('/css/style.css', __FILE__);
	
		return '<div class="yrc-shell-cover" data-yrc-channel="'. htmlentities( json_encode($channel) ) .'" data-yrc-setup=""></div>
		<script>
			var YRC = YRC || {};
			(function(){
				if(!YRC.loaded){
					YRC.loaded = true;
					YRC.lang = '.json_encode( get_option('yrc_lang_terms') ).';	
					var script = document.createElement("script");
						script.src = "'.$url.'";
						script.id = "yrc-script";
						document.querySelector("head").appendChild(script);
					var style = document.createElement("link");
						style.rel = "stylesheet";
						style.href = "'.$css_url.'";
						style.type = "text/css";
						document.querySelector("head").appendChild(style);
				} else YRC.EM && YRC.EM.trigger("yrc.newchannel");
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
		
		if($key === 'nw'){
			$re = get_option('yrc_keys');
			$re = $re ? $re : array();
			$key = 'yrc_'.time();
			$re[] = array('key'=>$key, 'user'=>$down['meta']['user']);
			$re = update_option('yrc_keys', $re);
			$down['meta']['key'] = $key;
			$re = update_option($key, $down);
			$re = $re ? $key : $re;
		} else {
			$re = get_option('yrc_keys');
			forEach($re as &$r){
				if($r['key'] === $down['meta']['key']) {
					$r['user'] = $down['meta']['user'];
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
	
}

new WPB_YourChannel();
?>