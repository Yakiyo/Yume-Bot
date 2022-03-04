module.exports = async (thingy, msg) => {
	console.log(thingy)
	const id = thingy.replace('<@','').replace('!','').replace('>','');
	const fetched = await msg.guild.members.search({query: `${thingy.toLowerCase()}`}).then(dude => dude.first()).catch(error => error) || msg.guild.members.fetch(`${id}`).then(dude => dude).catch(error => error) ;
	if (fetched){
		return fetched;
	} else {
		console.log(`Missed an args. Arg was ${thingy}`);
		return undefined;
	}
}