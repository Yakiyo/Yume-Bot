const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, owners } = require('../../config.json');
const { Collection } = require('discord.js');
const path = require('path');
require('dotenv').config();
const botId = process.env.NODE_ENV === 'production' ? clientId : '964798451261014026';
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slash')
        .setDescription('Deploys slash command to local guild')
        .addBooleanOption(option =>
            option.setName('clear')
                .setDescription('Wether to clear commands or not. true for clearing, false for not. Defaults to false')),
    async execute(interaction) {
        if (!owners.includes(interaction.user.id)) return await interaction.reply('This command is only usable by the bot dev');
        await interaction.deferReply();
        const option = interaction.options.getBoolean('clear') || false;
        const commands = [];

        if (!option) {
            const clientCommands = new Collection();
            const commandFolders = fs.readdirSync('./src/commands');

            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const command = require(path.resolve(process.cwd(), `./src/commands/${folder}/${file}`));
                    command.category = `${folder}`;
                    clientCommands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                }
            }
            interaction.client.commands = clientCommands;
        } else {
            const slash = interaction.client.commands.get(interaction.commandName);
            commands.push(slash.data.toJSON());
        }

        (async () => {
            try {
                await interaction.editReply('Started refreshing application (/) commands....');

                await rest.put(
                    Routes.applicationGuildCommands(botId, guildId),
                    { body: commands },
                );

                return await interaction.editReply('Successfully registered guild commands!');
            } catch (error) {
                console.error(error);
                return await interaction.editReply('Failed to register guild commands. :x:');
            }
        })();
    },
};