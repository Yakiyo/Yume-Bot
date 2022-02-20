const fetch = require('node-fetch');
const turndownService = require('turndown');
const turndown = new turndownService;

turndown.addRule('spoiler', {
	filter: ['span'],
	replacement: function(text) {
		return `|| ${text} ||`;
	}
})

let query = `
query ($search: String) {
  Media(search: $search, type: MANGA, format: NOVEL) {
    id
    siteUrl
    title {
      romaji
      english
      native
    }
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
function shorten (string){
	let str = turndown.turndown(string)
	if (str.length > 1000){
		return str.substring(0,1000) + '...';
	} else {
		return str;
	}
}


module.exports = {
    name: 'ln',
    description: 'Searches the anilist database for the novel with the provided name',
    guildOnly: true,
    aliases: ['novel', 'light-novel','ranobe'],
    async execute(message, args) {
      	let url = 'https://graphql.anilist.co', novel,
      	variables = {
      		search: args.join(" ")
      	}

      	let options = {
        	method: 'POST',
        	headers: {
            	'Content-Type': 'application/json',
            	'Accept': 'application/json',
        	},
        	body: JSON.stringify({
            	query: query,
            	variables: variables
        	})
    	};


		await fetch(url, options).then(handleResponse)
		                   		.then(handleData)
		                   		.catch(handleError);

		function handleResponse(response) {
		    return response.json().then(function (json) {
		        return response.ok ? json : Promise.reject(json);
		    });
		}

		function handleData(data) {
			novel = data.data.Media;
		}

		function handleError(error) {
		    return message.channel.send(`Couldn't find any light novel with the name **${args.join(' ')}**`)
		    console.error(error);
		}
        //console.log(novel);

        const responseEmb = {
        	color: [26, 178, 207],
        	author: {
        		name: `${novel.title.romaji}`,
        		icon_url: `https://anilist.co/img/logo_al.png`,
        		url: `https://anilist.co/manga/${novel.id}`
        	},
        	thumbnail: {
        		url: `${novel.coverImage.extraLarge}`
        	},
        	description: `${shorten(novel.description)}`,
        	footer: {
        		text: `Status: ${novel.status.charAt(0)+novel.status.substring(1).toLowerCase()}, Ratings: ${novel.meanScore+'%' || '??'}`,
        	},
        	timestamp: new Date()
        }

        try {
        	return message.channel.send({embeds: [responseEmb]});
        } catch (error) {
        	return message.channel.send('Unexpected error occurred. Please try again later or report it to the mods.');
        	console.log(error);
        }
    }
}