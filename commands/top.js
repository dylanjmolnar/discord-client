const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Lists the top key poppers on your server.",
    use: `top <page number>`,
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
        let kpDB = client.models.get("kp");
        let embed = new Discord.MessageEmbed();
        embed.setColor(4104266);
        embed.setTitle(`Top key openers!`);
        let pops = await kpDB.findAll({where: {guildID: message.guild.id}}).filter(e => guildMembers.get(e.dataValues.userID));
        let popsLogs = new Discord.Collection();
        for (let i = 0; i < pops.length; i++) {
            popsLogs.set(pops[i].dataValues.userID, pops[i].dataValues);
        }
        let leaders = guildMembers.filter(e => e.nickname).array().sort((a, b) => {
            let aLogs = popsLogs.get(a.id);
            let bLogs = popsLogs.get(b.id);
            if (aLogs && bLogs) {
                if (aLogs.numberOfRegular - bLogs.numberOfRegular !== 0) {
                    return bLogs.numberOfRegular - aLogs.numberOfRegular;
                } else if (aLogs.numberOfEvent - bLogs.numberOfEvent !== 0) {
                    return bLogs.numberOfEvent - aLogs.numberOfEvent;
                } else {
                    if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            } else if (aLogs && !bLogs) {
                return -1;
            } else if (!aLogs && bLogs) {
                return 1;
            } else {
                if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                    return 1;
                } else {
                    return -1;
                }
            }
        });
        let pageNumber = args.slice(1).join(" ") || "1";
        let length = Math.ceil(leaders.length / 10);
        if (/^[0-9]*$/.test(pageNumber)) {
            if (parseInt(pageNumber) > length) {
                return message.channel.send("That is an invalid page number to search for.");
            }
        } else {
            return message.channel.send("That is an invalid page number to search for.");
        }
        let lowerBound = (parseInt(pageNumber) - 1) * 10;
        let upperBound = (leaders.length < parseInt(pageNumber) * 10) ? leaders.length : parseInt(pageNumber) * 10;
        embed.setDescription(`Your rank: ${(leaders.indexOf(guildMembers.get(message.author.id)) !== -1) ? leaders.indexOf(guildMembers.get(message.author.id)) + 1 : "Unranked"}`);
        for (let i = lowerBound; i < upperBound; i++) {
            let highestPerson = leaders[i];
            let nicknameStuff = highestPerson;
            embed.setDescription(`${embed.description}\n${i + 1}: ${nicknameStuff} Keys Opened: \`${(popsLogs.get(highestPerson.user.id)) ? popsLogs.get(highestPerson.user.id).numberOfRegular : 0}\`, Event Keys Opened: \`${(popsLogs.get(highestPerson.user.id)) ? popsLogs.get(highestPerson.user.id).numberOfEvent : 0}\``);
        }
        if (leaders.length !== 0) {
            embed.setFooter(`Page number: ${pageNumber}/${length}`);
        } else {
            embed.setFooter(`Page number: No Pages!`);
        }
        if (message.channel) {
            message.channel.send(embed);
        } else {
            message.author.send(embed);
        }
    }
}