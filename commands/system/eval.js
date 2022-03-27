// command guide : https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/examples/making-an-eval-command.md
const clean = async (text) => {
    if (text && text.constructor.name == "Promise") {
        text = await text;
    }
    if (typeof text !== "string") {
        text = require("util").inspect(text, { depth: 1 });
    }
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));

    // Send off the cleaned up result
    return text;
}

module.exports = {
    name: 'eval',
    description: 'Super OP eval() command for bot dev only',
    guildOnly: true,
    aliases: ['evaluate'],
    category: 'system',
    args: true,
    async execute(message, args) {
        if (message.author.id !== '695307292815654963') return message.channel.send('Inaccessible command. <:redCross:946453057053544449>');

        try {
          
            const evaled = eval(args.join(" ")) || 'no return value';

            let cleaned = await clean(evaled) || 'Nothing to return here(?)';

            message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
        } catch (err) {
        
            message.channel.send(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``);
        }
    }
}