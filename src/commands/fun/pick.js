const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pick')
        .setDescription('Pick\'s an element from a list of random options')
        .addStringOption(option =>
            option.setName('choices')
                .setDescription('List of words, separate each option with a comma (,)')
                .setRequired(true)),
    async execute(interaction) {
        const options = interaction.options.getString('choices').split(',');
        if (options.length < 2) return await interaction.reply({ content: 'Please provide at least 2 choices. Separate them with commas', ephemeral: true });
        return await interaction.reply({ embeds: [{
            color: '#e91e63',
            description: `**Option picked:** ${options[Math.floor(Math.random() * options.length)]}`,
        }] });
    },
};