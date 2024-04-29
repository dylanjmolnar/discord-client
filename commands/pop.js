const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Adds a key pop for the specified user.",
    use: `pop [type] [user] <number>`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let popsDB = client.models.get("kp");
        let server = await client.models.get("typeprofile").findOne({where: {guildID: message.guild.id}});
        const serverType = server.dataValues.type;
        let typeName = (client.emojisPortals.get(serverType)) ? client.emojisPortals.get(serverType).name.split("_").join(" ") : "Lost Halls";
        let abbreviation = typeName.split(" ").map(e => e[0].toLowerCase()).join("");
        let args = message.content.split(" ");
        let typeOfPop = args[1];
        if (!typeOfPop) {
            return message.channel.send(`Please provide a valid type of key pop: \`${serverType}\`, \`event\`.`);
        }
        typeOfPop = typeOfPop.toLowerCase();
        if (serverType === "lh") {
            if (typeOfPop === "lh") {
                typeOfPop = "main";
            } else if (typeOfPop === "event" || typeOfPop === "e") {
                typeOfPop = "event";
            } else {
                return message.channel.send(`Please provide a valid type of key pop: \`${serverType}\`, \`event\`.`);
            }
        } else {
            if (typeOfPop === serverType || typeOfPop === abbreviation) {
                typeOfPop = "main";
            } else if (typeOfPop === "event" || typeOfPop === "e") {
                typeOfPop = "event";
            } else {
                return message.channel.send(`Please provide a valid type of key pop: \`${serverType}\`, \`event\`.`);
            }
        }
        let thingToCheck = args[2];
        let command = require("./help/member");
        let person = await command(guildMembers, thingToCheck, settings);
        if (!person) {
            return message.channel.send(`That is an invalid user to add key pops to.`);
        }
        let optionalNumber = args[3];
        let leNumber;
        if (optionalNumber) {
            if (/^[0-9]*$/.test(optionalNumber)) {
                leNumber = parseInt(optionalNumber);
            } else {
                return message.channel.send(`That is an invalid number of keys popped`);
            }
        } else {
            leNumber = 1;
        }
        guilds[message.guild.id].answering = true;
        let found = false;
        let filter = (messager) => messager.author.id === message.author.id || messager.author.id === "321726133307572235";
        let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
        message.channel.send(`Are you sure ${person} popped ${leNumber} ${(typeOfPop === "main") ? typeName : "Event"} key${(leNumber > 1) ? "s" : ""}? Reply with either \`yes\` or \`no\`.`);
        collector.on("collect", async (message) => {
            if (message.author.bot === false) {
                if (message.content.toLowerCase() === `${settings.prefix}yes` || message.content.toLowerCase() === "-yes" || message.content.toLowerCase() === "yes" || message.content.toLowerCase() === "y") {
                    message.channel.send(`Adding their key pop to my records!`);
                    let pop = await popsDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                    if (pop) {
                        if (typeOfPop === "main") {
                            await popsDB.update({numberOfRegular: pop.dataValues.numberOfRegular + leNumber}, {where: {guildID: message.guild.id, userID: person.id}});
                        } else {
                            await popsDB.update({numberOfEvent: pop.dataValues.numberOfEvent + leNumber}, {where: {guildID: message.guild.id, userID: person.id}});
                        }
                        let pops = await popsDB.findOne({where: {guildID: message.guild.id, userID: person.id}});
                        let number5 = (message.guild.id === "343704644712923138") ? 15 : 25;
                        if (pops.dataValues.numberOfRegular >= number5 && pops.dataValues.numberOfRegular < 50) {
                            if (!person.roles.get(settings.keyRole3)) {
                                await person.roles.add(settings.keyRole3);
                            }
                        } else if (pops.dataValues.numberOfRegular >= 50) {
                            if (!person.roles.get(settings.keyRole2)) {
                                await person.roles.add(settings.keyRole2);
                            }
                        }
                    } else {
                        if (typeOfPop === "main") {
                            await popsDB.create({
                                guildID: message.guild.id,
                                userID: person.id,
                                numberOfRegular: leNumber,
                                numberOfEvent: 0
                            });
                        } else {
                            await popsDB.create({
                                guildID: message.guild.id,
                                userID: person.id,
                                numberOfRegular: 0,
                                numberOfEvent: leNumber
                            });
                        }
                    }
                    found = true;
                    collector.stop();
                } else if (message.content.toLowerCase() === `${settings.prefix}no` || message.content.toLowerCase() === "-no" || message.content.toLowerCase() === "no" || message.content.toLowerCase() === "n") {
                    message.channel.send(`The command is now aborted.`);
                    found = true;
                    collector.stop();
                } else {
                    return message.channel.send(`That is an invalid response. Reply with either \`yes\` or \`no\`.`);
                }
            }
        });
        collector.on("end", async (collected) => {
            guilds[message.guild.id].answering = false;
            if (found === false) {
                message.channel.send(`No response was given. The command is now aborted as a result.`);
            }
            if (message.guild.id === "451171819672698920") {
                let keysFound = await client.models.get("kp").findAll({where: {guildID: message.guild.id}});
                keysFound.sort((a, b) => {
                    let aMember = guildMembers.get(a.dataValues.userID);
                    let bMember = guildMembers.get(b.dataValues.userID);
                    if (aMember && bMember) {
                        if (b.dataValues.numberOfRegular - a.dataValues.numberOfRegular !== 0) {
                            return b.dataValues.numberOfRegular - a.dataValues.numberOfRegular;
                        } else if (b.dataValues.numberOfEvent - a.dataValues.numberOfEvent !== 0) {
                            return b.dataValues.numberOfEvent - a.dataValues.numberOfEvent;
                        } else {
                            if (aMember.displayName.toLowerCase() > bMember.displayName.toLowerCase()) {
                                return 1;
                            } else {
                                return -1;
                            }
                        }
                    } else if (aMember && !bMember) {
                        return -1;
                    } else if (!aMember && bMember) {
                        return 1;
                    }
                });
                let ids = [];
                for (let i = 0; i < 10; i++) {
                    let member = guildMembers.get(keysFound[i].dataValues.userID);
                    if (member) {
                        if (!member.roles.get(settings.keyRole1)) {
                            await member.roles.add(settings.keyRole1).catch(e => {});
                        }
                        ids.push(keysFound[i].dataValues.userID);
                    }
                }
                let users = guildMembers.filter(e => e.roles.get(settings.keyRole1)).array();
                if (users.length !== 10) {
                    for (let i = 0; i < users.length; i++) {
                        if (!ids.includes(users[i].id)) {
                            await users[i].roles.remove(settings.keyRole1);
                        }
                    }
                }
            }
        });
    }
}