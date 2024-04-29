const Discord = require('discord.js');

module.exports = {
    aliases: ["warnRem", "unWarn", "remWarn", "removeWarn"],
    description: "Removes a warn issued to the user.",
    use: `warnRemove [user] [number]`,
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
        let user = args[1];
        let command = require("./help/member");
        let person = await command(guildMembers, user, settings);
        if (!person) {
            return message.channel.send(`Please provide a valid user to remove a warn for.`);
        }
        let warns = await client.models.get("warns").findAll({where: {guildID: message.guild.id, userID: person.id}});
        let numberToRemove = args[2];
        if (!numberToRemove) {
            return message.channel.send(`Please provide what number warning to remove: ${(warns.length === 0) ? "This user has no warnings." :`1-${warns.length}`}`);
        }
        if (!/^[0-9]*$/.test(numberToRemove)) {
            return message.channel.send(`Please provide a valid number warning to remove.`);
        }
        let myIndex = parseInt(numberToRemove) - 1;
        if (myIndex < 0 || parseInt(numberToRemove) > warns.length) {
            return message.channel.send(`Please provide a valid number warning to remove; this user has none.`);
        }
        let embed = new Discord.MessageEmbed();
        let messageindex = myIndex;
        embed.setTitle(`Warning Issued on the Server: ${message.guild.name}`);
        embed.setDescription(`__Moderator__: <@${warns[messageindex].modID}> (${(guildMembers.get(warns[messageindex].modID)) ? `${guildMembers.get(warns[messageindex].modID).displayName}` : "Left Server"})\n__Reason__: ${warns[messageindex].reason}`);
        embed.setTimestamp(warns[messageindex].time);
        embed.setColor(0xff0000);
        message.channel.send("Are you sure you want to delete the following warning?", embed);
        let filter = (messager) => messager.author.id === message.author.id || messager.author.id === "321726133307572235";
        let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
        let removed = false;
        collector.on("collect", async (msg) => {
            if (msg.content.toLowerCase() === `${settings.prefix}yes` || msg.content.toLowerCase() === "-yes" || msg.content.toLowerCase() === "yes" || msg.content.toLowerCase() === "y") {
                await client.models.get("warns").destroy({where: {guildID: message.guild.id, userID: person.id, time: warns[messageindex].time}});
                message.channel.send(`Warning has now been removed!`);
                removed = true;
                collector.stop();
            } else if (msg.content.toLowerCase() === `${settings.preifx}no` || msg.content.toLowerCase() === "-no" || msg.content.toLowerCase() === "no" || msg.content.toLowerCase() === "n") {
                collector.stop();
            } else {
                message.channel.send(`Please provide a valid response: \`yes\` or \`no\`.`);
            }
        });
        collector.on("end", (collected) => {
            if (!removed) {
                message.channel.send(`Warning removal has been cancelled!`);
            }
        });
    }
}