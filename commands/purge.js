module.exports = {
    aliases: [],
    description: "Purges the message count specified and if a user is given then only by that user.",
    use: `purge [number] <user>`,
    cooldown: 5,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.toLowerCase().split(" ");
        let ammountToPurge = args[1];
        let personToPurge = args[2];
        if (!guildMembers.get(client.user.id).permissionsIn(message.channel.id).toArray().includes("MANAGE_MESSAGES")) {
            return message.channel.send("I Cannot purge this channel because I am missing permissions \`MANAGE_MESSAGES\` in this channel.");
        }
        let roles = [];
        let purgeRoles = await client.models.get("purgeroles").findAll({where: {guildID: message.guild.id}});
        let rolesArray = guildMembers.get(message.author.id).roles.keyArray();
        for (let i = 0; i < purgeRoles.length; i++) {
            if (rolesArray.includes(purgeRoles[i].dataValues.roleID)) {
                await roles.push(`Placeholder`);
            }
        }
        if (roles.length === 0) {
            return message.channel.send(`You do not have permission to use this command.`);
        }
        let command = await require("./help/member");
        let thingIGot;
        let options;
        if (personToPurge) {
            thingIGot = await command(guildMembers, personToPurge, settings);
        }
        let typeOfPurge = "";
        if (ammountToPurge) {
            if (parseInt(ammountToPurge) < 101 && parseInt(ammountToPurge) > 0) {
                options = {
                    limit: parseInt(ammountToPurge)
                }
                if (personToPurge) {
                    typeOfPurge = "person";
                } else {
                    typeOfPurge = "normal";
                }
            } else {
                return message.channel.send("Please provide a valid thing to purge.");
            }
        } else {
            return message.channel.send("Please provide a valid thing to purge.");
        }
        let channel = await message.channel;
        await message.delete();
        await channel.messages.fetch(options).then((messages) => {
            if (typeOfPurge === "person") {
                messages = messages.filter(e => e.author.id === thingIGot.user.id);
                messages.forEach(e => {
                    e.delete();
                });
            } else {
                message.channel.bulkDelete(messages, true);
            }
        });
    }
}