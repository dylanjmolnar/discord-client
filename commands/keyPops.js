const Discord = require('discord.js');

module.exports = {
    aliases: ["kp", "keyPop"],
    description: "Adds, removes, or lists people with the Temp key role..",
    use: "keyPops [add | remove | list] <user>",
    cooldown: 3,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["tempKeyRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let addOrRemove = args[1];
        let person = args.slice(2).join(" ");
        if (!addOrRemove) {
            return message.channel.send(`Please provide a valid operation: \`add\`, \`remove\`, and \`list\`.`);
        }
        addOrRemove = addOrRemove.toLowerCase();
        if (addOrRemove !== "add" && addOrRemove !== "remove" && addOrRemove !== "list") {
            return message.channel.send(`Please provide a valid operation: \`add\`, \`remove\`, and \`list\`.`);
        }
        let command = require("./help/member");
        let foundPerson = await command(guildMembers, person, settings);
        if (!foundPerson && addOrRemove !== "list") {
            return message.channel.send(`Please provide a valid user to change roles for.`);
        }
        if (addOrRemove === "add") {
            foundPerson.roles.add(settings.tempKeyRole);
            message.channel.send(`${foundPerson} (${foundPerson.displayName}) is now given the Key Popper Role.`);
        } else if (addOrRemove === "remove") {
            foundPerson.roles.remove(settings.tempKeyRole);
            message.channel.send(`${foundPerson} (${foundPerson.displayName}) is now removed from the Key Popper Role.`);
        } else if (addOrRemove === "list") {
            let myPeople = guildMembers.filter(e => e.roles.get(settings.tempKeyRole)).array();
            let embed = new Discord.MessageEmbed();
            embed.setDescription(`__There ${(myPeople.length === 1) ? "is" : "are"} \`${myPeople.length}\` user${(myPeople.length === 1) ? "" : "s"} with ${message.guild.roles.get(settings.tempKeyRole)}!__\n${myPeople.join(", ")}`);
            message.channel.send(embed);
        }
    }
}