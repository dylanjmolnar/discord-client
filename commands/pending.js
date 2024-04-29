const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Removes pending for the user or list out all the pendings for the user.",
    use: "pending [remove | list] <user>",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let pendingDB = client.models.get("pending");
        let args = message.content.split(" ");
        let thingToDo = args[1];
        let thingToExpel = args.slice(2).join(" ");
        if (thingToDo === "remove") {
            if (!thingToExpel) {
                return message.channel.send(`Please provide a valid ID of the pending person to remove.`);
            } else {
                let pendingIFound = await pendingDB.findOne({where: {guildID: message.guild.id, userID: thingToExpel}});
                if (pendingIFound) {
                    await pendingDB.destroy({where: {guildID: message.guild.id, userID: thingToExpel}});
                    await message.channel.send(`Pending for <@${thingToExpel}> has been removed.`);
                } else {
                    return message.channel.send(`Please provide a valid ID of the pending person to remove.`);
                }
            }
        } else if (thingToDo === "list") {
            let blacklist = await pendingDB.findAll({where: {guildID: message.guild.id}});
            let channelID = message.guild.channels.get(settings.veriRejectionChannel).id;
            let currentFieldNumber = -1;
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`The current pending verifications!`);
            for (let i = 0; i < blacklist.length; i++) {
                let message1 = `<@${blacklist[i].dataValues.userID}> ~ [Module](https://discordapp.com/channels/${message.guild.id}/${channelID}/${blacklist[i].dataValues.messageID})`;
                let embedLength = embed.length;
                if (embedLength + message1.length <= 5994) {
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
                    await message.channel.send(embed);
                    embed = new Discord.MessageEmbed();
                    embed.setTitle(`\u200B`);
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
            await message.channel.send(embed);
        } else {
            return message.channel.send(`Please provide a valid operation: \`remove\` or \`list\`.`);
        }
    }
}