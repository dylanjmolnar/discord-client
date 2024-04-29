const Discord = require('discord.js');

module.exports = {
    aliases: ["pUnSuspend", "permaUnSuspend"],
    description: "Un-perma suspends the user specified.",
    use: `permanentUnSuspend [user] <reason>`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["suspensionsChannel"],
    roles: ["suspendedRole", "raiderRole"],
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
        let suspensionsDB = client.models.get("suspensions");
        let args = message.content.split(" ");
        let thingToCheck = args.slice(1)[0];
        if (!guildMembers.get(client.user.id).hasPermission("MANAGE_ROLES")) {
            return message.channel.send("I cannot unsuspend anyone because I am missing permissions to \`MANAGE_ROLES\`.");
        }
        let reason = args.slice(2).join(" ");
        let command = require("./help/member");
        let person = await command(guildMembers, thingToCheck, settings);
        let thingy;
        let suspension = await suspensionsDB.findOne({where: {GuildID: message.guild.id, userID: thingToCheck}});
        if (!person && !suspension) {
            return message.channel.send("Please provide a valid user to unsuspend.");
        } else if (!person && suspension) {
            thingy = thingToCheck;
        } else {
            thingy = person.user.id;
        }
        if (!suspension) {
            suspension = await suspensionsDB.findOne({where: {GuildID: message.guild.id, userID: thingy}});
        }
        if (person.roles.get(settings.suspendedRole)) {
            await person.roles.remove(settings.suspendedRole);
            if (suspension) {
                let roles = await client.models.get("suspensionroles").findAll({where: {messageID: suspension.dataValues.messageID}});
                for (let i = 0; i < roles.length; i++) {
                    await person.roles.add(roles[i].dataValues.roleID);
                    await client.models.get("suspensionroles").destroy({where: {messageID: suspension.dataValues.messageID, roleID: roles[i].dataValues.roleID}});
                }
            } else {
                await person.roles.add(settings.raiderRole);
            }
            await message.channel.send(`${person} (${person.displayName}) is now unsuspended.`);
            await message.guild.channels.get(settings.suspensionsChannel).send(`${person} (${person.displayName}) is now unsuspended by ${guildMembers.get(message.author.id)}.${(reason) ? ` Reason: ${reason}`: ""}`);
        } else {
            if (person.roles.get(settings.suspendedButVerifiedRole)) {
                let embed = new Discord.MessageEmbed();
                embed.setDescription(`I have no record of ${person} (${person.displayName}) being suspended but he does have ${message.guild.roles.get(settings.suspendedButVerified)}. I would recommend using the \`${settings.prefix}unsuspend\` command instead or checking if they are suspended using a different bot.`);
                message.channel.send(embed);
            } else {
                return message.channel.send(`${person} (${person.displayName}) does not seem to be suspended.`);
            }
        }
    }
}