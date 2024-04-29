const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Resets the modmail public message.",
    use: "modmailReset",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["modmailSendChannel"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        await message.guild.channels.get(settings.modmailSendChannel).messages.fetch({limit: 100}).then(async msgs => {
            await msgs.forEach(async e => {
                await e.delete();
            })
        })
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Mod Mail for ${message.guild.name}!`);
        embed.setDescription(`If you want to give feedback or ask a question to the Moderation team, go ahead and message me, the bot!
        Raid Leaders aren't able to see this feedback.
        Please be advised all rules from our ${message.guild.channels.get(settings.rulesChannel)} apply when sending me messages!
        Spamming or using for unintended use may get you banned from the server or blacklisted from sending further mod mail.
        If you are in more than one server I am in, then you will have to select the numbered emojis when prompted to.`);
        embed.setColor(0x3651e2);
        await message.guild.channels.get(settings.modmailSendChannel).send(embed);
        await message.channel.send(`Modmail message is now updated!`);
    }
}