module.exports = {
    name: 'serverlock',
    description: '',
    category: 'moderation',
    aliases: ['lockdown'],
    guildOnly: true,
    perms: 'MANAGE_GUILD',
    async execute(message) {
        return message.channel.send('This command isn\'t functional yet');
    },
};