module.exports = {
    aliases: [],
    description: "Puases the music from teh bot.",
    use: "pause",
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
            if (!guilds[message.guild.id].dispatcher.paused) {
                await guilds[message.guild.id].dispatcher.pause();
                await message.channel.send("Pausing music!");
            } else {
                message.channel.send("I cannot pause music while the music is already paused.");
            }
        }
    }
}