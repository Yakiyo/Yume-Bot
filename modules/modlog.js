const { modlogs } = require('../config.json');

module.exports = async (obj, msg) => {
	const channel = await msg.guild.channels.fetch(`${modlogs}`)
						.then(fetched => fetched)
						.catch(error => {
							console.log(error);
							return msg.channel.send('error fetching modlogs channel');
						});
	await channel.send({ embeds: [obj] })
				.then(() => {
					return;
				})
				.catch(error => {
					console.log(error);
					return msg.channel.send('Could not log to modlogs');
				});
};