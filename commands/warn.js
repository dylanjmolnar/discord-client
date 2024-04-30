const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Warns the user for the specified reason.",
    use: `warn [user] [reason]`,
    cooldown: 3,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let warns = client.models.get("warns");
        let args = message.content.split(" ");
        let user = args[1];
        let command = require("./help/member");
        let person = await command(guildMembers, user, settings);
        if (!person) {
            return message.channel.send(`Please provide a valid user to warn.`);
        }
        let reason = args.slice(2).join(" ");
        if (!reason) {
            return message.channel.send(`Please provide a valid reason for the warning.`);
        }
        await warns.create({
            guildID: message.guild.id,
            userID: person.id,
            modID: message.author.id,
            time: Date.now(),
            reason: reason
        });
        let warnsIFound = await warns.findAll({where: {guildID: message.guild.id, userID: person.id}});
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Warning Issued on the Server: ${message.guild.name}`);
        embed.setDescription(`__Moderator__: ${message.author} (${guildMembers.get(message.author.id).displayName})\n__Number of Warnings__: ${warnsIFound.length}\n__Reason__: ${reason}`);
        embed.setTimestamp(new Date());
        embed.setColor(0xff0000);
        person.send(embed);
        message.channel.send(`${person} (${person.displayName}) has now been warned. He has ${warnsIFound.length} warnings including this one.`);
    }
}