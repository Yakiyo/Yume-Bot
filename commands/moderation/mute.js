const parse = require('parse-duration');
const modlog = require('../../modules/modlog.js');
const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'mute',
    description: 'Time\'s out a user. **Does** not assign a mute role. Uses discord\'s in built timeout feature',

    args: true,
    category: 'moderation',
    aliases: ['timeout'],
    usage: '[user mention/id] [duration] <reason>',
    perms: 'MODERATE_MEMBERS',
    async execute(message, args) {
        let reason;
        const target = await getUser(args[0], message).catch(error => error);
        if (!target || target == undefined) return message.channel.send('Invalid user. Please provide a valid server member');

        if (message.guild.me.permissions.has('MODERATE_MEMBERS') == false) return message.channel.send('I do not have the required permissions to timeout a user.');
        if (target.permissions.has('ADMINISTRATOR') == true) return message.channel.send('Target has administrator perms. Cannot timeout admins. <:redCross:946453057053544449>');
        if (target.user.id == message.author.id || target.user.id == message.client.user.id) return message.channel.send('Cannot execute mute on this user.');

        if (message.guild.roles.comparePositions(message.member.roles.highest, target.roles.highest) <= 0) return message.channel.send('This user is higher then you. You cannot mute him.');
        if (message.guild.roles.comparePositions(message.guild.me.roles.highest, target.roles.highest) <= 0) return message.channel.send('Target user is higher then me in hierarchy. Please give me a higher role to execute it.');

        const duration = parse(`${args[1]} ${args[2]}`, 'ms') || parse(`${args[1]}`, 'ms');
        if (!duration || duration == null || duration == undefined) return message.channel.send('Please provide a valid time duration');
        if (duration == parse(`${args[1]}`, 'ms')) {
            reason = args.slice(2);
        } else {
            reason = args.slice(3);
        }
        const log = {
            title: 'Mute Case',
            color: 'GREEN',
            description: `**Offender:** <@!${target.user.id}>\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason.join(' ') || 'No reason provided'}\n**Duration:** ${duration}`,
        };
        try {
            await target.timeout(duration, reason || 'No reason provided');
            await modlog(log, message).catch(error => console.log(error));
            return message.channel.send(`Successfully timed out **${target.user.tag}**`);
        } catch (error) {
            console.log(error);
            return message.channel.send('Could not timeout user. Pls check logs for error');
        }

    },
};