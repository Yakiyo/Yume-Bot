#  <div align="center">Yume Bot</div>

<div align="center"><a href="https://discord.gg/q2zDU5bGnh"><img alt="Discord" src="https://img.shields.io/discord/844103224528076801?color=blue&label=Tsurekano%20Discord&logo=discord&logoColor=white&style=plastic"></a> <a href="https://www.reddit.com/r/MamahahaTsurego/"><img alt="Subreddit subscribers" src="https://img.shields.io/reddit/subreddit-subscribers/MamahahaTsurego?color=orange&label=r%2FMamahahaTsurego&logo=reddit&logoColor=orange&style=plastic"></a> <a href="https://deepscan.io/dashboard#view=project&tid=18158&pid=21489&bid=619222"><img src="https://deepscan.io/api/teams/18158/projects/21489/branches/619222/badge/grade.svg" alt="DeepScan grade"></a> <a href="https://github.com/Yakiyo/Yume-Bot/actions/workflows/eslint.yml"><img src="https://github.com/Yakiyo/Yume-Bot/actions/workflows/eslint.yml/badge.svg"></a></div>
<div align="center">
<a href="https://gitpod.io/from-referrer/"><img src="./src/assets/logos/gitpod.svg" alt="Open on gitpod https://gitpod.io/from-referrer/"></a>
</div>

## About
Yume bot is a discord bot created for the Tsurekano Discord server. Created by Yakiyo#1206.

The bot is fully based on slash commands. To use a slash command, type `/` in the message box. For a list of all commands, use `/help`

### Links
**Discord:** [Tsurekano](https://discord.gg/q2zDU5bGnh) 

**Subreddit:** [r/MamahahaTsurego](https://www.reddit.com/r/MamahahaTsurego/)

**Fandom:** [MotoKano Fandom](https://motokano.fandom.com/wiki/My_Stepsister_is_My_Ex_Wiki)

> Yume bot isn't available to servers other then the tsurekano discord and cannot be invited anywhere else. The code is open source though so anyone can feel free to fork and host their own version of the bot. For some directions on self hosting please see the self hosting section [here](#self-hosting)

## Bot Information
+ Language: [Javascript](https://www.javascript.com)
+ Library: [Discord.js](https://discord.js.org)


## Contribution 

For new feature requests, you can make an issue and i'll see what can be done.

1) [Fork it](https://github.com/Yakiyo/Yume-bot/fork)
2) Create new branch `git checkout -b my-new-feature`
3) Commit changes `git commit -m "Add cool feature`
3) Push changes to it `git push <remote> <branch>`
4) Create a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

Any and all contributions are welcome. Please make sure you're code passes the lint tests. ✌

## Self Hosting
<a href="https://heroku.com/deploy?template=https://github.com/Yakiyo/Yume-Bot">
    <img 
    src="https://www.herokucdn.com/deploy/button.svg" 
    width="200px"
    alt="Deploy Yume Bot to Heroku with 1-Click" 
    />
</a>

Requirements:
+ [Nodejs](https://nodejs.org) v16.6.0 or higher.
+ A Discord [Bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

Clone the repo and install packages
```bash
$ git clone https://github.com/Yakiyo/Yume-Bot
$ npm install
```
To start, create a file named `.env` and put the following in it.
```env
TOKEN=Bot token goes here 
MONGO=A mongodb URI
```
After that edit the [config](src/config.json) file to your needs and then run the code

```bash
$ npm run start
```
## Author
**Yume Bot** © [Yakiyo](https://github.com/Yakiyo). Authored and maintained by Yakiyo.

Released under [GPL-3.0 License](https://fsf.org/).
