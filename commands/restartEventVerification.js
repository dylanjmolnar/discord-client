const Discord = require('discord.js');

module.exports = {
    aliases: ["rev", "restartEventVeri"],
    description: "Resets the event verification message.",
    use: "resetEventVerification",
    cooldown: 5,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["eventVeriChannel"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        await message.guild.channels.get(settings.eventVeriChannel).messages.fetch({limit: 100}).then(async msgs => {
            await msgs.forEach(async e => {
                await e.delete().catch(e => {});
            });
        }).catch(e => {});
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Event Verification for ${message.guild.name}!`);
        embed.setDescription(`react with ✅ to get the role and react with ❌ to remove the role.
        With the role you get access to our event channels.`);
        await message.guild.channels.get(settings.eventVeriChannel).send(embed).then(async msg => {
            await client.models.get("guild").update({veriEventMessage: msg.id}, {where: {guildID: message.guild.id}}).catch(e => {});
            await msg.react("✅").catch(e => {});
            await msg.react("❌").catch(e => {});
        }).catch(e => {});
        await message.channel.send(`Verification message is now updated!`).catch(e => {});
    }
}