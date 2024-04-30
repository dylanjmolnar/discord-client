const Discord = require('discord.js');

module.exports = {
    aliases: ["hc"],
    description: "Starts a headcount for the respective type of raid.",
    use: "headcount [type]",
    cooldown: 3,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let portals = client.emojisPortals;
        let keys = client.emojisKeys;
        let misc = client.emojisMisc;
        let hcEmbed = new Discord.MessageEmbed();
        let args = message.content.toLowerCase().split(" ");
        let typeOfRun = args.slice(1).join(" ");
        let portal, key, theChannel;
        let personName = guildMembers.get(message.author.id).displayName;
        let server = await client.models.get("typeprofile").findOne({where: {guildID: message.guild.id}});
        const serverType = server.dataValues.type;
        if (!typeOfRun && serverType !== "lh") {
            typeOfRun = serverType;
            theChannel = settings.AFKChecks;
            if (message.channel.id === settings.veteranCommandsChannel) {
                theChannel = settings.veteranCheckChannel;
            }
            let colorCommand = require("./help/color");
            hcEmbed.setColor(colorCommand(typeOfRun));
            hcEmbed.setTitle(`Headcount for \`${portals.get(typeOfRun).name.split("_").join(" ")}\` started by ${personName}!`);
            portal = portals.get(typeOfRun);
            key = keys.get(typeOfRun);
            hcEmbed.setDescription(`React with ${portals.get(typeOfRun)} to participate and ${keys.get(typeOfRun)} if you have a key and are willing to pop!`);
        } else if (typeOfRun === "void" || typeOfRun === "v") {
            typeOfRun = "void";
            if (serverType === "lh") {
                theChannel = settings.AFKChecks;
            } else {
                theChannel = settings.eventAFKChecks;
            }
            if (message.channel.id === settings.veteranCommandsChannel) {
                theChannel = settings.veteranCheckChannel;
            }
            let colorCommand = require("./help/color");
            hcEmbed.setColor(colorCommand(typeOfRun));
            hcEmbed.setTitle(`Headcount for \`Void Run\` started by ${personName}!`);
            hcEmbed.setDescription(`React with ${misc.get("void")} to participate and ${keys.get("losthalls")} if you have a key and are willing to pop!`);
            portal = misc.get("void");
            key = keys.get("losthalls");
        } else if (typeOfRun === "cult" || typeOfRun === "c") {
            typeOfRun = "cult";
            if (serverType === "lh") {
                theChannel = settings.AFKChecks;
            } else {
                theChannel = settings.eventAFKChecks;
            }
            if (message.channel.id === settings.veteranCommandsChannel) {
                theChannel = settings.veteranCheckChannel;
            }
            let colorCommand = require("./help/color");
            hcEmbed.setColor(colorCommand(typeOfRun));
            hcEmbed.setTitle(`Headcount for \`Cult Run\` started by ${personName}!`);
            hcEmbed.setDescription(`React with ${misc.get("malus")} to participate and ${keys.get("losthalls")} if you have a key and are willing to pop!`);
            portal = misc.get("malus");
            key = keys.get("losthalls");
        } else if (typeOfRun === "all") {
            theChannel = settings.eventAFKChecks;
            if (message.channel.id === settings.veteranCommandsChannel) {
                theChannel = settings.veteranCheckChannel;
            }
            hcEmbed.setTitle(`Headcount for \`Random Events\` started by ${personName}!`);
            hcEmbed.setDescription(`React with ${portals.get("piratecave")} to participate and any of the keys if you have that type of key and are willing to pop!`);
            portal = portals.get("piratecave");
            key = null;
        } else if (portals.get(typeOfRun) || portals.find(e => e.name.split("_").map(e => e[0].toLowerCase()).join("") === typeOfRun)) {
            typeOfRun = (portals.get(typeOfRun)) ? portals.get(typeOfRun).name.toLowerCase().split("_").join("") : portals.find(e => e.name.split("_").map(e => e[0].toLowerCase()).join("") === typeOfRun).name.toLowerCase().split("_").join("");
            if (serverType === typeOfRun) {
                theChannel = settings.AFKChecks;
            } else {
                theChannel = settings.eventAFKChecks;
            }
            if (message.channel.id === settings.veteranCommandsChannel) {
                theChannel = settings.veteranCheckChannel;
            }
            let colorCommand = require("./help/color");
            hcEmbed.setColor(colorCommand(typeOfRun));
            hcEmbed.setTitle(`Headcount for \`${portals.get(typeOfRun).name.split("_").join(" ")}\` started by ${personName}!`);
            portal = portals.get(typeOfRun);
            key = keys.get(typeOfRun);
            hcEmbed.setDescription(`React with ${portals.get(typeOfRun)} to participate and ${keys.get(typeOfRun)} if you have a key and are willing to pop!`);
        } else {
            let correctCommand = require("./help/correct");
            let correction = await correctCommand(client, message, typeOfRun);
            if (!correction) return;
            let command1 = client.commands.get("headcount");
            let myContent = message.content.split(" ");
            myContent[1] = correction;
            message.content = myContent.join(" ");
            return command1.execute(client, message, settings, guilds, guildMembers);
        }
        hcEmbed.setTimestamp(new Date());
        let emojisName;
        if (typeOfRun === "void") {
            emojisName = "Void";
        } else if (typeOfRun === "cult") {
            emojisName = "Cult";
        } else if (typeOfRun === "all") {
            emojisName = "Random Events";
        } else {
            emojisName = portals.get(typeOfRun).name.split("_").join(" ");
        }
        if (message.content.startsWith(`${settings.prefix}${settings.prefix}`)) {
            client.options.disableEveryone = true;
        }
        message.guild.channels.get(theChannel).send(`@here Headcount for \`${emojisName}\` (${portal}) started by ${message.author}!`).then(msg => {
            msg.delete();
        });
        client.options.disableEveryone = false;
        message.guild.channels.get(theChannel).send(hcEmbed).then(async msg => {
            msg.react(portal.id);
            if (!key) {
                let mess = await message.guild.channels.get(theChannel).send("more options...");
                let keysArr = keys.filter(e => e.name !== "ShattersKey" && e.name !== "LostHallsKey").keyArray();
                for (let i = 0; i < 20; i++) {
                    await msg.react(keys.get(keysArr[i]).id).catch(e => {});
                }
                for (let i = 20; i < keysArr.length; i++) {
                    await mess.react(keys.get(keysArr[i]).id).catch(e => {});
                }
            } else {
                await msg.react(key.id);
                if (typeOfRun === "void") {
                    await msg.react(client.emojisMisc.get("vial").id);
                    await msg.react(client.emojisMisc.get("warrior").id);
                    await msg.react(client.emojisMisc.get("paladin").id);
                    await msg.react(client.emojisMisc.get("knight").id);
                    await msg.react(client.emojisMisc.get("priest").id);
                    await msg.react(client.guilds.get("583873260886687786").emojis.find(e => e.name === "MarbleSealUT").id);
                    await msg.react(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT").id);
                } else if (typeOfRun === "cult") {
                    await msg.react(client.emojisMisc.get("warrior").id);
                    await msg.react(client.emojisMisc.get("paladin").id);
                    await msg.react(client.emojisMisc.get("knight").id);
                    await msg.react(client.emojisMisc.get("priest").id);
                    await msg.react(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT").id);
                } else if (typeOfRun === "shatters") {
                    await msg.react(client.emojisMisc.get("warrior").id);
                    await msg.react(client.emojisMisc.get("paladin").id);
                    await msg.react(client.emojisMisc.get("priest").id);
                    await msg.react(client.emojisMisc.get("knight").id);
                    await msg.react(client.emojisMisc.get("armorbreak").id);
                    await msg.react(client.emojisMisc.get("mystic").id);
                    await msg.react(client.guilds.get("583860720114991124").emojis.find(e => e.name === "OrbofAetherUT").id);
                    await msg.react(client.emojisMisc.get("assassin").id);
                    await msg.react(client.emojisMisc.get("switch1").id);
                    await msg.react(client.emojisMisc.get("switch2").id);
                    await msg.react(client.emojisMisc.get("switch3").id);
                } else if (typeOfRun === "fungalcavern") {
                    await msg.react(client.emojisMisc.get("warrior").id);
                    await msg.react(client.emojisMisc.get("paladin").id);
                    await msg.react(client.emojisMisc.get("priest").id);
                    await msg.react(client.emojisMisc.get("knight").id);
                    await msg.react(client.guilds.get("583873260886687786").emojis.find(e => e.name === "ShieldofOgmurUT").id);
                    await msg.react(client.guilds.get("583807147134025750").emojis.find(e => e.name === "CloakofthePlanewalkerUT").id);
                    await msg.react(client.guilds.get("583873260886687786").emojis.find(e => e.name === "MarbleSealUT").id);
                    await msg.react(client.guilds.get("583871706985398292").emojis.find(e => e.name === "QuiverofThunderUT").id);
                    await msg.react(client.emojisMisc.get("slow").id);
                    await msg.react(client.emojisMisc.get("mystic").id);
                    await msg.react(client.emojisMisc.get("trickster").id);
                } else {
                    await msg.react(client.emojisMisc.get("warrior").id);
                    await msg.react(client.emojisMisc.get("paladin").id);
                    await msg.react(client.emojisMisc.get("priest").id);
                    await msg.react(client.emojisMisc.get("knight").id);
                }
            }
        });
    }
}