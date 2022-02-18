module.exports = {
    name: 'ping',
    description: 'replies with pong',
    async execute(message, args) {
        await message.channel.send(`Pong! :ping_pong:`).then(sent => {sent.edit(`Pong! :ping_pong:\nUptime: ${message.client.uptime/1000} seconds\nWebsocket heartbeat: ${message.client.ws.ping}ms.\nRoundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`)})
    }
}

