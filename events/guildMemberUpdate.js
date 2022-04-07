const booster = require('../modules/booster');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        const guild = oldMember.guild;
        const boostRole = guild.roles.premiumSubscriberRole;

        if (!oldMember.roles.cache.has(`${boostRole.id}`) && newMember.roles.cache.has(`${boostRole.id}`)) {
            return await booster(newMember, guild, client);
        }
    },
};