const { time } = require('@discordjs/builders');
const capitalize = require('../../modules/capitalize.js');

module.exports = {
    name: 'server',
    description: 'Gives the server name, id, and owner',
    aliases: ['si', 'guild'],
    usage: '[ info / icon / pfp / banner ]',
    category: 'utility',
    async execute(message, args) {
        const server = message.guild;
        let result;

        if (args[0] === 'icon' || args[0] === 'pfp') {
            result = {
                title: `Server Icon for ${server.name}`,
                color: 1141191,
                image: {
                    url: `${server.iconURL({ format: 'png', dynamic: true, size: 1024 })}`,
                },
                footer: {
                    text: `Server id: ${server.id}`,
                    icon_url: `${message.author.avatarURL({ format: 'png', dynamic: true })}`,
                },
                timestamp: new Date(),
            };
        } else if (args[0] === 'banner') {
            if (!server.bannerURL()) return message.channel.send('This server doesn\'t have a banner.');

            result = {
                title: `Server banner for ${server.name}`,
                color: 1141191,
                image: {
                    url: `${server.bannerURL({ format: 'png', dynamic: true, size: 1024 })}`,
                },
                footer: {
                    text: `Server id: ${server.id}`,
                    icon_url: `${message.author.avatarURL({ format: 'png', dynamic: true })}`,
                },
                timestamp: new Date(),
            };
        } else {
            const memCount = await server.members.fetch().then(stuff => stuff.size);
            const owner = await message.client.users.fetch(server.ownerId).then(dude => dude.tag);
            result = {
                title: `${server.name}`,
                color: 7506394,
                thumbnail: {
                    url: `${server.iconURL({ format: 'png', dynamic: true })}`,
                },
                description: `**Server id:** ${server.id}\n\n**Description:** ${server.description || '.......'}`,
                image: {},
                fields: [
                {
                    name: 'Owner',
                    value: `${owner}`,
                    inline: true,
                },
                {
                    name: 'Boosts',
                    value: `${capitalize(server.premiumTier)}\n${server.premiumSubscriptionCount}${server.premiumSubscriptionCount > 15 ? ' (Maxed)' : server.premiumSubscriptionCount > 7 ? '/15' : '/7'} boosts`,
                    inline: true,
                },
                {
                name: 'Members',
                value: `Total: ${memCount}\nHumans: ${message.guild.members.cache.filter(dude => !dude.user.bot).size}\nBots: ${message.guild.members.cache.filter(dude => dude.user.bot).size}`,
                inline: true,
                },
                {
                    name: 'Channels',
                    value: `Total: ${server.channels.cache.size}\n<:textC:946453234514538516> Text: ${message.guild.channels.cache.filter(chan => chan.type == 'GUILD_TEXT').size}\n<:voiceC:946453276264640512> Voice: ${message.guild.channels.cache.filter(chan => chan.type == 'GUILD_VOICE').size}\n:mega: News: ${message.guild.channels.cache.filter(chan => chan.type == 'GUILD_NEWS').size}`,
                    inline: true,
                },
                {
                    name: 'Roles',
                    value: `${server.roles.cache.size} roles`,
                    inline: true,
                },
                {
                    name: 'Created at',
                    value: `${time(server.createdAt)}`,
                    inline: true,
                },
                ],
            };
            if (message.guild.bannerURL()) {
                result.image.url = `${message.guild.bannerURL()}`;
            }
        }
        return message.channel.send({ embeds: [result] });
    },
};
