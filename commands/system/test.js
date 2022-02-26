const sourcebin = require('sourcebin');
const Discord = require("discord.js")
const fs = require('fs');
const getUser = require('../../modules/getUser.js');

const capitalize = require('../../modules/capitalize.js');

module.exports = {
    name: 'test',
    description: 'Owner only test running command',
    guildOnly: true,
    category: 'system',
    args: true,
    aliases: ['demo'],
    async execute(message, args) {
        if (message.author.id != '695307292815654963'){
            return message.channel.send('This command is only usable by the bot owner.');
        }
        //member = await getUser(args[0], message);
        const list = [];
        if(args) {
            for ( let i = 0; i < args.length; i++){
                await getUser(args[i], message).then(trgt => {
                    if (trgt != undefined){
                        list.push(trgt.user.tag);
                    }
                }).catch(err => console.log(err));
            }
        }

        console.log(list);
        

        
        return message.channel.send(`Code execution complete, ${list.join(', ')}`);
    }
}



/*
        const { commands } = message.client;
        const list = JSON.stringify(mapToObj(commands), null, 4);
        const bin = await sourcebin.create(
            [
                {
                    content: `${list}`,
                    language: 'javascript',
                },
            ],
            {
                title: 'Commands map collection',
                description: 'map object for the commands',
            },
        );
        try {
            message.channel.send(`Created commands map: ${bin.url}`)
        } catch (error) {
            message.channel.send('error');
        }

*/

/*
const embed = {
            description: `List of my commands`,
            fields: new Array,
        }
        const { commands } = message.client;
        //const cmdList = commands.map(command => `\`${command.name}\`- ${command.category}`).join('\n');
        const sorted = commands.sort((p, c) => p.category == c.category ? 1 : -1); //p.name > c.name && p.category === c.category ? 1 : -1 )
        let output = 'List \n';
        let currentCategory = '';
        let arr = [ {} ];
        sorted.forEach( c => {
            let i = 0;
            const cat = c.category;
            if (currentCategory !== cat) {
            i++;
            currentCategory = cat;
            arr.push({
                name: `${cat}`,
                value: '',
                })
            }
        arr[i].value += `\`${c.name}\``;
        });
        //console.log(output)
        embed.fields = arr;
        message.channel.send({ embeds: [embed] });
        */

        /*
        let catg = [];
        fs.readdirSync('./commands').forEach(dir => {
            const comands = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
            const cmds = comands.map(comand => {
                let cmnd = require(`./commands/${dir}/${comand}`);

                return `\`${cmnd.name}\``;
            })
            let data = new Object();
            date = {
                name: dir,
                value: cmds.join(', ')
            }
            catg.push(data);

        })
        */