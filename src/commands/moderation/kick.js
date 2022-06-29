const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick from the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for banning the user')),
	async execute(interaction) {
		await interaction.deferReply();
        const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);

        if (!member) return await interaction.editReply('Invalid target user. Please provide a valid user to kick');
        if (interaction.guild.me.permissions.has('KICK_MEMBERS') == false) return await interaction.editReply('I do not have the required permission to kick users in this server.');
        if (!member.kickable) return await interaction.editReply('This user is higher then me in hierarchy. Cannot kick them');

        try {
            await member.user.send(`**Kick Notice**\n\nYou have been kicked from ${interaction.guild.name} \n**Reason:** ${interaction.options.getString('reason') || 'No reason provided'}`).catch(console.log);
            await interaction.guild.members.kick(member.user, interaction.options.getString('reason') || 'No Reason Provided');
            return await interaction.editReply(`Successfully kicked **${member.user.tag}** from the server.`);
        } catch (error) {
            console.log(error);
            return await interaction.editReply('Error when trying to kick user from server. Possible reasons: User is higher in hierarchy, missing kick perms or internal error');
        }

	},
};