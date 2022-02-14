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
        let taggedUser, id,author, client;
        if(args[0]){
            id = args[0].replace('<@','').replace('!','').replace('>','');
        }
        await message.guild.members.fetch(id).then(member => taggedUser = member ).catch((error) => console.log(error));
        await message.guild.members.fetch(message.client).then(member => client = member )
        const numero = message.guild.roles.comparePositions(client.roles.highest, taggedUser.roles.highest)
        message.channel.send(`${numero}`);
    }
}