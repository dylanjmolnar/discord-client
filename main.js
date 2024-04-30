const Sequelize = require("sequelize");
const sequelize = new Sequelize('server', 'root', '1Dkmandoo!', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: "./data/database.sqlite",
    logging: false
});
const Discord = require('discord.js');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const Jimp = require("jimp");

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
let guilds = {};

const Spotify = require('node-spotify-api');
 
client.spotify = new Spotify({
    id: import.meta.env.SPOTIFY_ID,
    secret: import.meta.env.SPOTIFY_SECRET
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
            console.log(`There was the following error when trying to upload a command:`, err);
        } else {
            let file = files.filter(f => f.split(".").pop() === "js");
            if (file.length > 0) {
                await file.forEach(async (f, i) => {
                    let props = await require(`./commands/${f}`);
                    console.log(`${f} command has been added.`);
                    await client.commands.set(f.split(".")[0].toLowerCase(), props);
                    await client.commandss.set(f.split(".")[0], {});
                });
            }
        }
    });
    await fs.readdir(`./models`, async (err, files) => {
        if (err) {
            console.log(`There was the following error when trying to upload a command:`, err);
        } else {
            let file = files.filter(f => f.split(".").pop() === "js");
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
                    //     let propss = require(`./format`);
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
    client.guilds.cache.get("506524678765150209").emojis.cache.forEach(e => { 
        client.emojisPortals.set(e.name.toLowerCase().split("_").join(""), e);
    });
    client.guilds.cache.get("512669868206718982").emojis.cache.forEach(e => {
        client.emojisKeys.set(e.name.toLowerCase().replace("key", ""), e);
    });
    client.guilds.cache.get("512692597576302592").emojis.cache.forEach(e => {
        client.emojisMisc.set(e.name.toLowerCase(), e);
    });
    client.guilds.cache.get("594918511713845256").emojis.cache.forEach(e => {
        client.emojisMisc.set(e.name.toLowerCase(), e);
    });
    client.guilds.cache.get("572234143371362316").emojis.cache.forEach(e => {
        client.emojisWeapons.set(e.name.toLowerCase().split("_").join(""), e);
    });
    client.guilds.cache.get("572237674577133568").emojis.cache.forEach(e => {
        client.emojisAbilties.set(e.name.toLowerCase().split("_").join(""), e);
    });
    client.guilds.cache.get("572241268680163358").emojis.cache.forEach(e => {
        client.emojisRings.set(e.name.toLowerCase().split("_").join(""), e);
    });

    // setTimeout(async () => {
    //     let guildsDB = await client.models.get("guild").findAll();
    //     for (let i = 0; i < guildsDB.length; i++) {
    //         if (guildsDB[i].dataValues.eventVeriSwitch) {
    //             if (client.guilds.cache.get(guildsDB[i].dataValues.guildID)) {
    //                 client.guilds.cache.get(guildsDB[i].dataValues.guildID).channels.get(guildsDB[i].dataValues.eventVeriChannel).messages.fetch({limit: 100});
    //             } else {
    //                 console.log(guildsDB[i].dataValues.guildID);
    //             }
    //         }
    //         if (guildsDB[i].dataValues.veteranVeriSwitch) {
    //             if (client.guilds.cache.get(guildsDB[i].dataValues.guildID)) {
    //                 client.guilds.cache.get(guildsDB[i].dataValues.guildID).channels.get(guildsDB[i].dataValues.veteranVeriChannel).messages.fetch({limit: 100});
    //             } else {
    //                 console.log(guildsDB[i].dataValues.guildID);
    //             }
    //         }
    //         if (guildsDB[i].dataValues.veriChannel) {
    //             if (client.guilds.cache.get(guildsDB[i].dataValues.guildID)) {
    //                 client.guilds.cache.get(guildsDB[i].dataValues.guildID).channels.get(guildsDB[i].dataValues.veriChannel).messages.fetch({limit: 100});
    //             } else {
    //                 console.log(guildsDB[i].dataValues.guildID);
    //             }
    //         }
    //     }
    // }, 5000);
});


setTimeout(async () => {
    let guildsDB = await client.models.get("guild").findAll();
    for (let i = 0; i < guildsDB.length; i++) {
        if (!guilds[guildsDB[i].dataValues.guildID]) {
            guilds[guildsDB[i].dataValues.guildID] = {
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
                vetPending: {},
                namePending: {},
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
                mysticBois: [],
                tricksterBois: [],
                nitroBois: [],
                eventKeyBois: [],
                eventVialBois: [],
                eventMysticBois: [],
                eventTricksterBois: [],
                eventNitroBois: [],
                collectors: {},
                eventCollectors: {},
                nicknameup: false
            }
        }
    }
}, 8000);


// setInterval(async () => {
//     if (!client.models.get("guild")) return;
//     let guilds = await client.models.get("guild").findAll();
//     let mutesDB = client.models.get("mutes");
//     let parsemembersDB = client.models.get("parsemembers");
//     let tempKeyDB = client.models.get("tempkeys");
//     let tempRunDB = client.models.get("temprunss");
//     let suspensionsDB = client.models.get("suspensions");
//     let moment = Date.now();
//     for (let i = 0; i < guilds.length; i++) {
//         let mutes = await mutesDB.findAll({where: {guildID: guilds[i].dataValues.guildID}}).filter(e => e.dataValues.time);
//         for (let j = 0; j < mutes.length; j++) {
//             if (mutes[j].dataValues.time <= moment) {
//                 await mutesDB.destroy({where: {guildID: mutes[j].dataValues.guildID, userID: mutes[j].dataValues.userID}});
//                 await client.guilds.cache.get(mutes[j].dataValues.guildID).members.fetch(mutes[j].dataValues.userID).then(user => {
//                     user.roles.remove(guilds[i].dataValues.mutedRole);
//                 }).catch(e => {});
//             }
//         }
//         let parsemembers = await parsemembersDB.findAll({where: {guildID: guilds[i].dataValues.guildID}});
//         for (let j = 0; j < parsemembers.length; j++) {
//             if (parsemembers[j].dataValues.time <= moment) {
//                 await parsemembersDB.destroy({where: {guildID: parsemembers[j].dataValues.guildID, messageID: parsemembers[j].dataValues.messageID}});
//                 await client.guilds.cache.get(parsemembers[j].dataValues.guildID).channels.get(guilds[i].dataValues.parsemembersChannel).messages.fetch(parsemembers[j].dataValues.messageID).then(mess => {
//                     mess.delete();
//                 }).catch(e => {});
//             }
//         }
//         let tempKey = await tempKeyDB.findAll({where: {guildID: guilds[i].dataValues.guildID}});
//         for (let j = 0; j < tempKey.length; j++) {
//             if (tempKey[j].dataValues.time <= moment) {
//                 await tempKeyDB.destroy({where: {guildID: tempKey[j].dataValues.guildID, userID: tempKey[j].dataValues.userID}});
//                 await client.guilds.cache.get(tempKey[j].dataValues.guildID).members.fetch(tempKey[j].dataValues.userID).then(async person => {
//                     await person.roles.remove(guilds[i].dataValues.tempKeyRole);
//                 }).catch(e => {});
//             }
//         }
//         let tempRun = await tempRunDB.findAll({where: {guildID: guilds[i].dataValues.guildID}});
//         for (let j = 0; j < tempRun.length; j++) {
//             if (tempRun[j].dataValues.time <= moment || tempRun[j].dataValues.guildID === "484063560385953804") {
//                 if (client.channels.get(tempRun[j].dataValues.channelID)) {
//                     let newPeople = client.channels.get(tempRun[j].dataValues.channelID).members.keyArray() || [];
//                     if (newPeople.includes(tempRun[j].dataValues.userID)) {
//                         const typeOfRun = tempRun[j].dataValues.runtype;
//                         const settings = guilds[i].dataValues;
//                         let log = await client.models.get("completedruns").findOne({where: {guildID: tempRun[j].dataValues.guildID, userID: tempRun[j].dataValues.userID}});
//                         let number = 1, number2 = 0, number3 = 0;
//                         if (settings.typeOfServer === "lh" && typeOfRun === "cult") {
//                             number = 0;
//                             number2 = 1;
//                         } else if (settings.typeOfServer === "lh" && typeOfRun !== "void" || settings.typeOfServer === "shatters" && typeOfRun !== "shatters") {
//                             number = 0;
//                             number3 = 1;
//                         }
//                         if (log) {
//                             let updateObject = {
//                                 runType1: log.dataValues.runType1 + 1
//                             }
//                             if (settings.typeOfServer === "lh" && typeOfRun === "cult") {
//                                 updateObject = {
//                                     runType2: log.dataValues.runType2 + 1
//                                 }
//                             } else if (settings.typeOfServer === "lh" && typeOfRun !== "void" || settings.typeOfServer === "shatters" && typeOfRun !== "shatters") {
//                                 updateObject = {
//                                     runType3: log.dataValues.runType3 + 1
//                                 }
//                             }
//                             await client.models.get("completedruns").update(updateObject, {where: {guildID: tempRun[j].dataValues.guildID, userID: tempRun[j].dataValues.userID}});
//                         } else {
//                             await client.models.get("completedruns").create({
//                                 guildID: tempRun[j].dataValues.guildID,
//                                 userID: tempRun[j].dataValues.userID,
//                                 runType1: number,
//                                 runType2: number2,
//                                 runType3: number3
//                             });
//                         }
//                     }
//                 }
//                 await tempRunDB.destroy({where: {guildID: tempRun[j].dataValues.guildID, time: tempRun[j].dataValues.time, userID: tempRun[j].dataValues.userID}});
//             }
//         }
//         let suspensions = await suspensionsDB.findAll({where: {guildID: guilds[i].dataValues.guildID}}).filter(e => e.dataValues.time);
//         for (let j = 0; j < suspensions.length; j++) {
//             if (suspensions[j].dataValues.time <= moment) {
//                 await client.guilds.cache.get(suspensions[j].dataValues.guildID).members.fetch(suspensions[j].dataValues.userID).then(async person => {
//                     await person.roles.remove(guilds[i].dataValues.suspendedButVerifiedRole);
//                     let roles = await client.models.get("suspensionroles").findAll({where: {messageID: suspensions[j].dataValues.messageID}});
//                     for (let l = 0; l < roles.length; l++) {
//                         await person.roles.add(roles[l].dataValues.roleID);
//                         await client.models.get("suspensionroles").destroy({where: {messageID: suspensions[j].dataValues.messageID, roleID: roles[l].dataValues.roleID}});
//                     }
//                     await client.guilds.cache.get(suspensions[j].dataValues.guildID).channels.get(guilds[i].dataValues.suspensionsChannel).messages.fetch(suspensions[j].dataValues.messageID).then(async msg => {
//                         let oldEmbed = msg.embeds[0];
//                         oldEmbed.setDescription(oldEmbed.description + `\nUnsuspended automatically.`);
//                         oldEmbed.setColor(0x00e636);
//                         await msg.edit(oldEmbed);
//                         await client.guilds.cache.get(suspensions[j].dataValues.guildID).channels.get(guilds[i].dataValues.suspensionsChannel).send(`<@${suspensions[j].dataValues.userID}>`).then(msgs => {
//                             msgs.delete();
//                         });
//                     }).catch(e => {
//                         if (suspensions[j].dataValues.messageID !== suspensions[j].dataValues.userID) {
//                             client.guilds.cache.get(suspensions[j].dataValues.guildID).channels.get(guilds[i].dataValues.suspensionsChannel).send(`${person} (${person.displayName}) is now unsuspended.`);
//                         }
//                     });
//                 }).catch(async e => {
//                     await client.guilds.cache.get(suspensions[j].dataValues.guildID).channels.get(guilds[i].dataValues.suspensionsChannel).messages.fetch(suspensions[j].dataValues.messageID).then(async msg => {
//                         let oldEmbed = msg.embeds[0];
//                         oldEmbed.setDescription(oldEmbed.description + `\nUnsuspended automatically.`);
//                         oldEmbed.setColor(0x00e636);
//                         await msg.edit(oldEmbed);
//                         await client.guilds.cache.get(suspensions[j].dataValues.guildID).channels.get(guilds[i].dataValues.suspensionsChannel).send(`<@${suspensions[j].dataValues.userID}>`).then(msgs => {
//                             msgs.delete();
//                         });
//                     }).catch(e => {
//                         client.guilds.cache.get(suspensions[j].dataValues.guildID).channels.get(guilds[i].dataValues.suspensionsChannel).send(`<@${suspensions[j].dataValues.userID}> (Left Server) is now unsuspended.`);
//                     });
//                 });
//                 await suspensionsDB.destroy({where: {guildID: suspensions[j].dataValues.guildID, userID: suspensions[j].dataValues.userID}});
//             }
//         }
//     }
// }, 10000);

// new CronJob('00 00 23 * * 6', () => {
//     let endWeek = require("./commands/help/endWeek");
//     endWeek(client, {
//         ping: true
//     });
// }, null, true, 'EST');

let guildCommand = require("./commands/help/searchGuilds");
let playerCommand = require("./commands/help/nickname_search");
let pSuspendCommand = require("./commands/permanentSuspend");
// setInterval(async () => {
//     let guildsDB = await client.models.get("guild").findAll();
//     for (let i = 0; i < guildsDB.length; i++) {
//         let guild = client.guilds.cache.get(guildsDB[i].dataValues.guildID);
//         let members = await guild.members.fetch();
//         let blacklist = await client.models.get("expelledguilds").findAll({where: {guildID: guildsDB[i].dataValues.guildID}});
//         let channel = await client.models.get("commandschannels").findOne({where: {guildID: guildsDB[i].dataValues.guildID}});
//         let message = {
//             guild: guild,
//             author: client.user
//         }
//         if (channel) {
//             message.channel = guild.channels.get(channel.dataValues.channelID);
//         }
//         for (let j = 0; j < blacklist.length; j++) {
//             try {
//                 let data = await guildCommand(blacklist[j].dataValues.guildName);
//                 if (!data.error) {
//                     for (let u = 0; u < data.members.length; u++) {
//                         if (data.members[u].name !== "Private") {
//                             let user = await playerCommand(guildsDB[i].dataValues.guildID, members, data.members[u].name, guildsDB[i].dataValues);
//                             if (user) {
//                                 if (user.roles.get(guildsDB[i].dataValues.raiderRole)) {
//                                     message.content = `psuspend ${user.id} being in a blacklisted guild (${blacklist[j].dataValues.guildName}), appeal through modmail feature`;
//                                     await pSuspendCommand.execute(client, message, guildsDB[i].dataValues, {}, members);
//                                 }
//                             }
//                         }
//                     }
//                 }
//             } catch(e) {
//                 console.log(e);
//             }
//             await sleep(500);
//         }
//         if (blacklist.length > 0 && message.channel) {
//             message.channel.send(`Blacklist has been fully checked!`).catch(e => {});
//         }
//     }
// }, 3600000);

let lastVetReactions = {};
let lastReactions = {};

let userDataCommand = require("./commands/help/searchRealmeye");
// client.on("messageReactionAdd", async (messageReaction, user) => {
//     if (messageReaction.message.guild && !messageReaction.users.last().bot) {
//         if (!client.models.get("guild")) return;
//         let settingsss = await client.models.get("guild").findOne({where: {guildID: messageReaction.message.guild.id}});
//         if (!settingsss) return;
//         let settings = settingsss.dataValues;
//         if (settings.veriSwitch) {
//             if (messageReaction.message.channel.id === settings.veriChannel) {
//                 let userID = messageReaction.users.lastKey();
//                 messageReaction.message.guild.members.fetch(userID).then(async member => {
//                     if (messageReaction.emoji.name === "✅") {
//                         let commandd = require("./commands/help/verifyTest");
//                         commandd(client, messageReaction.message.guild, settings, userID, guilds);
//                     }
//                 }).catch(e => {});
//             }
//         }
//         if (settings.eventVeriSwitch) {
//             if (messageReaction.message.id === settings.veriEventMessage) {
//                 let userID = messageReaction.users.lastKey();
//                 messageReaction.message.guild.members.fetch(userID).then(async member => {
//                     if (messageReaction.emoji.name === "✅") {
//                         if (!lastReactions[userID]) {
//                             lastReactions[userID] = {
//                                 placeholder: "Yes"
//                             }
//                             setTimeout(() => {
//                                 delete lastReactions[userID];
//                             }, 10000);
//                             await member.roles.add("506379889541251082").catch(e => {});
//                             await messageReaction.message.channel.send(`${member}, you have now been added to the ${messageReaction.message.guild.roles.get("506379889541251082").name} role.`).then(msg => {
//                                 setTimeout(() => {
//                                     msg.delete();
//                                 }, 10000);
//                             }).catch(e => {});
//                         }
//                     } else if (messageReaction.emoji.name === "❌") {
//                         if (member.roles.get("506379889541251082")) {
//                             await member.roles.remove("506379889541251082").catch(e => {});
//                             await messageReaction.message.channel.send(`${member}, you have now been removed from the ${messageReaction.message.guild.roles.get("506379889541251082").name} role.`).then(msg => {
//                                 setTimeout(() => {
//                                     msg.delete();
//                                 }, 10000);
//                             }).catch(e => {});
//                         }
//                     }
//                 }).catch(e => {});
//             }
//         }
//         if (settings.veteranVeriSwitch) {
//             if (messageReaction.message.id === settings.veriVeteranMessage) {
//                 let userID = messageReaction.users.lastKey();
//                 messageReaction.message.guild.members.fetch(userID).then(async member => {
//                     if (messageReaction.emoji.name === "✅") {
//                         if (member.roles.get(settings.veteranRole)) {
//                             return messageReaction.message.channel.send(`${member}, you already have the ${messageReaction.message.guild.roles.get(settings.veteranRole).name} role, you cannot get it again.`).then(msg => {
//                                 setTimeout(() => {
//                                     msg.delete();
//                                 }, 10000);
//                             }).catch(e => {});
//                         }
//                         let pending = await client.models.get("vetpending").findOne({where: {guildID: messageReaction.message.guild.id, userID: member.id}});
//                         if (!lastVetReactions[userID] && !guilds[messageReaction.message.guild.id].vetPending[member.id] && !pending) {
//                             lastVetReactions[userID] = {
//                                 placeholder: "Yes"
//                             }
//                             setTimeout(() => {
//                                 delete lastVetReactions[userID];
//                             }, 10000);
//                             let name = member.nickname;
//                             while(!/^[a-zA-Z]*$/.test(name[0]) && name[0]) {
//                                 name = name.slice(1);
//                             }
//                             let newName = name.split(" | ")[0];
//                             if (!/^[a-zA-Z]*$/.test(newName)) {
//                                 return member.send(`I cannot complete this request because your nickname is not setup correctly. Please contact <@321726133307572235> for more information.`).catch(e => {});
//                             }
//                             try {
//                                 messageReaction.message.channel.send(`${member}, checking your realmeye now; this can take a couple of seconds to complete...`).then(msg => {
//                                     setTimeout(() => {
//                                         msg.delete().catch(e => {});
//                                     }, 10000);
//                                 }).catch(e => {});
//                                 let data = await userDataCommand(newName, {
//                                     graveyard: true,
//                                     pastRuns: true
//                                 });
//                                 if (!data.characters) {
//                                     return messageReaction.message.channel.send(`${member}, your characters on realmeye are hidden. Please unprivate them to continue.`).then(msg => {
//                                         setTimeout(() => {
//                                             msg.delete().catch(e => {});
//                                         }, 10000);
//                                     }).catch(e => {});
//                                 }
//                                 if (!data.runs || !data.graveyard) {
//                                     return messageReaction.message.channel.send(`${member}, your graveyard on realmeye is hidden. Please unprivate it to continue.`).then(msg => {
//                                         setTimeout(() => {
//                                             msg.delete().catch(e => {});
//                                         }, 10000);
//                                     }).catch(e => {});
//                                 }
//                                 let failed = [];
//                                 let numberOfRuns = (settings.typeOfServer === "lh") ? (/^[0-9]*$/.test(data.runs.Lost_Halls_Completed)) ? data.runs.Lost_Halls_Completed + data.runs.Voids_Completed + data.runs.Cultist_Hideouts_Completed : 0 : data.runs.Shatters;
//                                 let runsLog = await client.models.get("completedruns").findOne({where: {guildID: messageReaction.message.guild.id, userID: userID}});
//                                 let numberOfRuns2 = (runsLog) ? runsLog.runType1 + runsLog.runType2 : 0;
//                                 if (data.characters.filter(e => parseInt(e.stats_maxed[0]) >= settings.veteranVeriMaxed).length < settings.veteranVeriChar) {
//                                     failed.push(`-Doesn't have enough 8/8 characters`);
//                                 }
//                                 if (messageReaction.message.guild.id === "343704644712923138" && data.characters.filter(e => parseInt(e.stats_maxed[0]) >= settings.veteranVeriMaxed && (e.class === "Wizard" || e.class === "Paladin" || e.class === "Warrior" || e.class === "Knight" || e.class === "Archer" || e.class === "Huntress" || e.class === "Priest" || e.class === "Samurai")).length < 1) {
//                                     failed.push(`-Doesn't have an 8/8 for the specific classes`);
//                                 }
//                                 if (numberOfRuns < settings.veteranVeriRuns && numberOfRuns2 < settings.veteranVeriRuns) {
//                                     failed.push(`-Doesn't have enough runs completed`);
//                                 }
//                                 if (failed.length === 0) {
//                                     messageReaction.message.guild.channels.get(settings.veriLogChannel).send(`${member} (${member.nickname}) has been given the ${messageReaction.message.guild.roles.get(settings.veteranRole).name} role automatically.`);
//                                     member.roles.add(settings.veteranRole).catch(e => {});
//                                     messageReaction.message.channel.send(`${member} the ${messageReaction.message.guild.roles.get(settings.veteranRole).name} role has now been added!`).then(msg => {
//                                         setTimeout(() => {
//                                             msg.delete();
//                                         }, 10000);
//                                     }).catch(e => {});
//                                 } else {
//                                     let whiteCounter = 0;
//                                     let redWeaponCounter = 0;
//                                     let redArmorCounter = 0;
//                                     let orangeCounter = 0;
//                                     let shattersWhites = 0;
//                                     for (let i = 0; i < data.characters.length; i++) {
//                                         if (data.characters[i].weapon) {
//                                             if (data.characters[i].weapon.endsWith("T13")) {
//                                                 redWeaponCounter++;
//                                             } else if (data.characters[i].weapon === "Bow of the Void UT" || data.characters[i].weapon === "Sword of the Colossus UT" || data.characters[i].weapon === "Staff of Unholy Sacrifice UT") {
//                                                 whiteCounter++;
//                                             } else if (data.characters[i].weapon === "Carved Golem Remains UT") {
//                                                 orangeCounter++;
//                                             }
//                                         }
//                                         if (data.characters[i].ability) {
//                                             if (data.characters[i].ability === "Quiver of the Shadows UT" || data.characters[i].ability === "Marble Seal UT" || data.characters[i].ability === "Skull of Corrupted Souls UT") {
//                                                 whiteCounter++;
//                                             } else if (data.characters[i].ability === "Brain of the Golem UT") {
//                                                 orangeCounter++;
//                                             }
//                                         }
//                                         if (data.characters[i].armor) {
//                                             if (data.characters[i].armor.endsWith("T14")) {
//                                                 redArmorCounter++;
//                                             } else if (data.characters[i].armor === "Armor of Nil UT" || data.characters[i].armor === "Breastplate of New Life UT" || data.characters[i].armor === "Ritual Robe UT") {
//                                                 whiteCounter++;
//                                             } else if (data.characters[i].armor === "Golem Garments UT") {
//                                                 orangeCounter++;
//                                             }
//                                         }
//                                         if (data.characters[i].ring) {
//                                             if (data.characters[i].ring === "Sourcestone UT" || data.characters[i].ring === "Omnipotence Ring UT" || data.characters[i].ring === "Magical Lodestone UT" || data.characters[i].ring === "Bloodshed Ring UT") {
//                                                 whiteCounter++;
//                                             } else if (data.characters[i].ring === "Rusty Cuffs UT") {
//                                                 orangeCounter++;
//                                             } else if (data.characters[i].ring === "Bracer of the Guardian UT" || data.characters[i].ring === "The Twilight Gemstone UT" || data.characters[i].ring === "The Forgotten Crown UT" || data.characters[i].ring === "Ice Crown UT") {
//                                                 shattersWhites++;
//                                             }
//                                         }
//                                     }
//                                     for (let i = 0; i < data.graveyard.length; i++) {
//                                         if (data.graveyard[i].weapon) {
//                                             if (data.graveyard[i].weapon.endsWith("T13")) {
//                                                 redWeaponCounter++;
//                                             } else if (data.graveyard[i].weapon === "Bow of the Void UT" || data.graveyard[i].weapon === "Sword of the Colossus UT" || data.graveyard[i].weapon === "Staff of Unholy Sacrifice UT") {
//                                                 whiteCounter++;
//                                             } else if (data.graveyard[i].weapon === "Carved Golem Remains UT") {
//                                                 orangeCounter++;
//                                             }
//                                         }
//                                         if (data.graveyard[i].ability) {
//                                             if (data.graveyard[i].ability === "Quiver of the Shadows UT" || data.graveyard[i].ability === "Marble Seal UT" || data.graveyard[i].ability === "Skull of Corrupted Souls UT") {
//                                                 whiteCounter++;
//                                             } else if (data.graveyard[i].ability === "Brain of the Golem UT") {
//                                                 orangeCounter++;
//                                             }
//                                         }
//                                         if (data.graveyard[i].armor) {
//                                             if (data.graveyard[i].armor.endsWith("T14")) {
//                                                 redArmorCounter++;
//                                             } else if (data.graveyard[i].armor === "Armor of Nil UT" || data.graveyard[i].armor === "Breastplate of New Life UT" || data.graveyard[i].armor === "Ritual Robe UT") {
//                                                 whiteCounter++;
//                                             } else if (data.graveyard[i].armor === "Golem Garments UT") {
//                                                 orangeCounter++;
//                                             }
//                                         }
//                                         if (data.graveyard[i].ring) {
//                                             if (data.graveyard[i].ring === "Sourcestone UT" || data.graveyard[i].ring === "Omnipotence Ring UT" || data.graveyard[i].ring === "Magical Lodestone UT" || data.graveyard[i].ring === "Bloodshed Ring UT") {
//                                                 whiteCounter++;
//                                             } else if (data.graveyard[i].ring === "Rusty Cuffs UT") {
//                                                 orangeCounter++;
//                                             } else if (data.graveyard[i].ring === "Bracer of the Guardian UT" || data.graveyard[i].ring === "The Twilight Gemstone UT" || data.graveyard[i].ring === "The Forgotten Crown UT" || data.graveyard[i].ring === "Ice Crown UT") {
//                                                 shattersWhites++;
//                                             }
//                                         }
//                                     }
//                                     let embed = new Discord.MessageEmbed();
//                                     embed.setAuthor(`${member.user.tag} tried to verify as a veteran as: ${newName}!`, member.user.displayAvatarURL());
//                                     embed.setDescription(`${member}**'s Application: [Player Link](https://www.realmeye.com/player/${newName})** (\* Required Fields)`);
//                                     if (settings.typeOfServer === "lh") {
//                                         embed.addField(`Runs logged on bot:`, `Total: ${numberOfRuns2} | Void: ${(runsLog) ? runsLog.runType1 : 0} | Cult: ${(runsLog) ? runsLog.runType2 : 0}`);
//                                         embed.addField(`Runs logged on RealmEye:`, `Total: ${numberOfRuns} | MBC: ${data.runs.Lost_Halls_Completed} | Void: ${data.runs.Voids_Completed} | Cult: ${data.runs.Cultist_Hideouts_Completed}`);
//                                     } else {
//                                         embed.addField(`Runs logged on bot:`, `Shatters: ${numberOfRuns2}`);
//                                         embed.addField(`Runs logged on RealmEye:`, `Shatters: ${numberOfRuns}`);
//                                     }
//                                     if (settings.typeOfServer === "lh") {
//                                         embed.addField(`Lost Halls Gear:`, `${client.guilds.cache.get("594918511713845256").emojis.find(e => e.name.toLowerCase() === "whitebag")}: \`${whiteCounter}\` | ${client.emojisMisc.get("tier13weapons")}: \`${redWeaponCounter}\` | ${client.emojisMisc.get("tier14armor")}: \`${redArmorCounter}\` | ${client.guilds.cache.get("512692597576302592").emojis.find(e => e.name.toLowerCase() === "orange_bag")}: \`${orangeCounter}\``);
//                                     } else if (settings.typeOfServer === "shatters") {
//                                         embed.addField(`Shatters Gear:`, `${client.guilds.cache.get("594918511713845256").emojis.find(e => e.name.toLowerCase() === "whitebag")}: \`${shattersWhites}\``);
//                                     }
//                                     embed.addField(`Problems:`, `${failed.join("\n")}`);
//                                     messageReaction.message.guild.channels.get(settings.veriVetPendingChannel).send(embed).then(async msg => {
//                                         msg.react("🔑");
//                                         await client.models.get("vetpending").create({
//                                             guildID: messageReaction.message.guild.id,
//                                             userID: member.id,
//                                             messageID: msg.id
//                                         });
//                                     }).catch(e => {});
//                                     messageReaction.message.channel.send(`${member}, you are now being manually reviewed. This process can take up to 48 hours. Please be patient.`).then(msg => {
//                                         setTimeout(() => {
//                                             msg.delete();
//                                         }, 10000);
//                                     }).catch(e => {});
//                                     if (data.characters.length) {
//                                         let charEmbed = new Discord.MessageEmbed();
//                                         let charCommand = require("./commands/help/findEmoji");
//                                         for (let i = 0; i < data.characters.length; i++) {
//                                             let emojis = await charCommand(client, data.characters[i]);
//                                             charEmbed.addField(`${data.characters[i].class}:`,
//                                             `${client.emojisMisc.get(data.characters[i].class.toLowerCase())} Level: \`${data.characters[i].level}\` CQC: \`${data.characters[i].class_quests_completed}\` Fame: \`${data.characters[i].base_fame}\` Place: \`${data.characters[i].place}\` ${emojis.weapon} ${emojis.ability} ${emojis.armor} ${emojis.ring} ${emojis.backpack} Stats: \`${data.characters[i].stats_maxed}\``);
//                                         }
//                                         messageReaction.message.guild.channels.get(settings.veriVetPendingChannel).send(charEmbed).catch(e => {});
//                                     }
//                                 }
//                             } catch (e) {
//                                 console.log(e);
//                             }
//                         }
//                     } else if (messageReaction.emoji.name === "❌") {
//                         if (member.roles.get(settings.veteranRole)) {
//                             await member.roles.remove(settings.veteranRole).catch(e => {});
//                             return messageReaction.message.channel.send(`${member}, you have now been removed from the ${messageReaction.message.guild.roles.get(settings.veteranRole).name} role.`).then(msg => {
//                                 setTimeout(() => {
//                                     msg.delete();
//                                 }, 10000);
//                             }).catch(e => {});
//                         }
//                     }
//                 }).catch(e => {});
//             }
//         }
//     }
// });

client.on("messageCreate", async message => {
    if (message.author.bot === false) {
        if (message.channel.type === 0) {
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
                    vetPending: {},
                    namePending: {},
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
                    mysticBois: [],
                    tricksterBois: [],
                    nitroBois: [],
                    eventKeyBois: [],
                    eventVialBois: [],
                    eventMysticBois: [],
                    eventTricksterBois: [],
                    eventNitroBois: [],
                    collectors: {},
                    eventCollectors: {},
                    nicknameup: false
                }
            }
            if (!client.models.get("guild")) return;
            client.models.get("guild").findOne({where: {guildID: message.guild.id}}).then(async it => {
                if (it) {
                    let settings = it.dataValues;
                    if (settings.autoMuteSwitch) {
                        if (message.mentions.roles.size > 0) {
                            message.guild.members.fetch(message.author.id).then(async person => {
                                let rlOrNot = false;
                                let autoMuteRoles = await client.models.get("automuteroles").findAll({where: {guildID: message.guild.id}});
                                let personRoles = person.roles.keyArray();
                                for (let i = 0; i < autoMuteRoles.length; i++) {
                                    if (personRoles.includes(autoMuteRoles[i].dataValues.roleID)) {
                                        rlOrNot = true;
                                        break;
                                    }
                                }
                                if (!rlOrNot) {
                                    await person.roles.add(settings.mutedRole);
                                    await person.send(`Do **NOT** ping roles! This is your first warning, concurrent events will result in a longer mute. Your mute will last one day.`).catch(e => {});
                                    let embed = new Discord.MessageEmbed();
                                    embed.setTitle(`Auto-mute for server: \`${message.guild.name}\``);
                                    embed.setDescription(`${person} is now muted for one day for pinging roles.\nChannel: ${message.channel}\n[Message](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) content: "${message.content}"`);
                                    embed.setTimestamp(new Date());
                                    embed.setColor(0x5e040f);
                                    await message.guild.channels.get(settings.modLogsChannel).send(embed);
                                    await client.models.get("mutes").create({
                                        guildID: message.guild.id,
                                        userID: person.id,
                                        time: Date.now() + 86400000,
                                        reason: `Auto-muted for pinging roles.`
                                    });
                                }
                            }).catch(e => {});
                        }
                    }
                    if (message.content.startsWith(settings.prefix)) {
                        while (message.content.includes("  ")) {
                            message.content = message.content.replace(/  /g, " ");
                        }
                        let args = message.content.toLowerCase().split(" ");
                        let commandInText;
                        if (message.content.toLowerCase().startsWith(`${settings.prefix}${settings.prefix}`)) {
                            commandInText = args[0].slice(settings.prefix.length * 2);
                        } else if (message.content.toLowerCase().startsWith(`${settings.prefix}`)) {
                            commandInText = args[0].slice(settings.prefix.length);
                        }
                        let commandToRun = client.commands.get(commandInText) || client.commands.filter(e => e.aliases).find(e => e.aliases.find(e => e.toLowerCase() === commandInText));
                        if (commandToRun) {
                            if ((commandToRun.premium || commandToRun.type === "private") && message.author.id !== "321726133307572235") return;
                            for (let i = 0; i < commandToRun.channels.length; i++) {
                                if (!message.guild.channels.get(settings[commandToRun.channels[i]])) {
                                    return message.channel.send(`One or more channel is not setup, and I cannot excecute this command as a result.`).catch(e => {});
                                }
                            }
                            for (let i = 0; i < commandToRun.roles.length; i++) {
                                if (!message.guild.roles.get(settings[commandToRun.roles[i]])) {
                                    return message.channel.send(`One or more role is not setup, and I cannot excecute this command as a result.`).catch(e => {});
                                }
                            }
                            let commandsDB = client.models.get("commandschannels");
                            let channels = await commandsDB.findOne({where: {channelID: message.channel.id}});
                            if (commandToRun.type !== "music") {
                                if (commandInText !== "setup" && commandInText !== "stats" && commandInText !== "leaderboard" && commandInText !== "leaderboards") {
                                    if (!commandToRun.public) {
                                        try {
                                            if (message.channel.id === settings.publicCommandsChannel && !commandToRun.allChannels) return;
                                            let rlOrNot = false;
                                            let autoMuteRoles = await client.models.get("automuteroles").findAll({where: {guildID: message.guild.id}});
                                            let person = await message.guild.members.fetch(message.author.id);
                                            let personRoles = person.roles.keyArray();
                                            for (let i = 0; i < autoMuteRoles.length; i++) {
                                                if (personRoles.includes(autoMuteRoles[i].dataValues.roleID)) {
                                                    rlOrNot = true;
                                                    break;
                                                }
                                            }
                                            if ((!channels && !commandToRun.allChannels) || (!rlOrNot && commandToRun.allChannels)) return;
                                        } catch(e) {
                                            return;
                                        }
                                    } else {
                                        if (!channels) return;
                                    }
                                }
                            } else {
                                if (message.channel.id !== settings.musicChannel && (!channels || message.channel.id === settings.publicCommandsChannel)) return;
                            }
                            if ((commandInText === "stats" || commandInText === "leaderboard" || commandInText === "leaderboards" || commandInText === "lb") && !channels) {
                                setTimeout(() => {
                                    message.delete().catch(e => {});
                                }, 15000);
                            }
                            message.guild.members.fetch().then(async guildMembers => {
                                //console.log(guildMembers.get(client.user.id).permissionsIn(message.channel).toArray())
                                if (!guildMembers.get(client.user.id).permissionsIn(message.channel).toArray().includes(`SendMessages`)) {
                                    return message.author.send(`I cannot complete this command as I do not have permissions to \`SEND_MESSAGES\` in the channel you used this command.`);
                                }
                                commandToRun.execute(client, message, settings, guilds, guildMembers);
                            }).catch(async e => {
                                await message.channel.send(`I could not complete the command requested as I could not cache all members from the discord.\nThis is a Discord error, not a problem with the bot. Attempting to restart to combat this.`);
                                client.destroy();
                                client.login(process.env.DISCORD_TOKEN);
                            });
                        }
                    }
                } else {
                    console.log("Server not found!");
                }
            });
        } else if (message.channel.type === 1) {
            if (message.content) {
                let command = message.content.split(" ")[0].toLowerCase();
                let guildsArray = await client.models.get("guild").findAll();
                let userArray = [];
                for (let i = 0; i < guildsArray.length; i++) {
                    if (guilds[guildsArray[i].dataValues.guildID].pending[message.author.id]) return;
                    let blacklisted = await client.models.get("feedbackblacklist").findOne({where: {guildID: guildsArray[i].dataValues.guildID, userID: message.author.id}});
                    if (command.startsWith(guildsArray[i].dataValues.prefix) && !blacklisted && guildsArray[i].dataValues.statsSwitch) {
                        let commander = client.commands.get(`${message.content.toLowerCase().split(" ")[0].slice(guildsArray[i].dataValues.prefix.length)}`) || client.commands.filter(e => e.aliases).find(e => e.aliases.find(e => e.toLowerCase() === message.content.toLowerCase().split(" ")[0].slice(guildsArray[i].dataValues.prefix.length)));
                        let guild = client.guilds.cache.get(guildsArray[i].dataValues.guildID);
                        if (guild.members.get(message.author.id) && commander) {
                            if (commander.dms) {
                                userArray.push([guild, guildsArray[i].dataValues]);
                            }
                        }
                    }
                }
                if (userArray.length === 1) {
                    return runCommand(message, userArray[0]);
                } else if (userArray.length > 1) {
                    let embed = new Discord.MessageEmbed();
                    embed.setDescription(`Which server would you like to use this command for?`);
                    let emojis = [
                        "1⃣",
                        "2⃣",
                        "3⃣",
                        "4⃣",
                        "5⃣",
                        "6⃣",
                        "7⃣",
                        "8⃣",
                        "9⃣"
                    ];
                    for (let i = 0; i < userArray.length; i++) {
                        embed.setDescription(`${embed.description}\n${emojis[i]} ${client.guilds.cache.get(userArray[i][1].guildID).name}`);
                    }
                    return message.author.send(embed).then(async msg => {
                        let filter = (reaction, user) => true;
                        let collector = new Discord.ReactionCollector(msg, filter, {time: 60000});
                        collector.on("collect", async (reaction, user) => {
                            if (!user.bot) {
                                if (/^[0-9]*$/.test(reaction.emoji.name[0])) {
                                    collector.stop();
                                    await runCommand(message, userArray[parseInt(reaction.emoji.name[0]) - 1]);
                                } else if (reaction.emoji.name === "❌") {
                                    collector.stop();
                                }
                            }
                        });
                        collector.on("end", (collected) => {
                            msg.delete().catch(e => {});
                        });
                        for (let i = 0; i < userArray.length; i++) {
                            await msg.react(emojis[i]);
                        }
                        await msg.react("❌");
                    }).catch(e => {});
                }
                async function runCommand(message, userArray) {
                    let settings = userArray[1];
                    let commandInText = message.content.split(" ")[0].slice(settings.prefix.length);
                    let myCommand = client.commands.get(commandInText) || client.commands.filter(e => e.aliases).find(e => e.aliases.find(e => e.toLowerCase() === commandInText));
                    if (myCommand) {
                        if ((myCommand.premium || myCommand.type === "private") && message.author.id !== "321726133307572235") return;
                        if (myCommand.dms) {
                            let guild = userArray[0];
                            guild.members.fetch().then(guildMembers => {
                                let msg = {};
                                msg.content = message.content;
                                msg.guild = guild;
                                msg.author = message.author;
                                msg.id = message.id;
                                if (settings.loggingSecondary || settings.modmailChannel) {
                                    let author = guildMembers.get(message.author.id);
                                    let embeds1 = new Discord.MessageEmbed();
                                    embeds1.setAuthor(message.author.tag, message.author.displayAvatarURL());
                                    embeds1.setDescription(`${author} sent the bot: "${message.content}"`);
                                    embeds1.setFooter(`User ID: ${message.author.id}`);
                                    embeds1.setColor(0x3651e2);
                                    embeds1.setTimestamp(new Date());
                                    guild.channels.get(settings.loggingSecondary || settings.modmailChannel).send(embeds1);
                                }
                                return myCommand.execute(client, msg, settings, guilds, guildMembers);
                            }).catch(e => {
                                return;
                            });
                        }
                    }
                }
            }
            let guildsArray = await client.models.get("guild").findAll();
            let userArray1 = [];
            for (let i = 0; i < guildsArray.length; i++) {
                let number = 0;
                if (message.content) {
                    if (message.content.toLowerCase() === "done" || message.content.toLowerCase() === "-done" || message.content.toLowerCase() === "stop" || message.content.toLowerCase() === "-stop" || message.content.toLowerCase() === "end" || message.content.toLowerCase() === "-end" || message.content.toLowerCase() === "cancel" || message.content.toLowerCase() === "-cancel") {
                        let settings = guildsArray[i].dataValues;
                        number++;
                        if (settings.veriSwitch) {
                            let guild = settings.guildID;
                            if (!message.author.bot && guilds[guild].pending[message.author.id]) {
                                let author = await client.guilds.cache.get(guild).members.fetch(message.author.id).catch(e => {});
                                if (author) {
                                    let embeds1 = new Discord.MessageEmbed();
                                    embeds1.setAuthor(message.author.tag, message.author.displayAvatarURL());
                                    embeds1.setDescription(`${author} sent the bot: "${message.content}"`);
                                    embeds1.setFooter(`User ID: ${message.author.id} MSG ID: ${message.id}`);
                                    embeds1.setColor(0x3651e2);
                                    embeds1.setTimestamp(new Date());
                                    client.guilds.cache.get(guild).channels.get(settings.veriAttemptsChannel).send(embeds1);
                                }
                            }
                        }
                    }
                }
                if (number === 0) {
                    let blacklisted = await client.models.get("feedbackblacklist").findOne({where: {guildID: guildsArray[i].dataValues.guildID, userID: message.author.id}});
                    if (guildsArray[i].modmailSwitch && !blacklisted) {
                        let user = await client.guilds.cache.get(guildsArray[i].dataValues.guildID).members.fetch(message.author.id).catch(e => {});
                        if (user) {
                            userArray1.push([user, guildsArray[i].dataValues]);
                        }
                    }
                }
            }
            if (userArray1.length === 1) {
                await modmail(message, userArray1[0][0], userArray1[0][1])
            } else if (userArray1.length > 0) {
                let embed = new Discord.MessageEmbed();
                embed.setDescription(`Which server would you like to send this to?`);
                let emojis = [
                    "1⃣",
                    "2⃣",
                    "3⃣",
                    "4⃣",
                    "5⃣",
                    "6⃣",
                    "7⃣",
                    "8⃣",
                    "9⃣"
                ]
                for (let i = 0; i < userArray1.length; i++) {
                    embed.setDescription(`${embed.description}\n${emojis[i]} ${client.guilds.cache.get(userArray1[i][1].guildID).name}`);
                }
                message.author.send(embed).then(async msg => {
                    let filter = (reaction, user) => true;
                    let collector = new Discord.ReactionCollector(msg, filter, {time: 60000});
                    collector.on("collect", async (reaction, user) => {
                        if (!user.bot) {
                            if (/^[0-9]*$/.test(reaction.emoji.name[0])) {
                                await modmail(message, userArray1[parseInt(reaction.emoji.name[0]) - 1][0], userArray1[parseInt(reaction.emoji.name[0]) - 1][1]);
                                collector.stop();
                            } else if (reaction.emoji.name === "❌") {
                                collector.stop();
                            }
                        }
                    });
                    collector.on("end", (collected) => {
                        msg.delete().catch(e => {});
                    });
                    for (let i = 0; i < userArray1.length; i++) {
                        await msg.react(emojis[i]);
                    }
                    await msg.react("❌");
                }).catch(e => {});
            }
        }
    }
});

