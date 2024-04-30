module.exports = {
    aliases: [],
    description: "For those who want a little fun in their lives.",
    use: "seppuku",
    cooldown: 5,
    type: "misc",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        message.content = `${settings.prefix}suspend ${message.author.id} 1 m committing seppuku`;
        message.author = client.user;
        message.seppuku = true;
        let commandToRun = require("./suspend");
        commandToRun.execute(client, message, settings, guilds, guildMembers);
    }
}