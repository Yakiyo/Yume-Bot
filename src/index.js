const fs = require('node:fs');
const { Client, Intents, Collection } = require('discord.js');
const path = require('node:path');
const http = require('http');
const commandHandler = require('./structs/commandHandler.js');
require('dotenv').config();

if (!process.env.TOKEN) {
	console.error('No bot token specified. Cancelling process.');
	process.exit(0);
}

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
			name: 'DMs to contact staff | /help',
			type: 'WATCHING',
		}],
	},
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true,
	},
});

client.textCommands = new Collection();
const textCommandFiles = fs.readdirSync('./src/legacy');

for (const file of textCommandFiles) {
	const command = require(path.resolve(process.cwd(), `./src/legacy/${file}`));
	client.textCommands.set(command.name, command);
}
client.commands = commandHandler.commands;

// Only register slash commands while on
// development as it can spam discord api.
// Don't load on production. Manually register
// slash commands using the `dev` interaction
if (process.env.NODE_ENV === 'development') {
	commandHandler.registerCommands();
}

const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(path.resolve(process.cwd(), `./src/events/${file}`));
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

process.on('SIGTERM', () => client.emit('kill'));

// Run a http server to keep the bot alive with uptime robot or the likes
http.createServer(function (req, res) {
	res.write('Alive and kicking!');
	res.end();
}).listen(8080);

// Login to Discord with your client's token
client.login(process.env.TOKEN);