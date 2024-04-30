const Discord = require('discord.js');

module.exports = {
    aliases: ["vet"],
    description: "Sends a copy paste for veteran runs in raid status.",
    use: `veteran`,
    cooldown: 5,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["AFKChecks"],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let number = args[1];
        if (number) {
            number = parseInt(number);
        } else {
            return message.channel.send(`Please provide a valid channel to set at veteran runs.`);
        }
        let misc = client.emojisMisc;
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`This applies only to Restricted Class Runs (Raiding ${number})`);
        embed.setDescription(`${misc.get("warrior")}${misc.get("knight")}${misc.get("paladin")} must have at least a ${client.guilds.get("583844990401380363").emojis.find(e => e.name === "SwordofAcclaimT12")}
        ${misc.get(`wizard`)} must have at least ${client.guilds.get("583834659893542913").emojis.find(e => e.name === "StaffoftheCosmicWholeT12")} + ${client.guilds.get("583853269512749057").emojis.find(e => e.name === "ElementalDetonationSpellT6")} + ${client.guilds.get("583839502905376780").emojis.find(e => e.name === "RobeoftheGrandSorcererT13")} or better
        ${misc.get(`archer`)} ${misc.get(`huntress`)} must have ${client.guilds.get("583847032385699851").emojis.find(e => e.name === "BowoftheVoidUT")} or ${client.guilds.get("583847032385699851").emojis.find(e => e.name === "LeafBowUT")} or ${client.guilds.get("583847032385699851").emojis.find(e => e.name === "DeathlessCrossbowUT")}
        Assigned Classes: ${misc.get(`samurai`)} ${misc.get(`mystic`)} ${misc.get(`assassin`)} ${misc.get(`rogue`)} ${misc.get(`trickster`)} 
        Restricted Classes: ${misc.get(`sorcerer`)} ${misc.get(`ninja`)} ${misc.get(`necromancer`)}
        ${misc.get(`priest`)} must have 90+ mheal
        Must be maxed at least ${misc.get(`potion_of_attack`)} ${misc.get(`potion_of_dexterity`)} and max ${misc.get(`potion_of_speed`)} is recommended`);
        message.guild.channels.get((message.channel.id === settings.veteranCommandsChannel) ? settings.veteranCheckChannel : settings.AFKChecks).send(embed).catch(e => {});
    }
}