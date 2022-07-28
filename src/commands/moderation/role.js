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
                        .setRequired(true)))
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
        await interaction.deferReply();
        switch (interaction.options.getSubcommand()) {
            case 'assign': {
                const user = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
                const role = interaction.options.getRole('role');

                if (role.id === interaction.guild.id) return await interaction.editReply('Provided role argument is the everyone role. Everyone role cannot be assigned or removed. Please use a regular role.');
                else if (role.managed) return await interaction.editReply('Provided role argument is a managed role. Please use a role that is not managed by a bot or discord.');
                // else if (role.editable) return await interaction.editReply('Provided role argument cannot be edited by the bot. Please give me a higher position than the role.');
                else if (role.comparePositionTo(interaction.client) < 0) return await interaction.editReply('Argument role is higher then the bot\'s highest role. Please give me a higher role');
                try {
                    if (!user.roles.cache.has(role.id)) {
                        await user.roles.add(role.id);
                    } else {
                        await user.roles.remove(role.id);
                    }
                } catch (error) {
                    return await interaction.editReply('Unexpected error while trying to assign role from user.');
                }
                return await interaction.editReply(`Successfully assigned role **${role.name}** to/from **${user.user.tag}**`);
            }
            default:
                break;
        }
    },
};