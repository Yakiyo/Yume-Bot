const Discord = require('discord.js');
const Canvas = require('canvas');
const { welcomeChannel } = require('../config.json');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {
        if (member.guild.id !== '844103224528076801') return;
        
		const wchan = await client.channels.fetch(`${welcomeChannel}`).then(chan => chan);

		const canvas = Canvas.createCanvas(700, 500);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./wallpaper.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        //Puts user name
        context.font = '50px sans-serif';
        context.fillStyle = '#00b9bd';
        context.fillText(member.user.tag, 85, 465);

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
        
        const wEmb = new Discord.MessageEmbed()
				        .setTitle(`Welcome ${member.user.tag}!`)
				        .setColor(`#e91e63`)
				        .setThumbnail(`${member.displayAvatarURL({ format: 'png', dynamic: true })}`)
				        .setImage(`attachment://${attachment.name}`)
				        .setDescription(`Thanks for joining Tsurekano!\nPlease read rules-and-info and get some roles as a basic start. Feel free to ask <@&844136794977992705> or <@&844233565310812190> for any questions!\nDont forget to join our subreddit at:\n[https://www.reddit.com/r/MamahahaTsurego/](https://www.reddit.com/r/MamahahaTsurego/)`);

        await wchan.send({
        	content: `Welcome <@!${member.user.id}>!`, 
        	embeds: [wEmb],
        	files: [attachment]
         });

	},
};