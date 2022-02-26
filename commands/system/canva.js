const Discord = require('discord.js');
const Canvas = require('canvas');

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 50;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 5}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width / 3);
	console.log(canvas.width, context.measureText(text).width);
	// Return the result to use in the actual canvas
	return context.font;
};


module.exports = {
    name: 'canva',
    description: 'Why u wanna know this :eyes:',
    guildOnly: true,
    category: 'system',
    aliases: ['canvas', 'cnv'],
    async execute(message, args) {
        if (message.author.id != '695307292815654963'){
            return message.channel.send('This command is only usable by the bot owner.');
        }
        let id;
        if (args[0]) {
        	id = args[0].replace('<@','').replace('>','').replace('!','');
        } else {
        	id = message.author.id;
        }
        const member = await message.guild.members.fetch(`${id}`).then(dude => dude).catch(error => error);

        //Creates the empty canvas
        const canvas = Canvas.createCanvas(700, 500);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./wallpaper.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        //Puts user name
        context.font = applyText(canvas, member.displayName);
        context.fillStyle = '#00b9bd';
        context.fillText(member.user.tag, 90, 470);

        //Circle stand for avatar
        context.beginPath();
        context.arc(213, 286, 125, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        //Puts the avatar in the stand
        const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png', size: 4096 }));
        context.drawImage(avatar, 89, 150, 255, 255);
        context.strokeStyle = '#00b9bd';
        context.lineWidth = 10;
        context.stroke();

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        
        await message.channel.send({files: [attachment]});
        message.channel.send('Code execution complete!');
        
    }
}