const { SlashCommandBuilder, quote } = require('@discordjs/builders');
const { serverlogs } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('resends ur message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('string to send')
                .setRequired(true),
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Select a channel to send the message in (optional)')
            .addChannelType(0)
            .addChannelType(5)
            .addChannelType(10)
            .addChannelType(11)
            .addChannelType(12),
        ),
	async execute(interaction) {
		const sentence = interaction.options.getString('message');
        const channel = await interaction.options.getChannel('channel') || interaction.channel ;

        const authorPerms = channel.permissionsFor(interaction.member);
        if (!authorPerms || !authorPerms.has('SEND_MESSAGES')) return await interaction.reply({ content: 'You do not have permission to send message in the target channel', ephemeral: true });

        const message = await channel.send(`${sentence}`).then(sent => sent);
        await interaction.reply({ content: 'Message Successfully sent!', ephemeral: true });
        const logChannel = await interaction.client.channels.fetch(serverlogs).then(chan => chan);
        const logEmbed = {
            author: {
                name: interaction.user.tag,
                icon_url: interaction.user.avatarURL(),
            },
            color: 'RANDOM',
            title: 'Echo Command used',
            description: `Sent in <#${message.channelId}> | [Jump Link](${message.url})\nContents:\n${quote(sentence)}`,
            timestamp: message.createdAt,
        };
        return logChannel.send({ embeds: [logEmbed] });
	},
};