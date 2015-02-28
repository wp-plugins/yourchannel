<?php
/**
 * @package YourChannel
 * @version 0.3
 */
/*
	Plugin Name: YourChannel
	Plugin URI: http://wordpress.org/plugins/yourchannel/
	Description: YouTube channel in your website.
	Author: Plugin Builders
	Version: 0.3
	Author URI: http://plugin.builders/
*/

class WPB_YourChannel{
	function __construct(){
		add_action('admin_menu', array($this, 'createMenu'));
		add_action('admin_init', array($this, 'deploy'));
		
		add_action('admin_enqueue_scripts', array($this, 'loadDashJs'));
		add_action('wp_enqueue_scripts', array($this, 'loadForFront'));
		
		add_action('wp_ajax_yrc_save', array($this, 'save'));
		add_action('wp_ajax_yrc_get', array($this, 'get'));
		
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
			<div id="yrc-wrapper">
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
		if($hook === 'settings_page_yourchannel'){
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
	
	public function loadForFront(){}
	
	public function shortcodeChannel( $user ){
		$keys = get_option('yrc_keys');
		$key = '';
		if($keys){
			foreach($keys as $k){
				if( strtolower($k['user']) === strtolower($user)) {$key = $k['key']; break; }
			}	
		}
		$key = $key ? $key : (sizeof($keys) < 2 ? $keys[0]['key'] : '');
		return get_option( $key );
	}
	
	public function shortcoode($atts){
		$atts = shortcode_atts(
			array(
				'user' => '',
			), $atts );
			
		$channel = $this->shortcodeChannel( $atts['user'] );
		if($channel){
			return '<div class="yrc-shell-cover" data-yrc-channel="'. htmlentities( json_encode($channel) ) .'"></div>'.
					$this->shortcodeScript();
		}	
		return '';
	}
	
	function shortcodeScript(){ 
		$url = plugins_url('/js/yrc.js', __FILE__);
		$css_url = plugins_url('/css/style.css', __FILE__);
		?>
		<script>
			var YRC = YRC || {};
			(function(){
				if(!YRC.loaded){
					YRC.loaded = true;
					var script = document.createElement('script');
						script.src = '<?php echo $url; ?>';
						script.id = 'yrc-script';
						document.querySelector('head').appendChild(script);
					var style = document.createElement('link');
						style.rel = 'stylesheet';
						style.href = '<?php echo $css_url; ?>';
						style.type = 'text/css';
						document.querySelector('head').appendChild(style);
				} else YRC.EM && YRC.EM.trigger('yrc.newchannel');
			}());
		</script>
		<?php
	}
	
	
	/**
		Input
	**/
	
	
	public function save(){
		$down = $_POST['yrc_channel'];
		$down = $this->validate( $down );
		
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
			forEach($re as $r)
				if($r['key'] == $down['meta']['key']) {$r['user'] = $down['meta']['user']; break; }
			update_option('yrc_keys', $re);
			
			$re = update_option($down['meta']['key'], $down);
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

/*
*/

?>