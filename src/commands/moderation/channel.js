const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType: CT } = require('discord-api-types/v9');
const { casify, shorten } = require('../../util.js');

/*
    Channel commands
        info
        create
        delete
        rename
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Set of commands for channel management')
        .addSubcommand(sub =>
            sub.setName('info')
                .setDescription('Returns information about a channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to return info of.')
                        .setRequired(true)
                        .addChannelTypes(CT.GuildText, CT.GuildVoice, CT.GuildNews))),
    async execute(interaction) {
        await interaction.deferReply();
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'info': {
                const channel = interaction.options.getChannel('channel');
                const embed = {
                    color: 15277667,
                    title: 'Channel Info',
                    fields: [
                        {
                            name: 'Name',
                            value: `${channel.name} | <#${channel.id}>`,
                            inline: true,
                        },
                        {
                            name: 'ID',
                            value: channel.id,
                            inline: true,
                        },
                        {
                            name: '\u200b',
                            value: '\u200b',
                            inline: true,
                        },
                        {
                            name: 'Type',
                            value: casify(channel.type),
                            inline: true,
                        },
                        {
                            name: 'Created at',
                            value: `<t:${Math.floor(channel.createdAt.getTime() / 1000)}:F>`,
                            inline: true,
                        },
                        {
                            name: '\u200b',
                            value: '\u200b',
                            inline: true,
                        },
                        {
                            name: 'Topic',
                            value: channel.topic ? shorten(channel.topic, 1020) : 'No Topic Provided',
                        },
                    ],
                };
                return await interaction.editReply({ embeds: [embed] });
            }

            default:
                return await interaction.editReply('Unknown subcommand found. Please report this issue to dev.');
        }
    },
};