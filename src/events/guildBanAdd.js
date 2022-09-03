/* eslint-disable */
const { guildId, channels } = require('../config.json');
module.exports = {
    name: 'guildBanAdd',
    async execute(ban, client) {
        return;
        // if (ban.guild.id !== guildId) return;
        // const channel = await client.channels.fetch(channels.modlogs);
        // const embed = {
        //     title: 'Ban Case',
        //     color: 14507859,
        //     timestamp: new Date(),
        //     footer: {
        //         text: `ID: ${ban.user.id}`,
        //     },
        //     description: `**Offender:** ${ban.user.tag} | <@!${ban.user.id}>\n**Reason:** ${ban.reason || 'No reason provided'}`,
        // };
        // const log = await ban.guild.fetchAuditLogs({
        //     limit: 1,
        //     type: 'MEMBER_BAN_ADD',
        // })
        // .then(logs => logs.entries.first())
        // .catch(() => null);
        // console.log(log);
        // if (log && ban.user.id === log.target.id) {
        //     embed.description += `\nResponsibly Moderator: ${log.executer?.tag || 'Unknown'}`;
        // }

        // return await channel.send({ embeds: [embed] });
    },
};