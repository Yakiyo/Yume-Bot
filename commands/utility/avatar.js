module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp', 'av'],
    description: 'Gives the command user\'s default discord avatar. ',
    usage: '[user mention]',
    category: 'utility',
    guildOnly: true,
    async execute(message, args) {
        let taggedUser, id;
        id = message.author.id;
        if(args[0]){
            id = args[0].replace('<@','').replace('!','').replace('>','');
        }
        await message.guild.members.fetch(id).then(member => taggedUser = member.user ).catch((error) => taggedUser = message.author)

        const avEmbed = {
            color: 7506394,
            title: `Avatar for ${taggedUser.tag}`,
            fields: [
                {
                    name: 'Links as:',
                    value: `[png](${taggedUser.avatarURL({ format: 'png', dynamic: false })}) | [jpg](${taggedUser.avatarURL({ format: 'jpg', dynamic: false })}) | [webp](${taggedUser.avatarURL({ format: 'webp', dynamic: false })})`
                }
            ],
            image: {
                url: `${taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 })}`,
            },
            timestamp: new Date(),
            footer: {
                text: 'Generated on',
            }
        }
        message.channel.send({ embeds: [avEmbed] });
    }
}