module.exports = {
    aliases: ["l"],
    description: "Turnes the loop feature on or off.",
    use: "loop [on | off]",
    cooldown: 1,
    type: "music",
    dms: false,
    public: false,
    premium: true,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let onOrOff = message.content.toLowerCase().split(" ").slice(1).join(" ");
        if (onOrOff === "on") {
            message.channel.send("Your loop is now set to on!");
            await client.models.get("guild").update({loopSwitch: true}, {where: {guildID: message.guild.id}});
        } else if (onOrOff === "off") {
            message.channel.send("Your loop is now set to off!");
            await client.models.get("guild").update({loopSwitch: false}, {where: {guildID: message.guild.id}});
        } else {
            return message.channel.send(`Please provide a valid operation: \`on\` or \`off\`.`);
        }
    }
}