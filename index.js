const { time } = require('@discordjs/builders');
const fs = require('fs');
const { Client, Intents, Collection, Options, Util } = require('discord.js');
const { prefix } = require('./config.json');
const mongoose = require('mongoose');
const { version } = require('./package.json')
require('dotenv').config();

const client = new Client({ intents: [
		Intents.FLAGS.GUILDS, 
		Intents.FLAGS.GUILD_MEMBERS, 
		Intents.FLAGS.GUILD_BANS, 
		Intents.FLAGS.GUILD_MESSAGES, 
		Intents.FLAGS.GUILD_BANS
	], 
	partials: [
		'MESSAGE', 
		'CHANNEL', 
		'REACTION',
		'GUILD_MEMBER'
	]
	/*makeCache: Options.cacheWithLimits({
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
	}),*/
});

client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');
console.log('Initializing commands loading......')
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
		console.log(`Loaded command ${command.name}`)
	}
}
//console.log(`All commands loaded. Loaded ${client.commands.cache.size} commands.`)

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

/*
// When the client is ready, run this code (only once)
client.once('ready', async () => {
	await mongoose.connect( process.env.MONGO,
	{
		keepAlive: true,
	});
	client.user.setActivity(`Mizuto in the bath`, { type: 'WATCHING' });
	client.user.setStatus('online');
	await client.users;
	console.log(`Logged in as ${client.user.tag}`);
	client.channels.cache.get('844253443510239262').send(`Yume Bot on! <:corporalmizuto:845137729729462302>.\nReady at ${time(client.readyAt)}\nGuilds: ${client.guilds.cache.size}, Channels: ${client.channels.cache.size}, Version: ${version}`);
});



client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return; // Checking if message starts with prefix and it wasnt posted by a bot

	const args = message.content.slice(prefix.length).trim().split(/ +/); 
	const commandName = args.shift().toLowerCase(); // Separating the command and argument from the user.
	const command = client.commands.get(commandName) //giving command = command name 
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
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!'); // Error with the command handler itself
	}
});
*/
// Login to Discord with your client's token
client.login(process.env.TOKEN);