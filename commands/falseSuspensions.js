const Discord = require('discord.js');

module.exports = {
    aliases: ["falseSuspension", "fs"],
    description: "Lists a list of everyone in the server with the supended but verified role without a log of it through the bot.",
    use: "falseSuspensions",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["suspendedButVerifiedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let foundRole = message.guild.roles.get(settings.suspendedButVerifiedRole);
        let persons = guildMembers.filter(e => e.roles.get(settings.suspendedButVerifiedRole) || e.roles.get(settings.suspendedRole)).array();
        let autoMuteRolesDB = await client.models.get("automuteroles").findAll({where: {guildID: message.guild.id}});
        let suspensionLogsDB = client.models.get("suspensions");
        let newUsers = [];
        for (let i = 0; i < persons.length; i++) {
            let log = await suspensionLogsDB.findOne({where: {guildID: message.guild.id, userID: persons[i].id}});
            if (!log) {
                let isRL = false;
                let userRoles = persons[i].roles.keyArray();
                for (let j = 0; j < autoMuteRolesDB.length; j++) {
                    if (userRoles.includes(autoMuteRolesDB[j].dataValues.roleID)) {
                        isRL = true;
                        break;
                    }
                }
                if (!isRL) {
                    newUsers.push(persons[i]);
                }
            }
        }
        let embed = new Discord.MessageEmbed();
        embed.setDescription(`__There ${(newUsers.length > 1 || newUsers.length === 0) ? "are" : "is"} \`${newUsers.length}\` user${(newUsers.length > 1 || newUsers.length === 0) ? "s" : ""} with ${foundRole} and no logs of them being suspended!__`);
        embed.setColor(foundRole.color);
        let currentFieldNumber = -1;
        for (let i = 0; i < newUsers.length; i++) {
            let message1 = `${newUsers[i]}`;
            let embedLength = embed.length;
            if (embedLength + message1.length < 5998) {
                if (embed.description) {
                    if (embed.description.length + message1.length < 2046 && currentFieldNumber === -1) {
                        embed.setDescription(`${embed.description}, ${message1}`);
                    } else {
                        if (embed.fields.length === 0) {
                            embed.addField(`\u200B`, `${message1}`);
                            currentFieldNumber++;
                        } else {
                            if (embed.fields[currentFieldNumber].value.length + message1.length < 1022) {
                                embed.fields[currentFieldNumber].value += `, ${message1}`;
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
                embed.setColor(foundRole.color);
                embed.setTitle(`\u200B`);
                embed.setDescription(`${message1}`);
                currentFieldNumber = -1;
            }
        }
        message.channel.send(embed);
    }
}