const SlackBot = require('slackbots');
const axios = require('axios');
require('dotenv').config()

const bot = new SlackBot({
    token: process.env.BOT_USER_ACCESS_TOKEN,
    name: 'developerlevelslackbot'
})

// start handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':developer-level:'
    }

    bot.postMessageToUser('traeger.winn', 'DeveloperLevelBot is up and running!', params);
});

// error handler
bot.on('error', (error) => {
    console.log('something went wrong: ', error);
})