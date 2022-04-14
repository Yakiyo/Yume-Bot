module.exports = {
    name: 'embed',
    description: 'Send\'s a discord embed. Separate embed title and description with `|`. Description part is optional. ',
    args: true,
    category: 'utility',
    aliases: ['emb'],

    usage: '[title] | [description]',
    async execute(message, args) {
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

        const contentNew = content.join(' ').split('|');
        const emb = {
            title: `${contentNew[0]}`,
            description: `${contentNew.slice(1)}`,
            color: 'RANDOM',
        };
        trgtChannel.send({ embeds: [emb] }).catch(err => {
            console.log(err);
            message.channel.send('Something went wrong!');
        }).then(message.react('946452985368690749'));
    },
};