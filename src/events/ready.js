module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready and logged in as ${client.user.tag}`);
	},
};