const Discord = require('discord.js');

module.exports = {
    aliases: ["dm"],
    description: "Lists all duplicate members on the server.",
    use: "duplicateMembers <list>",
    cooldown: 0,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["raiderRole", "suspendedRole", "suspendedButVerifiedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let persons = guildMembers.filter(e => e.nickname && (e.roles.get(settings.raiderRole) || e.roles.get(settings.suspendedRole) || e.roles.get(settings.suspendedButVerifiedRole))).array();
        let guildMemberss = new Map();
        let gey = [];
        let args = message.content.toLowerCase().split(" ");
        let list = args[1];
        let listOrNot = false;
        if (list) {
            if (list === "list" || list === "l") {
                listOrNot = true;
            }
        }
        for (i = 0; i < persons.length; i++) {
            let userNickname = persons[i].nickname.toLowerCase();
            if (/^[a-z]*$/.test(userNickname)) {
                if (guildMemberss.get(userNickname) && (!guildMemberss.get(userNickname).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                    let id = guildMemberss.get(userNickname).id;
                    await gey.push(persons[i]);
                    await gey.push(guildMembers.get(id));
                }
                await guildMemberss.set(userNickname, persons[i]);
            } else if (userNickname.includes(" | ")) {
                if (/^[a-z]*$/.test(userNickname.split(" | ")[0])) {
                    if (guildMemberss.get(userNickname.split(" | ")[0]) && (!guildMemberss.get(userNickname.split(" | ")[0]).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                        let id = guildMemberss.get(userNickname.split(" | ")[0]).id;
                        await gey.push(persons[i]);
                        await gey.push(guildMembers.get(id));
                    }
                    await guildMemberss.set(userNickname.split(" | ")[0], persons[i]);
                } else if (/^[a-z]*$/.test(userNickname.split(" | ")[0].slice(1))) {
                    if (guildMemberss.get(userNickname.split(" | ")[0].slice(1)) && (!guildMemberss.get(userNickname.split(" | ")[0].slice(1)).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                        let id = guildMemberss.get(userNickname.split(" | ")[0].slice(1)).id;
                        await gey.push(persons[i]);
                        await gey.push(guildMembers.get(id));
                    }
                    await guildMemberss.set(userNickname.split(" | ")[0], persons[i]);
                } else if (/^[a-z]*$/.test(userNickname.split(" | ")[0].slice(2))) {
                    if (guildMemberss.get(userNickname.split(" | ")[0].slice(2)) && (!guildMemberss.get(userNickname.split(" | ")[0].slice(2)).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                        let id = guildMemberss.get(userNickname.split(" | ")[0].slice(2)).id;
                        await gey.push(persons[i]);
                        await gey.push(guildMembers.get(id));
                    }
                    await guildMemberss.set(userNickname.split(" | ")[0], persons[i]);
                } else if (/^[a-z]*$/.test(userNickname.split(" | ")[0].slice(3))) {
                    if (guildMemberss.get(userNickname.split(" | ")[0].slice(3)) && (!guildMemberss.get(userNickname.split(" | ")[0].slice(3)).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                        let id = guildMemberss.get(userNickname.split(" | ")[0].slice(3)).id;
                        await gey.push(persons[i]);
                        await gey.push(guildMembers.get(id));
                    }
                    await guildMemberss.set(userNickname.split(" | ")[0], persons[i]);
                }
                if (userNickname.split(" | ")[1] !== undefined) {
                    if (guildMemberss.get(userNickname.split(" | ")[1]) && (!guildMemberss.get(userNickname.split(" | ")[1]).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                        let id = guildMemberss.get(userNickname.split(" | ")[1]).id;
                        await gey.push(persons[i]);
                        await gey.push(guildMembers.get(id));
                    }
                    await guildMemberss.set(userNickname.split(" | ")[1], persons[i]);
                }
                if (userNickname.split(" | ")[2] !== undefined) {
                    if (guildMemberss.get(userNickname.split(" | ")[2]) && (!guildMemberss.get(userNickname.split(" | ")[2]).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                        let id = guildMemberss.get(userNickname.split(" | ")[2]).id;
                        await gey.push(persons[i]);
                        await gey.push(guildMembers.get(id));
                    }
                    await guildMemberss.set(userNickname.split(" | ")[2], persons[i]);
                }
                if (userNickname.split(" | ")[3] !== undefined) {
                    if (guildMemberss.get(userNickname.split(" | ")[3]) && (!guildMemberss.get(userNickname.split(" | ")[3]).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                        let id = guildMemberss.get(userNickname.split(" | ")[3]).id;
                        await gey.push(persons[i]);
                        await gey.push(guildMembers.get(id));
                    }
                    await guildMemberss.set(userNickname.split(" | ")[3], persons[i]);
                }
            } else if (!/^[a-z]*$/.test(userNickname) && /^[a-z]*$/.test(userNickname.slice(1))) {
                if (guildMemberss.get(userNickname.slice(1)) && (!guildMemberss.get(userNickname.slice(1)).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                    let id = guildMemberss.get(userNickname.slice(1)).id;
                    await gey.push(persons[i]);
                    await gey.push(guildMembers.get(id));
                }
                await guildMemberss.set(userNickname.slice(1), persons[i]);
            } else if (!/^[a-z]*$/.test(userNickname) && /^[a-z]*$/.test(userNickname.slice(2))) {
                if (guildMemberss.get(userNickname.slice(2)) && (!guildMemberss.get(userNickname.slice(2)).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                    let id = guildMemberss.get(userNickname.slice(2)).id;
                    await gey.push(persons[i]);
                    await gey.push(guildMembers.get(id));
                }
                await guildMemberss.set(userNickname.slice(2), persons[i]);
            } else if (!/^[a-z]*$/.test(userNickname) && /^[a-z]*$/.test(userNickname.slice(3))) {
                if (guildMemberss.get(userNickname.slice(3)) && (!guildMemberss.get(userNickname.slice(3)).roles.get(settings.suspendedRole) || !persons[i].roles.get(settings.suspendedRole))) {
                    let id = guildMemberss.get(userNickname.slice(3)).id;
                    await gey.push(persons[i]);
                    await gey.push(guildMembers.get(id));
                }
                await guildMemberss.set(userNickname.slice(3), persons[i]);
            }
        }
        if (listOrNot) {
            for (let i = 0; i < gey.length; i += 2) {
                await message.channel.send(`${gey[i]} ${gey[i + 1]}`);
            }
        } else {
            let embed = new Discord.MessageEmbed();
            embed.setTitle("A list of everyone who have more than one account verfied under the same name:");
            embed.setColor(0x29e58a);
            let currentFieldNumber = -1;
            for (let i = 0; i < gey.length; i++) {
                let message1 = `${gey[i]}`;
                let embedLength = embed.title.length + (embed.description) ? embed.description.length : 0;
                for (let i = 0; i < embed.fields.length; i++) {
                    embedLength += embed.fields[i].name.length;
                    embedLength += embed.fields[i].value.length;
                }
                if (embedLength + message1.length <= 5998) {
                    if (embed.description) {
                        if (embed.description.length + message1.length < 2046 && currentFieldNumber === -1) {
                            await embed.setDescription(`${embed.description}, ${message1}`);
                        } else {
                            if (embed.fields.length === 0) {
                                await embed.addField(`\u200B`, `${message1}`);
                                currentFieldNumber++;
                            } else {
                                if (embed.fields[currentFieldNumber].value.length + message1.length < 1022) {
                                    embed.fields[currentFieldNumber].value += `, ${message1}`;
                                } else {
                                    currentFieldNumber++;
                                    await embed.addField(`\u200B`, `${message1}`);
                                }
                            }
                        }
                    } else {
                        await embed.setDescription(`${message1}`);
                    }
                } else {
                    message.channel.send(embed);
                    embed = new Discord.MessageEmbed();
                    embed.setColor(0x29e58a);
                    embed.setTitle(`\u200B`);
                    embed.setDescription(`${message1}`);
                    currentFieldNumber = -1;
                }
            }
            await message.channel.send(embed);
        }
    }
}