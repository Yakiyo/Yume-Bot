const { prefix } = require('../../config.json');
const { Collection } = require('discord.js');
const categories = new Collection();

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	category: 'utility',
	cooldown: 5,
	execute(message, args) {
		const helpEmbed = {
			title: 'Help Menu',
			color: '#e91e63',
			timestamp: new Date(),
			footer: {
				text: `Triggered by ${message.author.tag}.`,
			},
		};
		const { commands } = message.client;

		if (!args.length) {
			commands.forEach(command => {
	            const category = categories.get(command.category);
	            if (category) {
	            category.set(command.name, command);
	            } else {
	            categories.set(command.category, new Collection().set(command.name, command));
	            }
	        });
	        const arr = Array.from(categories);
	        const field = [] ;
	        for (let i = 0; i < arr.length ; i++) {
	            let obj = new Object;
	            const listOEntries = [];
	            const comList = arr[i][1];
	            comList.forEach(com => {
	                listOEntries.push(`\`${com.name}\``);
	            });
	            obj = {
	                name: `${arr[i][0]}`,
	                value: `${listOEntries.join(', ')}`,
					// ${Array.from((arr[i][1])).join(', ')}`
	            };
	            // arr[i][1].forEach(com => obj.value += `${com.name}` )
	            field.push(obj);
	        }
	        helpEmbed.fields = field;
			/* const cmdList = commands.map(command => `\`${command.name}\``).join(', ');
			helpEmbed.description = `Here\'s a list of all of my commands. \n${cmdList}`;*/
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) { return message.channel.send('No such command found!');}
			let cmdAliase = 'None', cmdDesc = 'No description provided', cmdUsage = '' ;
			if (command.aliases) {cmdAliase = command.aliases.join(', ');}
			if (command.usage) {cmdUsage = command.usage;}
			if (command.description) {cmdDesc = command.description;}
			helpEmbed.description = `**${prefix}${command.name} ${cmdUsage}**\n **Aliases:** ${cmdAliase} \n**Description:** ${cmdDesc} `;
			helpEmbed.title += ` for ${command.name}`;
		}

		message.channel.send({ embeds: [helpEmbed] });

	},

};