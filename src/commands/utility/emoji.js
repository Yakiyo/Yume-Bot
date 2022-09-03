const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Emoji management commands for the server')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Adds an emoji to the server')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name of the emoji to be added')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription('Link of the image to be used for the emoji')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Removes an emoji from the server')
                .addStringOption(option =>
                    option.setName('emoji')
                        .setDescription('The emoji to remove. Can be the emoji itself or an emoji id.')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('rename')
                .setDescription('Renames an emoji in the server')
                .addStringOption(option =>
                    option.setName('emoji')
                        .setDescription('The emoji to rename. can be the emoji itself or an emoji id')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The new name for the emoji')
                        .setRequired(true))),
    async execute(interaction) {
        if (interaction.guild.me.permissions.has('MANAGE_EMOJIS_AND_STICKERS') == false) return interaction.reply({ content: 'I do not have the required permissions to add emojis in this server.', epehemeral: true });
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case 'add': {
                const name = interaction.options.getString('name').replace(/ +/, '_');
                const link = interaction.options.getString('image');
                if (!/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi.test(link)) return interaction.reply({ content: 'Second argument does not seem to be a valid image link. Please provide a link to a png/jpg/webp/gif file.', epehemeral: true });
                interaction.deferReply();
                try {
                    const emoji = await interaction.guild.emojis.create(link, name);
                    return interaction.editReply(`Successfully created emoji with name **${emoji.name}**`);
                } catch (error) {
                    console.log(error);
                    return await interaction.editReply('Error while creating emoji. \nPossible Reasons: Image file too big, invalid file type, maximum emoji limit for the server or invalid characters in emoji name.');
                }

            }
            case 'remove': {
                let name;
                if (interaction.options.getString('emoji').startsWith('<:') && interaction.options.getString('emoji').endsWith('>')) {
                    name = interaction.options.getString('emoji').replace('<:', '').replace('>', '');
                    name = name.slice(name.indexOf(':') + 1);
                } else {
                    name = interaction.options.getString('emoji');
                }
                const emoji = await interaction.guild.emojis.fetch(name).catch(() => null);
                if (!emoji) return await interaction.reply({ content: 'Invalid emoji argument. Could not resolve to an emoji. Please make sure to either use the emoji itself or the emoji id \n https://i.imgur.com/iVUe5o0.gif', epehemeral: true });
                await interaction.deferReply();
                await interaction.guild.emojis.delete(emoji);
                return await interaction.editReply('Successfully deleted the emoji.');
            }
            case 'rename': {
                let name;
                if (interaction.options.getString('emoji').startsWith('<:') && interaction.options.getString('emoji').endsWith('>')) {
                    name = interaction.options.getString('emoji').replace('<:', '').replace('>', '');
                    name = name.slice(name.indexOf(':') + 1);
                } else {
                    name = interaction.options.getString('emoji');
                }
                const emoji = await interaction.guild.emojis.fetch(name).catch(() => null);
                if (!emoji) return await interaction.reply({ content: 'Invalid emoji argument. Could not resolve to an emoji. Please make sure to either use the emoji itself or the emoji id \n https://i.imgur.com/iVUe5o0.gif', epehemeral: true });
                await interaction.deferReply();
                const edited = await interaction.guild.emojis.edit(emoji, { name: interaction.options.getString('name').replace(/ +/, '_') });
                return await interaction.editReply(`Renamed emoji to ${edited.name}`);
            }
            default:
                return await interaction.reply({ content: 'Unknown subcommand encountered. Please report this issue to bot dev', ephemeral: true });
        }
    },
};