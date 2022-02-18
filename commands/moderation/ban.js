module.exports = {
    name: 'ban',
    description: 'bans the user with the mention/id.',
    args: true,
    guildOnly: true,
    usage: '[user id/mention] <reason>',
    perms: 'BAN_MEMBERS',
    async execute(message, args) {
        let taggedUser, id, author, client;
        if(args[0]){
            id = args[0].replace('<@','').replace('!','').replace('>','');
        }
        await message.guild.members.fetch(id).then(member => taggedUser = member ).catch((error) => console.log(error));
        await message.guild.members.fetch(message.author).then(member => author = member )
        await message.guild.members.fetch(message.client).then(member => client = member )
        if (!taggedUser) return message.channel.send('User is either not in this server or you gave an invalid argument.');
        
        if (!client.permissions.has('BAN_MEMBERS')) return message.channel.send('I do not have the required permissions to ban a user.')
        if (taggedUser.user.id == message.author.id || taggedUser.user.id == message.client.user.id) return message.channel.send('Cannot execute kick on this user.');

        if (message.guild.roles.comparePositions(author.roles.highest, taggedUser.roles.highest) <= 0) return message.channel.send('This user is higher then you. You cannot kick him.');
        if (message.guild.roles.comparePositions(client.roles.highest, taggedUser.roles.highest) <= 0) return message.channel.send('Target user is higher then me in hierarchy. Please give me a higher role to execute it.');

        const reason = args.slice(1).join(' ');
        const dmEmb = {
            color: 'RANDOM',
            description: `You have been banned from ${message.guild.name} \n**Reason:** ${reason || 'No reason provided'}`,
            timestamp: new Date(),
            footer: {
                text: `Triggered by ${message.author.id}`,
                icon_url: `${message.guild.iconURL({ format: 'png', dynamic: true })}`
            }
        }
        const modlog = {
            title: 'Ban Case',
            color: 'GOLD',
            description: `**Offender:** ${taggedUser.user.tag} | <@!${taggedUser.user.id}>\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason || 'No reason provided'}`,
            timestamp: new Date(),
            footer: {
                text: `ID: ${taggedUser.user.id}`
            }
        }
        
        console.log(reason);
        try {
            taggedUser.send({ embeds: [dmEmb] }).catch(error => console.log(error));
            await taggedUser.ban({ days: 3, reason: `${reason || 'No reason provided'}` });
            message.client.channels.cache.get('853524796213690369').send({ embeds: [modlog] });
            message.channel.send(`Successfully banned ${taggedUser.user.tag}`);
        } catch (error) {
            console.log(error), message.channel.send('Couldnt ban the user. Something went wrong!')
        }
    }
}