module.exports = {
    name: 'embedsource',
    description: 'Fetches the json source of an embed.',
    guildOnly: true,
    args: true,
    category: 'utility',
    aliases: ['esc'],
    usage: '[message ID] <channel>',
    async execute(message, args) {
        let trgtChannel = message.channel, trgtMsgid = args[0], trgtMsg;
        if (args[1]){
            await message.guild.channels.fetch(args[1].replace('<','').replace('#','').replace('>',''))
                .then(channel => trgtChannel = channel)
                .catch(error => console.log(error));
        } 
        if (!trgtChannel){
            return message.channel.send('Couldn\'t fetch that channel');
        }
        await trgtChannel.messages.fetch(`${trgtMsgid}`).then(mess => trgtMsg = mess).catch(error => console.log(error));
        
        if (!trgtMsg){
            return message.channel.send(`Provided argument isnt a valid snowflake/message id`);
        }
        if (!trgtMsg.embeds.length){
            return message.channel.send('The target message doesn\'t have any embed.')
        }
        let embedObj = trgtMsg.embeds[0];
        if (!embedObj){
            return message.channel.send('That message doesn\'t contain any embed');
        }
        Object.keys(embedObj).forEach((k) => embedObj[k] == null && delete embedObj[k]);
        sourceEmbed = {
            title: 'Embed Source',
            color: 3372252,
            description: `\`\`\`${JSON.stringify(embedObj, null, 4)}\`\`\``
        }
        message.channel.send({ embeds: [sourceEmbed] });

        
    }
}