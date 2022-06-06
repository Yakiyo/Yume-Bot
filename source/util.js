const turndownService = require('turndown');
const turndown = new turndownService;
// converts the span element spoilers (for anilist) to discord spoiler markdown
turndown.addRule('spoiler', {
	filter: ['span'],
	replacement: function(text) {
		return `|| ${text} ||`;
	},
});
const util = {
    shorten(string, num = 1000) {
            if (typeof string !== 'string') return undefined;

            const str = turndown.turndown(string);
            if (str.length > num) {
                return str.substring(0, num + 1) + '...';
            } else {
                return str;
            }
    },
    casify(string) {
        if (typeof string == 'string') {
            const space = string.split(/_/g);
            return space.map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
        } else {
            return 'null';
        }
    },
};

module.exports = util;