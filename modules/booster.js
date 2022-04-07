const Discord = require('discord.js');
const Canvas = require('canvas');
const { announcementChannel } = require('../config.json');

async function booster(member, guild, client) {
    const channel = await client.channels.fetch(`${announcementChannel}`).then(chan => chan).catch(() => {
        return console.log('Could not fetch announcement channel');
    });
    Canvas.registerFont('./assets/Poppins-Bold.ttf', { family: 'Poppins' });
    // Creates the empty canvas
    const canvas = Canvas.createCanvas(700, 500);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage('./assets/booster.jpg');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    // console.log(context.measureText(member.displayName).width);
    // Puts user name 50px sans-serif
    context.font = '50px Poppins';
    context.fillStyle = '#00b9bd';
    context.fillText(member.user.tag, 70, 480, 300);

    // Circle stand for avatar
    context.beginPath();
    context.arc(213, 304, 132, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    // Puts the avatar in the stand
    const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png', size: 4096 }));
    context.drawImage(avatar, 85, 176, 255, 255);
    context.strokeStyle = '#00b9bd';
    context.lineWidth = 10;
    context.stroke();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'booster-image.png');

    const boostEmbed = new Discord.MessageEmbed()
                        .setTitle(`Thanks for the boost ${member.user.tag}`)
                        .setDescription('Boosting helps us get more features on the server which helps us expand our community. As such we are really grateful for the boost.\n\nAs thanks we\'ll give you a custom role of your choice. Feel free to mention or dm a <@&844136794977992705> or <@&844233565310812190> to get your role')
                        .setColor('#e91e63')
                        .setThumbnail(`${member.displayAvatarURL({ format: 'png', dynamic: true })}`)
                        .setImage(`attachment://${attachment.name}`)
                        .setFooter({ text: `Server Boost Count: ${guild.premiumSubscriptionCount}` });
    return await channel.send({ content: `Server boosted by <@!${member.id}>`, embeds: [boostEmbed], files: [attachment] });
}

module.exports = booster;