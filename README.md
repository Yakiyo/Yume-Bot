<div align="center"><a href="https://discord.gg/q2zDU5bGnh"><img alt="Discord" src="https://img.shields.io/discord/844103224528076801?color=blue&label=Tsurekano%20Discord&logo=discord&logoColor=white&style=plastic"></a> <a href="https://www.reddit.com/r/MamahahaTsurego/"><img alt="Subreddit subscribers" src="https://img.shields.io/reddit/subreddit-subscribers/MamahahaTsurego?color=orange&label=r%2FMamahahaTsurego&logo=reddit&logoColor=orange&style=plastic"></a></div>

# Yume Bot

Yume bot is a discord bot dedicated to the Tsurekano discord server. Made by Yakiyo#1206. Thanks to [Tenknown](https://github.com/Tenknown) & [Rim](https://github.com/R-Rim) for the help in making the bot.

My prefix is ```.``` For a list of commands do ```.help```.

**Discord:** [https://discord.gg/q2zDU5bGnh](https://discord.gg/q2zDU5bGnh) 

**Subreddit:** [r/MamahahaTsurego](https://www.reddit.com/r/MamahahaTsurego/)

**Fandom:** [https://motokano.fandom.com/wiki/My_Stepsister_is_My_Ex_Wiki](https://motokano.fandom.com/wiki/My_Stepsister_is_My_Ex_Wiki)

**Note:** This bot isnt available for guilds other then Tsurekano but the code is free for use in case anyone wants to use it and host their own bot. 

## Bot Information

+ Language: [Javascript](https://www.javascript.com/) 
+ Framework: [Discord.js](https://discord.js.org/)
+ Made with help from [Discord.js V12 guide](https://v12.discordjs.guide/), [Discord.js Guide]() & [An Idiot's Guide](https://anidiots.guide/)


## Contribution
Any and all contributions are welcome too. Pull requests are welcome. 
You can also give suggestions by joining the server and pinging me.

Please make sure to update tests as appropriate.


## Self-Hosting
I myself am dumb when it comes to making bots so i can just point out the basic steps below.
### Requirements:
+ Node.js v16 or higher
+ A discord developers application 

First clone the repository 
```
git clone https://github.com/Yakiyo/Yume-Bot
cd Yume-Bot
npm install
```
Edit the `.env.example` file with your token and then rename the file to `.env`. After that run `npm run start` or `node .` and youll have your bot started. 
Optionally you can change the default prefix to ur preference from `config.json`. For a detailed guide on how to make a bot using discordjs please refer to their official guide. You can host the bot for free on [Heroku](https://www.heroku.com/). You can see this [video](https://youtu.be/OFearuMjI4s) for the steps.

You'd have to change some minor spots over the project in some places too. Like system commands being restricted to bot owner had the owner id hardcoded in them so change them.
## License
[GPL-3.0 License](https://fsf.org/)
