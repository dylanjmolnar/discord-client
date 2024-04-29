module.exports = {
    aliases: ["cw"],
    description: "Lists this weeks leaders and the runs they've lead.",
    use: "currentweek",
    cooldown: 1,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let command = require("./help/currentweek");
        let authorID = message.author.id;
        let guildID = message.guild.id;
        let embed = await command(client, settings, guildMembers, authorID, guildID);
        for (let i = 0; i < embed.length; i++) {
            await message.channel.send(embed[i]);
        }
    }
}