//Event file for when the bot goes online for the first time
const { version } = require('../package.json');
const { time } = require('@discordjs/builders');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		
		client.user.setActivity(`Mizuto in the bath`, { type: 'WATCHING' });
		client.user.setStatus('online');
		console.log(`Logged in as ${client.user.tag}`);
		client.channels.cache.get('844253443510239262').send(`Yume Bot on! <:corporalmizuto:845137729729462302>.\nReady at ${time(client.readyAt)}\nGuilds: ${client.guilds.cache.size}, Channels: ${client.channels.cache.size}, Version: ${version}`);
	},
};