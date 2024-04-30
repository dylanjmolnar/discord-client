const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Lists the suspended users on the server.",
    use: `suspensions <user>`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["suspensionsChannel"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let userToFind = args[1];
        if (userToFind) {
            let command = require("./help/member");
            let person = await command(guildMembers, userToFind, settings);
            let suspensionCase;
            if (!person) {
                suspensionCase = await client.models.get("suspensions").findOne({where: {guildID: message.guild.id, userID: (userToFind || "")}});
                if (!suspensionCase) {
                    return message.channel.send(`Please provide a valid user to find suspensions for.`);
                }
            }
            if (!suspensionCase) {
                suspensionCase = await client.models.get("suspensions").findOne({where: {guildID: message.guild.id, userID: person.user.id}});
            }
            if (suspensionCase && suspensionCase.dataValues.time) {
                let timeCommand = require("./help/time");
                let timeLeft = (suspensionCase.dataValues.time) ? await timeCommand(suspensionCase.dataValues.time - Date.now()) : "No Unmute Time";
                let roles = await client.models.get("suspensionroles").findAll({where: {messageID: suspensionCase.dataValues.messageID}});
                let rolesArray = [];
                for (let j = 0; j < roles.length; j++) {
                    rolesArray.push(message.guild.roles.get(roles[j].dataValues.roleID) || roles[j].dataValues.roleID);
                }
                let embed = new Discord.MessageEmbed();
                embed.setDescription(`__Suspension case for ${person || `<@${userToFind}> (Left Server)`}__
                Nickname While Supended: ${suspensionCase.dataValues.nickname}
                Time Left: ${timeLeft}
                Jump to Message: [__**Message**__](https://discordapp.com/channels/${message.guild.id}/${settings.suspensionsChannel}/${suspensionCase.dataValues.messageID})
                Roles: ${rolesArray.join(", ")}
                Reason: ${suspensionCase.dataValues.reason || "None"}`);
                message.channel.send(embed).catch(e => {});
            } else {
                message.channel.send(`${person} (${person.displayName}) is not muted already.`);
            }
        } else {
            let suspensions = await client.models.get("suspensions").findAll({where: {guildID: message.guild.id}}).filter(e => e.dataValues.time);
            let suspendedPeople = suspensions.sort((a, b) => {
                if (a.dataValues.nickname > b.dataValues.nickname) {
                    return 1;
                } else {
                    return -1;
                }
            });
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`These are the suspended people for your server:`);
            let currentFieldNumber = -1;
            for (let i = 0; i < suspendedPeople.length; i++) {
                let time = suspendedPeople[i].dataValues.time - Date.now();
                let command = require(`./help/time`);
                let timeR = await command(time);
                let message1, rolesArray = [];
                let roles = await client.models.get("suspensionroles").findAll({where: {messageID: suspendedPeople[i].dataValues.messageID}});
                for (let j = 0; j < roles.length; j++) {
                    rolesArray.push(message.guild.roles.get(roles[j].dataValues.roleID) || roles[j].dataValues.roleID);
                }
                if (guildMembers.get(suspendedPeople[i].dataValues.userID)) {
                    message1 = `${guildMembers.get(suspendedPeople[i].dataValues.userID)} (Nickname: ${suspendedPeople[i].dataValues.nickname}) [__**Message**__](https://discordapp.com/channels/${message.guild.id}/${settings.suspensionsChannel}/${suspendedPeople[i].dataValues.messageID})\n__Time Left__: ${timeR}.\n__Roles__: ${(rolesArray.length > 0) ? rolesArray.join(", ") : "None"}\n__Reason__: ${(suspendedPeople[i].dataValues.reason) ? suspendedPeople[i].dataValues.reason : `None Given.`}`;
                } else {
                    message1 = `<@${suspendedPeople[i].dataValues.userID}> (Nickname: ${suspendedPeople[i].dataValues.nickname} (Left Server)) [__**Message**__](https://discordapp.com/channels/${message.guild.id}/${settings.suspensionsChannel}/${suspendedPeople[i].dataValues.messageID})\n__Time Left__: ${timeR}.\n__Roles__: ${(rolesArray.length > 0) ? rolesArray.join(", ") : "None"}\n__Reason__: ${(suspendedPeople[i].dataValues.reason) ? suspendedPeople[i].dataValues.reason : `None Given.`}`;
                }
                let embedLength = embed.length
                if (embedLength + message1.length <= 5998) {
                    if (embed.description) {
                        if (embed.description.length + message1.length < 2026 && currentFieldNumber === -1) {
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
                    message.channel.send(embed);
                    embed = new Discord.MessageEmbed();
                    embed.setTitle(`\u200B`);
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
            message.channel.send(embed);
        }
    }
}