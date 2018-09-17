var request = require('request');
var crypto = require('crypto');
var querystring = require('querystring');

exports.generateUUID=function(length) {
	var id = '',
		length = length || 32;
	while (length--)
		id += (Math.random() * 16 | 0) % 2 ? (Math.random() * 16 | 0).toString(16) : (Math.random() * 16 | 0).toString(16).toUpperCase();
	return id.toLowerCase();
}

exports.parseJSON=function(jsonString) {
	if (!jsonString)
		return {};

	var json;
	try {
		json = JSON.parse(jsonString);
	} catch (err) {
		console.error('parseJSON ERROR: ' + jsonString, err);
		console.log(err.stack)
	}

	return json ? json : {};
}

exports.getNumByChar=function(str, length) {
	var result = '';
	str = str.toLowerCase();
	for (var i = 0; i < length; i++) {
		if (str[i])
			result += ('000000000' + (str[i].charCodeAt() - 96)).slice(-2);
		else
			result += ('000000000'.slice(-2));
	}
	return result;
}

exports.getYYMMDD=function(date) {
	if (!date)
		date = new Date();

	return ('0' + date.getFullYear()).slice(-2)
		+ ('0' + (date.getMonth() + 1)).slice(-2)
		+ ('0' + date.getDate()).slice(-2);
}

exports.getYYYYMMDD=function(date) {
	if (!date)
		date = new Date();

	return date.getFullYear()
		+ ('0' + (date.getMonth() + 1)).slice(-2)
		+ ('0' + date.getDate()).slice(-2);
}

exports.formatDate=function(timestamp, format){
	if(!timestamp)
		return '';

	var date = new Date(timestamp);

	if(format)
	{
		return date.getFullYear()+ format
				+ ('0' + (date.getMonth() + 1)).slice(-2)+ format
				+ ('0' + date.getDate()).slice(-2);
	}else
	{
		return date.getFullYear()+ '-'
		+ ('0' + (date.getMonth() + 1)).slice(-2)+ '-'
		+ ('0' + date.getDate()).slice(-2);
	}
}

exports.formatFullDate=function(timestamp){
	if(!timestamp)
		return '';

	var date = new Date(timestamp);

	return date.getFullYear()+ '-'
		+ ('0' + (date.getMonth() + 1)).slice(-2)+ '-'
		+ ('0' + date.getDate()).slice(-2) + ' '
		+ ('0' + date.getHours()).slice(-2)+ ':'
		+ ('0' + date.getMinutes()).slice(-2)+ ':'
		+ ('0' + date.getSeconds()).slice(-2);
}

exports.getFixedInt=function(int, length) {
	return ('000000000000000' + int).slice(-length);
}

exports.getFixedRandomInt=function(length) {
	return ('000000000000000' + Math.random() * Math.pow(10, length)).slice(-length);
}

function getMd5(str){
	var result = "";
	try {
		if (str && typeof str === "string") {
			var md5_str = crypto.createHash('md5');
			result = md5_str.update(str).digest('hex');
		}
		else
			result = "";

	} catch (err) {
		return result;
	}

	return result;
}
exports.getMd5 = getMd5;

//函数功能：json 排序  
// filed:(string)排序字段，  
// reverse: (bool) 是否倒置(是，为倒序)  
// primer (parse)转换类型  
//示例:list.sort(tool.sortJSONArry('downloadTimes',true,parseInt));
exports.sortJSONArry = function (filed, reverse, primer) {
	reverse = (reverse) ? -1 : 1;  
	  
	return function (a, b) {  
		a = a[filed];  
		b = b[filed];  
		  
		if (typeof (primer) != "undefined") {  
			a = primer(a);  
			b = primer(b);  
		}  
		  
		if (a < b) {  
			return reverse * -1;  
		}  
		if (a > b) {  
			return reverse * 1;  
		}  
	}  
}

exports.toUnicode=function(str) {
    var res=[];
    for(var i=0;i < str.length;i++)
        res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u"+res.join("\\u");
}

exports.deUnicode=function(str) {
    str=str.replace(/\\/g,"%");
    return unescape(str);
}

exports.addDays=function(date,days){
	var nd = new Date(date);
	   nd = nd.valueOf();
	   nd = nd + days * 24 * 60 * 60 * 1000;
	   nd = new Date(nd);

	return nd;
}

//将yyyy-MM-dd格式时间，软件换为支持Date.parse方法的yyyy/mm/dd格式时间
exports.convertDateParserString=function(timeString){	
    var regEx = new RegExp("\\-","gi");
     return timeString.replace(regEx,"/");
}

exports.trimRight=function(s){
    if(s == null) return "";
    var whitespace = new String(" \t\n\r");
    var str = new String(s);
    if (whitespace.indexOf(str.charAt(str.length-1)) != -1){
        var i = str.length - 1;
        while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1){
            i--;
        }
        str = str.substring(0, i+1);
    }
    return str;
}

