module.exports = {
    name: 'serverinfo',
    description: 'Gives the server name, id, and owner',
    aliases: ['si','server'],
    guildOnly: true,
    category: 'utility',
    async execute(message, args) {
        let server = message.guild, memCount;
        await server.members.fetch().then(stuff => memCount = stuff.size)
        const siem = {
            title: `${server.name}`,
            thumbnail: {
                url: `${server.iconURL({ format: 'png', dynamic: true })}`
            },
            fields: [
            {
                name: 'Owner',
                value: `<@!${server.ownerId}>`,
                inline: true
            },
            {
               name: 'Members',
               value: `${memCount}`,
               inline: true
            },
            {
                name: 'Channels',
                value: `${server.channels.cache.size}`,
                inline: true
            },
            ]
        }
        message.channel.send({embeds: [siem]});
    }
}