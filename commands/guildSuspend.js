const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
    aliases: ["gs"],
    description: "Checks the users in a guild and sends the list in an embed and suspends anyone in the guild.",
    use: "guildSuspend [guild name]",
    cooldown: 20,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["suspensionsChannel"],
    roles: ["raiderRole", "suspendedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        if (!guildMembers.get(client.user.id).hasPermission("MANAGE_ROLES")) {
            return message.channel.send("I cannot suspend anyone because I am missing permissions to `MANAGE_ROLES`.");
        }
        let roles = [];
        let authorRoles = guildMembers.get(message.author.id).roles.keyArray();
        let guildSuspendDB = await client.models.get("guildsuspendroles").findAll({where: {guildID: message.guild.id}});
        for (let i = 0; i < guildSuspendDB.length; i++) {
            if (authorRoles.includes(guildSuspendDB[i].dataValues.roleID)) {
                roles.push(`Placeholder`);
            }
        }
        if (roles.length === 0) {
            return message.channel.send("You do not have permission to use this command.");
        }
        let args = message.content.split(" ");
        let guildLooking = args.slice(1).join("%20");
        let guildName = args.slice(1).join(" ");
        let url = `http://www.tiffit.net/RealmInfo/api/guild?g=${guildLooking}`;
        snekfetch.get(url, {headers: {'User-Agent': 'Dylanxdman'}}).then(async r => {
            if (r.body.error) {
                let suggestions = [];
                let mass = 5;
                if (r.body.suggestions.length < 5) {
                    mass = r.body.suggestions.length;
                }
                for (i = 0; i < mass; i++) {
                    suggestions.push(`\`${r.body.suggestions[i]}\``)
                }
                return message.channel.send(`That is an invalid guild. Suggested guilds:\n${suggestions.join(",\n")}`);
            }
            let command = await require("./help/nickname_search");
            let bois = [];
            if (r.body.members) {
                let guildMemberss = Object.keys(r.body.members);
                for (let i = 0; i < guildMemberss.length; i++) {
                    let name = r.body.members[guildMemberss[i]].name;
                    let person = await command(message.guild.id, guildMembers, name, settings);
                    if (person === null) {
                        if (name.toLowerCase() === "private") {
                            bois.push("__Private Member__");
                        } else {
                            bois.push(name);
                        }
                    } else {
                        if (person.user) {
                            if (person.roles.get(settings.raiderRole)) {
                                person.roles.forEach(e => {
                                    if (parseInt(e.position) !== 0) {
                                        person.roles.remove(e.id);
                                    }
                                });
                                person.roles.add(settings.suspendedRole);
                                message.guild.channels.get(settings.suspensionsChannel).send(`${person} is now suspended because your current guild is now blacklisted. You can appeal after leaving the guild.`);
                            }
                        }
                        if (person.nickname.includes(" | ")) {
                            bois.push(`${person} (${name})`);
                        } else {
                            bois.push(`${person}`);
                        }
                    }
                }
            }
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Guild pannel for \`${guildName}\`!`);
            embed.setDescription(`Members in the guild (Total number of members is \`${r.body.memberCount}\`):\n${bois.join(", ")}`);
            embed.addField(`Guild Description:`, `${r.body.desc[0]}\n${r.body.desc[1]}\n${r.body.desc[2]}`);
            message.channel.send(embed);
        });
    }
}