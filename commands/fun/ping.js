module.exports = {
    name: 'ping',
    description: 'replies with pong',
    async execute(message, args) {
        await message.channel.send(`Pong! :ping_pong:`).then(sent => {sent.edit(`Pong! :ping_pong:\nWebsocket heartbeat: ${message.client.ws.ping}ms.\nRoundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`)})
    }
}

//\nWebsocket heartbeat: ${message.client.ws.ping}ms.