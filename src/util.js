const { modlogs } = require('./config.json').channels;
const turndownService = require('turndown');
const turndown = new turndownService;
// converts the span element spoilers (for anilist) to discord spoiler markdown
turndown.addRule('spoiler', {
    filter: ['span'],
    replacement: function (text) {
        return `|| ${text} ||`;
    },
});
/**
 * Utility class with some functions for making life easier
 */
class Util {
    /**
     * Shortens a string upto provided length
     * @param {string} string the string to shorten
     * @param {number} num length upto which to shorten
     * @returns string
     */
    shorten(string, num = 1000) {
        if (typeof string !== 'string') return undefined;

        const str = turndown.turndown(string);
        if (str.length > num) {
            return str.substring(0, num + 1) + '...';
        } else {
            return str;
        }
    }
    /**
     * Coverts the first character of the string to uppercase and the rest to lowercase
     * @param {string} string the string to casify
     * @returns string
     */
    casify(string) {
        if (typeof string == 'string') {
            const space = string.split(/_/g);
            return space.map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
        } else {
            return 'null';
        }
    }
    /**
     * Sends an embed to the modlogs channel
     * @param {Client} client
     * @param {MessageEmbed} embed
     * @returns Message
     */
    async modlog(client, embed) {
        const channel = await client.channels.fetch(modlogs).catch(() => null);
        if (!channel) {
            console.log('Could not fetch modlogs channel.');
            return null;
        }
        return await channel.send({ embeds: [embed] }).catch((error) => console.log(error));
    }
}

module.exports = new Util();