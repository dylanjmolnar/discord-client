const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Finds a user on the server based on the nickname provided.",
    use: "find [nickname]",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let firstThingToFind = args[1];
        if (!firstThingToFind) {
            return message.channel.send(`Please specify a valid player to search for. (Must be the persons in game name)`);
        }
        let membersToFind = args.slice(1);
        let command = require("./help/nickname_search");
        for (let i = 0; i < membersToFind.length; i++) {
            if (!/^[a-zA-Z]*$/.test(membersToFind[i]) || membersToFind[i].length > 10) {
                message.channel.send(`${membersToFind[i]} is not a valid in game name.`);
            } else {
                let person = await command(message.guild.id, guildMembers, membersToFind[i], settings);
                let embed = new Discord.MessageEmbed();
                if (!person) {
                    let expelled = await client.models.get("expelled").findOne({where: {guildID: message.guild.id, inGameName: membersToFind[i]}});
                    let isExpelled = (expelled) ? "✅" : "❌";
                    embed.setDescription(`I could not find anyone in the server with the nickname: ([${membersToFind[i]}](https://www.realmeye.com/player/${membersToFind[i]})).\nExpelled: ${isExpelled} | Suspended: N/A | Voice Channel: N/A`);
                    message.channel.send(embed).catch(e => {});
                } else {
                    let expelled = await client.models.get("expelled").findOne({where: {guildID: message.guild.id, inGameName: membersToFind[i]}});
                    let isExpelled = (expelled) ? "✅" : "❌";
                    let suspended = await client.models.get("suspensions").findOne({where: {guildID: message.guild.id, userID: person.user.id}});
                    let isSuspended = (suspended) ? message.guild.roles.get(settings.suspendedButVerifiedRole) : (person.roles.get(settings.suspendedRole)) ? message.guild.roles.get(settings.suspendedRole) : "❌";
                    let voice = person.voice.channel;
                    let voiceChannel = (voice) ? message.guild.channels.get(voice.id) : "❌";
                    embed.setDescription(`Member I found with the nickname: ${person} ([${person.displayName}](https://www.realmeye.com/player/${membersToFind[i]})).\nExpelled: ${isExpelled} | Suspended: ${isSuspended} | Voice Channel: ${voiceChannel}`);
                    message.channel.send(embed).catch(e => {});
                }
            }
        }
    }
}