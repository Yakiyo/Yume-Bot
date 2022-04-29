module.exports = {
    name: 'addemoji',
    description: 'adds an emoji to the server',
    aliases: ['steal'],
    usage: '<emoji name> <image link>',
    perms: 'MANAGE_EMOJIS_AND_STICKERS',
    category: 'utility',
    args: true,
    async execute(message, args) {
        const name = args[0];
        const url = args[1] || null;

        if (!url) return message.channel.send('Please provide an image link.');
        if (!/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi.test(url)) return message.channel.send('Second argument does not seem to match a valid image link expression!');

        if (message.guild.me.permissions.has('MANAGE_EMOJIS_AND_STICKERS') == false) return message.channel.send('I do not have the required permissions to add emojis in this server.');
        return await message.guild.emojis.create(url, name)
                .then(emoji => {
                    message.channel.send(`Successfully created emoji with name **${emoji.name}**`);
                })
                .catch(() => {
                     message.channel.send('Error while creating emoji. \nPossible Reasons: Image file too big, invalid file type, maximum emoji limit for the server.');
                });
    },
};