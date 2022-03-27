//Module to fetch a guild member.
module.exports = async (thingy, msg) => {
	const id = thingy.replace('<@','').replace('!','').replace('>','');
	const fetched = await msg.guild.members.search({query: `${thingy.toLowerCase()}`}).then(dude => dude.first()).catch(error => error) || await msg.guild.members.fetch(`${id}`).then(dude => dude).catch(error => undefined) ;
	if (fetched){
		return fetched;
	} else {
		console.log(`Missed an args. Arg was ${thingy}`);
		return undefined;
	}
}