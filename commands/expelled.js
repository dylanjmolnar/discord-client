const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Add, remove, or list from the expelled list.",
    use: "expelled [add | remove | list] [user]",
    cooldown: 2,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let expelledDB = client.models.get("expelled");
        let blacklist = await expelledDB.findAll({where: {guildID: message.guild.id}});
        let args = message.content.toLowerCase().split(" ");
        let thingToDo = args[1];
        let thingToExpel = args[2];
        if (thingToDo === "add") {
            let roles = [];
            let modRoles = await client.models.get("muteroles").findAll({where: {guildID: message.guild.id}});
            let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
            for (let i = 0; i < modRoles.length; i++) {
                if (authorRoles.includes(modRoles[i].dataValues.roleID)) {
                    roles.push(`Placeholder`);
                }
            }
            if (roles.length === 0) {
                return message.channel.send(`You do not have permission to use this command.`);
            }
            if (!thingToExpel) {
                return message.channel.send("Please provide a valid player to expel.");
            }
            if (/^[a-zA-Z]*$/.test(thingToExpel) && thingToExpel.length <= 10) {
                let foundPerson = await expelledDB.findOne({where: {inGameName: thingToExpel}});
                if (!foundPerson) {
                    await expelledDB.create({
                        guildID: message.guild.id,
                        inGameName: thingToExpel
                    });
                    let thingy = message.content.split(" ").slice(2).join(" ");
                    message.channel.send(`\`${thingy}\` is now expelled.`);
                } else {
                    return message.channel.send(`\`${thingToExpel}\` is already blacklisted!`);
                }
            } else {
                return message.channel.send("That is not a valid player to expel!");
            }
        } else if (thingToDo === "remove") {
            let roles = [];
            let modRoles = await client.models.get("muteroles").findAll({where: {guildID: message.guild.id}});
            let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
            for (let i = 0; i < modRoles.length; i++) {
                if (authorRoles.includes(modRoles[i].dataValues.roleID)) {
                    roles.push(`Placeholder`);
                }
            }
            if (roles.length === 0) {
                return message.channel.send(`You do not have permission to use this command.`);
            }
            if (!thingToExpel) {
                return message.channel.send("Please provide a valid player to unexpel.");
            }
            let foundPerson = await expelledDB.findOne({where: {inGameName: thingToExpel}});
            if (foundPerson) {
                await expelledDB.destroy({where: {inGameName: thingToExpel}});
                let thingy = message.content.split(" ").slice(2).join(" ");
                message.channel.send(`\`${thingy}\` is now unexpelled.`);
            } else {
                return message.channel.send(`\`${thingToExpel}\` is not blacklisted!`);
            }
        } else if (thingToDo === "list") {
            let pingOrNot = (thingToExpel === "ping") ? true : false;
            let command = require("./help/nickname_search");
            let currentFieldNumber = -1;
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`The blacklisted players on your server!`);
            let blacklist1 = [];
            for (let i = 0; i < blacklist.length; i++) {
                blacklist1.push(blacklist[i].dataValues.inGameName);
            }
            blacklist1.sort((a, b) => {
                if (a > b) {
                    return 1;
                } else {
                    return -1;
                }
            });
            for (let i = 0; i < blacklist1.length; i++) {
                let highestPerson = await blacklist1[i];
                if (pingOrNot) {
                    highestPerson = await command(message.guild.id, guildMembers, blacklist1[i], settings);
                    if (!highestPerson) {
                        highestPerson = blacklist1[i];
                    }
                }
                if (highestPerson) {
                    let message1 = `${highestPerson}`;
                    let embedLength = embed.title.length + (embed.description) ? embed.description.length : 0;
                    for (let i = 0; i < embed.fields.length; i++) {
                        embedLength += embed.fields[i].name.length;
                        embedLength += embed.fields[i].value.length;
                    }
                    if (embedLength + message1.length <= 5800) {
                        if (embed.description) {
                            if (embed.description.length + message1.length < 2046 && currentFieldNumber === -1) {
                                await embed.setDescription(`${embed.description}, ${message1}`);
                            } else {
                                if (embed.fields.length === 0) {
                                    await embed.addField(`\u200B`, `${message1}`);
                                    currentFieldNumber++;
                                } else {
                                    if (embed.fields[currentFieldNumber].value.length + message1.length < 1022) {
                                        embed.fields[currentFieldNumber].value += `, ${message1}`;
                                    } else {
                                        currentFieldNumber++;
                                        await embed.addField(`\u200B`, `${message1}`);
                                    }
                                }
                            }
                        } else {
                            await embed.setDescription(`${message1}`);
                        }
                    } else {
                        message.channel.send(embed);
                        embed = new Discord.MessageEmbed();
                        embed.setTitle(`\u200B`);
                        embed.setDescription(`${message1}`);
                        currentFieldNumber = -1;
                    }
                }
            }
            message.channel.send(embed);
        } else {
            return message.channel.send(`Please provide a valid operation: \`add\`, \`remove\`, or \`list\`.`);
        }
    }
}