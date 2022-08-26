const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('../config.json');

/**
 * Command Handler class
 */
class CommandHandler {
    constructor() {
        /**
         * Collection of commands
         * @type {Collection<string, Command>}
         * @public
         */
        this.commands = new Collection();
        this.init();
    }
    /**
     * Initializes commands. Used only during class contruction
     * @private
     */
    init() {
        this.loadCommands();
    }
    /**
     * Register's slash commands to discord
     * @public
     */
    async registerCommands() {
        const commands = this.commands.size === 0 ? this.loadCommands() : this.commands;
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: Array.from(commands.values()).map(val => val.data.toJSON()) },
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }
    /**
     * Load's all commands from directory
     * @public
     * @returns Collection<string, Command>
     */
    loadCommands() {
        const commandFolders = fs.readdirSync('./src/commands');
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(path.resolve(process.cwd(), `./src/commands/${folder}/${file}`));
                command.category = `${folder}`;
                this.commands.set(command.data.name, command);
            }
        }
        return this.commands;
    }
}

module.exports = new CommandHandler();

/**
 * Represents a command object
 * @typedef {Object} Command
 * @property {Object} data
 * @property {Function} execute
 */