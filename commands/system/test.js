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
        if(args[0]){
            id = args[0].replace('<@','').replace('!','').replace('>','');
        } else {
            return message.channel.send('invalid id');
        }
        await message.guild.members.ban(id)
            .then(message.channel.send(`Banned <@!${id}>`))
        
    }
}