const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp', 'av'],
    description: 'Gives the command user\'s default discord avatar. ',
    usage: '[user mention]',
    category: 'utility',

    async execute(message, args) {
        let taggedUser;
        if (args[0]) {
            taggedUser = await getUser(args[0], message);
        }
        console.log(taggedUser);
        if (!taggedUser || taggedUser == undefined) {
            taggedUser = await getUser(`${message.author.id}`, message);
        }
        console.log(taggedUser);
        try {
            const avEmbed = {
                color: 7506394,
                title: `Avatar for ${taggedUser.user.tag}`,
                fields: [
                    {
                        name: 'Links as:',
                        value: `[png](${taggedUser.user.avatarURL({ format: 'png', dynamic: false })}) | [jpg](${taggedUser.user.avatarURL({ format: 'jpg', dynamic: false })}) | [webp](${taggedUser.user.avatarURL({ format: 'webp', dynamic: false })})`,
                    },
                ],
                image: {
                    url: `${taggedUser.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })}`,
                },
                timestamp: new Date(),
                footer: {
                    text: 'Generated on',
                },
            };
            return message.channel.send({ embeds: [avEmbed] });
        } catch (error) {
            console.log(error);
            return message.channel.send('Error');
        }

    },
};