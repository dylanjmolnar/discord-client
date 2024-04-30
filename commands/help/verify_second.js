const Discord = require('discord.js');

module.exports = async (client, guildID, message) => {
    let settingsss = await client.models.get("guild").findOne({where: {guildID: guildID}});
    let settings = settingsss.dataValues;
    let start_verify = require("./start_verify");
    let end_verify = require("./end_verify");
    let isDone = false;
    let filters = (reaction, user) => reaction.emoji.name === "🔒" || reaction.emoji.name === "✅" || reaction.emoji.name === "❌";
    let verifyCollector = new Discord.ReactionCollector(message, filters);
    verifyCollector.on("collect", async (reaction, user) => {
        if (user.bot === false) {
            if (reaction.emoji.name === "🔒") {
                verifyCollector.stop();
                start_verify(client, guildID, message);
            } else if (reaction.emoji.name === "✅") {
                isDone = true;
                message.guild.members.fetch(user.id).then(async authors => {
                    let embed = message.embeds[0];
                    let endingPosition = embed.description.indexOf(">");
                    let startingPosition;
                    if (embed.description.startsWith("<@!")) {
                        startingPosition = embed.description.indexOf("!");
                    } else {
                        startingPosition = embed.description.indexOf("@");
                    }
                    let id = embed.description.substring(startingPosition + 1, endingPosition);
                    message.guild.members.fetch(id).then(async person => {
                        let startingPosition1 = embed.author.name.lastIndexOf(":") + 1;
                        let endingPosition1 = embed.author.name.lastIndexOf("!");
                        let name = embed.author.name.substring(startingPosition1 + 1, endingPosition1);
                        person.send("You are now verified!");
                        if (person.user.username === name) {
                            if (person.user.username.toLowerCase() === name) {
                                await person.setNickname(name.toUpperCase());
                            } else {
                                await person.setNickname(name.toLowerCase());
                            }
                        } else {
                            await person.setNickname(name);
                        }
                        await person.roles.add(settings.raiderRole);
                        embed.setFooter(`Accepted by ${authors.displayName}`);
                        message.edit(embed);
                        verifyCollector.stop();
                        let foundPending = await client.models.get("pending").findOne({where: {guildID: guildID, userID: id}});
                        if (foundPending) {
                            await client.models.get("pending").destroy({where: {guildID: guildID, userID: id}});
                        }
                        await setTimeout(async () => {
                            await message.reactions.removeAll();
                            await message.react("💯");
                        }, 1000);
                    }).catch(async e => {
                        authors.send(`You cannot accept him as he has left the server. He will be auto-expelled using 5⃣`).catch(e => {
                            message.channel.send(`${authors} You cannot accept him as he has left the server. He will be auto-expelled using 5⃣`).then(msg => {
                                msg.delete(5000);
                            });
                        });
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
            } else if (reaction.emoji.name === "❌") {
                isDone = true;
                verifyCollector.stop();
                await setTimeout(async () => {
                    await message.reactions.removeAll();
                    await end_verify(client, guildID, message);
                }, 1000);
            }
        }
    })
    await message.react("✅").catch(e => {});
    if (isDone === false) {
        await message.react("❌").catch(e => {});
    }
    if (isDone === false) {
        await message.react("🔒").catch(e => {});
    }
}