// client.on("raw", async (events)=> {
//     if (!client.models.get("guild") || !events.d) return;
//     if (!events.d.guild_id) return;
//     let settingsss = await client.models.get("guild").findOne({where: {guildID: events.d.guild_id}});
//     if (!settingsss) return;
//     let settings = settingsss.dataValues;
//     if (events.t === "MESSAGE_REACTION_ADD") {
//         if (client.channels.get(events.d.channel_id)) {
//             if (events.d.emoji.name === "✅" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id) {
//                 if ((events.d.channel_id === settings.veriRejectionChannel || events.d.channel_id === settings.veriLogChannel) && settings.veriSwitch) {
//                     let log = await client.models.get("pending").findOne({where: {messageID: events.d.message_id}});
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let embed = msg.embeds[0];
//                         let endingPosition = embed.description.indexOf(">");
//                         let startingPosition;
//                         if (embed.description.startsWith("<@!")) {
//                             startingPosition = embed.description.indexOf("!");
//                         } else {
//                             startingPosition = embed.description.indexOf("@");
//                         }
//                         let id = embed.description.substring(startingPosition + 1, endingPosition);
//                         let startingPosition1 = embed.author.name.lastIndexOf(":") + 1;
//                         let endingPosition1 = embed.author.name.lastIndexOf("!");
//                         let name = embed.author.name.substring(startingPosition1 + 1, endingPosition1);
//                         let pending = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: events.d.message_id}});
//                         await msg.reactions.removeAll();
//                         await msg.react("💯");
//                         if (pending) {
//                             embed.setFooter(`Accepted by ${author.displayName}`);
//                         } else {
//                             embed.setFooter(`Manually verified by ${author.displayName}`);
//                         }
//                         await msg.edit(embed);
//                         await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, messageID: events.d.message_id}});
//                         if (startingPosition !== -1 && endingPosition !== -1 && startingPosition1 !== -1 && endingPosition1 !== -1 && startingPosition1 - endingPosition1 < 11) {
//                             let blacklisted = await client.models.get("expelled").findOne({where: {guildID: events.d.guild_id, inGameName: name.toLowerCase()}});
//                             if (blacklisted) {
//                                 await client.models.get("expelled").destroy({where: {guildID: events.d.guild_id, inGameName: name.toLowerCase()}});
//                             }
//                             client.guilds.cache.get(events.d.guild_id).members.fetch(id).then(async person => {
//                                 await person.roles.forEach(async e => {
//                                     if (parseInt(e.position) !== 0) {
//                                         await person.roles.remove(e.id);
//                                     }
//                                 });
//                                 await person.roles.add(settings.raiderRole);
//                                 if (person.user.username === name) {
//                                     if (person.user.username.toLowerCase() === name) {
//                                         await person.setNickname(name.toUpperCase());
//                                     } else {
//                                         await person.setNickname(name.toLowerCase());
//                                     }
//                                 } else {
//                                     await person.setNickname(name);
//                                 }
//                                 await person.send(`You are now verified!`);
//                             }).catch(e => {
//                                 author.send("That user has left the server. His module will display verified, but no roles will be added");
//                             });
//                         } else {
//                             author.send("Something went wrong. Please tell <@321726133307572235> something went wrong with the manual ✅.");
//                         }
//                     }).catch(e => {});
//                 } else if (events.d.channel_id === settings.veriVetPendingChannel && settings.veteranVeriSwitch) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let embed = msg.embeds[0];
//                         let endingPosition = embed.description.indexOf(">");
//                         let startingPosition;
//                         if (embed.description.startsWith("<@!")) {
//                             startingPosition = embed.description.indexOf("!");
//                         } else {
//                             startingPosition = embed.description.indexOf("@");
//                         }
//                         let id = embed.description.substring(startingPosition + 1, endingPosition);
//                         embed.setFooter(`Accepted by ${author.displayName}`);
//                         await msg.edit(embed).catch(e => {});
//                         setTimeout(async () => {
//                             await msg.reactions.removeAll().catch(e => {});
//                             await msg.react("💯").catch(e => {});
//                         }, 2000);
//                         if (startingPosition !== -1 && endingPosition !== -1) {
//                             client.guilds.cache.get(events.d.guild_id).members.fetch(id).then(async person => {
//                                 await person.roles.add(settings.veteranRole).catch(e => {});
//                                 await person.send(`You are now a veteran raider!`).catch(e => {});
//                                 await client.models.get("vetpending").destroy({where: {guildID: events.d.guild_id, userID: id}});
//                             }).catch(e => {
//                                 author.send("That user has left the server. His module will display verified, but no roles will be added");
//                             });
//                         } else {
//                             author.send("Something went wrong. Please tell <@321726133307572235> something went wrong with the manual ✅.");
//                         }
//                     }).catch(e => {});
//                 }
//             } else if (events.d.emoji.name === "📧" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id) {
//                 let time = require("./commands/help/time");
//                 let firstTime = 300000;
//                 let timeText1 = await time(firstTime);
//                 if (events.d.channel_id === settings.modmailChannel && settings.modmailSwitch && events.d.message_id && events.d.user_id) {
//                     let log = await client.models.get("modmailpending").findOne({where: {messageID: events.d.message_id}}).catch(e => {});
//                     client.guilds.cache.get(events.d.guild_id).channels.get(settings.modmailChannel).messages.fetch(events.d.message_id).then(async msgs => {
//                         let args = msgs.embeds[0].footer.text.split(" ");
//                         client.guilds.cache.get(events.d.guild_id).members.fetch(args[2]).then(member => {
//                             client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).then(async author => {
//                                 if (author.user.bot) return;
//                                 let reactions = await msgs.reactions.filter((reactions, user) => reactions.users.get(client.user.id)).keyArray();
//                                 let embed = new Discord.MessageEmbed();
//                                 let description = msgs.embeds[0].description;
//                                 embed.setDescription(`__How would you like to respond to ${member}'s [message](https://discordapp.com/channels/${msgs.guild.id}/${msgs.channel.id}/${msgs.id})?__\n${description.substring(description.indexOf(`"`) + 1, description.lastIndexOf(`"`))}`);
//                                 embed.setTimestamp(new Date());
//                                 embed.setFooter(`Time to respond: ${timeText1}`);
//                                 msgs.channel.send(embed).then(messager => {
//                                     let filter = (messages) => messages.author.id === author.id;
//                                     let collector = new Discord.MessageCollector(msgs.channel, filter);
//                                     let editInterval1 = setInterval(async () => {
//                                         firstTime -= 5000;
//                                         if (firstTime > 0) {
//                                             timeText1 = await time(firstTime);
//                                             embed.setFooter(`Time to respond: ${timeText1}`);
//                                             messager.edit(embed).catch(e => {});
//                                         } else {
//                                             clearInterval(editInterval1);
//                                             collector.stop();
//                                             await messager.delete().catch(e => {});
//                                             await msgs.reactions.removeAll().catch(e => {});
//                                             if (log) {
//                                                 msgs.react("🔑").catch(e => {});
//                                             } else {
//                                                 for (let i = 0; i < reactions.length; i++) {
//                                                     await msgs.react(reactions[i]).catch(e => {});
//                                                 }
//                                             }
//                                         }
//                                     }, 5000);
//                                     let found = false;
//                                     collector.on("collect", async (msgss) => {
//                                         clearInterval(editInterval1);
//                                         let timeNumber = 60000;
//                                         if (!found) {
//                                             found = true;
//                                             let embed1 = new Discord.MessageEmbed();
//                                             embed1.setDescription(`__Are you sure you want to respond with the following?__\n${msgss.content}\n\nRespond with either \`yes\`, \`no\`, or \`stop\``);
//                                             let timeText = await time(timeNumber);
//                                             embed1.setFooter(`Time to respond: ${timeText}`);
//                                             embed1.setTimestamp(new Date());
//                                             msgss.delete().catch(e => {});
//                                             msgs.channel.send(embed1).then(myMessage => {
//                                                 let collector2 = new Discord.MessageCollector(msgs.channel, filter);
//                                                 let editInterval = setInterval(async () => {
//                                                     timeNumber -= 5000;
//                                                     if (timeNumber > 0) {
//                                                         timeText = await time(timeNumber);
//                                                         embed1.setFooter(`Time to respond: ${timeText}`);
//                                                         myMessage.edit(embed1).catch(e => {});
//                                                     } else {
//                                                         clearInterval(editInterval);
//                                                         collector2.stop();
//                                                         collector.stop();
//                                                         await messager.delete().catch(e => {});
//                                                         await myMessage.delete().catch(e => {});
//                                                         await msgs.reactions.removeAll().catch(e => {});
//                                                         if (log) {
//                                                             msgs.react("🔑").catch(e => {});
//                                                         } else {
//                                                             for (let i = 0; i < reactions.length; i++) {
//                                                                 await msgs.react(reactions[i]).catch(e => {});
//                                                             }
//                                                         }
//                                                     }
//                                                 }, 5000);
//                                                 collector2.on("collect", async (merg) => {
//                                                     let content = merg.content.toLowerCase();
//                                                     if (content === `${settings.prefix}yes` || content === "-yes" || content === "yes" || content === "y") {
//                                                         clearInterval(editInterval);
//                                                         collector2.stop();
//                                                         collector.stop();
//                                                         client.guilds.cache.get(events.d.guild_id).members.fetch(args[2]).then(async member1 => {
//                                                             await member1.user.send(`${msgss.content}`).catch(e => {
//                                                                 author.send(`I cannot dm them as their dms are private, please have this user unprivate their dms before responding again.`).catch(e => {});
//                                                             });
//                                                         }).catch(e => {
//                                                             author.send(`I cannot dm them as they have left the server.`).catch(e => {});
//                                                         });
//                                                         await merg.delete().catch(e => {});
//                                                         await messager.delete().catch(e => {});
//                                                         await myMessage.delete().catch(e => {});
//                                                         await msgs.reactions.removeAll().catch(e => {});
//                                                         await msgs.react("📫").catch(e => {});
//                                                         let messageEmbed = msgs.embeds[0];
//                                                         let name = author.displayName;
//                                                         if (msgss.content.length > 1024) {
//                                                             messageEmbed.addField(`Response by ${name}:`, `${msgss.content.substring(0, 1021)}...`);
//                                                             messageEmbed.addField(`Continued...`, `${msgss.content.substring(1021, msgss.content.length)}`);
//                                                         } else {
//                                                             messageEmbed.addField(`Response by ${name}:`, `${msgss.content}`);
//                                                         }
//                                                         await msgs.edit(messageEmbed).catch(e => {});
//                                                         if (log) {
//                                                             await client.models.get("modmailpending").destroy({where: {messageID: events.d.message_id}}).catch(e => {});
//                                                         }
//                                                     } else if (content === `${settings.prefix}no` || content === "-no" || content === "no" || content === "n") {
//                                                         editInterval1 = setInterval(async () => {
//                                                             firstTime -= 5000;
//                                                             timeText1 = await time(firstTime);
//                                                             embed.setFooter(`Time to respond: ${timeText1}`);
//                                                             messager.edit(embed).catch(e => {});
//                                                         }, 5000);
//                                                         clearInterval(editInterval);
//                                                         collector2.stop();
//                                                         await merg.delete().catch(e => {});
//                                                         await myMessage.delete().catch(e => {});
//                                                         found = false;
//                                                     } else if (content === "-stop" || content === "stop" || content === "end" || content === "-end") {
//                                                         clearInterval(editInterval);
//                                                         collector2.stop();
//                                                         collector.stop();
//                                                         await merg.delete().catch(e => {});
//                                                         await messager.delete().catch(e => {});
//                                                         await myMessage.delete().catch(e => {});
//                                                         await msgs.reactions.removeAll().catch(e => {});
//                                                         if (log) {
//                                                             msgs.react("🔑").catch(e => {});
//                                                         } else {
//                                                             for (let i = 0; i < reactions.length; i++) {
//                                                                 await msgs.react(reactions[i]).catch(e => {});
//                                                             }
//                                                         }
//                                                     } else {
//                                                         await merg.delete();
//                                                         merg.channel.send(`Please provide a valid response: \`yes\`, \`no\`, or \`stop\`.`).then(mor => {
//                                                             setTimeout(() => {
//                                                                 mor.delete();
//                                                             }, 5000);
//                                                         }).catch(e => {});
//                                                     }
//                                                 });
//                                             });
//                                         }
//                                     });
//                                 });
//                             }).catch(e => {});
//                         }).catch(e => {
//                             client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).then(author => {
//                                 author.send(`You cannot reply to this message as he has left the server.`).catch(e => {});
//                             }).catch(e => {});
//                         });
//                     }).catch(e => {});
//                 }
//             } else if (events.d.emoji.name === "🔑" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id) {
//                 if (events.d.channel_id === settings.veriVetPendingChannel && settings.veteranVeriSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let embed = msg.embeds[0];
//                         let endingPosition = embed.description.indexOf(">");
//                         let startingPosition;
//                         if (embed.description.startsWith("<@!")) {
//                             startingPosition = embed.description.indexOf("!");
//                         } else {
//                             startingPosition = embed.description.indexOf("@");
//                         }
//                         let id = embed.description.substring(startingPosition + 1, endingPosition);
//                         let log = await client.models.get("vetpending").findOne({where: {guildID: events.d.guild_id, userID: id}});
//                         if (log) {
//                             await msg.reactions.removeAll().catch(e => {});
//                             await msg.react("✅").catch(e => {});
//                             await msg.react("❌").catch(e => {});
//                             await msg.react("🔒").catch(e => {});
//                         }
//                     }).catch(e => {});
//                 } else if (events.d.channel_id === settings.modmailChannel && settings.modmailSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("modmailpending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                         if (log) {
//                             await msg.reactions.removeAll().catch(e => {});
//                             await msg.react("📧").catch(e => {});
//                             await msg.react("👀").catch(e => {});
//                             await msg.react("🗑").catch(e => {});
//                             await msg.react("❌").catch(e => {});
//                             await msg.react("🔨").catch(e => {});
//                             await msg.react("🔒").catch(e => {});
//                         }
//                     }).catch(e => {});
//                 } else if (events.d.channel_id === settings.veriRejectionChannel && settings.veriSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                         if (log) {
//                             await msg.reactions.removeAll().catch(e => {});
//                             await msg.react("✅").catch(e => {});
//                             await msg.react("❌").catch(e => {});
//                             await msg.react("🔒").catch(e => {});
//                         }
//                     }).catch(e => {});
//                 }
//             } else if (events.d.emoji.name === "❌" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id) {
//                 if (events.d.channel_id === settings.veriVetPendingChannel) {
//                     if (settings.veteranVeriSwitch) {
//                         client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                             let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                             if (author.user.bot) return;
//                             let embed = msg.embeds[0];
//                             if (!embed) return;
//                             let endingPosition = embed.description.indexOf(">");
//                             let startingPosition;
//                             if (embed.description.startsWith("<@!")) {
//                                 startingPosition = embed.description.indexOf("!");
//                             } else {
//                                 startingPosition = embed.description.indexOf("@");
//                             }
//                             embed.setFooter(`Rejected by ${author.displayName}`);
//                             await msg.edit(embed);
//                             let id = embed.description.substring(startingPosition + 1, endingPosition);
//                             let log = await client.models.get("vetpending").findOne({where: {guildID: events.d.guild_id, userID: id}});
//                             if (log) {
//                                 await client.models.get("vetpending").destroy({where: {guildID: events.d.guild_id, userID: id}});
//                                 setTimeout(async () => {
//                                     await msg.reactions.removeAll();
//                                     await msg.react("👋");
//                                 }, 1000);
//                             }
//                         });
//                     }
//                 } else if (events.d.channel_id === settings.modmailChannel && settings.modmailSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("modmailpending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                         if (log) {
//                             await client.models.get("modmailpending").destroy({where: {guildID: events.d.guild_id, messageID: msg.id}});
//                             await msg.delete().catch(e => {});
//                         }
//                     });
//                 } else if (events.d.channel_id === settings.veriRejectionChannel && settings.veriSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                         if (log) {
//                             setTimeout(async () => {
//                                 await msg.reactions.removeAll().catch(e => {});
//                                 await msg.react("1⃣").catch(e => {});
//                                 await msg.react("2⃣").catch(e => {});
//                                 await msg.react("3⃣").catch(e => {});
//                                 await msg.react("4⃣").catch(e => {});
//                                 await msg.react("5⃣").catch(e => {});
//                                 await msg.react("🔒").catch(e => {});
//                             }, 1500);
//                         }
//                     }).catch(e => {});
//                 }
//             } else if (events.d.emoji.name === "🗑" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id) {
//                 if (events.d.channel_id === settings.modmailChannel && settings.modmailSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("modmailpending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                         if (log) {
//                             await client.models.get("modmailpending").destroy({where: {guildID: events.d.guild_id, messageID: msg.id}});
//                             setTimeout(async () => {
//                                 await msg.reactions.removeAll().catch(e => {});
//                                 await msg.react("🗑").catch(e => {});
//                             }, 4000);
//                         }
//                     });
//                 }
//             } else if (events.d.emoji.name === "🔒" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id) {
//                 if (((events.d.channel_id === settings.modmailChannel && settings.modmailSwitch) || (events.d.channel_id === settings.veriVetPendingChannel && settings.veteranVeriSwitch)) && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("modmailpending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}) || await client.models.get("vetpending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}});
//                         if (log) {
//                             await msg.reactions.removeAll().catch(e => {});
//                             await msg.react("🔑").catch(e => {});
//                         }
//                     });
//                 } else if (events.d.channel_id === settings.veriRejectionChannel && settings.veriSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                         if (log) {
//                             await msg.reactions.removeAll().catch(e => {});
//                             await msg.react("🔑").catch(e => {});
//                         }
//                     }).catch(e => {});
//                 }
//             } else if (events.d.emoji.name === "🔨" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id) {
//                 if (events.d.channel_id === settings.modmailChannel && settings.modmailSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("modmailpending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                         if (log) {
//                             let args = msg.embeds[0].footer.text.split(" ");
//                             await client.models.get("modmailpending").destroy({where: {guildID: events.d.guild_id, messageID: msg.id}});
//                             await client.models.get("feedbackblacklist").create({
//                                 guildID: events.d.guild_id,
//                                 userID: args[2]
//                             });
//                             setTimeout(async () => {
//                                 await msg.reactions.removeAll();
//                                 await msg.react("⚒").catch(e => {});
//                             }, 2500);
//                             client.users.fetch(args[2]).then(user => {
//                                 user.send(`You have now been blacklisted by staff on the server \`${msg.guild.name}\` by the staff.`).catch(e => {});
//                             }).catch(e => {});
//                         }
//                     });
//                 }
//             } else if (events.d.emoji.name === "👀" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id) {
//                 if (events.d.channel_id === settings.modmailChannel && settings.modmailSwitch && events.d.message_id && events.d.user_id) {
//                     client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                         let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                         if (author.user.bot) return;
//                         let log = await client.models.get("modmailpending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                         if (log) {
//                             let args = msg.embeds[0].footer.text.split(" ");
//                             await client.models.get("modmailpending").destroy({where: {guildID: events.d.guild_id, messageID: msg.id}});
//                             client.users.fetch(args[2]).then(person => {
//                                 person.createDM().then(dmChannel => {
//                                     dmChannel.messages.fetch(args[5]).then(async mess => {
//                                         await mess.react("👀");
//                                         if (mess.reactions.find(e => e.emoji.name === "📧")) {
//                                             await mess.reactions.find(e => e.emoji.name === "📧").users.remove(client.user.id).catch(e => {});
//                                         }
//                                         let embed = new Discord.MessageEmbed();
//                                         embed.setDescription(`Your [message](https://discordapp.com/channels/@me/${mess.channel.id}/${mess.id}) has been recieved and read.`);
//                                         mess.channel.send(embed).catch(e => {});
//                                     }).catch(async e => {
//                                         let embed = new Discord.MessageEmbed();
//                                         embed.setDescription(`Your message (deleted) has been recieved and read.`);
//                                         dmChannel.send(embed).catch(e => {});
//                                     });
//                                     setTimeout(async () => {
//                                         await msg.reactions.removeAll();
//                                         await msg.react("👀").catch(e => {});
//                                     }, 3000);
//                                 }).catch(e => {});
//                             }).catch(e => {});
//                         }
//                     });
//                 }
//             } else if (events.d.emoji.name === "1⃣" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id && events.d.channel_id === settings.veriRejectionChannel && settings.veriSwitch && events.d.message_id && events.d.user_id) {
//                 client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                     let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                     if (author.user.bot) return;
//                     let user = author.user;
//                     let log = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                     let embed = msg.embeds[0];
//                     let endingPosition = embed.description.indexOf(">");
//                     let startingPosition;
//                     if (embed.description.startsWith("<@!")) {
//                         startingPosition = embed.description.indexOf("!");
//                     } else {
//                         startingPosition = embed.description.indexOf("@");
//                     }
//                     let id = embed.description.substring(startingPosition + 1, endingPosition);
//                     client.guilds.cache.get(events.d.guild_id).members.fetch(id).then(async member => {
//                         if (log) {
//                             member.send(`You are being denied because you are suspected to be a mule or alt account by the server ${client.guilds.cache.get(events.d.guild_id).name}. If you wish to appeal, contact ${user} (\`${author.displayName}\` - ${user.tag}).`);
//                             embed.setFooter(`Denied by ${author.displayName} using 1`);
//                             msg.edit(embed);
//                             let startingPosition1 = embed.author.name.lastIndexOf(":") + 1;
//                             let endingPosition1 = embed.author.name.lastIndexOf("!");
//                             let name = embed.author.name.substring(startingPosition1 + 1, endingPosition1);
//                             await client.models.get("expelled").create({
//                                 guildID: events.d.guild_id,
//                                 inGameName: name.toLowerCase()
//                             });
//                             await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, messageID: log.dataValues.messageID}});
//                             setTimeout(async () => {
//                                 await msg.reactions.removeAll();
//                                 await msg.react("👋");
//                             }, 4000);
//                         }
//                     }).catch(async e => {
//                         author.send(`You cannot reject him using that as he has left the server. He will be denies using 5⃣`).catch(e => {
//                             msg.channel.send(`${author} You cannot reject him using that as he has left the server. He will be denies using 5⃣`);
//                         });
//                         embed.setFooter(`Denied by ${author.displayName} using 5`);
//                         msg.edit(embed);
//                         let foundPending = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, userID: id}});
//                         if (foundPending) {
//                             await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, userID: id}});
//                         }
//                         setTimeout(async () => {
//                             await msg.reactions.removeAll();
//                             await msg.react("👋");
//                         }, 4000);
//                     });
//                 }).catch(e => {});
//             } else if (events.d.emoji.name === "2⃣" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id && events.d.channel_id === settings.veriRejectionChannel && settings.veriSwitch && events.d.message_id && events.d.user_id) {
//                 client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                     let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                     if (author.user.bot) return;
//                     let user = author.user;
//                     let log = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                     let embed = msg.embeds[0];
//                     let endingPosition = embed.description.indexOf(">");
//                     let startingPosition;
//                     if (embed.description.startsWith("<@!")) {
//                         startingPosition = embed.description.indexOf("!");
//                     } else {
//                         startingPosition = embed.description.indexOf("@");
//                     }
//                     let id = embed.description.substring(startingPosition + 1, endingPosition);
//                     client.guilds.cache.get(events.d.guild_id).members.fetch(id).then(async member => {
//                         if (log) {
//                             embed.setFooter(`Denied by ${author.displayName} using 2`);
//                             msg.edit(embed);
//                             member.send(`You are being denied because you are in a blacklisted guild by the server ${client.guilds.cache.get(events.d.guild_id).name}. If you wish to appeal, leave the guild and contact ${user} (\`${author.displayName}\` - ${user.tag}).`);
//                             await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, messageID: log.dataValues.messageID}});
//                             setTimeout(async () => {
//                                 await msg.reactions.removeAll();
//                                 await msg.react("👋");
//                             }, 3000);
//                         }
//                     }).catch(async e => {
//                         author.send(`You cannot reject him using that as he has left the server. He will be denies using 5⃣`).catch(e => {
//                             msg.channel.send(`${author} You cannot reject him using that as he has left the server. He will be denies using 5⃣`);
//                         });
//                         embed.setFooter(`Denied by ${author.displayName} using 5`);
//                         msg.edit(embed);
//                         let foundPending = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, userID: id}});
//                         if (foundPending) {
//                             await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, userID: id}});
//                         }
//                         setTimeout(async () => {
//                             await msg.reactions.removeAll();
//                             await msg.react("👋");
//                         }, 3000);
//                     });
//                 }).catch(e => {});
//             } else if (events.d.emoji.name === "3⃣" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id && events.d.channel_id === settings.veriRejectionChannel && settings.veriSwitch && events.d.message_id && events.d.user_id) {
//                 client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                     let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                     if (author.user.bot) return;
//                     let user = author.user;
//                     let log = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                     let embed = msg.embeds[0];
//                     let endingPosition = embed.description.indexOf(">");
//                     let startingPosition;
//                     if (embed.description.startsWith("<@!")) {
//                         startingPosition = embed.description.indexOf("!");
//                     } else {
//                         startingPosition = embed.description.indexOf("@");
//                     }
//                     let id = embed.description.substring(startingPosition + 1, endingPosition);
//                     client.guilds.cache.get(events.d.guild_id).members.fetch(id).then(async member => {
//                         if (log) {
//                             embed.setFooter(`Denied by ${author.displayName} using 3`);
//                             msg.edit(embed);
//                             member.send(`You are being denied because some of your realmeye information is private by the server ${client.guilds.cache.get(events.d.guild_id).name}. If you wish to verify, unprivate everything except your last known location and contact ${user} (\`${author.displayName}\` - ${user.tag}).`);
//                             await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, messageID: log.dataValues.messageID}});
//                             setTimeout(async () => {
//                                 await msg.reactions.removeAll();
//                                 await msg.react("👋");
//                             }, 3000);
//                         }
//                     }).catch(async e => {
//                         author.send(`You cannot reject him using that as he has left the server. He will be denies using 5⃣`).catch(e => {
//                             msg.channel.send(`${author} You cannot reject him using that as he has left the server. He will be denies using 5⃣`);
//                         });
//                         embed.setFooter(`Denied by ${author.displayName} using 5`);
//                         msg.edit(embed);
//                         let foundPending = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, userID: id}});
//                         if (foundPending) {
//                             await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, userID: id}});
//                         }
//                         setTimeout(async () => {
//                             await msg.reactions.removeAll();
//                             await msg.react("👋");
//                         }, 3000);
//                     });
//                 }).catch(e => {});
//             } else if (events.d.emoji.name === "4⃣" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id && events.d.channel_id === settings.veriRejectionChannel && settings.veriSwitch && events.d.message_id && events.d.user_id) {
//                 client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                     let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                     if (author.user.bot) return;
//                     let user = author.user;
//                     let log = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                     let embed = msg.embeds[0];
//                     let endingPosition = embed.description.indexOf(">");
//                     let startingPosition;
//                     if (embed.description.startsWith("<@!")) {
//                         startingPosition = embed.description.indexOf("!");
//                     } else {
//                         startingPosition = embed.description.indexOf("@");
//                     }
//                     let id = embed.description.substring(startingPosition + 1, endingPosition);
//                     if (log) {
//                         embed.setFooter(`Denied by ${author.displayName} using 4`);
//                         msg.edit(embed);
//                         let startingPosition1 = embed.author.name.lastIndexOf(":") + 1;
//                         let endingPosition1 = embed.author.name.lastIndexOf("!");
//                         let name = embed.author.name.substring(startingPosition1 + 1, endingPosition1);
//                         await client.models.get("expelled").create({
//                             guildID: events.d.guild_id,
//                             inGameName: name.toLowerCase()
//                         });
//                         await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, messageID: log.dataValues.messageID}});
//                         setTimeout(async () => {
//                             await msg.reactions.removeAll();
//                             await msg.react("👋");
//                         }, 2000);
//                     }
//                 }).catch(e => {});
//             } else if (events.d.emoji.name === "5⃣" && client.channels.get(events.d.channel_id).type === "text" && events.d.guild_id && events.d.channel_id === settings.veriRejectionChannel && settings.veriSwitch && events.d.message_id && events.d.user_id) {
//                 client.guilds.cache.get(events.d.guild_id).channels.get(events.d.channel_id).messages.fetch(events.d.message_id).then(async msg => {
//                     let author = await client.guilds.cache.get(events.d.guild_id).members.fetch(events.d.user_id).catch(e => {});
//                     if (author.user.bot) return;
//                     let log = await client.models.get("pending").findOne({where: {guildID: events.d.guild_id, messageID: msg.id}}).catch(e => {});
//                     let embed = msg.embeds[0];
//                     if (log) {
//                         embed.setFooter(`Denied by ${author.displayName} using 5`);
//                         msg.edit(embed);
//                         await client.models.get("pending").destroy({where: {guildID: events.d.guild_id, messageID: log.dataValues.messageID}});
//                         setTimeout(async () => {
//                             await msg.reactions.removeAll();
//                             await msg.react("👋");
//                         }, 1000);
//                     }
//                 }).catch(e => {});
//             }
//         }
//     }
// });

