const Canvas = require('@napi-rs/canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { resolve } = require('path');
const { readFile } = require('fs/promises');
const { request } = require('undici');
const { guildId, channels, roles } = require('../config.json');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {
        if (member.guild.id !== guildId || process.env.NODE_ENV !== 'production') return;
        const user = member.user;

        /**
         * Auto role setting.
         */
        if (user.bot) {
            await member.roles.add(roles.bot);
        } else if (!user.bot) {
            await member.roles.add(roles.member);
        }

        /**
         * Welcome embed settings
         */
        const channel = await client.channels.fetch(channels.welcome).then(response => response).catch(() => null);
        if (channel) {
            // Initiate canvas and context
            const canvas = Canvas.createCanvas(700, 500);
            const context = canvas.getContext('2d');
            // Load Background
            const backgroundFile = await readFile(resolve(process.cwd(), './source/assets/welcome.jpg'));
            const background = new Canvas.Image();
            background.src = backgroundFile;
            // Load fonts
            Canvas.GlobalFonts.registerFromPath(resolve(process.cwd(), './source/assets/Poppins-Bold.ttf'), 'Poppins');
            // Place the background
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            const { body } = await request(user.avatarURL({ format: 'png', size: 1024 }));
            // Write the user name
            context.font = '50px Poppins';
            context.fillStyle = '#00b9bd';
            context.fillText(user.tag, 76, 465, 300);
            // Load user avatar, make an arc and then draw it
            const avatar = new Canvas.Image();
            avatar.src = Buffer.from(await body.arrayBuffer());
            context.beginPath();
            context.arc(213, 286, 125, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(avatar, 89, 152, 255, 255);
            // Encircle the avatar with a border
            context.strokeStyle = '#00b9bd';
            context.lineWidth = 10;
            context.stroke();

            // Finally load the image as attachment
            const attachment = new MessageAttachment(canvas.toBuffer('image/png'), 'welcome-image.png');

            const memberCount = await member.guild.members.fetch().then(stuff => stuff.size);
            const embed = new MessageEmbed()
                            .setTitle(`Welcome ${member.user.tag}!`)
                            .setColor('#e91e63')
                            .setThumbnail(`${member.displayAvatarURL({ format: 'png', dynamic: true })}`)
                            .setImage(`attachment://${attachment.name}`)
                            .setDescription('Thanks for joining Tsurekano!\nPlease read rules-and-info and get some roles as a basic start. Feel free to ask <@&844136794977992705> or <@&844233565310812190> for any questions!\nDont forget to join our subreddit at:\n[https://www.reddit.com/r/MamahahaTsurego/](https://www.reddit.com/r/MamahahaTsurego/)')
                            .setFooter({ text: `Member count: ${memberCount}` });

            try {
                await channel.send({ embeds: [embed], files: [attachment] });
            } catch (error) {
                console.log(error);
                await client.channels.fetch(channels.serverlogs)
                    .then(chan => {
                        chan.send('<@695307292815654963> Error when sending welcome embed. Please resolve issue!');
                    });
            }
        }

        return;
    },
};