const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Starts an afk check in the channel specified to see how many players are coming to the raid.",
    use: "afk [channel #] [type of run] <location>",
    cooldown: 5,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["AFKChecks"],
    roles: ["raiderRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let portals = client.emojisPortals;
        let keys = client.emojisKeys;
        let misc = client.emojisMisc;
        let args = message.content.toLowerCase().split(" ");
        let personName = (guildMembers.get(message.author.id).nickname) ? guildMembers.get(message.author.id).nickname : message.author.username;
        let channelOfRun = args[1];
        if (!/^[0-9]*$/.test(channelOfRun)) {
            return message.channel.send(`Please provide a valid channel to use for the run.`).catch(e => {});
        }
        let seconds = settings.afkTime;
        let myChannel = parseInt(channelOfRun) - 1;
        let command = require("./help/time");
        let timeToText = command(seconds * 1000), typeOfRun = args[2], emojis = [];
        let afkEmbed = new Discord.MessageEmbed();
        let theChannel, something;
        if (!typeOfRun) {
            return message.channel.send(`Please specify a type of run to do.`).catch(e => {});
        }
        let fullSkip = false;
        if (typeOfRun === "fsvoid" || typeOfRun === "fsv") {
            typeOfRun = "void";
            fullSkip = true;
        }
        if (typeOfRun === "void" || typeOfRun === "v") {
            if (settings.typeOfServer === "lh") {
                theChannel = settings.AFKChecks;
                something = "main";
            } else {
                theChannel = settings.eventAFKChecks;
                something = "backup";
            }
            typeOfRun = "void";
            if (message.channel.id === settings.veteranCommandsChannel) {
                theChannel = settings.veteranCheckChannel;
            }
            if (fullSkip) {
                emojis.push(misc.get("fullskip"));
            } else {
                emojis.push(misc.get("void"));
            }
            emojis.push(keys.get("losthalls"));
            if (!settings.newAFKCheck) {
                afkEmbed.addField("If you are bringing a key, react with:", keys.get("losthalls"), true);
                afkEmbed.addField("If you are bringing a vial, react with:", misc.get("vial"), true);
                afkEmbed.addField("If you are bringing a warrior, react with:", misc.get("warrior"), true);
                afkEmbed.addField("If you are bringing a paladin, react with:", misc.get("paladin"), true);
                afkEmbed.addField("If you are bringing a puri, react with:", client.guilds.get("583867958963601409").emojis.find(e => e.name === "TomeofPurificationUT"), true);
                afkEmbed.addField("If you are bringing a knight, react with:", misc.get("knight"), true);
                afkEmbed.addField("If you are bringing a Marble Seal, react with:", client.guilds.get("583873260886687786").emojis.find(e => e.name === "MarbleSealUT"), true);
                if (!fullSkip) {
                    afkEmbed.addField("If you plan to rush, react with:", client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"), true);
                } else {
                    afkEmbed.addField("If you are bringing a Brain of the Golem, react with:", client.guilds.get("583807147134025750").emojis.find(e => e.name === "BrainoftheGolemUT"), true);
                    afkEmbed.addField("If you are bringing a Mystic, react with:", misc.get("mystic"), true);
                }
                afkEmbed.addField("**__Leaders__** that want to end afk, react with:", `❌`, true);
            }
            let colorCommand = require("./help/color");
            afkEmbed.setColor(colorCommand(typeOfRun));
            emojis.push(misc.get("vial"));
            emojis.push(misc.get("warrior"));
            emojis.push(misc.get("paladin"));
            emojis.push(misc.get("knight"));
            emojis.push(client.guilds.get("583867958963601409").emojis.find(e => e.name === "TomeofPurificationUT"));
            emojis.push(client.guilds.get("583873260886687786").emojis.find(e => e.name === "MarbleSealUT"));
            if (!fullSkip) {
                emojis.push(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"));
            } else {
                emojis.push(client.guilds.get("583807147134025750").emojis.find(e => e.name === "BrainoftheGolemUT"));
                emojis.push(misc.get("mystic"));
            }
        } else if (typeOfRun === "cult" || typeOfRun === "c") {
            typeOfRun = "cult";
            if (settings.typeOfServer === "lh") {
                theChannel = settings.AFKChecks;
                something = "main";
            } else {
                theChannel = settings.eventAFKChecks;
                something = "backup";
            }
            if (message.channel.id === settings.veteranCommandsChannel) {
                theChannel = settings.veteranCheckChannel;
            }
            emojis.push(misc.get("malus"));
            emojis.push(keys.get("losthalls"));
            if (!settings.newAFKCheck) {
                afkEmbed.addField("If you are bringing a key, react with:", keys.get("losthalls"), true);
                afkEmbed.addField("If you are bringing a warrior, react with:", misc.get("warrior"), true);
                afkEmbed.addField("If you are bringing a paladin, react with:", misc.get("paladin"), true);
                afkEmbed.addField("If you are bringing a puri, react with:", client.guilds.get("583867958963601409").emojis.find(e => e.name === "TomeofPurificationUT"), true);
                afkEmbed.addField("If you are bringing a knight, react with:", misc.get("knight"), true);
                afkEmbed.addField("If you plan to rush, react with:", client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"), true);
                afkEmbed.addField("**__Leaders__** that want to end afk, react with:", `❌`, true);
            }
            let colorCommand = require("./help/color");
            afkEmbed.setColor(colorCommand(typeOfRun));
            emojis.push(misc.get("warrior"));
            emojis.push(misc.get("paladin"));
            emojis.push(misc.get("knight"));
            emojis.push(client.guilds.get("583867958963601409").emojis.find(e => e.name === "TomeofPurificationUT"));
            emojis.push(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"));
        } else if (portals.get(typeOfRun) || portals.find(e => e.name.split("_").map(e => e[0].toLowerCase()).join("") === typeOfRun)) {
            typeOfRun = (portals.get(typeOfRun)) ? portals.get(typeOfRun).name.toLowerCase().split("_").join("") : portals.find(e => e.name.split("_").map(e => e[0].toLowerCase()).join("") === typeOfRun).name.toLowerCase().split("_").join("");
            emojis.push(portals.get(typeOfRun));
            emojis.push(keys.get(typeOfRun));
            if (!settings.newAFKCheck) {
                afkEmbed.addField("If you are bringing a key, react with:", keys.get(typeOfRun), true);
                afkEmbed.addField("If you are bringing a warrior, react with:", misc.get("warrior"), true);
                afkEmbed.addField("If you are bringing a paladin, react with:", misc.get("paladin"), true);
                afkEmbed.addField("If you are bringing a priest, react with:", misc.get("priest"), true);
                afkEmbed.addField("If you are bringing a knight, react with:", misc.get("knight"), true);
            }
            if (typeOfRun === "shatters" && settings.typeOfServer === "shatters") {
                theChannel = settings.AFKChecks;
                something = "main";
            } else {
                if (typeOfRun === "shatters" && settings.typeOfServer === "lh") {
                    theChannel = settings.eventAFKChecks;
                    something = "backup";
                } else if (typeOfRun === "secludedthicket" && settings.typeOfServer === "thicket") {
                    theChannel = settings.AFKChecks;
                    something = "main";
                } else {
                    theChannel = settings.eventAFKChecks;
                    something = "backup";
                }
            }
            if (message.channel.id === settings.veteranCommandsChannel) {
                theChannel = settings.veteranCheckChannel;
            }
            let colorCommand = require("./help/color");
            afkEmbed.setColor(colorCommand(typeOfRun));
            emojis.push(misc.get("warrior"));
            emojis.push(misc.get("paladin"));
            emojis.push(misc.get("priest"));
            emojis.push(misc.get("knight"));
            if (typeOfRun === "shatters") {
                if (!settings.newAFKCheck) {
                    afkEmbed.addField("If your ability is armor break, react with:", misc.get("armorbreak"), true);
                    afkEmbed.addField("If you are bringing a mystic, react with:", misc.get("mystic"), true);
                    afkEmbed.addField("If your mystic has an aether orb, react with:", misc.get("orbofaether"), true);
                    afkEmbed.addField("If you are bringing an assassin, react with:", misc.get("assassin"), true);
                    afkEmbed.addField("If you are rushing 1st, react with:", misc.get("switch1"), true);
                    afkEmbed.addField("If you are rushing 2nd, react with:", misc.get("switch2"), true);
                    afkEmbed.addField("If you are rushing secret, react with:", misc.get("switch3"), true);
                }
                emojis.push(misc.get("armorbreak"));
                emojis.push(misc.get("mystic"));
                emojis.push(misc.get("orbofaether"));
                emojis.push(misc.get("assassin"));
                emojis.push(misc.get("switch1"));
                emojis.push(misc.get("switch2"));
                emojis.push(misc.get("switch3"));
            }
            if (typeOfRun === "thenest") {
                if (!settings.newAFKCheck) {
                    afkEmbed.addField("If your archer has a QoT, react with:", client.guilds.get("583871706985398292").emojis.find(e => e.name === "QuiverofThunderUT"), true);
                }
                emojis.push(client.guilds.get("583871706985398292").emojis.find(e => e.name === "QuiverofThunderUT"));
            }
            if (typeOfRun === "fungalcavern") {
                if (!settings.newAFKCheck) {
                    afkEmbed.addField("If your knight has an Ogmur, react with:", client.guilds.get("583873260886687786").emojis.find(e => e.name === "ShieldofOgmurUT"), true);
                    afkEmbed.addField("If you plan to rush, react with:", client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"), true);
                    afkEmbed.addField("If you are bringing a Marble Seal, react with:", client.guilds.get("583873260886687786").emojis.find(e => e.name === "MarbleSealUT"), true);
                    afkEmbed.addField("If your archer has a QoT, react with:", client.guilds.get("583871706985398292").emojis.find(e => e.name === "QuiverofThunderUT"), true);
                    afkEmbed.addField("If you are bringing a slow ability, react with:", misc.get("slow"), true);
                    afkEmbed.addField("If you are bringing a mystic, react with:", misc.get("mystic"), true);
                    afkEmbed.addField("If you are bringing a trickster, react with:", misc.get("trickster"), true);
                }
                emojis.push(client.guilds.get("583873260886687786").emojis.find(e => e.name === "ShieldofOgmurUT"));
                emojis.push(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"));
                emojis.push(client.guilds.get("583873260886687786").emojis.find(e => e.name === "MarbleSealUT"));
                emojis.push(client.guilds.get("583871706985398292").emojis.find(e => e.name === "QuiverofThunderUT"));
                emojis.push(misc.get("slow"));
                emojis.push(misc.get("mystic"));
                emojis.push(misc.get("trickster"));
            }
            if (!settings.newAFKCheck) {
                afkEmbed.addField("**__Leaders__** that want to end afk, react with:", `❌`, true);
            }
        } else {
            let correctCommand = require("./help/correct");
            let correction = await correctCommand(client, message, typeOfRun);
            if (!correction) return;
            let command1 = client.commands.get("afk");
            let myContent = message.content.split(" ");
            myContent[2] = correction;
            message.content = myContent.join(" ");
            command1.execute(client, message, settings, guilds, guildMembers);
        }
        let shard = false;
        if (message.guild.roles.get(settings.nitroBooster) || message.guild.roles.get(settings.keyRole1)) {
            shard = true;
        }
        if (!theChannel) {
            theChannel = settings.AFKChecks;
        }
        let thingToCompare = (something === "main") ? guilds[message.guild.id].afkCheckUp : guilds[message.guild.id].eventAfkCheckUp;
        if (thingToCompare === true) {
            return message.channel.send(`You cannot start another afk check if there is one already up.`).catch(e => {});
        }
        let emojis2 = (typeOfRun === "v" || typeOfRun === "void") ? emojis.slice(3) : emojis.slice(2);
        let theQueue = [], theRaiding = [];
        if (something === "main") {
            let queuelist = (message.channel.id === settings.veteranCommandsChannel) ? await client.models.get("veteranqueue").findAll({where: {guildID: message.guild.id}}) : await client.models.get("queuechannels").findAll({where: {guildID: message.guild.id}});
            let raidinglist = (message.channel.id === settings.veteranCommandsChannel) ? await client.models.get("veteranraiding").findAll({where: {guildID: message.guild.id}}) : await client.models.get("raidingchannels").findAll({where: {guildID: message.guild.id}});
            if (queuelist.length > 0) {
                for (let i = 0; i < queuelist.length; i++) {
                    theQueue.push(queuelist[i].dataValues.channelID);
                }
            } else {
                let queuelist1 = await client.models.get("queuechannels").findAll({where: {guildID: message.guild.id}});
                for (let i = 0; i < queuelist1.length; i++) {
                    theQueue.push(queuelist1[i].dataValues.channelID);
                }
            }
            for (let i = 0; i < raidinglist.length; i++) {
                theRaiding.push(raidinglist[i].dataValues.channelID);
            }
        } else if (something === "backup") {
            let queuelist = (message.channel.id === settings.veteranCommandsChannel) ? await client.models.get("veteranqueue").findAll({where: {guildID: message.guild.id}}) : await client.models.get("eventqueue").findAll({where: {guildID: message.guild.id}});
            let raidinglist = (message.channel.id === settings.veteranCommandsChannel) ? await client.models.get("veteranraiding").findAll({where: {guildID: message.guild.id}}) : await client.models.get("eventraiding").findAll({where: {guildID: message.guild.id}});
            if (queuelist.length > 0) {
                for (let i = 0; i < queuelist.length; i++) {
                    theQueue.push(queuelist[i].dataValues.channelID);
                }
            } else {
                let queuelist1 = await client.models.get("queuechannels").findAll({where: {guildID: message.guild.id}});
                for (let i = 0; i < queuelist1.length; i++) {
                    theQueue.push(queuelist1[i].dataValues.channelID);
                }
            }
            for (let i = 0; i < raidinglist.length; i++) {
                theRaiding.push(raidinglist[i].dataValues.channelID);
            }
        }
        if (parseInt(channelOfRun) > theRaiding.length || parseInt(channelOfRun) < 1) {
            return message.channel.send(`Please provide a valid channel to use for the run.`).catch(e => {});
        }
        let locationOfRun = message.content.split(" ").slice(3).join(" ");
        guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"] = (locationOfRun !== "") ? locationOfRun : "None";
        if (!guildMembers.get(client.user.id).permissionsIn(theRaiding[myChannel]).toArray().includes("MANAGE_CHANNELS")) {
            return message.channel.send(`I cannot start an afk check because I am missing permissions to magane role perms in the raiding channel you selected.`).catch(e => {});
        }
        if (!message.guild.channels.get(theRaiding[myChannel]).name.includes(" <-- Join!")) {
            await message.guild.channels.get(theRaiding[myChannel]).setName(`${message.guild.channels.get(theRaiding[myChannel]).name} <-- Join!`, "Changing name to indicate channel is open as the AFK check starts.").catch(e => {});
        }
        await message.guild.channels.get(theRaiding[myChannel]).updateOverwrite(settings.raiderRole, {
            CONNECT: true
        }, "Opening channel as the AFK check starts.").catch(e => {});
        await message.guild.channels.get(theRaiding[myChannel]).edit({userLimit: 0}, "Removing user limit as the AFK check starts.").catch(e => {});
        async function updateDescription() {
            if (!settings.newAFKCheck) {
                timeToText = await command(seconds * 1000);
                return `We are starting an afk check now, join raiding and react with ${emojis[0]} to not get moved out! If you react with key or classes and do not bring them, you may be suspended. Starting in ${timeToText}! In addition to reacting with ${emojis[0]} also react...`;
            } else {
                return `To join, **connect to the raiding channel by clicking its name** and react with ${emojis[0]}
                If you have a key${(typeOfRun === "void") ? " or vial" : ""}, react with ${emojis[1]}${(typeOfRun === "void") ? ` or ${emojis[2]}` : ""}
                To indicate your class or gear choices, react with ${emojis2.join(" ")}${(shard) ? `\nIf you have the role ${(message.guild.roles.get(settings.nitroBooster)) ? message.guild.roles.get(settings.nitroBooster) : ""}${(message.guild.roles.get(settings.nitroBooster) && message.guild.roles.get(settings.keyRole1)) ? " or " : ""}${(message.guild.roles.get(settings.keyRole1)) ? message.guild.roles.get(settings.keyRole1) : ""} react with ${misc.get("shard")}` : ""}
                To end the AFK check as a leader, react to ❌`;
            }
        }
        afkEmbed.setDescription(await updateDescription());
        let emojisName = emojis[0].name.split("_").join(" ");
        if (typeOfRun === "v" || typeOfRun === "void") {
            emojisName = "Void";
        }
        if (typeOfRun === "c" || typeOfRun === "cult") {
            emojisName = "Cult";
        }
        await afkEmbed.setAuthor(`${(fullSkip) ? "Fullskip " : ""}${emojisName} started by ${personName} in ${message.guild.channels.get(theRaiding[myChannel]).name}`, message.author.displayAvatarURL());
        if (something === "main") {
            guilds[message.guild.id].afkCheckUp = true;
        } else {
            guilds[message.guild.id].eventAfkCheckUp = true;
        }
        if (message.content.startsWith(`${settings.prefix}${settings.prefix}`)) {
            client.options.disableEveryone = true;
        }
        if (!settings.newAFKCheck) {
            afkEmbed.setFooter(`Raiders Accounted For: 0`);
        } else {
            afkEmbed.setFooter(`Time Remaining: ${timeToText} | Raiders Accounted For: 0`);
        }
        let endingPhrase;
        message.guild.channels.get(theChannel).send(`@here \`${(fullSkip) ? "Fullskip " : ""}${emojisName}\` (${emojis[0]}) started by ${guildMembers.get(message.author.id)} in \`${message.guild.channels.get(theRaiding[myChannel]).name}\``, afkEmbed).then(async msg => {
            if (something === "main") {
                await client.models.get("tempkeys").destroy({where: {guildID: message.guild.id, raidingNumber: theRaiding[myChannel]}});
                let keyPeople = guildMembers.filter(e => e.roles.get(settings.tempKeyRole) && !e.permissionsIn(theRaiding[0]).toArray().includes("MOVE_MEMBERS")).array();
                for (let i = 0; i < keyPeople.length; i++) {
                    let log = await client.models.get("tempkeys").findOne({where: {guildID: message.guild.id, userID: keyPeople[i].id}});
                    if (!log) {
                        await keyPeople[i].roles.remove(settings.tempKeyRole);
                    }
                }
            }
            client.options.disableEveryone = false;
            let aborter = new Discord.MessageEmbed();
            let collectors, collector;
            aborter.setDescription(`**[AFK Check](https://discordapp.com/channels/${message.guild.id}/${theChannel}/${msg.id}) control panel for **\`${message.guild.channels.get(theRaiding[myChannel]).name}\``);
            aborter.setColor(afkEmbed.color);
            aborter.addField(`Our current keys are...`, `Main ${emojis[1]}: None`);
            if (typeOfRun === "void") {
                aborter.addField(`Our current vials are...`, `Main ${emojis[2]}: None`);
                if (!fullSkip) {
                    aborter.addField(`Our current rushers are...`, `Main ${client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT")}: None`);
                } else {
                    aborter.addField(`Our Current Tricksters With Location are...`, `Main ${client.guilds.get("583807147134025750").emojis.find(e => e.name === "BrainoftheGolemUT")}: None`);
                    aborter.addField(`Our Current Mystics With Location are...`, `Main ${misc.get("mystic")}: None`);
                }
            } else if (emojis.includes(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"))) {
                aborter.addField(`Our current rushers are...`, `Main ${client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT")}: None`);
            }
            aborter.addField(`Location of Run:`, `${guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"]}`);
            if (message.guild.roles.get(settings.nitroBooster) || message.guild.roles.get(settings.keyRole1)) {
                aborter.addField(`${(message.guild.roles.get(settings.nitroBooster)) ? `${message.guild.roles.get(settings.nitroBooster).name}` : ""}${(message.guild.roles.get(settings.nitroBooster) && message.guild.roles.get(settings.keyRole1)) ? " and " : ""}${(message.guild.roles.get(settings.keyRole1)) ? `${message.guild.roles.get(settings.keyRole1).name}` : ""}s With Location:`, `None`);
            }
            aborter.setFooter(`To abort the afk check, react with ❌ below.`);
            let cols, arlAborter;
            let aborter1 = new Discord.MessageEmbed();
            aborter1.setDescription(aborter.description);
            aborter1.setColor(aborter.color);
            aborter1.addField(`Our current keys are...`, `Main ${emojis[1]}: None`);
            if (typeOfRun === "void") {
                aborter1.addField(`Our current vials are...`, `Main ${emojis[2]}: None`);
                if (!fullSkip) {
                    aborter1.addField(`Our current rushers are...`, `Main ${client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT")}: None`);
                } else {
                    aborter1.addField(`Our Current Tricksters With Location are...`, `Main ${client.guilds.get("583807147134025750").emojis.find(e => e.name === "BrainoftheGolemUT")}: None`);
                    aborter1.addField(`Our Current Mystics With Location are...`, `Main ${misc.get("mystic")}: None`);
                }
            } else if (emojis.includes(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"))) {
                aborter1.addField(`Our current rushers are...`, `Main ${client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT")}: None`);
            }
            aborter1.addField(`Location of Run:`, `${guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"]}`);
            if (message.guild.roles.get(settings.nitroBooster) || message.guild.roles.get(settings.keyRole1)) {
                aborter1.addField(`${(message.guild.roles.get(settings.nitroBooster)) ? `${message.guild.roles.get(settings.nitroBooster).name}` : ""}${(message.guild.roles.get(settings.nitroBooster) && message.guild.roles.get(settings.keyRole1)) ? " and " : ""}${(message.guild.roles.get(settings.keyRole1)) ? `${message.guild.roles.get(settings.keyRole1).name}` : ""}s With Location:`, `None`);
            }
            aborter1.setFooter(`AFK check in progess...`);
            let filters = (reaction, user) => !user.bot;
            guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
            collectors = new Discord.ReactionCollector(guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"], filters);
            cols = collectors;
            collectors.on("collect", async (reaction, user) => reacting(reaction, user));
            async function reacting(reaction, user) {
                if (reaction.emoji.name === "❌") {
                    collectors.stop();
                    let aborterName = guildMembers.get(reaction.users.lastKey()).displayName;
                    aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                    endingPhrase = `The afk check has been aborted by ${aborterName}`;
                    aborter.setFooter(`${endingPhrase}.`);
                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                    if (settings.sendARLChat) {
                        await arlAborter.edit(aborter).catch(e => {});
                    }
                    aborter1 = aborter;
                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.removeAll();
                    clearInterval(editLoop);
                    guilds[message.guild.id][(something === "main") ? "aborting" : "eventAborting"] = true;
                    collector.stop();
                } else if (reaction.emoji.name === "⬆") {
                    if (typeOfRun === "cult") {
                        typeOfRun = "void";
                    } else if (!fullSkip && typeOfRun === "void") {
                        fullSkip = true;
                        emojis.push(client.guilds.get("583807147134025750").emojis.find(e => e.name === "BrainoftheGolemUT"));
                        emojis.push(misc.get("mystic"));
                        let position = emojis.indexOf(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT"));
                        emojis.splice(position, 1);
                        await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.find(e => e.emoji.name === "⬆").users.remove(client.user.id);
                        await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.find(e => e.emoji.name === "⬆").users.remove(user.id);
                        await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.find(e => e.emoji.name === "rusherx").users.remove(client.user.id);
                        aborter.fields.find(e => e.name.startsWith("Our current rushers")).name = "Our Current Tricksters With Location are...";
                        aborter.fields.find(e => e.name.startsWith("Our Current Tricksters")).value = `Main ${client.guilds.get("583807147134025750").emojis.find(e => e.name === "BrainoftheGolemUT")}: None`;
                        let oldName = "";
                        let oldValue = "";
                        let oldName1 = "";
                        let oldValue1 = "";
                        for (let i = aborter.fields.indexOf(aborter.fields.find(e => e.name.startsWith("Our Current Tricksters"))) + 1; i < aborter.fields.length; i++) {
                            if (i === aborter.fields.indexOf(aborter.fields.find(e => e.name.startsWith("Our Current Tricksters"))) + 1) {
                                oldName = aborter.fields[i].name;
                                oldValue = aborter.fields[i].value;
                                aborter.fields[i].name = "Our Current Mystics With Location are...";
                                aborter.fields[i].value = `Main ${misc.get("mystic")}: None`;
                            } else {
                                oldName1 = aborter.fields[i].name;
                                oldValue1 = aborter.fields[i].value;
                                aborter.fields[i].name = oldName;
                                aborter.fields[i].value = oldValue;
                            }
                        }
                        afkEmbed.setAuthor(`${(fullSkip) ? "Fullskip " : ""}${emojisName} started by ${personName} in ${message.guild.channels.get(theRaiding[myChannel]).name}`, afkEmbed.author.iconURL);
                        afkEmbed.setDescription(await updateDescription());
                        msg.edit(afkEmbed).catch(e => {});
                        aborter.addField(oldName1, oldValue1);
                        guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                        aborter1 = aborter;
                        aborter1.setFooter("AFK check in progess...");
                        guilds[message.guild.id][(something === "main") ? "aborterARL" : "eventAborterARL"].edit(aborter1).catch(e => {});
                        if (msg.reactions.find(e => e.emoji.name === "❌")) {
                            await msg.reactions.find(e => e.emoji.name === "❌").users.remove(client.user.id);
                            msg.reactions.find(e => e.emoji.name === "CloakofthePlanewalkerUT").users.forEach((e) => {
                                msg.reactions.find(e => e.emoji.name === "CloakofthePlanewalkerUT").users.remove(e);
                            });
                            await msg.react(client.guilds.get("583807147134025750").emojis.find(e => e.name === "BrainoftheGolemUT"));
                            await msg.react(misc.get("mystic"));
                            await msg.react("❌");
                        }
                        await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.find(e => e.emoji.name === "❌").users.remove(client.user.id);
                        await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("⬇");
                        if (emojis2.find(e => e.name === "CloakofthePlanewalkerUT")) {
                            await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react(misc.get("rusherx"));
                        }
                        await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("❌");
                        msg.edit(`@here \`${(fullSkip) ? "Fullskip " : ""}${emojisName}\` (${emojis[0]}) started by ${guildMembers.get(message.author.id)} in \`${message.guild.channels.get(theRaiding[myChannel]).name}\``, afkEmbed).catch(e => {});
                    }
                } else if (reaction.emoji.name === "⬇") {

                } else if (reaction.emoji.name === "rusherx" && !fullSkip && typeOfRun === "void") {
                    let position = emojis2.indexOf(emojis2.find(e => e.name === "CloakofthePlanewalkerUT"));
                    emojis2.splice(position, 1);
                    let position1 = emojis.indexOf(emojis.find(e => e.name === "CloakofthePlanewalkerUT"));
                    emojis.splice(position1, 1);
                    afkEmbed.setDescription(await updateDescription());
                    msg.edit(afkEmbed).catch(e => {});
                    if (msg.reactions.find(e => e.emoji.name === "CloakofthePlanewalkerUT")) {
                        msg.reactions.find(e => e.emoji.name === "CloakofthePlanewalkerUT").users.forEach(e => {
                            msg.reactions.find(e => e.emoji.name === "CloakofthePlanewalkerUT").users.remove(e);
                        });
                    }
                    guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.find(e => e.emoji.name === "rusherx").users.forEach(e => {
                        guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.find(e => e.emoji.name === "rusherx").users.remove(e);
                    });
                }
            }
            try {
                if (typeOfRun === "void" && !fullSkip) {
                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("⬆");
                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react(misc.get("rusherx"));
                } else if (typeOfRun === "void" && fullSkip) {
                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("⬇");
                }
                await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("❌");
            } catch(e) {

            }
            if (settings.sendARLChat) {
                message.guild.channels.get(settings.arlChannel).send(aborter1).then(mess => {
                    guilds[message.guild.id][(something === "main") ? "aborterARL" : "eventAborterARL"] = mess;
                    arlAborter = mess;
                }).catch(e => {});
            }
            let filter = (reaction, user) => true;
            let editLoop = setInterval(async () => {
                seconds -= 5;
                if (seconds <= 0) {
                    clearInterval(editLoop);
                    aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                    aborter.setFooter(`The afk check has timed out.`);
                    if (!guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted) {
                        guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                    } else {
                        guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                    }
                    if (settings.sendARLChat) {
                        if (arlAborter) {
                            if (arlAborter.deleted === false) {
                                arlAborter.edit(aborter).catch(e => {});
                            } else {
                                arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                            }
                        } else {
                            arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                        }
                    }
                    endingPhrase = `The afk check has timed out`;
                    await collector.stop();
                } else {
                    if (msg.deleted === false) {
                        if (!settings.newAFKCheck) {
                            afkEmbed.setDescription(await updateDescription());
                        }
                        let raidingChannel = message.guild.channels.get(theRaiding[myChannel]);
                        let peopleInRaiding = raidingChannel.members.keyArray();
                        let eArray = msg.reactions.get(emojis[0].id).users.keyArray();
                        let userCount = peopleInRaiding.filter(e => (eArray.includes(e) || guildMembers.get(e).permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS"))).length;
                        if (!settings.newAFKCheck) {
                            afkEmbed.setFooter(`Raiders Accounted For: ${userCount}`);
                        } else {
                            timeToText = await command(seconds * 1000);
                            afkEmbed.setFooter(`Time Remaining: ${timeToText} | Raiders Accounted For: ${userCount}`);
                        }
                        await msg.edit(afkEmbed).catch(e => {});
                    } else {
                        clearInterval(editLoop);
                        collector.stop();
                    }
                }
            }, 5000);
            collector = new Discord.ReactionCollector(msg, filter);
            let xReactors = {};
            let multipleReactors = {};
            let pendingReactions = {};
            collector.on("collect", async (reaction, user) => {
                if (reaction.users.last().bot === false) {
                    let userID = reaction.users.lastKey();
                    if (reaction.emoji.id === emojis[0].id) {
                        let queueChannel = message.guild.channels.get(theQueue[0]);
                        let peopleInQueue = queueChannel.members.keyArray();
                        for (let i = 1; i < theQueue.length; i++) {
                            peopleInQueue = peopleInQueue.concat(message.guild.channels.get(theQueue[i]).members.keyArray());
                        }
                        let raidingChannel = message.guild.channels.get(theRaiding[myChannel]);
                        let peopleInRaiding = raidingChannel.members.keyArray();
                        if (settings.userMax !== 0) {
                            let eArray = msg.reactions.get(emojis[0].id).users.keyArray();
                            let userCount = peopleInRaiding.filter(e => (eArray.includes(e) || guildMembers.get(e).permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS"))).length;
                            if (userCount >= settings.userMax) {
                                collector.stop();
                                cols.stop();
                                aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                                endingPhrase = `The afk check has reached it's user cap`;
                                aborter.setFooter(`The afk check has reached it's user cap.`);
                                if (!guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted) {
                                    guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                                } else {
                                    guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                                }
                                if (settings.sendARLChat) {
                                    if (arlAborter) {
                                        if (arlAborter.deleted === false) {
                                            await arlAborter.edit(aborter).catch(e => {});
                                        } else {
                                            arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                                        }
                                    } else {
                                        arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                                    }
                                }
                                await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.removeAll();
                                clearInterval(editLoop);
                            }
                            if (!peopleInRaiding.includes(userID)) {
                                if (peopleInQueue.includes(userID)) {
                                    guildMembers.get(userID).voice.setChannel(theRaiding[myChannel]).catch(e => {});
                                }
                            }
                        } else {
                            if (peopleInQueue.includes(userID)) {
                                guildMembers.get(userID).voice.setChannel(theRaiding[myChannel]).catch(e => {});
                            }
                        }
                    } else if (reaction.emoji.id === misc.get("shard").id && shard) {
                        let reactor = guildMembers.get(userID);
                        let newMessage = {
                            author: reactor.user,
                            guild: message.guild,
                            id: null
                        };
                        let locationCommand = require("./getLocation");
                        locationCommand.execute(client, newMessage, settings, guilds, guildMembers);
                    } else if (reaction.emoji.id === emojis[1].id) {
                        let keyReactor = guildMembers.get(userID);
                        if (guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"].includes(keyReactor)) return;
                        guildMembers.get(userID).send(`You have reacted with ${emojis[1]}. If you actually have a ${emojis[1]}, react with ✅ and if you made a mistake, react with ❌ to abort.`).then(async msger => {
                            let filterss = (reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❌";
                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID] = new Discord.ReactionCollector(msger, filterss);
                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].on("collect", async (reaction, user) => {
                                if (reaction.users.last().bot === false) {
                                    if (reaction.emoji.name === "✅") {
                                        let numberOfKeys = (typeOfRun === "v" || typeOfRun === "void" || typeOfRun === "c" || typeOfRun === "cult" || typeOfRun === "shatters") ? settings.keyNumber : settings.eventKeyNuber;
                                        if (numberOfKeys > guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"].length) {
                                            if (!guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"].includes(keyReactor)) {
                                                guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"].push(keyReactor);
                                                if (something === "main" && message.guild.roles.get(settings.tempKeyRole)) {
                                                    await keyReactor.roles.add(settings.tempKeyRole);
                                                }
                                                let pop = await client.models.get("kp").findOne({where: {guildID: message.guild.id, userID: keyReactor.id}});
                                                if (pop) {
                                                    await client.models.get("kp").update({numberOfRegular: pop.dataValues.numberOfRegular + 1}, {where: {guildID: message.guild.id, userID: keyReactor.id}});
                                                } else {
                                                    await client.models.get("kp").create({
                                                        guildID: message.guild.id,
                                                        userID: keyReactor.id,
                                                        numberOfRegular: 1,
                                                        numberOfEvent: 0
                                                    });
                                                }
                                                let pops = await client.models.get("kp").findOne({where: {guildID: message.guild.id, userID: keyReactor.id}});
                                                let number5 = (message.guild.id === "343704644712923138") ? 15 : 25;
                                                if (pops.dataValues.numberOfRegular >= number5 && pops.dataValues.numberOfRegular < 50 && settings.keyRole3) {
                                                    if (!keyReactor.roles.get(settings.keyRole3)) {
                                                        await keyReactor.roles.add(settings.keyRole3);
                                                    }
                                                } else if (pops.dataValues.numberOfRegular >= 50 && settings.keyRole2) {
                                                    if (!keyReactor.roles.get(settings.keyRole2)) {
                                                        await keyReactor.roles.add(settings.keyRole2);
                                                    }
                                                }
                                                if (message.guild.id === "451171819672698920") {
                                                    let keysFound = await client.models.get("kp").findAll({where: {guildID: message.guild.id}});
                                                    keysFound.sort((a, b) => {
                                                        let aMember = guildMembers.get(a.dataValues.userID);
                                                        let bMember = guildMembers.get(b.dataValues.userID);
                                                        if (aMember && bMember) {
                                                            if (b.dataValues.numberOfRegular - a.dataValues.numberOfRegular !== 0) {
                                                                return b.dataValues.numberOfRegular - a.dataValues.numberOfRegular;
                                                            } else if (b.dataValues.numberOfEvent - a.dataValues.numberOfEvent !== 0) {
                                                                return b.dataValues.numberOfEvent - a.dataValues.numberOfEvent;
                                                            } else {
                                                                if (aMember.displayName.toLowerCase() > bMember.displayName.toLowerCase()) {
                                                                    return 1;
                                                                } else {
                                                                    return -1;
                                                                }
                                                            }
                                                        } else if (aMember && !bMember) {
                                                            return -1;
                                                        } else if (!aMember && bMember) {
                                                            return 1;
                                                        }
                                                    });
                                                    let ids = [];
                                                    for (let i = 0; i < 10; i++) {
                                                        let member = guildMembers.get(keysFound[i].dataValues.userID);
                                                        if (member) {
                                                            if (!member.roles.get(settings.keyRole1)) {
                                                                await member.roles.add(settings.keyRole1).catch(e => {});
                                                            }
                                                            ids.push(keysFound[i].dataValues.userID);
                                                        }
                                                    }
                                                    let users = guildMembers.filter(e => e.roles.get(settings.keyRole1)).array();
                                                    if (users.length !== 10) {
                                                        for (let i = 0; i < users.length; i++) {
                                                            if (!ids.includes(users[i].id)) {
                                                                await users[i].roles.remove(settings.keyRole1);
                                                            }
                                                        }
                                                    }
                                                }
                                                if (guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"] === "None") {
                                                    await keyReactor.send(`The raid leader has not set a location yet. Please wait for the raid leader to set a location.${(something === "main") ? `\nYou are now our key popper. We ask that you check ${message.guild.channels.get(settings.parsemembersChannel)} for raid leaders instructions.\nPlease **ask** the current Raid Leader before kicking players listed in the channel.`: ""}`).catch(e => {});
                                                } else {
                                                    await keyReactor.send(`The raid leader has set the location to: \`${guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"]}\`. Please get there asap.${(something === "main") ? `\nYou are now our key popper. We ask that you check ${message.guild.channels.get(settings.parsemembersChannel)} for raid leaders instructions.\nPlease **ask** the current Raid Leader before kicking players listed in the channel.`: ""}`).catch(e => {});
                                                }
                                                aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                                                aborter.fields[0].value = await (aborter.fields[0].value === `Main ${emojis[1]}: None`) ? `Main ${emojis[1]}: ${keyReactor}` : aborter.fields[0].value + `\nBackup ${emojis[1]}: ${keyReactor}`;
                                                if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                                                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                                                } else {
                                                    guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                                                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("❌");
                                                    collectors = new Discord.ReactionCollector(guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"], filters);
                                                    collectors.on("collect", async (reaction, user) => reacting(reaction, user));
                                                }
                                                if (settings.sendARLChat) {
                                                    aborter1.fields[0].value = await (aborter1.fields[0].value === `Main ${emojis[1]}: None`) ? `Main ${emojis[1]}: ${keyReactor}` : aborter1.fields[0].value + `\nBackup ${emojis[1]}: ${keyReactor}`;
                                                    if (arlAborter) {
                                                        if (arlAborter.deleted === false) {
                                                            await arlAborter.edit(aborter1).catch(e => {});
                                                        } else {
                                                            arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                                        }
                                                    } else {
                                                        arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                                    }
                                                }
                                                client.models.get("tempkeys").create({
                                                    guildID: message.guild.id,
                                                    userID: userID,
                                                    raidingNumber: theRaiding[myChannel],
                                                    time: Date.now() + 900000
                                                });
                                            }
                                        } else {
                                            await keyReactor.send(`You have reacted to key, but we already have enough keys. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`).catch(e => {});
                                        }
                                        if (guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID]) {
                                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].stop();
                                        }
                                    } else if (reaction.emoji.name === "❌") {
                                        if (guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID]) {
                                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].stop();
                                            guildMembers.get(userID).send(`You have reacted with ❌, your reaction has now been aborted.`).catch(e => {});
                                        }
                                    }
                                }
                            });
                            await msger.react("✅");
                            await msger.react("❌");
                        }).catch(e => {
                            message.channel.send(`${guildMembers.get(userID)} tried to react with key, but has messages private, so I cannot pm him.`).catch(e => {});
                        });
                    } else if (reaction.emoji.id === emojis[2].id && (typeOfRun === "void")) {
                        let vialReactor = guildMembers.get(userID);
                        if (guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"].includes(vialReactor)) return;
                        guildMembers.get(userID).send(`You have reacted with ${emojis[2]}. If you actually have a ${emojis[2]}, react with ✅ and if you made a mistake, react with ❌ to abort.`).then(async msger => {
                            let filterss = (reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❌"
                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID] = new Discord.ReactionCollector(msger, filterss);
                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].on("collect", async (reaction, user) => {
                                if (reaction.users.last().bot === false) {
                                    if (reaction.emoji.name === "✅") {
                                        if (settings.vialNumber > guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"].length) {
                                            if (!guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"].includes(vialReactor)) {
                                                guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"].push(vialReactor);
                                                if (guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"] === "None") {
                                                    await vialReactor.send(`The raid leader has not set a location yet. Please wait for the raid leader to set a location.`).catch(e => {});
                                                } else {
                                                    await vialReactor.send(`The raid leader has set the location to: \`${guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"]}\`. Please get there asap.\nYou are ${(guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"].length === 1) ? "main" : "backup"} vial!`).catch(e => {});
                                                }
                                                aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                                                aborter.fields[1].value = await (aborter.fields[1].value === `Main ${emojis[2]}: None`) ? `Main ${emojis[2]}: ${vialReactor}` : aborter.fields[1].value + `\nBackup ${emojis[2]}: ${vialReactor}`;
                                                if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                                                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                                                } else {
                                                    guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                                                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("❌");
                                                    collectors = new Discord.ReactionCollector(guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"], filters);
                                                    collectors.on("collect", async (reaction, user) => reacting(reaction, user));
                                                }
                                                if (settings.sendARLChat) {
                                                    aborter1.fields[1].value = await (aborter1.fields[1].value === `Main ${emojis[2]}: None`) ? `Main ${emojis[2]}: ${vialReactor}` : aborter1.fields[1].value + `\nBackup ${emojis[2]}: ${vialReactor}`;
                                                    if (arlAborter) {
                                                        if (arlAborter.deleted === false) {
                                                            await arlAborter.edit(aborter1).catch(e => {});
                                                        } else {
                                                            arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                                        }
                                                    } else {
                                                        arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                                    }
                                                }
                                            }
                                        } else {
                                            await vialReactor.send(`You have reacted to ${emojis[2]}, but we already have enough vials. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`).catch(e => {});
                                        }
                                        if (guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID]) {
                                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].stop();
                                        }
                                    } else if (reaction.emoji.name === "❌") {
                                        if (guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID]) {
                                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].stop();
                                            guildMembers.get(userID).send(`You have reacted with ❌, your reaction has now been aborted.`).catch(e => {});
                                        }
                                    }
                                }
                            });
                            await msger.react("✅");
                            await msger.react("❌");
                        }).catch(e => {
                            message.channel.send(`${guildMembers.get(userID)} tried to react with vial, but has messages private, so I cannot pm him.`).catch(e => {});
                        });
                    } else if ((reaction.emoji.id === client.guilds.get("583807147134025750").emojis.find(e => e.name === "BrainoftheGolemUT").id || reaction.emoji.id === misc.get("mystic").id) && (fullSkip)) {
                        let vialReactor = await guildMembers.get(userID);
                        let namees = (reaction.emoji.id === misc.get("mystic").id) ? "Mystic" : "Trickster";
                        if (guilds[message.guild.id][(something === "main") ? `${namees.toLowerCase()}Bois` : `event${namees}Bois`].includes(vialReactor)) return;
                        guildMembers.get(userID).send(`You have reacted with ${reaction.emoji}. If you actually have an 8/8 ${reaction.emoji} __and__ an 85+ mheal pet, react with ✅ and if you made a mistake, react with ❌ to abort.`).then(async msger => {
                            let filterss = (reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❌";
                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID] = new Discord.ReactionCollector(msger, filterss);
                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].on("collect", async (reaction1, user) => {
                                if (reaction1.users.last().bot === false) {
                                    if (reaction1.emoji.name === "✅") {
                                        if (3 > guilds[message.guild.id][(something === "main") ? `${namees.toLowerCase()}Bois` : `event${namees}Bois`].length) {
                                            if (!guilds[message.guild.id][(something === "main") ? `${namees.toLowerCase()}Bois` : `event${namees}Bois`].includes(vialReactor)) {
                                                guilds[message.guild.id][(something === "main") ? `${namees.toLowerCase()}Bois` : `event${namees}Bois`].push(vialReactor);
                                                if (guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"] === "None") {
                                                    await vialReactor.send(`The raid leader has not set a location yet. Please wait for the raid leader to set a location.`).catch(e => {});
                                                } else {
                                                    await vialReactor.send(`The raid leader has set the location to: \`${guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"]}\`. Please get there asap.\nYou are ${(guilds[message.guild.id][(something === "main") ? `${namees.toLowerCase()}Bois` : `event${namees}Bois`].length === 1) ? "main" : "backup"} ${reaction.emoji}!`).catch(e => {});
                                                }
                                                aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                                                let field = aborter.fields.find(e => e.name.startsWith(`Our Current ${namees}`));
                                                field.value = await (field.value === `Main ${reaction.emoji}: None`) ? `Main ${reaction.emoji}: ${vialReactor}` : field.value + `\nBackup ${reaction.emoji}: ${vialReactor}`;
                                                if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                                                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                                                } else {
                                                    guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                                                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("❌");
                                                    collectors = new Discord.ReactionCollector(guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"], filters);
                                                    collectors.on("collect", async (reaction, user) => reacting(reaction, user));
                                                }
                                                if (settings.sendARLChat) {
                                                    let field1 = aborter1.fields.find(e => e.name.startsWith(`Our Current ${namees}`));
                                                    field1.value = (field1.value === `Main ${reaction.emoji}: None`) ? `Main ${reaction.emoji}: ${vialReactor}` : field1.value + `\nBackup ${reaction.emoji}: ${vialReactor}`;
                                                    if (arlAborter) {
                                                        if (arlAborter.deleted === false) {
                                                            await arlAborter.edit(aborter1).catch(e => {});
                                                        } else {
                                                            arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                                        }
                                                    } else {
                                                        arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                                    }
                                                }
                                            }
                                        } else {
                                            await vialReactor.send(`You have reacted to ${reaction.emoji}, but we already have enough ${reaction.emoji}. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`).catch(e => {});
                                        }
                                        if (guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID]) {
                                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].stop();
                                        }
                                    } else if (reaction.emoji.name === "❌") {
                                        if (guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID]) {
                                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].stop();
                                            guildMembers.get(userID).send(`You have reacted with ❌, your reaction has now been aborted.`).catch(e => {});
                                        }
                                    }
                                }
                            });
                            await msger.react("✅");
                            await msger.react("❌");
                        }).catch(e => {
                            message.channel.send(`${guildMembers.get(userID)} tried to react with vial, but has messages private, so I cannot pm him.`).catch(e => {});
                        });
                    } else if (reaction.emoji.id === client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT").id && emojis.includes(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT")) && !fullSkip) {
                        let vialReactor = guildMembers.get(userID);
                        if (guilds[message.guild.id].rusherBois.includes(vialReactor)) return;
                        let rusherEmoji = client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT");
                        guildMembers.get(userID).send(`You have reacted with ${rusherEmoji}. If you actually plan to rush, react with ✅ and if you made a mistake, react with ❌ to abort.`).then(async msger => {
                            let filterss = (reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❌"
                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID] = new Discord.ReactionCollector(msger, filterss);
                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].on("collect", async (reaction, user) => {
                                if (reaction.users.last().bot === false) {
                                    if (reaction.emoji.name === "✅") {
                                        if (!vialReactor.roles.get(settings.rusherRole)) {
                                            return vialReactor.send(`You do not have the roles required to use this.`).catch(e => {});
                                        }
                                        if (settings.rusherNumber > guilds[message.guild.id].rusherBois.length) {
                                            if (!guilds[message.guild.id].rusherBois.includes(vialReactor)) {
                                                guilds[message.guild.id].rusherBois.push(vialReactor);
                                                if (guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"] === "None") {
                                                    await vialReactor.send(`The raid leader has not set a location yet. Please wait for the raid leader to set a location.`).catch(e => {});
                                                } else {
                                                    await vialReactor.send(`The raid leader has set the location to: \`${guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"]}\`. Please get there asap.`).catch(e => {});
                                                }
                                                aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                                                if (typeOfRun === "void") {
                                                    aborter.fields[2].value = (aborter.fields[2].value === `Main ${rusherEmoji}: None`) ? `Main ${rusherEmoji}: ${vialReactor}` : aborter.fields[2].value + `\nBackup ${rusherEmoji}: ${vialReactor}`;
                                                } else {
                                                    aborter.fields[1].value = (aborter.fields[1].value === `Main ${rusherEmoji}: None`) ? `Main ${rusherEmoji}: ${vialReactor}` : aborter.fields[1].value + `\nBackup ${rusherEmoji}: ${vialReactor}`;
                                                }
                                                if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                                                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                                                } else {
                                                    guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                                                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("❌");
                                                    collectors = new Discord.ReactionCollector(guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"], filters);
                                                    collectors.on("collect", async (reaction, user) => reacting(reaction, user));
                                                }
                                                if (settings.sendARLChat) {
                                                    if (typeOfRun === "void") {
                                                        aborter1.fields[2].value = (aborter1.fields[2].value === `Main ${rusherEmoji}: None`) ? `Main ${rusherEmoji}: ${vialReactor}` : aborter1.fields[2].value + `\nBackup ${rusherEmoji}: ${vialReactor}`;
                                                    } else {
                                                        aborter1.fields[1].value = (aborter1.fields[1].value === `Main ${rusherEmoji}: None`) ? `Main ${rusherEmoji}: ${vialReactor}` : aborter1.fields[1].value + `\nBackup ${rusherEmoji}: ${vialReactor}`;
                                                    }
                                                    if (arlAborter) {
                                                        if (arlAborter.deleted === false) {
                                                            await arlAborter.edit(aborter1).catch(e => {});
                                                        } else {
                                                            arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                                        }
                                                    } else {
                                                        arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                                    }
                                                }
                                            }
                                        } else {
                                            await vialReactor.send(`You have reacted to ${rusherEmoji}, but we already have enough rushers. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`).catch(e => {});
                                        }
                                        if (guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID]) {
                                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].stop();
                                        }
                                    } else if (reaction.emoji.name === "❌") {
                                        if (guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID]) {
                                            guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][userID].stop();
                                            guildMembers.get(userID).send(`You have reacted with ❌, your reaction has now been aborted.`).catch(e => {});
                                        }
                                    }
                                }
                            });
                            await msger.react("✅");
                            await msger.react("❌");
                        }).catch(e => {
                            message.channel.send(`${guildMembers.get(userID)} tried to react with vial, but has messages private, so I cannot pm him.`).catch(e => {});
                        });
                    } else if (reaction.emoji.name === "❌") {
                        let personID = userID;
                        let fetchedMember = guildMembers.get(personID);
                        if (fetchedMember.permissionsIn(theRaiding[myChannel]).toArray().includes("MOVE_MEMBERS")) {
                            let guyName = fetchedMember.displayName;
                            aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                            endingPhrase = `The afk check has been ended by ${guyName}`;
                            aborter.setFooter(`The afk check has been ended by ${guyName}.`);
                            if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                                await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                            } else {
                                guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                            }
                            if (settings.sendARLChat) {
                                if (arlAborter) {
                                    if (arlAborter.deleted === false) {
                                        await arlAborter.edit(aborter).catch(e => {});
                                    } else {
                                        arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                                    }
                                } else {
                                    arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                                }
                            }
                            await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.removeAll();
                            collector.stop();
                            if (cols) {
                                cols.stop();
                            }
                        } else {
                            if (!settings.autoAFKSuspend) return;
                            if (!xReactors[personID]) {
                                xReactors[personID] = {
                                    number: 1
                                };
                            } else {
                                xReactors[personID].number++;
                            }
                            await msg.reactions.find(e => e.emoji.name === "❌").users.remove(personID);
                            if (xReactors[personID].number === 5) {
                                await message.channel.send(`${fetchedMember} (${fetchedMember.displayName}) has reacted with :x: on the afk check. He is at 5/5 warnings. He will be suspended as a result.`).catch(e => {});
                                await fetchedMember.send(`For continuing to attempt to react with :x:, you are will now be suspended for 2 hours as a result.`).catch(e => {
                                    msg.channel.send(`${fetchedMember} For continuing to attempt to react with :x:, you are will now be suspended for 2 hours as a result.`).then(ms => {
                                        setTimeout(() => {
                                            ms.delete();
                                        }, 10000);
                                    }).catch(e => {});
                                });
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle(`Suspension Information`);
                                embed.setColor(0xff2a2a);
                                embed.setDescription(`The suspension is for 2 hours.`);
                                embed.addField(`User's server name: \`${fetchedMember.displayName}\``, `${fetchedMember} (Username: ${fetchedMember.user.username})`, true);
                                embed.addField(`Mod's server name: \`${message.guild.me.displayName}\``, `${client.user} (Username: ${client.user.username})`, true);
                                embed.addField(`Reason for suspension:`, `Auto-suspended for spamming :x: reaction.`);
                                embed.setTimestamp(Date.now() + 7200000);
                                embed.setFooter("Unssuspended at");
                                message.guild.channels.get(settings.suspensionsChannel).send(`${fetchedMember}`).then(msgsss => {
                                    msgsss.delete().catch(e => {});
                                }).catch(e => {});
                                let msgr = await message.guild.channels.get(settings.suspensionsChannel).send(embed).catch(e => {});
                                await client.models.get("suspensions").create({
                                    guildID: message.guild.id,
                                    userID: userID,
                                    nickname: fetchedMember.displayName,
                                    time: Date.now() + 7200000,
                                    reason: `Auto-suspended for spamming :x: reaction.`,
                                    messageID: msgr.id
                                });
                                await fetchedMember.roles.forEach(async e => {
                                    if (parseInt(e.position) !== 0) {
                                        if (e.id !== settings.mutedRole) {
                                            await fetchedMember.roles.remove(e.id);
                                        }
                                        if (e.id !== settings.mutedRole && e.id !== settings.tempKeyRole) {
                                            await client.models.get("suspensionroles").create({
                                               messageID: msgr.id,
                                               roleID: e.id 
                                            });
                                        }
                                    }
                                });
                                await fetchedMember.roles.add(settings.suspendedButVerifiedRole);
                                await fetchedMember.voice.setChannel(settings.AFKChannel).catch(e => {});
                            } else if (xReactors[personID].number < 5) {
                                await message.channel.send(`${fetchedMember} (${fetchedMember.displayName}) has reacted with :x: on the afk check. He is at ${xReactors[personID].number}/5 warnings.`).catch(e => {});
                                await fetchedMember.send(`Do not attempt to react with :x:. This is only for Raid Leaders to use. Continuing to react will cause you to be suspended.`).catch(e => {
                                    msg.channel.send(`${fetchedMember} Do not attempt to react with :x:. This is only for Raid Leaders to use. Continuing to react will cause you to be suspended.`).then(ms => {
                                        setTimeout(() => {
                                            ms.delete();
                                        }, 10000);
                                    }).catch(e => {});
                                });
                            }
                        }
                    } else if (reaction.emoji.name !== "switch1" && reaction.emoji.name !== "switch2" && reaction.emoji.name !== "switch3") {
                        if (!settings.autoAFKSuspend) return;
                        let reactionsCol = msg.reactions.filter((reactions, user) => emojis2.includes(reactions.emoji) && reactions.users.get(userID) && reactions.emoji.name !== "switch1" && reactions.emoji.name !== "switch2" && reactions.emoji.name !== "switch3").array();
                        if (reactionsCol.length >= 2) {
                            let reactionsIFound = [];
                            for (let i = 0; i < reactionsCol.length; i++) {
                                reactionsIFound.push(reactionsCol[i].emoji);
                            }
                            let fetchedMember = guildMembers.get(userID);
                            let firstName = reactionsCol[0].emoji.name;
                            let secondName = reactionsCol[1].emoji.name || "N/A";
                            if (firstName !== "switch" && secondName !== "switch") {
                                if (((firstName === "CloakofthePlanewalker" && secondName === "Rogue") === false && (firstName === "Mystic" && secondName === "orbofaether") === false && (firstName === "Knight" && secondName === "Ogmur") === false && (firstName === "Priest" && secondName === "TomeofPurification") === false && (firstName === "Paladin" && secondName === "MarbleSeal") === false && (firstName === "Archer" && secondName === "qot") === false) || reactionsCol.length > 2) {
                                    if (!pendingReactions[userID]) {
                                        pendingReactions[userID] = {
                                            something: "placeholder"
                                        }
                                        setTimeout(async () => {
                                            delete pendingReactions[userID];
                                            let reactionsCol = msg.reactions.filter((reactions, user) => emojis2.includes(reactions.emoji) && reactions.users.get(userID) && reactions.emoji.name !== "switch1" && reactions.emoji.name !== "switch2" && reactions.emoji.name !== "switch3").array();
                                            if (reactionsCol.length >= 2) {
                                                let reactionsIFound = [];
                                                for (let i = 0; i < reactionsCol.length; i++) {
                                                    reactionsIFound.push(reactionsCol[i].emoji);
                                                }
                                                let firstName = reactionsCol[0].emoji.name;
                                                let secondName = reactionsCol[1].emoji.name || "N/A";
                                                if (firstName !== "switch" && secondName !== "switch") {
                                                    if ((!(firstName === "CloakofthePlanewalker" && secondName === "Rogue") && !(firstName === "Mystic" && secondName === "orbofaether") && !(firstName === "Knight" && secondName === "Ogmur") && !(firstName === "Assassin" && secondName === "armorbreak") && !(firstName === "Knight" && secondName === "armorbreak") && (firstName === "Priest" && secondName === "TomeofPurification") === false && (firstName === "Paladin" && secondName === "MarbleSeal") === false && (firstName === "Archer" && secondName === "qot") === false) || reactionsCol.length > 2) {
                                                        msg.reactions.filter((reactions, user) => emojis2.includes(reactions.emoji) && reactions.users.get(userID)).forEach(emojii => {
                                                            msg.reactions.find(e => e.emoji.name === emojii.emoji.name).users.remove(userID);
                                                        });
                                                        if (!multipleReactors[userID]) {
                                                            multipleReactors[userID] = {
                                                                number: 1
                                                            }
                                                            await fetchedMember.send(`Do **NOT** troll react with classes. The further offenses will result in a suspension. If this was a mistake, simply react with one class next time.`).catch(e => {
                                                                msg.channel.send(`${fetchedMember} Do **NOT** troll react with classes. The further offenses will result in a suspension. If this was a mistake, simply react with one class next time.`).then(ms => {
                                                                    setTimeout(() => {
                                                                        ms.delete().catch(e => {});
                                                                    }, 10000);
                                                                }).catch(e => {});
                                                            });
                                                            await message.channel.send(`${fetchedMember} (${fetchedMember.displayName}) reacted with more than one different class (${reactionsIFound.join(" ")}) and was warned as a result. He is at 1/3 warnings.`).catch(e => {});
                                                        } else {
                                                            multipleReactors[userID].number++;
                                                            if (multipleReactors[userID].number === 3) {
                                                                await fetchedMember.send(`Do **NOT** troll react with classes. You are being suspended for 2 hours as a result.`).catch(e => {
                                                                    msg.channel.send(`${fetchedMember} Do **NOT** troll react with classes. You are being suspended for 2 hours as a result.`).then(ms => {
                                                                        setTimeout(() => {
                                                                            ms.delete().catch(e => {});
                                                                        }, 10000);
                                                                    }).catch(e => {});
                                                                });
                                                                await message.channel.send(`${fetchedMember} (${fetchedMember.displayName}) reacted with more than one different class (${reactionsIFound.join(" ")}) and was warned as a result. He is at 3/3 warnings and will be suspended as a result.`).catch(e => {});
                                                                let embed = new Discord.MessageEmbed();
                                                                embed.setTitle(`Suspension Information`);
                                                                embed.setColor(0xff2a2a);
                                                                embed.setDescription(`The suspension is for 2 hours.`);
                                                                embed.addField(`User's server name: \`${fetchedMember.displayName}\``, `${fetchedMember} (Username: ${fetchedMember.user.username})`, true);
                                                                embed.addField(`Mod's server name: \`${message.guild.me.displayName}\``, `${client.user} (Username: ${client.user.username})`, true);
                                                                embed.addField(`Reason for suspension:`, `Auto-suspended for reacting with multiple classes.`, true);
                                                                embed.setTimestamp(Date.now() + 7200000);
                                                                embed.setFooter("Unssuspended at");
                                                                message.guild.channels.get(settings.suspensionsChannel).send(`${fetchedMember}`).then(msgsss => {
                                                                    msgsss.delete().catch(e => {});
                                                                }).catch(e => {});
                                                                let msgr = await message.guild.channels.get(settings.suspensionsChannel).send(embed).catch(e => {});
                                                                await client.models.get("suspensions").create({
                                                                    guildID: message.guild.id,
                                                                    userID: userID,
                                                                    nickname: fetchedMember.displayName,
                                                                    time: Date.now() + 7200000,
                                                                    reason: `Auto-suspended for reacting with multiple classes.`,
                                                                    messageID: msgr.id
                                                                });
                                                                await fetchedMember.roles.forEach(async e => {
                                                                    if (parseInt(e.position) !== 0) {
                                                                        if (e.id !== settings.mutedRole) {
                                                                            await fetchedMember.roles.remove(e.id);
                                                                        }
                                                                        if (e.id !== settings.mutedRole && e.id !== settings.tempKeyRole) {
                                                                            await client.models.get("suspensionroles").create({
                                                                               messageID: msgr.id,
                                                                               roleID: e.id 
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                                await fetchedMember.roles.add(settings.suspendedButVerifiedRole);
                                                                await fetchedMember.voice.setChannel(settings.AFKChannel).catch(e => {});
                                                                setTimeout(() => {
                                                                    msg.reactions.filter((reactions, user) => reactions.users.get(userID)).forEach(emojii => {
                                                                        msg.reactions.find(e => e.emoji.name === emojii.emoji.name).users.remove(userID);
                                                                    });
                                                                }, 2000);
                                                            } else if (multipleReactors[userID].number < 3) {
                                                                await message.channel.send(`${fetchedMember} (${fetchedMember.displayName}) reacted with more than one different class (${reactionsIFound.join(" ")}) and was warned as a result. He is at 2/3 warnings.`).catch(e => {});
                                                                await fetchedMember.send(`Do **NOT** troll react with classes. The further offenses will result in a suspension.`).catch(e => {
                                                                    msg.channel.send(`${fetchedMember} Do **NOT** troll react with classes. The further offenses will result in a suspension.`).then(ms => {
                                                                        setTimeout(() => {
                                                                            ms.delete().catch(e => {});
                                                                        }, 10000);
                                                                    }).catch(e => {});
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, 5000);
                                    }
                                }
                            }
                        }
                    } else {
                        let number = msg.reactions.find(e => e.emoji.name === reaction.emoji.name).users.keyArray().length;
                        if (number > 2) {
                            let user = guildMembers.get(userID);
                            await user.send(`We seem to already have someone rushing this switch. We no longer need anyone else.`).catch(e => {});
                            await message.channel.send(`${user} (${user.displayName}) has reacted with ${reaction.emoji} but we already have enough rushers.`).catch(e => {});
                            await msg.reactions.find(e => e.emoji.name === reaction.emoji.name).users.remove(userID);
                        }
                        if (reaction.emoji.name === "switch1") {
                            let reaction1 = (msg.reactions.find(e => e.emoji.name === "switch2")) ? msg.reactions.find(e => e.emoji.name === "switch2").users.keyArray() : [];
                            let reaction2 = (msg.reactions.find(e => e.emoji.name === "switch3")) ? msg.reactions.find(e => e.emoji.name === "switch3").users.keyArray() : [];
                            if (reaction1.includes(userID) || reaction2.includes(userID)) {
                                let user = guildMembers.get(userID);
                                await user.send(`You seem to have already reacted to more than one switch emoji. You are allowed to get one switch per player.`).catch(e => {});
                                await message.channel.send(`${user} (${user.displayName}) has reacted with ${reaction.emoji} but has already reacted to other switches.`).catch(e => {});
                                await msg.reactions.find(e => e.emoji.name === reaction.emoji.name).users.remove(userID);
                            }
                        } else if (reaction.emoji.name === "switch2") {
                            let reaction1 = (msg.reactions.find(e => e.emoji.name === "switch1")) ? msg.reactions.find(e => e.emoji.name === "switch1").users.keyArray() : [];
                            let reaction2 = (msg.reactions.find(e => e.emoji.name === "switch3")) ? msg.reactions.find(e => e.emoji.name === "switch3").users.keyArray() : [];
                            if (reaction1.includes(userID) || reaction2.includes(userID)) {
                                let user = guildMembers.get(userID);
                                await user.send(`You seem to have already reacted to more than one switch emoji. You are allowed to get one switch per player.`).catch(e => {});
                                await message.channel.send(`${user} (${user.displayName}) has reacted with ${reaction.emoji} but has already reacted to other switches.`).catch(e => {});
                                await msg.reactions.find(e => e.emoji.name === reaction.emoji.name).users.remove(userID);
                            }
                        } else if (reaction.emoji.name === "switch3") {
                            let reaction1 = (msg.reactions.find(e => e.emoji.name === "switch2")) ? msg.reactions.find(e => e.emoji.name === "switch2").users.keyArray() : [];
                            let reaction2 = (msg.reactions.find(e => e.emoji.name === "switch1")) ? msg.reactions.find(e => e.emoji.name === "switch1").users.keyArray() : [];
                            if (reaction1.includes(userID) || reaction2.includes(userID)) {
                                let user = guildMembers.get(userID);
                                await user.send(`You seem to have already reacted to more than one switch emoji. You are allowed to get one switch per player.`).catch(e => {});
                                await message.channel.send(`${user} (${user.displayName}) has reacted with ${reaction.emoji} but has already reacted to other switches.`).catch(e => {});
                                await msg.reactions.find(e => e.emoji.name === reaction.emoji.name).users.remove(userID);
                            }
                        }
                    }
                }
            });
            collector.on("end", async (collected, reason) => {
                if (something === "main") {
                    guilds[message.guild.id].afkCheckUp = false;
                } else {
                    guilds[message.guild.id].eventAfkCheckUp = false;
                }
                await message.guild.channels.get(theRaiding[myChannel]).setName(`${message.guild.channels.get(theRaiding[myChannel]).name.replace(` <-- Join!`, ``)}`, "Changing name to indicate channel is closed as the AFK check ends.").catch(e => {});
                await message.guild.channels.get(theRaiding[myChannel]).updateOverwrite(settings.raiderRole, {
                    CONNECT: false
                }, "Closing channel as the AFK check ends.").catch(e => {});
                await message.guild.channels.get(theRaiding[myChannel]).edit({userLimit: 99}, "Adding user limit as the AFK check ends.").catch(e => {});
                await setTimeout(async () => {
                    if (message.guild.channels.get(theRaiding[myChannel]).name.includes(" <-- Join!")) {
                        await message.guild.channels.get(theRaiding[myChannel]).setName(`${message.guild.channels.get(theRaiding[myChannel]).name.replace(` <-- Join!`, ``)}`, "Changing name to indicate channel is closed as the AFK check ends. Backup triggered.").catch(e => {});
                    }
                    if (message.guild.channels.get(theRaiding[myChannel]).permissionOverwrites.get(settings.raiderRole).allow.toArray().includes("CONNECT")) {
                        await message.guild.channels.get(theRaiding[myChannel]).updateOverwrite(settings.raiderRole, {
                            CONNECT: false
                        }, "Closing channel as the AFK check ends. Backup triggered.").catch(e => {});
                    }
                    await message.guild.channels.get(theRaiding[myChannel]).edit({userLimit: 99}, "Adding user limit as the AFK check ends.").catch(e => {});
                }, 2000);
                if (msg.deleted === false) {
                    if (guilds[message.guild.id][(something === "main") ? "aborting" : "eventAborting"] === false) {
                        clearInterval(editLoop);
                        let thing = await message.guild.members.fetch().catch(e => {});
                        if (thing) {
                            guildMembers = thing;
                        }
                        let peopleWhoReacted = msg.reactions.get(emojis[0].id).users.filter(e => e.bot === false).keyArray();
                        let peopleInRaiding = message.guild.channels.get(theRaiding[myChannel]).members.keyArray();
                        for (i = 0; i < peopleInRaiding.length; i++) {
                            if (!peopleWhoReacted.includes(peopleInRaiding[i])) {
                                let person = guildMembers.get(peopleInRaiding[i]);
                                if (!person.permissionsIn(message.guild.channels.get(theRaiding[myChannel])).toArray().includes("MOVE_MEMBERS") && !person.hasPermission("ADMINISTRATOR") && person.id !== message.guild.ownerID && !person.user.bot && !(person.roles.get(settings.tempKeyRole) && message.guild.id === "343704644712923138")) {
                                    person.voice.setChannel(settings.AFKChannel).catch(e => {});
                                }
                            }
                        }
                        let newEmbed = new Discord.MessageEmbed();
                        let postAFK = new Discord.MessageEmbed();
                        postAFK.setAuthor(afkEmbed.author.name.replace(` <-- Join!`, ``), afkEmbed.author.iconURL);
                        postAFK.setColor(afkEmbed.color);
                        let timeLeft = settings.postAFKTime;
                        let timeReadable = await command(timeLeft * 1000);
                        let standardText = `**__Post afk move-in!__**\nIf you got disconnected due to the android bug or just missed\nthe afk check in general, join ${message.guild.channels.get(theQueue[0]).name} **then** react with ${emojis[0]} to get moved in.\n__Time Remaining:__ `;
                        postAFK.setDescription(`${standardText}${timeReadable}.`);
                        newEmbed.setAuthor(postAFK.author.name, postAFK.author.iconURL);
                        newEmbed.setColor(postAFK.color);
                        newEmbed.setFooter(endingPhrase);
                        postAFK.setFooter(endingPhrase);
                        postAFK.setTimestamp(new Date());
                        msg.reactions.find(e => e.emoji.name === "❌").users.forEach((e) => {
                            if (!e.bot) {
                                msg.reactions.find(e => e.emoji.name === "❌").users.remove(e);
                            }
                        });
                        let users = msg.reactions.find(e => e.emoji.id === emojis[0].id).users.keyArray();
                        for (let i = 0; i < users.length; i++) {
                            if (guildMembers.get(users[i])) {
                                if (!peopleInRaiding.includes(users[i]) && guildMembers.get(users[i]).bot === false) {
                                    msg.reactions.filter((reactions, user) => reactions.users.get(users[i])).forEach(async emojii => {
                                        await msg.reactions.find(e => e.emoji.name === emojii.emoji.name).users.remove(users[i]);
                                    });
                                }
                            }
                        }
                        await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.removeAll();
                        aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                        aborter.description = aborter.description.replace(` <-- Join!`, ``);
                        if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                            await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                        } else {
                            guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                            await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].react("❌");
                            collectors = new Discord.ReactionCollector(guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"], filters);
                            collectors.on("collect", async (reaction, user) => reacting(reaction, user));
                        }
                        if (settings.sendARLChat) {
                            aborter1 = guilds[message.guild.id][(something === "main") ? "aborterARL" : "eventAborterARL"].embeds[0];
                            aborter1.description = aborter1.description.replace(` <-- Join!`, ``);
                            if (arlAborter) {
                                if (arlAborter.deleted === false) {
                                    await arlAborter.edit(aborter1).catch(e => {});
                                } else {
                                    arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                }
                            } else {
                                arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                            }
                        }
                        msg.edit("", postAFK).then(msgss => {
                            setTimeout(() => {
                                msg.reactions.get(emojis[0].id).users.filter(e => !peopleInRaiding.includes(e.id) && e.bot === false).forEach(e => {
                                    msg.reactions.get(emojis[0].id).users.remove(e);
                                });
                            }, 3000);
                            let filteras = (reaction, user) => reaction.emoji.id === emojis[0].id || reaction.emoji.name === "❌";
                            let collectoras = new Discord.ReactionCollector(msgss, filteras);
                            let postAFKInterval = setInterval(async () => {
                                timeLeft -= 5;
                                if (timeLeft > 0 && msgss.deleted === false) {
                                    let timeReadable1 = await command(timeLeft * 1000);
                                    postAFK.setDescription(`${standardText}${timeReadable1}.`);
                                    msgss.edit(postAFK).catch(e => {});
                                } else {
                                    collectoras.stop();
                                }
                            }, 5000);
                            collectoras.on("collect", async (reaction, user) => {
                                if (reaction.users.last().bot === false) {
                                    let userID = reaction.users.lastKey();
                                    if (reaction.emoji.id === emojis[0].id) {
                                        let person = guildMembers.get(reaction.users.lastKey()) || message.guild.members.fetch(reaction.users.lastKey());
                                        person.voice.setChannel(theRaiding[myChannel]).catch(e => {});
                                    } else if (reaction.emoji.name === "❌") {
                                        let personID = reaction.users.lastKey();
                                        let fetchedMember = guildMembers.get(personID) || message.guild.members.fetch(personID);
                                        if (fetchedMember.permissionsIn(theRaiding[myChannel]).toArray().includes("MOVE_MEMBERS")) {
                                            collectoras.stop();
                                        } else {
                                            if (!settings.autoAFKSuspend) {
                                                return;
                                            }
                                            if (!xReactors[personID]) {
                                                xReactors[personID] = {
                                                    number: 1
                                                };
                                            } else {
                                                xReactors[personID].number++;
                                            }
                                            if (xReactors[personID].number === 5) {
                                                await message.channel.send(`${fetchedMember} (${fetchedMember.displayName}) has reacted with :x: on the afk check. He is at 5/5 warnings. He will be suspended as a result.`).catch(e => {});
                                                await fetchedMember.send(`For continuing to attempt to react with :x:, you are will now be suspended for 2 hours as a result.`).catch(e => {
                                                    msg.channel.send(`${fetchedMember} For continuing to attempt to react with :x:, you are will now be suspended for 2 hours as a result.`).then(ms => {
                                                        setTimeout(() => {
                                                            ms.delete().catch(e => {});
                                                        }, 10000);
                                                    }).catch(e => {});
                                                });
                                                let embed = new Discord.MessageEmbed();
                                                embed.setTitle(`Suspension Information`);
                                                embed.setColor(0xff2a2a);
                                                embed.setDescription(`The suspension is for 2 hours.`);
                                                embed.addField(`User's server name: \`${fetchedMember.displayName}\``, `${fetchedMember} (Username: ${fetchedMember.user.username})`, true);
                                                embed.addField(`Mod's server name: \`${message.guild.me.displayName}\``, `${client.user} (Username: ${client.user.username})`, true);
                                                embed.addField(`Reason for suspension:`, `Auto-suspended for spamming :x: reaction.`);
                                                embed.setTimestamp(Date.now() + 7200000);
                                                embed.setFooter("Unssuspended at");
                                                message.guild.channels.get(settings.suspensionsChannel).send(`${fetchedMember}`).then(msgsss => {
                                                    msgsss.delete().catch(e => {});
                                                }).catch(e => {});
                                                let msgr = await message.guild.channels.get(settings.suspensionsChannel).send(embed).catch(e => {});
                                                await client.models.get("suspensions").create({
                                                    guildID: message.guild.id,
                                                    userID: userID,
                                                    nickname: fetchedMember.displayName,
                                                    time: Date.now() + 7200000,
                                                    reason: `Auto-suspended for spamming :x: reaction.`,
                                                    messageID: msgr.id
                                                });
                                                await fetchedMember.roles.forEach(async e => {
                                                    if (parseInt(e.position) !== 0) {
                                                        if (e.id !== settings.mutedRole) {
                                                            await fetchedMember.roles.remove(e.id);
                                                        }
                                                        if (e.id !== settings.mutedRole && e.id !== settings.tempKeyRole) {
                                                            await client.models.get("suspensionroles").create({
                                                               messageID: msgr.id,
                                                               roleID: e.id 
                                                            });
                                                        }
                                                    }
                                                });
                                                await fetchedMember.roles.add(settings.suspendedButVerifiedRole);
                                                await fetchedMember.voice.setChannel(settings.AFKChannel).catch(e => {});
                                            } else if (xReactors[personID].number < 5) {
                                                await message.channel.send(`${fetchedMember} (${fetchedMember.displayName}) has reacted with :x: on the afk check. He is at ${xReactors[personID].number}/5 warnings.`).catch(e => {});
                                                await fetchedMember.send(`Do not attempt to react with :x:. This is only for Raid Leaders to use. Continuing to react will cause you to be suspended.`).catch(e => {
                                                    msg.channel.send(`${fetchedMember} Do not attempt to react with :x:. This is only for Raid Leaders to use. Continuing to react will cause you to be suspended.`).then(ms => {
                                                        setTimeout(() => {
                                                            ms.delete().catch(e => {});
                                                        }, 10000);
                                                    }).catch(e => {});
                                                });
                                            }
                                            await msg.reactions.find(e => e.emoji.name === "❌").users.remove(personID);
                                        }
                                    }
                                }
                            });
                            collectoras.on("end", async (collected) => {
                                clearInterval(postAFKInterval);
                                let users = msg.reactions.find(e => e.emoji.id === emojis[0].id).users.keyArray();
                                for (let i = 0; i < users.length; i++) {
                                    if (guildMembers.get(users[i])) {
                                        if (!peopleInRaiding.includes(users[i]) && guildMembers.get(users[i]).bot === false) {
                                            msg.reactions.filter((reactions, user) => reactions.users.get(users[i])).forEach(emojii => {
                                                msg.reactions.find(e => e.emoji.name === emojii.emoji.name).users.remove(users[i]);
                                            });
                                        }
                                    }
                                }
                                if (msgss.deleted === false) {
                                    let raidingChannel = message.guild.channels.get(theRaiding[myChannel]);
                                    let peopleInRaiding = raidingChannel.members.keyArray() || [];
                                    let eArray = msg.reactions.get(emojis[0].id).users.keyArray() || [];
                                    let leaderCount = peopleInRaiding.filter(e => guildMembers.get(e).permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS")).length;
                                    let userCount = peopleInRaiding.filter(e => {
                                        if (eArray.includes(e)) {
                                            return true;
                                        } else {
                                            return guildMembers.get(e).permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS");
                                        }
                                    }).length - leaderCount;
                                    if ((message.guild.id === "451171819672698920" || message.guild.id === "343704644712923138") && something === "main") {
                                        setTimeout(() => {
                                            let checkCommand = client.commands.get("checkvc");
                                            let message1 = message;
                                            message1.content = `${settings.prefix}checkVC ${channelOfRun}`;
                                            checkCommand.execute(client, message1, settings, guilds, guildMembers)
                                        }, 60000);
                                    }
                                    let bulkArray = [];
                                    for (let i = 0; i < peopleInRaiding.length; i++) {
                                        if (peopleInRaiding[i]) {
                                            bulkArray.push({
                                                guildID: message.guild.id,
                                                userID: peopleInRaiding[i],
                                                time: Date.now() + 300000,
                                                channelID: theRaiding[myChannel],
                                                runtype: typeOfRun
                                            });
                                        }
                                    }
                                    if (bulkArray.length) {
                                        await client.models.get("temprunss").bulkCreate(bulkArray);
                                    }
                                    let roleName = message.guild.roles.get(settings.raiderRole).name;
                                    newEmbed.setDescription(`The AFK Check is now finished.\nWe are currently running with ${leaderCount} Raid Leader${(leaderCount > 1 || leaderCount === 0) ? "s" : ""} and ${userCount - leaderCount} ${roleName}${(userCount > 1 || userCount === 0) ? "s" : ""}.`);
                                    newEmbed.setTimestamp(postAFK.timestamp);
                                    await msg.edit(newEmbed).catch(e => {});
                                    msg.reactions.find(e => e.emoji.name === "❌").users.forEach((e) => {
                                        msg.reactions.find(e => e.emoji.name === "❌").users.remove(e);
                                    });
                                    let bees = setInterval(async () => {
                                        let raidingChannel1 = message.guild.channels.get(theRaiding[myChannel]);
                                        let peopleInRaiding1 = raidingChannel1.members.keyArray();
                                        let leaderCount = peopleInRaiding1.filter(e => guildMembers.get(e).permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS")).length;
                                        newEmbed.setDescription(`The AFK Check is now finished.\nWe are currently running with ${leaderCount} Raid Leader${(leaderCount > 1 || leaderCount === 0) ? "s" : ""} and ${peopleInRaiding1.length - leaderCount} ${roleName}${((peopleInRaiding1.length - leaderCount) > 1 || (peopleInRaiding1.length - leaderCount) === 0) ? "s" : ""}.`);
                                        await msg.edit(newEmbed).catch(e => {});
                                    }, 5000);
                                    setTimeout(() => {
                                        clearInterval(bees);
                                    }, 120000);
                                }
                            });
                        }).catch(e => {});
                        if (guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"] === "None") {
                            guilds[message.guild.id].finding = true;
                            setTimeout(() => {
                                guilds[message.guild.id].finding = false;
                            }, 60000);
                            let filtas = (args, collection) => true;
                            let messagesCol = new Discord.MessageCollector(message.channel, filtas, {time: 60000});
                            messagesCol.on("collect", async (messager) => {
                                if (messager.author.bot === false) {
                                    if (messager.content.startsWith(`${settings.prefix}loc `)) {
                                        let thingToCompare = (something === "main") ? guilds[message.guild.id].afkCheckUp : guilds[message.guild.id].eventAfkCheckUp;
                                        if (thingToCompare === false) {
                                            let locations = messager.content.split(" ").slice(1).join(" ");
                                            for (let i = 0; i < guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"].length; i++) {
                                                guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"][i].send(`The raid leader has set the location to: \`${locations}\`. Please go there ASAP.`).catch(e => {});
                                            }
                                            for (let i = 0; i < guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"].length; i++) {
                                                guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"][i].send(`The raid leader has set the location to: \`${locations}\`. Please go there ASAP.`).catch(e => {});
                                            }
                                            for (let i = 0; i < guilds[message.guild.id].rusherBois.length; i++) {
                                                guilds[message.guild.id].rusherBois[i].send(`The raid leader has set the location to: \`${locations}\`. Please go there ASAP.`).catch(e => {});
                                            }
                                            if (typeOfRun === "void" || typeOfRun === "v") {
                                                aborter.fields[2].value = locations;
                                            } else {
                                                aborter.fields[1].value = locations;
                                            }
                                            if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                                                await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                                            } else {
                                                guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                                            }
                                            if (settings.sendARLChat) {
                                                if (arlAborter) {
                                                    if (arlAborter.deleted === false) {
                                                        await arlAborter.edit(aborter).catch(e => {});
                                                    } else {
                                                        arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                                                    }
                                                } else {
                                                    arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                                                }
                                            }
                                            await message.channel.send(`Your location of runs has now been changed to: ${locations}`).catch(e => {});
                                            messagesCol.stop();
                                            guilds[message.guild.id].finding = false;
                                        } else {
                                            messagesCol.stop();
                                            guilds[message.guild.id].finding = false;
                                        }
                                    }
                                }
                            });
                            messagesCol.on("end", (collected) => {
                                guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"] = [];
                                guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"] = [];
                                guilds[message.guild.id][(something === "main") ? "mysticBois" : "eventMysticBois"] = [];
                                guilds[message.guild.id][(something === "main") ? "tricksterBois" : "eventTricksterBois"] = [];
                                guilds[message.guild.id][(something === "main") ? "nitroBois" : "eventNitroBois"] = [];
                                guilds[message.guild.id].rusherBois = [];
                            });
                        } else {
                            guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"] = [];
                            guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"] = [];
                            guilds[message.guild.id][(something === "main") ? "mysticBois" : "eventMysticBois"] = [];
                            guilds[message.guild.id][(something === "main") ? "tricksterBois" : "eventTricksterBois"] = [];
                            guilds[message.guild.id][(something === "main") ? "nitroBois" : "eventNitroBois"] = [];
                            guilds[message.guild.id].rusherBois = [];
                        }
                    } else {
                        if (something === "main") {
                            await client.models.get("tempkeys").destroy({where: {guildID: message.guild.id, raidingNumber: theRaiding[myChannel]}});
                            let keyPeople = guildMembers.filter(e => e.roles.get(settings.tempKeyRole) && !e.permissionsIn(theRaiding[0]).toArray().includes("MOVE_MEMBERS")).array();
                            for (let i = 0; i < keyPeople.length; i++) {
                                let log = await client.models.get("tempkeys").findOne({where: {guildID: message.guild.id, userID: keyPeople[i].id}});
                                if (!log) {
                                    await keyPeople[i].roles.remove(settings.tempKeyRole);
                                }
                            }
                        }
                        let abortedEmbed = new Discord.MessageEmbed();
                        abortedEmbed.setAuthor(afkEmbed.author.name.replace(` <-- Join!`, ``), afkEmbed.author.iconURL);
                        abortedEmbed.setDescription(`The afk check is now aborted.`);
                        abortedEmbed.setColor(afkEmbed.color);
                        aborter.description = aborter.description.replace(` <-- Join!`, ``);
                        if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                            await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                        } else {
                            guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                        }
                        if (settings.sendARLChat) {
                            aborter1.description = aborter1.description.replace(` <-- Join!`, ``);
                            if (arlAborter) {
                                if (arlAborter.deleted === false) {
                                    await arlAborter.edit(aborter1).catch(e => {});
                                } else {
                                    arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                                }
                            } else {
                                arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter1).catch(e => {});
                            }
                        }
                        await abortedEmbed.setFooter(endingPhrase);
                        await abortedEmbed.setTimestamp(new Date());
                        msg.edit("", abortedEmbed).then(myMessage => {
                            if (msg.reactions.find(e => e.emoji.name === "❌")) {
                                msg.reactions.find(e => e.emoji.name === "❌").users.forEach((e) => {
                                    msg.reactions.find(e => e.emoji.name === "❌").users.remove(e);
                                });
                            }
                        }).catch(e => {});
                        guilds[message.guild.id][(something === "main") ? "aborting" : "eventAborting"] = false;
                        guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"] = [];
                        guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"] = [];
                        guilds[message.guild.id][(something === "main") ? "mysticBois" : "eventMysticBois"] = [];
                        guilds[message.guild.id][(something === "main") ? "tricksterBois" : "eventTricksterBois"] = [];
                        guilds[message.guild.id][(something === "main") ? "nitroBois" : "eventNitroBois"] = [];
                        guilds[message.guild.id].rusherBois = [];
                    }
                } else {
                    await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].reactions.removeAll();
                    cols.stop();
                    aborter = guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].embeds[0];
                    aborter.setFooter(`The afk check has been deleted.`);
                    aborter.description = aborter.description.replace(` <-- Join!`, ``);
                    if (guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].deleted === false) {
                        await guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"].edit(aborter).catch(e => {});
                    } else {
                        guilds[message.guild.id][(something === "main") ? "aborter" : "eventAborter"] = await message.channel.send(aborter).catch(e => {});
                    }
                    if (settings.sendARLChat) {
                        aborter.description = aborter.description.replace(` <-- Join!`, ``);
                        if (arlAborter) {
                            if (arlAborter.deleted === false) {
                                await arlAborter.edit(aborter).catch(e => {});
                            } else {
                                arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                            }
                        } else {
                            arlAborter = await message.guild.channels.get(settings.arlChannel).send(aborter).catch(e => {});
                        }
                    }
                    guilds[message.guild.id][(something === "main") ? "keyBois" : "eventKeyBois"] = [];
                    guilds[message.guild.id][(something === "main") ? "vialBois" : "eventVialBois"] = [];
                    guilds[message.guild.id][(something === "main") ? "mysticBois" : "eventMysticBois"] = [];
                    guilds[message.guild.id][(something === "main") ? "tricksterBois" : "eventTricksterBois"] = [];
                    guilds[message.guild.id][(something === "main") ? "nitroBois" : "eventNitroBois"] = [];
                    guilds[message.guild.id].rusherBois = [];
                }
                guilds[message.guild.id][(something === "main") ? "location" : "eventLocation"] = "None";
                if (something === "main") {
                    guilds[message.guild.id].afkCheckUp = false;
                } else {
                    guilds[message.guild.id].eventAfkCheckUp = false;
                }
                let aborters = Object.keys(guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"]);
                for (let i = 0; i < aborters.length; i++) {
                    guilds[message.guild.id][(something === "main") ? "collectors" : "eventCollectors"][aborters[i]].stop();
                }
            });
            let z = 0;
            while (z < emojis.length) {
                if (msg.deleted === false) {
                    await msg.react(emojis[z].id).catch(e => {});
                }
                z++;
            }
            if (shard) {
                await msg.react(misc.get("shard").id).catch(e => {});
            }
            if (something === "main") {
                if (msg.deleted === false && guilds[message.guild.id].afkCheckUp) {
                    await msg.react("❌").catch(e => {});
                }
            } else {
                if (msg.deleted === false && guilds[message.guild.id].eventAfkCheckUp) {
                    await msg.react("❌").catch(e => {});
                }
            }
        }).catch(e => {});
    }
}