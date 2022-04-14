const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'role',
    description: 'adds/removes a role from a user',

    category: 'moderation',
    args: true,
    perms: 'MANAGE_ROLES',
    usage: '[target user] [role id/mention]',
    async execute(message, args) {
        let trg, role;
        if (args[0]) {
            trg = await getUser(args[0], message);
        }

        if (!trg || trg == undefined) return message.channel.send('User is either not in this server or you gave an invalid argument.');

        const clnt = await getUser(`${message.client.user}`, message);
        if (clnt.permissions.has('MANAGE_ROLES') == false) return message.channel.send('I do not have the required permissions to add a role to a user.');

        if (args[1]) {
            role = await message.guild.roles.fetch(args[1].replace('<@&', '').replace('>', '')).then(rle => rle).catch(err => console.log(err));
        } else {
            return message.channel.send('Please provide a role id');
        }

        if (!role || role == undefined || role == null) return message.channel.send('Invalid role provided');

        if (role.managed) return message.channel.send('The role is managed by an external service/bot or is the server booster role. Cannot assign it to users manually');
        try {
            if (!trg.roles.cache.has(`${role.id}`)) {
                trg.roles.add(role.id)
                    .then(message.channel.send(`Added role **${role.name}** to **${trg.user.tag}**`));
            } else {
                trg.roles.remove(role.id)
                    .then(message.channel.send(`Removed role **${role.name}** to **${trg.user.tag}**`));
            }
        } catch (error) {
            message.channel.send('Something went wrong');
            console.log(error);
        }


    },
};