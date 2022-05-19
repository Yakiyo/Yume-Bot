const { SlashCommandBuilder } = require('@discordjs/builders');
const { owners } = require('../../config.json');
const { shorten } = require('../../util.js');

const clean = async (text) => {
	if (text && text.constructor.name == 'Promise') {
		text = await text;
	}

	if (typeof text !== 'string') {
		text = require('util').inspect(text, { depth: 1 });
	}

	const tokenRegex = new RegExp(process.env.TOKEN, 'g');
	text = text
		.replace(/`/g, '`' + String.fromCharCode(8203))
		.replace(/@/g, '@' + String.fromCharCode(8203))
		.replace(tokenRegex, '[Bot-Token]');

	return shorten(text, 1800);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Super awesome eval command for the dev')
		.addStringOption(option =>
            option.setName('code')
                .setDescription('the code to be executed')
                .setRequired(true),
        ),
    private: true,
	async execute(interaction) {
		await interaction.deferReply();

		if (!owners.includes(interaction.user.id)) {
            return await interaction.editReply({ content: 'This command can only be executed by bot dev.', ephemeral: true });
        }

		let cleaned;
		try {
			const evaled = eval(interaction.options.getString('code'));
			cleaned = await clean(evaled);
			return await interaction.editReply(`\`\`\`js\n${cleaned}\n\`\`\``);
		} catch (error) {
			return await interaction.editReply(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``);
		}

	},
};