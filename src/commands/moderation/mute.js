const { SlashCommandBuilder } = require('@discordjs/builders');
const parse = require('parse-duration');
const { modlog } = require('../../util.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Commands to mute or unmute users')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Mutes a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to mute')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('duration')
                        .setDescription('The duration to mute the user')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for muting the user')))
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Unmutes a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to unmute')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for unmuting the user'))),
    async execute(interaction) {
        await interaction.deferReply();
        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) return await interaction.editReply('I do not have the required permissions to ban or unban users.');
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case 'add': {
                const user = await interaction.guild.members.fetch(interaction.options.getUser('user'));
                const time = parse(interaction.options.getString('duration'), 'ms');
                if (!time) return await interaction.editReply('Invalid time format. Please provide a duration.');
                if (!user.moderatable) return await interaction.editReply('This user is higher then me in hierarchy. Cannot timeout them');
                await user.timeout(time, interaction.options.getString('reason') || 'No Reason provided');
                await modlog(interaction.client, {
                    title: 'Mute Case',
                    color: 16025922,
                    description: `**Offender:** ${user.user.id} | <@!${user.user.id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${interaction.options.getString('reason') || 'No reason provided'}\n**Duration:** ${new Date(time).toISOString().slice(11, 19)}`,
                });
                return await interaction.editReply(`Successfully timed out **${user.user.tag}** for ${new Date(time).toISOString().slice(11, 19)} duration`);
            }

            case 'remove': {
                const user = await interaction.guild.members.fetch(interaction.options.getUser('user'));
                if (!user.isCommunicationDisabled()) return await interaction.editReply('Target user is not timed out. Cannot untimeout.');
                if (!user.moderatable) return await interaction.editReply('This user is higher then me in hierarchy. Cannot untimeout them');
                await user.timeout(null, interaction.options.getString('reason') || 'No Reason provided');
                await modlog(interaction.client, {
                    title: 'Unmute Case',
                    color: 4388007,
                    description: `**Offender:** ${user.user.id} | <@!${user.user.id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${interaction.options.getString('reason') || 'No reason provided'}\n`,
                });
                return await interaction.editReply(`Successfully untimed out **${user.user.tag}**`);
            }
            default:
                return await interaction.editReply('Unknown subcommand used. :x:');
        }
    },
};