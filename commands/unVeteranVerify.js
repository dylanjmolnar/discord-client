module.exports = {
    aliases: ["unVetVerify"],
    description: "Unverifies a veteran raider by removing their Veteran Raider role and dming them the reason.",
    use: "unVeteranVerify [user] <reason>",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["veteranRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let userToFind = args[1];
        let command = require("./help/member");
        let member = await command(guildMembers, userToFind, settings);
        let vetRole = message.guild.roles.get(settings.veteranRole);
        if (!member) {
            return message.channel.send(`Please provide a valid user to unverify from the \`${vetRole.name}\` role.`).catch(e => {});
        }
        if (member.roles.get(settings.veteranRole)) {
            let reason = args.slice(2).join(" ");
            if (!reason) {
                return message.channel.send(`Please provide a reason as to why the user is being unverified from \`${vetRole.name}\` role.`).catch(e => {});
            }
            let mod = guildMembers.get(message.author.id);
            await message.channel.send(`${member} (${member.displayName}) has now been unverified from \`${vetRole.name}\` role!`).catch(e => {});
            await member.roles.remove(settings.veteranRole).catch(e => {});
            await member.user.send(`You have now been unverified from \`${vetRole.name}\` by ${mod} (${mod.displayName}).\nReason: ${reason}`).catch(e => {});
        } else {
            return message.channel.send(`I cannot unverify ${member} (${member.displayName}) because he does not seem to be a \`${vetRole.name}\`.`).catch(e => {});
        }
    }
}