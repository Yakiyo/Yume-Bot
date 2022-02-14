module.exports = {
    name: 'kick',
    description: 'Kicks a mentioned user, duh',
    args: true,
    guildOnly: true,
    usage: '<user mention/id>',
    perms: 'KICK_MEMBERS',
    async execute(message, args) {
        let taggedUser, id, author, client;
        if(args[0]){
            id = args[0].replace('<@','').replace('!','').replace('>','');
        }
        await message.guild.members.fetch(id).then(member => taggedUser = member ).catch((error) => console.log(error));
        await message.guild.members.fetch(message.author).then(member => author = member )
        await message.guild.members.fetch(message.client).then(member => client = member )
        if (!taggedUser) return message.channel.send('User is either not in this server or you gave an invalid argument.');
        
        if (taggedUser.user.id == message.author.id || taggedUser.user.id == '941217579584851979') return message.channel.send('Cannot execute kick on this user.');

        const numero = message.guild.roles.comparePositions(author.roles.highest, taggedUser.roles.highest);
        if (numero != 1) return message.channel.send('This user is higher then you. You cannot kick him.');
        if ( message.guild.roles.comparePositions(client.roles.highest, taggedUser.roles.highest) != 1) return message.channel.send('Target user is higher then me in hierarchy. Please give me a higher role to execute it.');

        const reason = args.slice(1).join(' ');
        const dmEmb = {
            color: 'RANDOM',
            description: `You have been kicked from ${message.guild.name} \n`,
            timestamp: new Date(),
            footer: {
                text: `Triggered by ${message.author.id}`,
                icon_url: `${message.guild.iconURL({ format: 'png', dynamic: true })}`
            }
        }
        const modlog = {
            title: 'Kick Case',
            color: 'GREEN',
            description: `**Offender:** <@!${taggedUser.user.id}>\n**Moderator:** ${message.author.tag}\n`,
            timestamp: new Date(),
            footer: {
                text: `ID: ${taggedUser.user.id}`
            }
        }
        if(reason != ''){
            dmEmb.description += `**Reason:** ${reason}`;
            modlog.description += `**Reason:** ${reason}`;
        }
        console.log(reason);
        try {
            taggedUser.send({ embeds: [dmEmb] }).catch(error => console.log(error));
            await taggedUser.kick();
            message.client.channels.cache.get('853524796213690369').send({ embeds: [modlog] });
            message.channel.send(`Successfully kicked ${taggedUser.user.tag}`);
        } catch (error) {
            console.log(error), message.channel.send('Couldnt kick the user. Something went wrong!')
        }
        
       

        
    }
}