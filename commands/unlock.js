module.exports = {
    aliases: [],
    description: "Unlocks the event channel specified so that raiders can join.",
    use: `unLock [channel number]`,
    cooldown: 1,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["raiderRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let channelNumber = args.slice(1).join(" ");
        let author = guildMembers.get(message.author.id);
        if (!channelNumber && !author.voice.channelID) {
            return message.channel.send(`Please specify a valid channel to unlock.`);
        }
        if (channelNumber) {
            if (!/^[0-9]*$/.test(channelNumber)) {
                return message.channel.send(`Please provide a valid channel to unlock. Usage \`${settings.prefix}unlock <channel number>\``);
            }
        }
        let theRaidingDB = (message.channel.id === settings.veteranCommandsChannel) ? await client.models.get("veteranraiding").findAll({where: {guildID: message.guild.id}}) : await client.models.get("eventraiding").findAll({where: {guildID: message.guild.id}});
        let theRaiding = [];
        for (let i = 0; i < theRaidingDB.length; i++) {
            theRaiding.push(theRaidingDB[i].dataValues.channelID);
        }
        let myChannel = (channelNumber) ? parseInt(channelNumber) - 1 : theRaiding.indexOf(author.voice.channelID);
        if (myChannel === -1) {
            return message.channel.send(`Please provide a valid channel to unlock.`);
        }
        if (myChannel < 0 || parseInt(channelNumber) > theRaiding.length) {
            return message.channel.send(`Please provide a valid channel to unlock. Your range is 1-${theRaiding.length}`);
        }
        if (!guildMembers.get(client.user.id).permissionsIn(theRaiding[myChannel]).toArray().includes("MANAGE_CHANNELS")) {
            return message.channel.send(`I cannot open the channel because I am missing permissions to manage role perms in the raiding channel you selected.`);
        }
        if (!message.guild.channels.get(theRaiding[myChannel]).name.includes(" <-- Join!")) {
            await message.guild.channels.get(theRaiding[myChannel]).setName(`${message.guild.channels.get(theRaiding[myChannel]).name} <-- Join!`, "Changing name to indicate channel is open.");
        }
        await message.guild.channels.get(theRaiding[myChannel]).updateOverwrite(settings.raiderRole, {
            CONNECT: true
        }, "Opening channel for event dungeons with no close time.");
        await message.guild.channels.get(theRaiding[myChannel]).edit({userLimit: 0}, "Removing user limit as the channel is now opening with no close time.");
        await message.channel.send(`Channel ${message.guild.channels.get(theRaiding[myChannel])} has now been opened with no end time.\nUse the command \`${settings.prefix}reset${(message.channel.id === settings.veteranCommandsChannel) ? "" : "Event"}Channel ${myChannel + 1}\` to close the channel afterwards.`);
    }
}