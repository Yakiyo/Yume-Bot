const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES,
	],
	partials: [
		'MESSAGE',
		'CHANNEL',
		'REACTION',
		'GUILD_MEMBER',
	],
	presence: {
		status: 'online',
		activities: [{
			name: 'DMs to contact staff | .help',
			type: 'WATCHING',
		}],
	},
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true,
	},
});

client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');
console.log('Initializing commands loading......');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}
console.log('All commands loaded.');

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


// Login to Discord with your client's token
client.login(process.env.TOKEN);