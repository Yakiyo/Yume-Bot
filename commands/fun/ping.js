module.exports = {
    name: 'ping',
    description: 'replies with pong',
    async execute(message, args) {
        await message.reply('Pong! :ping_pong:')
    }
}