const Discord = require('discord.js');

module.exports = {
    aliases: ["restartVeteranVeri", "rvv"],
    description: "Resets the veteran verification message.",
    use: "restartVeteranVerification",
    cooldown: 5,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["veteranVeriChannel"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Veteran Verification for ${message.guild.name}!`);
        embed.setDescription(`React with ✅ to get the role, and react with ❌ to remove the role.
        With the role you get access to our veteran channels.
        Make sure you have your graveyard and character list public before attempting to apply!
        **__Requirements:__** ${(settings.veteranVeriChar !== 0) ? `\n-${settings.veteranVeriChar} ${settings.veteranVeriMaxed}/8 Character${(settings.veteranVeriChar > 1) ? "s" : ""}\n-1 ${settings.veteranVeriMaxed}/8 Melee Character` : ""}${(settings.veteranVeriRuns !== 0) ? `\n-${settings.veteranVeriRuns} ${(settings.typeOfServer === "lh") ? "Lost Halls" : "Shatters"} Runs Completed\n\nThis check only counts dead characters. If you have 100 runs on alive characters, go ahead and dm me through modmail for help. To see how many runs you have completed dm me \`${settings.prefix}stats\` to see how many I have logged!` : ""}`);
        try {
            let mess = await message.guild.channels.get(settings.veteranVeriChannel).messages.fetch(settings.veriVeteranMessage);
            mess.edit(embed).catch(e => {});
            message.channel.send(`Veteran verification message is now updated!`).catch(e => {});
        } catch(e) {
            await message.guild.channels.get(settings.veteranVeriChannel).messages.fetch({limit: 100}).then(async msgs => {
                await msgs.forEach(async e => {
                    await e.delete().catch(e => {});
                });
            }).catch(e => {});
            await message.guild.channels.get(settings.veteranVeriChannel).send(embed).then(async msg => {
                await client.models.get("guild").update({veriVeteranMessage: msg.id}, {where: {guildID: message.guild.id}}).catch(e => {});
                await msg.react("✅").catch(e => {});
                await msg.react("❌").catch(e => {});
            }).catch(e => {});
            await message.channel.send(`Veteran verification message is now updated!`).catch(e => {});
        }
    }
}