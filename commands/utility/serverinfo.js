module.exports = {
    name: 'serverinfo',
    description: 'Gives the server name, id, and owner',
    guildOnly: true,
    async execute(message, args) {
        message.channel.send(`Server name: ${message.guild.name} \nServer ID: ${message.guild.id} \nOwned by: <@!${message.guild.ownerId}>`);
    }
}