// let timeOuts = {};

// client.on("voiceStateUpdate", async (oldState, newState) => {
//     let newChannel = newState.channel;
//     let oldChannel = oldState.channel;
//     if (!client.models.get("guild")) return;
//     if (newChannel) {
//         let settingsss = await client.models.get("guild").findOne({where: {guildID: newChannel.guild.id}});
//         if (!settingsss) return;
//         if (oldChannel) {
//             if (settingsss.dataValues.changeVC) {
//                 if (oldChannel.id !== newChannel.id) {
//                     let embed = new Discord.MessageEmbed();
//                     embed.setAuthor(oldState.member.user.tag, oldState.member.user.displayAvatarURL());
//                     embed.setColor(2347360);
//                     embed.setDescription(`${oldState.member}** switched voice channel ${oldChannel} -> ${newChannel}**`);
//                     embed.setFooter(`User ID: ${oldState.member.id}`);
//                     embed.setTimestamp(new Date());
//                     oldState.guild.channels.get(settingsss.dataValues.loggingChannel).send(embed).catch(e => {});
//                 }
//             }
//         } else {
//             if (settingsss.dataValues.joinVC) {
//                 let embed = new Discord.MessageEmbed();
//                 embed.setAuthor(oldState.member.user.tag, oldState.member.user.displayAvatarURL());
//                 embed.setColor(2347360);
//                 embed.setDescription(`${oldState.member}** joined voice channel ${newChannel}**`);
//                 embed.setFooter(`User ID: ${oldState.member.id}`);
//                 embed.setTimestamp(new Date());
//                 oldState.guild.channels.get(settingsss.dataValues.loggingChannel).send(embed).catch(e => {});
//             }
//         }
//         if (timeOuts[newState.member.id]) {
//             if (newState.selfDeaf === false) {
//                 clearTimeout(timeOuts[newState.member.id]);
//             }
//         }
//         if (newState.selfDeaf && !timeOuts[newState.member.id]) {
//             let settings = settingsss.dataValues;
//             if (settings.autoDeafenSuspend) {
//                 let raidingChannels = await client.models.get("raidingchannels").findOne({where: {channelID: newChannel.id}}) || await client.models.get("veteranraiding").findOne({where: {channelID: newChannel.id}});
//                 if (raidingChannels) {
//                     try {
//                         let person = await newState.guild.members.get(newState.member.id);
//                         let rlOrNot = false;
//                         let autoMuteRoles = await client.models.get("automuteroles").findAll({where: {guildID: newChannel.guild.id}});
//                         let personRoles = person.roles.keyArray();
//                         for (let i = 0; i < autoMuteRoles.length; i++) {
//                             if (personRoles.includes(autoMuteRoles[i].dataValues.roleID)) {
//                                 rlOrNot = true;
//                                 break;
//                             }
//                         }
//                         if (!rlOrNot) {
//                             person.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspeneded! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`).catch(e => {
//                                 client.channels.get(settings.AFKChecks).send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspeneded! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`).then(msg => {
//                                     setTimeout(() => {
//                                         msg.delete();
//                                     }, 30000);
//                                 });
//                             });
//                             timeOuts[person.id] = setTimeout(async () => {
//                                 person = client.guilds.cache.get(newState.guild.id).members.get(newState.member.id);
//                                 if (person.voice.selfDeaf && person.voice.channel) {
//                                     raidingChannels = await client.models.get("raidingchannels").findOne({where: {channelID: person.voice.channelID}}) || await client.models.get("veteranraiding").findOne({where: {channelID: newChannel.id}});
//                                     if (raidingChannels) {
//                                         person.send(`You have remained deafened after warning. You are now being suspended for ${((newState.guild.id === "343704644712923138") ? `1 day` : `6 hours`)}.`);
//                                         let embed = new Discord.MessageEmbed();
//                                         embed.setTitle(`Suspension Information`);
//                                         embed.setColor(0xff2a2a);
//                                         embed.setDescription(`The suspension is for ${((newState.guild.id === "343704644712923138") ? `1 day` : `6 hours`)}.`);
//                                         embed.addField(`User's server name: \`${person.displayName}\``, `${person} (Username: ${person.user.username})`, true);
//                                         embed.addField(`Mod's server name: \`${newState.guild.me.displayName}\``, `${client.user} (Username: ${client.user.username})`, true);
//                                         embed.addField(`Reason for suspension:`, `Auto-suspended for deafening during a run.`);
//                                         embed.setTimestamp(Date.now() + ((newState.guild.id === "343704644712923138") ? 21600000 * 4 : 21600000));
//                                         embed.setFooter("Unsuspended at");
//                                         newState.guild.channels.get(settings.suspensionsChannel).send(`${person}`).then(msgs => {
//                                             msgs.delete();
//                                         });
//                                         newState.guild.channels.get(settings.suspensionsChannel).send(embed).then(async msgr => {
//                                             await client.models.get("suspensions").create({
//                                                 guildID: newState.guild.id,
//                                                 userID: person.id,
//                                                 nickname: person.displayName,
//                                                 time: Date.now() + ((newState.guild.id === "343704644712923138") ? 21600000 * 4 : 21600000),
//                                                 reason: `Auto-suspended for deafening during a run.`,
//                                                 messageID: msgr.id
//                                             });
//                                             await person.roles.forEach(async e => {
//                                                 if (parseInt(e.position) !== 0) {
//                                                     if (e.id !== settings.mutedRole) {
//                                                         await person.roles.remove(e.id);
//                                                     }
//                                                     if (e.id !== settings.mutedRole && e.id !== settings.tempKeyRole) {
//                                                         await client.models.get("suspensionroles").create({
//                                                            messageID: msgr.id,
//                                                            roleID: e.id 
//                                                         });
//                                                     }
//                                                 }
//                                             });
//                                             await person.roles.add(settings.suspendedButVerifiedRole);
//                                             await person.voice.setChannel(settings.AFKChannel).catch(e => {});
//                                         });
//                                     }
//                                 }
//                             }, 30000);
//                         }
//                     } catch(e) {
//                         console.log(e);
//                     }
//                 }
//             }
//         }
//     } else if (oldChannel) {
//         let settingsss = await client.models.get("guild").findOne({where: {guildID: oldChannel.guild.id}});
//         if (!settingsss) return;
//         if (settingsss.dataValues.leaveVC) {
//             let embed = new Discord.MessageEmbed();
//             embed.setAuthor(oldState.member.user.tag, oldState.member.user.displayAvatarURL());
//             embed.setColor(2347360);
//             embed.setDescription(`${oldState.member}** left voice channel ${oldChannel}**`);
//             embed.setFooter(`User ID: ${oldState.member.id}`);
//             embed.setTimestamp(new Date());
//             oldState.guild.channels.get(settingsss.dataValues.loggingChannel).send(embed).catch(e => {});
//         }
//     }
// });

