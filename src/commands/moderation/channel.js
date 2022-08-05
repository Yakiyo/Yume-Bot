const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType: CT } = require('discord-api-types/v9');
const { casify, shorten } = require('../../util.js');

/*
    Channel commands
        info
        create
        delete
        rename
        clone
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
                        .addChannelTypes(CT.GuildText, CT.GuildVoice, CT.GuildNews)))
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('Create a new channel')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Name of the channel to be created')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('The type of the channel. Defaults to text channel')
                        .addChoices({ name: 'TEXT', value: 'Guild_Text' }, { name: 'VOICE', value: 'Guild_Voice' }))
                .addChannelOption(option =>
                    option.setName('category')
                        .setDescription('The category under which the channel is to be created')
                        .addChannelTypes(CT.GuildCategory))
                .addStringOption(option =>
                    option.setName('topic')
                        .setDescription('The topic of the channel to be created'))),
    async execute(interaction) {
        await interaction.deferReply();
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'info': {
                const channel = interaction.options.getChannel('channel') || interaction.channel;
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
            case 'create': {
                const channel = await interaction.guild.channels.create(interaction.options.getString('name'), {
                    parent: interaction.options.getChannel('category')?.id || null,
                    type: interaction.options.getString('type') || 'Guild_Text',
                    topic: interaction.options.getString('topic') || null,
                });
                return await interaction.editReply({ embeds: [{
                    title: 'Channel Created',
                    color: 15277667,
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
                }] });
            }
            default:
                return await interaction.editReply('Unknown subcommand found. Please report this issue to dev.');
        }
    },
};