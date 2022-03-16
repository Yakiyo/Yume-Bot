module.exports = {
    name: 'serverlock',
    description: '',
    category: 'moderation',
    aliases: ['lockdown'],
    perms: 'MANAGE_GUILD',
    async execute(message, args) {
        return message.channel.send('This command isn\'t functional yet');
    }
}