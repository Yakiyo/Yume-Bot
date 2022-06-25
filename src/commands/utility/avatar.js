const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Give\'s a user\'s default or server avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Optional user whose avatar to show'))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Default or server avatar to show')
                .addChoice('Default', 'DEFAULT')
                .addChoice('Server', 'SERVER')),
    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.options.getUser('user') || interaction.user);
        const type = interaction.options.getString('type') || 'DEFAULT';
        const embed = {
            title: `Avatar for ${member.user.tag}`,
            color: 7506394,
            fields: [],
            image: {},
            footer: {
                text: 'Generated on',
            },
            timestamp: new Date(),
        };
        if (type === 'SERVER') {
            embed.fields.push({
                name: 'Links as',
                value: `[png](${member.displayAvatarURL({ format: 'png', dynamic: false })}) | [jpg](${member.displayAvatarURL({ format: 'jpg', dynamic: false })}) | [webp](${member.displayAvatarURL({ format: 'webp', dynamic: false })})`,
            });
            embed.image.url = member.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
        } else {
            embed.fields.push({
                name: 'Links as',
                value: `[png](${member.user.avatarURL({ format: 'png', dynamic: false })}) | [jpg](${member.user.avatarURL({ format: 'jpg', dynamic: false })}) | [webp](${member.user.avatarURL({ format: 'webp', dynamic: false })})`,
            });
            embed.image.url = member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
        }
        await interaction.reply({ embeds: [embed] });
    },
};