module.exports = {
    aliases: ["uv"],
    description: "Logs on the bot a vial has been used by the user in our raids.",
    use: "useVial [user]",
    cooldown: 1,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["vialLogChannel"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let user = args[1];
        let author = guildMembers.get(message.author.id);
        let command = require("./help/member");
        let member = await command(guildMembers, user, settings);
        if (member) {
            let vialsDB = client.models.get("vials");
            let log = await vialsDB.findOne({where: {userID: member.id, guildID: message.guild.id}});
            if (log) {
                if (log.dataValues.numberOfVials !== 0) {
                    await vialsDB.update({numberOfVials: log.dataValues.numberOfVials - 1}, {where: {userID: member.id, guildID: message.guild.id}});
                }
                await vialsDB.update({numberOfVialsUsed: log.dataValues.numberOfVialsUsed + 1}, {where: {userID: member.id, guildID: message.guild.id}});
            } else {
                await vialsDB.create({
                    guildID: message.guild.id,
                    userID: member.id,
                    numberOfVials: 0,
                    numberOfVialsUsed: 1
                });
            }
            let logs = await vialsDB.findOne({where: {userID: member.id, guildID: message.guild.id}});
            message.channel.send(`Vial has now been used by ${member} (${member.displayName})`);
            message.guild.channels.get(settings.vialLogChannel).send(`Vial popped by ${member} (${member.displayName}), logged by ${author}. (${(log) ? `${logs.dataValues.numberOfVials} remaining vials` : "No logged vials found"})`);
        } else {
            message.channel.send(`Please provide a valid user to use a vial for.`);
        }
    }
}