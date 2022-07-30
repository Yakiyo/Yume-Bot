const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Set of commands for role management')
        .addSubcommand(sub =>
            sub.setName('assign')
                .setDescription('Adds or removes a role from a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to assign the role to')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to assign to the user')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('Create\'s a new role')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name of the role to be created')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color of the role to be created'))
                .addBooleanOption(option =>
                    option.setName('mentionable')
                        .setDescription('Wether this role should be mentionable or not'))
                .addBooleanOption(option =>
                    option.setName('hoisted')
                        .setDescription('Wether the role should be hoisted or not')))
        .addSubcommand(sub =>
            sub.setName('delete')
                .setDescription('Delete\'s a role')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to delete')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for deleting the role')))
        .addSubcommand(sub =>
            sub.setName('edit')
                .setDescription('Edits a role\'s name or color or both')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to edit')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The new name of the role (if any)'))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The new color of the role (if any)')))
        .addSubcommand(sub =>
            sub.setName('info')
                .setDescription('Provide\'s general information on a role')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role whose information to show')
                        .setRequired(true))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() !== 'info') {
            if (!hasPerm(interaction, 'MANAGE_ROLES')) return await interaction.editReply('You do not have the required permissions to use this subcommand.');
        }
        await interaction.deferReply();
        switch (interaction.options.getSubcommand()) {
            case 'assign': {
                const user = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
                const role = interaction.options.getRole('role'); console.log(interaction.channel.permissionsFor(interaction.member));

                if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return await interaction.editReply('I do not have the required permissions to add a role to a user.');
                if (role.id === interaction.guild.id) return await interaction.editReply('Provided role argument is the everyone role. Everyone role cannot be assigned or removed. Please use a regular role.');
                else if (role.managed) return await interaction.editReply('Provided role argument is a managed role. Please use a role that is not managed by a bot or discord.');
                // This needs to be changed in v14. Should be less then 0.
                else if (role.comparePositionTo(interaction.guild.me.roles.highest) > 0) return await interaction.editReply('Argument role is higher then the bot\'s highest role. Please give me a higher role');
                else if (role.comparePositionTo(interaction.member.roles.highest) > 0) return await interaction.editReply('Argument role is higher then the user\'s highest role. You cannot edit this role.');
                try {
                    if (!user.roles.cache.has(role.id)) {
                        await user.roles.add(role.id);
                        return await interaction.editReply(`Successfully added role **${role.name}** to **${user.user.tag}**`);
                    } else {
                        await user.roles.remove(role.id);
                        return await interaction.editReply(`Successfully removed role **${role.name}** from **${user.user.tag}**`);
                    }
                } catch (error) {
                    console.error(error);
                    return await interaction.editReply('Unexpected error while trying to assign role from user. Possible reasons: Missing role permissions, unable to edit roles etc.');
                }

            }
            case 'create': {
                const color = interaction.options.getString('color') || '#000000';
                if (!/^#([0-9a-f]{3}){1,2}$/i.test(color)) return await interaction.editReply('Provided color does not seem to be a valid hexcode. Please use a valid hex or leave it empty for default color.');
                try {
                    const role = await interaction.guild.roles.create({
                        name: interaction.options.getString('name'),
                        color: color,
                        mentionable: interaction.options.getBoolean('mentionable') || false,
                        hoist: interaction.options.getBoolean('hoisted') || false,
                    }).then(val => val);
                    return await interaction.editReply({ embeds: [{
                        title: 'Successfully created role!',
                        color: role.color,
                        description: `Created role **${role.name}** <@&${role.id}>\n\n**Color:** ${role.hexColor}\n**Mentionable:** ${role.mentionable}\n**Hoisted:** ${role.hoist}`,
                        footer: {
                            text: `ID: ${role.id}`,
                        },
                    }] });
                } catch (error) {
                    console.error(error);
                    return await interaction.editReply('Unexpected error while creating role. Possible reasons: lacking permissions or internal error.');
                }
            }
            case 'delete': {
                const role = interaction.options.getRole('role');
                if (role.comparePositionTo(interaction.guild.me.roles.highest) > 0) return await interaction.editReply('Argument role is higher then the bot\'s highest role. Please give me a higher role');
                try {
                    await role.delete(`${interaction.options.getString('reason') || 'No reason provided'} - ${interaction.user.id}`);
                    return await interaction.editReply(`Deleted role **${role.name}**`);
                } catch (error) {
                    console.error(error);
                    return await interaction.editReply('Unexpected error while trying to delete role. Possible reasons: lacking permissions or role higher then the bot\'s highest role.');
                }
            }
            case 'edit': {
                return;
            }
            case 'info': {
                const role = await interaction.guild.roles.fetch(interaction.options.getRole('role')?.id, { force: true });

                const embed = {
                    title: 'Role Info',
                    color: role.color,
                    description: `**Name:** ${role.name}\n**Members:** ${role.members.size}\n**Color:** ${role.hexColor}\n**Position:** ${role.position}`,
                    footer: {
                        text: `ID: ${role.id} | Created on`,
                    },
                    timestamp: role.createdAt,
                };
                if (role.icon) {
                    embed.thumbnail = { url: role.iconURL({ size: 1024 }) };
                }
                return await interaction.editReply({ embeds: [embed] });
            }
            default:
                return await interaction.editReply('Unknown subcommand. Please report this issue to bot developer.');
        }
    },
};

/**
     * Checks for permission of a interaction member
     * @param {Interaction} interaction
     * @param {string} perm
     * @returns boolean
     */
function hasPerm(interaction, perm) {
    const authorPerms = interaction.channel.permissionsFor(interaction.member);
            if (!authorPerms || !authorPerms.has(perm)) return false;
            else return true;
}