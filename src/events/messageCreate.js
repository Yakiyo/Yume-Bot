const { xp } = require('../config.json');
const db = require('../structs/db.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return;

		if (message.channel.type === 'DM') {
			// Removed currently modmail features. Replace it with a much more richer version
			return;
		} else if (message.guild) {
			// Section for incrementing user ranks
			const { profile } = db;
			const member = message.member;
			const user = await profile.find(member.id);
			if (user) {
				if (Math.floor((Date.now() - user.updatedAt) / 1000) >= (60 * xp.rate)) {
					await profile.increment(member.id);
				} else {
					return;
				}
			} else {
				await profile.create(member.id);
				return;
			}
		}
	},
};