module.exports = {
    aliases: ["dg"],
    description: "Deletes a guild profile for the bot.",
    use: "destroyGuild [guild ID]",
    cooldown: 0,
    type: "private",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (message.author.id === "321726133307572235") {
            let args = message.content.split(" ");
            let guildID = args[1];
            if (!guildID) {
                return message.channel.send(`Please provide a valid guild ID to remove from the bot's files.`);
            }
            let profile = await client.models.get("guild").findOne({where: {guildID: guildID}});
            if (!profile) {
                return message.channel.send(`Please provide a valid guild ID to remove from the bot's files.`);
            }
            await message.channel.send(`Guild profile has been destroyed for \`${profile.dataValues.guildID}\`.`);
            await client.models.get("guild").destroy({where: {
                guildID: guildID
            }});
        }
    }
}