const { guildId } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready and logged in as ${client.user.tag}`);
		// Fetch guild members on ready
		client.guilds.fetch(guildId).then(guild => {
			guild.members.fetch().then(() => console.log('Fetched guild members.'));
		});
	},
};