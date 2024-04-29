const Discord = require('discord.js');

module.exports = {
    aliases: ["fbbl", "fbBlacklist", "feedbackBl"],
    description: "Adds or removes people from the blacklist for modmail.",
    use: "feedbackBlacklist [add | remove | list] [user]",
    cooldown: 3,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let expelledDB = await client.models.get("feedbackblacklist");
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
                return message.channel.send("Please provide a valid user to expel.");
            }
            let command = require("./help/person_role");
            let person = await command(message, guildMembers, thingToExpel, settings);
            if (person) {
                if (!person.user) {
                    return message.channel.send("That is not a valid person to expel!");
                }
                let blacklist1 = await client.models.get("feedbackblacklist").findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (!blacklist1) {
                    await expelledDB.create({
                        guildID: message.guild.id,
                        userID: person.id
                    });
                    message.channel.send(`${person} is now expelled from feedback.`);
                } else {
                    return message.channel.send("That person is already blacklisted!");
                }
            } else {
                return message.channel.send("That is not a valid person to expel!");
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
                return message.channel.send("Please provide a valid user to expel.");
            }
            let command = require("./help/person_role");
            let person = await command(message, guildMembers, thingToExpel, settings);
            if (person) {
                if (!person.user) {
                    return message.channel.send("That is not a valid person to expel!");
                }
                let blacklist1 = await client.models.get("feedbackblacklist").findOne({where: {guildID: message.guild.id, userID: person.id}});
                if (blacklist1) {
                    await expelledDB.destroy({where: {userID: person.id}});
                    message.channel.send(`${person} is now unexpelled.`);
                } else {
                    return message.channel.send("That person is not blacklisted!");
                }
            } else {
                return message.channel.send("That is not a valid person to expel!");
            }
        } else if (thingToDo === "list") {
            let currentFieldNumber = -1;
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`The blacklisted feedback players on your server!`);
            for (let i = 0; i < blacklist.length; i++) {
                let highestPerson = guildMembers.get(blacklist[i].dataValues.userID);
                if (highestPerson) {
                    let message1 = `${highestPerson}`;
                    let embedLength = embed.title.length + (embed.description) ? embed.description.length : 0;
                    for (let i = 0; i < embed.fields.length; i++) {
                        embedLength += embed.fields[i].name.length;
                        embedLength += embed.fields[i].value.length;
                    }
                    if (embedLength + message1.length <= 5998) {
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