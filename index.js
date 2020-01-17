const MongoClient = require('mongodb').MongoClient;
const SlackBot = require('slackbots');
const express = require('express');
require('dotenv').config()
const app = express();

// connecting to padawan db
const url = 'mongodb://localhost:3001/meteor'; 
MongoClient.connect(url, { useUnifiedTopology: true }).then(client => {
    console.log('Successfully connected to the server!');
    app.locals.db = client.db('meteor');
}).catch(error => {
    console.log('Something went wrong while trying to connect to the server: ', error);
})

const bot = new SlackBot({
    token: process.env.BOT_USER_ACCESS_TOKEN,
    name: 'DeveloperLevelBot'
})

bot.on('start', () => {
    const params = {
        icon_emoji: ':developer-level:'
    }
    bot.postMessage('DRSFLDQQZ', 'DeveloperLevelBot is up and running!', params);
});

bot.on('error', error => {
    bot.postMessage('DRSFLDQQZ', error);
})

bot.on('message', data => {
    if(data.type === 'message' && !data.bot_id && data.subtype !== 'message_changed') {

        const userList = bot.getUsers();
        const users = userList._value
        let currentUser;
    
        users.members.forEach(user => {
            if(data.user === user.id) {
                currentUser = user;
            } else {
                return;
            }
        });
    
        if(data.text.includes('DL/user')){
            getUserPadawanData(currentUser, data.channel);
        } else if(data.text.includes('DL/help')) {
            bot.postMessage(data.channel, "Possible commands: " + "\n" +
            "\u2022 DL/user - returns DeveloperLevel ID and Name based off slack email.")
        } else {
            return;
        }

    } else {
        return;
    }
})

const getUserPadawanData = (user, channel) => {
    const db = app.locals.db
    const padawanUsers = db.collection('users')

    padawanUsers.findOne({
        $or: [
            { slug: user.profile.email }, 
            { 'emails': {$elemMatch: {address: user.profile.email}} }
        ]
    }).then(result => {
        if(result) {
            bot.postMessage(channel, `DeveloperLevel user found! Name: ${result.MyProfile.firstName} ${result.MyProfile.lastName}, ID: ${result._id}`);
        } else if(!result) {
            bot.postMessage(channel, `No DeveloperLevel user found with email ${user.profile.email}`);
        }
    })
}