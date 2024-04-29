const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Mutes the user for the specified time or infinitely.",
    use: "mute [user] <time> <unit> <reason>",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: ["mutedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let roles = [];
        let muteRoles = await client.models.get("muteroles").findAll({where: {guildID: message.guild.id}});
        let mutesDB = client.models.get("mutes");
        let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
        for (let i = 0; i < muteRoles.length; i++) {
            if (authorRoles.includes(muteRoles[i].dataValues.roleID)) {
                roles.push(`Placeholder`);
            }
        }
        if (roles.length === 0) {
            return message.channel.send("You do not have permission to use this command.");
        }
        let args = message.content.toLowerCase().split(" ");
        let thingToCheck = args[1];
        let timeOfSuspend = args[2];
        let unitOfSuspend = args[3];
        let inTheServer = true;
        let timeInText = "finite";
        if (!guildMembers.get(client.user.id).hasPermission("MANAGE_ROLES")) {
            return message.channel.send("I cannot mute anyone because I am missing permissions to `MANAGE_ROLES`.");
        }
        let command = require("./help/member");
        let person = await command(guildMembers, thingToCheck, settings);
        if (!person) {
            if (/^[0-9]*$/.test(thingToCheck) && thingToCheck.length > 15) {
                inTheServer = false;
            } else {
                return message.channel.send("That is an invalid user to mute.");
            }
        }
        if (!/^[0-9]*$/.test(timeOfSuspend)) {
            timeInText = "infinite";
        } else {
            if (!/^[0-9]*$/.test(timeOfSuspend)) {
                return message.channel.send("That is an invalid time format.");
            }
        }
        if (timeInText !== "infinite") {
            if (parseInt(timeOfSuspend) > 100000 || parseInt(timeOfSuspend) <= 0) {
                return message.channel.send("That is an invalid time to use for the mute.");
            }
        }
        let multi;
        let unitToText;
        if (unitOfSuspend === "s" || unitOfSuspend === "second" || unitOfSuspend === "seconds") {
            multi = 1000;
            unitToText = "second";
        } else if (unitOfSuspend === "m" || unitOfSuspend === "minute" || unitOfSuspend === "minutes") {
            multi = 60000;
            unitToText = "minute";
        } else if (unitOfSuspend === "h" || unitOfSuspend === "hour" || unitOfSuspend === "hours") {
            multi = 3600000;
            unitToText = "hour";
        } else if (unitOfSuspend === "d" || unitOfSuspend === "day" || unitOfSuspend === "days") {
            multi = 86400000;
            unitToText = "day";
        } else if (unitOfSuspend === "w" || unitOfSuspend === "week" || unitOfSuspend === "weeks") {
            multi = 604800000;
            unitToText = "week";
        } else {
            if (timeInText !== "infinite") {
                return message.channel.send("That is an invalid unit to use for the mute.");
            }
        }
        let reason = (timeInText === "infinite") ? args.slice(2).join(" ") : args.slice(4).join(" ");
        let plurl = (parseInt(timeOfSuspend) > 1) ? "s" : "";
        if (inTheServer) {
            let clientRoless = guildMembers.get(client.user.id).roles.highest.position;
            let authorRoless = guildMembers.get(message.author.id).roles.highest.position;
            let userRoless = person.roles.highest.position;
            if (userRoless >= clientRoless) {
                return message.channel.send("I cannot mute that person because their roles are higher or equal to mine.");
            }
            if (userRoless >= authorRoless) {
                return message.channel.send("I cannot mute that person because their roles are higher or equal to yours.");
            }
            person.roles.add(settings.mutedRole);
            if (timeInText === "finite") {
                let muteIFound = await mutesDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (muteIFound) {
                    await mutesDB.update({
                        time: Date.now() + multi * parseInt(timeOfSuspend),
                        reason: (reason) ? reason : null
                    }, {where: {guildID: message.guild.id, userID: person.id}});
                } else {
                    await mutesDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        time: Date.now() + multi * parseInt(timeOfSuspend),
                        reason: (reason) ? reason : null
                    });
                }
                message.channel.send(`${person} (${person.displayName}) is now muted for ${timeOfSuspend} ${unitToText}${plurl}.`);
            } else {
                message.channel.send(`${person} (${person.displayName}) is now muted with no unmute time.`);
                await mutesDB.create({
                    guildID: message.guild.id,
                    userID: person.id,
                    time: null,
                    reason: (reason) ? reason : null
                });
            }
        } else {
            if (timeInText === "finite") {
                message.channel.send(`<@${thingToCheck}> is now muted for ${timeOfSuspend} ${unitToText}${plurl}. (Not in the server so it will only role persist)`);
                let muteIFound = await mutesDB.findOne({where: {guildID: message.guild.id, userID: thingToCheck}});
                if (muteIFound) {
                    await mutesDB.update({
                        time: Date.now() + multi * parseInt(timeOfSuspend),
                        reason: (reason) ? reason : null
                    }, {where: {guildID: message.guild.id, userID: thingToCheck}});
                } else {
                    await mutesDB.create({
                        guildID: message.guild.id,
                        userID: thingToCheck,
                        time: null,
                        reason: (reason) ? reason : null
                    });
                }
            } else {
                message.channel.send(`<@${thingToCheck}> is now muted with no unmute time. (Not in the server, so it will only role persist)`);
                await mutesDB.create({
                    guildID: message.guild.id,
                    userID: thingToCheck,
                    time: null,
                    reason: (reason) ? reason : null
                });
            }
        }
        if (inTheServer) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Mute issued on the server: ${message.guild.name}`);
            embed.setDescription(`__Moderator__: ${message.author} (${guildMembers.get(message.author.id).displayName})\n__Reason__: ${reason}`);
            if (timeInText === "finite") {
                embed.setTimestamp(Date.now() + multi * parseInt(timeOfSuspend));
            }
            embed.setFooter(`Unmuted at: ${(timeInText !== "finite") ? "No Unmute Time" : ""}`);
            embed.setColor(0xff0000);
            person.send(embed);
        }
    }
}