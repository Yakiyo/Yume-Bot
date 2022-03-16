module.exports = {
    name: 'serverunlock',
    description: '',
    aliases: ['sunlockdown'],
    category: 'moderation',
    perms: 'MANAGE_GUILD',
    async execute(message, args) {
        return message.channel.send('This command isn\'t functional yet');
    }
}