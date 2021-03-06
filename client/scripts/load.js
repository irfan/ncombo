/**
	Default loader for nCombo apps.
*/

var jLoad = {
	_ie: /MSIE (\d+\.\d+);/.test(navigator.userAgent),
	_loader: null,
	_loaderTextBox: null,
	_loaderAnimInterval: 200,
	_loaderText: null,
	_loaderCounter: null,
	_frameworkURL: null,
	_imgLoaded: false,
	_fadeSpeed: 20,
	_alpha: 0,
	_fadeInterval: null,
    
	start: function(settings) {
		jLoad._frameworkURL = settings.frameworkURL;
		jLoad._frameworkClientURL = settings.frameworkClientURL;
		
		var imgURL = smartCacheManager.setURLCacheVersion(jLoad._frameworkClientURL + 'assets/logo.png');
		var text = 'Loading';
		
		jLoad._load(imgURL, 'nCombo', 'http://ncombo.com/', text);
	},
	
	progress: function(status) {
		var percentage;
		if(status.total == 0) {
			percentage = 100;
		} else {
			percentage = Math.round(status.loaded / status.total * 100);
		}
		
		jLoad._loaderTextBox.innerHTML = jLoad._loaderText + ' (' + percentage + '%)';
	},
	
	_load: function(loadImageURL, loadImageCaption, loadImageLinkURL, text) {		
		jLoad._loader = document.createElement('div');
		jLoad._loader.style.position = 'absolute';
		jLoad._loader.style.visibility = 'hidden';
		jLoad._loader.style.width = '80px';
		
		jLoad._loaderCounter = 0;
		jLoad._imgLoaded = false;
		jLoad.hideLoader();
		jLoad._loaderText = text;
		
		var linkEl = document.createElement('a');
		linkEl.setAttribute('href', loadImageLinkURL);
		linkEl.setAttribute('target', '_blank');
		
		var imgEl = document.createElement('img');
		imgEl.style.width = '80px';
		imgEl.style.height = '80px';
		imgEl.style.display = 'block';
		imgEl.style.marginRight = 'auto';
		imgEl.style.marginLeft = 'auto';
		imgEl.setAttribute('src', loadImageURL);
		imgEl.setAttribute('alt', loadImageCaption);
		imgEl.setAttribute('border', '0px');
		
		jLoad._loaderTextBox = document.createElement('div');
		jLoad._loaderTextBox.style.whiteSpace = 'nowrap';
		jLoad._loaderTextBox.style.marginTop = '4px';
		jLoad._loaderTextBox.style.fontFamily = 'Arial';
		jLoad._loaderTextBox.style.fontSize = '12px';
		jLoad._loaderTextBox.style.color = '#666';
		
		jLoad.progress({loaded: 0, total: 1});
		
		linkEl.appendChild(imgEl);
		
		jLoad._loader.appendChild(linkEl);
		jLoad._loader.appendChild(jLoad._loaderTextBox);
		
		var showLoader = function() {
			document.body.appendChild(jLoad._loader);
			
			var loadWidth = jLoad._loader.offsetWidth;
			var loadHeight = jLoad._loader.offsetHeight;
			
			jLoad._loader.style.left = '50%';
			jLoad._loader.style.top = '50%';
			jLoad._loader.style.marginLeft = -loadWidth / 2 + 'px';
			jLoad._loader.style.marginTop = -loadHeight / 2 + 'px';
			
			jLoad._alpha = 0;
			jLoad._setOpacity(jLoad._loader, jLoad._alpha);
			
			jLoad._loader.style.visibility = 'visible';
			
			if(NCOMBO_IS_FRESH) {
				$loader.progress(jLoad.progress);
				jLoad._fadeInterval = setInterval(function() {
					if(jLoad._alpha < 100) {
						jLoad._alpha += jLoad._fadeSpeed;
					} else {
						jLoad._alpha = 100;
						clearInterval(jLoad._fadeInterval);
					}
					if(jLoad._loader) {
						jLoad._setOpacity(jLoad._loader, jLoad._alpha);
					} else {
						clearInterval(jLoad._fadeInterval);
					}
				}, 25);
			}
		}
		
		var img = new Image();
		img.onload = showLoader;
		img.src = loadImageURL;
		
		$loader.loadAll();
		$loader.on('loadall', jLoad._loaded);
	},
	
	_setOpacity: function(obj, value) {
		obj.style.opacity = value / 100;
		obj.style.filter = 'alpha(opacity=' + value + ')';
	},
	
	_loaded: function() {
		$loader.off('progress', jLoad.progress);
		jLoad.fadeOutLoader($loader.finish);
	},
	
	hideLoader: function() {
		if(document.body && jLoad._loader && jLoad._loader.parentNode == document.body) {
			document.body.removeChild(jLoad._loader);
			jLoad._loader = null;
		}
	},
	
	fadeOutLoader: function(callback) {	
		clearInterval(jLoad._fadeInterval);
		jLoad._fadeInterval = setInterval(function() {
			if(jLoad._alpha > 0) {
				jLoad._alpha -= jLoad._fadeSpeed;
			} else {
				jLoad._alpha = 0;
				jLoad.hideLoader();
			}
			if(jLoad._loader) {
				jLoad._setOpacity(jLoad._loader, jLoad._alpha);
			} else {
				clearInterval(jLoad._fadeInterval);
				callback();
			}
		}, 25);
	},
	
	getWindowWidth: function() {
		if(jLoad._ie) {
			return document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
		} else {
			return window.innerWidth;
		}
	},
	
	getWindowHeight: function() {
		if(jLoad._ie) {
			return document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
		} else {
			return window.innerHeight;
		}
	}
};

$loader.ready(jLoad.start);