const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { casify, shorten } = require('../../util');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('manga')
		.setDescription('Gets information about a manga from anilist')
		.addStringOption(option =>
            option.setName('term')
                .setDescription('the manga to search for')
				.setRequired(true)
                .setAutocomplete(true)),
	async options(interaction) {
		async function getVals(search) {
			const query = `query ($search: String) {
				Page (page: 1, perPage: 10) {
					media (search: $search, type: MANGA) {
						id
						title {
							romaji
							english
						}
						type
						format
					}
				}
			}`;
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify({
				query: query,
				variables: {
							search: `${search}`,
						},
				}),
			};
			let value;
			function handleResponse(response) {
					return response.json().then(function(json) {
					return response.ok ? json : Promise.reject(json);
				});
			}
			function handleData(data) {
				value = data.data.Page.media;
			}

			await fetch('https://graphql.anilist.co', options).then(response => handleResponse(response)).then(data => handleData(data)).catch(() => null);
			return value.map(val => ({ name: `${shorten(val.title.english || val.title.romaji, 45)} <<${val.format}>>`, value: `${val.id}` }));
		}
		const focused = interaction.options.getFocused();
		const value = await getVals(focused);

		return value;
	},
	async execute(interaction) {
		await interaction.deferReply();

		const term = await interaction.options.getString('term');


		const query = `query ($search: String, $id: Int) { Media (search: $search, id: $id, type: MANGA) { id idMal title { romaji english native userPreferred }
		description type format status startDate { year month day } endDate { year month day } chapters volumes countryOfOrigin isLicensed updatedAt
		coverImage { large:extraLarge medium:large small:medium color } bannerImage genres synonyms averageScore meanScore siteUrl autoCreateForumThread modNotes
		popularity trending tags { name isMediaSpoiler } relations { nodes { id title { english native romaji userPreferred } type } }
		characters { nodes { id name { english: full } } } staff { nodes { id name { english: full } } } isFavourite isAdult isLocked
		trends { nodes { date trending popularity inProgress } } externalLinks { url } rankings { rank type context year season } 
		mediaListEntry { id status } reviews { nodes { id score summary body } } 
		stats { scoreDistribution { score amount } statusDistribution { status amount } } favourites
		isRecommendationBlocked recommendations { nodes { mediaRecommendation { id title { romaji english native userPreferred } type } } } } }`;


		let variables;
		if (term.match(/^[0-9]*$/g)) {
			variables = { id: Number(term) };
		} else {
			variables = { search: `${term}` };
		}

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

		let value;
		function handleResponse(response) {
				return response.json().then(function(json) {
				return response.ok ? json : Promise.reject(json);
			});
		}
		function handleData(data) {
			value = data.data.Media;
		}
		try {
			await fetch('https://graphql.anilist.co', options).then(response => handleResponse(response)).then(data => handleData(data));
		} catch (error) {
			console.log(error);
			return interaction.editReply('No manga with that search term found');
		}
		if (!value) {
			return await interaction.editReply('No manga with that search term found');
		}
		if (value.isAdult && !interaction.channel.nsfw) {
			return await interaction.editReply(`The search result **${value.title.romaji}** cannot be showed outside of nsfw channels :x:`);
		}
		const genre = value.genres.join(', ') || '??';
		const titles = [];
		for (const name in value.title) {
			if (value.title[name]) {
				titles.push(value.title[name]);
			}
		}

        function convertFuzzyDate(fuzzyDate) {
			if (Object.values(fuzzyDate).some((d) => d === null)) return null;
			return new Date(fuzzyDate.year, fuzzyDate.month - 1, fuzzyDate.day);
		}
		const startDate = convertFuzzyDate(value.startDate);
		const embed = {
			color: `${value.coverImage.color || [26, 178, 207]}`,
			author: {
				name: `${value.title.romaji}`,
				icon_url: 'https://anilist.co/img/logo_al.png',
				url: `https://anilist.co/manga/${value.id}`,
			},
			thumbnail: {
				url: `${value.coverImage.large}`,
			},
			image: {},
			description: `${shorten(value.description).replace(/[\r\n ]{2,}/gm, '\n').replace(/\\\\n/g, '\r\n')}`,
			fields: [{
					name: 'Titles',
					value: `${titles.join(', ')}`,
					inline: false,
				},
				{
					name: 'Type',
					value: `${casify(value.type)}`,
					inline: true,
				},
				{
					name: 'Format',
					value: `${casify(value.format)}`,
					inline: true,
				},
				{
					name: 'Status',
					value: `${casify(value.status)}`,
					inline: true,
				},
				{
					name: 'Ratings',
					value: `${value.meanScore ? value.meanScore + '%' : '??'}`,
					inline: true,
				},
				{
					name: 'Volumes',
					value: `${value.volumes || '??'}`,
					inline: true,
				},
				{
					name: 'Chapters',
					value: `${value.chapters || '??'}`,
					inline: true,
				},
				{
					name: 'Genres',
					value: `${genre}`,
					inline: false,
				},
			],
			footer: {
				text: `Favourites: ${value.favourites || '??'}. Starting Date:`,
			},
			timestamp: startDate,
		};

		if (value.bannerImage) {
			embed.image.url = value.bannerImage;
		}
		const alLink = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setURL(`https://anilist.co/manga/${value.id}`)
								.setLabel('Anilist')
								.setStyle('LINK')
								.setEmoji('976107829037498418'),
						);
		return await interaction.editReply({ embeds: [embed], components: [alLink] });
	},
};