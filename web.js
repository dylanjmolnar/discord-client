const Sequelize = require("sequelize");
const sequelize = new Sequelize('server', 'root', '1Dkmandoo!', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: "./data/database.sqlite",
    logging: false
});
const Discord = require('discord.js');
const fs = require('fs');
const express = require('express');
const path = require('path');
const cookies = require("cookies");
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const app = express();
const router = express.Router();
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.MessageContent,
    ],
    partials: [
        Discord.Partials.User,
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Reaction
    ]
});

client.commands = new Discord.Collection();
client.commandss = new Discord.Collection();
client.emojisPortals = new Discord.Collection();
client.emojisKeys = new Discord.Collection();
client.emojisMisc = new Discord.Collection();
client.emojisWeapons = new Discord.Collection();
client.emojisAbilties = new Discord.Collection();
client.emojisRings = new Discord.Collection();
client.models = new Discord.Collection();

client.login(process.env.DISCORD_TOKEN);

const CLIENT_ID = import.meta.env.CLIENT_ID
const CLIENT_SECRET = import.meta.env.CLIENT_SECRET
const redirect = encodeURIComponent('http://localhost:5000/');

app.listen(5000, () => console.log(`Server started successfully!`));

app.use(cookies.express(['some', 'random', 'keys']))

app.get("/api/session", (req, res) => {
    console.log(res.json);
});

app.get('/api/:guildID', (req, res) => {
    let object = client.guilds.cache.get(req.params.guildID);
    object.icon1 = client.guilds.cache.get(req.params.guildID).iconURL();
    res.json(object);
});

app.get('/api/:guildID/members', async (req, res) => {
    let members = await client.guilds.cache.get(req.params.guildID).members.fetch();
    res.json(members);
});

app.get('/api/:guildID/settings', async (req, res) => {
    let settings = await client.models.get("guild").findOne({where: {guildID: req.params.guildID}});
    res.json(settings);
});

app.get('/api/:guildID/currentweek', async (req, res) => {
    let logs = await client.models.get("currentweeklogs").findAll({where: {guildID: req.params.guildID}});
    let members = await client.guilds.cache.get(req.params.guildID).members.fetch();
    let logsObject = {};
    for (let i = 0; i < logs.length; i++) {
      if (!logsObject[logs[i].userID]) {
        logsObject[logs[i].userID] = {
          void: 0,
          cult: 0,
          assist: 0,
          event: 0,
          eventAssist: 0,
          displayName: (members.find(e => e.id === logs[i].userID)) ? members.find(e => e.id === logs[i].userID).displayName
          : "Left Server"
        }
      }
      logsObject[logs[i].userID][logs[i].type]++;
      
    }
    res.json(logsObject);
});

app.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

app.get('/:guildID/set/:type/:thinkToSetTo', (req, res) => {
    let thingy = req.params.thinkToSetTo;
    let type = req.params.type;
    let guildID = req.params.guildID;
    let thing = {};
    thing[type] = (thingy === "true");
    client.models.get("guild").update(thing, {where: {guildID: guildID}});
});

app.get('/:guildID/setNumber/:type/:thinkToSetTo', (req, res) => {
    let thingy = req.params.thinkToSetTo;
    let type = req.params.type;
    let guildID = req.params.guildID;
    let thing = {};
    thing[type] = parseInt(thingy);
    client.models.get("guild").update(thing, {where: {guildID: guildID}});
});

app.get('/:guildID/staff', async (req, res) => {
    // let roles = await client.models.get("automuteroles").findAll({where: {guildID: req.params.guildID}});
    let members = await client.guilds.cache.get(req.params.guildID).members.fetch();
    // members = members.filter(e => {
    //     if (e.user.bot) return false;
    //     for (let i = 0; i < roles.length; i++) {
    //         if (e.roles.get(roles[i].roleID)) {
    //             return true;
    //         }
    //     }
    //     return false;
    // })
    res.json(members);
    console.log("s");
});



client.on("ready", async () => {
    console.log("Getting ready!");
    await fs.readdir(`./models`, async (err, files) => {
        if (err) {
            await console.log(`There was the following error when trying to upload a command:`, err);
        } else {
            let file = await files.filter(f => f.split(".").pop() === "js");
            if (file.length > 0) {
                await file.forEach(async (f, i) => {
                    let props = await require(`./models/${f}`);
                    let Tag = props(sequelize, Sequelize);
                    await console.log(`${f} model has been added.`);
                    await client.models.set(f.split(".")[0].toLowerCase(), Tag);
                    Tag.sync();
                });
            }
        }
    });
});