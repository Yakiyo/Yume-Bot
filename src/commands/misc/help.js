const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command for the bot')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Name of command to get details about')),
    async execute(interaction) {
        const commandName = interaction.options.getString('command') || null;

        if (commandName) {
            const commands = await interaction.guild.commands.fetch();
            const command = commands.find(com => com.name === commandName.toLowerCase());
            if (!command) return await interaction.reply('No command with that name found.');
            const options = [];

            options.push(command.options.filter(option => option.type === 'SUB_COMMAND').map(subCommand => ({ name: `/${command.name} ${subCommand.name}`, value: `${subCommand.description}` })));

            const embed = {
                color: 15277667,
                title: `Help menu for ${command.name}`,
                fields: options,
                description: command.description,
                footer: {
                    text: `Requested by ${interaction.user.tag}`,
                },
            };

            return await interaction.reply({ embeds: [embed] });
        } else {
            const { commands } = interaction.client;
            const categories = new Collection();
            commands.forEach(element => {
                const category = categories.get(element.category);

                if (category) {
                    category.set(element.data.name, element);
                } else {
                    categories.set(element.category, new Collection().set(element.data.name, element));
                }
            });

            const fields = categories.map(cat => {
                return {
                    name: cat.first().category,
                    value: cat.map(com => `\`${com.data.name}\``).join(', '),
                };
            });
            const embed = {
                title: 'Help Menu',
                color: 15277667,
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.avatarURL(),
                },
                fields: fields,
                footer: {
                    text: 'Generated on',
                },
                timestamp: new Date(),
            };
            return await interaction.reply({ embeds: [embed] });
        }
    },
};