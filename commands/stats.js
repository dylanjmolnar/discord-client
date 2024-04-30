const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Lists users runs stats for the server.",
    use: `stats <user>`,
    cooldown: 1,
    type: "misc",
    dms: true,
    public: true,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let embed = new Discord.MessageEmbed();
        let args = message.content.split(" ");
        let author = guildMembers.get(message.author.id);
        if (message.member) {
            await message.react("✅").catch(e => {});
        } else {
            author.user.createDM().then(dmChannel => {
                dmChannel.messages.fetch(message.id).then(async mess => {
                    mess.react("✅").catch(e => {});
                }).catch(e => {});
            });
        }
        let user = args[1];
        let member = author;
        let userCommand = require("./help/member");
        if (user) {
            member = await userCommand(guildMembers, user, settings);
        }
        if (!member) {
            return author.send(`That is an invalid user to find stats for.`);
        }
        let keys = await client.models.get("kp").findOne({where: {guildID: message.guild.id, userID: member.user.id}});
        let total = await client.models.get("totallogs").findOne({where: {guildID: message.guild.id, userID: member.user.id}});
        let vials = await client.models.get("vials").findOne({where: {guildID: message.guild.id, userID: member.user.id}});
        let runs = await client.models.get("completedruns").findOne({where: {guildID: message.guild.id, userID: member.user.id}});
        let soloCult = await client.models.get("solocults").findOne({where: {guildID: message.guild.id, userID: member.user.id}});
        let server = await client.models.get("typeprofile").findOne({where: {guildID: message.guild.id}});
        const serverType = server.dataValues.type;
        let typeName = (client.emojisPortals.get(serverType)) ? client.emojisPortals.get(serverType).name.split("_").join(" ") : "Lost Halls";
        embed.setColor(0x00e636);
        embed.setThumbnail(member.user.displayAvatarURL());
        embed.setDescription(`${(serverType === "lh") ? client.emojisMisc.get("lhportal") : client.emojisPortals.get(serverType)}__** Statistics for ${member.displayName} on server: ${message.guild.name}**__${(serverType === "lh") ? client.emojisMisc.get("lhportal") : client.emojisPortals.get(serverType)}
        
        ${(serverType === "lh") ? client.emojisKeys.get("losthalls") : client.emojisKeys.get(serverType)}__** Keys Popped **__${(serverType === "lh") ? client.emojisKeys.get("losthalls") : client.emojisKeys.get(serverType)}
        ${typeName}: ${(keys) ? keys.numberOfRegular : "0"}
        Other: ${(keys) ? keys.numberOfEvent : "0"}
        
        __**Runs Done**__
        ${(serverType === "lh") ? "Void" : typeName}: ${(runs) ? runs.runType1 : "0"}${(serverType === "lh") ? `\nCult: ${(runs) ? runs.runType2 : "0"}` : ""}${(serverType === "lh") ? `\nSolo Cults: ${(soloCult) ? soloCult.dataValues.numberOfRuns : "0"}` : ""}
        Other: ${(runs) ? runs.runType3 : "0"}
    
        __**Runs Led**__
        ${(serverType === "lh") ? "Void" : "Successful"}: ${(total) ? total.numberOfVoid : "0"}
        ${(serverType === "lh") ? "Cult" : "Failed"}: ${(total) ? total.numberofCult : "0"}
        Event: ${(total) ? total.numberOfEvent : "0"}
        Assisted: ${(total) ? total.numberOfAssists : "0"}
        Assisted Event: ${(total) ? total.numberOfEventAssists : "0"}
        
        ${(serverType === "lh") ? `${client.emojisMisc.get("vial")}__** Vials **__${client.emojisMisc.get("vial")}
        Stored: ${(vials) ? vials.numberOfVials : "0"}
        Used: ${(vials) ? vials.numberOfVialsUsed : "0"}` : ""}`);
        embed.setFooter(`Member #${guildMembers.sort((a, b) => {
            if (a.joinedTimestamp && b.joinedTimestamp) {
                return a.joinedTimestamp - b.joinedTimestamp;
            }
        }).keyArray().indexOf(member.id) + 1} | Joined at`);
        embed.setTimestamp(member.joinedAt);
        await author.send(embed).catch(e => {});
    }
}