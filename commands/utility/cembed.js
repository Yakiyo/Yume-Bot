module.exports = {
    name: 'cembed',
    description: 'Creates an embed with JSON as arguments. Dont use this if u dont know what you\'re doing. ',
    guildOnly: true,
    args: true,
    category: 'utility',
    usage: '<raw JSON>',
    async execute(message, args) {
        /* try {
            const embedObj = JSON.parse(args.join(' '));
            message.channel.send({ embeds: [embedObj]});
        } catch (error) {
            message.channel.send('Could not parse that JSON :x:');
        }*/
        let trgtChannel = message.channel, content = args.slice(0);
        await message.guild.channels.fetch(args[0].replace('<#', '').replace('>', ''))
            .then(chan => {
                trgtChannel = chan;
                content = args.slice(1);
            })
            .catch(error => {
                console.log(error);
                trgtChannel = message.channel;
            });
        if (!content.length) return message.channel.send('Please provide required arguments');

        const emb = JSON.parse(content.join(' '));
        trgtChannel.send({ embeds: [emb] }).catch(err => console.log(err)).then(message.react('946452985368690749'));
    },
};