const { time } = require('@discordjs/builders');
const capitalize = require('../../modules/capitalize.js');

module.exports = {
    name: 'serverinfo',
    description: 'Gives the server name, id, and owner',
    aliases: ['si', 'server'],
    
    category: 'utility',
    async execute(message) {
        const server = message.guild; let memCount;
        await server.members.fetch().then(stuff => memCount = stuff.size);
        const owner = await message.client.users.fetch(server.ownerId).then(dude => dude.tag);
        const siem = {
            title: `${server.name}`,
            color: 7506394,
            thumbnail: {
                url: `${server.iconURL({ format: 'png', dynamic: true })}`,
            },
            description: `**Server id:** ${server.id}\n\n**Description:** ${server.description || '.......'}`,
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
            siem.image.url = `${message.guild.bannerURL()}`;
        }
        message.channel.send({ embeds: [siem] });
    },
};