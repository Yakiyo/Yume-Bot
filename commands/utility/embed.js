const { Embed } = require("@discordjs/builders");

module.exports = {
    name: 'embed',
    description: 'Creates an embed with JSON as arguments. Dont use this if u dont know what you\'re doing. ',
    args: true,
    category: 'utility',
    guildOnly: true,
    usage: '<title> | <description>',
    async execute(message, args) {
        const arr = args.join(' ').split('|');
        const title = arr[0], desc = arr.slice(1).join('').trim();
        const newEmbed = {
            color: 3158326,
            title: `${title}`,
            description: `${desc}`
        };
        message.channel.send({ embeds: [newEmbed] });
    }
}