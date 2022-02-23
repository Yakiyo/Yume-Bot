const Discord = require('discord.js');
const sourcebin = require('sourcebin');
const Canvas = require('canvas');

function mapToObj(map){
  const obj = {}
  for (let [k,v] of map)
    obj[k] = v
  return obj
}

module.exports = {
    name: 'test',
    description: 'Owner only test running command',
    guildOnly: true,
    category: 'system',
    aliases: [],
    perms: '',
    async execute(message, args) {
        if (message.author.id != '695307292815654963'){
            return message.channel.send('This command is only usable by the bot owner.');
        }
        
        message.channel.send('Code execution complete!')
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