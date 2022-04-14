// Module to fetch a guild member.
module.exports = async (thingy, msg) => {
	const id = thingy.replace('<@', '').replace('!', '').replace('>', '');
	const fetched = await msg.guild.members.search({ query: `${thingy.toLowerCase()}` }).then(dude => dude.first()).catch(error => error) || await msg.guild.members.fetch(`${id}`).then(dude => dude).catch(() => undefined) ;
	if (fetched) {
		return fetched;
	} else {
		return undefined;
	}
};