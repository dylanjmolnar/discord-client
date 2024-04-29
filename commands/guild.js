const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
    aliases: [],
    description: "Checks the users in a guild and sends the list in an embed.",
    use: "guild [guild name]",
    cooldown: 10,
    type: "misc",
    dms: false,
    public: true,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        if (!args[1]) {
            return message.channel.send("Please provide a guild to look up!");
        }
        let guildLooking = args.slice(1).join("%20");
        let guildName = args.slice(1).join(" ");
        let url = "http://www.tiffit.net/RealmInfo/api/guild?g=" + guildLooking;
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
            message.channel.send("Looking for guild and members in this Discord, this could take a couple seconds...").catch(e => {});
            let command = await require("./help/nickname_search");
            let bois = [];
            if (r.body.members) {
                let guildMemberss = await Object.keys(r.body.members);
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