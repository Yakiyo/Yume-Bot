const { time } = require('@discordjs/builders');
const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'user',
    description: 'shows some infos about the user of the command',
    aliases: ['info', 'whois'],

    category: 'utility',
    async execute(message, args) {
        let member;
        if (args[0]) {
            member = await getUser(args[0], message);
        }

        if (!member || member == undefined) {
            member = message.member;
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
            };
            if (message.guild.roles.premiumSubscriberRole && roles.includes(`<@&${message.guild.roles.premiumSubscriberRole.id}>`)) {
                embed.fields.splice(2, 0, { name: 'Server Booster!', value: `<@&${message.guild.roles.premiumSubscriberRole.id}>`, inline: true });
            } else if (roles.includes('<@&844136794977992705>')) {
                embed.fields.splice(2, 0, { name: 'Server Administrator!', value: '<@&844136794977992705>', inline: true });
            } else if (roles.includes('<@&844233565310812190>')) {
                embed.fields.splice(2, 0, { name: 'Server Moderator!', value: '<@&844233565310812190>', inline: true });
            }
            return message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            return message.channel.send('Some huge bombs busted and the command failed to ran. Pls report it to dev!');

        }


    },
};