module.exports = {
    name: 'cembed',
    description: 'Creates an embed with JSON as arguments. Dont use this if u dont know what you\'re doing. ',
    guildOnly: true,
    args: true,
    category: 'utility',
    usage: '<raw JSON>',
    async execute(message, args) {
        try {
            const embedObj = JSON.parse(args.join(' '));
            message.channel.send({ embeds: [embedObj]});
        } catch (error) {
            message.channel.send('Could not parse that JSON :x:');
        }
    }
}