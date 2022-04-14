module.exports = {
    name: 'purge',
    description: 'Deletes a specified number of messages in the channel the command was used in. Can**not** delete messages older then 2 weeks due to discord limitations. Purging limit is between 2 to 100 inclusive.',
	aliases: ['prune'],
	category: 'moderation',
	args: true,
	usage: '<amount to delete>',

	perms: 'MANAGE_MESSAGES',
    async execute(message, args) {
        const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.reply('Please give a valid integer number as input.');
		} else if (amount <= 1 || amount > 100) {
			return message.reply('You need to input a number between 1 and 99.');
		}
		try {
			message.channel.bulkDelete(amount, true).then(
				message.channel.send(`Successfully deleted ${amount - 1} number of messages.`).then(msg => msg.delete({ timeout: 15000 })),
			);

		} catch (error) {
			console.log(error);
			message.channel.send('There was an unexpected problem while deleting the messages.');

		}
    },
};