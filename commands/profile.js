const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Lists users stats for the server.",
    use: `profile <user>`,
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
        let thingToCheck = args[1];
        let command = require("./help/member");
        let author = guildMembers.get(message.author.id);
        let person;
        if (thingToCheck) {
            person = await command(guildMembers, thingToCheck, settings);
        } else {
            person = guildMembers.get(message.author.id);
        }
        if (!person) {
            return message.channel.send(`Please provide a valid user to see the profile of.`);
        }
        guildMembers = await message.guild.members.fetch();
        let command1 = require("./help/time");
        let embed = new Discord.MessageEmbed();
        let emoji = client.emojisMisc.get(person.user.presence.status);
        embed.setAuthor(person.user.tag, person.user.displayAvatarURL());
        embed.setDescription(`${emoji} ${person}`);
        embed.setColor(person.roles.highest.color);
        embed.setThumbnail(person.user.displayAvatarURL());
        embed.addField(`User ID`, person.id);
        let formalDate1 = new Date(person.user.createdAt).toDateString();
        let argsss = formalDate1.split(" ");
        let ending1 = await date_ending(argsss[2]);
        let timeer1 = await command1(Date.now() - person.user.createdTimestamp);
        embed.addField(`Joined Discord`, `${(argsss[2].startsWith("0")) ? argsss[2].slice(1) : argsss[2]}${ending1} ${argsss[1]} ${argsss[3]} (${timeer1} ago)`);
        let formalDate = new Date(person.joinedAt).toDateString();
        let argss = formalDate.split(" ");
        let ending = await date_ending(argss[2]);
        let timeer2 = await command1(Date.now() - person.joinedTimestamp);
        embed.addField(`Joined Server`, `${(argss[2].startsWith("0")) ? argss[2].slice(1) : argss[2]}${ending} ${argss[1]} ${argss[3]} (${timeer2} ago)`);
        embed.addField(`Highest Role`, `${person.roles.highest}`, true);
        embed.addField(`Member #`, `${guildMembers.sort((a, b) => {
            if (a.joinedTimestamp && b.joinedTimestamp) {
                return a.joinedTimestamp - b.joinedTimestamp;
            }
        }).keyArray().indexOf(person.id) + 1}`, true);
        if (message.channel) {
            message.channel.send(embed);
        } else {
            author.send(embed);
        }
    }
}

async function date_ending(argss) {
    let extra = "";
    if (argss === "11" || argss === "12" || argss === "13") {
        extra = "th";
    } else if (argss.endsWith("1")) {
        extra = "st";
    } else if (argss.endsWith("2")) {
        extra = "nd";
    } else if (argss.endsWith("2")) {
        extra = "rd";
    } else {
        extra = "th";
    }
    return extra;
}