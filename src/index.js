const fs = require('node:fs');
const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
const path = require('node:path');
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

// This uses a secondary bot account to use for development instead of the original one.
const botId = process.env.NODE_ENV !== 'development' ? clientId : '964798451261014026';

const commands = [];
client.textCommands = new Collection();
client.commands = new Collection();
const commandFolders = fs.readdirSync('./src/commands');
const textCommandFiles = fs.readdirSync('./src/legacy');

for (const file of textCommandFiles) {
	const command = require(path.resolve(process.cwd(), `./src/legacy/${file}`));
	client.textCommands.set(command.name, command);
}

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(path.resolve(process.cwd(), `./src/commands/${folder}/${file}`));
		command.category = `${folder}`;
		client.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(botId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(path.resolve(process.cwd(), `./src/events/${file}`));
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Login to Discord with your client's token
client.login(process.env.TOKEN);