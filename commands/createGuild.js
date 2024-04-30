module.exports = {
    aliases: ["cg"],
    description: "Creates a new guild profile for the bot.",
    use: "createGuild [guild ID] [type of server] [prefix]",
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
            let typeOfServer = args[2];
            let prefix = args[3];
            if (!guildID) {
                return message.channel.send(`Please provide a valid guild ID to add to the bot's files.`);
            }
            if (!typeOfServer) {
                return message.channel.send(`Please provide a valid type of server to set the guild.`);
            }
            if (guildID.length > 25 || !/^[0-9]*$$/.test(guildID)) {
                return message.channel.send(`Please provide a valid guild ID to add to the bot's files.`);
            }
            if (typeOfServer !== "lh" && typeOfServer !== "shatters" && typeOfServer !== "thicket") {
                return message.channel.send(`Please provide a valid type of server to set the guild.`);
            }
            let guildIFound = await client.guilds.get(guildID);
            if (!guildIFound) {
                return message.channel.send(`Please provide a valid guild ID to add to the bot's files.`);
            }
            await message.channel.send(`Guild profile has been created for \`${guildIFound.name}\`.`);
            await client.models.get("guild").create({
                guildID: guildID,
                typeOfServer: typeOfServer,
                prefix: prefix
            });
        }
    }
}