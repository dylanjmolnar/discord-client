module.exports = {
    aliases: ["av"],
    description: "Logs on the bot that a user has obtained a vial during a raid.",
    use: "addVial [user]",
    cooldown: 2,
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
                await vialsDB.update({numberOfVials: log.dataValues.numberOfVials + 1}, {where: {userID: member.id, guildID: message.guild.id}})
            } else {
                await vialsDB.create({
                    guildID: message.guild.id,
                    userID: member.id,
                    numberOfVials: 1,
                    numberOfVialsUsed: 0
                })
            }
            log = await vialsDB.findOne({where: {userID: member.id, guildID: message.guild.id}});
            message.channel.send(`Vial has now been added to ${member} (${member.displayName})`);
            message.guild.channels.get(settings.vialLogChannel).send(`Vial added to ${member} (${member.displayName}), logged by ${author}. (${(log) ? `${log.dataValues.numberOfVials} remaining vials` : "No logged vials found"})`);
        } else {
            message.channel.send(`Please provide a valid user to add a vial for.`);
        }
    }
}