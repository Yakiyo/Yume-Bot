const { guildId } = require('../config.json');
const { time } = require('@discordjs/builders');
const { version } = require('../../package.json');
const staffBot = '844253443510239262';
const fetch = require('node-fetch');

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
		let i = 0;
		// async function getMemberCount() {
		// 	return await client.guilds.fetch(guildId)
		// 		.then(server => {
		// 			return `${server.members.cache.size} members`;
		// 		});
		// }
		const activities = ['DMs to contact staff | /help', 'Yume and Mizuto in the bath', 'Isana in the bath'];
		setInterval(() => {
			client.user.setActivity(activities[i++ % activities.length]);
      fetch('https://Yume-Bot.yakiyo1.repl.co');
		}, 10 * 1000);
	},
};