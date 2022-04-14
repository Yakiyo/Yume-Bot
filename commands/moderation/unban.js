const modlog = require('../../modules/modlog.js');

module.exports = {
    name: 'unban',
    description: '',
    args: true,

    category: 'moderation',
    usage: '[user id]',
    pers: 'BAN_MEMBERS',
    async execute(message, args) {
        let taggedUser, id, client;
        if (args[0]) {
            id = args[0].replace('<@', '').replace('!', '').replace('>', '');
        }
        await message.guild.bans.fetch(id).then(member => taggedUser = member).catch((error) => error);
        await message.guild.members.fetch(message.client).then(member => client = member);
        if (!taggedUser) return message.channel.send('Couldnt find this banned user.');

        if (!client.permissions.has('BAN_MEMBERS')) return message.channel.send('I do not have the required permissions to unban a user.');
        if (taggedUser.user.id == message.author.id || taggedUser.user.id == message.client.user.id) return message.channel.send('Cannot execute command on this user.');

        const reason = args.slice(1).join(' ');

        const modloge = {
            title: 'Unban Case',
            color: 'NAVY',
            description: `**Offender:** ${taggedUser.user.tag} | <@!${taggedUser.user.id}>\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason || 'No reason provided'}`,
            timestamp: new Date(),
            footer: {
                text: `ID: ${taggedUser.user.id}`,
            },
        };

        try {
            await message.guild.members.unban(taggedUser.user, reason);
            modlog(modloge, message).catch(err => err);
            message.channel.send(`Successfully unbanned ${taggedUser.user.tag}`);
        } catch (error) {
            message.channel.send('Something went wrong and couldn\'t execute this command.');
            console.log(error);
        }
    },
};