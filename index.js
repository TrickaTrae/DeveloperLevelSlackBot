const MongoClient = require('mongodb').MongoClient;
const SlackBot = require('slackbots');
const express = require('express');
require('dotenv').config()
const app = express();

// connecting to padawan db
const url = 'mongodb://localhost:3001/meteor'; 
MongoClient.connect(url, {useUnifiedTopology: true}).then(client => {
    console.log('Successfully connected to the server!');
    app.locals.db = client.db('meteor');
}).catch(error => {
    console.log('Something went wrong while trying to connect to the server: ', error);
})

const bot = new SlackBot({
    token: process.env.BOT_USER_ACCESS_TOKEN,
    name: 'developerlevelslackbot'
})

bot.on('start', () => {
    const params = {
        icon_emoji: ':developer-level:'
    }
    bot.postMessageToUser('traeger.winn', 'DeveloperLevelBot is up and running!', params);
});

bot.on('error', (error) => {
    console.log('something went wrong with developerlevelbot: ', error);
})

bot.on('message', data => {
    console.log('data here: ', data);
    testing();
})

const testing = () => {
    const db = app.locals.db
    const users = db.collection('users')

    users.findOne({ slug: "admin@mydomain.com" }).then((result) => {
        console.log('findOne result: ', result);
    })

    // users.find({}).toArray((err, docs) => {
        // console.log("Found the following records!");
        // console.log(docs)
    // });
}

// to-do
// add if statement or switch/case to bot.on message
// based off message, call appropriate function that will interact with padawan db