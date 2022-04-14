const { fetchRandom } = require('nekos-best.js');
const getUser = require('../../modules/getUser.js');

module.exports = {
    name: 'poke',
    description: 'Gives a poking gif',
    usage: '<optional user id/mention>',
    category: 'roleplay',

    aliases: [],
    async execute(message, args) {
        let hug;
        await fetchRandom('poke').then(obj => hug = obj.results[0]).catch(error => console.log(error));
        if (!hug) return message.channel.send('API request failure.');
        const list = [];
        if (args) {
            for (let i = 0; i < args.length; i++) {
                await getUser(args[i], message).then(trgt => {
                    if (trgt) {
                        list.push(`<@!${trgt.id}>`);
                    }
                }).catch(err => console.log(err));
            }
        }
        const emb = {
            color: 15277667,
            title: 'Pokes',
            description: `<@!${message.author.id}> pokes`,
            image: {
                url: `${hug.url}`,
            },
            fields: [],
            footer: {
                text: 'Powered by nekos.best',
                icon_url: 'https://i.imgur.com/IMhljcr.png',
            },
        };
        if (hug.anime_name) {
            emb.fields[0] = { name: 'Source', value: `${hug.anime_name}` };
        }
        if (list.length) {
            emb.description = `<@!${message.author.id}> pokes ${list.join(', ')}.`;
        }
        try {
            message.channel.send({ embeds:[emb] });
        } catch (error) {
            message.channel.send('Error');
        }
    },
};