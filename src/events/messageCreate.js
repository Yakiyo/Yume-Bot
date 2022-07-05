const { MessageActionRow, MessageButton } = require('discord.js');
const { channels, owners, prefix } = require('../config.json');
const { time } = require('@discordjs/builders');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		if (message.author.bot) return;

		if (message.channel.type === 'DM') {
			if (channels.modmail === 'Disabled') return;
			if (message.content.startsWith('!')) return;
			const modmailChannel = await client.channels.fetch(channels.modmail).then(chan => chan).catch(() => null);

			if (!modmailChannel) return message.reply('Internal error when fetching modmail channel. Modmail channel not set or invalid argument provided. Please report this issue to the staff!');
			const embed = {
				title: 'Confirmation',
				color: '#e91e63',
				description: 'Are you sure you want to send this message to the staff\'s in **Tsurekano** (ID: 844103224528076801)?\nReact to the buttons to proceed or cancel ',
				footer: {
					text: 'Tip: Messages in dms starting with ! are ignored.',
				},
			};
			const row = new MessageActionRow()
				.addComponents(new MessageButton()
					.setLabel('Proceed')
					.setStyle('PRIMARY')
					.setCustomId('mail_yes')
					.setEmoji('946452985368690749'))
				.addComponents(new MessageButton()
					.setLabel('Cancel')
					.setStyle('DANGER')
					.setCustomId('mail_no')
					.setEmoji('946453057053544449'));
			const responded = await message.channel.send({ embeds: [embed], components: [row] }).then(sent => sent);
			const collector = responded.createMessageComponentCollector({ componentType: 'BUTTON', time: 10 * 1000, max: 1 });

			collector.on('collect', async button => {
				if (button.customId === 'mail_yes') {
					await responded.edit({ embeds: [{ title: 'Sending message <a:loading:962047754543181975>', color: '#e91e63' }], components: [] });
					const mailEmbed = {
						color: '#e91e63',
						title: 'New Modmail',
						author: {
							name: `${message.author.tag}`,
							icon_url: `${message.author.displayAvatarURL()}`,
						},
						description: `${message.content}`,
						fields: [
							{
								name: 'User Info',
								value: `**Name**: ${message.author.tag}\n**Created at**: ${time(message.author.createdTimestamp)}\n**Sent on:** ${time(message.createdTimestamp)}`,
							},
						],
						image: {},
						footer: {
							text: `Author id: ${message.author.id}`,
						},
					};
					if (message.attachments.size) {
						const picFile = message.attachments.first();
						if (/image\/*/.test(picFile.contentType)) {
							mailEmbed.image.url = picFile.url;
						}
					}
					await modmailChannel.send({ embeds: [mailEmbed] }).then(() => {
						responded.edit({ embeds: [{ title: 'Modmail sent.', color: '#e91e63' }] });
					});
				} else if (button.customId === 'mail_no') {
					await responded.edit({ embeds: [{ title: 'Process cancelled', color: '#e91e63' }], components: [] });
				}
			});

			collector.on('end', collected => {
				if (collected.size === 0) {
					responded.edit({ embeds: [{ title: 'Time ended. Interaction cancelled', color: '#e91e63' }], components: [] });
				}
			});
			return;
		} else if (message.guild) {
			if (message.content.startsWith(prefix) && owners.includes(message.author.id)) {
				const args = message.content.slice(prefix.length).split(/ +/);
				const commandName = args.shift().toLowerCase();
				if (client.textCommands.has(commandName)) {
					const command = client.textCommands.get(commandName);
					if (command.args && !args.length) {
						return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
					}
					try {
						command.execute(message, args);
					} catch (error) {
						console.error(error);
						message.reply('there was an error trying to execute that command!');
					}
				}

			}
		}
	},
};