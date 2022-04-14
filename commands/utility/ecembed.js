module.exports = {
    name: 'ecembed',
    description: 'Ecembed denotes edit custom embed. Takes JSON as argument to edit a prev sent message by the bot.',
    aliases: ['ece', 'editcustomembed'],
    args: true,
    category: 'utility',

    perms: 'MANAGE_MESSAGES',
    usage: '[message ID] <channel> [JSON]',
    async execute(message, args) {
        let trgtChannel = message.channel, trgtMsg;
        const trgtMsgid = args[0], content = args.slice(1);
        if (args[1]) {
            await message.guild.channels.fetch(args[1].replace('<#', '').replace('>', ''))
                .then(channel => trgtChannel = channel)
                .catch(() => trgtChannel = message.channel);
        }
        if (!content.length) return message.channel.send('Please provide required arguments');
        if (trgtChannel.id !== message.channel.id) {
            content.shift();
        }
        if (trgtChannel.id === content[0].replace('<#', '').replace('>', '')) {
            content.shift();
        }
        await trgtChannel.messages.fetch(`${trgtMsgid}`).then(mess => trgtMsg = mess).catch(error => console.log(error));

        if (!trgtMsg) {
            return message.channel.send(`No message with that id found in <#${trgtChannel.id}>`);
        }
        if (!trgtMsg.embeds.length) {
            return message.channel.send('The target message doesn\'t have any embed.');
        }
        if (!trgtMsg.editable) {
            return message.channel.send('Cannot edit target message.');
        }
        const emb = JSON.parse(content.join(' '));

        try {
            await trgtMsg.edit({ embeds: [emb] })
                .then(message.channel.send('Successfully edited message'));
        } catch (error) {
            console.log(error);
            message.channel.send('Invalid JSON argument. Could not convert to embed.');
        }

    },
};