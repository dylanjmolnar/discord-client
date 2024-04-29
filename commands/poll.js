const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Creates a poll with the specified arguements.",
    use: `poll "title" "option1" "option2"...`,
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let agras = message.content.toLowerCase().split(" ");
        let type = agras[1];
        if (!type) {
            return message.channel.send(`Please provide something to poll about.`).catch(e => {});
        }
        let member = guildMembers.get(message.author.id);
        if (type.split("/").length > 1) {
            let names = type.split("/");
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${(names.includes("cult") || names.includes("c")) ? "Cult or " : ""}${(names.includes("void") || names.includes("v")) ? "Void or " : ""}${(names.includes("fullskip") || names.includes("fullskipvoid") || names.includes("fsv")) ? "Fullskip Void" : ""}?`);
            embed.setDescription(`${(names.includes("cult") || names.includes("c")) ? `${client.emojisMisc.get("malus")} or ` : ""}${(names.includes("void") || names.includes("v")) ? `${client.emojisMisc.get("void")} or ` : ""}${(names.includes("fullskip") || names.includes("fullskipvoid") || names.includes("fsv")) ? `${client.emojisMisc.get("fullskip")}` : ""}`);
            embed.setFooter(`Started by ${member.displayName}`);
            message.channel.send(embed).then(async msg => {
                if (names.includes("cult") || names.includes("c")) {
                    await msg.react(client.emojisMisc.get("malus").id).catch(e => {});
                }
                if (names.includes("void") || names.includes("v")) {
                    await msg.react(client.emojisMisc.get("void").id).catch(e => {});
                }
                if (names.includes("fullskip") || names.includes("fullskipvoid") || names.includes("fsv")) {
                    await msg.react(client.emojisMisc.get("fullskip").id).catch(e => {});
                }
            }).catch(e => {});
            if ((message.mentions.members.size + message.mentions.roles.size) === 0 && !message.mentions.everyone) {
                message.delete().catch(e => {});
            }
        } else if (type === "us/eu" || type === "region" || type === "eu/us") {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Region for Location?`);
            embed.setDescription(`🇺🇸 | 🇪🇺 | 🇦🇺`);
            embed.setFooter(`Started by ${member.displayName}`);
            message.channel.send(embed).then(async msg => {
                await msg.react("🇺🇸").catch(e => {});
                await msg.react("🇪🇺").catch(e => {});
                await msg.react("🇦🇺").catch(e => {});
            }).catch(e => {});
            if ((message.mentions.members.size + message.mentions.roles.size) === 0 && !message.mentions.everyone) {
                message.delete().catch(e => {});
            }
        } else {
            let args = message.content.split(`"`).slice(1);
            if (args.length % 2 === 0 && message.content.indexOf(`"`) > 0) {
                if (args.length < 3) {
                    let title = args[0];
                    let embed = new Discord.MessageEmbed();
                    embed.setColor(0x79037c);
                    embed.setTitle(`📊${title}📊`);
                    embed.setFooter(`Started by ${member.displayName}`);
                    let myMessage = await message.channel.send(embed).catch(e => {});
                    await message.delete().catch(e => {});
                    await myMessage.react("👍").catch(e => {});
                    await myMessage.react("👎").catch(e => {});
                } else {
                    let title = args[0];
                    let content = "";
                    let counter = 1;
                    let emojis = [
                        "1⃣",
                        "2⃣",
                        "3⃣",
                        "4⃣",
                        "5⃣",
                        "6⃣",
                        "7⃣",
                        "8⃣",
                        "9⃣"
                    ];
                    for (let i = 0; i < args.length - 2; i += 2) {
                        content += `${emojis[counter - 1]} ${args[i + 2]}\n`;
                        counter++;
                        if (args[i + 2].length > 200) {
                            return message.channel.send(`Your options must be under 200 caracters.`);
                        }
                    }
                    let embed = new Discord.MessageEmbed();
                    embed.setColor(0x79037c);
                    embed.setTitle(`📊${title}📊`);
                    embed.setDescription(content);
                    embed.setFooter(`Started by ${member.displayName}`);
                    let myMessage = await message.channel.send(embed).catch(e => {});
                    for (let i = 0; i < counter - 1; i++) {
                        await myMessage.react(emojis[i]).catch(e => {});
                    }
                    if ((message.mentions.members.size + message.mentions.roles.size) === 0 && !message.mentions.everyone) {
                        message.delete().catch(e => {});
                    }
                }
            } else {
                message.channel.send(`That is an invalid format. Please use the format:\n\`\`\`\n${settings.prefix}poll "Title" "Option 1" "Option 2"...\n\`\`\`With up to 9 options. `);
            }
        }
    }
}