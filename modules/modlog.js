const { modlogs } = require('../config.json');


module.exports = async (obj, msg) => {
					const channel = await msg.guild.channels.fetch(`${modlogs}`)
						.then(chan => chan)
						.catch(error => {
							console.log(error);
							return msg.channel.send('Error fetching modlogs channel');
						});
					return channel.send({ embeds: [obj] }).catch(error => {
						return msg.channel.send('Could not log to modlogs');
					})
				}
