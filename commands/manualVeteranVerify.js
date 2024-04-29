module.exports = {
    aliases: ["manualVetVerify", "mvv"],
    description: "Manually verifies the user specified as a veteran raider.",
    use: "manualVeteranVerify [user]",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["veteranRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
        let staffRoles = await client.models.get("muteroles").findAll({where: {guildID: message.guild.id}});
        let roles = [];
        for (let i = 0; i < staffRoles.length; i++) {
            if (authorRoles.includes(staffRoles[i].dataValues.roleID)) {
                roles.push(`Placeholder`);
            }
        }
        if (roles.length === 0) {
            return message.channel.send(`You do not have permission to use this command.`).catch(e => {});
        }
        let args = message.content.split(" ");
        let user = args[1];
        let command = require("./help/member");
        let member = await command(guildMembers, user, settings);
        if (!member) {
            return message.channel.send(`Please provide a valid user to manually verify as a veteran.`).catch(e => {});
        }
        if (member.roles.get(settings.veteranRole)) {
            return message.channel.send(`${member} is already verified as a veteran so I cannot verify him again.`).catch(e => {});
        }
        await member.roles.add(settings.veteranRole).catch(e => {});
        await message.channel.send(`${member} has now been verified as a veteran raider manually.`).catch(e => {});
        await member.send(`You are now verified as a veteran!`).catch(e => {});
    }
}