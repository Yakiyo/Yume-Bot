const { blockQuote } = require('@discordjs/builders');

module.exports = {
    name: 'affiliate',
    description: 'Adds a new affiliate with the server in <#844148747343757342>',

    args: true,
    category: 'moderation',
    aliases: ['partner', 'aff'],
    usage: '[invite link] [description...]',
    perms: 'MANAGE_GUILD',
    async execute(message, args) {
        let invite, pchan;
        try {
            await message.client.fetchInvite(`${args[0].replace('<', '').replace('>', '')}`).then(res => invite = res);
        } catch (error) {
            console.log(error);
            return message.channel.send(`Provided argument **${args[0]}** isnt a valid guild invite. Please provide a permanent invite link`);
        }
        if (invite.expiresTimestamp != 0) return message.channel.send('This invite is not permanent.');
        const description = args.slice(1).join(' ');
        if (!description.length) return message.channel.send('Please give at least some description.');

        await message.client.channels.fetch('844148747343757342').then(chanel => pchan = chanel).catch(error => console.log(error));

        const context = `:small_blue_diamond: **${invite.guild.name}** \n\nhttps://discord.gg/${invite.code} \n\n${blockQuote(description + '\n')}`;
        try {
            await pchan.send(`${context}`).then(message.channel.send('Affiliate added :white_check_mark:'));
        } catch (error) {
            message.channel.send('Something went wrong :x:');
            console.log(error);
        }

    },
};