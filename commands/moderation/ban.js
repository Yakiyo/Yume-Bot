const modlog = require('../../modules/modlog.js');
const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'ban',
    description: 'bans the user with the mention/id.',
    args: true,

    category: 'moderation',
    usage: '[user id/mention] <reason>',
    perms: 'BAN_MEMBERS',
    async execute(message, args) {
        const taggedUser = await getUser(args[0], message);
        if (taggedUser == undefined) return message.channel.send('User is either not in this server or you gave an invalid argument.');

        if (message.guild.me.permissions.has('BAN_MEMBERS') == false) return message.channel.send('I do not have the required permissions to ban a user.');
        if (taggedUser.user.id == message.author.id || taggedUser.user.id == message.client.user.id) return message.channel.send('Cannot execute ban on this user.');
        if (message.guild.roles.comparePositions(message.member.roles.highest, taggedUser.roles.highest) <= 0) return message.channel.send('This user is higher then you. You cannot ban him.');
        if (message.guild.roles.comparePositions(message.guild.me.roles.highest, taggedUser.roles.highest) <= 0) return message.channel.send('Target user is higher then me in hierarchy. Please give me a higher role to execute it.');

        const reason = args.slice(1).join(' ');
        const dmEmb = {
            color: 'RANDOM',
            description: `You have been banned from ${message.guild.name} \n**Reason:** ${reason || 'No reason provided'}`,
            timestamp: new Date(),
            footer: {
                text: `Triggered by ${message.author.id}`,
                icon_url: `${message.guild.iconURL({ format: 'png', dynamic: true })}`,
            },
        };
        const modlogEmb = {
            title: 'Ban Case',
            color: 'GOLD',
            description: `**Offender:** ${taggedUser.user.tag} | <@!${taggedUser.user.id}>\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason || 'No reason provided'}`,
            timestamp: new Date(),
            footer: {
                text: `ID: ${taggedUser.user.id}`,
            },
        };

        await taggedUser.send({ embeds: [dmEmb] }).catch(error => console.log(error));
        await message.guild.members.ban(taggedUser.user, { days: 3, reason: `${reason || 'No reason provided'}` }).catch(err => {
            console.log(err);
            message.channel.send('Couldnt ban the user. Something went wrong!');
        });
        modlog(modlogEmb, message).catch(error => error);
        message.channel.send(`Successfully banned ${taggedUser.user.tag}`);
    },
};
