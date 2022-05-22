const shorten = require('../../modules/shorten.js');
const capitalize = require('../../modules/capitalize.js');
const fetch = require('node-fetch');

const query = `
query ($search: String) {
  Media(search: $search, type: ANIME) {
    id
    type
    format
    siteUrl
    title {
      romaji
      english
      native
    }
    episodes
    season
    genres
    seasonYear
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
    name: 'anime',
    description: 'Searches the anilist database for the anime with the provided name',

    args: true,
    category: 'fun',
    usage: '[anime name to search]',
    async execute(message, args) {
      	let manga;
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
  return message.channel.send(`Couldn't find any manga with the name **${args.join(' ')}**`);
}

		function handleResponse(response) {
		    return response.json().then(function(json) {
		        return response.ok ? json : Promise.reject(json);
		    });
		}

		function handleData(data) {
			manga = data.data.Media;
		}

				const titles = [];
				for (const name in manga.title) {
					if (manga.title[name]) {
						titles.push(manga.title[name]);
					}
				}
        const genre = manga.genres.join(', ') || '??';

        const responseEmb = {
        	color: [26, 178, 207],
        	author: {
        		name: `${manga.title.romaji}`,
        		icon_url: 'https://anilist.co/img/logo_al.png',
        		url: `https://anilist.co/anime/${manga.id}`,
        	},
        	thumbnail: {
        		url: `${manga.coverImage.extraLarge}`,
        	},
        	description: `${shorten(manga.description).replace(/[\r\n ]{2,}/gm, '\n').replace(/\\\\n/g, '\r\n')}`,
        	footer: {
        		text: `${manga.seasonYear ? `Aired in: ${manga.seasonYear}` : '....'}`,
        	},
        	fields: [
        	{
        		name: 'Titles',
        		value: `${titles.join(', ')}`,
        		inline: false,
        	},
        	{
        		name: 'Type',
        		value: `${capitalize(manga.type)}`,
        		inline: true,
        	},
        	{
        		name: 'Format',
        		value: `${capitalize(manga.format)}`,
        		inline: true,
        	},
        	{
        		name: 'Status',
        		value: `${capitalize(manga.status)}`,
        		inline: true,
        	},
        	{
        		name: 'Ratings',
        		value: `${manga.meanScore + '%' || '??'}`,
        		inline: true,
        	},
        	{
        		name: 'Episodes',
        		value: `${manga.episodes || '??'}`,
        		inline: true,
        	},
        	{
        		name: 'Season',
        		value: `${capitalize(manga.season || '') || '??'}`,
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
        console.log(manga.isLicensed);
        try {
        	return message.channel.send({ embeds: [responseEmb] });
        } catch (error) {
        	console.log(error);
			return message.channel.send('Unexpected error occurred. Please try again later or report it to the mods.');
        }
    },
};
