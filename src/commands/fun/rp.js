const { SlashCommandBuilder } = require('@discordjs/builders');
const { nekos, casify } = require('../../util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rp')
        .setDescription('Collection of roleplay-ish commands')
        .addSubcommand(sub =>
            sub.setName('baka')
                .setDescription('Returns a baka gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('bite')
                .setDescription('Returns a bite gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('cuddle')
                .setDescription('Returns a cuddle gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('highfive')
                .setDescription('Returns a highfive gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('hug')
                .setDescription('Returns a hug gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('kiss')
                .setDescription('Returns a kiss gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('pat')
                .setDescription('Returns a pat gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('poke')
                .setDescription('Returns a poke gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('slap')
                .setDescription('Returns a slap gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('wave')
                .setDescription('Returns a wave gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with')))
        .addSubcommand(sub =>
            sub.setName('yeet')
                .setDescription('Returns a yeet gif')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to interact with'))),
    async execute(interaction) {
        await interaction.deferReply();
        const user = interaction.options.getUser('user') ? `<@${interaction.options.getUser('user').id}>` : null;
        const author = `<@${interaction.user.id}>`;
        const res = await nekos(interaction.options.getSubcommand()) || null;
        if (!res) return await interaction.editReply('Unexpected error when attempting to fetch from API. Please try again later.');
        const embed = {
            color: 15277667,
            title: casify(interaction.options.getSubcommand()),
            image: {
                url: res.url,
            },
            footer: {
                text: 'Powered by nekos.best',
                icon_url: 'https://i.imgur.com/IMhljcr.png',
            },
            fields: [],
        };

        if (res.anime_name) {
            embed.fields.push({ name: 'Source', value: `${res.anime_name}` });
        }

        switch (interaction.options.getSubcommand()) {
            case 'baka': {
                embed.description = user ? `${author} calls ${user} a baka` : `${author} is calling himself a baka`;
                break;
            }
            case 'bite': {
                embed.description = user ? `${author} is biting ${user}` : `${author} is on a biting spree`;
                break;
            }
            case 'cuddle': {
                embed.description = user ? `${author} & ${user} are cuddling` : `${author} wants some cuddles`;
                break;
            }
            case 'highfive': {
                embed.description = user ? `${author} highfives ${user}` : `${author} is handing out highfives`;
                break;
            }
            case 'hug': {
                embed.description = user ? `${author} & ${user} are hugging` : `${author} is lonely and wants hugs`;
                break;
            }
            case 'kiss': {
                embed.description = user ? `${author} & ${user} are passionately kissing` : `${author} is in heat`;
                break;
            }
            case 'pat': {
                embed.description = user ? `${author} is giving ${user} headpats` : `${author} is handing out headpats`;
                break;
            }
            case 'poke': {
                embed.description = user ? `${author} is poking ${user}` : `${author} is looking to poke someone`;
                break;
            }
            case 'slap': {
                embed.description = user ? `${author} slasp ${user}` : `${author} slaps at the hair`;
                break;
            }
            case 'wave': {
                embed.description = user ? `${author} waves at ${user}` : `${author} is waving`;
                break;
            }
            case 'yeet': {
                embed.description = user ? `${author} just yeeted ${user}` : `${author} got no one to yeet`;
                break;
            }
            default:
                return await interaction.editReply('Unknown subcommand. Please report this to bot developer.');
        }
        return await interaction.editReply({ embeds: [embed] });
    },
};