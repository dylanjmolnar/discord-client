module.exports = {
    aliases: [],
    description: "Locks down the channnel provided so that the raider role cannot speak in there.",
    use: "lockdown <channel> <time> <unit> <reason>",
    cooldown: 3,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let lockdownRoles = await client.models.get("purgeroles").findAll({where: {guildID: message.guild.id}});
        let roles = [];
        let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
        for (let i = 0; i < lockdownRoles.length; i++) {
            if (authorRoles.includes(lockdownRoles[i].dataValues.roleID)) {
                roles.push(`Placeholder`);
            }
        }
        if (roles.length === 0) {
            return message.channel.send(`You do not have permission to use this command.`);
        }
        let args = message.content.split(" ");
        let command = require("./help/channel");
        let thingToCheck = args[1];
        let channel = (thingToCheck) ? (await command(message, thingToCheck, "text") ? await command(message, thingToCheck, "text") : message.channel) : message.channel;
        let timed = false;
        let reason;
        let possibleTime = args[2];
        let unitOfSuspend = args[3];
        if (possibleTime) {
            if (/^[0-9]*$/.test(possibleTime)) {
                possibleTime = parseInt(possibleTime);
                timed = true;
            }
        }
        let multi;
        let unitToText;
        if (unitOfSuspend) {
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
                timed = false;
            }
        } else {
            timed = false;
        }
        if (timed === true) {
            reason = args.slice(4).join(" ") | null;
        } else if (timed === false) {
            reason = args.slice(2).join(" ") | null;
        }
        let plurl = (possibleTime > 1 || possibleTime === 0) ? "s" : "";
        message.guild.members.fetch(client.user.id).then(async bot => {
            if (bot.permissionsIn(channel.id).toArray().includes("MANAGE_CHANNELS")) {
                if (message.guild.roles.find(e => e.position === 0).permissionsIn(channel.id).toArray().includes("SEND_MESSAGES")) {
                    let lockdowns = await client.models.get("lockdowns").findOne({where: {guildID: message.guild.id, channelID: channel.id}});
                    if (lockdowns) {
                        await client.models.get("lockdowns").destroy({where: {guildID: message.guild.id, channelID: channel.id}});
                        return message.channel.send(`The channel lockdown for ${channel} has been ended.`);
                    }
                    if (!reason) {
                        channel.updateOverwrite(message.guild.roles.find(e => e.position === 0), {
                            'SEND_MESSAGES': false,
                            'ADD_REACTIONS': false
                        }).catch(e => {
                            return message.channel.send(`I cannot lock down ${channel} because I am missing permissions \`MANAGE_CHANNELS\` in the channel you want to lock down.`);
                        });
                    } else {
                        channel.updateOverwrite(message.guild.roles.find(e => e.position === 0), {
                            'SEND_MESSAGES': false,
                            'ADD_REACTIONS': false
                        }, reason).catch(e => {
                            return message.channel.send(`I cannot lock down ${channel} because I am missing permissions \`MANAGE_CHANNELS\` in the channel you want to lock down.`);
                        });
                    }
                    if (timed === true) {
                        await client.models.get("lockdowns").create({
                            guildID: message.guild.id,
                            time: (Date.now() + (possibleTime * multi)),
                            channelID: channel.id,
                            reason: reason
                        });
                        message.channel.send(`${channel} has been locked down for ${possibleTime} ${unitToText}${plurl}.`);
                    } else if (timed === false) {
                        message.channel.send(`${channel} has been locked down until this command is used again.`);
                    }
                } else {
                    if (!reason) {
                        channel.updateOverwrite(message.guild.roles.find(e => e.position === 0), {
                            'SEND_MESSAGES': null,
                            'ADD_REACTIONS': null
                        }).catch(e => {
                            return message.channel.send(`I cannot lock down ${channel} because I am missing permissions \`MANAGE_CHANNELS\` in the channel you want to lock down.`);
                        });
                    } else {
                        channel.updateOverwrite(message.guild.roles.find(e => e.position === 0), {
                            'SEND_MESSAGES': null,
                            'ADD_REACTIONS': null
                        }, reason).catch(e => {
                            return message.channel.send(`I cannot lock down ${channel} because I am missing permissions \`MANAGE_CHANNELS\` in the channel you want to lock down.`);
                        });
                    }
                    let lockdowns = await client.models.get("lockdowns").findOne({where: {guildID: message.guild.id, channelID: channel.id}});
                    if (lockdowns) {
                        await client.models.get("lockdowns").destroy({where: {guildID: message.guild.id, channelID: channel.id}});
                    }
                    message.channel.send(`The channel lockdown for ${channel} has been ended.`);
                }
            } else {
                return message.channel.send(`I cannot lock down ${channel} because I am missing permissions \`MANAGE_CHANNELS\` in the channel you want to lock down.`);
            }
        });
    }
}