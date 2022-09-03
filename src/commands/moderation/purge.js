const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete\'s specified number of messages in the channel')
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('The Number of messages to delete. Must be more then 2 and less then 100')
                .setMaxValue(100)
                .setMinValue(2)
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('Initiating purge ......');
        try {
            const deleted = await interaction.channel.bulkDelete(interaction.options.getNumber('number') + 1, true);
            return await interaction.channel.send(`Successfully deleted ${deleted.size} messages`);
        } catch (error) {
            console.log(error);
            return await interaction.channel.send('Internal error when trying to delete messages. Possible reasons: Missing permissions or messages older then two weeks.');
        }
    },
};