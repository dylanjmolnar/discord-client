module.exports = {
    aliases: [],
    description: "Resumes the paused music player.",
    use: "resume",
    cooldown: 0,
    type: "music",
    dms: false,
    public: false,
    premium: true,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (guilds[message.guild.id].dispatcher) {
            if (guilds[message.guild.id].dispatcher.paused) {
                await guilds[message.guild.id].dispatcher.resume();
                return message.channel.send("Resuming music!");
            } else {
                return message.channel.send("I cannot resume music while the music is already playing.");
            }
        }
    }
}