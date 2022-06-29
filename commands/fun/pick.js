module.exports = {
    name: 'pick',
    description: 'Chooses a random option from the ones provided by user. Separate options by commas ( , )',
    guildOnly: false,
    aliases: ['random', 'choose'],
    usage: '[option 1], [option 2], <option n>',
    perms: undefined,
    args: true,
    category: 'fun',
    async execute(message, args) {
        const options = args.join(' ').split(',');

        if (options.length < 2) return message.channel.send('Please provide more then one option. Options are separated throough commas (, )');

        const chosen = options[Math.floor(Math.random() * options.length)];

        const embed = {
            color: '#e91e63',
            description: `**Option picked:** ${chosen}`,
        };
        return message.channel.send({ embeds: [embed] });
    },
};