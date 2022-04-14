const { prefix } = require('../../config.json');
const { version } = require('../../package.json');

module.exports = {
    name: 'about',
    description: 'A general description of the bot.',

    args: false,
    category: 'misc',
    aliases: ['botinfo'],
    async execute(message) {
        const aboutObj = {
              footer: {
                text: 'Made with 💖 & discord.js',
                icon_url: 'https://i.imgur.com/U4U2cPU.png',
                proxy_icon_url: 'https://images-ext-1.discordapp.net/external/CMaZlkTJ__mjsFwpDAFFiJen1GnEd7SI56dOcgoAXu8/https/i.imgur.com/U4U2cPU.png',
              },
              thumbnail: {
                url: 'https://cdn.discordapp.com/avatars/941217579584851979/9fb0d54087d4d447a41c15fc77513d05.png',
              },
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
              ],
              color: 5814783,
              type: 'rich',
              description: `Yume bot is a discord bot dedicated to the Tsurekano discord server. Made by Yakiyo#1206. Thanks to Tenknown & Rim for the help in making the bot.\n**Current Version:** ${version}\n\nMy prefix is \`${prefix}\`. For a list of my commands do \`${prefix}help\`.\n\nDiscord: https://discord.gg/q2zDU5bGnh\nSubreddit: [r/MamahahaTsurego](https://www.reddit.com/r/MamahahaTsurego/)\nFandom: [Motokano Fandom](https://motokano.fandom.com/wiki/My_Stepsister_is_My_Ex_Wiki) `,
              title: 'Yume Bot',
            };
        message.channel.send({ embeds: [aboutObj] });
    },
};