// client.on("guildMemberUpdate", async (oldMember, newMember) => {
//     if (oldMember.nickname !== newMember.nickname) {
//         if (!client.models.get("guild")) return;
//         let settingsss = await client.models.get("guild").findOne({where: {guildID: newMember.guild.id}});
//         if (!settingsss) return;
//         if (settingsss.dataValues.nicknameSwitch) {
//             let embed = new Discord.MessageEmbed();
//             embed.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL());
//             embed.setColor(1146534);
//             embed.setDescription(`${oldMember}** nickname changed**`);
//             embed.addField("Before", `${oldMember.nickname || "None"}`);
//             embed.addField("After", `${newMember.nickname || "None"}`);
//             embed.setFooter(`User ID: ${newMember.id}`);
//             embed.setTimestamp(new Date());
//             newMember.guild.channels.get(settingsss.dataValues.loggingChannel).send(embed);
//         }
//     } else if (newMember.roles.array().length > oldMember.roles.array().length) {
//         if (!client.models.get("guild")) return;
//         let settingsss = await client.models.get("guild").findOne({where: {guildID: newMember.guild.id}});
//         if (!settingsss) return;
//         if (settingsss.dataValues.rolesAdd) {
//             let embed = new Discord.MessageEmbed();
//             let newRole = newMember.roles.array().filter(e => !oldMember.roles.keyArray().includes(e.id));
//             embed.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL());
//             embed.setColor(1146534);
//             embed.setDescription(`${newMember}** was given the \`${newRole[0].name}\` role**`);
//             embed.setFooter(`User ID: ${newMember.id} | Role ID: ${newRole[0].id}`);
//             embed.setTimestamp(new Date());
//             newMember.guild.channels.get(settingsss.dataValues.loggingChannel).send(embed);
//         }
//         if (newMember.guild.id === "451171819672698920") {
//             try {
//                 let member = await newMember.guild.members.fetch(newMember.user.id);
//                 let nicknameCommand = require("./commands/help/nicknameUpdate");
//                 nicknameCommand(client, member, settingsss.dataValues);
//             } catch(e) {
    
