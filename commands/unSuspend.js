const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Unsuspends the user specified.",
    use: `unSuspend [user] <reason>`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    channels: ["suspensionsChannel"],
    roles: ["suspendedButVerifiedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let suspensionsDB = client.models.get("suspensions");
        let author = guildMembers.get(message.author.id);
        if (author.roles.highest.position < message.guild.roles.get(settings.rlRole).position) {
            return message.channel.send(`You do not have permission to use this command.`);
        }
        let args = message.content.split(" ");
        let thingToCheck = args[1];
        let command = require("./help/member");
        let person = await command(guildMembers, thingToCheck, settings);
        let thingy;
        let suspension = await suspensionsDB.findOne({where: {GuildID: message.guild.id, userID: thingToCheck}});
        if (!person && !suspension) {
            return message.channel.send("Please provide a valid user to unsuspend.");
        } else if (!person && suspension) {
            thingy = thingToCheck;
        } else {
            thingy = person.user.id;
        }
        let reason = args.slice(2).join(" ");
        if (!suspension) {
            suspension = await suspensionsDB.findOne({where: {GuildID: message.guild.id, userID: thingy}});
        }
        if (suspension) {
            let myMessage = suspension.dataValues.messageID;
            message.guild.channels.get(settings.suspensionsChannel).messages.fetch(myMessage).then(async (msg) => {
                let oldEmbed = msg.embeds[0];
                oldEmbed.setDescription(oldEmbed.description + `\nUnsuspended manually by ${guildMembers.get(message.author.id)}.`);
                oldEmbed.setColor(0x00e636);
                if (reason) {
                    oldEmbed.addField("Reason for Unsuspension:", `${reason}`);
                }
                await msg.edit(oldEmbed);
                await message.guild.channels.get(settings.suspensionsChannel).send(`${person}`).then(msgs => {
                    msgs.delete();
                })
                await message.channel.send(`<@${person.id || thingy}> (${person.nickname || "left server"}) is now unsuspended.`);
                if (person.user) {
                    await person.roles.remove(settings.suspendedButVerifiedRole);
                    let roles = await client.models.get("suspensionroles").findAll({where: {messageID: suspension.dataValues.messageID}});
                    for (let i = 0; i < roles.length; i++) {
                        await person.roles.add(roles[i].dataValues.roleID);
                        await client.models.get("suspensionroles").destroy({where: {messageID: suspension.dataValues.messageID, roleID: roles[i].dataValues.roleID}});
                    }
                }
            }).catch(async e => {
                await message.guild.channels.get(settings.suspensionsChannel).send(`<@${person.id || thingy}> is now unsuspended.`);
                await message.channel.send(`<@${person.id || thingy}> (${person.nickname || "left server"}) is now unsuspended.`);
                if (person.user) {
                    await person.roles.remove(settings.suspendedButVerifiedRole);
                    let roles = await client.models.get("suspensionroles").findAll({where: {messageID: suspension.dataValues.messageID}});
                    for (let i = 0; i < roles.length; i++) {
                        await person.roles.add(roles[i].dataValues.roleID);
                        await client.models.get("suspensionroles").destroy({where: {messageID: suspension.dataValues.messageID, roleID: roles[i].dataValues.roleID}});
                    }
                }
            });
            await suspensionsDB.destroy({where: {GuildID: message.guild.id, userID: thingy}});
        } else {
            if (person.user) {
                if (person.roles.get(settings.suspendedButVerifiedRole)) {
                    let embed = new Discord.MessageEmbed();
                    embed.setDescription(`I have no record of ${person} (${person.displayName}) being suspended but he does have ${message.guild.roles.get(settings.suspendedButVerifiedRole)}. Would you like to have it removed and add ${message.guild.roles.get(settings.raiderRole)}?`);
                    message.channel.send(embed).then(msgs => {
                        let found = false;
                        let filter = (messager) => messager.author.id === message.author.id || messager.author.id === "321726133307572235";
                        let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
                        collector.on("collect", async (mess) => {
                            let content = mess.content.toLowerCase();
                            if (content === `${settings.prefix}yes` || content === "-yes" || content === "yes" || content === "y") {
                                found = true;
                                collector.stop();
                                await person.roles.remove(settings.suspendedButVerifiedRole);
                                await person.roles.add(settings.raiderRole);
                                await message.guild.channels.get(settings.suspensionsChannel).send(`${person} (${person.displayName}) you have now been unsuspended.`);
                                await message.channel.send(`Manually unsuspening ${person} (${person.displayName}) now.`);
                            } else if (content === `${settings.prefix}no` || content === "-no" || content === "no" || content === "n") {
                                found = true;
                                collector.stop();
                                message.channel.send(`Command is now aborted.`);
                            } else {
                                message.channel.send(`Please provide a valid response: \`yes\` or \`no\`.`);
                            }
                        });
                        collector.on("end", (collector) => {
                            if (!found) {
                                message.channel.send(`No response was given, command is aborted as a result.`);
                            }
                        });
                    });
                } else if (person.roles.get(settings.suspendedRole)) {
                    let embed = new Discord.MessageEmbed();
                    embed.setDescription(`I have no record of ${person} (${person.displayName}) being suspended but he does have ${message.guild.roles.get(settings.suspendedRole)}. I would recommend using the \`${settings.prefix}pUnsuspend\` command.`);
                    message.channel.send(embed);
                } else {
                    return message.channel.send("I cannot unsuspend that person because I have no record of them being suspended and they do not seem to have any suspended roles.");
                }
            }
        }
    }
}