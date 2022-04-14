const modlog = require('../../modules/modlog.js');
const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a mentioned user, duh',
    args: true,

    usage: '[user mention/id] <reason>',
    perms: 'KICK_MEMBERS',
    category: 'moderation',
    async execute(message, args) {
        const taggedUser = await getUser(args[0], message).catch(error => error);
        if (!taggedUser || taggedUser == undefined) return message.channel.send('Invalid user. Please provide a valid server member');

        if (message.guild.me.permissions.has('KICK_MEMBERS') == false) return message.channel.send('I do not have the required permissions to timeout a user.');
        if (taggedUser.user.id == message.author.id || taggedUser.user.id == message.client.user.id) return message.channel.send('Cannot execute kick on this user.');
        if (message.guild.roles.comparePositions(message.member.roles.highest, taggedUser.roles.highest) <= 0) return message.channel.send('This user is higher then you. You cannot kick him.');
        if (message.guild.roles.comparePositions(message.guild.me.roles.highest, taggedUser.roles.highest) <= 0) return message.channel.send('Target user is higher then me in hierarchy. Please give me a higher role to execute it.');

        const reason = args.slice(1).join(' ');
        const dmEmb = {
            color: 'RANDOM',
            description: `You have been kicked from ${message.guild.name} \n**Reason:** ${reason || 'No reason provided'}`,
            timestamp: new Date(),
            footer: {
                text: `Triggered by ${message.author.id}`,
                icon_url: `${message.guild.iconURL({ format: 'png', dynamic: true })}`,
            },
        };
        const modlogEmb = {
            title: 'Kick Case',
            color: 'GREEN',
            description: `**Offender:** <@!${taggedUser.user.id}>\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason || 'No reason provided'}`,
            timestamp: new Date(),
            footer: {
                text: `ID: ${taggedUser.user.id}`,
            },
        };

        await taggedUser.send({ embeds: [dmEmb] }).catch(error => console.log(error));
        await message.guild.members.kick(taggedUser.user, { days: 3, reason: `${reason || 'No reason provided'}` }).catch(err => {
            console.log(err);
            message.channel.send('Couldnt ban the user. Something went wrong!');
        });

        await modlog(modlogEmb, message);
        message.channel.send(`Successfully kicked ${taggedUser.user.tag}`);
    },
};