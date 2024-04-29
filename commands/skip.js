module.exports = {
    aliases: ["s"],
    description: "Skips the current playing song.",
    use: "skip",
    cooldown: 1,
    type: "music",
    dms: false,
    public: false,
    premium: true,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (guilds[message.guild.id].dispatcher) {
            message.channel.send("Skipping song!").catch(e => {});
            guilds[message.guild.id].dispatcher.end();
        } else {
            return message.channel.send("I cannot skip music when there is no music playing.").catch(e => {});
        }
    }
}