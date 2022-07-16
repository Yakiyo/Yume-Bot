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
        await interaction.reply('done');
        switch (interaction.options.getSubcommand()) {
            case 'assign': {
                return;
            }
            default:
                break;
        }
    },
};