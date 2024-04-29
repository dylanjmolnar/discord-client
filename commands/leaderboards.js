const Discord = require('discord.js');

module.exports = {
    aliases: ["lb", "leaderboard"],
    description: "Sends options for this servers leaderboards.",
    use: "leaderboards",
    cooldown: 1,
    type: "misc",
    dms: true,
    public: true,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let author = guildMembers.get(message.author.id);
        if (message.member) {
            await message.react("✅").catch(e => {});
        } else {
            author.user.createDM().then(dmChannel => {
                dmChannel.messages.fetch(message.id).then(async mess => {
                    mess.react("✅").catch(e => {});
                }).catch(e => {});
            });
        }
        let server = await client.models.get("typeprofile").findOne({where: {guildID: message.guild.id}});
        const serverType = server.dataValues.type;
        let embeds = new Discord.MessageEmbed();
        embeds.setTitle(`Choose which leaderboard to look at!`);
        embeds.setDescription(`1⃣ Runs Led
        2⃣ Runs Completed
        3⃣ Key Pops${(serverType === "lh") ? `\n4⃣ Vials Used\n5⃣ Solo Cults` : ""}`);
        await author.send(embeds).then(async msg => {
            let filter = (reaction, userar) => true;
            let collector = new Discord.ReactionCollector(msg, filter, {time: 60000});
            collector.on("collect", async (reaction, useras) => {
                if (!reaction.users.last().bot) {
                    if (reaction.emoji.name === "1⃣") {
                        collector.stop();
                        let total = await client.models.get("totallogs").findAll({where: {guildID: message.guild.id}});
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle(`Your server's top leaders!`);
                        let currentFieldNumber = -1;
                        let leaders = [];
                        for (let i = 0; i < total.length; i++) {
                            let user = guildMembers.get(total[i].dataValues.userID);
                            if (user) {
                                leaders.push(user);
                            }
                        }
                        let rlData = new Discord.Collection();
                        for (let i = 0; i < leaders.length; i++) {
                            let rlData1 = {};
                            let logs = total.find(e => e.dataValues.userID === leaders[i].id);
                            rlData1.void = logs.dataValues.numberOfVoid;
                            rlData1.cult = logs.dataValues.numberofCult;
                            rlData1.event = logs.dataValues.numberOfEvent;
                            rlData1.assist = logs.dataValues.numberOfAssists;
                            rlData1.eventAssist = logs.dataValues.numberOfEventAssists;
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
                        let number23 = (newArray.length > 25) ? 25 : newArray.length;
                        for (let i = 0; i < number23; i++) {
                            let highestPerson = newArray[i];
                            if (highestPerson) {
                                let nicknameStuff = (highestPerson.id !== message.author.id) ? highestPerson.displayName : highestPerson;
                                let voidDB = rlData.get(newArray[i].id).void;
                                let cultDB = rlData.get(newArray[i].id).cult;
                                let eventDB = rlData.get(newArray[i].id).event;
                                let assistDB = rlData.get(newArray[i].id).assist;
                                let eventAssistDB = rlData.get(newArray[i].id).eventAssist;
                                let allRuns = voidDB + cultDB + eventDB + assistDB + eventAssistDB;
                                let message1;
                                if (allRuns > 0) {
                                    message1 = `**[#${i + 1}]** ${(highestPerson.id !== message.author.id) ? `\`` : ""}${nicknameStuff}:${(highestPerson.id !== message.author.id) ? `\`` : ""}\nRaids: \`${(voidDB + cultDB)}\` ${(serverType === "lh") ? `(Void: \`${voidDB}\` | Cult: \`${cultDB}\`)` : `(Success: \`${voidDB}\` | Fail: \`${cultDB}\`)`} | Assisted Runs: \`${assistDB}\`${(serverType === "shatters") ? ` | Event: \`${eventDB}\` | Assisted Event: \`${eventAssistDB}\`` : ""}`;
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
                                        embed.setDescription(`${message1}`);
                                    }
                                } else {
                                    embed.setFooter("");
                                    await message.author.send(embed).catch(e => {});
                                    embed = new Discord.MessageEmbed();
                                    embed.setColor(0x4ba3e7);
                                    embed.setTitle(`\u200B`);
                                    embed.setDescription(`${message1}`);
                                    currentFieldNumber = -1;
                                }
                            }
                        }
                        await message.author.send(embed).catch(e => {});
                    } else if (reaction.emoji.name === "2⃣") {
                        collector.stop();
                        let total = await client.models.get("completedruns").findAll({where: {guildID: message.guild.id}});
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle(`Your server's top raiders!`);
                        let currentFieldNumber = -1;
                        let leaders = [];
                        for (let i = 0; i < total.length; i++) {
                            let user = guildMembers.get(total[i].dataValues.userID);
                            if (user) {
                                leaders.push(user);
                            }
                        }
                        let rlData = new Discord.Collection();
                        for (let i = 0; i < leaders.length; i++) {
                            let rlData1 = {};
                            let logs = total.find(e => e.dataValues.userID === leaders[i].id);
                            rlData1.void = logs.dataValues.runType1;
                            rlData1.cult = logs.dataValues.runType2;
                            rlData1.event = logs.dataValues.runType3;
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
                            }
                            if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                        let number23 = (newArray.length > 25) ? 25 : newArray.length;
                        for (let i = 0; i < number23; i++) {
                            let highestPerson = newArray[i];
                            if (highestPerson) {
                                let nicknameStuff = (highestPerson.id !== message.author.id) ? highestPerson.displayName : highestPerson;
                                let voidDB = rlData.get(newArray[i].id).void;
                                let cultDB = rlData.get(newArray[i].id).cult;
                                let eventDB = rlData.get(newArray[i].id).event;
                                let allRuns = voidDB + cultDB + eventDB;
                                let message1;
                                if (allRuns > 0) {
                                    message1 = `**[#${i + 1}]** ${(highestPerson.id !== message.author.id) ? `\`` : ""}${nicknameStuff}:${(highestPerson.id !== message.author.id) ? `\`` : ""}\nRaids: \`${(voidDB + cultDB)}\` ${(serverType === "lh") ? `(Void: \`${voidDB}\` | Cult: \`${cultDB}\`)` : `(Success: \`${voidDB}\` | Fail: \`${cultDB}\`)`} | Event: \`${eventDB}\``;
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
                                        embed.setDescription(`${message1}`);
                                    }
                                } else {
                                    embed.setFooter("");
                                    await message.author.send(embed).catch(e => {});
                                    embed = new Discord.MessageEmbed();
                                    embed.setColor(0x4ba3e7);
                                    embed.setTitle(`\u200B`);
                                    embed.setDescription(`${message1}`);
                                    currentFieldNumber = -1;
                                }
                            }
                        }
                        await message.author.send(embed).catch(e => {});
                    } else if (reaction.emoji.name === "3⃣") {
                        collector.stop();
                        let total = await client.models.get("kp").findAll({where: {guildID: message.guild.id}});
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle(`Your server's top key poppers!`);
                        let currentFieldNumber = -1;
                        let leaders = [];
                        for (let i = 0; i < total.length; i++) {
                            let user = guildMembers.get(total[i].dataValues.userID);
                            if (user) {
                                leaders.push(user);
                            }
                        }
                        let rlData = new Discord.Collection();
                        for (let i = 0; i < leaders.length; i++) {
                            let rlData1 = {};
                            let logs = total.find(e => e.dataValues.userID === leaders[i].id);
                            rlData1.void = logs.dataValues.numberOfRegular;
                            rlData1.cult = logs.dataValues.numberOfEvent;
                            rlData.set(leaders[i].id, rlData1);
                        }
                        let newArray = leaders.sort((a, b) => {
                            if ((rlData.get(b.id).void - rlData.get(a.id).void) !== 0) {
                                return rlData.get(b.id).void - rlData.get(a.id).void;
                            } else if ((rlData.get(b.id).cult - rlData.get(a.id).cult) !== 0) {
                                return rlData.get(b.id).cult - rlData.get(a.id).cult;
                            }
                            if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                        let number23 = (newArray.length > 25) ? 25 : newArray.length;
                        let typeName = (client.emojisPortals.get(serverType)) ? client.emojisPortals.get(serverType).name.split("_").join(" ") : "Lost Halls";
                        for (let i = 0; i < number23; i++) {
                            let highestPerson = newArray[i];
                            if (highestPerson) {
                                let nicknameStuff = (highestPerson.id !== message.author.id) ? highestPerson.displayName : highestPerson;
                                let voidDB = rlData.get(newArray[i].id).void;
                                let cultDB = rlData.get(newArray[i].id).cult;
                                let message1 = `**[#${i + 1}]** ${(highestPerson.id !== message.author.id) ? `\`` : ""}${nicknameStuff}:${(highestPerson.id !== message.author.id) ? `\`` : ""} ${(serverType === "lh") ? `Lost Halls: \`${voidDB}\`` : `${typeName}: \`${voidDB}\``} | Event: \`${cultDB}\``;
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
                                        embed.setDescription(`${message1}`);
                                    }
                                } else {
                                    await message.author.send(embed).catch(e => {});
                                    embed = new Discord.MessageEmbed();
                                    embed.setColor(0x4ba3e7);
                                    embed.setTitle(`\u200B`);
                                    embed.setDescription(`${message1}`);
                                    currentFieldNumber = -1;
                                }
                            }
                        }
                        await message.author.send(embed).catch(e => {});
                    } else if (reaction.emoji.name === "4⃣" && serverType === "lh") {
                        collector.stop();
                        let total = await client.models.get("vials").findAll({where: {guildID: message.guild.id}});
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle(`Your server's top vail poppers!`);
                        let currentFieldNumber = -1;
                        let leaders = [];
                        for (let i = 0; i < total.length; i++) {
                            let user = guildMembers.get(total[i].dataValues.userID);
                            if (user) {
                                leaders.push(user);
                            }
                        }
                        let rlData = new Discord.Collection();
                        for (let i = 0; i < leaders.length; i++) {
                            let rlData1 = {};
                            let logs = total.find(e => e.dataValues.userID === leaders[i].id);
                            rlData1.void = logs.dataValues.numberOfVialsUsed;
                            rlData1.cult = logs.dataValues.numberOfVials;
                            rlData.set(leaders[i].id, rlData1);
                        }
                        let newArray = leaders.sort((a, b) => {
                            if ((rlData.get(b.id).void - rlData.get(a.id).void) !== 0) {
                                return rlData.get(b.id).void - rlData.get(a.id).void;
                            } else if ((rlData.get(b.id).cult - rlData.get(a.id).cult) !== 0) {
                                return rlData.get(b.id).cult - rlData.get(a.id).cult;
                            }
                            if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                        let number23 = (newArray.length > 25) ? 25 : newArray.length;
                        for (let i = 0; i < number23; i++) {
                            let highestPerson = newArray[i];
                            if (highestPerson) {
                                let nicknameStuff = (highestPerson.id !== message.author.id) ? highestPerson.displayName : highestPerson;
                                let voidDB = rlData.get(newArray[i].id).void;
                                let cultDB = rlData.get(newArray[i].id).cult;
                                let message1 = `**[#${i + 1}]** ${(highestPerson.id !== message.author.id) ? `\`` : ""}${nicknameStuff}:${(highestPerson.id !== message.author.id) ? `\`` : ""} Vials Used: \`${(voidDB)}\` Vials Stored: \`${cultDB}\``;
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
                                        embed.setDescription(`${message1}`);
                                    }
                                } else {
                                    await message.author.send(embed).catch(e => {});
                                    embed = new Discord.MessageEmbed();
                                    embed.setColor(0x4ba3e7);
                                    embed.setTitle(`\u200B`);
                                    embed.setDescription(`${message1}`);
                                    currentFieldNumber = -1;
                                }
                            }
                        }
                        await message.author.send(embed).catch(e => {});
                    } else if (reaction.emoji.name === "5⃣" && serverType === "lh") {
                        collector.stop();
                        let total = await client.models.get("solocults").findAll({where: {guildID: message.guild.id}});
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle(`Your server's top solo cult runners!`);
                        let currentFieldNumber = -1;
                        let leaders = [];
                        for (let i = 0; i < total.length; i++) {
                            let user = guildMembers.get(total[i].dataValues.userID);
                            if (user) {
                                leaders.push(user);
                            }
                        }
                        let rlData = new Discord.Collection();
                        for (let i = 0; i < leaders.length; i++) {
                            let rlData1 = {};
                            let logs = total.find(e => e.dataValues.userID === leaders[i].id);
                            rlData1.void = logs.dataValues.numberOfRuns;
                            rlData.set(leaders[i].id, rlData1);
                        }
                        let newArray = leaders.sort((a, b) => {
                            if ((rlData.get(b.id).void - rlData.get(a.id).void) !== 0) {
                                return rlData.get(b.id).void - rlData.get(a.id).void;
                            }
                            if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                        let number23 = (newArray.length > 25) ? 25 : newArray.length;
                        for (let i = 0; i < number23; i++) {
                            let highestPerson = newArray[i];
                            if (highestPerson) {
                                let nicknameStuff = (highestPerson.id !== message.author.id) ? highestPerson.displayName : highestPerson;
                                let voidDB = rlData.get(newArray[i].id).void;
                                let message1 = `**[#${i + 1}]** ${(highestPerson.id !== message.author.id) ? `\`` : ""}${nicknameStuff}:${(highestPerson.id !== message.author.id) ? `\`` : ""} Solo Cults: \`${(voidDB)}\``;
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
                                        embed.setDescription(`${message1}`);
                                    }
                                } else {
                                    await message.author.send(embed).catch(e => {});
                                    embed = new Discord.MessageEmbed();
                                    embed.setColor(0x4ba3e7);
                                    embed.setTitle(`\u200B`);
                                    embed.setDescription(`${message1}`);
                                    currentFieldNumber = -1;
                                }
                            }
                        }
                        await message.author.send(embed).catch(e => {});
                    }
                }
            });
            await msg.react(`1⃣`).catch(e => {});
            await msg.react(`2⃣`).catch(e => {});
            await msg.react(`3⃣`).catch(e => {});
            if (serverType === "lh") {
                await msg.react(`4⃣`).catch(e => {});
                await msg.react(`5⃣`).catch(e => {});
            }
            
        }).catch(e => {});
    }
}