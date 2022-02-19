const { fetchNeko } = require("nekos-best.js");

module.exports = {
    name: 'hug',
    description: 'Gives a hug gif',
    guildOnly: true,
    aliases: ['hugs'],
    async execute(message, args) {
        let hug;
        await fetchNeko('hug').then(obj => hug = obj).catch(error => console.log(error));
        if(!hug) return message.channel.send('API request failure.');
        
        const emb = {
        	color: 15277667,
        	title: 'Hugs',
        	description: `Source: ${hug.anime_name}`,
        	image: {
        		url: `${hug.url}`
        	},
        	footer: {
        		text: `Powered by nekos.best`,
        		icon_url: 'https://i.imgur.com/IMhljcr.png'
        	}
        }
        try {
        	message.channel.send({embeds:[emb]});
        } catch (error){
        	message.channel.send('Error');
        }
    }
}