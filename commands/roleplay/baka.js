const { fetchNeko } = require("nekos-best.js");
const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'baka',
    description: 'Gives a baka gif',
    usage: '<optional user id/mention>',
    category: 'fun',
    guildOnly: true,
    aliases: [],
    async execute(message, args) {
        let hug, target;
        await fetchNeko('baka').then(obj => hug = obj).catch(error => console.log(error));
        if(!hug) return message.channel.send('API request failure.');
        const list = [];
        if(args) {
            for ( let i = 0; i < args.length; i++){
                await getUser(args[i], message).then(trgt => {
                    if (trgt != undefined){
                        list.push(`<@!${trgt.id}>`);
                    }
                }).catch(err => console.log(err));
            }
        }
        const emb = {
        	color: 15277667,
        	title: 'Baka',
        	description: `<@!${message.author.id}> is calling himself baka`,
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
        if (list.length) {
            emb.description = `<@!${message.author.id}> calls ${list.join(', ')} baka.`
        }
        try {
        	message.channel.send({embeds:[emb]});
        } catch (error){
        	message.channel.send('Error');
        }
    }
}