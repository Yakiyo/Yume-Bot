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
                        .setDescription('Reason for unbanning the user')))
        .addSubcommand(sub =>
            sub.setName('hack')
                .setDescription('Bans a user using an id. Useful if user is not in server')
                .addStringOption(option =>
                    option.setName('user')
                        .setDescription('Id of the user to ban.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for banning the user'))),
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
                    color: 14507859,
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
        } else if (subCommand === 'remove') {
            const user = await interaction.guild.bans.fetch(interaction.options.getString('user')).then(ban => ban?.user).catch(() => null);
            if (!user) return await interaction.editReply('No banned user with that id found. Make sure you\'re using a valid user id who has been previously banned');
            try {
                await interaction.guild.members.unban(user, interaction.options.getString('reason') || 'No Reason Provided');
                await modlog(interaction.client, {
                    title: 'Unban Case',
                    color: 5496228,
                    timestamp: new Date(),
                    footer: {
                        text: `ID: ${user.id}`,
                    },
                    description: `**Offender:** ${user.tag} | <@!${user.id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${interaction.options.getString('reason') || 'No reason provided'}`,
                });
                return await interaction.editReply(`Successfully unbanned ${user.tag}`);
            } catch (error) {
                console.log(error);
                return await interaction.editReply('Unexpected internal error. Could not unban user successfully. Please check console for error');
            }
        } else if (subCommand === 'hack') {
            const id = interaction.options.getString('user');
            try {
                await interaction.guild.bans.create(id, {
                    reason: interaction.options.getString('reason') || 'No Reason Provided',
                });
            } catch (error) {
                console.log(error);
                return await interaction.editReply('Error when attempting to ban. Please make sure provided argument is a valid user id');
            }
            await modlog(interaction.client, {
                title: 'Ban Case - (H)',
                color: 14507859,
                timestamp: new Date(),
                footer: {
                    text: `ID: ${id}`,
                },
                description: `**Offender:** <@!${id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${interaction.options.getString('reason') || 'No reason provided'}`,
            });
            return await interaction.editReply(`Successfully banned user with id ${id}`);
        }
    },
};