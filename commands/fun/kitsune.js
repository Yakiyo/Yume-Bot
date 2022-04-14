const { fetchRandom } = require('nekos-best.js');


module.exports = {
    name: 'kitsune',
    description: 'Gives a kitsune/fox-girl image',

    category: 'fun',
    aliases: ['fox'],
    async execute(message) {
        let fox;
        await fetchRandom('kitsune').then(res => fox = res.results[0]).catch(error => console.log(error));
        if (!fox) return message.channel.send('API request failure.');

        const emb = {
        	title: 'Here\'s a fox for you.',
        	color: 15277667,
        	description: `Image Source: [link](${fox.source_url || 'https://nekos.best'} 'Source') || Artist: [${fox.artist_name}](${fox.artist_href} 'Artist')`,
        	image: {
        		url: `${fox.url}`,
        	},
        	footer: {
        		text: 'Powered by nekos.best',
        		icon_url: 'https://i.imgur.com/IMhljcr.png',
        	},
        };
        try {
        	message.channel.send({ embeds:[emb] });
        } catch (error) {
        	message.channel.send('Error on executing the command');
        	console.log(error);
        }
    },
};