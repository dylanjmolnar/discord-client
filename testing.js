const Sequelize = require("sequelize");
const sequelize = new Sequelize('server', 'root', '1Dkmandoo!', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: "./data/database.sqlite",
    logging: false
});
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({
    presence: {
        activity: {
            name: "with Tiny Little Men"
        }
    }
});

const Spotify = require('node-spotify-api');
 
client.spotify = new Spotify({
    id: "a2b630e7a0f147f0a7f8a4f0e9361aba",
    secret: "e06c7dc3774b4962b706029d4bc606ad"
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


client.on("ready", async () => {
    console.log("Getting ready!");
    await fs.readdir(`./commands`, async (err, files) => {
        if (err) {
            await console.log(`There was the following error when trying to upload a command:`, err);
        } else {
            let file = await files.filter(f => f.split(".").pop() === "js");
            if (file.length > 0) {
                await file.forEach(async (f, i) => {
                    let props = await require(`./commands/${f}`);
                    await console.log(`${f} command has been added.`);
                    await client.commands.set(f.split(".")[0].toLowerCase(), props);
                    await client.commandss.set(f.split(".")[0], {});
                });
            }
        }
    });
    await fs.readdir(`./models`, async (err, files) => {
        if (err) {
            await console.log(`There was the following error when trying to upload a command:`, err);
        } else {
            let file = await files.filter(f => f.split(".").pop() === "js");
            if (file.length > 0) {
                await file.forEach(async (f, i) => {
                    let props = await require(`./models/${f}`);
                    let Tag = props(sequelize, Sequelize);
                    console.log(`${f} model has been added.`);
                    await client.models.set(f.split(".")[0].toLowerCase(), Tag);
                    // if (f.split(".")[0].toLowerCase() === "guild") {
                    //     await Tag.sync();
                    //     let data = await Tag.findAll();
                    //     console.log(data[0].dataValues)
                    //     await Tag.sync(
                    //         {force: true}
                    //     );
                    //     let propss = await require(`./format`);
                    //     let newTag = propss(sequelize, Sequelize);
                    //     await client.models.set(f.split(".")[0].toLowerCase(), newTag);
                    //     await newTag.sync(
                    //         {force: true}
                    //     );
                    //     for (let i = 0; i < data.length; i++) {
                    //         await newTag.create(data[i].dataValues);
                    //     }
                    //     let thing = await newTag.findAll();
                    //     console.log(thing[0].dataValues);
                    // } else {
                        Tag.sync();
                    // }
                });
            }
        }
    });
    await client.guilds.get("506524678765150209").emojis.forEach(e => { 
        client.emojisPortals.set(e.name.toLowerCase().split("_").join(""), e);
    });
    await client.guilds.get("512669868206718982").emojis.forEach(e => {
        client.emojisKeys.set(e.name.toLowerCase().replace("key", ""), e);
    });
    await client.guilds.get("512692597576302592").emojis.forEach(e => {
        client.emojisMisc.set(e.name.toLowerCase(), e);
    });
    await client.guilds.get("572234143371362316").emojis.forEach(e => {
        client.emojisWeapons.set(e.name.toLowerCase().split("_").join(""), e);
    });
    await client.guilds.get("572237674577133568").emojis.forEach(e => {
        client.emojisAbilties.set(e.name.toLowerCase().split("_").join(""), e);
    });
    await client.guilds.get("572241268680163358").emojis.forEach(e => {
        client.emojisRings.set(e.name.toLowerCase().split("_").join(""), e);
    });
});

let guilds = {};

client.on("message", async message => {
    if (message.author.bot === false) {
        if (message.channel.type === "text") {
            if (!guilds[message.guild.id]) {
                guilds[message.guild.id] = {
                    dispatcher: null,
                    music: {
                        queue: [],
                        queueNames: [],
                        queueTime: [],
                        isSelecting: false
                    },
                    answering: false,
                    typeOfRun: "",
                    pending: {},
                    rejected: {},
                    afkCheckUp: false,
                    eventAfkCheckUp: false,
                    cleaning: false,
                    aborting: false,
                    eventAborting: false,
                    finding: false,
                    location: "None",
                    eventLocation: "None",
                    aborter: {},
                    eventAborter: {},
                    aborterARL: {},
                    eventAborterARL: {},
                    keyBois: [],
                    vialBois: [],
                    rusherBois: [],
                    eventKeyBois: [],
                    eventVialBois: [],
                    collectors: {},
                    eventCollectors: {},
                    nicknameup: false
                }
            }
            if (!client.models.get("guild")) return;
            if ((message.author.id === "321726133307572235")) {
                client.models.get("guild").findOne({where: {guildID: message.guild.id}}).then(async it => {
                    if (it) {
                        let settings = it.dataValues;
                        message.guild.members.fetch().then(async guildMembers => {
                            client.commands.get("download").execute(client, message, settings, guilds, guildMembers);
                        });
                        // let command = require("./commands/help/nicknameUpdate");
                        // command(client, message.member, settings);
                    } else {
                        console.log("oops");
                    }
                });
            }
        }
    }
});
