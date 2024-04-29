const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Sends a large image of the users profile or your own if no user is provided.",
    use: "avatar <user>",
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
        let author = guildMembers.get(message.author.id);
        let command = await require("./help/member");
        let person;
        if (thingToCheck) {
            person = await command(guildMembers, thingToCheck, settings);
        } else {
            person = await guildMembers.get(message.author.id);
        }
        if (!person) {
            return message.channel.send(`Please provide a valid user to see the profile of.`);
        }
        let embed = new Discord.MessageEmbed();
        embed.setAuthor(person.user.tag, person.user.displayAvatarURL());
        embed.setImage(`${person.user.displayAvatarURL().replace("webp", "png")}?size=2048`);
        embed.setDescription(`[Avatar URL Link](${person.user.displayAvatarURL().replace("webp", "png")}?size=2048)`);
        if (message.channel) {
            message.channel.send(embed);
        } else {
            author.send(embed);
        }
    }
}