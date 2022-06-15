const { SlashCommandBuilder } = require('@discordjs/builders');
const { modlog } = require('../../util.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban related commands')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Bans a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to ban')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for banning the user')))
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Removes ban from a user')
                .addStringOption(option =>
                    option.setName('user')
                        .setDescription('Id of the user to remove ban of.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for unbanning the user'))),
	async execute(interaction) {
		await interaction.deferReply();
        if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) return await interaction.editReply('I do not have the required permissions to ban or unban users.');
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === 'add') {
            const user = await interaction.guild.members.fetch(interaction.options.getUser('user').id);

            if (interaction.guild.roles.comparePositions(interaction.member.roles.highest, user.roles.highest) <= 0) return await interaction.editReply('This user is higher then you. You cannot ban him.');
            if (!user.moderatable) return await interaction.editReply('This user is higher then me in hierarchy. Cannot ban them');
            const dmEmbed = {
                color: '#303136',
                title: 'Ban Notice',
                description: `You have been banned from ${interaction.guild.name} \n**Reason:** ${interaction.options.getString('reason') || 'No reason provided'}\n**Ban Appeal:** [Click here](https://forms.gle/MC5i6iqAfFrbGu6Y9) *(One time only form)*`,
                footer: {
                    text: `Triggered by ${interaction.user.id}`,
                    icon_url: `${interaction.guild.iconURL({ format: 'png', dynamic: true })}`,
                },
            };
            await user.user.send({ embed: [dmEmbed] }).catch(error => console.log(error));
            try {
                await interaction.guild.members.ban(user.user, {
                    days: 3,
                    reason: interaction.options.getString('reason') || 'No reason provided',
                });
                await modlog(interaction.client, {
                    title: 'Ban Case',
                    color: 'GOLD',
                    timestamp: new Date(),
                    footer: {
                        text: `ID: ${user.user.id}`,
                    },
                    description: `**Offender:** ${user.user.tag} | <@!${user.user.id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${interaction.options.getString('reason') || 'No reason provided'}`,
                });
                return await interaction.editReply(`Successfully banned ${user.user.tag}`);
            } catch (error) {
                console.log(error);
                return await interaction.editReply('Unexpected internal error. Could not successfully ban user. Please check console for error information');
            }
        }
    },
};