module.exports = {
    aliases: [],
    description: "",
    use: "",
    cooldown: 1,
    type: "misc",
    dms: false,
    public: false,
    premium: true,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        console.log([client.guilds.keyArray()])
        client.guilds.get("561441327879946240").leave();
    }
}