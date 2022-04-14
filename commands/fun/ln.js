const shorten = require('../../modules/shorten.js');
const capitalize = require('../../modules/capitalize.js');
const fetch = require('node-fetch');

const query = `
query ($search: String) {
  Media(search: $search, type: MANGA, format: NOVEL) {
    id
    type
    format
    siteUrl
    title {
      romaji
      english
      native
    }
    volumes
    chapters
    genres
    coverImage {
      extraLarge
    }
    status(version: 2)
    description(asHtml: true)
    averageScore
    isLicensed
    meanScore
  }
}
`;

module.exports = {
    name: 'ln',
    description: 'Searches the anilist database for the novel with the provided name',

    args: true,
    category: 'fun',
    usage: '[ln name to search]',
    aliases: ['novel', 'light-novel', 'ranobe'],
    async execute(message, args) {
      	let novel;
		const url = 'https://graphql.anilist.co',
      	variables = {
      		search: args.join(' '),
      	};

      	const options = {
        	method: 'POST',
        	headers: {
            	'Content-Type': 'application/json',
            	'Accept': 'application/json',
        	},
        	body: JSON.stringify({
            	query: query,
            	variables: variables,
        	}),
    	};


try {
	await fetch(url, options).then(handleResponse).then(handleData);
} catch (error) {
  return message.channel.send(`Couldn't find any light novel with the name **${args.join(' ')}**`);
}

		function handleResponse(response) {
		    return response.json().then(function(json) {
		        return response.ok ? json : Promise.reject(json);
		    });
		}

		function handleData(data) {
			novel = data.data.Media;
		}

				const titles = [];
				for (const name in novel.title) {
					if (novel.title[name]) {
						titles.push(novel.title[name]);
					}
				}
        const genre = novel.genres.join(', ') || '??';

        const responseEmb = {
        	color: [26, 178, 207],
        	author: {
        		name: `${novel.title.romaji}`,
        		icon_url: 'https://anilist.co/img/logo_al.png',
        		url: `https://anilist.co/manga/${novel.id}`,
        	},
        	thumbnail: {
        		url: `${novel.coverImage.extraLarge}`,
        	},
        	description: `${shorten(novel.description).replace(/[\r\n ]{2,}/gm, '\n').replace(/\\\\n/g, '\r\n')}`,
        	footer: {
        		text: `Licensed: ${novel.isLicensed ? 'Yes' : 'No'}`,
        	},
        	fields: [
        	{
        		name: 'Titles',
        		value: `${titles.join(', ')}`,
        		inline: false,
        	},
        	{
        		name: 'Type',
        		value: `${capitalize(novel.type)}`,
        		inline: true,
        	},
        	{
        		name: 'Format',
        		value: `${capitalize(novel.format)}`,
        		inline: true,
        	},
        	{
        		name: 'Status',
        		value: `${capitalize(novel.status)}`,
        		inline: true,
        	},
        	{
        		name: 'Ratings',
        		value: `${novel.meanScore + '%' || '??'}`,
        		inline: true,
        	},
        	{
        		name: 'Volumes',
        		value: `${novel.volumes || '??'}`,
        		inline: true,
        	},
        	{
        		name: 'Chapters',
        		value: `${novel.chapters || '??'}`,
        		inline: true,
        	},
        	{
        		name: 'Genres',
        		value: `${genre}`,
        		inline: false,
        	},
        	],
        	timestamp: new Date(),
        };

        try {
        	return message.channel.send({ embeds: [responseEmb] });
        } catch (error) {
        	console.log(error);
			return message.channel.send('Unexpected error occurred. Please try again later or report it to the mods.');
        }
    },
};