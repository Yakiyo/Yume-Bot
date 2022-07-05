const { SlashCommandBuilder } = require('@discordjs/builders');
const sourcebin = require('sourcebin');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('command to create/edit discord embeds')
        .addSubcommand(sub =>
            sub.setName('source')
                .setDescription('gets raw JSON for a discord embed')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('the id of the message whose embed to fetch')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('channel where the message is situated')
                        .addChannelType(0)
                        .addChannelType(5)
                        .addChannelType(10)
                        .addChannelType(11)
                        .addChannelType(12))
                .addIntegerOption(option =>
                    option.setName('number')
                        .setDescription('the number of the embed to fetch from the message')
                        .setMaxValue(10)
                        .setMinValue(1)))
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('create a simple discord embed')
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('the embed\'s description section')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('the embed\'s title section'))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('the embed\'s color section'))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('the channel to send the embed to')
                        .addChannelTypes([0, 5, 10, 11, 12])))
        .addSubcommand(sub =>
            sub.setName('custom')
                .setDescription('create a discord embed using JSON')
                .addStringOption(option =>
                    option.setName('json')
                        .setDescription('the raw json or a sourcebin link to a json file')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('the channel to send the embed to')
                        .addChannelTypes([0, 5, 10, 11, 12])))
        .addSubcommand(sub =>
            sub.setName('edit')
                .setDescription('edits an already sent embed by the bot using provided JSON')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('the message id of the message to edit')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('json')
                        .setDescription('the raw json or a sourcebin link to a json file')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('the channel where the message is situated in')
                        .addChannelTypes([0, 5, 10, 11, 12]))),
	private: false,
	async execute(interaction) {
		const subCommand = interaction.options.getSubcommand();
        if (subCommand === 'source') {
            await interaction.deferReply();
            const msgid = await interaction.options.getString('message');
            const channel = await interaction.options.getChannel('channel') || interaction.channel;
            let num = await interaction.options.getInteger('number') || 1;

            const message = await channel.messages.fetch(`${msgid}`).then(res => res).catch(() => undefined);
            if (!message) return await interaction.editReply(`Could not find any message with that id in <#${channel.id}>`);

            if (!message.embeds || !message.embeds?.length) return await interaction.editReply('The target message does not contain any embed');

            if (num > message.embeds.length) {
                num = 1;
            }
            let source = message.embeds[num - 1];
            if (!source) return await interaction.editReply('Did not find any embed in that message with that number');
            Object.keys(source).forEach((k) => source[k] == null && delete source[k]);

            source = JSON.stringify(source, null, 4);

            if (source.length <= 2000) {
                const embed = {
                    title: `Embed Source for ${message.id}`,
                    color: message.embeds[num - 1].color || 'RANDOM',
                    description: `\`\`\`${source}\`\`\``,
                };
                return await interaction.editReply({ embeds: [embed] });
            } else if (source.length > 2000) {
                const bin = await sourcebin.create([
                    {
                        content: `${source}`,
                        language: 'JSON',
                    },
                ],
                {
                    title: `Embed source for ${message.id}`,
                    description: 'Raw JSON for a discord embed',
                });
                if (!bin) return await interaction.editReply('Error while creating file on sourcebin');
                return await interaction.editReply(`Source code over 2k characters. ${bin.url}`);
            }

        } else if (subCommand === 'create') {
            const description = interaction.options.getString('description');
            const title = interaction.options.getString('title') || null;
            const color = interaction.options.getString('color') || 'RANDOM';
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            const authorPerms = channel.permissionsFor(interaction.member);
            if (!authorPerms || !authorPerms.has('SEND_MESSAGES')) return await interaction.reply({ content: 'You do not have permission to send message in the target channel', ephemeral: true });

            const embed = {
                title: title,
                color: color.toUpperCase() || 'RANDOM',
                description: description,
            };
            Object.keys(embed).forEach((k) => embed[k] == null && delete embed[k]);

            await channel.send({ embeds: [embed] });
            return await interaction.reply({ content: 'Embed sent successfully', ephemeral: true });

        } else if (subCommand === 'custom') {
            await interaction.deferReply({ ephemeral: true });
            const json = interaction.options.getString('json');
            const channel = interaction.options.getChannel('channel') || interaction.channel;
            const authorPerms = channel.permissionsFor(interaction.member);
            if (!authorPerms || !authorPerms.has('SEND_MESSAGES')) return await interaction.reply({ content: 'You do not have permission to send message in the target channel', ephemeral: true });

            let embed;
            if (json.match(/https:\/\/sourceb\.in\/.*|https:\/\/srcb\.in\/.*/g)) {
                const result = await sourcebin.get(json)
                    .then(res => (res.files[0].content))
                    .catch(() => {
                        return null;
                    });
                if (!result) return await interaction.editReply('Could not fetch the provided sourcebin URL. Please make sure it\'s a valid link and has some JSON content in it');
                try {
                    embed = JSON.parse(result);
                } catch (error) {
                    return await interaction.editReply('Invalid JSON expression.');
                }
            } else {
                try {
                    embed = JSON.parse(json);
                } catch (error) {
                    return await interaction.editReply('Invalid JSON expression.');
                }
            }

            try {
                await channel.send({ embeds: [embed] });
                return await interaction.editReply('Embed sent Successfully');
            } catch (error) {
                return await interaction.editReply('Could not send embed due to unexpected errors. Possible erros: Invalid JSON expression or breaking [discord embed limitations](https://discord.com/developers/docs/resources/channel#embed-limits \'Discord Embed Limits\')');
            }
        } else if (subCommand === 'edit') {
            await interaction.deferReply({ ephemeral: true });
            const json = interaction.options.getString('json');
            const channel = interaction.options.getChannel('channel') || interaction.channel;
            const messageId = interaction.options.getString('message');
            const message = await channel.messages.fetch(messageId).then(res => res).catch(() => null);

            if (!message) return await interaction.editReply('Could not find any message with that id in the channel');
            if (!message.embeds.length) return await interaction.editReply('The specified message does not have any embeds to edit');

            if (!message.editable) return await interaction.editReply('That message cannot be edited by the bot.');

            const authorPerms = channel.permissionsFor(interaction.member);
            if (!authorPerms || !authorPerms.has('MANAGE_MESSAGES')) return await interaction.reply({ content: 'You do not have permission to manage message in the target channel', ephemeral: true });

            let embed;
            if (json.match(/https:\/\/sourceb\.in\/.*|https:\/\/srcb\.in\/.*/g)) {
                const result = await sourcebin.get(json)
                    .then(res => (res.files[0].content))
                    .catch(() => {
                        return null;
                    });
                if (!result) return await interaction.editReply('Could not fetch the provided sourcebin URL. Please make sure it\'s a valid link and has some JSON content in it');
                try {
                    embed = JSON.parse(result);
                } catch (error) {
                    return await interaction.editReply('Invalid JSON expression.');
                }
            } else {
                try {
                    embed = JSON.parse(json);
                } catch (error) {
                    return await interaction.editReply('Invalid JSON expression.');
                }
            }

            if (!embed) return await interaction.editReply('Invalid JSON expression.');

            try {
                await message.edit({ embeds: [embed] });
                return await interaction.editReply('Successfully edited embed');
            } catch (error) {
                console.error(error);
                return await interaction.editReply('Unexpected error while editing message. Possible causes: Bot doesnt have permission to view channel, invalid JSON value, internal discord error');
            }
        }

	},
};