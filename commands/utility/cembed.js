const sourcebin = require('sourcebin');

module.exports = {
    name: 'cembed',
    description: 'Creates an embed with JSON as arguments. Dont use this if u dont know what you\'re doing. ',
    args: true,
    category: 'utility',
    usage: '<raw JSON>',
    async execute(message, args) {
        const channel = await message.guild.channels.fetch(args[0].replace('<#', '').replace('>', ''))
            .then(res => {
                args.shift();
                return res;
            })
            .catch(() => {
                return message.channel;
            });

        if (!args.length) return message.channel.send('Please provide a JSON source or a sourcebin link');

        let embed;

        if (args[0].match(/https:\/\/sourceb\.in\/.*|https:\/\/srcb\.in\/.*/g)) {
            embed = await sourcebin.get(`${args[0]}`)
                .then(res => {
                    return JSON.parse(res.files[0].content);
                })
                .catch(() => {
                    return message.channel.send('Could not fetch the provided sourcebin file. Make sure it is a valid link.');
                });
            if (!embed) return message.channel.send('Could not fetch the provided sourcebin file. Make sure it is a valid link.');
        } else {
            embed = JSON.parse(args.join(' '));
        }
        await channel.send({ embeds: [embed] })
            .then(() => {
                return message.react('946452985368690749');
            })
            .catch(() => {
                return message.channel.send('Unexpected error. Possible reasons: Invalid JSON format or embed limit exceeded');
            });
    },
};