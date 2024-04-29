module.exports = {
    aliases: [],
    description: "Unverifies a user by removing their Raider role and removing their nickname.",
    use: "unVerify [user] <reason>",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let userToFind = args[1];
        let command = require("./help/member");
        let member = await command(guildMembers, userToFind, settings);
        if (!member) {
            return message.channel.send(`Please provide a valid user to unverify.`).catch(e => {});
        }
        if (member.roles.get(settings.raiderRole) && member.nickname) {
            let reason = args.slice(2).join(" ");
            if (!reason) {
                return message.channel.send(`Please provide a reason as to why the user is being unverified.`).catch(e => {});
            }
            let mod = guildMembers.get(message.author.id);
            await message.channel.send(`${member} (${member.displayName}) has now been unverified!`).catch(e => {});
            await member.setNickname("").catch(e => {});
            await member.roles.forEach(async e => {
                if (parseInt(e.position) !== 0) {
                    if (e.id !== settings.mutedRole) {
                        await member.roles.remove(e.id);
                    }
                }
            });
            await member.user.send(`You have now been unverified by ${mod} (${mod.displayName}).\nReason: ${reason}`).catch(e => {});
        } else {
            return message.channel.send(`I cannot unverify ${member} (${member.displayName}) because he does not seem to be verified.`).catch(e => {});
        }
    }
}