module.exports = async (thingy, msg) => {
	const id = thingy.replace('<@','').replace('!','').replace('>','');
	const fetched = await msg.guild.members.fetch(`${id}`).then(dude => dude).catch(error => error) || msg.guild.members.search({query: `${thingy}`}).then(dude => dude.first()).catch(error => error);
	if (fetched){
		return fetched;
	} else {
		console.log(`Missed an args. Arg was ${thingy}`);
		return undefined;
	}
}