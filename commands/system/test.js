const getUser = require('../../modules/getUser.js');
const modlog = require('../../modules/modlog.js');

module.exports = {
    name: 'test',
    description: 'Owner only test running command',
    guildOnly: true,
    category: 'system',
    args: false,
    aliases: ['demo'],
    async execute(message, args) {
        if (message.author.id != '695307292815654963'){
            return message.channel.send('This command is only usable by the bot owner.');
        }
        const emb = {
            title: 'Test',
            description: 'test'
        } 
        modlog(emb, message).catch(console.log);
        return message.channel.send(`Code execution complete`);
    }
}