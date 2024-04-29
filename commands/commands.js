const Discord = require('discord.js');

module.exports = {
    aliases: ["command"],
    description: "Lists all commands and gives more in depth info on some commands.",
    use: "commands <command>",
    cooldown: 0,
    type: "misc",
    dms: true,
    public: true,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.toLowerCase().split(" ");
        let typeOfCommand = args.slice(1).join(" ");
        let embed = new Discord.EmbedBuilder();
        embed.setColor(0x6effff);
        let command = client.commands.get(typeOfCommand) || client.commands.filter(e => e.aliases).find(e => e.aliases.find(e => e.toLowerCase() === typeOfCommand));
        if (!typeOfCommand) {
            let rlOrNot = false;
            let member = guildMembers.get(message.author.id);
            let autoMuteRoles = await client.models.get("automuteroles").findAll({where: {guildID: message.guild.id}});
            console.log(member.roles)
            let personRoles = member.roles.keyArray();
            for (let i = 0; i < autoMuteRoles.length; i++) {
                if (personRoles.includes(autoMuteRoles[i].dataValues.roleID)) {
                    rlOrNot = true;
                    break;
                }
            }
            let raidingCommands = (rlOrNot) ? ["afks"] : [];
            let moderationCommands = [];
            let musicCommands = [];
            let miscCommands = [];
            let privateCommands = [];
            let listOfCommands = client.commandss.keyArray().sort();
            for (let i = 0; i < listOfCommands.length; i++) {
                let command = client.commands.get(listOfCommands[i].toLowerCase());
                let commandText = `${listOfCommands[i]}${(command.dms) ? "*" : ""}`
                if (rlOrNot || command.public) {
                    if (command.type === "raid") {
                        raidingCommands.push(commandText);
                    } else if (command.type === "mod") {
                        moderationCommands.push(commandText);
                    } else if (command.type === "music") {
                        musicCommands.push(commandText);
                    } else if (command.type === "misc") {
                        miscCommands.push(commandText);
                    } else if (command.type === "private") {
                        privateCommands.push(commandText);
                    }
                }
            }
            embed.setDescription(`**__Raiding:__**
            \`\`\`css\n${raidingCommands.sort().join(`; `)}\n\`\`\`${(moderationCommands.length > 0) ? `\n**__Moderation:__**\`\`\`css\n${moderationCommands.join(`; `)}\n\`\`\`` : ""}${(musicCommands.length > 0) ? `**__Music:__**\n\`\`\`css\n${musicCommands.join(`; `)}\n\`\`\`` : ""}
            **__Miscellaneous:__**
            \`\`\`css\n${miscCommands.join(`; `)}\n\`\`\`${(message.author.id === "321726133307572235") ? `\n**__Developer:__**\n\`\`\`css\n${privateCommands.join(`; `)}\n\`\`\`` : ""}
            
            * -> Usable in dms of the bot
            To learn more about a command, use the command \`${settings.prefix}commands <command name>\``);
        } else if (typeOfCommand === "afks") {
            let portals = client.emojisPortals;
            let keys = client.emojisKeys;
            let misc = client.emojisMisc;
            embed.setTitle("Info on the types of afk checks you can do!");
            let peeps = portals.keyArray().sort();
            let name = `${misc.get("void")} ${keys.get("losthalls")} Void (void)\n`;
            name = name.concat(`${misc.get("malus")} ${keys.get("losthalls")} Cult (cult)`);
            embed.setDescription(name);
            let currentFieldNumber = -1;
            for (let i = 0; i < portals.array().length; i++) {
                let embedLength = embed.title.length + (embed.description) ? embed.description.length : 0;
                for (let i = 0; i < embed.fields.length; i++) {
                    embedLength += embed.fields[i].name.length
                    embedLength += embed.fields[i].value.length
                }
                let message1 = `${portals.array().find(e => e.name.toLowerCase().split("_").join("") === peeps[i].toLowerCase())} ${keys.array().find(e => e.name.toLowerCase().replace("key", "") === peeps[i].toLowerCase())} ${portals.array().find(e => e.name.toLowerCase().split("_").join("") === peeps[i].toLowerCase()).name.split("_").join(" ")} (${peeps[i]})`;
                if (embedLength + message1.length <= 6000) {
                    if (embed.description) {
                        if (embed.description.length + message1.length < 2048 && currentFieldNumber === -1) {
                            embed.setDescription(`${embed.description}\n${message1}`);
                        } else {
                            if (embed.fields.length === 0) {
                                embed.addFields([{name: `\u200B`, value: `${message1}`}]);
                                currentFieldNumber++;
                            } else {
                                if (embed.fields[currentFieldNumber].value.length + message1.length < 1024) {
                                    embed.fields[currentFieldNumber].value += `\n${message1}`;
                                } else {
                                    currentFieldNumber++;
                                    embed.addFields([{name: `\u200B`, value: `${message1}`}]);
                                }
                            }
                        }
                    } else {
                        await embed.setDescription(`${message1}`);
                    }
                } else {
                    message.channel.send(embed);
                    embed = new Discord.MessageEmbed();
                    embed.setColor(0x6effff);
                    embed.setTitle(`\u200B`);
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
        } else if (command && (message.author.id === "321726133307572235" || command.type !== "private")) {
            embed.setDescription(`__**Usage:**__ \`${settings.prefix}${command.use}\`
            -${command.description}
            Aliases: ${(command.aliases.length) ? command.aliases.sort().join(", ") : "None"}
            Cooldown: ${(command.cooldown) ? `${command.cooldown} second${(command.cooldown > 1) ? "s" : ""}` : "None"}`);
        } else {
            return message.channel.send("That is an invalid command to learn further about at.");
        }
        if (typeOfCommand === "") {
            embed.setTitle("All the commands you can use on your server!");
            embed.setFooter({text: "Capitalization does not matter when using the commands."});
        } else if (typeOfCommand !== "afks") {
            embed.setTitle(`Info on the ${typeOfCommand} command!`);
            embed.setFooter({text: "Capitalization does not matter | [] - mandatory | <> - optional"});
        }
        if (message.channel) {
            await message.channel.send(embed).catch(e => {});
        } else {
            await message.author.send(embed).catch(e => {});
        }
    }
}