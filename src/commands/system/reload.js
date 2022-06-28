const { SlashCommandBuilder } = require('@discordjs/builders');
const { owners } = require('../../config.json');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a slash command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload')
                .setRequired(true)),
    async execute(interaction) {
		if (!owners.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'This command can only be executed by bot dev.', ephemeral: true });
        }
        await interaction.deferReply({ ephemeral: true });
        const command = interaction.client.commands.get(interaction.options.getString('command'));
        console.log(command);
        if (!command) return await interaction.editReply('Could not find any command with that name.');
        let folder;
        if (command.category) {
            folder = command.category;
        } else {
            const commandFolders = fs.readdirSync('./src/commands');
            folder = commandFolders.find(subfolder => fs.readdirSync(`./src/commands/${subfolder}`).includes(`${command.data.name}.js`));

        }

        delete require.cache[require.resolve(`../${folder}/${command.data.name}.js`)];
        try {
            const reloaded = require(`../${folder}/${command.data.name}.js`);
            interaction.client.commands.set(reloaded.data.name, reloaded);
            return await interaction.editReply(`Command ${reloaded.data.name} was successfully reloaded`);
        } catch (error) {
            return await interaction.editReply('Something went wrong');
        }
    },
};