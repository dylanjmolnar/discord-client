module.exports = {
    aliases: ["rc"],
    description: "Closes the raiding channel so no one can join.",
    use: "resetChannel [channel number]",
    cooldown: 1,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["raiderRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.toLowerCase().split(" ");
        let channelOfRun = args[1];
        let theRaiding = (message.channel.id === settings.veteranCommandsChannel) ? await client.models.get("veteranraiding").findAll({where: {guildID: message.guild.id}}) : await client.models.get("raidingchannels").findAll({where: {guildID: message.guild.id}});
        if (!/^[0-9]*$/.test(channelOfRun)) {
            return message.channel.send(`Please provide a valid channel to use for the run.`);
        }
        if (parseInt(channelOfRun) <= 0 || parseInt(channelOfRun) > theRaiding.length) {
            return message.channel.send(`Please provide a valid channel to use for the run.`);
        }
        guilds[message.guild.id].afkCheckUp = false;
        let myChannel = channelOfRun - 1;
        await message.guild.channels.get(theRaiding[myChannel].dataValues.channelID).setName(`${message.guild.channels.get(theRaiding[myChannel].dataValues.channelID).name.replace(` <-- Join!`, ``)}`, "Changing name to indicate channel is closed as the AFK check ends.");
        await message.guild.channels.get(theRaiding[myChannel].dataValues.channelID).updateOverwrite(settings.raiderRole, {
            CONNECT: false
        }, "Closing channel as the AFK check ends.");
        await message.guild.channels.get(theRaiding[myChannel].dataValues.channelID).edit({userLimit: 99}, "Adding user limit as the AFK check ends.");
        await message.channel.send(`Channel ${message.guild.channels.get(theRaiding[myChannel].dataValues.channelID)} has been reset!`);
    }
}