const Discord = require('discord.js');

module.exports = {
    aliases: ["restartVeri"],
    description: "Resets the verification message.",
    use: "resetVerification",
    cooldown: 5,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["veriChannel"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        await message.guild.channels.get(settings.veriChannel).messages.fetch({limit: 100}).then(async msgs => {
            await msgs.forEach(async e => {
                await e.delete().catch(e => {});
            });
        }).catch(e => {});
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Verification steps for ${message.guild.name}!`);
        embed.setDescription(`Steps to Verify:
        1. Make sure the bot can DM you.
        2. Set **everything in realmeye** public __except__ your last known location.
        3. Simply react with the ✅ below.
        4. Follow the instructions the bot sends.
        
        ⚠ Any questions and/or problems please pm myself (the bot) ⚠`);
        embed.setFooter(`Capitalization does not matter when using the command.`);
        embed.setColor(0x2c7e22);
        await message.guild.channels.get(settings.veriChannel).send(embed).then(msg => {
            msg.react("✅").catch(e => {});
        }).catch(e => {});
        await message.channel.send(`Verification message is now updated!`).catch(e => {});
    }
}