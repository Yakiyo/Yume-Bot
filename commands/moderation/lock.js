module.exports = {
    name: 'lock',
    description: 'Locks down a channel, as in removes message sending perms for users.',
    category: 'moderation',
    usage: '[channel to lock]',
    perms: 'MODERATE_MEMBERS',
    aliases: ['lockdown'],

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
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                CREATE_PUBLIC_THREADS: false,
            }).then(() => {
                return message.channel.send(`Successfully locked <#${trgtChannel.id}> <:greenTick:946452985368690749>`);
            });
        } catch (err) {
            console.log(err);
            return message.channel.send('Could not lock the channel. <:redCross:946453057053544449>');
        }
    },
};