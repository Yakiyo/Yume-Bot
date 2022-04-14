module.exports = {
    name: 'unlock',
    description: 'Unlocks down a channel, as in returns message sending perms for neutral.',
    category: 'moderation',
    usage: '[channel to unlock]',
    perms: 'MODERATE_MEMBERS',
    aliases: ['unlockdown'],

    async execute(message, args) {
        let trgtChannel = message.channel;
        if (args[1]) {
            await message.guild.channels.fetch(args[1].replace('<', '').replace('#', '').replace('>', ''))
                .then(channel => trgtChannel = channel)
                .catch(error => console.log(error));
        }

        if (!trgtChannel) return message.channel.send('Invalid channel mentioned.');
        if (!trgtChannel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) return message.channel.send('Insufficient permissions. Require **Manage Channel** permissions to run this command');
        try {
                trgtChannel.permissionOverwrites.edit(trgtChannel.guild.roles.everyone, {
                SEND_MESSAGES: null,
                ADD_REACTIONS: null,
                CREATE_PUBLIC_THREADS: null,
            }).then(() => {
                return message.channel.send(`Successfully unlocked <#${trgtChannel.id}> <:greenTick:946452985368690749>`);
            });
        } catch (err) {
            console.log(err);
            return message.channel.send('Could not unlock the channel. <:redCross:946453057053544449>');
        }
    },
};