const { prefix } = require('../../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const helpEmbed = {
			title: 'Help Menu',
			color: 'RANDOM',
			timestamp: new Date(),
			footer: {
				text: `Triggered by ${message.author.tag}.`,
			},
		};
		const { commands } = message.client;
		
		if (!args.length){
			const cmdList = commands.map(command => `\`${command.name}\``).join(', ');
			helpEmbed.description = `Here\'s a list of all of my commands. \n${cmdList}`;
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command){ return message.channel.send('No such command found!');}
			let cmdAliase = 'None', cmdDesc = 'No description provided', cmdUsage = '' ;
			if (command.aliases) {cmdAliase = command.aliases;}
			if (command.usage) {cmdUsage = command.usage;}
			if (command.description){cmdDesc = command.description;}
			helpEmbed.description = `**${prefix}${command.name} ${cmdUsage}**\n **Aliases:** ${cmdAliase} \n**Description:** ${cmdDesc} `;
			helpEmbed.title += ` for ${command.name}`;
		}

		message.channel.send({ embeds: [helpEmbed]});
		
	}
		
};