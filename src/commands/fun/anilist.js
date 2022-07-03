const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { userQuery: query, userActivity: activityQuery } = require('../../assets/graphql-queries.js');
const { casify, shorten } = require('../../util');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anilist')
		.setDescription('Shows profile information of an anilist user')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('the user to search for')
                .setRequired(true)
                .setAutocomplete(true)),
  async options(interaction) {
		async function getVals(search) {
			const query2 = `query ($name: String) {
                Page(page: 1, perPage: 10) {
                    users(search: $name) {
                        id
                        name
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
				query: query2,
				variables: {
							name: `${search}`,
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
				value = data.data.Page.users;
			}

			await fetch('https://graphql.anilist.co', options).then(response => handleResponse(response)).then(data => handleData(data)).catch(() => null);
			return value.map(val => ({ name: `${shorten(val.name, 45)}`, value: `${val.id}` }));
		}
		const focused = interaction.options.getFocused();
		const value = await getVals(focused);

		return value;
	},
	async execute(interaction) {
		await interaction.deferReply();
        const username = await interaction.options.getString('user');
        let variables;
        if (username.match(/^[0-9]*$/g)) {
          variables = { id: Number(username) };
        } else {
          variables = { name: `${username}` };
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

        function handleResponse(response) {
            return response.json().then(function(json) {
            return response.ok ? json : Promise.reject(json);
        });
    }
        let user;
        try {
          user = await fetch('https://graphql.anilist.co', options).then(res => handleResponse(res)).then(data => data.data.User);
        } catch (error) {
          if (error.data.User === null) {
            return await interaction.editReply('Could not find any user on anilist with that name.');
          } else {
            console.log(error);
            return await interaction.editReply('Unexpected Error when making API request.');
          }
        }

        if (!user) return await interaction.editReply('Could not find any user on anilist with that name.');

        const activityOption = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
          query: activityQuery,
          variables: {
                user: user.id,
              },
          }),
      };


      let activities;
        try {
          activities = await fetch('https://graphql.anilist.co', activityOption).then(response => handleResponse(response)).then(data => data.data.Page.activities);
        } catch (error) {
          console.log(error);
          activities = null;
        }
        activities = activities.filter(element => {
          if (typeof element === 'object' && Object.keys(element).length !== 0) {
            return true;
          } else {
            return false;
          }
        });

        function stat(stats) {
            function findCompleted(type) {
              if (type.count === 0) return 0;
              if (type.statuses.find(obj => obj.status === 'COMPLETED') && type.statuses.find(obj => obj.status === 'COMPLETED').count) {
                return Math.floor(type.statuses.find(obj => obj.status === 'COMPLETED').count / type.count * 100);
              } else {
                return 0;
              }
            }
            function topGenre(type) {
                return `Loves watching **${type.anime.genres[0]?.genre || 'undefined'}** and reading **${type.manga.genres[0]?.genre || 'undefined'}**`;
            }
            const result = `‣ Completes: **${findCompleted(stats.anime)}% anime** & **${findCompleted(stats.manga)}% manga**\n‣ ${topGenre(user.statistics)}\n‣ Spent **${user.statistics.anime.genres[0]?.minutesWatched || 'undefined' } minutes** watching **${user.statistics.anime.genres[0]?.genre}**\n‣ Prefers watching animes of **${user.statistics.anime.releaseYears[0]?.releaseYear}**\n‣ Least enjoys watching **${user.statistics.anime.genres.at(-1)?.genre}** and reading **${user.statistics.manga.genres.at(-1)?.genre}**`;

            return result;
        }

        // function resolveColor(color) {
        //   const Colors = {
        //     DEFAULT: 0x000000,
        //     WHITE: 0xffffff,
        //     AQUA: 0x1abc9c,
        //     GREEN: 0x57f287,
        //     BLUE: 0x3498db,
        //     YELLOW: 0xfee75c,
        //     PURPLE: 0x9b59b6,
        //     LUMINOUS_VIVID_PINK: 0xe91e63,
        //     FUCHSIA: 0xeb459e,
        //     GOLD: 0xf1c40f,
        //     ORANGE: 0xe67e22,
        //     RED: 0xed4245,
        //     GREY: 0x95a5a6,
        //     NAVY: 0x34495e,
        //     DARK_AQUA: 0x11806a,
        //     DARK_GREEN: 0x1f8b4c,
        //     DARK_BLUE: 0x206694,
        //     DARK_PURPLE: 0x71368a,
        //     DARK_VIVID_PINK: 0xad1457,
        //     DARK_GOLD: 0xc27c0e,
        //     DARK_ORANGE: 0xa84300,
        //     DARK_RED: 0x992d22,
        //     DARK_GREY: 0x979c9f,
        //     DARKER_GREY: 0x7f8c8d,
        //     LIGHT_GREY: 0xbcc0c0,
        //     DARK_NAVY: 0x2c3e50,
        //     BLURPLE: 0x5865f2,
        //     GREYPLE: 0x99aab5,
        //     DARK_BUT_NOT_BLACK: 0x2c2f33,
        //     NOT_QUITE_BLACK: 0x23272a,
        //   };
        //   if (typeof color === 'string') {
        //     if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
        //     if (color === 'DEFAULT') return 0;
        //     color = Colors[color] ?? parseInt(color.replace('#', ''), 16);
        //   } else if (Array.isArray(color)) {
        //     color = (color[0] << 16) + (color[1] << 8) + color[2];
        //   }

        //   if (color < 0 || color > 0xffffff) return 'RANDOM';
        //   else if (Number.isNaN(color)) return 'RANDOM';

        //   return color || 'RANDOM';
        // }
        function moment(seconds) {
              const days = Math.floor(seconds / (24 * 60 * 60));
                  seconds -= days * (24 * 60 * 60);
              const hours = Math.floor(seconds / (60 * 60));
                  seconds -= hours * (60 * 60);
              const minutes = Math.floor(seconds / (60));
                  seconds -= minutes * (60);
              return ((days > 0) ? (days + ' day, ') : '') + hours + 'h and ' + minutes + 'm';
            }
        const favAnime = user.favourites.anime.nodes.length ? `[${user.favourites.anime.nodes[0].title.english || user.favourites.anime.nodes[0].title.romaji}](${user.favourites.anime.nodes[0].siteUrl})` : 'No Favourite anime';
        const favManga = user.favourites.manga.nodes.length ? `[${user.favourites.manga.nodes[0].title.english || user.favourites.manga.nodes[0].title.romaji}](${user.favourites.manga.nodes[0].siteUrl})` : 'No Favourite manga';
        const favChara = user.favourites.characters.nodes.length ? `[${user.favourites.characters.nodes[0].name.english}](${user.favourites.characters.nodes[0].siteUrl})` : 'No Favourite Character';
        const favStaff = user.favourites.staff.nodes.length ? `[${user.favourites.staff.nodes[0].name.english}](${user.favourites.staff.nodes[0].siteUrl})` : 'No Favourite staff';
        const favStudio = user.favourites.studios.nodes.length ? `[${user.favourites.studios.nodes[0].name}](${user.favourites.studios.nodes[0].siteUrl})` : 'No favourite studio';
        const embed = {
            author: {
                name: `${user.name}'s Anilist Profile`,
                url: `https://anilist.co/user/${user.id}`,
                icon_url: 'https://anilist.co/img/logo_al.png',
            },
            thumbnail: {
                url: `${user.avatar.large || user.avatar.medium}`,
            },
            color: 'RANDOM',
            image: {},
            fields: [
                {
                    name: 'Anime Stats',
                    inline: true,
                    value: `⇒ Total entries: ${user.statistics.anime.count}\n⇒ Total Episodes: ${user.statistics.anime.episodesWatched}\n⇒ Mean Score: ${user.statistics.anime.meanScore}\n⇒ Time Watched: ${moment(user.statistics.anime.minutesWatched * 60)}`,
                },
                {
                    name: 'Manga Stats',
                    inline: true,
                    value: `⇒ Total entires: ${user.statistics.manga.count}\n⇒ Total Volumes: ${user.statistics.manga.volumesRead}\n⇒ Total Chapters: ${user.statistics.manga.chaptersRead}\n⇒ Mean Score: ${user.statistics.manga.meanScore}`,
                },
                {
                  name: 'General Info',
                  value: `${stat(user.statistics)}`,
                },
                {
                  name: 'Top Favourites',
                  value: `**Anime:** ${favAnime}\n**Manga:** ${favManga}\n**Character:** ${favChara}\n**Staff:** ${favStaff}\n**Studio:** ${favStudio}`,
                },
            ],
        };
        let text = '';
        if (activities && activities.length) {
          activities = activities.filter(element => {
            if (typeof element === 'object' && Object.keys(element).length !== 0) {
              return true;
            } else {
              return false;
            }
          });
          if (activities.length) {
            let n;
            if (activities.length > 3) {
              n = 3;
            } else {
              n = activities.length;
            }
            const list = activities.slice(0, n);
            for (let i = 0; i < list.length; i++) {
              text += `${casify(list[i].status)} ${list[i].progress ? `${list[i].progress} of` : '' } [${list[i].media.title.userPreferred || list[i].media.title.romaji}](${list[i].media.siteUrl})\n`;
            }
          }
        }
        if (text) {
          const activityField = {
            name: 'Recent Activities',
            value: `${text}`,
          };
          embed.fields.push(activityField);
        }
        if (user.bannerImage) {
          embed.image.url = user.bannerImage;
        }
        const alLink = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setURL(`https://anilist.co/user/${user.id}`)
								.setLabel('Anilist')
								.setStyle('LINK')
								.setEmoji('976107829037498418'),
						);
		return await interaction.editReply({ embeds: [embed], components: [alLink] });

	},
};