const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Logs on the bot that a run has been completed.",
    use: "log [type] <number> <extra>",
    cooldown: 3,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["logsSendChannel"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let authorID = message.author.id;
        let author = guildMembers.get(authorID);
        let guildID = message.guild.id;
        let args = message.content.split(" ");
        let succOrFail = args[1];
        let currentWeekDB = client.models.get("currentweeklogs");
        let currentWeek = await currentWeekDB.findAll({where: {userID: authorID, guildID: guildID}});
        let totalDB = client.models.get("totallogs");
        let total = await totalDB.findOne({where: {userID: authorID, guildID: guildID}});
        let server = await client.models.get("typeprofile").findOne({where: {guildID: message.guild.id}});
        const serverType = server.dataValues.type;
        let typeName = (client.emojisPortals.get(serverType)) ? client.emojisPortals.get(serverType).name.split("_").join(" ") : "Lost Halls";
        if (!succOrFail) {
            return message.channel.send(`Please specify what type of run this was.`);
        } else {
            succOrFail = succOrFail.toLowerCase();
        }
        let extra = args.slice(2).join(" ");
        let embed = new Discord.MessageEmbed();
        embed.setAuthor(author.displayName, message.author.displayAvatarURL());
        embed.setTimestamp(new Date());
        let loNumber = args[2];
        let leNumber, runName;
        if (!loNumber) {
            leNumber = 1;
        } else if (!/^[0-9]*$/.test(loNumber)) {
            leNumber = 1;
        } else {
            leNumber = parseInt(loNumber);
        }
        if (serverType !== "lh") {
            if (succOrFail === "s" || succOrFail === "success") {
                runName = "successful";
                embed.setColor(35584);
                embed.setDescription(`**Type of run: \`SUCCESS\`**\n${extra}`);
            } else if (succOrFail === "f" || succOrFail === "fail") {
                runName = "failed";
                embed.setDescription(`**Type of run: \`FAIL\`**\n${extra}`);
                embed.setColor(16711680);
            } else if (succOrFail === "e" || succOrFail === "event") {
                runName = "event";
                embed.setDescription(`**Type of run: \`EVENT\`**\n${extra}`);
                embed.setColor(0x1f6e98);
            } else {
                return message.channel.send(`That is an invalid run outcome. Valid ones include \`success\`, \`fail\`, or \`event\`.`);
            }
        } else if (serverType === "lh") {
            if (succOrFail === "v" || succOrFail === "void") {
                runName = "void";
                embed.setDescription(`**Type of run: \`VOID\`**\n${extra}`);
                embed.setColor(0x000080);
            } else if (succOrFail === "c" || succOrFail === "cult") {
                runName = "cult";
                embed.setDescription(`**Type of run: \`CULT\`**\n${extra}`);
                embed.setColor(0xff0000);
            } else if (succOrFail === "e" || succOrFail === "event") {
                runName = "event";
                embed.setDescription(`**Type of run: \`EVENT\`**\n${extra}`);
                embed.setColor(0x1f6e98);
            } else {
                return message.channel.send(`That is an invalid run outcome. Valid ones include \`void\`, \`cult\`, or \`event\`.`);
            }
        }
        let object, object1, nameOfStuff;
        if (total) {
            if (runName === "event") {
                object = {
                    numberOfEvent: total.dataValues.numberOfEvent + leNumber
                }
                nameOfStuff = "event";
            } else if (runName === "successful" || runName === "void") {
                object = {
                    numberOfVoid: total.dataValues.numberOfVoid + leNumber
                }
                nameOfStuff = "void";
            } else if (runName === "failed" || runName === "cult") {
                object = {
                    numberofCult: total.dataValues.numberofCult + leNumber
                }
                nameOfStuff = "cult";
            }
        } else {
            if (runName === "event") {
                object1 = {
                    guildID: message.guild.id,
                    userID: authorID,
                    numberOfVoid: 0,
                    numberofCult: 0,
                    numberOfAssists: 0,
                    numberOfEvent: leNumber,
                    numberOfEventAssists: 0
                }
                nameOfStuff = "event";
            } else if (runName === "successful" || runName === "void") {
                object1 = {
                    guildID: message.guild.id,
                    userID: authorID,
                    numberOfVoid: leNumber,
                    numberofCult: 0,
                    numberOfAssists: 0,
                    numberOfEvent: 0,
                    numberOfEventAssists: 0
                }
                nameOfStuff = "void";
            } else if (runName === "failed" || runName === "cult") {
                object1 = {
                    guildID: message.guild.id,
                    userID: authorID,
                    numberOfVoid: 0,
                    numberofCult: leNumber,
                    numberOfAssists: 0,
                    numberOfEvent: 0,
                    numberOfEventAssists: 0
                }
                nameOfStuff = "cult";
            }
        }
        let memberArray = message.mentions.members.keyArray() || [];
        if (leNumber > 50 && runName !== "event") {
            return message.channel.send(`You cannot log more than 50 ${typeName} runs at once.`);
        }
        if (memberArray.length > 0 || leNumber > 1) {
            let messages = (leNumber > 1) ? `Are you sure you want to log ${leNumber} ${(runName === "event") ? runName : typeName} runs?` : "";
            if (memberArray.length > 0) {
                memberArray.sort((a, b) => {
                    if (guildMembers.get(a).displayName.toLowerCase() > guildMembers.get(b).displayName.toLowerCase()) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                let fetchedMemberArray = [];
                for (let i = 0; i < memberArray.length; i++) {
                    await fetchedMemberArray.push(guildMembers.get(memberArray[i]).displayName);
                }
                messages += ` Are you sure the following people helped you: \`${fetchedMemberArray.join("\`, \`")}\`?`;
            }
            message.channel.send(`${messages}`).then(msg => {
                guilds[guildID].answering = true;
                let filter = (messager) => messager.author.id === authorID || messager.author.id === "321726133307572235";
                let collector = new Discord.MessageCollector(msg.channel, filter, {time: 60000});
                let found = false;
                collector.on("collect", async (messages) => {
                    if (messages.author.bot === false) {
                        if (messages.content.toLowerCase() === `${settings.prefix}yes` || messages.content.toLowerCase() === "-yes" || messages.content.toLowerCase() === "yes" || messages.content.toLowerCase() === "y") {
                            found = true;
                            let aton = (leNumber > 1) ? "s" : "";
                            for (let i = 0; i < leNumber; i++) {
                                await currentWeekDB.create({
                                    guildID: message.guild.id,
                                    userID: authorID,
                                    type: nameOfStuff,
                                    extra: (extra) ? extra : null,
                                    time: Date.now()
                                });
                            }
                            if (object) {
                                await totalDB.update(object, {where: {guildID: guildID, userID: authorID}})
                            } else {
                                await totalDB.create(object1);
                            }
                            currentWeek = await currentWeekDB.findAll().filter(e => e.dataValues.userID === authorID && e.dataValues.guildID === guildID);
                            let voidsDB = await currentWeek.filter(e => e.dataValues.type === "void");
                            let voids = voidsDB.length;
                            let cultsDB = await currentWeek.filter(e => e.dataValues.type === "cult");
                            let cults = cultsDB.length;
                            let eventDB = await currentWeek.filter(e => e.dataValues.type === "event");
                            let event = eventDB.length;
                            let newmessage = `You have now logged ${leNumber} ${runName} run${aton}! You already have ${(runName === "event") ? event : voids + cults} ${(runName === "event") ? "event" : `${typeName}`} run${(runName === "event") ? (event > 1) ? "s" : "" : (voids + cults > 1) ? "s" : ""} this week, including this one.${(runName !== "event") ? ` (${(serverType === "lh") ? `Void: ${voids}, Cult: ${cults}` : `Success: ${voids}, Failed: ${cults}`})` : ""}`;
                            for (let i = 0; i < memberArray.length; i++) {
                                let hisID = memberArray[i];
                                total = await totalDB.findOne({where: {guildID: guildID, userID: hisID}});
                                for (let i = 0; i < leNumber; i++) {
                                    await currentWeekDB.create({
                                        guildID: message.guild.id,
                                        userID: hisID,
                                        type: (runName === "event") ? "eventAssist" : "assist",
                                        extra: (extra) ? extra : null,
                                        time: Date.now()
                                    });
                                }
                                let object2, object3;
                                if (total) {
                                    if (runName === "event") {
                                        object2 = {
                                            numberOfEventAssists: total.dataValues.numberOfEventAssists + leNumber
                                        }
                                    } else {
                                        object2 = {
                                            numberOfAssists: total.dataValues.numberOfAssists + leNumber
                                        }
                                    }
                                } else {
                                    if (runName === "event") {
                                        object3 = {
                                            guildID: message.guild.id,
                                            userID: hisID,
                                            numberOfVoid: 0,
                                            numberofCult: 0,
                                            numberOfAssists: 0,
                                            numberOfEvent: 0,
                                            numberOfEventAssists: leNumber
                                        }
                                    } else {
                                        object3 = {
                                            guildID: message.guild.id,
                                            userID: hisID,
                                            numberOfVoid: 0,
                                            numberofCult: 0,
                                            numberOfAssists: leNumber,
                                            numberOfEvent: 0,
                                            numberOfEventAssists: 0
                                        }
                                    }
                                }
                                if (total) {
                                    await totalDB.update(object2, {where: {guildID: guildID, userID: hisID}})
                                } else {
                                    await totalDB.create(object3);
                                }
                                currentWeek = await currentWeekDB.findAll().filter(e => e.dataValues.userID === hisID && e.dataValues.guildID === guildID);
                                let person = guildMembers.get(hisID);
                                let assistDB = await currentWeek.filter(e => e.dataValues.type === "assist");
                                let assist = assistDB.length;
                                let eventAssistDB = await currentWeek.filter(e => e.dataValues.type === "eventAssist");
                                let eventAssist = eventAssistDB.length;
                                newmessage += `\n\`${person.displayName}\`, you have now logged ${leNumber} assisted run${aton}! You have ${(runName === "event") ? eventAssist : assist} assisted${(runName === "event") ? " event" : ""} run${(runName === "event") ? `${(eventAssist > 1) ? "s" : ""}` : `${(assist > 1) ? "s" : ""}`} this week, including ${(leNumber > 1) ? "these ones" : "this one"}.`;
                            }
                            await message.channel.send(newmessage);
                            await message.guild.channels.get(settings.logsSendChannel).send(embed);
                            collector.stop();
                        } else if (messages.content.toLowerCase() === `${settings.prefix}no` || messages.content.toLowerCase() === "-no" || messages.content.toLowerCase() === "no" || messages.content.toLowerCase() === "n") {
                            found = true;
                            await message.channel.send(`The command is now aborted.`);
                            collector.stop();
                        } else {
                            message.channel.send(`That is an invalid response. Please respong with either \`yes\` or \`no\`.`);
                        }
                    }
                });
                collector.on("end", async (collected) => {
                    guilds[guildID].answering = false;
                    if (found === false) {
                        message.channel.send(`No response was given. The command is now aborted as a result.`);
                    } else {
                        if (settings.currentweekSwitch) {
                            let command = require("./help/currentweek");
                            let embeds = await command(client, settings, guildMembers, "", message.guild.id);
                            message.guild.channels.get(settings.currentweekChannel).messages.fetch().then(async messages => {
                                let myMessages = messages.filter(e => e.author.id === client.user.id).array();
                                if (embeds.length === myMessages.length) {
                                    let j = myMessages.length - 1;
                                    for (let i = 0; i < myMessages.length; i++) {
                                        myMessages[i].edit(embeds[j]);
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
                    }
                });
            });
        } else {
            await currentWeekDB.create({
                guildID: message.guild.id,
                userID: authorID,
                type: nameOfStuff,
                extra: (extra) ? extra : null,
                time: Date.now()
            });
            if (object) {
                await totalDB.update(object, {where: {userID: authorID}})
            } else {
                await totalDB.create(object1);
            }
            if (currentWeek) {
                currentWeek = await currentWeekDB.findAll({where: {userID: authorID, guildID: guildID}});
                let voidsDB = await currentWeek.filter(e => e.dataValues.type === "void");
                let voids = voidsDB.length;
                let cultsDB = await currentWeek.filter(e => e.dataValues.type === "cult");
                let cults = cultsDB.length;
                let eventDB = await currentWeek.filter(e => e.dataValues.type === "event");
                let event = eventDB.length;
                await message.channel.send(`You have now logged 1 ${runName} run! You already have ${(runName === "event") ? event : voids + cults} ${(runName === "event") ? "event" : `${typeName}`} run${(runName === "event") ? (event > 1) ? "s" : "" : (voids + cults > 1) ? "s" : ""} this week, including this one.${(runName !== "event") ? ` (${(serverType === "lh") ? `Void: ${voids}, Cult: ${cults}` : `Success: ${voids}, Failed: ${cults}`})` : ""}`);
            } else {
                await message.channel.send(`You have now logged 1 ${runName} run! This is your first ${(runName === "event") ? "event" : `${typeName}`} run of the week!`);
            }
            await message.guild.channels.get(settings.logsSendChannel).send(embed);
            if (settings.currentweekSwitch) {
                let command = require("./help/currentweek");
                let embeds = await command(client, settings, guildMembers, "", message.guild.id);
                message.guild.channels.get(settings.currentweekChannel).messages.fetch().then(async messages => {
                    let myMessages = messages.filter(e => e.author.id === client.user.id).array();
                    if (embeds.length === myMessages.length) {
                        let j = myMessages.length - 1;
                        for (let i = 0; i < myMessages.length; i++) {
                            myMessages[i].edit(embeds[j]);
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
        }
    }
}