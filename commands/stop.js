module.exports = {
    aliases: [],
    description: "Stops the music player.",
    use: `stop`,
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
            await message.channel.send("Stopping music!");
            guilds[message.guild.id].music.queue = [];
            guilds[message.guild.id].music.queueNames = [];
            guilds[message.guild.id].music.queueTime = [];
            if (guilds[message.guild.id].dispatcher.paused === true) {
                await guilds[message.guild.id].dispatcher.resume();
            }
            await guilds[message.guild.id].dispatcher.end();
        }
    }
}