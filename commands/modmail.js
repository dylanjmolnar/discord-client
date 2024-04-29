const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "List or remove from the list of active modmail modules.",
    use: "modmail [remove | list] [modmail ID]",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["modmailChannel"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.toLowerCase().split(" ");
        let operation = args[1];
        if (!operation) {
            return message.channel.send(`Please provide a valid operation: \`remove\` or \`list\`.`);
        }
        let thingToOperate = args[2];
        let modmailDB = await client.models.get("modmailpending");
        if (operation === "remove") {
            if (!thingToOperate) {
                return message.channel.send("Please provide a valid module to stop pending for.");
            }
            let modmail = await modmailDB.findOne({where: {guildID: message.guild.id, messageID: thingToOperate}});
            if (modmail) {
                let embed = new Discord.MessageEmbed();
                let channelIDDB = await client.models.get("guild").findOne({where: {guildID: message.guild.id}});
                let channelID = channelIDDB.dataValues.modmailChannel;
                embed.setTitle(`Modmail removed!`);
                embed.setDescription(`[Module](https://discordapp.com/channels/${message.guild.id}/${channelID}/${thingToOperate})`);
                await modmailDB.destroy({where: {guildID: message.guild.id, messageID: thingToOperate}});
                await message.channel.send(embed);
            } else {
                message.channel.send("That is not a valid message ID to remove a pending module for.");
            }
        } else if (operation === "list") {
            let modmails = await modmailDB.findAll({where: {guildID: message.guild.id}});
            let channelID = settings.modmailChannel;
            let currentFieldNumber = -1;
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Your current pending modmails!");
            for (let i = 0; i < modmails.length; i++) {
                let message1 = `[Module](https://discordapp.com/channels/${message.guild.id}/${channelID}/${modmails[i].dataValues.messageID})`;
                let embedLength = embed.length;
                if (embedLength + message1.length <= 5994) {
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
                    await message.channel.send(embed);
                    embed = new Discord.MessageEmbed();
                    embed.setTitle(`\u200B`);
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
            message.channel.send(embed);
        }
    }
}