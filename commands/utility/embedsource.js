module.exports = {
    name: 'embedsource',
    description: 'Edits a prev sent embed taking JSON as arguments',
    guildOnly: true,
    args: true,
    usage: '[channel] <message ID> ',
    async execute(message, args) {
        let trgtChannel = message.channel, trgtMsgid = args[0];
        if (args[0].includes('#')){
            trgtChannel = message.guild.channels.fetch(args[0].replace('<','').replace('#','').replace('>',''));
            trgtMsgid = args[1];
        } 
        let trgtMsg = trgtChannel.messages.fetch(`${trgtMsgid}`)
        let embedObj = trgtMsg.embeds[0];
        if (!embedObj){
            return message.channel.send('No message with that ID found.');
        }
        sourceEmbed = {
            title: 'Embed Source',
            color: 3372252,
            description: `\`\`\`${JSON.stringify(embedObj)}\`\`\``
        }
        message.channel.send({ embeds: [embedObj] });
    }
}