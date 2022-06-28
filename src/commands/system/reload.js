const { SlashCommandBuilder } = require('@discordjs/builders');
const { owners } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a slash command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

		if (!owners.includes(interaction.user.id)) {
            return await interaction.editReply({ content: 'This command can only be executed by bot dev.', ephemeral: true });
        }
        await interaction.editReply('done');
    },
};