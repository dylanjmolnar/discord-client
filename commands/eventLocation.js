module.exports = {
    aliases: ["eLoc", "el", "eventLoc", "eLocation"],
    description: "Changes the location of an event afk check.",
    use: "eventLocation [location]",
    cooldown: 2,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (guilds[message.guild.id].eventAfkCheckUp) {
            let args = message.content.split(" ");
            let location = args.slice(1).join(" ");
            if (location) {
                guilds[message.guild.id].eventLocation = location;
                let embedARL, embed = guilds[message.guild.id].eventAborter.embeds[0];
                if (embed.color === 0x000080) {
                    embed.fields[2].value = location;
                } else {
                    embed.fields[1].value = location;
                }
                if (settings.sendARLChat) {
                    embedARL = guilds[message.guild.id].eventAborterARL.embeds[0];
                    if (embed.color === 0x000080) {
                        embedARL.fields[2].value = location;
                    } else {
                        embedARL.fields[1].value = location;
                    }
                }
                for (let i = 0; i < guilds[message.guild.id].eventKeyBois.length; i++) {
                    guilds[message.guild.id].eventKeyBois[i].send(`The raid leader has changed the location to: \`${location}\`. Please go there ASAP.`);
                }
                for (let i = 0; i < guilds[message.guild.id].eventVialBois.length; i++) {
                    guilds[message.guild.id].eventVialBois[i].send(`The raid leader has changed the location to: \`${location}\`. Please go there ASAP.`);
                }
                if (settings.sendARLChat) {
                    guilds[message.guild.id].eventAborterARL.edit(embedARL);
                }
                guilds[message.guild.id].eventAborter.edit(embed);
                message.channel.send(`The location of the event run has now been changed to: ${location}`);
            } else {
                return message.channel.send("Please provide a valid location with the command.");
            }
        } else {
            if (!guilds[message.guild.id].finding) {
                return message.channel.send(`You cannot change the location of the run if no event afk check is up.`);
            }
        }
    }
}