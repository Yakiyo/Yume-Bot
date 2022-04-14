const modlog = require('../../modules/modlog.js');
const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'unmute',
    description: 'Un-time\'s out a user. **Does** not assign a mute role. Uses discord\'s in built timeout feature',

    args: true,
    category: 'moderation',
    aliases: ['untimeout'],
    usage: '[user mention/id]',
    perms: 'MODERATE_MEMBERS',
    async execute(message, args) {
        const reason = args.slice(1);
        const target = await getUser(args[0], message).catch(error => error);
        if (!target || target == undefined) return message.channel.send('Invalid user. Please provide a valid server member');

        if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) return message.channel.send('I do not have the required permissions to timeout a user.');
        if (target.user.id == message.author.id || target.user.id == message.client.user.id) return message.channel.send('Cannot execute mute on this user.');
        if (message.guild.roles.comparePositions(message.member.roles.highest, target.roles.highest) <= 0) return message.channel.send('This user is higher then you. You cannot execute the command on them');
        if (message.guild.roles.comparePositions(message.guild.me.roles.highest, target.roles.highest) <= 0) return message.channel.send('Target user is higher then me in hierarchy. Please give me a higher role to execute it.');

        if (target.communicationDisabledUntil == null || !target.communicationDisabledUntil) return message.channel.send('Target user is not timed out. Please check again!');

        const log = {
            title: 'Unmute Case',
            color: 'GREEN',
            description: `**Offender:** <@!${target.user.id}>\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason.join(' ') || 'No reason provided'}`,
        };
        try {
            await target.timeout(null, reason || 'No reason provided');
        } catch (error) {
            console.log(error);
            return message.channel.send('Could not untimeout user. Pls check logs for error');
        }
        await modlog(log, message).catch(error => console.log(error));
        return message.channel.send(`Successfully unmuted **${target.user.tag}**`);

    },
};