//             }
//         }
//     } else if (newMember.roles.array().length < oldMember.roles.array().length) {
//         if (!client.models.get("guild")) return;
//         let settingsss = await client.models.get("guild").findOne({where: {guildID: newMember.guild.id}});
//         if (!settingsss) return;
//         if (settingsss.dataValues.rolesRemove) {
//             let embed = new Discord.MessageEmbed();
//             let oldRole = oldMember.roles.array().filter(e => !newMember.roles.keyArray().includes(e.id));
//             embed.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL());
//             embed.setColor(1146534);
//             embed.setDescription(`${newMember}** was removed from the \`${oldRole[0].name}\` role**`);
//             embed.setFooter(`User ID: ${newMember.id} | Role ID: ${oldRole[0].id}`);
//             embed.setTimestamp(new Date());
//             newMember.guild.channels.get(settingsss.dataValues.loggingChannel).send(embed);
//         }
//         if (newMember.guild.id === "451171819672698920") {
//             try {
//                 let member = await newMember.guild.members.fetch(newMember.user.id);
//                 let nicknameCommand = require("./commands/help/nicknameUpdate");
//                 let oldRole = oldMember.roles.array().filter(e => !newMember.roles.keyArray().includes(e.id));
//                 if (oldRole.id === settingsss.dataValues.rlRole || oldRole.id === settingsss.dataValues.arlRole) {
//                     setTimeout(() => {
//                         if (!member.roles.get(settingsss.dataValues.lolRole)) {
//                             nicknameCommand(client, member, settingsss.dataValues);
//                         }
//                     }, 5000);
//                 } else {
//                     if (!member.roles.get(settingsss.dataValues.lolRole)) {
//                         nicknameCommand(client, member, settingsss.dataValues);
//                     }
//                 }
//             } catch(e) {
                