exports.trimLeft=function(s){
    if(s == null) {
        return "";
    }
    var whitespace = new String(" \t\n\r");
    var str = new String(s);
    if (whitespace.indexOf(str.charAt(0)) != -1) {
        var j=0, i = str.length;
        while (j < i && whitespace.indexOf(str.charAt(j)) != -1){
            j++;
        }
        str = str.substring(j, i);
    }
    return str;
}

exports.trim=function(s){
    return trimRight(trimLeft(s));
}

exports.decodeHtml=function(val) {
	return val.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}
exports.encrypt=encrypt;

function decrypt(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
exports.decrypt=decrypt;

/**
 * 生成随机字符串
 * @param {Number} length 字符串长度
 * @param {Number} flag 0.数字+字符+大写 1.数字 2.小写字符 3.大写
 */
exports.makeRandomStr=function(length, flag) {
    var str = '0123456789abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWSYZ';
    var min = 0;
    var max = 61;
    if (flag === 1) {
        max = 9;
    } else if (flag === 2) {
        min = 10;
        max = 35;
    } else if (flag === 3) {
        min = 36;
    }
    var backStr = '';
    for(var i=0;i<length;i++) {
        var idx = parseInt(Math.random()*(max-min)+min);
        backStr += str[idx];
    }
    return backStr;
};

/**
 * queryString签名
 * @queryStr {string} queryString
 * @secretKey {string} 签名用secretKey
 * @secretKey {Boolean} 是否倒序
 */
exports.sign = function(queryStr, secretKey, direction){
    var queryStrObj = querystring.parse(queryStr);
    if(queryStrObj.sign)
        delete queryStrObj.sign;

    var signString = querystring.stringify(queryStrObj).split('&').sort();
    if(direction) {
    	signString.reverse();
    }
    signString.join('&');
    return  getMd5(signString+secretKey).toLowerCase();
}

/**
 * base64编码
 */
exports.base64Encode = function(str) {
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var out, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	out = "";
	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4)
					| ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt((c2 & 0xF) << 2);
			out += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		out += base64EncodeChars.charAt(c3 & 0x3F);
	}
	return out;
}

/**
 * base64解码
 */
exports.base64Decode = function (str) {//base64\u89e3\u5bc6
    var base64DecodeChars = new Array(
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
            -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c1 == -1);
        if (c1 == -1) break;
        do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)  return out;
                c3 = base64DecodeChars[c3];
        } while(i < len && c3 == -1);
        if(c3 == -1) break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        do {
                c4 = str.charCodeAt(i++) & 0xff;
                if(c4 == 61) return out;
                c4 = base64DecodeChars[c4];
        } while(i < len && c4 == -1);
        if(c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

// 计算两个经纬度之间的距离
exports.getDistance = function(lat1, lng1, lat2, lng2)
// function getDistance(lat1, lng1, lat2, lng2)
{
	var EARTH_RADIUS = 6378.137;
	var radLat1 = lat1 * Math.PI / 180.0;
	var radLat2 = lat2 * Math.PI / 180.0;
   	var latDistance = radLat1 - radLat2;
   	var lngDistance = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);

   	// 反正弦+余弦
   	var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDistance/2), 2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(lngDistance/2), 2)));
    distance = distance * EARTH_RADIUS;
   	distance = Math.round(distance * 10000) / 10000;
   	return distance;
}

// console.log(getDistance(39.54, 116.23, 38.85, 115.48))

/* 获取指定坐标点的距离范围值
* 返回值 {maxLat:199, minLat:223, maxLng:234, minLng:34}
*/
exports.getDistanceRange = function(lat, lng, distance) {
	var range = 180/Math.PI*distance/6372.797; // 6372.797 为地球半径
	// 经度范围
	var longR =  range / Math.cos(lat * Math.PI / 180); 
	var maxLat = lat+range;
	var minLat = lat-range;
	var maxLng = lng+longR;
	var minLng = lng-longR;
	return {maxLat:maxLat, minLat:minLat, maxLng:maxLng, minLng:minLng};
}

// 获取用户头像的Url
exports.getUserAvatar = function(url) {
	if(url&&url.indexOf('http')>-1){
		return url;
	} else {
		return 'http://'+config.upload.fileHost+(url||'/img/mystery.jpg');
	}
}

// 获取图片的Url
exports.getImageUrl = function(url) {
	if(url&&url.indexOf('http')>-1){
		return url;
	} else {
		return 'http://'+config.upload.fileHost+(url||'/img/mystery.jpg');
	}
}

exports.getIP = function(req) {
  var ip = req.headers['x-real-ip']||req.headers['x-forwarded-for']||req.ip;
  if(ip.indexOf('::1')!==-1){
  	ip = '127.0.0.1';
  }
  return ip;
}

exports.normalize = (score, normalize) => {
  var score = (!isNaN(score)&&score>0)?score:0
  var normalize = (!isNaN(normalize)&&normalize>0)?normalize:0
  return parseFloat((score*normalize).toFixed('1'));
}
