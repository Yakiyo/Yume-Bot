const { SlashCommandBuilder, time } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Show\'s info about a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose info to show')),
	private: false,
	async execute(interaction) {
		const member = await interaction.guild.members.fetch(interaction.options.getUser('user') || interaction.user);
        let roles = member.roles.cache.filter(role => role.id !== interaction.guild.id).map(val => `<@&${val.id}>`);
        if (roles.length > 15) {
            roles = roles.slice(0, 15);
        }
        const embed = {
            author: {
                name: member.user.tag,
                icon_url: member.user.avatarURL({ format: 'png', dynamic: true }),
            },
            color: member.roles.highest.color || 7506394,
            thumbnail: {
                url: member.displayAvatarURL({ format: 'png', dynamic: true }),
            },
            fields: [
                {
                    name: 'Nickname',
                    value: `${member.displayName === member.user.username ? 'None' : member.displayName}`,
                    inline: true,
                },
                {
                    name: 'Created at',
                    value: `${time(member.user.createdAt)}`,
                    inline: true,
                },
                {
                    name: 'Joined at',
                    value: `${time(member.joinedAt)}`,
                    inline: true,
                },
                {
                    name: 'Roles',
                    value: roles.join(', ') || 'No Roles',
                },
            ],
            footer: {
                text: `ID: ${member.user.id}. Generated on`,
            },
            timestamp: new Date(),
        };
        return await interaction.reply({ embeds: [embed] });
	},
};