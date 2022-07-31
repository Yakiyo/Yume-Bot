const Canvas = require('@napi-rs/canvas');
const { resolve } = require('path');
const { readFile } = require('fs/promises');
const { request } = require('undici');
const { channels, guildId } = require('../config.json');
const { MessageAttachment, MessageEmbed } = require('discord.js');
// The channel to send the unboost message to.
const staffChannel = '844632108831342679';

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        const guild = newMember.guild;
        if (!guild.available || guild.id !== guildId || process.env.NODE_ENV !== 'production') return;

        // Checks if old member wasnt boosting and new member is boosting
        if (!oldMember.premiumSince && newMember.premiumSince) {
            const channel = await guild.channels.fetch(channels.announcement);
            const member = newMember;
            // Load font to canvas
            Canvas.GlobalFonts.registerFromPath(resolve(process.cwd(), './src/assets/Poppins-Bold.ttf'), 'Poppins');

            // Initialize canvas, create a context and load background image and draw it
            const canvas = Canvas.createCanvas(700, 500);
            const context = canvas.getContext('2d');
            const backgroundFile = await readFile(resolve(process.cwd(), './src/assets/booster.jpg'));
            const background = new Canvas.Image();
            background.src = backgroundFile;
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            // Write user tag
            context.font = '50px Poppins';
            context.fillStyle = '#00b9bd';
            context.fillText(member.user.tag, 70, 480, 300);

            // Create space for avatar
            context.beginPath();
            context.arc(213, 304, 132, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            // Load user avatar and draw it on canvas
            const { body } = await request(member.user.avatarURL({ format: 'png', size: 1024 }));
            const avatar = new Canvas.Image();
            avatar.src = Buffer.from(await body.arrayBuffer());
            context.drawImage(avatar, 85, 176, 255, 255);
            context.strokeStyle = '#00b9bd';
            context.lineWidth = 10;
            context.stroke();

            const attachment = new MessageAttachment(canvas.toBuffer(), 'booster-image.png');
            const embed = new MessageEmbed()
                .setTitle(`Thanks for the boost ${member.user.tag}`)
                .setDescription('Boosting helps us get more features on the server which helps us expand our community. As such we are really grateful for the boost.\n\nAs thanks we\'ll give you a custom role of your choice. Feel free to mention or dm a <@&844136794977992705> or <@&844233565310812190> to get your role')
                .setColor('#e91e63')
                .setThumbnail(`${member.displayAvatarURL({ format: 'png', dynamic: true })}`)
                .setImage(`attachment://${attachment.name}`)
                .setFooter({ text: `Server Boost Count: ${guild.premiumSubscriptionCount}` });
            await channel.send({ embeds: [embed], files: [attachment] });
        } else if (oldMember.premiumSince && !newMember.premiumSince) {
            // Checks if old member was boosting but new member isnt boosting
            await guild.channels.fetch(staffChannel)
                .then(chan => {
                    chan.send({ embeds: [{
                        title: 'Boost withdrawal',
                        description: `${newMember.user.tag} withdrew boosts. <@${newMember.user.id}>`,
                        footer: {
                            text: `ID: ${newMember.user.id}`,
                        },
                        timestamp: new Date(),
                    }] });
                });
        }

        return;
    },
};