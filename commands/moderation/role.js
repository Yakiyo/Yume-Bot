module.exports = {
    name: 'role',
    description: 'adds/removes a role from a user',
    guildOnly: true,
    args: true,
    perms: 'MANAGE_ROLES',
    usage: '[target user] [role id/mention]',
    async execute(message, args) {
        let trg, role, id, rid, author, client;
        if(args[0]){
            id = args[0].replace('<@','').replace('!','').replace('>','');
        } else {
            return message.channel.send('Please provide a user id');
        }
        await message.guild.members.fetch(id).then(member => trg = member ).catch((error) => console.log(error));
        if (!trg) return message.channel.send('User is either not in this server or you gave an invalid argument.');

        await message.guild.members.fetch(message.author).then(member => author = member );
        await message.guild.members.fetch(message.client).then(member => client = member );

        if (!client.permissions.has('MANAGE_ROLES')) return message.channel.send('I do not have the required permissions to add a role to a user.')

        if (args[1]){
            rid = args[1].replace('<@&','').replace('>','');
        } else {
            return message.channel.send('Please provide a role id');
        }
        await message.guild.roles.fetch(rid)
            .then(rle => role = rle)
            .catch(error => console.log(error));

        try {
            if (!trg.roles.cache.has(`${role.id}`)){
                trg.roles.add(role.id)
                    .then(message.channel.send(`Added role **${role.name}** to **${trg.user.tag}**`));
            } else {
                trg.roles.remove(role.id)
                    .then(message.channel.send(`Removed role **${role.name}** to **${trg.user.tag}**`));
            }
        } catch (error){
            message.channel.send('Something went wrong');
            console.log(error);
        }
        

    }
}