const { prisma } = require('../structs/db.js');

module.exports = {
    name: 'kill',
    async execute(client) {
        await prisma.$disconnect();
        const channel = await client.channels.fetch('844253443510239262');
        return channel.send('ending');
    },
};