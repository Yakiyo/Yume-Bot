const { guildId } = require('../config.json');
const { time } = require('@discordjs/builders');
const { version } = require('../../package.json');
const staffBot = '844253443510239262';

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		// Fetch guild members on ready
		client.guilds.fetch(guildId).then(guild => {
			guild.members.fetch();
		});
		if (process.env.NODE_ENV === 'production') {
			client.channels.cache.get(staffBot)
				.send(`${client.user.username} on!\nReady at ${time(client.readyAt)}\nGuilds: ${client.guilds.cache.size}, Channels: ${client.channels.cache.size}, Version: ${version}`);
		} else {
			console.log(`Ready and logged in as ${client.user.tag}`);
		}
	},
};