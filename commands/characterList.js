const Discord = require('discord.js');

module.exports = {
    aliases: ["cl", "charList"],
    description: "Makes a complete list of characters that are owned by the in game player provided.",
    use: "charList [in game name]",
    cooldown: 1,
    type: "misc",
    dms: true,
    public: true,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let name = args[1];
        if (!name) {
            return message.channel.send("please provide a player to find characters for.").catch(e => {});
        }
        if (name.length > 10 || !/^[a-zA-Z]*$/.test(name)) {
            return message.channel.send("please provide a valid player to find characters for.").catch(e => {});
        }
        let command = require("./help/searchRealmeye");
        let data = await command(name, {});
        if (data.characters) {
            if (data.characters.length === 0) {
                return message.channel.send(`${name} has no in game characters on realmeye.`).catch(e => {});
            }
            let charEmbed = new Discord.MessageEmbed();
            let charCommand = require("./help/findEmoji");
            charEmbed.setDescription(`Character list for [${data.name}](https://www.realmeye.com/player/${data.name})`);
            for (let i = 0; i < data.characters.length; i++) {
                let emojis = await charCommand(client, data.characters[i]);
                charEmbed.addField(`${data.characters[i].class}:`,
                `${client.emojisMisc.get(data.characters[i].class.toLowerCase())} Level: \`${data.characters[i].level}\` CQC: \`${data.characters[i].class_quests_completed}\` Fame: \`${data.characters[i].base_fame}\` Place: \`${data.characters[i].place}\` ${emojis.weapon} ${emojis.ability} ${emojis.armor} ${emojis.ring} ${emojis.backpack} Stats: \`${data.characters[i].stats_maxed}\``);
            }
            if (message.channel) {
                message.channel.send(charEmbed).catch(e => {});
            } else {
                message.author.send(charEmbed).catch(e => {});
            }
        } else {
            message.channel.send(`Characters for ${name} are hidden on realmeye.`).catch(e => {});
        }
    }
}