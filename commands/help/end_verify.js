const Discord = require('discord.js');

module.exports = async (client, guildID, message) => {
    let start_verify = await require("./start_verify");
    let isDone = false;
    let embed = message.embeds[0];
    let filters = (reaction, user) => reaction.emoji.name === "1⃣" || reaction.emoji.name === "2⃣" || reaction.emoji.name === "3⃣" || reaction.emoji.name === "4⃣" || reaction.emoji.name === "5⃣" || reaction.emoji.name === "↩";
    let verifyCollector = new Discord.ReactionCollector(message, filters);
    verifyCollector.on("collect", async (reaction, user) => {
        if (user.bot === false) {
            message.guild.members.fetch(user.id).then(async authors => {
                let endingPosition = embed.description.indexOf(">");
                let startingPosition;
                if (embed.description.startsWith("<@!")) {
                    startingPosition = embed.description.indexOf("!");
                } else {
                    startingPosition = embed.description.indexOf("@");
                }
                let id = embed.description.substring(startingPosition + 1, endingPosition);
                client.users.fetch(id).then(async person => {
                    if (reaction.emoji.name === "↩") {
                        verifyCollector.stop();
                        message.reactions.removeAll();
                        start_verify(client, guildID, message);
                    } else if (reaction.emoji.name === "1⃣") {
                        isDone = true;
                        person.send(`You are being denied because you are suspected to be a mule or alt account by the server ${client.guilds.get(guildID).name}. If you wish to appeal, contact ${user} (\`${authors.displayName}\` - ${user.tag}).`);
                        embed.setFooter(`Denied by ${authors.displayName} using 1`);
                        message.edit(embed);
                        let startingPosition1 = embed.author.name.lastIndexOf(":") + 1;
                        let endingPosition1 = embed.author.name.lastIndexOf("!");
                        let name = embed.author.name.substring(startingPosition1 + 1, endingPosition1);
                        await client.models.get("expelled").create({
                            guildID: guildID,
                            inGameName: name.toLowerCase()
                        });
                        await verifyCollector.stop();
                        let foundPending = await client.models.get("pending").findOne({where: {guildID: guildID, userID: id}});
                        if (foundPending) {
                            await client.models.get("pending").destroy({where: {guildID: guildID, userID: id}});
                        }
                        await setTimeout(async () => {
                            await message.reactions.removeAll();
                            await message.react("👋");
                        }, 1000);
                    } else if (reaction.emoji.name === "2⃣") {
                        isDone = true;
                        embed.setFooter(`Denied by ${authors.displayName} using 2`);
                        message.edit(embed);
                        person.send(`You are being denied because you are in a blacklisted guild by the server ${client.guilds.get(guildID).name}. If you wish to appeal, leave the guild and contact ${user} (\`${authors.displayName}\` - ${user.tag}).`);
                        verifyCollector.stop();
                        let foundPending = await client.models.get("pending").findOne({where: {guildID: guildID, userID: id}});
                        if (foundPending) {
                            await client.models.get("pending").destroy({where: {guildID: guildID, userID: id}});
                        }
                        await setTimeout(async () => {
                            await message.reactions.removeAll();
                            await message.react("👋");
                        }, 1000);
                    } else if (reaction.emoji.name === "3⃣") {
                        isDone = true;
                        embed.setFooter(`Denied by ${authors.displayName} using 3`);
                        message.edit(embed);
                        verifyCollector.stop();
                        person.send(`You are being denied because some of your realmeye information is private by the server ${client.guilds.get(guildID).name}. If you wish to verify, unprivate everything except your last known location and contact ${user} (\`${authors.displayName}\` - ${user.tag}).`);
                        let foundPending = await client.models.get("pending").findOne({where: {guildID: guildID, userID: id}});
                        if (foundPending) {
                            await client.models.get("pending").destroy({where: {guildID: guildID, userID: id}});
                        }
                        await setTimeout(async () => {
                            await message.reactions.removeAll();
                            await message.react("👋");
                        }, 1000);
                    } else if (reaction.emoji.name === "4⃣") {
                        isDone = true;
                        embed.setFooter(`Denied by ${authors.displayName} using 4`);
                        message.edit(embed);
                        let startingPosition1 = embed.author.name.lastIndexOf(":") + 1;
                        let endingPosition1 = embed.author.name.lastIndexOf("!");
                        let name = embed.author.name.substring(startingPosition1 + 1, endingPosition1);
                        await client.models.get("expelled").create({
                            guildID: guildID,
                            inGameName: name.toLowerCase()
                        });
                        verifyCollector.stop();
                        let foundPending = await client.models.get("pending").findOne({where: {guildID: guildID, userID: id}});
                        if (foundPending) {
                            await client.models.get("pending").destroy({where: {guildID: guildID, userID: id}});
                        }
                        await setTimeout(async () => {
                            await message.reactions.removeAll();
                            await message.react("👋");
                        }, 1000);
                    } else if (reaction.emoji.name === "5⃣") {
                        isDone = true;
                        embed.setFooter(`Denied by ${authors.displayName} using 5`);
                        message.edit(embed);
                        verifyCollector.stop();
                        let foundPending = await client.models.get("pending").findOne({where: {guildID: guildID, userID: id}});
                        if (foundPending) {
                            await client.models.get("pending").destroy({where: {guildID: guildID, userID: id}});
                        }
                        await setTimeout(async () => {
                            await message.reactions.removeAll();
                            await message.react("👋");
                        }, 1000);
                    }
                }).catch(async e => {
                    authors.send(`You cannot reject him using that as he has left the server. He will be denies using 5⃣`).catch(e => {
                        message.channel.send(`${authors} You cannot reject him using that as he has left the server. He will be denies using 5⃣`);
                    });
                    isDone = true;
                    embed.setFooter(`Denied by ${authors.displayName} using 5`);
                    message.edit(embed);
                    verifyCollector.stop();
                    let foundPending = await client.models.get("pending").findOne({where: {guildID: guildID, userID: id}});
                    if (foundPending) {
                        await client.models.get("pending").destroy({where: {guildID: guildID, userID: id}});
                    }
                    await setTimeout(async () => {
                        await message.reactions.removeAll();
                        await message.react("👋");
                    }, 1000);
                });
            });
        }
    });
    await message.react("1⃣").catch(e => {});
    if (isDone === false) {
        await message.react("2⃣").catch(e => {});
    }
    if (isDone === false) {
        await message.react("3⃣").catch(e => {});
    }
    if (isDone === false) {
        await message.react("4⃣").catch(e => {});
    }
    if (isDone === false) {
        await message.react("5⃣").catch(e => {});
    }
    if (isDone === false) {
        await message.react("↩").catch(e => {});
    }
}