//             }
//         }
//     }
// });

// client.on("guildMemberRemove", async (member) => {
//     if (!client.models.get("guild")) return;
//     let settingsss = await client.models.get("guild").findOne({where: {guildID: member.guild.id}});
//     if (!settingsss) return;
//     if (settingsss.dataValues.userLeave) {
//         let embed = new Discord.MessageEmbed();
//         embed.setAuthor(member.user.tag, member.user.displayAvatarURL());
//         embed.setColor(16729871);
//         embed.setDescription(`${member}** has left the server**`);
//         embed.setThumbnail(member.user.displayAvatarURL());
//         embed.setFooter(`User ID: ${member.id}`);
//         embed.setTimestamp(new Date());
//         member.guild.channels.get(settingsss.dataValues.loggingChannel).send(embed).catch(e => {});
//     }
// });

client.on(`error`, (error) => {
    console.log(`The following error has occured in your code:`, error);
});

client.on("unhandledRejection", error => {
    console.error("Unhandled promise rejection:", error);
});

// client.on("messageDelete", async (message) => {
//     if (message.channel.type === "text") {
//         if (!client.models.get("guild")) return;
//         let settingsss = await client.models.get("guild").findOne({where: {guildID: message.guild.id}});
//         if (!settingsss) return;
//         if (settingsss.dataValues.messDelete) {
//             let embed = new Discord.MessageEmbed();
//             embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
//             embed.setColor(16729871);
//             embed.setDescription(`**Message sent by ${message.author} deleted in ${message.channel}**\n${message.content}`);
//             embed.setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`);
//             embed.setTimestamp(new Date());
//             message.guild.channels.get(settingsss.dataValues.loggingChannel).send(embed).catch(e => {});
//         }
//     }
// });

