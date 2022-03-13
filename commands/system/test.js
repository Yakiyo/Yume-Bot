const sourcebin = require('sourcebin');
const { Collection } = require("discord.js")
const categories = new Collection();
const getUser = require('../../modules/getUser.js')

module.exports = {
    name: 'test',
    description: 'Owner only test running command',
    guildOnly: true,
    category: 'system',
    args: false,
    aliases: ['demo'],
    async execute(message, args) {
        if (message.author.id != '695307292815654963'){
            return message.channel.send('This command is only usable by the bot owner.');
        }
        /*const { commands } = message.client;
        commands.forEach(command => {
            const category = categories.get(command.category)
            if (category) {
            category.set(command.name, command)
            } else {
            categories.set(command.category, new Collection().set(command.name, command))
            }
        })
        const arr = Array.from(categories);
        let field =[] ;
        for (let i = 0; i < arr.length ; i++){
            let obj = new Object;
            let listOEntries ='';
            const comList = arr[i][1];
            comList.forEach(com => {
                listOEntries += `\`${com.name}\`,`
            })
            obj = {
                name: `${arr[i][0]}`,
                value: `${listOEntries}`//${Array.from((arr[i][1])).join(', ')}`
            }
            //arr[i][1].forEach(com => obj.value += `${com.name}` )
            field.push(obj);
        }
        console.log(field);
        const demoemb = {
            title: 'something here',
            fields: field
        }
        message.channel.send({ embeds: [demoemb] }).catch(error => console.log(error));*/
        const target = await getUser(`${args[0]}`, message);
        console.log(target.communicationDisabledUntil)
        //console.log(Array.from(categories));
        return message.channel.send(`Code execution complete`);
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