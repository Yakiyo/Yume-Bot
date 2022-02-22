const turndownService = require('turndown');
const turndown = new turndownService;

turndown.addRule('spoiler', {
	filter: ['span'],
	replacement: function(text) {
		return `|| ${text} ||`;
	}
})

function shorten(string) {
	let str = turndown.turndown(string);
	if (str.length > 1000) {
		return str.substring(0, 1001) + '...';
	} else {
		return str;
	}
}

module.exports = shorten;