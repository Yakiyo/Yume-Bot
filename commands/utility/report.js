const { time } = require('@discordjs/builders');

module.exports = {
    name: 'report',
    description: 'Sends a report to the mod channel. The original message gets deleted. Can add an optional image attachement',

    args: true,
    aliases: [],
    usage: '<report to make> [additional image attachement]',
    perms: undefined,
    category: 'utility',
    async execute(message, args) {
        const chan = await message.client.channels.fetch('962044593342402650');
        const report = args.join(' ');

        const reportEmbed = {
            color: 13632027,
            title: 'New Report',
            author: {
                name: `${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL()}`,
            },
            description: `${report}`,
            fields: [
                {
                name: 'User Info',
                value: `**Name**: ${message.author.tag}\n**Joined at:** ${time(message.member.joinedTimestamp)}\n**Created at**: ${time(message.author.createdTimestamp)}\n**Sent in:** <#${message.channel.id}> [Jump to context](${message.url})`,
                },
            ],
            image: {},
            footer: {
                text: `Author id: ${message.author.id}`,
            },
        };

        if (message.attachments.size) {
            const picFile = message.attachments.first();
            console.log(picFile.contentType);
            if (/image\/*/.test(picFile.contentType)) {
                reportEmbed.image.url = picFile.url;
            }
        }
        await message.delete();
        return await chan.send({ embeds: [reportEmbed] });
    },
};