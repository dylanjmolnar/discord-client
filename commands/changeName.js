const Discord = require('discord.js');

module.exports = {
    aliases: ["cn"],
    description: "Is usable by raiders to try and change their discord name if they have changed it in game.",
    use: "changeName [new name]",
    cooldown: 5,
    type: "misc",
    dms: false,
    public: true,
    premium: false,
    allChannels: false,
    channels: ["veriAttemptsChannel", "veriActiveChannel", "modLogsChannel", "veriChannel"],
    roles: ["raiderRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let member = guildMembers.get(message.author.id);
        if (member.roles.get(settings.raiderRole)) {
            if (member.nickname) {
                if (guilds[message.guild.id].namePending[message.author.id]) {
                    return message.author.send(`You seem to have a pending application for verification. If this is not the case, please dm a staff member through my modmail feature.`).catch(e => {});
                }
                let vericode = "ROTMG" + Math.floor(Math.random() * 1000000);
                guilds[message.guild.id].namePending[message.author.id] = {
                    code: vericode
                }
                let embed = new Discord.MessageEmbed();
                let content = message.content.split(" ")[1];
                if (!content) {
                    return message.author.send(`please provide a valid RotMG name that you changed to.`).catch(e => {});
                }
                if (content.length > 10 || !/^[a-zA-Z]*$/.test(content)) {
                    return message.author.send(`That is not a valid in game name to change to.`).catch(e => {});
                }
                let activeEmbed = new Discord.MessageEmbed();
                let loggingEmbed = new Discord.MessageEmbed();
                loggingEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                loggingEmbed.setDescription(`${member} is starting to try to change their in game name on the account: ([${content}](https://www.realmeye.com/player/${content}))`);
                loggingEmbed.setFooter(`User ID: ${message.author.id}`);
                loggingEmbed.setColor(0x299b37);
                loggingEmbed.setTimestamp(new Date());
                activeEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                activeEmbed.setDescription(`${member} is attempting to switch nicknames on the account: ([${content}](https://www.realmeye.com/player/${content}))`);
                let oldName = member.nickname;
                while (!/^[a-zA-Z]*$/.test(oldName[0])) {
                    oldName = oldName.slice(1);
                }
                let oldNames = oldName.split(" | ");
                let newName = content;
                for (let i = 0; i < oldNames.length; i++) {
                    if (!/^[a-zA-Z]*$/.test(oldNames[i])) {
                        return message.author.send(`Something went wrong. One or more of your names are not formatted right. Please contact an the staff through modmail to fix this.`).catch(e => {});
                    } else {
                        if (oldNames[i].toLowerCase() === newName.toLowerCase()) {
                            return message.author.send(`You are already verified under that name. You cannot change that name.`).catch(e => {});
                        }
                    }
                }
                activeEmbed.setFooter(`His process has 15 minutes and 0 seconds left.`);
                embed.setTitle(`Switching name module!`);
                embed.setDescription(`You have now selected ${content} as your new in game name!
                Please add your code below into any line of your realmeye description (Other text **can** be in this line)
                \`\`\`js\n${vericode}\`\`\`
                When you are done, respond with \`done\` below in my dm's! If you want to stop and reset the process, reply with \`cancel\``);
                embed.setFooter(`Your process has 15 minutes and 0 seconds left.`);
                embed.setTimestamp(new Date());
                message.author.send(embed).then(async embedMessage => {
                    member.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed).catch(e => {});
                    let activeMessage = await client.guilds.get(settings.guildID).channels.get(settings.veriActiveChannel).send(activeEmbed).catch(e => {});
                    let command = require("./help/time");
                    let seconds = 900000;
                    let secondss = 900000;
                    let name = newName;
                    let channel = embedMessage.channel;
                    let filter = (msg) => true;
                    let collector = new Discord.MessageCollector(channel, filter);
                    let myVal = setInterval(async () => {
                        if (!activeMessage.deleted) {
                            if (seconds > 0) {
                                if ((seconds/1000) % 30 === 0) {
                                    seconds -= 30000;
                                    let secondas = await command(seconds);
                                    activeEmbed.setFooter(`His process has ${secondas} left.`);
                                    activeMessage.edit(activeEmbed);
                                }
                            }
                        } else {
                            collector.stop();
                        }
                    }, 30000);
                    let hisVal = setInterval(async () => {
                        if (!activeMessage.deleted) {
                            if (secondss <= 0) {
                                collector.stop();
                                loggingEmbed.setTimestamp(new Date());
                                loggingEmbed.setColor(0xe4e721);
                                loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) tried to verify but his module timed out.`);
                                await message.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed);
                                await activeMessage.delete().catch(e => {});
                                delete guilds[message.guild.id].pending[member.id];
                                embed.setFooter("Your process has now timed out.");
                                await embedMessage.channel.send(`Your process has now timed out.`).catch(e => {});
                                await embedMessage.edit(embed);
                            } else {
                                if ((secondss/1000) % 5 === 0) {
                                    secondss -= 5000;
                                    let secondas = await command(secondss);
                                    embed.setFooter(`Your process has ${secondas} left.`);
                                    await embedMessage.edit(embed);
                                }
                            }
                        }
                    }, 5000);
                    collector.on("collect", async (msg) => {
                        let content = msg.content;
                        if (content && !msg.author.bot) {
                            if (content.toLowerCase() === "done") {
                                client.guilds.get(settings.guildID).members.fetch(message.author.id).then(async member => {
                                    channel.send(`Checking your realmeye now... This can take a couple seconds to complete.`).catch(e => {});
                                    let command = require("./help/searchRealmeye");
                                    let data = await command(name, {
                                        characters: true,
                                        pastnames: true
                                    });
                                    let loggingEmbed = new Discord.MessageEmbed();
                                    loggingEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                                    loggingEmbed.setFooter(`User ID: ${message.author.id}`);
                                    loggingEmbed.setTimestamp(new Date());
                                    if (!data.userFound) {
                                        loggingEmbed.setColor(0xe4e721);
                                        loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) tried to change his name but his in game name could not be found on realmeye.`);
                                        embed.setDescription(`Your account seems to be private, to continue, please unprivate it and try again.
                                        if ${name} is not the correct name, please reply with \`cancel\` and start over.
                                        To make your realmeye public, set the \`Who can see my profile?\` to \`Everyone\`.
                                        After doing so, reply with \`done\` in my dms.
                    
                                        __[Realmeye Settings](https://www.realmeye.com/settings-of/${name})__
                                        Also make sure to remember to click the \`Save Changes\` button at the bottom of the webpage.
                                        Please be patient as realmeye takes up to a minute to refresh, so please wait around a minute before sending \`done\`.`);
                                        embed.setTimestamp(new Date());
                                        channel.send(embed).catch(e => {});
                                    }
                                    let foundVericode = (message.guild.id === "484063560385953804") ? true : false;
                                    if (data.desc1) {
                                        if (data.desc1.includes(guilds[message.guild.id].namePending[message.author.id].code)) {
                                            foundVericode = true;
                                        }
                                    }
                                    if (data.desc2) {
                                        if (data.desc2.includes(guilds[message.guild.id].namePending[message.author.id].code)) {
                                            foundVericode = true;
                                        }
                                    }
                                    if (data.desc3) {
                                        if (data.desc3.includes(guilds[message.guild.id].namePending[message.author.id].code)) {
                                            foundVericode = true;
                                        }
                                    }
                                    if (!foundVericode) {
                                        loggingEmbed.setColor(0xe4e721);
                                        loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) tried to change his name but his vericode could not be found in his description.`);
                                        member.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed).catch(e => {});
                                        return channel.send(`I do not see your vericode in any lines of your realmeye. Please make sure to add it to your realmeye description before trying again. Please wait after changing your settings before trying to verify again.`);
                                    }
                                    if (!data.names) {
                                        loggingEmbed.setColor(0xe4e721);
                                        loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) tried to change his name but his past names on realmeye are private.`);
                                        member.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed).catch(e => {});
                                        embed.setDescription(`Your accounts past names seems to be private, to continue, please unprivate it and try again.
                                        if ${name} is not the correct name, please reply with \`cancel\` and start over.
                                        To make your past names pulic, set the \`Who can see my profile?\` to \`Everyone\`.
                                        After doing so, reply with \`done\` in my dms.
                    
                                        __[Realmeye Settings](https://www.realmeye.com/settings-of/${name})__
                                        Also make sure to remember to click the \`Save Changes\` button at the bottom of the webpage.
                                        Please be patient as realmeye takes up to a minute to refresh, so please wait around a minute before sending \`done\`.`);
                                        embed.setTimestamp(new Date());
                                        channel.send(embed).catch(e => {});
                                    } else {
                                        collector.stop();
                                        await activeMessage.delete().catch(e => {});
                                        if (data.names.length === 0) {
                                            loggingEmbed.setColor(0xff0000);
                                            loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) tried to change his name but has no past nicknames.`);
                                            member.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed).catch(e => {});
                                            await channel.send(`You do not have any past names, this means you did not change your name recently. This is being logged and if abused may result in a suspension.`).catch(e => {});
                                        } else {
                                            let found = false;
                                            for (let s = 0; s < oldNames.length; s++) {
                                                for (let i = 0; i < data.names.length; i++) {
                                                    if (data.names[i].pastName.toLowerCase() === oldNames[s].toLowerCase()) {
                                                        found = true;
                                                        if (member.user.username === member.nickname.replace(oldNames[s], data.name)) {
                                                            if (member.user.username.toLowerCase() === member.nickname.replace(oldNames[s], data.name)) {
                                                                await member.setNickname(member.nickname.replace(oldNames[s], data.name).toUpperCase());
                                                            } else {
                                                                await member.setNickname(member.nickname.replace(oldNames[s], data.name).toLowerCase());
                                                            }
                                                        } else {
                                                            await member.setNickname(member.nickname.replace(oldNames[s], data.name));
                                                        }
                                                        loggingEmbed.setColor(0x299b37);
                                                        loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) successfully changed his name from ${oldNames[s]} to ${data.name}.`);
                                                        member.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed).catch(e => {});
                                                        member.guild.channels.get(settings.modLogsChannel).send(loggingEmbed).catch(e => {});
                                                        await channel.send(`Your past name has been confirmed to be ${oldNames[s]}! It will now be changed in your name to ${data.name}!`).catch(e => {});
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!found) {
                                                loggingEmbed.setColor(0xff0000);
                                                loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) tried to change his name but none of his past names match his current nicknames.`);
                                                member.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed).catch(e => {});
                                                await channel.send(`You have not changes your in game name to ${name}. This is being logged and if abused may result in a suspension.`).catch(e => {});
                                            }
                                        }
                                    }
                                }).catch(async e => {
                                    await activeMessage.delete().catch(e => {});
                                    collector.stop();
                                    loggingEmbed.setColor(0xff0000);
                                    loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) tried to verify but is no longer in the server.`);
                                    member.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed).catch(e => {});
                                    channel.send(`Your name change process has ended.`).catch(e => {});
                                });
                            } else if (content.toLowerCase() === "cancel") {
                                await activeMessage.delete().catch(e => {});
                                collector.stop();
                                loggingEmbed.setColor(0xe4e721);
                                loggingEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) has stopped the name change process.`);
                                member.guild.channels.get(settings.veriAttemptsChannel).send(loggingEmbed).catch(e => {});
                                channel.send(`Your name change process has ended.`).catch(e => {});
                            }
                        }
                    });
                    collector.on("end", (collected) => {
                        clearInterval(myVal);
                        clearInterval(hisVal);
                    });
                }).catch(e => {});
            } else {
                message.author.send(`I cannot change your name as you do not seem to have a nickname set. Please speak to an Officer+ to fix this!`).catch(e => {});
            }
        } else {
            message.author.send(`I cannot change your name as you do not seem to be verified. Please go verify in <#${settings.veriChannel}> to verify!`).catch(e => {});
        }
    }
}