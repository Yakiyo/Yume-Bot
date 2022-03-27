
module.exports = {
    name: 'join',
    description: 'testing greet message',
    guildOnly: true,
    aliases: ['testgreet'],
    category: 'system',
    async execute(message, args) {
        if (message.author.id !== '695307292815654963'){
            return message.channel.send('This command is only to be used by the bot owner.')
        }

        message.client.emit('guildMemberAdd', message.member);
    }
}