const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seggs')
        .setDescription('Try and see')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to do seggs with')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || null;
        let description = '';
        if (user) {
            description = `<@${interaction.user.id}> wants to have seggs with <@${user.id}>`;
        } else {
            description = `<@${interaction.user.id}> is horny for seggs`;
        }
        return await interaction.reply({ embeds: [{
            color: 15277667,
            title: 'Seggs',
            description,
            image: {
                url: 'https://i.imgur.com/x6OcbGS.gif',
            },
        }] });
    },
};