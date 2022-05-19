// Event file for when the bot goes online for the first time
const { version } = require('../package.json');
const { time } = require('@discordjs/builders');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
		client.channels.cache.get('844253443510239262').send(`Yume Bot on! <:corporalmizuto:845137729729462302>.\nReady at ${time(client.readyAt)}\nGuilds: ${client.guilds.cache.size}, Channels: ${client.channels.cache.size}, Version: ${version}`);

		// Below here goes the setting to make a event timer with VC

        /* async function makeTimer (chanID) {
            const channel = await client.channels.fetch(chanID).then(res => res).catch(() => null);

            function duration(unix) {
                const milliseconds = unix * 1000 - Math.round((new Date()).getTime());
                // return null if the difference in time is less then 0
                if (milliseconds <= 0) return null;

                let hour, minute, seconds;
                seconds = Math.floor(milliseconds / 1000);
                minute = Math.floor(seconds / 60);
                seconds = seconds % 60;
                hour = Math.floor(minute / 60);
                minute = minute % 60;
                const day = Math.floor(hour / 24);
                hour = hour % 24;
                const obj = {
                    day: day || null,
                    hour: hour || null,
                    minute: minute || null,
                    seconds: seconds || null,
                };
                // clear empty values in the object
                Object.keys(obj).forEach((k) => obj[k] == null && delete obj[k]);
                // convert the thing to a string
                const string = [];
                if (obj.day) string.push(`${obj.day} days`);
                if (obj.hour) string.push(`${obj.hour} hrs`);
                if (obj.minute) string.push(`${obj.minute} mins`);
                if (!string.length) return null;
                return string.join(', ');
            }
            const map = {};
            function renameChannel(chan) {
                const timeLeft = duration(1653888117);
                chan.edit({ name: timeLeft || 'Released!' }).then(chaned => chaned).catch(error => console.log(error));
                // clear the interval if the time difference is zero or time is null
                if (!time || time <= 0) {
                    clearInterval(map.interval);
                }
            }
            // initiate the interval
            map.interval = setInterval(renameChannel(channel), 5 * 60 * 1000);
        } */

	},
};