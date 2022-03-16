const shorten = require('../modules/shorten.js');
module.exports = {
	name: 'error',
	once: true,
	async execute(error, client) {
		const errChan = await client.channels.cache.get('844253443510239262').then(chan => chan);

		const errEmb = {
			title: "Error Occurred during code execution",
			color: 13238272,
			description: `\`\`\`${shorten(error)}\`\`\` `,
			url: 'https://dashboard.heroku.com/apps/yume-bot-discord/logs'
		}
	},
};