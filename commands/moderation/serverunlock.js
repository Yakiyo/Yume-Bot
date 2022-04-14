module.exports = {
    name: 'serverunlock',
    description: '',
    aliases: ['sunlockdown'],
    category: 'moderation',
    perms: 'MANAGE_GUILD',

    async execute(message) {
        return message.channel.send('This command isn\'t functional yet');
    },
};