module.exports = {
    aliases: ["getELoc", "getEventLoc", "getELocation"],
    description: "Sends the user the location of the event afk check if there is one up.",
    use: "getEventLocation",
    cooldown: 1,
    type: "raid",
    dms: true,
    public: true,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let author = guildMembers.get(message.author.id);
        let rlOrNot = false;
        let autoMuteRoles = await client.models.get("automuteroles").findAll({where: {guildID: message.guild.id}});
        let personRoles = author.roles.keyArray();
        for (let i = 0; i < autoMuteRoles.length; i++) {
            if (personRoles.includes(autoMuteRoles[i].dataValues.roleID)) {
                rlOrNot = true;
                break;
            }
        }
        if ((!author.roles.get(settings.keyRole1) && !author.roles.get(settings.nitroBooster)) || !author.roles.get(settings.raiderRole)) {
            if (!rlOrNot) {
                if (message.member) {
                    return message.react("❌").catch(e => {});
                } else {
                    return author.user.createDM().then(dmChannel => {
                        dmChannel.messages.fetch(message.id).then(async mess => {
                            mess.react("❌").catch(e => {});
                        }).catch(e => {});
                    });
                }
            }
        }
        if (message.member) {
            message.react("✅").catch(e => {});
        } else {
            author.user.createDM().then(dmChannel => {
                dmChannel.messages.fetch(message.id).then(async mess => {
                    mess.react("✅").catch(e => {});
                }).catch(e => {});
            });
        }
        if (guilds[message.guild.id].eventAfkCheckUp) {
            if (guilds[message.guild.id].eventLocation !== "None") {
                author.send(`The location of this event run has been set to \`${guilds[message.guild.id].eventLocation}\`.`).catch(e => {
                    message.channel.send(`${author} I cannot send you location because your dms are private. Please allow me to dm you to use this command.`);
                });
            } else {
                author.send(`There is no location set yet.`).catch(e => {
                    message.channel.send(`${author} I cannot send you location because your dms are private. Please allow me to dm you to use this command.`);
                });
            }
        } else {
            author.send(`You cannot get a location because there is no event afk check up.`).catch(e => {
                message.channel.send(`${author} I cannot send you location because your dms are private. Please allow me to dm you to use this command.`);
            });
        }
    }
}