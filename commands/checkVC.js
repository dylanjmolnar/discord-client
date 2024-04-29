const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Loops through a couple staff commands to see what needs to be done on the server.",
    use: "checkVC [channel number]",
    cooldown: 5,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let channelNumber = args[1];
        let link = args[2];
        if (!channelNumber) {
            return message.channel.send(`Please provide a channel to check.`);
        }
        if (!/^[0-9]*$/.test(channelNumber)) {
            return message.channel.send(`Please provide a valid channel to check.`);
        }
        let channels = (message.channel.id === settings.veteranCommandsChannel) ? await client.models.get("veteranraiding").findAll({where: {guildID: message.guild.id}}) : await client.models.get("raidingchannels").findAll({where: {guildID: message.guild.id}});
        channelNumber = parseInt(channelNumber) - 1;
        if (channelNumber < 0 || channelNumber > channels.length - 1) {
            return message.channel.send(`Please provide a valid channel to check.`);
        }
        const imageAttached = await Array.from(message.attachments.values())[0];
        if (imageAttached || link) {
            let parseCommand = client.commands.get("parsemembers");
            await message.channel.send(`Parsing as well since an image was provided.`);
            await parseCommand(client, message, settings, guilds, guildMembers);
        }
        let channel = message.guild.channels.get(`${channels[channelNumber].dataValues.channelID}`);
        let users = channel.members.array();
        let names = [];
        for (let i = 0; i < users.length; i++) {
            let name = users[i].displayName;
            if (!name.includes(" | ")) {
                while(!/^[a-zA-Z]*$/.test(name[0])) {
                    name = name.slice(1);
                }
                names.push(name);
            }
        }
        let command = require("./help/searchRealmeye");
        let command1 = require("./help/findEmoji");
        let playersNotFound = [];
        let failedRequirementsLevel = [];
        let failedRequirementsStats = [];
        let failedRequirementsWeapon = [];
        let failedRequirementsAbility = [];
        let failedRequirementsArmor = [];
        let failedRequirementsRing = [];
        let kickNames = [];
        let message1 = await message.channel.send(`Checking players in ${channel.name} right now, currently at 0/${names.length} now!`).catch(e => {});
        let number = (message.guild.id === "451171819672698920") ? 2 : 1;
        for (let i = 0; i < names.length; i++) {
            if (i % 10 === 0) {
                message1.edit(`Checking players in ${channel.name} right now, currently at ${i}/${names.length} now!`).catch(e => {});
            } else if (i === names.length - 1) {
                message1.edit(`Checking players in ${channel.name} right now, currently at ${i + 1}/${names.length} now!`).catch(e => {});
            }
            try {
                let data = await command(names[i], {});
                if (data.characters) {
                    if (data.characters[0]) {
                        let data1 = await command1(client, data.characters[0]);
                        if (parseInt(data.characters[0].level) < 20) {
                            kickNames.push(data.name);
                            failedRequirementsLevel.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) L: ${data.characters[0].level}`);
                        }
                        if (parseInt(data.characters[0].stats_maxed[0]) < number) {
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                            failedRequirementsStats.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) S: ${data.characters[0].stats_maxed}`);
                        }
                        if (!data.characters[0].weapon) {
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                            failedRequirementsWeapon.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) (${data1.weapon})`);
                        } else if (!data.characters[0].weapon.endsWith("UT") && !data.characters[0].weapon.endsWith("T13") && !data.characters[0].weapon.endsWith("T12") && !data.characters[0].weapon.endsWith("T11") && !data.characters[0].weapon.endsWith("T10") && (!data.characters[0].weapon.endsWith("T9") && message.guild.id === "451171819672698920")) {
                            failedRequirementsWeapon.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) (${data1.weapon})`);
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                        }
                        if (!data.characters[0].ability && (data.characters[0].class === "Warrior" || data.characters[0].class === "Knight" || data.characters[0].class === "Priest" || data.characters[0].class === "Paladin")) {
                            failedRequirementsAbility.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) (${data1.ability})`);
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                        } else if (!data.characters[0].ability) {
    
                        } else if ((data.characters[0].ability.endsWith("T0") || data.characters[0].ability.endsWith("T1") || data.characters[0].ability.endsWith("T2") || (data.characters[0].ability.endsWith("T3") && message.guild.id === "451171819672698920")) && data.characters[0].ability !== "Decoy Prism T0") {
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                            failedRequirementsAbility.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) (${data1.ability})`);
                        }
                        if (!data.characters[0].armor) {
                            failedRequirementsArmor.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) (${data1.armor})`);
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                        } else if (!data.characters[0].armor.endsWith("UT") && !data.characters[0].armor.endsWith("T14") && !data.characters[0].armor.endsWith("T13") && !data.characters[0].armor.endsWith("T12") && !data.characters[0].armor.endsWith("T11") && !data.characters[0].armor.endsWith("T10") && (!data.characters[0].armor.endsWith("T9") && message.guild.id === "451171819672698920")) {
                            failedRequirementsArmor.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) (${data1.armor})`);
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                        }
                        if (!data.characters[0].ring) {
                            failedRequirementsRing.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) (${data1.ring})`);
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                        } else if (data.characters[0].ring.endsWith("T0") || data.characters[0].ring.endsWith("T1") || data.characters[0].ring.endsWith("T2") || (data.characters[0].ring.endsWith("T3") && message.guild.id === "451171819672698920")) {
                            failedRequirementsRing.push(`[${data.name}](https://www.realmeye.com/player/${data.name}) (${data1.ring})`);
                            if (!kickNames.includes(data.name)) {
                                kickNames.push(data.name);
                            }
                        }
                    }
                } else {
                    playersNotFound.push(names[i]);
                }
            } catch(e) {
                console.log(e);
            }
        }
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`People who do not meet requirements!`);
        embed.setDescription(`Players who do not meet level requirements: ${failedRequirementsLevel.join(", ")}
        Players who do not meet stats requirements: ${failedRequirementsStats.join(", ")}
        Players who do not meet weapon requirements: ${failedRequirementsWeapon.join(", ")}
        Players who do not meet ability requirements: ${failedRequirementsAbility.join(", ")}
        Players who do not meet armor requirements: ${failedRequirementsArmor.join(", ")}
        Players who do not meet ring requirements: ${failedRequirementsRing.join(", ")}
        Players I could not find info on realmeye for: ${playersNotFound.join(", ")}`.substring(0, 2023));
        message.channel.send(embed);
        if (kickNames.length > 0) {
            message.channel.send(`/kick ${kickNames.join("\n/kick ")}`).catch(e => {});
        }
    }
}
async function sleep(ms) {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}