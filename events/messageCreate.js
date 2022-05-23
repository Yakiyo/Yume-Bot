/* eslint-disable no-inline-comments */
const { MessageActionRow, MessageButton } = require('discord.js');
const { time } = require('@discordjs/builders');
const { prefix } = require('../config.json');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		if (message.author.bot) return;
		if (message.channel.type === 'DM') {
			if (message.content.startsWith(prefix)) return;
			const channel = await client.channels.fetch('962044593342402650').then(fetched => fetched).catch(error => {
				console.log(error);
				return message.channel.send('Error. Could not fetch modmail channel');
			});
			const embed = {
				title: 'Confirmation',
				color: '#e91e63',
				description: 'Are you sure you want to send this message to the staff\'s in **Tsurekano** (ID: 844103224528076801)?\nReact to the buttons to proceed or cancel ',
				footer: {
					text: `Tip: Messages in dms starting with the bot prefix (${prefix})are ignored.`,
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

			const botMessage = await message.channel.send({ embeds: [embed], components: [row] }).then(sent => sent);
			const collector = botMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 10 * 1000, max: 1 });

			collector.on('collect', async button => {
				if (button.customId === 'mail_yes') {
					await botMessage.edit({ embeds: [{ title: 'Sending message <a:loading:962047754543181975>', color: '#e91e63' }], components: [] });
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
					await channel.send({ embeds: [mailEmbed] }).then(() => {
						botMessage.edit({ embeds: [{ title: 'Modmail sent.', color: '#e91e63' }] });
					});
				} else if (button.customId === 'mail_no') {
					await botMessage.edit({ embeds: [{ title: 'Process cancelled', color: '#e91e63' }], components: [] });
				}
			});

			collector.on('end', collected => {
				if (collected.size === 0) {
					botMessage.edit({ embeds: [{ title: 'Time ended. Interaction cancelled', color: '#e91e63' }], components: [] });
				}
			});
			return;

		} else {
			if (message.channel.id === '844291476049494026' && message.mentions.roles.size !== 0) {
				const channel = await client.channels.fetch('844632108831342679').then(chan => chan).catch(() => null);
				await channel.send(`Hey <@!${message.author.id}>!.\nIf you just uploaded a release or something, then make sure to post it on the subreddit too, if it's applicable. This is an automatic trigger by the bot when any role is mentioned in <#844291476049494026>. If you think this doesn't apply, then ignore this message.\nSubreddit link: https://www.reddit.com/r/MamahahaTsurego/`);
			}
			if (!message.content.startsWith(prefix)) return; // Checking if message starts with prefix and it wasnt posted by a bot

			const args = message.content.slice(prefix.length).split(/ +/);
			const commandName = args.shift().toLowerCase(); // Separating the command and argument from the user.
			const command = client.commands.get(commandName) // giving command = command name
				|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // or the aliase

			if (!command) return;

			if (command.perms) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.perms)) {
				return message.reply('You do not have the permissions to run this command.');
				}
			}

			if (command.args && !args.length) {
				let reply = `You didn't provide any arguments, ${message.author}!`; // Ensuring if argument is there and is needed or not.
				if (command.usage) {
					reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
				}
				return message.channel.send(reply);
			}

			try {
				await command.execute(message, args);
			} catch (error) {
				console.error(error);
				message.reply('There was an error trying to execute that command!'); // Error with the command handler itself
			}

		}
	},
};