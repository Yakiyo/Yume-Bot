module.exports = {
    name: 'test',
    description: 'Owner only test running command',
    guildOnly: true,
    aliases: [],
    perms: '',
    async execute(message, args) {
        if (message.author.id != '695307292815654963'){
            return message.channel.send('This command is only usable by the bot owner.');
        }
        message.guild.channels.cache.get('844103225183043636').send('Yume Bot on! <:corporalmizuto:845137729729462302> ')
        
    }
}