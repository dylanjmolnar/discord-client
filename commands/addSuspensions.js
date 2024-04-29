module.exports = {
    aliases: [],
    description: "Dev command.",
    use: "addSuspensions",
    cooldown: 0,
    type: "private",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["suspendedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let suspendedUsers = guildMembers.filter(e => e.roles.get(settings.suspendedRole)).array();
        let logs = await client.models.get('suspensions').findAll({where: {guildID: message.guild.id}});
        for (let i = 0; i < suspendedUsers.length; i++) {
            let susLog = logs.find(e => e.dataValues.userID === suspendedUsers[i].user.id);
            if (!susLog) {
                await client.models.get("suspensions").create({
                    guildID: message.guild.id,
                    userID: suspendedUsers[i].id,
                    nickname: suspendedUsers[i].nickname || null,
                    time: null,
                    reason: null,
                    messageID: 22000 + i
                });
                await client.models.get("suspensionroles").create({
                    messageID: 22000 + i,
                    roleID: settings.raiderRole
                });
                await message.channel.send(`Suspension profile ceated for ${suspendedUsers[i]} (${suspendedUsers[i].displayName})`);
            }
        }
    }
}