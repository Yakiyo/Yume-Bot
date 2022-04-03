function capitalize(string) {
	const space = string.replace(/_/g, ' ');
	return space.charAt(0) + space.substring(1).toLowerCase();
}
module.exports = capitalize;