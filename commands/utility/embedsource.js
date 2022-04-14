const sourcebin = require('sourcebin');

module.exports = {
    name: 'embedsource',
    description: 'Fetches the json source of an embed.',

    args: true,
    category: 'utility',
    aliases: ['esc'],
    usage: '[message ID] <channel>',
    async execute(message, args) {
        let trgtChannel = message.channel, trgtMsg;
        const trgtMsgid = args[0];
        if (args[1]) {
            await message.guild.channels.fetch(args[1].replace('<', '').replace('#', '').replace('>', ''))
                .then(channel => trgtChannel = channel)
                .catch(error => console.log(error));
        }
        if (!trgtChannel) {
            return message.channel.send('Couldn\'t fetch that channel');
        }
        await trgtChannel.messages.fetch(`${trgtMsgid}`).then(mess => trgtMsg = mess).catch(error => console.log(error));

        if (!trgtMsg) {
            return message.channel.send('Provided argument isnt a valid snowflake/message id');
        }
        if (!trgtMsg.embeds.length) {
            return message.channel.send('The target message doesn\'t have any embed.');
        }
        const embedObj = trgtMsg.embeds[0];
        if (!embedObj) {
            return message.channel.send('That message doesn\'t contain any embed');
        }
        Object.keys(embedObj).forEach((k) => embedObj[k] == null && delete embedObj[k]);
        const json = JSON.stringify(embedObj, null, 4);
        if (json.length <= 2000) {
            const sourceEmbed = {
                title: 'Embed Source',
                color: 3372252,
                description: `\`\`\`${json}\`\`\``,
            };
            return message.channel.send({ embeds: [sourceEmbed] });
        } else if (json.length > 2000) {
            const bin = await sourcebin.create(
                [
                    {
                        content: `${json}`,
                        language: 'JSON',
                    },
                ],
                {
                    title: 'Embed source',
                    description: 'embed source for a discord embed',
                },
            );
            return message.channel.send(`Embed source over 2k characters. ${bin.url}`);
        }
    },
};