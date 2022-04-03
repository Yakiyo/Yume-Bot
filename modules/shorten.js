const turndownService = require('turndown');
const turndown = new turndownService;

turndown.addRule('spoiler', {
	filter: ['span'],
	replacement: function(text) {
		return `|| ${text} ||`;
	},
});

function shorten(string, num = 1000) {
	const str = turndown.turndown(string);
	if (str.length > num) {
		return str.substring(0, num + 1) + '...';
	} else {
		return str;
	}
}

module.exports = shorten;