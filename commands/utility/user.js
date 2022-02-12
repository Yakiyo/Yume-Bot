module.exports = {
    name: 'user',
    description: 'shows some infos about the user of the command',
    aliases: ['info', 'whois'],
    guildOnly: true,
    async execute(message, args) {
        /* const user = message.author;
        const time = user.createdTimestamp;
        message.channel.send(`Username: ${user.tag} \nDate of creation: <t:${time}:F>`); */
        const user = message.mentions.members.first();
        if (!user){
            member = message.guild.members.resolve(message.author.id);
        } else {
            member = message.guild.members.resolve(user.id);
        } 
        const roles = [];
        member.roles.cache.forEach(role => roles.push(`<@&${role.id}>`));
        const embed = {
            author: {
                name: `${member.tag}`,
            },
            color: 'RANDOM',
            thumbnail: {
                url: `${member.displayAvatarURL({ format: 'png', dynamic: true })}`,
            },
            fields: [
            {
                name: 'Created at: ',
                value: `${member.createdAt}`,
                inline: true,
            },
            {
                name: 'Joined at: ',
                value: `<t:${member.joinedTimestamp}:F>`,
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
        message.channel.send({ embeds: [embed] });

    }
}