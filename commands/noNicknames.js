const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Lists users verified with no nickname.",
    use: "noNicknames",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["raiderRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let foundRole = message.guild.roles.get(settings.raiderRole);
        let staffRoles = await client.models.get("automuteroles").findAll({where: {guildID: message.guild.id}});
        let persons = guildMembers.filter(e => {
            if (e.roles.get(settings.raiderRole) && !e.nickname) {
                let authorRoles = guildMembers.get(e.id).roles.keyArray();
                for (let i = 0; i < staffRoles.length; i++) {
                    if (authorRoles.includes(staffRoles[i].dataValues.roleID)) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        }).array();
        let embed = new Discord.MessageEmbed();
        embed.setDescription(`__There ${(persons.length > 1 || persons.length === 0) ? "are" : "is"} \`${persons.length}\` user${(persons.length > 1 || persons.length === 0) ? "s" : ""} with ${foundRole} and no nickname!__`);
        embed.setColor(foundRole.color);
        let currentFieldNumber = -1;
        for (let i = 0; i < persons.length; i++) {
            let message1 = `${persons[i]}`;
            if (i === 0) {
                embed.setDescription(`${embed.description}\n${message1}`);
            } else {
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
        }
        message.channel.send(embed);
    }
}