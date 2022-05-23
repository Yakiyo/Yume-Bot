const shorten = require('../../modules/shorten.js');
// command guide : https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/examples/making-an-eval-command.md
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

    // Send off the cleaned up result
    return text;
};

module.exports = {
    name: 'eval',
    description: 'Super OP eval() command for bot dev only',

    aliases: ['evaluate'],
    category: 'system',
    args: true,
    async execute(message, args) {
        if (message.author.id !== '695307292815654963') return message.channel.send('Inaccessible command. <:redCross:946453057053544449>');

        let cleaned;
        try {
            // Evaluate (execute) our input
            const evaled = eval(args.join(' '));

            // Put our eval result through the function
            // we defined above
            cleaned = await clean(evaled);

            // Reply in the channel with our result
            message.channel.send(`\`\`\`js\n${shorten(cleaned, 1900)}\n\`\`\``);
          } catch (err) {
            // Reply in the channel with our error
            message.channel.send(`\`ERROR\` \`\`\`xl\n${shorten(cleaned, 1900)}\n\`\`\``).catch(error => {
                console.log(error);
                message.channel.send('Something went wrong X');
            });
          }
    },
};