const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Unmutes the user specified.",
    use: `unMute [user] <reason>`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: ["mutedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let roles = [];
        let muteRoles = await client.models.get("muteroles").findAll({where: {guildID: message.guild.id}});
        let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
        for (let i = 0; i < muteRoles.length; i++) {
            if (authorRoles.includes(muteRoles[i].dataValues.roleID)) {
                roles.push(`Placeholder`);
            }
        }
        if (roles.length === 0) {
            return message.channel.send("You do not have permission to use this command.");
        }
        let args = message.content.toLowerCase().split(" ");
        let thingToCheck = args[1];
        if (!guildMembers.get(client.user.id).hasPermission("MANAGE_ROLES")) {
            return message.channel.send("I cannot unmute anyone because I am missing permissions to `MANAGE_ROLES`.");
        }
        if (!thingToCheck) {
            return message.channel.send(`Please provide a valid user or user ID to unmute.`).catch(e => {});
        }
        let command = require("./help/member");
        let person = await command(guildMembers, thingToCheck, settings);
        let muteLog = await client.models.get("mutes").findOne({where: {guildID: message.guild.id, userID: thingToCheck}});
        let validID = "";
        if (!person && !muteLog) {
            return message.channel.send("That is an invalid user to unmute.");
        } else if (!person && muteLog) {
            validID = thingToCheck;
            message.channel.send(`<@${thingToCheck}> (left server) is now unmuted.`);
            await client.models.get("mutes").destroy({where: {guildID: message.guild.id, userID: thingToCheck}});
        } else {
            validID = person.user.id;
            muteLog = await client.models.get("mutes").findOne({where: {guildID: message.guild.id, userID: validID}});
            if (muteLog) {
                await message.channel.send(`${person} (${person.displayName}) is now unmuted.`);
                await person.roles.remove(settings.mutedRole);
            }
        }
        if (muteLog) {
            await client.models.get("mutes").destroy({where: {guildID: message.guild.id, userID: validID}});
        } else {
            if (person.roles.get(settings.mutedRole)) {
                await message.channel.send(`I have no log of him muted but he does seem to have the \`${message.guild.roles.get(settings.mutedRole).name}\` role. Do you want me to manually unmute him?`);
                let filter = (msg) => msg.author.id === message.author.id || msg.author.id === "321726133307572235";
                let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
                let found = false;
                collector.on("collect", async (mess) => {
                    let content = (mess.content) ? mess.content.toLowerCase() : "";
                    if (content === `${settings.prefix}yes` || content === `-yes` || content === `yes` || content === `y`) {
                        found = true;
                        await message.channel.send(`${person} (${person.displayName}) is now unmuted.`);
                        await person.roles.remove(settings.mutedRole);
                        await person.send(`You are now unmuted.`).catch();
                        collector.stop();
                    } else if (content === `${settings.prefix}no` || content === `-no` || content === `no` || content === `n`) {
                        found = true;
                        await message.channel.send(`Command aborted.`);
                        collector.stop();
                    } else {
                        message.channel.send(`Please provide a valid response: \`yes\` or \`no\`.`);
                    }
                });
                collector.on("end", (collected) => {
                    if (!found) {
                        message.channel.send(`Command aborted as no response was given.`);
                    }
                });
            } else {
                return message.channel.send(`I cannot unmute that user as I have no log and they do not have the \`${message.guild.roles.get(settings.mutedRole).name}\` role.`);
            }
        }
    }
}