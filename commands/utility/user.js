const { time } = require('@discordjs/builders')

module.exports = {
    name: 'user',
    description: 'shows some infos about the user of the command',
    aliases: ['info', 'whois'],
    guildOnly: true,
    category: 'utility',
    async execute(message, args) {
        let member, id;
        id = message.author.id;
        if(args[0]){
            id = args[0].replace('<@','').replace('!','').replace('>','');
        }
        try {
            await message.guild.members.fetch(id).then(dude => member = dude);
        } catch (error) {
            await message.guild.members.fetch(message.author).then(dude => member = dude);
        }

        
        try {
            const roles = [];
            await member.roles.cache.forEach(role => roles.push(`<@&${role.id}>`));
            const embed = {
                author: {
                    name: `${member.user.tag}`,
                },
                color: member.roles.highest.color || 7506394,
                thumbnail: {
                    url: `${member.displayAvatarURL({ format: 'png', dynamic: true }) }`,
                },
                fields: [
                {
                    name: 'Created at: ',
                    value: `${time(member.user.createdAt)}`,
                    inline: true,
                },
                {
                    name: 'Joined at: ',
                    value: `${time(member.joinedAt)}`,
                    inline: true,
                },
                {
                    name: 'Roles',
                    value: `${roles.join(' ')}`,
                    inline: false,
                }],
                footer: {
                    text: `ID: ${member.id}`,
                },
                timestamp: new Date(),
            }
            if(roles.includes(`<@&${message.guild.roles.premiumSubscriberRole.id}>`)) {
                embed.fields.splice(2, 0, { name: 'Server Booster!',value: `<@&${message.guild.roles.premiumSubscriberRole.id}>`, inline: true})
            } else if(roles.includes(`<@&844136794977992705>`)) {
                embed.fields.splice(2, 0, { name: 'Server Administrator!',value: `<@&844136794977992705>`, inline: true})
            } else if(roles.includes(`<@&844233565310812190>`)) {
                embed.fields.splice(2, 0, { name: 'Server Moderator!',value: `<@&844233565310812190>`, inline: true})
            }
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            return message.channel.send('Some huge bombs busted and the command failed to ran. Pls report it to dev!');
            console.log(error);
        }

    }
}