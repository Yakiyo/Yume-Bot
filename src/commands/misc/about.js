const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { version } = require('../../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about the bot'),
    async execute(interaction) {
        await interaction.deferReply();
        const githubCommits = await fetch('https://api.github.com/repos/Yakiyo/Yume-Bot/commits?per_page=5')
            .then((response) => {
                return response.json().then(function (json) {
                    return response.ok ? json : Promise.reject(json);
                });
            })
            .then((res) => res);

        function getCommits(commits) {
            const array = [];
            for (const commit of commits) {
                const message = commit.commit.message.indexOf('\n') !== -1 ? commit.commit.message.substring(0, commit.commit.message.indexOf('\n')) : commit.commit.message;
                const string = `[\`${commit.sha.substring(0, 7)}\`](${commit.html_url})` + ` ${message} - ${commit.commit.author.name}`;
                array.push(string);
            }

            return array.join('\n');
        }
        const embed = {
            color: 5814783,
            footer: {
                text: 'Made with 💖 & discord.js',
                icon_url: 'https://i.imgur.com/U4U2cPU.png',
                proxy_icon_url:
                    'https://images-ext-1.discordapp.net/external/CMaZlkTJ__mjsFwpDAFFiJen1GnEd7SI56dOcgoAXu8/https/i.imgur.com/U4U2cPU.png',
            },
            title: `Yume Bot V-${version}`,
            description: 'Yume Bot is a discord bot dedicated for the Tsurekano Discord Server. Made by **Yakiyo#1206**\n\nThe bot supports slash commands. To get started, use `/help`\n\nDiscord: https://discord.gg/q2zDU5bGnh\nSubreddit: [r/MamahahaTsurego](https://www.reddit.com/r/MamahahaTsurego/)\nFandom: [Motokano Fandom](https://motokano.fandom.com/wiki/My_Stepsister_is_My_Ex_Wiki)',
            fields: [
                {
                    name: 'Language',
                    value: '[Javascript](https://www.javascript.com/)',
                    inline: true,
                },
                {
                    name: 'Framework',
                    value: '[Discord.js](https://discord.js.org/)',
                    inline: true,
                },
                {
                    name: 'Github',
                    value: '[Link](https://github.com/Yakiyo/Yume-Bot)',
                    inline: true,
                },
                {
                    name: 'Recent Changes',
                    value: `${getCommits(githubCommits)}`,
                },
            ],
        };
        return await interaction.editReply({ embeds: [embed] });
    },
};