const { SlashCommandBuilder } = require('@discordjs/builders');
const queryString = require('node:querystring');
const fetch = require('node-fetch');
const { shorten } = require('../../util');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('urban')
		.setDescription('returns a search result from urban dictionary')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('the query to search for')
                .setRequired(true)),
    private: true,
	async execute(interaction) {
		await interaction.deferReply();
        const query = queryString.stringify({ term: interaction.options.getString('query') });

        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
                                .then(response => response.json())
                                .catch(error => {
                                    console.log(error);
                                    return interaction.editReply('Could not fetch query from urban dictionary');
                                });
        if (list == undefined || !list.length) return await interaction.editReply(`Could not find any search results for **${interaction.options.getString('query')}**`);

        const urban = list[Math.floor(Math.random() * list.length)];
        const embed = {
            color: 1548647,
            title: 'Urban Dictionary Search Result',
            url: `${urban.permalink}`,
            thumbnail: {
                url: 'https://i.imgur.com/kjkLbAW.png',
            },
            description: `**Word**\n${urban.word}\n\n**Descriptipn**\n${shorten(urban.definition)}`,
            fields: [
                {
                    name: 'Example',
                    value: `${shorten(urban.example, 1020) || 'No examples provided' }`,
                },
            ],
            footer: {
                text: `Author: ${urban.author}`,
                icon_url: `${interaction.user.avatarURL({ format: 'png', dynamic: true })}`,
            },
        };
        return await interaction.editReply({ embeds: [embed] });
	},
};