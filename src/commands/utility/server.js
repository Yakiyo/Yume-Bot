const { SlashCommandBuilder, time } = require('@discordjs/builders');
const { casify } = require('../../util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Returns general information/icon/banner of the server')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Server information or icon or banner')
                .addChoice('info', 'info')
                .addChoice('icon', 'icon')
                .addChoice('banner', 'banner')),
    async execute(interaction) {
        const option = interaction.options.getString('option') || 'info';
        const server = await interaction.guild;
        if (!server.available) return await interaction.reply('Cannot access the server at this moment possibly due to server outage. Please try again later');

        switch (option) {
            case 'info': {
                await interaction.deferReply();
                const owner = await server.members.fetch(server.ownerId).then(res => res);

                const members = await server.members.fetch().then(stuff => stuff);

                const embed = {
                    title: server.name,
                    color: 7506394,
                    thumbnail: {
                        url: server.iconURL({ format: 'png', dynamic: true }),
                    },
                    image: {},
                    fields: [
                        {
                            name: ':id: Server ID',
                            value: server.id,
                            inline: true,
                        },
                        {
                            name: ':calendar_spiral: Created on',
                            value: `${time(server.createdAt)}`,
                            inline: true,
                        },
                        {
                            name: ':crown: Owner',
                            value: `${owner.user.tag} (${owner.id})`,
                            inline: true,
                        },
                        {
                            name: ':busts_in_silhouette: Members',
                            value: `:sparkles: Total: ${members.size} \n:bust_in_silhouette: Human: ${members.filter(dude => !dude.user.bot).size}\n:robot: Bots: ${members.filter(dude => dude.user.bot).size}`,
                            inline: true,
                        },
                        {
                            name: '<:BoostIcon:975107414263201822> Boosts',
                            value: `${casify(server.premiumTier)}\n${server.premiumSubscriptionCount}${server.premiumSubscriptionCount > 15 ? ' (Maxed)' : server.premiumSubscriptionCount > 7 ? '/15' : '/7'} boosts`,
                            inline: true,
                        },
                        {
                            name: `<:colorVoiceC:975108634252038174> Channels (${server.channels.cache.size})`,
                            value: `<:textC:946453234514538516> Text: ${server.channels.cache.filter(chan => chan.type == 'GUILD_TEXT').size}\n<:voiceC:946453276264640512> Voice: ${server.channels.cache.filter(chan => chan.type == 'GUILD_VOICE').size}\n:heavy_plus_sign: Others: ${server.channels.cache.filter(chan => chan.type !== 'GUILD_TEXT' && chan.type !== 'GUILD_VOICE').size}`,
                            inline: true,
                        },
                    ],
                };

                if (server.bannerURL()) {
                    embed.image.url = server.bannerURL({ size: 1024 });
                }
                return await interaction.editReply({ embeds: [embed] });
            }

            case 'banner': {
                if (!server.bannerURL()) return await interaction.reply({ content: 'This server doesn\'t have a banner.', ephemeral: true });
                const embed = {
                    title: `Server banner for ${server.name}`,
                    color: 1141191,
                    image: {
                        url: `${server.bannerURL({ format: 'png', dynamic: true, size: 1024 })}`,
                    },
                    footer: {
                        text: `Server id: ${server.id}`,
                        icon_url: `${interaction.user.avatarURL({ format: 'png', dynamic: true })}`,
                    },
                    timestamp: new Date(),
                };
                return await interaction.reply({ embeds: [embed] });
            }
            case 'icon': {
                const embed = {
                    title: `Server icon for ${server.name}`,
                    color: 1141191,
                    image: {
                        url: `${server.iconURL({ format: 'png', dynamic: true, size: 1024 })}`,
                    },
                    footer: {
                        text: `Server id: ${server.id}`,
                    },
                    timestamp: new Date(),
                };
                return await interaction.reply({ embeds: [embed] });
            }
        }
    },
};