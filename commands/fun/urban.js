const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = {
    name: 'urban',
    description: 'Returns a search from [Urban Dictionary](https://www.urbandictionary.com/)',

    category: 'fun',
    args: true,
    aliases: [],
    async execute(message, args) {
        const query = querystring.stringify({ term: args.join(' ') });

        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
        						.then(response => response.json())
        						.catch(error => console.log(error));

        if (!list.length) return message.channel.send(`No results found for ${args.join()}`);

        const result = {
        	color: 1548647,
        	title: 'Urban Dictionary Search Results',
        	url: `${list[0].permalink}`,
        	thumbnail: {
        		url: 'https://i.imgur.com/kjkLbAW.png',
        	},
        	description: `**Word**\n ${list[0].word}\n\n**Description**\n${list[0].definition}`,
        	fields: [{
        		name: 'Example',
        		value: `${list[0].example}`,
        		inline: false,
        	}],
        	footer: {
        		text: `Author: ${list[0].author}`,
        		icon_url: `${message.author.avatarURL({ format: 'png', dynamic: true })}`,
        	},
        };
        try {
        	message.channel.send({ embeds: [result] });
        } catch (error) {
        	message.channel.send('Unexpected error while running the command');
        	console.log(error);
        }
    },
};