const booster = require('../modules/booster');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        const guild = newMember.guild;
        if (!guild.available) return;

        // Makes sure the server is tsurekano, else return
        if (guild.id !== '844103224528076801') return;

        // booster event handler section
        const boostRole = await guild.roles.premiumSubscriberRole;
        if (boostRole !== undefined && boostRole !== null) {
            if (!oldMember.roles.cache.has(`${boostRole.id}`) && newMember.roles.cache.has(`${boostRole.id}`)) {
                await booster(newMember, guild, client);
            } else if (oldMember.roles.cache.has(`${boostRole.id}`) && !newMember.roles.cache.has(`${boostRole.id}`)) {
                const staffChan = await client.channels.fetch('844632108831342679').then(chan => chan);

                await staffChan.send(`${newMember.user.tag} withdrew server boosts!`);
            }
        }
        return;
    },
};