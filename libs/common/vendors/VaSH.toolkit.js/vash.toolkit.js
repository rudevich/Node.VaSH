/*!
 * vash.toolkit.js - Javascript tools for generic and useful usage
 * http://github.com/G33kLabs/vash.toolkit.js
 */

/*global define: false*/

(function (exports) {
	if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
		module.exports = exports; // CommonJS
	} else {
		window.tools = exports; // <script>
	}
}(function () {
  	var exports = {};

  	// -- Return random from 0 -> N
  	exports.rand = function(max) {
  		return Math.floor(Math.random()*(max+1)) ; 
  	}

  	// -- Hash navigation
  	exports.getLocationHash = function () {
		return window.location.hash.substring(1);
	}

	// -- UpperCase words
	exports.ucwords = function(str) {
	    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
	        return $1.toUpperCase();
	    });
	} ;

	// -- Upper case first char
	exports.ucfirst = function (str) {
	    str += '';
	    var f = str.charAt(0).toUpperCase();
	    return f + str.substr(1);
	}

	// -- Trim a string
	exports.trim = function(str) {
		return (str||'').replace(/^\s+|\s+$/g,"").toString();
	}

	// -- Return filename extension
	exports.extension = function(fileName) {
	    return (fileName.substr(fileName.lastIndexOf('.') + 1)).toLowerCase();
	} ;

	// -- Convert
	exports.convertToKBytes = function(number) {
		return (number / 1024).toFixed(1);
	}	

	// -- Return seconds with duration like 00:00:00 or 00:00
	exports.formatDuration = function(duration) {
	    duration = (duration||'').split(':') ;
	    var seconds = 0 ; 
	    if ( duration.length == 3 ) seconds += parseInt(duration.shift())*3600;
	    seconds += parseInt(duration.shift())*60;
	    seconds += parseInt(duration.shift());
	    return seconds;
	}	

	// -- Format time
	exports.formatTime = function(ms) {
	    var secs = ms/1000 ;
	    var hr = Math.floor(secs / 3600);
	    var min = Math.floor((secs - (hr * 3600))/60);
	    var sec = Math.floor(secs - (hr * 3600) - (min * 60));
	    
	    if (hr < 10) hr = "0" + hr;
	    if (min < 10) min = "0" + min;
	    if (sec < 10) sec = "0" + sec;
	    if (hr) hr = "00";
	    return (hr > 0 ? hr + ':' : '') + min + ':' + sec;
	}

	// -- Compare sizes
	exports.compareWidthHeight = function(width, height) {
		var diff = [];
		if(width > height) {
			diff[0] = width - height;
			diff[1] = 0;
		} else {
			diff[0] = 0;
			diff[1] = height - width;
		}
		return diff;
	}

	// -> Humanize an ID formated as Camel String to an uppercased and spaced string
	exports.humanizeCamel = function(str) {
		return (str + "").replace(/[A-Z]/g, function(match) {
        	return " " + match.toUpperCase();
   		});
	} 

	// -- Number Format
	exports.number_format = function(number, decimals, dec_point, thousands_sep) {
	    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	    var n = !isFinite(+number) ? 0 : +number,
	        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	        s = '',
	        toFixedFix = function (n, prec) {
	            var k = Math.pow(10, prec);
	            return '' + Math.round(n * k) / k;
	        };
	    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	    if (s[0].length > 3) {
	        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	    }
	    if ((s[1] || '').length < prec) {
	        s[1] = s[1] || '';
	        s[1] += new Array(prec - s[1].length + 1).join('0');
	    }
	    return s.join(dec);
	}
	
	// -- Check email
	exports.validateEmail = function(email){
        return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email);
	}

	// -- Detect mobile devices
	exports.isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i) ? true : false;
	    },
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i) ? true : false;
	    },
	    any: function() {
	        return (exports.isMobile.Android() || exports.isMobile.BlackBerry() || exports.isMobile.iOS() || exports.isMobile.Windows());
	    }
	};

	//returns a function that calculates lanczos weight
	exports.lanczosCreate = function(lobes){
	  return function(x){
	    if (x > lobes) 
	      return 0;
	    x *= Math.PI;
	    if (Math.abs(x) < 1e-16) 
	      return 1
	    var xx = x / lobes;
	    return Math.sin(x) * Math.sin(xx) / x / xx;
	  }
	}

	//elem: canvas element, img: image element, sx: scaled width, lobes: kernel radius
	exports.thumbnailer = function(elem, img, sx, lobes){ 
	    this.canvas = elem;
	    elem.width = img.width;
	    elem.height = img.height;
	    elem.style.display = "none";
	    this.ctx = elem.getContext("2d");
	    this.ctx.drawImage(img, 0, 0);
	    this.img = img;
	    this.src = this.ctx.getImageData(0, 0, img.width, img.height);
	    this.dest = {
	        width: sx,
	        height: Math.round(img.height * sx / img.width),
	    };
	    this.dest.data = new Array(this.dest.width * this.dest.height * 3);
	    this.lanczos = exports.lanczosCreate(lobes);
	    this.ratio = img.width / sx;
	    this.rcp_ratio = 2 / this.ratio;
	    this.range2 = Math.ceil(this.ratio * lobes / 2);
	    this.cacheLanc = {};
	    this.center = {};
	    this.icenter = {};
	    setTimeout(this.process1, 0, this, 0);
	}

	exports.thumbnailer.prototype.process1 = function(self, u){
	    self.center.x = (u + 0.5) * self.ratio;
	    self.icenter.x = Math.floor(self.center.x);
	    for (var v = 0; v < self.dest.height; v++) {
	        self.center.y = (v + 0.5) * self.ratio;
	        self.icenter.y = Math.floor(self.center.y);
	        var a, r, g, b;
	        a = r = g = b = 0;
	        for (var i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
	            if (i < 0 || i >= self.src.width) 
	                continue;
	            var f_x = Math.floor(1000 * Math.abs(i - self.center.x));
	            if (!self.cacheLanc[f_x]) 
	                self.cacheLanc[f_x] = {};
	            for (var j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
	                if (j < 0 || j >= self.src.height) 
	                    continue;
	                var f_y = Math.floor(1000 * Math.abs(j - self.center.y));
	                if (self.cacheLanc[f_x][f_y] == undefined) 
	                    self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2) + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
	                weight = self.cacheLanc[f_x][f_y];
	                if (weight > 0) {
	                    var idx = (j * self.src.width + i) * 4;
	                    a += weight;
	                    r += weight * self.src.data[idx];
	                    g += weight * self.src.data[idx + 1];
	                    b += weight * self.src.data[idx + 2];
	                }
	            }
	        }
	        var idx = (v * self.dest.width + u) * 3;
	        self.dest.data[idx] = r / a;
	        self.dest.data[idx + 1] = g / a;
	        self.dest.data[idx + 2] = b / a;
	    }

	    if (++u < self.dest.width) 
	        setTimeout(self.process1, 0, self, u);
	    else 
	        setTimeout(self.process2, 0, self);
	};
	exports.thumbnailer.prototype.process2 = function(self){
	    self.canvas.width = self.dest.width;
	    self.canvas.height = self.dest.height;
	    self.ctx.drawImage(self.img, 0, 0);
	    self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
	    var idx, idx2;
	    for (var i = 0; i < self.dest.width; i++) {
	        for (var j = 0; j < self.dest.height; j++) {
	            idx = (j * self.dest.width + i) * 3;
	            idx2 = (j * self.dest.width + i) * 4;
	            self.src.data[idx2] = self.dest.data[idx];
	            self.src.data[idx2 + 1] = self.dest.data[idx + 1];
	            self.src.data[idx2 + 2] = self.dest.data[idx + 2];
	        }
	    }
	    self.ctx.putImageData(self.src, 0, 0);
	    self.canvas.style.display = "block";
	}

	// -- PHPJS : base64 encode & decode
	exports.base64_encode = function(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,enc="",tmp_arr=[];if(!data){return data;}
	data=exports.utf8_encode(data+'');do{o1=data.charCodeAt(i++);o2=data.charCodeAt(i++);o3=data.charCodeAt(i++);bits=o1<<16|o2<<8|o3;h1=bits>>18&0x3f;h2=bits>>12&0x3f;h3=bits>>6&0x3f;h4=bits&0x3f;tmp_arr[ac++]=b64.charAt(h1)+b64.charAt(h2)+b64.charAt(h3)+b64.charAt(h4);}while(i<data.length);enc=tmp_arr.join('');switch(data.length%3){case 1:enc=enc.slice(0,-2)+'==';break;case 2:enc=enc.slice(0,-1)+'=';break;}
	return enc;}

	exports.base64_decode = function(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,dec="",tmp_arr=[];if(!data){return data;}
	data+='';do{h1=b64.indexOf(data.charAt(i++));h2=b64.indexOf(data.charAt(i++));h3=b64.indexOf(data.charAt(i++));h4=b64.indexOf(data.charAt(i++));bits=h1<<18|h2<<12|h3<<6|h4;o1=bits>>16&0xff;o2=bits>>8&0xff;o3=bits&0xff;if(h3==64){tmp_arr[ac++]=String.fromCharCode(o1);}else if(h4==64){tmp_arr[ac++]=String.fromCharCode(o1,o2);}else{tmp_arr[ac++]=String.fromCharCode(o1,o2,o3);}}while(i<data.length);dec=tmp_arr.join('');dec=exports.utf8_decode(dec);return dec;}

	exports.utf8_decode = function(str_data){var tmp_arr=[],i=0,ac=0,c1=0,c2=0,c3=0;str_data+='';while(i<str_data.length){c1=str_data.charCodeAt(i);if(c1<128){tmp_arr[ac++]=String.fromCharCode(c1);i++;}else if((c1>191)&&(c1<224)){c2=str_data.charCodeAt(i+1);tmp_arr[ac++]=String.fromCharCode(((c1&31)<<6)|(c2&63));i+=2;}else{c2=str_data.charCodeAt(i+1);c3=str_data.charCodeAt(i+2);tmp_arr[ac++]=String.fromCharCode(((c1&15)<<12)|((c2&63)<<6)|(c3&63));i+=3;}}
	return tmp_arr.join('');}
	exports.utf8_encode = function(string){string=(string+'').replace(/\r\n/g,"\n").replace(/\r/g,"\n");var utftext="";var start,end;var stringl=0;start=end=0;stringl=string.length;for(var n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++;}else if((c1>127)&&(c1<2048)){enc=String.fromCharCode((c1>>6)|192)+String.fromCharCode((c1&63)|128);}else{enc=String.fromCharCode((c1>>12)|224)+String.fromCharCode(((c1>>6)&63)|128)+String.fromCharCode((c1&63)|128);}
	if(enc!=null){if(end>start){utftext+=string.substring(start,end);}
	utftext+=enc;start=end=n+1;}}
	if(end>start){utftext+=string.substring(start,string.length);}
	return utftext;}

	// -- MD5
	exports.md5 = function (string) {
	 
		function RotateLeft(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}
	 
		function AddUnsigned(lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
	 	}
	 
	 	function F(x,y,z) { return (x & y) | ((~x) & z); }
	 	function G(x,y,z) { return (x & z) | (y & (~z)); }
	 	function H(x,y,z) { return (x ^ y ^ z); }
		function I(x,y,z) { return (y ^ (x | (~z))); }
	 
		function FF(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};
	 
		function GG(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};
	 
		function HH(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};
	 
		function II(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};
	 
		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		};
	 
		function WordToHex(lValue) {
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		};
	 
		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
	 
			for (var n = 0; n < string.length; n++) {
	 
				var c = string.charCodeAt(n);
	 
				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
	 
			}
	 
			return utftext;
		};
	 
		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;
	 
		string = Utf8Encode(string);
	 
		x = ConvertToWordArray(string);
	 
		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	 
		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}
	 
		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
	 
		return temp.toLowerCase();
	}

  	return exports;
}()));