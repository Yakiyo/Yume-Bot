const { SlashCommandBuilder } = require('@discordjs/builders');
const { owners } = require('../../config.json');
const commandHandler = require('../../structs/commandHandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription('Collection of dev commands that comes in handy')
        .addSubcommand(sub =>
            sub.setName('avatar')
                .setDescription('Set\'s the bot\'s avatar')
                .addStringOption(option =>
                    option.setName('avatar')
                        .setDescription('Link the image to be used as avatar')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('load')
                .setDescription('Registers slash commands')),
    async execute(interaction) {
        if (!owners.includes(interaction.user.id)) {
            return await interaction.reply({ ephemeral: true, content: 'Sorry. This command can only be used by bot developer' });
        }
        switch (interaction.options.getSubcommand()) {
            case 'avatar': {
                try {
                    await interaction.client.user.setAvatar(interaction.options.getString('avatar'));
                    return interaction.reply('Successfully changed bot\'s avatar.');
                } catch (error) {
                    return await interaction.reply('Unexpected error when changing avatar. Please provide a valid image link and make sure the image is not private');
                }
            }
            case 'load': {
                await interaction.deferReply();
                await commandHandler.registerCommands();
                return await interaction.editReply('Registered slash commands');
            }
            default:
                return await interaction.reply({ content: 'Unknown subcommand.', ephemeral: true });
        }
    },
};