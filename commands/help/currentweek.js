const Discord = require('discord.js');

module.exports = async (client, settings, guildMembers, authorID, guildID) => {
    let currentWeekDB = client.models.get("currentweeklogs");
    let currentWeek = await currentWeekDB.findAll();
    let currentWeekRolesDB = client.models.get("logsroles");
    let currentWeekRoles = await currentWeekRolesDB.findAll({where: {guildID: guildID}});
    let total = await client.models.get("totallogs").findAll();
    let server = await client.models.get("typeprofile").findOne({where: {guildID: guildID}});
    const serverType = server.dataValues.type;
    let rlRoles = [];
    for (let i = 0; i < currentWeekRoles.length; i++) {
        rlRoles.push(currentWeekRoles[i].dataValues.roleID);
    }
    let leaders = guildMembers.filter(e => {
        if (e.user.bot) {
            return false;
        }
        let userRoles = e.roles.keyArray();
        for (let i = 0; i < userRoles.length; i++) {
            if (rlRoles.includes(userRoles[i])) {
                return true;
            }
        }
        return false;
    }).array();
    for (let i = 0; i < total.length; i++) {
        let weekly = await currentWeekDB.findOne({where: {guildID: guildID, userID: total[i].dataValues.userID}});
        if (weekly) {
            let user = guildMembers.get(total[i].dataValues.userID);
            if (!leaders.includes(user) && user) {
                leaders.push(user);
            }
        }
    }
    let embed = new Discord.MessageEmbed();
    embed.setColor(4104266);
    embed.setTitle(`This weeks current logged runs!`);
    let totalVoids = 0;
    let totalCults = 0;
    let totalRuns = 0;
    let totalAssists = 0;
    let totalEvent = 0;
    let totalEventAssist = 0;
    let rlData = new Discord.Collection();
    for (let i = 0; i < leaders.length; i++) {
        let rlData1 = {};
        let voidDB = currentWeek.filter(e => e.dataValues.userID === leaders[i].id && e.dataValues.guildID === guildID && e.dataValues.type === "void");
        let cultDB = currentWeek.filter(e => e.dataValues.userID === leaders[i].id && e.dataValues.guildID === guildID && e.dataValues.type === "cult");
        let eventDB = currentWeek.filter(e => e.dataValues.userID === leaders[i].id && e.dataValues.guildID === guildID && e.dataValues.type === "event");
        let assistDB = currentWeek.filter(e => e.dataValues.userID === leaders[i].id && e.dataValues.guildID === guildID && e.dataValues.type === "assist");
        let eventAssistDB = currentWeek.filter(e => e.dataValues.userID === leaders[i].id && e.dataValues.guildID === guildID && e.dataValues.type === "eventAssist");
        rlData1.void = voidDB.length;
        rlData1.cult = cultDB.length;
        rlData1.event = eventDB.length;
        rlData1.assist = assistDB.length;
        rlData1.eventAssist = eventAssistDB.length;
        rlData.set(leaders[i].id, rlData1);
    }
    let newArray = leaders.sort((a, b) => {
        if (((rlData.get(b.id).void + rlData.get(b.id).cult) - (rlData.get(a.id).void + rlData.get(a.id).cult)) !== 0) {
            return (rlData.get(b.id).void + rlData.get(b.id).cult) - (rlData.get(a.id).void + rlData.get(a.id).cult);
        } else if ((rlData.get(b.id).void - rlData.get(a.id).void) !== 0) {
            return rlData.get(b.id).void - rlData.get(a.id).void;
        } else if ((rlData.get(b.id).cult - rlData.get(a.id).cult) !== 0) {
            return rlData.get(b.id).cult - rlData.get(a.id).cult;
        } else if ((rlData.get(b.id).event - rlData.get(a.id).event) !== 0) {
            return rlData.get(b.id).event - rlData.get(a.id).event;
        } else if ((rlData.get(b.id).assist - rlData.get(a.id).assist) !== 0) {
            return rlData.get(b.id).assist - rlData.get(a.id).assist;
        } else if ((rlData.get(b.id).eventAssist - rlData.get(a.id).eventAssist) !== 0) {
            return rlData.get(b.id).eventAssist - rlData.get(a.id).eventAssist;
        }
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
            return 1;
        } else {
            return -1;
        }
    });
    let currentFieldNumber = -1;
    let embeds = [];
    for (let i = 0; i < newArray.length; i++) {
        let highestPerson = newArray[i];
        if (highestPerson) {
            let nicknameStuff = (highestPerson.id !== authorID) ? highestPerson.displayName : highestPerson;
            let voidDB = rlData.get(newArray[i].id).void;
            let cultDB = rlData.get(newArray[i].id).cult;
            let eventDB = rlData.get(newArray[i].id).event;
            let assistDB = rlData.get(newArray[i].id).assist;
            let eventAssistDB = rlData.get(newArray[i].id).eventAssist;
            let allRuns = voidDB + cultDB + eventDB + assistDB + eventAssistDB;
            totalVoids += voidDB;
            totalCults += cultDB;
            totalRuns += (voidDB + cultDB);
            totalAssists += assistDB;
            totalEvent += eventDB;
            totalEventAssist += eventAssistDB;
            let message1;
            if (allRuns > 0) {
                message1 = `**[#${i + 1}]** ${(highestPerson.id !== authorID) ? `\`` : ""}${nicknameStuff}${(highestPerson.id !== authorID) ? `\`` : ""}:\nRaids: \`${(voidDB + cultDB)}\` ${(serverType === "lh") ? `(Void: \`${voidDB}\`, Cult: \`${cultDB}\`)` : `(Success: \`${voidDB}\`, Fail: \`${cultDB}\`)`}, Assisted Runs: \`${assistDB}\`${(settings.typeOfServer === "shatters") ? `, Event: \`${eventDB}\`, Assisted Event: \`${eventAssistDB}\`` : ""}`;
            } else {
                message1 = `${nicknameStuff} hasn't completed or assisted a single run this week.`;
            }
            let embedLength = embed.length;
            if (embedLength + message1.length <= 5994) {
                if (embed.description) {
                    if (embed.description.length + message1.length < 2046 && currentFieldNumber === -1) {
                        embed.setDescription(`${embed.description}\n${message1}`);
                    } else {
                        if (embed.fields.length === 0) {
                            embed.addField(`\u200B`, `${message1}`);
                            currentFieldNumber++;
                        } else {
                            if (embed.fields[currentFieldNumber].value.length + message1.length < 1022) {
                                embed.fields[currentFieldNumber].value += `\n${message1}`;
                            } else {
                                currentFieldNumber++;
                                embed.addField(`\u200B`, `${message1}`);
                            }
                        }
                    }
                } else {
                    embed.setDescription(`${message1}`);
                }
            } else {
                embed.setFooter("");
                embeds.push(embed);
                embed = new Discord.MessageEmbed();
                embed.setColor(4104266);
                embed.setTitle(`\u200B`);
                embed.setDescription(`${message1}`);
                currentFieldNumber = -1;
            }
        }
        if (settings.typeOfServer === "lh") {
            embed.setFooter(`Total Runs: ${totalRuns} (Void: ${totalVoids}, Cult: ${totalCults}); Assisted Runs: ${totalAssists}${(serverType === "shatters") ? `; Event Runs: ${totalEvent}; Event Assists: ${totalEventAssist}` : ""}`);
        } else {
            embed.setFooter(`Total Runs: ${totalRuns} (Success: ${totalVoids}, Failed: ${totalCults}); Assisted Runs: ${totalAssists}${(serverType === "shatters") ? `; Event Runs: ${totalEvent}; Event Assists: ${totalEventAssist}` : ""}`);
        }
    }
    embeds.push(embed);
    return embeds;
}
