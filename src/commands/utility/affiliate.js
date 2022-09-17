const { SlashCommandBuilder, blockQuote } = require('@discordjs/builders');
const { affiliate } = require('../../config.json').channels;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('affiliate')
        .setDescription('Create\'s a new affiliation post')
        .addStringOption(option =>
            option.setName('invite')
                .setDescription('The invite link to the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('A description of the server')
                .setRequired(true)),
    async execute(interaction) {
        if (!affiliate) return await interaction.reply({ content: 'No affiliate channel set. This module is probably disabled!', ephemeral: true });
        await interaction.deferReply();
        const invite = await interaction.client.fetchInvite(interaction.options.getString('invite')).catch(() => null);

        if (!invite) return await interaction.editReply('Invalid invite link. Please provide a valid invite link');
        if (invite.expiresTimestamp) return await interaction.editReply('Provided invite is not a permanent invite. Please provide an invite that will not expire');
        const channel = await interaction.client.channels.fetch(affiliate);

        await channel.send(`:small_blue_diamond: **${invite.guild.name}** \n\nhttps://discord.gg/${invite.code} \n\n${blockQuote(interaction.options.getString('description') + '\n')}`);

        return await interaction.editReply('Successfully added server to affiliates <:greenTick:946452985368690749>');
    },
};
