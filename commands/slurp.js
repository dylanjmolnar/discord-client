module.exports = {
    aliases: [],
    description: "Sends a slurpie suprise.",
    use: "slurp",
    cooldown: 0,
    type: "misc",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        message.channel.send(`Slurpie Slurp Slurp`).catch(e => {});
    }
}