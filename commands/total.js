const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Lists all the leads on the server by raid leaders.",
    use: `total`,
    cooldown: 1,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let total = await client.models.get("totallogs").findAll({where: {guildID: message.guild.id}});
        let embed = new Discord.MessageEmbed();
        embed.setColor(0x4ba3e7);
        embed.setTitle(`Your server's total runs!`);
        let totalVoids = 0;
        let totalCults = 0;
        let totalRuns = 0;
        let totalAssists = 0;
        let totalEvent = 0;
        let currentFieldNumber = -1;
        let totalEventAssist = 0;
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
            rlData1.void = logs.numberOfVoid;
            rlData1.cult = logs.numberofCult;
            rlData1.event = logs.numberOfEvent;
            rlData1.assist = logs.numberOfAssists;
            rlData1.eventAssist = logs.numberOfEventAssists;
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
        let server = await client.models.get("typeprofile").findOne({where: {guildID: message.guild.id}});
        const serverType = server.dataValues.type;
        for (let i = 0; i < newArray.length; i++) {
            let highestPerson = newArray[i];
            if (highestPerson) {
                let nicknameStuff = (highestPerson.id !== message.author.id) ? highestPerson.displayName : highestPerson;
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
                    message1 = `**[#${i + 1}]** ${(highestPerson.id !== message.author.id) ? `\`` : ""}${nicknameStuff}:${(highestPerson.id !== message.author.id) ? `\`` : ""}\nRaids: \`${(voidDB + cultDB)}\` ${(serverType === "lh") ? `(Void: \`${voidDB}\` | Cult: \`${cultDB}\`)` : `(Success: \`${voidDB}\` | Fail: \`${cultDB}\`)`} | Assisted Runs: \`${assistDB}\`${(serverType === "shatters") ? ` | Event: \`${eventDB}\` | Assisted Event: \`${eventAssistDB}\`` : ""}`;
                } else {
                    await client.models.get("totallogs").destroy({where: {guildID: message.guild.id, userID: highestPerson.id}});
                    message1 = `${nicknameStuff} hasn't completed or assisted a single run this week.`;
                }
                if (serverType === "lh") {
                    embed.setFooter(`Total Runs: ${totalRuns} (Void: ${totalVoids} | Cult: ${totalCults}) | Assisted Runs: ${totalAssists}${(serverType === "shatters") ? ` | Event Runs: ${totalEvent} | Event Assists: ${totalEventAssist}` : ""}`);
                } else {
                    embed.setFooter(`Total Runs: ${totalRuns} (Success: ${totalVoids} | Failed: ${totalCults}) | Assisted Runs: ${totalAssists}${(serverType === "shatters") ? ` | Event Runs: ${totalEvent} | Event Assists: ${totalEventAssist}` : ""}`);
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
                    await message.channel.send(embed);
                    embed = new Discord.MessageEmbed();
                    embed.setColor(0x4ba3e7);
                    embed.setTitle(`\u200B`);
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
        }
        await message.channel.send(embed);
    }
}