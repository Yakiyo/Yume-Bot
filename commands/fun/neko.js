const { fetchNeko } = require("nekos-best.js");

module.exports = {
    name: 'neko',
    description: 'Gives a neko image',
    guildOnly: true,
    aliases: ['cat'],
    async execute(message, args) {
        let neko;
        await fetchNeko('nekos').then(res => neko = res).catch(error => console.log(error));
        if(!neko) return message.channel.send('API request failure.'); 

        const emb = {
        	title: 'Here\'s a neko for you.',
        	color: 15277667,
        	description: `Image Source: [link](${neko.source_url} 'Source') || Artist: [${neko.artist_name}](${neko.artist_href} 'Artist')`,
        	image: {
        		url: `${neko.url}`
        	},
        	footer: {
        		text: `Powered by nekos.best`,
        		icon_url: 'https://i.imgur.com/IMhljcr.png'
        	}
        }
        try {
        	message.channel.send({embeds:[emb]});
        } catch (error){
        	message.channel.send('Error on executing the command');
        	console.log(error);
        }
    }
}