// client.on("messageUpdate", async (oldMessage, newMessage) => {
//     if (newMessage.channel.type === "text") {
//         if (newMessage.content !== oldMessage.content) {
//             if (!client.models.get("guild")) return;
//             let settingsss = await client.models.get("guild").findOne({where: {guildID: newMessage.guild.id}});
//             if (!settingsss) return;
//             let settings = settingsss.dataValues;
//             if (settings.messEdit) {
//                 let embed = new Discord.MessageEmbed();
//                 embed.setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL());
//                 embed.setColor(1146534);
//                 embed.setDescription(`**Message edited in **${newMessage.channel} __[Jump to Message](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})__`);
//                 if (oldMessage.content && newMessage.content && newMessage.embeds.length < 1 && oldMessage.embeds.length < 1) {
//                     embed.addField("Before", `${(oldMessage.content.length > 1024) ? `${oldMessage.content.substring(0, 1021)}...` : oldMessage.content}`);
//                     embed.addField("After", `${(newMessage.content.length > 1024) ? `${newMessage.content.substring(0, 1021)}...` : newMessage.content}`);
//                 }
//                 embed.setFooter(`User ID: ${newMessage.author.id} | Message ID: ${newMessage.id}`);
//                 embed.setTimestamp(new Date());
//                 newMessage.guild.channels.get(settings.loggingChannel).send(embed).catch(e => {});
//             }
//         }
//     }
// });

