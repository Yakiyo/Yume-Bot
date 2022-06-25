module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.log(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({ content: 'There was an unexpected error in executing the command!' });
                } else {
                    return await interaction.reply({ content: 'Internal error when executing the command!', ephemeral: true });
                }
            }
        }
    },
};