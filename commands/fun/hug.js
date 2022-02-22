const { fetchNeko } = require("nekos-best.js");

module.exports = {
    name: 'hug',
    description: 'Gives a hug gif',
    usage: '<optional user id/mention>',
    category: 'fun',
    guildOnly: true,
    aliases: ['hugs'],
    async execute(message, args) {
        let hug, target;
        await fetchNeko('hug').then(obj => hug = obj).catch(error => console.log(error));
        if(!hug) return message.channel.send('API request failure.');
        if (Boolean(args[0]) && args[0] != '') {
            id = args[0].replace('<@','').replace('!','').replace('>','');
            try {
                await message.guild.members.fetch(id).then(dude => target = dude);
            } catch(error) {
                target = null;
                console.log(error);
            }
        }
        const emb = {
        	color: 15277667,
        	title: 'Hugs',
        	description: `Lonely <@!${message.author.id}> is hugging himself`,
        	image: {
        		url: `${hug.url}`
        	},
            fields: [],
        	footer: {
        		text: `Powered by nekos.best`,
        		icon_url: 'https://i.imgur.com/IMhljcr.png'
        	}
        }
        if(Boolean(hug.anime_name)) {
            emb.fields[0] = { name: 'Source', value: `${hug.anime_name}`}
        }
        if (Boolean(target)) {
            emb.description = `<@!${message.author.id}> hugs <@!${target.user.id}>.`
        }
        try {
        	message.channel.send({embeds:[emb]});
        } catch (error){
        	message.channel.send('Error');
        }
    }
}