const { SlashCommandBuilder } = require('@discordjs/builders');
const { nekos } = require('../../util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('husbando')
        .setDescription('Gives a husbando art'),
    async execute(interaction) {
        await interaction.deferReply();
        const result = await nekos('husbando');
        if (!result) return await interaction.editReply('Internal error when attempting to fetch image from API. It might be down at this moment. Please try again later');
        const embed = {
            title: 'Here\'s a Husbando for you.',
            color: 15277667,
            description: `Image Source: [link](${result.source_url || 'https://nekos.best'} 'Source') || Artist: [${result.artist_name || 'Unknown'}](${result.artist_href || 'https://nekos.best'} 'Artist')`,
            image: {
                url: `${result.url}`,
            },
            footer: {
                text: 'Powered by nekos.best',
                icon_url: 'https://i.imgur.com/IMhljcr.png',
            },
        };
        return await interaction.editReply({ embeds: [embed] });
    },
};