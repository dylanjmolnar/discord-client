const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Lists all mutes on the server logged by the bot.",
    use: "mutes <user>",
    cooldown: 2,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let userToFind = args[1];
        if (userToFind) {
            let command = require("./help/member");
            let person = await command(guildMembers, userToFind, settings);
            let muteCase;
            if (!person) {
                muteCase = await client.models.get("mutes").findOne({where: {guildID: message.guild.id, userID: (userToFind || "")}});
                if (!muteCase) {
                    return message.channel.send(`Please provide a valid user to find mutes for.`);
                }
            }
            if (!muteCase) {
                muteCase = await client.models.get("mutes").findOne({where: {guildID: message.guild.id, userID: person.user.id}});
            }
            if (muteCase) {
                let timeCommand = require("./help/time");
                let timeLeft = (muteCase.dataValues.time) ? await timeCommand(muteCase.dataValues.time - Date.now()) : "No Unmute Time";
                let embed = new Discord.MessageEmbed();
                embed.setDescription(`__Mute case for ${person || `<@${userToFind}> (Left Server)`}__
                Time Left: ${timeLeft}
                Reason: ${muteCase.dataValues.reason || "None"}`);
                message.channel.send(embed).catch(e => {});
            } else {
                message.channel.send(`${person} (${person.displayName}) is not muted already.`);
            }
        } else {
            let mutes = await client.models.get("mutes").findAll({where: {guildID: message.guild.id}});
            let embed = new Discord.MessageEmbed();
            let currentFieldNumber = -1;
            embed.setTitle(`These are the muted people for your server!`);
            for (i = 0; i < mutes.length; i++) {
                let message1;
                if (mutes[i].dataValues.time) {
                    let time = mutes[i].dataValues.time - Date.now();
                    let command = require(`./help/time`);
                    let timeR = await command(time);
                    if (guildMembers.get(mutes[i].dataValues.userID)) {
                        message1 = `${guildMembers.get(mutes[i].dataValues.userID)} (Time: ${timeR})`;
                    } else {
                        message1 = `<@${mutes[i].dataValues.userID}> (Time: ${timeR}) (Left Server)`;
                    }
                } else {
                    if (guildMembers.get(mutes[i].dataValues.userID)) {
                        message1 = `${guildMembers.get(mutes[i].dataValues.userID)} (Time: Infinite)`;
                    } else {
                        message1 = `<@${mutes[i].dataValues.userID}> (Time: Infinite) (Left Server)`;
                    }
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
                    message.channel.send(embed).catch(e => {});
                    embed = new Discord.MessageEmbed();
                    embed.setTitle(`\u200B`);
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
            message.channel.send(embed).catch(e => {});
        }
    }
}