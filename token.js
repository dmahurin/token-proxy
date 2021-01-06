var magic1 = 0x5f698186;
var magic2 = 0x2187374d;

var fs = require("fs");

var token_dir =  (process.env.HOME === undefined || process.env.HOME === "/root" || process.env.HOME === "/" ) ? "/var/lib/token-proxy" : process.env.HOME + '/.tokens';
if (!fs.existsSync(token_dir)) fs.mkdirSync(token_dir);

function encode(n) {
	var r = Math.random() * 0xffff >>> 0;
	n = (r << 16 ) | ((n + r) & 0xffff);
	return ((n + magic1) ^ magic2) >>> 0;
}

function decode(n) {
	n = (((n ^ magic2) - magic1) >>> 0);
	var r = (n >> 16 ) & 0xffff;
	n = ((n & 0xffff) - r) & 0xffff;

	if(n % 15 != 0 || n > 720) return 0;
	return n;
}

function redeem(token) {
	var n = exports.decode(token);
	if(!n) return NaN;

	if(token > 0 && fs.existsSync(token_dir + '/' + token.toString())) {
		return 0;
	} else {
		if(token > 0) fs.closeSync(fs.openSync(token_dir + '/' + token.toString(), 'w'));
		return n * 60;
	}
}

module.exports.encode = encode;
module.exports.decode = decode;
module.exports.redeem = redeem;
