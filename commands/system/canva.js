const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    name: 'canva',
    description: 'Why u wanna know this :eyes:',

    category: 'system',
    aliases: ['canvas', 'cnv'],
    async execute(message, args) {
        if (message.author.id != '695307292815654963') {
            return message.channel.send('This command is only usable by the bot owner.');
        }
        let id;
        if (args[0]) {
        	id = args[0].replace('<@', '').replace('>', '').replace('!', '');
        } else {
        	id = message.author.id;
        }
        const member = await message.guild.members.fetch(`${id}`).then(dude => dude).catch(error => error);

        Canvas.registerFont('./assets/Poppins-Bold.ttf', { family: 'Poppins' });
        // Creates the empty canvas
        const canvas = Canvas.createCanvas(700, 500);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./assets/welcome.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        // console.log(context.measureText(member.displayName).width);
        // Puts user name 50px sans-serif
        context.font = '50px Poppins';
        context.fillStyle = '#00b9bd';
        context.fillText(member.user.tag, 76, 465, 300);

        // Circle stand for avatar
        context.beginPath();
        context.arc(213, 286, 125, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        // Puts the avatar in the stand
        const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png', size: 4096 }));
        context.drawImage(avatar, 89, 152, 255, 255);
        context.strokeStyle = '#00b9bd';
        context.lineWidth = 10;
        context.stroke();

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        await message.channel.send({ files: [attachment] });
        message.channel.send('Code execution complete!');

    },
};