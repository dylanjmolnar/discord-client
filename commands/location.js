module.exports = {
    aliases: ["loc"],
    description: "Changes the location of the run to the location provided.",
    use: "location [new location]",
    cooldown: 1,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (guilds[message.guild.id].afkCheckUp) {
            let args = message.content.split(" ");
            let location = args.slice(1).join(" ");
            if (location) {
                guilds[message.guild.id].location = location;
                let embedARL, embed = guilds[message.guild.id].aborter.embeds[0];
                let field = embed.fields.find(e => e.name === "Location of Run:");
                field.value = location;
                await guilds[message.guild.id].aborter.edit(embed);
                if (settings.sendARLChat) {
                    embedARL = guilds[message.guild.id].aborterARL.embeds[0];
                    let field1 = embedARL.fields.find(e => e.name === "Location of Run:");
                    field1.value = location;
                    await guilds[message.guild.id].aborterARL.edit(embedARL);
                }
                for (let i = 0; i < guilds[message.guild.id].keyBois.length; i++) {
                    guilds[message.guild.id].keyBois[i].send(`The raid leader has changed the location to: \`${location}\`. Please go there ASAP.`);
                }
                for (let i = 0; i < guilds[message.guild.id].vialBois.length; i++) {
                    guilds[message.guild.id].vialBois[i].send(`The raid leader has changed the location to: \`${location}\`. Please go there ASAP.`);
                }
                for (let i = 0; i < guilds[message.guild.id].rusherBois.length; i++) {
                    guilds[message.guild.id].rusherBois[i].send(`The raid leader has changed the location to: \`${location}\`. Please go there ASAP.`);
                }
                for (let i = 0; i < guilds[message.guild.id].nitroBois.length; i++) {
                    guilds[message.guild.id].nitroBois[i].send(`The raid leader has changed the location to: \`${location}\`. Please go there ASAP.`);
                }
                await message.channel.send(`The location of the run has now been changed to: ${location}`);
            } else {
                return message.channel.send("Please provide a valid location with the command.");
            }
        } else {
            if (!guilds[message.guild.id].finding) {
                return message.channel.send(`You cannot change the location of the run if no afk check is up.`);
            }
        }
    }
}