module.exports = {
    aliases: ["changeLog"],
    description: "Changes the logged number of whatever you choose to change by the number specified.",
    use: "changeLogs [user] [add | remove] [type of log] [number]",
    cooldown: 5,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let logsDB = client.models.get("currentweeklogs");
        let totalDB = client.models.get("totallogs");
        let args = message.content.toLowerCase().split(" ");
        let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
        let chaneLogsRoles = await client.models.get("changelogsroles").findAll({where: {guildID: message.guild.id}});
        let server = await client.models.get("typeprofile").findOne({where: {guildID: message.guild.id}});
        const serverType = server.dataValues.type;
        let roles = [];
        for (let i = 0; i < chaneLogsRoles.length; i++) {
            if (authorRoles.includes(chaneLogsRoles[i].dataValues.roleID)) {
                roles.push(`Placeholder`);
            }
        }
        if (roles.length === 0) {
            return message.channel.send(`You do not have permission to use this command.`);
        }
        let thingToCheck = args[1];
        let command = require("./help/member");
        let person = await command(guildMembers, thingToCheck, settings);
        if (!person) {
            return message.channel.send(`Please provide a valid user to change logs for.`);
        }
        let addOrRemove = args[2];
        if (!addOrRemove) {
            return message.channel.send(`Please provide a valid operation: \`add\` or \`remove\`.`);
        }
        let thingToAddTo = args[3];
        if (addOrRemove === "add") {
            let numberToAddOrRemove = parseInt(args[4]);
            if (!numberToAddOrRemove) {
                return message.channel.send(`That is an invalid number of runs to add/remove.`);
            }
            if (numberToAddOrRemove > 200) {
                return message.channel.send(`That is an invalid number of runs to add/remove. (Cannot be above 200 runs at a time)`);
            }
            if (thingToAddTo === "s" || thingToAddTo === "success" || thingToAddTo === "v" || thingToAddTo === "void") {
                for (let i = 0; i < numberToAddOrRemove; i++) {
                    await logsDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        type: "void",
                        extra: `Added by <@${message.author.id}> by changeLogs.`,
                        time: Date.now()
                    });
                }
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (totalLog) {
                    await totalDB.update({numberOfVoid: totalLog.dataValues.numberOfVoid + numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                } else {
                    await totalDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        numberOfVoid: numberToAddOrRemove,
                        numberofCult: 0,
                        numberOfAssists: 0,
                        numberOfEvent: 0,
                        numberOfEventAssists: 0
                    });
                }
                if (serverType === "lh") {
                    await message.channel.send(`You have now added ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s void runs.`);
                } else {
                    await message.channel.send(`You have now added ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s successful runs.`);
                }
            } else if (thingToAddTo === "a" || thingToAddTo === "assist") {
                for (let i = 0; i < numberToAddOrRemove; i++) {
                    await logsDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        type: "assist",
                        extra: `Added by <@${message.author.id}> by changeLogs.`,
                        time: Date.now()
                    });
                }
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (totalLog) {
                    await totalDB.update({numberOfAssists: totalLog.dataValues.numberOfAssists + numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                } else {
                    await totalDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        numberOfVoid: 0,
                        numberofCult: 0,
                        numberOfAssists: numberToAddOrRemove,
                        numberOfEvent: 0,
                        numberOfEventAssists: 0
                    });
                }
                await message.channel.send(`You have now added ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s assisted runs.`);
            } else if (thingToAddTo === "e" || thingToAddTo === "event") {
                for (let i = 0; i < numberToAddOrRemove; i++) {
                    await logsDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        type: "event",
                        extra: `Added by <@${message.author.id}> by changeLogs.`,
                        time: Date.now()
                    });
                }
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (totalLog) {
                    await totalDB.update({numberOfEvent: totalLog.dataValues.numberOfEvent + numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                } else {
                    await totalDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        numberOfVoid: 0,
                        numberofCult: 0,
                        numberOfAssists: 0,
                        numberOfEvent: numberToAddOrRemove,
                        numberOfEventAssists: 0
                    });
                }
                await message.channel.send(`You have now added ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s event runs.`);
            } else if (thingToAddTo === "f" || thingToAddTo === "fail" || thingToAddTo === "c" || thingToAddTo === "cult") {
                for (let i = 0; i < numberToAddOrRemove; i++) {
                    await logsDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        type: "cult",
                        extra: `Added by <@${message.author.id}> by changeLogs.`,
                        time: Date.now()
                    });
                }
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (totalLog) {
                    await totalDB.update({numberofCult: totalLog.dataValues.numberofCult + numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                } else {
                    await totalDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        numberOfVoid: 0,
                        numberofCult: numberToAddOrRemove,
                        numberOfAssists: 0,
                        numberOfEvent: 0,
                        numberOfEventAssists: 0
                    });
                }
                if (serverType === "lh") {
                    await message.channel.send(`You have now added ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s cult runs.`);
                } else {
                    await message.channel.send(`You have now added ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s failed runs.`);
                }
            } else if (thingToAddTo === "ea" || thingToAddTo === "eventassist") {
                for (let i = 0; i < numberToAddOrRemove; i++) {
                    await logsDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        type: "eventAssist",
                        extra: `Added by <@${message.author.id}> by changeLogs.`,
                        time: Date.now()
                    });
                }
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (totalLog) {
                    await totalDB.update({numberOfEventAssists: totalLog.dataValues.numberOfEventAssists + numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                } else {
                    await totalDB.create({
                        guildID: message.guild.id,
                        userID: person.id,
                        numberOfVoid: 0,
                        numberofCult: 0,
                        numberOfAssists: 0,
                        numberOfEvent: 0,
                        numberOfEventAssists: numberToAddOrRemove
                    });
                }
                await message.channel.send(`You have now added ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s event assisted runs.`);
            } else if (thingToAddTo === "kp") {
                let kpLog = await client.models.get("kp").findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (kpLog) {
                    await client.models.get("kp").update({numberOfRegular: kpLog.dataValues.numberOfRegular + numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                } else {
                    await client.models.get("kp").create({
                        guildID: message.guild.id,
                        userID: person.id,
                        numberOfRegular: numberToAddOrRemove,
                        numberOfEvent: 0
                    });
                }
                await message.channel.send(`You have now added ${numberToAddOrRemove} pop${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s key pops.`);
            } else if (thingToAddTo === "ekp") {
                let kpLog = await client.models.get("kp").findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (kpLog) {
                    await client.models.get("kp").update({numberOfEvent: kpLog.dataValues.numberOfEvent + numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                } else {
                    await client.models.get("kp").create({
                        guildID: message.guild.id,
                        userID: person.id,
                        numberOfRegular: 0,
                        numberOfEvent: numberToAddOrRemove
                    });
                }
                await message.channel.send(`You have now added ${numberToAddOrRemove} pop${(numberToAddOrRemove > 1) ? "s" : ""} to ${person}'s event key pops.`);
            } else {
                return message.channel.send(`That is an invalid type of run to add/remove from.`);
            }
        } else if (addOrRemove === "remove") {
            let numberToAddOrRemove = parseInt(args[4]);
            if (!numberToAddOrRemove) {
                return message.channel.send(`That is an invalid number of runs to add/remove.`);
            }
            if (thingToAddTo === "s" || thingToAddTo === "success" || thingToAddTo === "v" || thingToAddTo === "void") {
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (!totalLog) {
                    return message.channel.send(`You cannot remove that many runs because ${person} has no logged runs.`);
                }
                let logNumber = await logsDB.findAll({where: {guildID: message.guild.id, userID: person.id, type: "void"}});
                if (logNumber.length >= numberToAddOrRemove) {
                    for (let i = logNumber.length - 1; i >= logNumber.length - numberToAddOrRemove; i--) {
                        await logsDB.destroy({where: {guildID: message.guild.id, userID: person.id, time: logNumber[i].dataValues.time}});
                    }
                    await totalDB.update({numberOfVoid: totalLog.dataValues.numberOfVoid - numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                    if (serverType === "lh") {
                        message.channel.send(`You have now removed ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s void runs.`);
                    } else {
                        message.channel.send(`You have now removed ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s successful runs.`);
                    }
                } else {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has ${logNumber.length} ${(serverType === "lh") ? "void" : "successful"} runs.`);
                }
            } else if (thingToAddTo === "a" || thingToAddTo === "assist") {
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (!totalLog) {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has no logged runs.`);
                }
                let logNumber = await logsDB.findAll({where: {guildID: message.guild.id, userID: person.id, type: "assist"}});
                if (logNumber.length >= numberToAddOrRemove) {
                    for (let i = logNumber.length - 1; i >= logNumber.length - numberToAddOrRemove; i--) {
                        await logsDB.destroy({where: {guildID: message.guild.id, userID: person.id, time: logNumber[i].dataValues.time}});
                    }
                    await totalDB.update({numberOfAssists: totalLog.dataValues.numberOfAssists - numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                    await message.channel.send(`You have now removed ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s assisted runs.`);
                } else {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has ${logNumber.length} ${(serverType === "lh") ? "void" : "successful"} runs.`);
                }
            } else if (thingToAddTo === "e" || thingToAddTo === "event") {
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (!totalLog) {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has no logged runs.`);
                }
                let logNumber = await logsDB.findAll({where: {guildID: message.guild.id, userID: person.id, type: "event"}});
                if (logNumber.length >= numberToAddOrRemove) {
                    for (let i = logNumber.length - 1; i >= logNumber.length - numberToAddOrRemove; i--) {
                        await logsDB.destroy({where: {guildID: message.guild.id, userID: person.id, time: logNumber[i].dataValues.time}});
                    }
                    await totalDB.update({numberOfEvent: totalLog.dataValues.numberOfEvent - numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                    await message.channel.send(`You have now removed ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s event runs.`);
                } else {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has ${logNumber.length} ${(serverType === "lh") ? "void" : "successful"} runs.`);
                }
            } else if (thingToAddTo === "f" || thingToAddTo === "fail" || thingToAddTo === "c" || thingToAddTo === "cult") {
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (!totalLog) {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has no logged runs.`);
                }
                let logNumber = await logsDB.findAll({where: {guildID: message.guild.id, userID: person.id, type: "cult"}});
                if (logNumber.length >= numberToAddOrRemove) {
                    for (let i = logNumber.length - 1; i >= logNumber.length - numberToAddOrRemove; i--) {
                        await logsDB.destroy({where: {guildID: message.guild.id, userID: person.id, time: logNumber[i].dataValues.time}});
                    }
                    await totalDB.update({numberofCult: totalLog.dataValues.numberofCult - numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                    if (serverType === "lh") {
                        message.channel.send(`You have now removed ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s cult runs.`);
                    } else {
                        message.channel.send(`You have now removed ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s failed runs.`);
                    }
                } else {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has ${logNumber.length} ${(serverType === "lh") ? "void" : "successful"} runs.`);
                }
            } else if (thingToAddTo === "ea" || thingToAddTo === "eventassist") {
                let totalLog = await totalDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (!totalLog) {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has no logged runs.`);
                }
                let logNumber = await logsDB.findAll({where: {guildID: message.guild.id, userID: person.id, type: "eventAssist"}});
                if (logNumber.length >= numberToAddOrRemove) {
                    for (let i = logNumber.length - 1; i >= logNumber.length - numberToAddOrRemove; i--) {
                        await logsDB.destroy({where: {guildID: message.guild.id, userID: person.id, time: logNumber[i].dataValues.time}});
                    }
                    await totalDB.update({numberOfEventAssists: totalLog.dataValues.numberOfEventAssists - numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                    await message.channel.send(`You have now removed ${numberToAddOrRemove} run${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s event assist runs.`);
                } else {
                    return message.channel.send(`You cannot remove that many runs because ${person} only has ${logNumber.length} ${(serverType === "lh") ? "void" : "successful"} runs.`);
                }
            } else if (thingToAddTo === "kp") {
                let logNumber = await client.models.get("kp").findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (!logNumber) {
                    return message.channel.send(`You cannot remove and key pops as ${person} does not have any.`);
                }
                if (logNumber.dataValues.numberOfRegular >= numberToAddOrRemove) {
                    await client.models.get("kp").update({numberOfRegular: logNumber.dataValues.numberOfRegular - numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                    if (serverType === "lh") {
                        message.channel.send(`You have now removed ${numberToAddOrRemove} pop${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s LH key pops.`);
                    } else {
                        message.channel.send(`You have now removed ${numberToAddOrRemove} pop${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s shatters key pops.`);
                    }
                } else {
                    return message.channel.send(`You cannot remove that many pops because ${person} only has ${logNumber.dataValues.numberOfRegular} ${(serverType === "lh") ? "LH" : "shatters"} key pops.`);
                }
            } else if (thingToAddTo === "ekp") {
                let logNumber = await client.models.get("kp").findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (!logNumber) {
                    return message.channel.send(`You cannot remove and key pops as ${person} does not have any.`);
                }
                if (logNumber.dataValues.numberOfEvent >= numberToAddOrRemove) {
                    await client.models.get("kp").update({numberOfEvent: logNumber.dataValues.numberOfEvent - numberToAddOrRemove}, {where: {guildID: message.guild.id, userID: person.id}});
                    await message.channel.send(`You have now removed ${numberToAddOrRemove} pop${(numberToAddOrRemove > 1) ? "s" : ""} from ${person}'s event key pops.`);
                } else {
                    return message.channel.send(`You cannot remove that many pops because ${person} only has ${logNumber.dataValues.numberOfEvent} ${(serverType === "lh") ? "LH" : "shatters"} key pops.`);
                }
            } else {
                return message.channel.send(`That is an invalid type of run to add/remove from.`);
            }
        } else {
            return message.channel.send(`please provide a valid operation: \`add\` or \`remove\`.`);
        }
        if (settings.currentweekSwitch) {
            let command = require("./help/currentweek");
            let embeds = await command(client, settings, guildMembers, "", message.guild.id);
            await message.guild.channels.get(settings.currentweekChannel).messages.fetch().then(async messages => {
                let myMessages = messages.filter(e => e.author.id === client.user.id).array();
                if (embeds.length === myMessages.length) {
                    let j = myMessages.length - 1;
                    for (let i = 0; i < myMessages.length; i++) {
                        await myMessages[i].edit(embeds[j]);
                        j--;
                    }
                } else {
                    messages.forEach(e => {
                        e.delete();
                    });
                    for (let i = 0; i < embeds.length; i++) {
                        await message.guild.channels.get(settings.currentweekChannel).send(embeds[i]);
                    }
                }
            });
        }
        if (thingToAddTo === "ekp" || thingToAddTo === "kp") {
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
    }
}