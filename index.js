const fs = require('fs');
const { Client, Intents, Collection, Options, Util } = require('discord.js');
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
	makeCache: Options.cacheWithLimits({
		ChannelManager: {
			sweepInterval: 3600,
			sweepFilter: Util.archivedThreadSweepFilter(),
		},
		GuildChannelManager: {
			sweepInterval: 3600,
			sweepFilter: Util.archivedThreadSweepFilter(),
		},
		MessageManager: 100,
		StageInstanceManager: 10,
		ThreadManager: {
			sweepInterval: 3600,
			sweepFilter: Util.archivedThreadSweepFilter(),
		},
		VoiceStateManager: 10,
	}),
	allowedMentions: {
		parse: ['users', 'roles'],
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