module.exports = {
    aliases: [],
    description: "Adds a solocult to the users solocult count.",
    use: "soloCult [user]",
    cooldown: 2,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let user = args[1];
        let command = require("./help/member");
        let member = await command(guildMembers, user, settings);
        if (member) {
            let soloCultDB = client.models.get("solocults");
            let log = await soloCultDB.findOne({where: {userID: member.id, guildID: message.guild.id}});
            if (log) {
                await soloCultDB.update({numberOfRuns: log.dataValues.numberOfRuns + 1}, {where: {userID: member.id, guildID: message.guild.id}})
            } else {
                await soloCultDB.create({
                    guildID: message.guild.id,
                    userID: member.id,
                    numberOfRuns: 1
                })
            }
            log = await soloCultDB.findOne({where: {userID: member.id, guildID: message.guild.id}});
            message.channel.send(`Solo Cult has now been added to ${member} (${member.displayName}). They have ${log.dataValues.numberOfRuns} solo cults including this one!`).catch(e => {});
        } else {
            message.channel.send(`Please provide a valid user to add a solo cult for.`);
        }
    }
}