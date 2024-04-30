const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
    aliases: ["expelledGuild", "eg"],
    description: "Add, remove or list the expelled guilds on this server.",
    use: "expelledGuilds [add | remove | list] [guild name]",
    cooldown: 2,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let expelledDB = await client.models.get("expelledguilds");
        let blacklist = await expelledDB.findAll({where: {guildID: message.guild.id}});
        let args = message.content.split(" ");
        let thingToDo = args[1];
        let thingToExpel = args.slice(2).join(" ");
        if (thingToDo === "add") {
            let roles = [];
            let modRoles = await client.models.get("expelledguildsroles").findAll({where: {guildID: message.guild.id}});
            let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
            for (let i = 0; i < modRoles.length; i++) {
                if (authorRoles.includes(modRoles[i].dataValues.roleID)) {
                    roles.push(`Placeholder`);
                }
            }
            if (roles.length === 0) {
                return message.channel.send(`You do not have permission to use this command.`);
            }
            if (/^[a-zA-Z ]*$/.test(thingToExpel)) {
                let guildLooking = message.content.split(" ").slice(2).join("%20");
                let guildName = message.content.split(" ").slice(2).join(" ");
                let url = "http://www.tiffit.net/RealmInfo/api/guild?g=" + guildLooking;
                snekfetch.get(url, {headers: {'User-Agent': 'Dylanxdman'}}).then(async r => {
                    if (r.body.error) {
                        let suggestions = [];
                        let mass = 5;
                        if (r.body.suggestions.length < 5) {
                            mass = r.body.suggestions.length;
                        }
                        for (i = 0; i < mass; i++) {
                            suggestions.push(`\`${r.body.suggestions[i]}\``)
                        }
                        return message.channel.send("That is an invalid guild. Suggested guilds:\n" + suggestions.join(",\n"));
                    } else {
                        let foundGuild = await expelledDB.findOne({where: {guildID: message.guild.id, guildName: guildName}});
                        if (foundGuild) {
                            return message.channel.send("That guild is already blacklisted on your server.");
                        } else {
                            await expelledDB.create({
                                guildID: message.guild.id,
                                guildName: guildName
                            })
                            message.channel.send(`\`${guildName}\` is now expelled.`);
                        }
                    }
                });
            } else {
                return message.channel.send("That is not a valid guild to expel!");
            }
        } else if (thingToDo === "remove") {
            let roles = [];
            let modRoles = await client.models.get("expelledguildsroles").findAll({where: {guildID: message.guild.id, guildID: message.guild.id}});
            let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
            for (let i = 0; i < modRoles.length; i++) {
                if (authorRoles.includes(modRoles[i].dataValues.roleID)) {
                    roles.push(`Placeholder`);
                }
            }
            if (roles.length === 0) {
                return message.channel.send(`You do not have permission to use this command.`);
            }
            let foundGuild = await expelledDB.findOne({where: {guildName: thingToExpel}});
            if (foundGuild) {
                await expelledDB.destroy({where: {guildName: thingToExpel}});
                let thingy = message.content.split(" ").slice(2).join(" ");
                message.channel.send(`\`${thingy}\` is now unexpelled.`);
            } else {
                return message.channel.send("That guild is not expelled!");
            }
        } else if (thingToDo === "list") {
            let newEmbed = new Discord.MessageEmbed();
            let blacklistNames = [];
            for (let i = 0; i < blacklist.length; i++) {
                blacklistNames.push(blacklist[i].dataValues.guildName);
            }
            blacklistNames.sort((a, b) => {
                if (a.toLowerCase() > b.toLowerCase()) {
                    return 1;
                } else {
                    return -1;
                }
            });
            newEmbed.setTitle(`The blacklisted guilds on your server!`);
            newEmbed.setDescription(`${blacklistNames.join(`\n`)}`);
            message.channel.send(newEmbed);
        } else {
            return message.channel.send(`Please provide a valid operation: \`add\`, \`remove\`, or \`list\`.`);
        }
    }
}