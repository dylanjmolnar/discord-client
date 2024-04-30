module.exports = {
    aliases: ["pSuspend", "permaSuspend"],
    description: "Permanently suspends the user specified.",
    use: `permanentSuspend [user] <reason>`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["suspensionsChannel"],
    roles: ["suspendedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let roles = [];
        let staffRoles = await client.models.get("muteroles").findAll({where: {guildID: message.guild.id}});
        let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
        for (let i = 0; i < staffRoles.length; i++) {
            if (authorRoles.includes(staffRoles[i].dataValues.roleID)) {
                roles.push(`Placeholder`);
            }
        }
        if (roles.length === 0) {
            return message.channel.send("You do not have permission to use this command.");
        }
        let args = message.content.split(" ");
        let thingToCheck = args.slice(1)[0];
        let reason = args.slice(2).join(" ");
        if (!guildMembers.get(client.user.id).hasPermission("MANAGE_ROLES")) {
            return message.channel.send("I cannot suspend anyone because I am missing permissions to `MANAGE_ROLES`.");
        }
        let command = require("./help/member");
        let person = await command(guildMembers, thingToCheck, settings);
        if (!person) {
            return message.channel.send("That is an invalid user to suspend.");
        }
        let suspendedOrNot = await client.models.get("suspensions").findOne({where: {guildID: message.guild.id, userID: person.id}});
        if (suspendedOrNot) {
            return message.channel.send(`That person is already suspended. If you want to perma suspend him, you must first unsuspend him.`);
        }
        let fetchedAuthor = guildMembers.get(message.author.id);
        let clientRoless = guildMembers.get(client.user.id).roles.highest.position;
        let authorRoless = fetchedAuthor.roles.highest.position;
        let userRoless = person.roles.highest.position, messager = "";
        if (userRoless >= clientRoless) {
            messager += `I cannot suspend ${person} (${person.displayName}) because their roles are higher or equal to mine.`;
        }
        if (userRoless >= authorRoless) {
            if (!messager) {
                messager += `I cannot suspend ${person} (${person.displayName}) because their roles are higher or equal to yours.`;
            } else {
                messager = messager.replace(".", ",");
                messager += ` and because their roles are higher or equal to yours.`;
            }
        }
        if (messager) {
            return message.channel.send(`${messager}`);
        }
        let msg = await message.guild.channels.get(settings.suspensionsChannel).send(`${person} (${person.displayName}) is now suspended permanently by ${guildMembers.get(message.author.id)}.${(reason) ? ` Reason: ${reason}`: ""}`);
        await client.models.get("suspensions").create({
            guildID: message.guild.id,
            userID: person.id,
            nickname: person.displayName,
            time: null,
            reason: reason || null,
            messageID: msg.id
        });
        await person.roles.forEach(async e => {
            if (parseInt(e.position) !== 0) {
                if (e.id !== settings.mutedRole) {
                    person.roles.remove(e.id).catch(error => {
                        message.channel.send(`I could not remove the \`${e.name}\` role for some reason, please be warry.`).catch(err => {});
                    });
                }
                if (e.id !== settings.mutedRole && e.id !== settings.tempKeyRole) {
                    await client.models.get("suspensionroles").create({
                        messageID: msg.id,
                        roleID: e.id
                    });
                }
            }
        });
        await person.roles.add(settings.suspendedRole);
        await message.channel.send(`${person} (${person.displayName}) is now suspended with no unsuspend time.`);
    }
}