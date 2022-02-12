module.exports = {
    name: 'kick',
    description: 'Kicks a mentioned user, duh',
    args: true,
    guildOnly: true,
    usage: '<mention user>',
    perms: 'KICK_MEMBERS',
    async execute(message, args) {
        let taggedUser = message.mentions.users.first();
        if (!taggedUser){
            message.channel.send('Mention a user to kick.');
        }
        try {
            taggedUser.kick().then(
                message.channel.send(`U kicked ${taggedUser.username}`));
        }
        catch (error){
            message.channel.send('The target is either higher then u or me in hierarchy or something just went wrong :x:')
        }
    }
}