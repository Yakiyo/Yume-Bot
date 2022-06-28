// const path = require('node:path');
module.exports = {
    name: 'reload',
    description: 'Reloads ur code to detect changes for commands. **Bot Owner** Only.',
    args: true,
    async execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.textCommands.get(commandName);
        if (!command) {
            return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
        }

        delete require.cache[require.resolve(`./${command.name}`)];
        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.textCommands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
    },
};