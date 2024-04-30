const Discord = require('discord.js');

module.exports = async (client, options) => {
    let guildsArray = await client.models.get("guild").findAll();
    for (let i = 0; i < guildsArray.length; i++) {
        let guildID = guildsArray[i].dataValues.guildID;
        if (guildsArray[i].dataValues.logsSwitch && (!options.single || guildID === options.guildID)) {
            let server = await client.models.get("typeprofile").findOne({where: {guildID: guildID}});
            const serverType = server.dataValues.type;
            let typeName = (client.emojisPortals.get(serverType)) ? client.emojisPortals.get(serverType).name.split("_").join(" ") : "Lost Halls";
            let guildMembers = await client.guilds.get(guildID).members.fetch();
            let settings = guildsArray[i].dataValues;
            let currentWeekDB = client.models.get("currentweeklogs");
            let currentWeek = await currentWeekDB.findAll();
            let currentWeekRolesDB = client.models.get("logsroles");
            let currentWeekRoles = await currentWeekRolesDB.findAll({where: {guildID: guildID}});
            let total = await client.models.get("totallogs").findAll();
            let rlRoles = [];
            for (let j = 0; j < currentWeekRoles.length; j++) {
                rlRoles.push(currentWeekRoles[j].dataValues.roleID);
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
                let weekly = await currentWeekDB.findOne({where: {guildID: guildID, userID: total[i].dataValues.userID}})
                if (weekly) {
                    let user = guildMembers.get(total[i].dataValues.userID);
                    if (!leaders.includes(user) && user) {
                        leaders.push(user);
                    }
                }
            }
            let embed = new Discord.MessageEmbed();
            await embed.setColor(4104266);
            await embed.setTitle(`This weeks total for logged runs!`);
            let totalVoids = 0;
            let totalCults = 0;
            let totalRuns = 0;
            let totalAssists = 0;
            let totalEvent = 0;
            let totalEventAssist = 0;
            let rlData = new Discord.Collection();
            for (let j = 0; j < leaders.length; j++) {
                let rlData1 = {};
                let voidDB = await currentWeek.filter(e => e.dataValues.userID === leaders[j].id && e.dataValues.guildID === guildID && e.dataValues.type === "void");
                let cultDB = await currentWeek.filter(e => e.dataValues.userID === leaders[j].id && e.dataValues.guildID === guildID && e.dataValues.type === "cult");
                let eventDB = await currentWeek.filter(e => e.dataValues.userID === leaders[j].id && e.dataValues.guildID === guildID && e.dataValues.type === "event");
                let assistDB = await currentWeek.filter(e => e.dataValues.userID === leaders[j].id && e.dataValues.guildID === guildID && e.dataValues.type === "assist");
                let eventAssistDB = await currentWeek.filter(e => e.dataValues.userID === leaders[j].id && e.dataValues.guildID === guildID && e.dataValues.type === "eventAssist");
                rlData1.void = voidDB.length;
                rlData1.cult = cultDB.length;
                rlData1.event = eventDB.length;
                rlData1.assist = assistDB.length;
                rlData1.eventAssist = eventAssistDB.length;
                rlData.set(leaders[j].id, rlData1);
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
            if (!options.ping) {
                client.options.disableEveryone = true;
            }
            let nextEmbed = false;
            for (let j = 0; j < newArray.length; j++) {
                let highestPerson = newArray[j];
                if (highestPerson) {
                    let nicknameStuff = highestPerson;
                    let allRuns = await currentWeek.filter(e => e.dataValues.userID === highestPerson.id && e.dataValues.guildID === guildID);
                    let voidDB = await currentWeek.filter(e => e.dataValues.userID === highestPerson.id && e.dataValues.guildID === guildID && e.dataValues.type === "void");
                    let cultDB = await currentWeek.filter(e => e.dataValues.userID === highestPerson.id && e.dataValues.guildID === guildID && e.dataValues.type === "cult");
                    let eventDB = await currentWeek.filter(e => e.dataValues.userID === highestPerson.id && e.dataValues.guildID === guildID && e.dataValues.type === "event");
                    let assistDB = await currentWeek.filter(e => e.dataValues.userID === highestPerson.id && e.dataValues.guildID === guildID && e.dataValues.type === "assist");
                    let eventAssistDB = await currentWeek.filter(e => e.dataValues.userID === highestPerson.id && e.dataValues.guildID === guildID && e.dataValues.type === "eventAssist");
                    totalVoids += voidDB.length;
                    totalCults += cultDB.length;
                    totalRuns += (voidDB.length + cultDB.length);
                    totalAssists += assistDB.length;
                    totalEvent += eventDB.length;
                    totalEventAssist += eventAssistDB.length;
                    let message1;
                    if (allRuns.length > 0) {
                        message1 = `**[#${j + 1}]** ${nicknameStuff}:\nRaids: \`${(voidDB.length + cultDB.length)}\` ${(serverType === "lh") ? `(Void: \`${voidDB.length}\`, Cult: \`${cultDB.length}\`)` : `(Success: \`${voidDB.length}\`, Fail: \`${cultDB.length}\`)`}, Assisted Runs: \`${assistDB.length}\`${(serverType === "shatters") ? `, Event: \`${eventDB.length}\`, Assisted Event: \`${eventAssistDB.length}\`` : ""}`;
                    } else {
                        message1 = `${nicknameStuff} hasn't completed or assisted a single run this week.`;
                    }
                    if (serverType === "lh") {
                        embed.setFooter(`Total Runs: ${totalRuns} (Void: ${totalVoids}, Cult: ${totalCults}); Assisted Runs: ${totalAssists}${(serverType === "shatters") ? `; Event Runs: ${totalEvent}; Event Assists: ${totalEventAssist}` : ""}`);
                    } else {
                        embed.setFooter(`Total Runs: ${totalRuns} (Success: ${totalVoids}, Failed: ${totalCults}); Assisted Runs: ${totalAssists}${(serverType === "shatters") ? `; Event Runs: ${totalEvent}; Event Assists: ${totalEventAssist}` : ""}`);
                    }
                    let embedLength = embed.length;
                    if (embedLength + message1.length <= 5998) {
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
                            await embed.setDescription(`${message1}`);
                        }
                    } else {
                        embed.setFooter("");
                        await client.guilds.get(guildID).channels.get(settings.endWeekChannel).send(`${(!nextEmbed) ? "@everyone This weeks final run counts have been totaled below!" : ""}`, embed);
                        nextEmbed = true;
                        embed = new Discord.MessageEmbed();
                        embed.setColor(4104266);
                        embed.setTitle(`\u200B`);
                        embed.setDescription(`${message1}`);
                        currentFieldNumber = -1;
                    }
                }
            }
            await client.guilds.get(guildID).channels.get(settings.endWeekChannel).send(`${(!nextEmbed) ? "@everyone This weeks final run counts have been totaled below!" : ""}`, embed);
            client.options.disableEveryone = false;
            await client.models.get("currentweeklogs").destroy({where: {guildID: guildID}});
            if (settings.currentweekSwitch) {
                let command = require("./currentweek");
                let embeds = await command(client, settings, guildMembers, "", guildID);
                await client.guilds.get(guildID).channels.get(settings.currentweekChannel).messages.fetch().then(async messages => {
                    messages = messages.filter(e => e.author.id === client.user.id);
                    if (embeds.length === messages.keyArray().length) {
                        let number = 0;
                        messages.forEach(async e => {
                            await e.edit(embeds[number]);
                            number++;
                        });
                    } else {
                        messages.forEach(async e => {
                            await e.delete();
                        });
                        for (let j = 0; j < embeds.length; j++) {
                            await client.guilds.get(guildID).channels.get(settings.currentweekChannel).send(embeds[j]);
                        }
                    }
                });
            }
        }
    }
}