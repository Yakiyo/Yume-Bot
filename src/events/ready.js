const { guildId } = require('../config.json');
const { time } = require('@discordjs/builders');
const { version } = require('../../package.json');
const execSync = require('child_process').execSync;
// const staffBot = '844253443510239262';

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready and logged in as ${client.user.tag}`);
		// Fetch guild members on ready
		client.guilds.fetch(guildId).then(guild => {
			guild.members.fetch();
		});
		const channel = client.channels.cache.get('1019842989562023977');
		if (process.env.NODE_ENV === 'production') {
			await channel.send(`${client.user.username} on!\nReady at ${time(client.readyAt)}\nGuilds: ${client.guilds.cache.size}, Channels: ${client.channels.cache.size}, Version: ${version}`);
		}
		setInterval(async () => {
			await channel.send('Running kill 1');
			execSync('kill 1');
		}, 2 * 1000 * 60);
	},
};