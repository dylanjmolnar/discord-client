const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Lists all warns on the server.",
    use: `warns <user>`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let warns = await client.models.get("warns").findAll({where: {guildID: message.guild.id}})
        let userToFind = args[1];
        let warnsFind = {};
        for (let i = 0; i < warns.length; i++) {
            if (warnsFind[warns[i].dataValues.userID]) {
                warnsFind[warns[i].dataValues.userID].number++;
            } else {
                warnsFind[warns[i].dataValues.userID] = {
                    number: 1
                };
            }
        }
        if (!userToFind) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Your server's warns!`);
            let currentFieldNumber = -1;
            let keys = Object.keys(warnsFind);
            for (let i = 0; i < keys.length; i++) {
                let message1 = `<@${keys[i]}> (${(guildMembers.get(keys[i])) ? guildMembers.get(keys[i]).displayName : "Left Server"}) - Warn Count: ${warnsFind[keys[i]].number}`;
                let embedLength = embed.title.length + (embed.description) ? embed.description.length : 0;
                for (let i = 0; i < embed.fields.length; i++) {
                    embedLength += embed.fields[i].name.length;
                    embedLength += embed.fields[i].value.length;
                }
                if (embedLength + message1.length <= 5998) {
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
                    message.channel.send(embed);
                    embed = new Discord.MessageEmbed();
                    embed.setTitle(`\u200B`);
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
            message.channel.send(embed);
        } else {
            let command = require("./help/member");
            let person = await command(guildMembers, userToFind, settings);
            if (!person) {
                return message.channel.send(`Please provide a valid user to find warnings for.`);
            }
            let userWarns = await client.models.get("warns").findAll({where: {guildID: message.guild.id, userID: person.id}});
            if (userWarns.length === 0) {
                return message.channel.send(`This user has no logged warnings!`);
            }
            let embed = new Discord.MessageEmbed();
            embed.setDescription(`__Warnings for ${person} (${person.displayName})!__`);
            let currentFieldNumber = -1;
            for (let i = 0; i < userWarns.length; i++) {
                let message1 = `__Moderator__: <@${userWarns[i].modID}>\n__Reason__: ${userWarns[i].reason}\n`;
                let embedLength = (embed.description) ? embed.description.length : 0;
                for (let i = 0; i < embed.fields.length; i++) {
                    embedLength += embed.fields[i].name.length;
                    embedLength += embed.fields[i].value.length;
                }
                if (embedLength + message1.length <= 5998) {
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
                    message.channel.send(embed);
                    embed = new Discord.MessageEmbed();
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
            await message.channel.send(embed);
        }
    }
}