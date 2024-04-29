module.exports = {
    aliases: ["getLoc"],
    description: "Sends the user the location of the afk check if there is one up.",
    use: "getLocation",
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
        if (guilds[message.guild.id].afkCheckUp) {
            if (guilds[message.guild.id].location !== "None") {
                let embedARL, embed = guilds[message.guild.id].aborter.embeds[0];
                let field = embed.fields.find(e => e.name.endsWith("With Location:"));
                if (!field.value.includes(message.author.id) && (author.roles.get(settings.nitroBooster) || author.roles.get(settings.keyRole1)) && !rlOrNot) {
                    if (guilds[message.guild.id].nitroBois.length > 9 && message.guild.id === "343704644712923138") {
                        return message.author.send(`Too many users have already recieved location. Wait for another afk check to try again.`);
                    }
                    guilds[message.guild.id].nitroBois.push(author);
                    field.value = (field.value === "None") ? `${author}` : `${field.value}, ${author}`;
                    await guilds[message.guild.id].aborter.edit(embed);
                    if (settings.sendARLChat) {
                        embedARL = guilds[message.guild.id].aborterARL.embeds[0];
                        let field1 = embedARL.fields.find(e => e.name.endsWith("With Location:"));
                        field1.value = (field1.value === "None") ? `${author}` : `${field1.value}, ${author}`;
                        await guilds[message.guild.id].aborterARL.edit(embedARL);
                    }
                }
                author.send(`The location of this run has been set to \`${guilds[message.guild.id].location}\`.`).catch(e => {
                    if (message.channel) {
                        message.channel.send(`${author} I cannot send you location because your dms are private. Please allow me to dm you to use this command.`);
                    }
                });
            } else {
                author.send(`There is no location set yet.`).catch(e => {
                    if (message.channel) {
                        message.channel.send(`${author} I cannot send you location because your dms are private. Please allow me to dm you to use this command.`);
                    }
                });
            }
        } else {
            author.send(`You cannot get a location because there is no afk check up.`).catch(e => {
                if (message.channel) {
                    message.channel.send(`${author} I cannot send you location because your dms are private. Please allow me to dm you to use this command.`);
                }
            });
        }
    }
}