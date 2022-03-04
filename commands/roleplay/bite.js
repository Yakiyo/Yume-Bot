const { fetchRandom } = require("nekos-best.js");
const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'bite',
    description: 'Gives a bite gif',
    usage: '<optional user id/mention>',
    category: 'fun',
    guildOnly: true,
    aliases: [],
    async execute(message, args) {
        let hug, target;
        await fetchRandom('bite').then(obj => hug = obj.results[0]).catch(error => console.log(error));
        if(!hug) return message.channel.send('API request failure.');
        const list = [];
        if(args) {
            for ( let i = 0; i < args.length; i++){
                await getUser(args[i], message).then(trgt => {
                    if (trgt){
                        list.push(`<@!${trgt.id}>`);
                    }
                }).catch(err => console.log(err));
            }
        }
        const emb = {
            color: 15277667,
            title: '',
            description: `<@!${message.author.id}> needs something to bite`,
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
            emb.description = `<@!${message.author.id}> bites ${list.join(', ')}.`
        }
        try {
            message.channel.send({embeds:[emb]});
        } catch (error){
            message.channel.send('Error');
        }
    }
}