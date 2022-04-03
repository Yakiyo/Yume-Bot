/* eslint-disable no-inline-comments */
const { prefix } = require('../config.json');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		if (!message.content.startsWith(prefix) || message.author.bot) return; // Checking if message starts with prefix and it wasnt posted by a bot

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase(); // Separating the command and argument from the user.
		const command = client.commands.get(commandName) // giving command = command name
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // or the aliase

		if (!command) return;

		if (command.guildOnly && message.channel.type === 'dm') {
			return message.reply('That is a guild only command. Cannot execute in DMs!'); // guild only command
		}

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
	},
};