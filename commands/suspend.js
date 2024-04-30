const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Suspends the user spefified for the amount of time specified.",
    use: `suspend [user1] <user2>... [time] [unit] <reason>`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["suspensionsChannel"],
    roles: ["rlRole", "suspendedButVerifiedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let suspensionsDB = client.models.get("suspensions");
        let author = guildMembers.get(message.author.id);
        if (author.roles.highest.position < message.guild.roles.get(settings.rlRole).position) {
            return message.channel.send(`You do not have permission to use this command.`);
        }
        let args = message.content.split(" ").slice(1);
        if (!args) {
            return message.channel.send(`Please provide more information on the suspension.`);
        }
        let peopleIFound = [];
        let counter = 0;
        let command = require("./help/member");
        for (let i = 0; i < args.length; i++) {
            let thingToCheck = args[i];
            let personIFound = await command(guildMembers, thingToCheck, settings);
            if (personIFound) {
                if (i + 1 !== args.length) {
                    counter++;
                    peopleIFound.push(personIFound);
                } else {
                    return message.channel.send(`Please provide a valid time to use with the suspensions.`);
                }
            } else {
                if (/^[0-9]*$/.test(thingToCheck)) {
                    break;
                } else {
                    return message.channel.send(`I cannot read properly one of the users you want to suspend: "${thingToCheck}"`);
                }
            }
        }
        let timeArgs = args.slice(counter);
        let numberOfTime = timeArgs[0];
        if (!numberOfTime) {
            return message.channel.send(`Please provide a valid time for the suspension.`);
        }
        let unitOfTime = timeArgs[1];
        if (!unitOfTime) {
            return message.channel.send(`Please provide a valid unit of time for the suspension.`);
        }
        unitOfTime = unitOfTime.toLowerCase();
        let reason = timeArgs.slice(2).join(" ");
        if (parseInt(numberOfTime) > 10000 || parseInt(numberOfTime) <= 0) {
            return message.channel.send("That is an invalid time to use for the suspension.");
        }
        let multi;
        let unitToText;
        if (unitOfTime === "s" || unitOfTime === "second" || unitOfTime === "seconds") {
            multi = 1000;
            unitToText = "second";
        } else if (unitOfTime === "m" || unitOfTime === "minute" || unitOfTime === "minutes") {
            multi = 60000;
            unitToText = "minute";
        } else if (unitOfTime === "h" || unitOfTime === "hour" || unitOfTime === "hours") {
            multi = 3600000;
            unitToText = "hour";
        } else if (unitOfTime === "d" || unitOfTime === "day" || unitOfTime === "days") {
            multi = 86400000;
            unitToText = "day";
        } else if (unitOfTime === "w" || unitOfTime === "week" || unitOfTime === "weeks") {
            multi = 604800000;
            unitToText = "week";
        } else {
            return message.channel.send("That is an invalid unit to use for the suspension.");
        }
        if (!reason) {
            return message.channel.send("Please make sure to provide a reason with the suspensions.");
        }
        let peopleICanSuspend = [];
        let fetchedAuthor = guildMembers.get(message.author.id);
        let clientRoless = guildMembers.get(client.user.id).roles.highest.position;
        let authorRoless = fetchedAuthor.roles.highest.position;
        let report = "";
        let timeCommand = require("./help/time");
        for (let i = 0; i < peopleIFound.length; i++) {
            let person = peopleIFound[i];
            let userRoless = person.roles.highest.position;
            let badThings = 0, messager = "";
            if (userRoless >= clientRoless) {
                badThings++;
                messager += `I cannot suspend ${person} (${person.displayName}) because their roles are higher or equal to mine.${(i + 1 !== peopleIFound.length) ? " Continuing with the rest..." : ""}`;
            }
            if (userRoless >= authorRoless) {
                badThings++;
                if (!messager) {
                    messager += `I cannot suspend ${person} (${person.displayName}) because their roles are higher or equal to yours.${(i + 1 !== peopleIFound.length) ? " Continuing with the rest..." : ""}`;
                } else {
                    messager = messager.replace(".", ",").replace(" Continuing with the rest...", "");
                    messager += ` and because their roles are higher or equal to yours.${(i + 1 !== peopleIFound.length) ? " Continuing with the rest..." : ""}`;
                }
            }
            if (messager) {
                report += `\n${messager}`;
            }
            if (person.roles.get(settings.suspendedRole)) {
                badThings++;
                message.channel.send(`${person} (${person.displayName}) is already suspended permanently. To overwrite this, please un-perma suspend him.`).catch(e => {});
            }
            if (badThings === 0) {
                let suspend = true;
                if (person.roles.get(settings.suspendedButVerifiedRole)) {
                    let data = await suspensionsDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                    if (data) {
                        let timeLeft = await timeCommand(data.dataValues.time - Date.now());
                        message.channel.send(`${person} (${person.displayName}) is already suspended for ${timeLeft} for: ${data.dataValues.reason}.\nAre you sure you want to overwrite this?`).catch(e => {});
                        suspend = await askToOverwrite(message, settings);
                    }
                }
                if (suspend) {
                    peopleICanSuspend.push(`${person} (${person.displayName})`);
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle(`Suspension Information`);
                    embed.setColor(0xff2a2a);
                    embed.setDescription(`The suspension is for ${numberOfTime} ${unitToText}${(numberOfTime > 1) ? "s" : ""}.`);
                    embed.addField(`User's server name: \`${person.displayName}\``, `${person} (Username: ${person.user.username})`, true);
                    embed.addField(`Mod's server name: \`${fetchedAuthor.displayName}\``, `${fetchedAuthor} (Username: ${message.author.username})`, true);
                    embed.addField(`Reason for suspension:`, `${reason}`);
                    embed.setTimestamp(Date.now() + (parseInt(numberOfTime) * multi));
                    embed.setFooter("Unsuspended at");
                    if (!message.seppuku) {
                        message.guild.channels.get(settings.suspensionsChannel).send(`${person}`).then(msgs => {
                            msgs.delete();
                        });
                    }
                    let msg = (!message.seppuku) ? await message.guild.channels.get(settings.suspensionsChannel).send(embed) : null;
                    let oldSuspension = await suspensionsDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                    if (oldSuspension && !message.seppuku) {
                        message.guild.channels.get(settings.suspensionsChannel).messages.fetch(oldSuspension.dataValues.messageID).then(msg => {
                            if (msg) {
                                if (!msg.deleted) {
                                    let oldEmbed = msg.embeds[0];
                                    oldEmbed.setColor(0x00e636);
                                    oldEmbed.setDescription(oldEmbed.description + `\nOverwritten.`);
                                    msg.edit(oldEmbed).catch(e => {});
                                }
                            }
                        });
                        await suspensionsDB.update({
                            time: Date.now() + (parseInt(numberOfTime) * multi),
                            reason: reason,
                            messageID: msg.id
                        }, {where: {guildID: message.guild.id, userID: person.id}});
                        let roles = await client.models.get("suspensionroles").findAll({where: {messageID: oldSuspension.dataValues.messageID}});
                        for (let j = 0; j < roles.length; j++) {
                            await client.models.get("suspensionroles").update({messageID: msg.id}, {where: {messageID: oldSuspension.dataValues.messageID}})
                        }
                    } else {
                        await suspensionsDB.create({
                            guildID: message.guild.id,
                            userID: person.id,
                            nickname: person.displayName,
                            time: Date.now() + (parseInt(numberOfTime) * multi),
                            reason: reason,
                            messageID: (!message.seppuku) ? msg.id : person.id
                        });
                        await person.roles.forEach(async e => {
                            if (parseInt(e.position) !== 0) {
                                if (e.id !== settings.mutedRole) {
                                    await person.roles.remove(e.id).then(async role => {
                                        if (e.id !== settings.mutedRole && e.id !== settings.tempKeyRole) {
                                            await client.models.get("suspensionroles").create({
                                                messageID: (!message.seppuku) ? msg.id : person.id,
                                                roleID: e.id
                                            });
                                        }
                                    }).catch(err => {
                                        message.channel.send(`I could not remove the \`${e.name}\` role for some reason, please be warry.`).catch(e => {});
                                    });
                                }
                            }
                        });
                        await person.roles.add(settings.suspendedButVerifiedRole);
                    }
                }
            }
        }
        if (report) {
            await message.channel.send(`${report}`);
        }
        if (peopleICanSuspend.length > 0) {
            await message.channel.send(`${peopleICanSuspend.join(", ")} ${(peopleICanSuspend.length > 1) ? "are" : "is"} now suspended for ${numberOfTime} ${unitToText}${(numberOfTime > 1) ? "s" : ""}.`);
        }
    }
}

function askToOverwrite(message, settings) {
    return new Promise((resolve, reject) => {
        let filter = (messager) => messager.author.id === message.author.id;
        let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
        let suspend = false;
        collector.on("collect", (msg) => {
            if (msg.content) {
                let content = msg.content.toLowerCase();
                if (content === `${settings.prefix}yes` || content === "-yes" || content === "yes" || content === "y") {
                    suspend = true;
                    message.channel.send(`Chosen to overwrite suspension, continuing...`).catch(e => {});
                    collector.stop();
                } else if (content === `${settings.prefix}no` || content === "-no" || content === "no" || content === "n") {
                    message.channel.send(`Chosen to cancel suspending, continuing...`).catch(e => {});
                    collector.stop();
                } else {
                    message.channel.send(`That is an invalid response. Please respond with \`yes\` or \`no\`.`).catch(e => {});
                }
            }
        });
        collector.on("end", (collected) => {
            resolve(suspend);
        });
    });
}