const { guildId, channels } = require('../config.json');
module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        if (member.guild.id !== guildId) return;
        const channel = await client.channels.fetch(channels.serverlogs).then(response => response).catch(() => null);
        return await channel.send({ embeds: [{
            title: 'Member Left',
            description: `${member.user.tag} | <@${member.user.id}>\n<t:${member.joinedTimestamp}:F>`,
            color: 16774575,
            author: {
                name: member.user.tag,
                icon_url: member.user.avatarURL(),
            },
            footer: {
                text: `ID: ${member.user.id}`,
            },
        }] });
    },
};