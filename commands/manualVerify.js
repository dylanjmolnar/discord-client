module.exports = {
    aliases: ["mv"],
    description: "Manually verifies the user specified under the nickname specified.",
    use: "manualVerify [user] [nickname]",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["raiderRole"],
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
            return message.channel.send(`Please provide a valid user to manually verify.`).catch(e => {});
        }
        if (member.roles.get(settings.raiderRole)) {
            return message.channel.send(`${member} is already verified so I cannot verify him again.`).catch(e => {});
        }
        let name = args[2];
        if (!name) {
            return message.channel.send(`Please provide a name to verify this user under.`).catch(e => {});
        }
        if (name.length > 10 || !/^[a-zA-Z]*$/.test(name)) {
            return message.channel.send(`Please provide a valid name to verify this user under.`).catch(e => {});
        }
        let commands = require("./help/nickname_search");
        let verifyingPerson = await commands(message.guild.id, guildMembers, name, settings);
        if (verifyingPerson) {
            return message.channel.send(`You cannot verify this user under this in game name as they are already verfied under the account ${verifyingPerson} (${verifyingPerson.user.tag}). Please deal with the other account before continuing.`).catch(e => {});
        }
        let blacklist = await client.models.get("expelled").findOne({where: {guildID: message.guild.id, inGameName: name.toLowerCase()}});
        if (blacklist) {
            await client.models.get("expelled").destroy({where: {guildID: message.guild.id, inGameName: name.toLowerCase()}});
        }
        await member.roles.add(settings.raiderRole).catch(e => {});
        if (member.user.username === name) {
            if (member.user.username.toLowerCase() === name) {
                await member.setNickname(name.toUpperCase()).catch(e => {});
            } else {
                await member.setNickname(name.toLowerCase()).catch(e => {});
            }
        } else {
            await member.setNickname(name).catch(e => {});
        }
        await message.channel.send(`${member} has now been verified as ${name} manually.`).catch(e => {});
        await member.send(`You are now verified!
__**How to join raids:**__
1: Wait until an afk check is active in <#${settings.AFKChecks}>. Once posted, it will ping \`@here\` so you know.
2: Join the voice channel that is now open, it will have \`<-- Join!\` in its name.
3: React with ${(settings.typeOfServer === "lh") ? `${client.emojisMisc.get("void")} or ${client.emojisMisc.get("malus")}` : (settings.typeOfServer === "shatters") ? client.emojisPortals.get("shatters") : client.emojisPortals.get("secludedthicket")} to make sure the bot doesn't move you at the end of the afk check.
4: Listen to the raid leaders instructions, they will speak in the voice channel.
        
Before joining any raids, make sure to read <#${(message.guild.id === "343704644712923138") ? "379504881213374475" : "492825466852474900"}> to make sure you do not break any of our raiding rules.
If broken, they can result in a warning or suspension.
        
Also make sure to read our <#${settings.rulesChannel}> channel for Discord chatting rules in the server.
        
If you have any questions, feel free to dm myself (the bot) with any questions and they will get sent through modmail.
~Happy Raiding <3`).catch(e => {});
    }
}