// client.on("messageDeleteBulk", async (messages) => {
//     if (!client.models.get("guild")) return;
//     let settingsss = await client.models.get("guild").findOne({where: {guildID: messages.last().guild.id}});
//     if (!settingsss) return;
//     let settings = settingsss.dataValues;
//     if (settings.bulkDelete) {
//         let embed = new Discord.MessageEmbed();
//         embed.setAuthor(messages.last().guild.name, messages.last().guild.iconURL());
//         embed.setColor(1146534);
//         embed.setDescription(`**Bulk delete in ${messages.last().channel}, ${messages.size} messages deleted**`);
//         embed.setTimestamp(new Date());
//         messages.last().guild.channels.get(settings.loggingChannel).send(embed).catch(e => {});
//     }
// });

// client.on("guildMemberAdd", async (member) => {
//     if (!client.models.get("guild")) return;
//     let settingsss = await client.models.get("guild").findOne({where: {guildID: member.guild.id}});
//     if (!settingsss) return;
//     let settings = settingsss.dataValues;
//     if (settings.userJoin) {
//         let embed = new Discord.MessageEmbed();
//         embed.setAuthor(member.user.tag, member.user.displayAvatarURL());
//         embed.setColor(2347360);
//         embed.setDescription(`${member}** has joined the server**`);
//         embed.setThumbnail(member.user.displayAvatarURL());
//         embed.setFooter(`User ID: ${member.id}`);
//         embed.setTimestamp(new Date());
//         member.guild.channels.get(settings.loggingChannel).send(embed).catch(e => {});
//     }
//     let suspensions = await client.models.get("suspensions").findOne({where: {guildID: member.guild.id, userID: member.id}});
//     if (suspensions) {
//         member.guild.members.fetch(member.id).then(async person => {
//             if (suspensions.dataValues.time) {
//                 await person.roles.add(settings.suspendedButVerifiedRole).catch(e => {});
//             } else {
//                 await person.roles.add(settings.suspendedRole).catch(e => {});
//             }
//             await person.send(`Do **NOT** attempt to dodge suspension. This is being logged as suspicious activity.`).catch(e => {});
//             if (suspensions.dataValues.nickname) {
//                 if (person.user.username === suspensions.dataValues.nickname) {
//                     if (person.user.username.toLowerCase() === suspensions.dataValues.nickname) {
//                         await person.setNickname(suspensions.dataValues.nickname.toUpperCase()).catch(e => {});
//                     } else {
//                         await person.setNickname(suspensions.dataValues.nickname.toLowerCase()).catch(e => {});
//                     }
//                 } else {
//                     await person.setNickname(suspensions.dataValues.nickname).catch(e => {});
//                 }
//             }
//             if (settings.modLogsChannel) {
//                 await member.guild.channels.get(settings.modLogsChannel).send(`${person.user.tag} is attempting to dodge a suspension on the account ${person}.`).catch(e => {});
//             }
//         }).catch(e => {});
//     }
//     let mute = await client.models.get("mutes").findOne({where: {guildID: member.guild.id, userID: member.id}});
//     if (mute) {
//         member.guild.members.fetch(member.id).then(async person => {
//             await person.roles.add(settings.mutedRole).catch(e => {});
//             await person.send(`Do **NOT** attempt to dodge mutes. This is being logged as suspicious activity.`).catch(e => {});
//             if (settings.modLogsChannel) {
//                 await member.guild.channels.get(settings.modLogsChannel).send(`${person.user.tag} is attempting to dodge a mute on the account ${person}.`).catch(e => {});
//             }
//         }).catch(e => {});
//     }
// });

// async function modmail(message, user, settings) {
//     let embeds1 = new Discord.MessageEmbed();
//     embeds1.setAuthor(message.author.tag, message.author.displayAvatarURL());
//     embeds1.setDescription(`${user} sent the bot: "${message.content}"`);
//     embeds1.setFooter(`User ID: ${message.author.id} MSG ID: ${message.id}`);
//     embeds1.setColor(0x3651e2);
//     embeds1.setTimestamp(new Date());
//     await message.react("📧");
//     await message.channel.send(`Message has now been sent to Mod Mail. If this was a mistake, then don't worry.`).then(mess => {
//         setTimeout(() => {
//             mess.delete();
//         }, 10000);
//     });
//     if (message.attachments.size > 0) {
//         const imageAttached = Array.from(message.attachments.values())[0];
//         const imageURL = imageAttached.url;
//         Jimp.read(imageURL).then(async function (image) {
//             await image.write("./data/modmail.png");
//             await sleep(1000);
//             await client.guilds.cache.get(settings.guildID).channels.get(settings.modmailChannel).send(embeds1).then(async msg => {
//                 await client.models.get("modmailpending").create({
//                     guildID: settings.guildID,
//                     messageID: msg.id,
//                     userID: user.id
//                 });
//                 msg.react("🔑").catch(e => {});
//             });
//             await client.guilds.cache.get(settings.guildID).channels.get(settings.modmailChannel).send({files: ["./data/modmail.png"]});
//         }).catch(function (err) {
//             return message.channel.send("Failed to fetch the image from Discord.");
//         });
//     } else {
//         client.guilds.cache.get(settings.guildID).channels.get(settings.modmailChannel).send(embeds1).then(async msg => {
//             await client.models.get("modmailpending").create({
//                 guildID: settings.guildID,
//                 messageID: msg.id,
//                 userID: user.id
//             });
//             msg.react("🔑").catch(e => {});
//         });
//     }
// }

async function sleep(ms) {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}