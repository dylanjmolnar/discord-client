const Discord = require('discord.js');

module.exports = async (client, guild, settings, userID, guilds) => {
    let guildID = guild.id;
    let user = await client.users.fetch(userID).catch(e => {});
    let attemptEmbed = new Discord.MessageEmbed();
    attemptEmbed.setAuthor(user.tag, user.displayAvatarURL());
    attemptEmbed.setFooter(`User ID: ${userID}`);
    attemptEmbed.setTimestamp(new Date());
    attemptEmbed.setColor(0xe4e721);
    if (guilds[guildID].pending[userID]) {
        attemptEmbed.setDescription(`<@${userID}> attempted to start the verification process but has already done so.`);
        await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
        return user.send(`You have already started the verification process. To finish verifying, follow the instructions given.`).catch(e => {
            guild.channels.get(settings.veriChannel).send(`<@${userID}> I cannot send you dms because your dms are set to private. Please allow me to pm you to proceed.`).then(msg => {
                setTimeout(() => msg.delete().catch(e => {}), 10000);
            }).catch(e => {});
        });
    }
    guilds[guildID].pending[userID] = {
        code: "placeholder"
    }
    guild.members.fetch().then(async guildMembers => {
        let member = guildMembers.get(userID);
        let bot = guildMembers.get(client.user.id);
        if (!guild.channels.get(settings.veriRejectionChannel) || !guild.channels.get(settings.veriActiveChannel) || !guild.channels.get(settings.veriAttemptsChannel)) {
            delete guilds[guildID].pending[userID];
            return user.send(`Your server is not setup enough to run this command.`).catch(e => {});
        }
        if (!guild.roles.get(settings.raiderRole)) {
            delete guilds[guildID].pending[userID];
            return user.send(`Your server is not setup enough to run this command.`).catch(e => {});
        }
        if (member.roles.highest.position >= bot.roles.highest.position || userID === guild.ownerID) {
            delete guilds[guildID].pending[userID];
            return user.send(`I cannot verify you as your roles are higher or equal to mine.`).catch(e => {});
        }
        let pending = await client.models.get("pending").findOne({where: {guildID: guildID, userID: userID}});
        if (pending) {
            delete guilds[guildID].pending[userID];
            attemptEmbed.setDescription(`${member} attempted to verify but is already under pending.`);
            await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
            return user.send(`Your account is currently already under manual review, please be patient.`).catch(e => {
                guild.channels.get(settings.veriChannel).send(`${member} I cannot send you dms because your dms are set to private. Please allow me to pm you to proceed.`).then(msg => {
                    setTimeout(() => msg.delete().catch(e => {}), 10000);
                }).catch(e => {});
            });
        }
        if (guilds[guildID].rejected[userID]) {
            delete guilds[guildID].pending[userID];
            attemptEmbed.setDescription(`${member} attempted to verify but already has already been autorejected.`);
            await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
            return user.send(`You have already been autorejected. Please dm me through modmail to appeal.`).catch(e => {
                guild.channels.get(settings.veriChannel).send(`${member} I cannot send you dms because your dms are set to private. Please allow me to pm you to proceed.`).then(msg => {
                    setTimeout(() => msg.delete().catch(e => {}), 10000);
                }).catch(e => {});
            });
        } else {
            let code, names = [];
            let setups = await client.models.get("guild").findAll();
            for (let i = 0; i < setups.length; i++) {
                let foundGuild = client.guilds.get(setups[i].dataValues.guildID);
                if (foundGuild) {
                    try {
                        let guildMember = await foundGuild.members.fetch(userID);
                        if (guildMember.nickname && guildMember.roles.get(setups[i].dataValues.raiderRole)) {
                            let strippedName = guildMember.nickname;
                            while (strippedName[0] && !/^[a-zA-Z]*$/.test(strippedName[0])) {
                                strippedName = strippedName.slice(1);
                            }
                            let arrayNames = strippedName.split(" | ");
                            for (let j = 0; j < arrayNames.length; j++) {
                                if (arrayNames[j]) {
                                    if (/^[a-zA-Z]*$/.test(arrayNames[j]) && arrayNames[j].length < 11 && !names.includes(arrayNames[j].toLowerCase())) {
                                        names.push(arrayNames[j].toLowerCase());
                                    }
                                }
                            }
                        }
                    } catch(e) {}
                }
            }
            let origionalMessage = `__**You're not yet verified! Please follow the steps below to proceede!**__

            **Please provide your in game name below**; spelled how it is spelled in game.
            Please only send your in game name (ex. \`Dylanxdman\`)
            Capitalization does not matter.
            If you with to cancel, react with ❌ below.`;
            let embed = new Discord.MessageEmbed();
            let realmeyeCommand = require("./searchRealmeye");
            let verifying = {};
            embed.setTitle("Your verification status!");
            embed.setDescription((names.length === 0) ? origionalMessage : `Would you like to verify as the in game character [${names[0]}](https://www.realmeye.com/player/${names[0]})?`);
            embed.setFooter(`Time left to verify: 15 minutes and 0 seconds`);
            user.send(embed).then(async message => {
                let activeMessage, seconds = 900000;
                let timeCommand = require("./time");
                let filter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "❌") && !user.bot;
                let messageFilter = (message) => true;
                let collector = new Discord.ReactionCollector(message, filter);
                let messageCollector = new Discord.MessageCollector(message.channel, messageFilter);
                let name, foundName = false;
                collector.on("collect" , (reaction, user) => collect(reaction, user));
                let finding = names.length !== 0;
                messageCollector.on("collect", async (mess) => {
                    if (!foundName && !mess.author.bot && names.length === 0) {
                        if (mess.content) {
                            if (mess.content.length <= 10  && /^[a-zA-Z]*$/.test(mess.content)) {
                                finding = true;
                                name = mess.content;
                                embed.setDescription(`Are you sure [${mess.content}](https://www.realmeye.com/player/${mess.content}) is your in game name?`);
                                message.edit(embed).catch(e => {});
                            } else {
                                attemptEmbed.setDescription(`${member} has provided an invalid name to verify under: \`${mess.content}\`.`);
                                guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
                                user.send(`Please provide a valid RotMG name to verify under.`).then(msg => {
                                    setTimeout(() => msg.delete().catch(e => {}), 5000);
                                }).catch(e => {});
                            }
                        } else {
                            attemptEmbed.setDescription(`${member} has provided an invalid name to verify under: \`\`.`);
                            guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
                            user.send(`Please provide a RotMG name to verify under.`).then(msg => {
                                setTimeout(() => msg.delete().catch(e => {}), 5000);
                            }).catch(e => {});
                        }
                    }
                    if (mess.embeds.length === 0) {
                        collector.stop();
                        await message.delete().catch(e => {});
                        message = await user.send(embed).catch(e => {});
                        await message.react("✅").catch(e => {});
                        await message.react("❌").catch(e => {});
                        collector = new Discord.ReactionCollector(message, filter);
                        collector.on("collect" , (reaction, user) => collect(reaction, user));
                    }
                });
                await message.react("✅").catch(e => {});
                await message.react("❌").catch(e => {});
                attemptEmbed.setColor(0x299b37);
                attemptEmbed.setDescription(`${member} has started the verification process.`);
                let activeEmbed = new Discord.MessageEmbed();
                activeEmbed.setAuthor(user.tag, user.displayAvatarURL());
                activeEmbed.setColor(0x1cff3f);
                activeEmbed.setDescription(`${member} is attempting to verify`);
                activeEmbed.setFooter("His verification process has 15 minutes and 0 seconds left.");
                await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).then(m => attemptEmbed.setColor(0xe4e721)).catch(e => {});
                activeMessage = await guild.channels.get(settings.veriActiveChannel).send(activeEmbed).catch(e => {});
                let timeOut = setInterval(async () => {
                    if (seconds > 0) {
                        if (message) {
                            if (!message.deleted) {
                                if ((seconds/1000) % 5 === 0) {
                                    seconds = seconds - 5000;
                                    let secondas = await timeCommand(seconds);
                                    embed.setFooter(`Time left to verify: ${secondas}`);
                                    await message.edit(embed).catch(e => {});
                                }
                            }
                        }
                        if (activeMessage) {
                            if (!activeMessage.deleted) {
                                if ((seconds/1000) % 30 === 0 ) {
                                    let secondas = await timeCommand(seconds);
                                    activeEmbed.setFooter(`His verification process has ${secondas} left.`);
                                    activeMessage.edit(activeEmbed).catch(e => {});
                                }
                            }
                        }
                    } else {
                        collector.stop();
                        clearInterval(timeOut);
                        delete guilds[guildID].pending[userID];
                        attemptEmbed.setTimestamp(new Date());
                        attemptEmbed.setDescription(`${member}${(foundName) ? ` ([${name}](https://www.realmeye.com/player/${name}))` : ""} tried to verify but his module timed out.`);
                        await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed);
                        if (activeMessage) {
                            if (!activeMessage.deleted) {
                                await activeMessage.delete().catch(e => {});
                            }
                        }
                        if (message) {
                            if (!message.deleted) {
                                embed.setFooter("Your verification process has now timed out.");
                                embed.setDescription(`Verification process has now been stopped!`);
                                await message.edit(embed).catch(e => {});
                            }
                        }
                        user.send("Your verification process has now timed out.").catch(e => {});
                    }
                }, 5000);
                async function collect(reaction, user) {
                    if (reaction.emoji.name === "✅") {
                        if (names.length !== 0) {
                            name = names[0];
                        }
                        if (foundName) {
                            if (verifying[userID]) return;
                            verifying[userID] = {
                                thing: "placeholder"
                            }
                            attemptEmbed.setTimestamp(new Date());
                            let blacklistDB = await client.models.get("expelled").findAll({where: {guildID: guildID}});
                            let blacklistGuildsDB = await client.models.get("expelledguilds").findAll({where: {guildID: guildID}});
                            let suspensionsDB = await client.models.get("suspensions").findAll({where: {guildID: guildID}});
                            let blacklist = [];
                            for (let i = 0; i < blacklistDB.length; i++) {
                                blacklist.push(blacklistDB[i].dataValues.inGameName);
                            }
                            let blacklist2 = [];
                            for (let i = 0; i < blacklistGuildsDB.length; i++) {
                                blacklist2.push(blacklistGuildsDB[i].dataValues.guildName);
                            }
                            let suspensions = [];
                            for (let i = 0; i < suspensionsDB.length; i++) {
                                suspensions.push((suspensionsDB[i].dataValues.nickname) ? suspensionsDB[i].dataValues.nickname.toLowerCase() : suspensionsDB[i].dataValues.nickname);
                            }
                            embed.setDescription(`Checking your realmeye page now... This may take up to 30 seconds to fully check.`);
                            message.edit(embed).then(async mess => {
                                await guild.members.fetch().then(async persons => {
                                    let person = persons.get(userID);
                                    if (!person) {
                                        delete verifying[userID];
                                        clearInterval(timeOut);
                                        embed.setDescription(`Verification process has now been stopped!`);
                                        embed.setFooter("Your verification process has now been stopped.");
                                        await message.edit(embed).catch(e => {});
                                        collector.stop();
                                        delete guilds[guildID].pending[userID];
                                        await activeMessage.delete().catch(e => {});
                                        attemptEmbed.setDescription(`<@${userID}> tried to verify but he left the server.`);
                                        await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed);
                                        return user.send(`I cannot verify you any longer as you have left the server.`).catch(e => {});
                                    }
                                    await realmeyeCommand(name, {
                                        pastnames: (blacklist.length > 0 && settings.veriNameHistory) ? true : false,
                                        pastGuilds: (blacklist2.length > 0 && settings.veriGuildHistory) ? true : false,
                                        graveyard: (settings.veriDeathCount !== 0) ? true : false
                                    }).then(async data => {
                                        if (!data.error) {
                                            name = data.name;
                                            let foundVericode = (guildID === "484063560385953804") ? true : false;
                                            if (data.description_1) {
                                                if (data.description_1.includes(code)) {
                                                    foundVericode = true;
                                                }
                                            }
                                            if (data.description_2) {
                                                if (data.description_2.includes(code)) {
                                                    foundVericode = true;
                                                }
                                            }
                                            if (data.description_3) {
                                                if (data.description_3.includes(code)) {
                                                    foundVericode = true;
                                                }
                                            }
                                            if (foundVericode) {
                                                let failed = [];
                                                let failed1 = [];
                                                if ((!/^[0-9]*$/.test(data.characterCount) || !data.characters) && settings.veriCharCount !== 0) {
                                                    failed.push(`-in game characters`);
                                                }
                                                if (!/^[0-9]*$/.test(data.fame.split(" ")[0])) {
                                                    failed.push(`-alive fame count`);
                                                }
                                                if (!data.rank) {
                                                    failed.push(`-player rank`);
                                                } else {
                                                    if (!/^[0-9]*$/.test(data.rank)) {
                                                        failed.push(`-player rank`);
                                                    }
                                                }
                                                if (data.guild === "hidden") {
                                                    failed.push(`-current guild`);
                                                }
                                                if (!data.created || data.created === "hidden") {
                                                    failed.push(`-account date created`);
                                                }
                                                if (!data.lastSeen.includes("hidden")) {
                                                    failed1.push(`-last known location`);
                                                }
                                                if (!data.names && blacklist.length > 0 && settings.veriNameHistory) {
                                                    failed.push(`-past names`);
                                                }
                                                if (!data.guilds && blacklist2.length > 0 && settings.veriGuildHistory) {
                                                    failed.push(`-past guilds`);
                                                }
                                                if (!data.graveyard && settings.veriDeathCount !== 0) {
                                                    failed.push(`-graveyard`);
                                                }
                                                if (failed.length > 0 || failed1.length > 0) {
                                                    attemptEmbed.setDescription(`User: ${member} ([${name}](https://www.realmeye.com/player/${name})) tried to verify but some of their realmeye settings needed fixing:${(failed.length > 0) ? `\n${failed.join("\n")}` : ""}${(failed1.length > 0) ? `\n${failed1.join("\n")}` : ""}`);
                                                    await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed);
                                                    delete verifying[userID];
                                                    embed.setDescription(`${origionalMessage}
                                                    ----------------------------------------------------------------------
                                                    ${(failed.length > 0) ? `**The following realmeye settings need to be made public (Set to \`Everyone\`)**:
                                                    ${failed.join(`\n`)}` : ""}${(failed1.length > 0) ? `
                                                    **The following realmeye settings need to be made private (Set to \`Nobody\`)**:
                                                    ${failed1.join("\n")}` : ""}
            
                                                    __[Realmeye Settings](https://www.realmeye.com/settings-of/${name})__
                                                    Also make sure to remember to click the \`Save Changes\` button at the bottom of the webpage.
                                                    Please be patient as realmeye takes up to a minute to refresh, so please wait around a minute before reacting with ✅ again.`);
                                                    return message.edit(embed).catch(e => {});
                                                }
                                                let badThings = [];
                                                let reallyBadThings = [];
                                                let badGuilds = [];
                                                if (blacklist.length > 0 && settings.veriNameHistory) {
                                                    for (let i = 0; i < data.names.length; i++) {
                                                        if (blacklist.includes(data.names[i].pastName.toLowerCase()) && data.names[i].pastName !== name) {
                                                            if (!reallyBadThings.includes(`Past **name** is blacklisted (${data.names[i].pastName}).`)) {
                                                                reallyBadThings.push(`Past **name** is blacklisted (${data.names[i].pastName}).`);
                                                            }
                                                        }
                                                    }
                                                }
                                                let timeCommand = require("./time");
                                                if (blacklist2.length > 0 && settings.veriGuildHistory) {
                                                    for (let i = 0; i < data.guilds.length; i++) {
                                                        if (data.guilds[i].guildName && data.guilds[i].dateLeft) {
                                                            if (blacklist2.includes(data.guilds[i].guildName)) {
                                                                if (Date.now() - data.guilds[i].dateLeft.valueOf() < 2620800) {
                                                                    if (!badGuilds.includes(`Past **guild** is blacklisted ([${data.guilds[i].guildName}](https://www.realmeye.com/guild/${data.guilds[i].guildName.split(" ").join("%20")})).`)) {
                                                                        badGuilds.push(`Past **guild** is blacklisted ([${data.guilds[i].guildName}](https://www.realmeye.com/guild/${data.guilds[i].guildName.split(" ").join("%20")})).`);
                                                                        badThings.push(`Past **guild** is blacklisted ([${data.guilds[i].guildName}](https://www.realmeye.com/guild/${data.guilds[i].guildName.split(" ").join("%20")})) (${await timeCommand(Date.now() - data.guilds[i].dateLeft.valueOf())} ago).`);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (blacklist.includes(name.toLowerCase())) {
                                                    reallyBadThings.push(`${name} is on the blacklist.`);
                                                }
                                                if (blacklist2.includes(data.guild)) {
                                                    reallyBadThings.push(`Current guild is on the blacklist. ([${data.guild}](https://www.realmeye.com/guild/${data.guild.split(" ").join("%20")}))`);
                                                }
                                                if (guildMembers.get(client.user.id).hasPermission("BAN_MEMBERS")) {
                                                    let bans = await guild.fetchBans().catch(e => {});
                                                    if (bans.keyArray().includes(userID)) {
                                                        reallyBadThings.push("Is on the ban list.");
                                                    }
                                                }
                                                let commands = await require("./nickname_search");
                                                let verifyingPerson = await commands(guildID, persons, name, settings);
                                                if (verifyingPerson) {
                                                    reallyBadThings.push(`Already verified (${verifyingPerson.user} - ${verifyingPerson.user.tag}).`);
                                                }
                                                if (suspensions.includes(name.toLowerCase())) {
                                                    let member = persons.get(suspensionsDB.filter(e => e.dataValues.nickname).filter(e => e.dataValues.nickname.toLowerCase() === name.toLowerCase())[0].dataValues.userID);
                                                    reallyBadThings.push(`Has an account already suspended. (${member.user} - ${member.user.tag})`);
                                                }
                                                let rankNumber = parseInt(data.rank);
                                                if (!/^[0-9]*$/.test(rankNumber)) {
                                                    return console.log(`${name}: star count.`);
                                                }
                                                if (rankNumber < settings.veriStarCount) {
                                                    badThings.push(`Doesn't meet star count (${rankNumber}/${settings.veriStarCount})`);
                                                }
                                                let aliveFameNumber = parseInt(data.fame.split(" ")[0]);
                                                if (!/^[0-9]*$/.test(aliveFameNumber)) {
                                                    return console.log(`${name}: alive fame.`);
                                                }
                                                if (aliveFameNumber < settings.veriAliveFame) {
                                                    badThings.push(`Doesn't meet alive fame count (${aliveFameNumber}/${settings.veriAliveFame})`);
                                                }
                                                // let skinNumber = parseInt(data.skinCount.split(" ")[0]);
                                                // if (!/^[0-9]*$/.test(skinNumber)) {
                                                //     return console.log(`${name}: skin count.`);
                                                // }
                                                // if (skinNumber < settings.veriSkinCount) {
                                                //     badThings.push(`Doesn't meet skin count (${skinNumber}/${settings.veriSkinCount})`);
                                                // }
                                                let charNumber = (data.characterCount) ? parseInt(data.characterCount.split(" ")[0]) : null;
                                                // let expNumber = parseInt(data.expNumber.split(" ")[0]);
                                                // if (!expNumber) {
                                                //     return console.log(`${name}: exp count.`);
                                                // }
                                                // if (expNumber < settings.) {
                                                //     badThings.push(`Doesn't meet exp count (${expNumber}/${settings.})`);
                                                // }
                                                let accountFameNumber = parseInt(data.accFame.split(" ")[0]);
                                                if (!/^[0-9]*$/.test(accountFameNumber)) {
                                                    return console.log(`${name}: account fame count.`);
                                                }
                                                if (accountFameNumber < settings.veriAccountFame) {
                                                    badThings.push(`Doesn't meet account fame count (${accountFameNumber}/${settings.veriAccountFame})`);
                                                }
                                                if (guildID === "343704644712923138") {
                                                    let goodBois = [];
                                                    for (let i = 0; i < data.characters.length; i++) {
                                                        if (parseInt(data.characters[i].stats[0])) {
                                                            if (parseInt(data.characters[i].stats[0]) >= 3) {
                                                                goodBois.push("placeholder");
                                                            }
                                                        }
                                                    }
                                                    if (goodBois.length < settings.veriCharCount) {
                                                        badThings.push(`Doesn't have enough 3/8 characters.`);
                                                    }
                                                }
                                                let dateCreated = data.created;
                                                if (!dateCreated) {
                                                    return console.log(`${name}: account created.`);
                                                }
                                                if (guildID === "451171819672698920") {
                                                    if (!dateCreated.toLowerCase().includes(`year`) && !dateCreated.toLowerCase().includes(`month`)) {
                                                        if (!dateCreated.toLowerCase().includes(`day`)) {
                                                            badThings.push(`Account is not 3 months old yet (${dateCreated.replace("ago", "old")})`);
                                                        } else {
                                                            let daysNumber = dateCreated.slice(1);
                                                            if (/^[0-9]*$/.test(dateCreated[3])) {
                                                                daysNumber = dateCreated[1] + dateCreated[2] + dateCreated[3];
                                                            } else if (/^[0-9]*$/.test(dateCreated[2])) {
                                                                daysNumber = dateCreated[1] + dateCreated[2];
                                                            } else if (/^[0-9]*$/.test(dateCreated[1])) {
                                                                daysNumber = dateCreated[1];
                                                            }
                                                            daysNumber = parseInt(daysNumber);
                                                            if (daysNumber <= 91) {
                                                                badThings.push(`Account is not 3 months old yet (${dateCreated.replace("ago", "old")})`);
                                                            }
                                                        }
                                                    } else if (!dateCreated.toLowerCase().includes(`year`)) {
                                                        let monthNumber = parseInt(`${dateCreated[1] + dateCreated[2]}`.trim());
                                                        if (monthNumber < 3) {
                                                            badThings.push(`Account is not 3 months old yet (${dateCreated.replace("ago", "old")})`);
                                                        }
                                                    }
                                                } else if (guildID === "343704644712923138") {
                                                    if (!dateCreated.toLowerCase().includes(`year`)) {
                                                        badThings.push(`Account is not 1 year old yet (${dateCreated.replace("ago", "old")})`);
                                                    }
                                                }
                                                let deathCount;
                                                if (settings.veriDeathCount !== 0) {
                                                    deathCount = data.graveyard.length;
                                                    if (deathCount < settings.veriDeathCount) {
                                                        badThings.push(`Doesn't meet death count (${deathCount}/${settings.veriDeathCount})`);
                                                    }
                                                }
                                                let starImage;
                                                if (rankNumber <= 14) {
                                                    starImage = client.emojisMisc.get("lightbluestar");
                                                } else if (rankNumber <= 29) {
                                                    starImage = client.emojisMisc.get("bluestar");
                                                } else if (rankNumber <= 44) {
                                                    starImage = client.emojisMisc.get("redstar");
                                                } else if (rankNumber <= 59) {
                                                    starImage = client.emojisMisc.get("orangestar");
                                                } else if (rankNumber <= 74) {
                                                    starImage = client.emojisMisc.get("yellowstar");
                                                } else if (rankNumber <= 75) {
                                                    starImage = client.emojisMisc.get("whitestar");
                                                }
                                                let guildRankIcon = (data.guildRank) ? client.emojisMisc.get(data.guildRank.toLowerCase()) : "";
                                                let rejectionEmbed = new Discord.MessageEmbed();
                                                rejectionEmbed.setAuthor(`${user.tag} tried to verify as: ${name}!`, user.displayAvatarURL());
                                                rejectionEmbed.setDescription(`${member}**'s Application: [Player Link](https://www.realmeye.com/player/${name})** (\* Required Fields)`);
                                                rejectionEmbed.addField(`Player Rank:*`, `${rankNumber}${starImage}`, true);
                                                rejectionEmbed.addField(`Guild:*`, `${(data.guild) ? `[${data.guild}](https://www.realmeye.com/guild/${data.guild.split(" ").join("%20")})` : "None"}`, true);
                                                rejectionEmbed.addField(`Guild Rank:`, `${data.guildRank || "N/A"} ${guildRankIcon}`, true);
                                                rejectionEmbed.addField(`Player Alive Fame:*`, `${aliveFameNumber}`, true);
                                                rejectionEmbed.addField(`Account Created:${(settings.veriCreatedTime) ? "*": ""}`, `${dateCreated}`, true);
                                                rejectionEmbed.addField(`Player Last Seen:${(settings.veriLKL) ? "*": ""}`, `${data.lastSeen}`, true);
                                                rejectionEmbed.addField(`Character Count:`, `${(/^[0-9]*$/.test(data.characterCount)) ? charNumber : "hidden"}`, true);
                                                rejectionEmbed.addField(`Skin Count:`, `${"Not Checking" || "hidden"}`, true);
                                                rejectionEmbed.addField(`Account Fame:`, `${accountFameNumber}`, true);
                                                rejectionEmbed.addField(`Deaths:`, `${(settings.veriDeathCount !== 0) ? `${deathCount} (0/8: \`${data.graveyard.filter(e => e.maxed.startsWith("0")).length}\`, 1/8: \`${data.graveyard.filter(e => e.maxed.startsWith("1")).length}\`, 2/8: \`${data.graveyard.filter(e => e.maxed.startsWith("2")).length}\`, 3/8: \`${data.graveyard.filter(e => e.maxed.startsWith("3")).length}\`, 4/8: \`${data.graveyard.filter(e => e.maxed.startsWith("4")).length}\`, 5/8: \`${data.graveyard.filter(e => e.maxed.startsWith("5")).length}\`, 6/8: \`${data.graveyard.filter(e => e.maxed.startsWith("6")).length}\`, 7/8: \`${data.graveyard.filter(e => e.maxed.startsWith("7")).length}\`, 8/8: \`${data.graveyard.filter(e => e.maxed.startsWith("8")).length}\`)` : "Not Checking"}`, true);
                                                let discordAge = timeCommand(Date.now() - user.createdTimestamp);
                                                rejectionEmbed.addField(`Discord account created:`, `${discordAge} ago`, true);
                                                rejectionEmbed.setTimestamp(new Date());
                                                if (badThings.length !== 0 || reallyBadThings.length !== 0) {
                                                    if (reallyBadThings.length === 0) {
                                                        rejectionEmbed.setFooter("Manual Verification");
                                                    } else {
                                                        rejectionEmbed.setFooter("Auto Rejected");
                                                    }
                                                    rejectionEmbed.setColor(0xff0000);
                                                    rejectionEmbed.addField(`Problems:`, `${(reallyBadThings.length > 0) ? `-${reallyBadThings.join("\n-")}\n` : ""}${(badThings.length > 0) ? `-${badThings.join("\n-")}` : ""}`);
                                                } else {
                                                    rejectionEmbed.setFooter("Accepted");
                                                    rejectionEmbed.setColor(0x299b37);
                                                }
                                                if (guild.channels.get(settings.veriLogChannel)) {
                                                    await guild.channels.get(settings.veriLogChannel).send(rejectionEmbed).catch(e => {});
                                                }
                                                if (/^[0-9]*$/.test(data.characterCount) && guild.channels.get(settings.veriLogChannel)) {
                                                    let charEmbed = new Discord.MessageEmbed();
                                                    let charCommand = require("./findEmoji");
                                                    for (let i = 0; i < data.characters.length; i++) {
                                                        let emojis = await charCommand(client, data.characters[i]);
                                                        charEmbed.addField(`${data.characters[i].class}:`,
                                                        `${client.emojisMisc.get(data.characters[i].class.toLowerCase())} Level: \`${data.characters[i].level}\` CQC: \`${data.characters[i].class_quests_completed}\` Fame: \`${data.characters[i].base_fame}\` Place: \`${data.characters[i].place}\` ${emojis.weapon} ${emojis.ability} ${emojis.armor} ${emojis.ring} ${emojis.backpack} Stats: \`${data.characters[i].stats_maxed}\``);
                                                    }
                                                    charEmbed.setTitle(`Characters of ${name} | User ID: ${userID}`);
                                                    await guild.channels.get(settings.veriLogChannel).send(charEmbed).catch(e => {});
                                                }
                                                if (blacklist.length > 0 && settings.veriNameHistory && guild.channels.get(settings.veriLogChannel)) {
                                                    let pastNamesEmbed = new Discord.MessageEmbed()
                                                    pastNamesEmbed.setTitle(`Past Names for ${name} | User ID: ${userID}`);
                                                    let namesText = `${(data.names.length > 0) ? "" : 'None'}`;
                                                    for (let i = 0; i < data.names.length; i++) {
                                                        namesText = `${namesText}\n\nPast Name: ${data.names[i].pastName}
                                                        Changed To: ${(data.names[i].dateChangedTo) ? timeCommand(Date.now() - data.names[i].dateChangedTo.valueOf()) : "Since Created"}
                                                        Changed Away: ${(data.names[i].dateChanged) ? timeCommand(Date.now() - data.names[i].dateChanged.valueOf()) : "Current Name"}`;
                                                    }
                                                    pastNamesEmbed.setDescription(namesText.substring(0, 2047));
                                                    await guild.channels.get(settings.veriLogChannel).send(pastNamesEmbed);
                                                }
                                                delete guilds[guildID].pending[userID];
                                                delete verifying[userID];
                                                collector.stop();
                                                messageCollector.stop();
                                                clearInterval(timeOut);
                                                if (!activeMessage.deleted) {
                                                    await activeMessage.delete().catch(e => {});
                                                }
                                                if (badThings.length === 0 && reallyBadThings.length === 0) {
                                                    attemptEmbed.setColor(0x299b37);
                                                    attemptEmbed.setDescription(`${member} ([${name}](https://www.realmeye.com/player/${name})) was verified successfully!`);
                                                    guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
                                                    await person.roles.add(settings.raiderRole).catch(e => {});
                                                    if (guildID === "343704644712923138" || guildID === "451171819672698920") {
                                                        await user.send(`You are now verified!
    __**How to join raids:**__
    1: Wait until an afk check is active in <#${settings.AFKChecks}>. Once posted, it will ping \`@here\` so you know.
    2: Join the voice channel that is now open, it will have \`<-- Join!\` in its name.
    3: React with ${(settings.typeOfServer === "lh") ? `${client.emojisMisc.get("void")} or ${client.emojisMisc.get("malus")}` : (settings.typeOfServer === "shatters") ? client.emojisPortals.get("shatters") : client.emojisPortals.get("secludedthicket")} to make sure the bot doesn't move you at the end of the afk check.
    4: Listen to the raid leaders instructions, they will speak in the voice channel.
    
    Before joining any raids, make sure to read <#${(guildID === "343704644712923138") ? "379504881213374475" : "492825466852474900"}> to make sure you do not break any of our raiding rules.
    If broken, they can result in a warning or suspension.
    
    Also make sure to read our <#${settings.rulesChannel}> channel for Discord chatting rules in the server.
    
    If you have any questions, feel free to dm myself (the bot) with any questions and they will get sent through modmail.
    ~Happy Raiding <3`).catch(e => {});
                                                    } else {
                                                        await user.send("You are now verified!").catch(e => {});
                                                    }
                                                    if (person.user.username === name) {
                                                        if (person.user.username.toLowerCase() === name) {
                                                            await person.setNickname(name.toUpperCase()).catch(e => {});
                                                        } else {
                                                            await person.setNickname(name.toLowerCase()).catch(e => {});
                                                        }
                                                    } else {
                                                        await person.setNickname(name).catch(e => {});
                                                    }
                                                } else {
                                                    attemptEmbed.setColor(0xff0000);
                                                    if (reallyBadThings.length === 0) {
                                                        rejectionEmbed.setFooter("Pending verification...");
                                                        attemptEmbed.setDescription(`${member} ([${name}](https://www.realmeye.com/player/${name})) is now under manual review because one or more things are wrong or suspicious with his application!`);
                                                    } else {
                                                        await user.send(`You are being auto denied for the following reasons: \n-${reallyBadThings.join(`\n-`)}.\nPlease contact our staff **__through modmail__** (by messaging me below) to appeal.`);
                                                        guilds[guildID].rejected[userID] = {
                                                            place: "holder"
                                                        }
                                                        rejectionEmbed.setFooter("Auto rejected by the bot");
                                                        attemptEmbed.setDescription(`${member} ([${name}](https://www.realmeye.com/player/${name})) is now being auto-denied because one or more things are wrong and need to be addressed by a higherup!`);
                                                    }
                                                    await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed);
                                                    if (reallyBadThings.length === 0) {
                                                        let messe = await guild.channels.get(settings.veriRejectionChannel).send(rejectionEmbed).catch(e => {});
                                                        messe.react("🔑").catch(e => {});
                                                        await client.models.get("pending").create({
                                                            guildID: guildID,
                                                            userID: userID,
                                                            messageID: messe.id,
                                                            userNickname: name
                                                        });
                                                        await user.send("Your account is now under review manually by staff. Do not attempt to verify again! Only if your account is not reviewed within the next 48 hours, please contact the staff **__through modmail__ by sending a message below**. **DO NOT** message a staff member about being verified!");
                                                    }
                                                }
                                                embed.setDescription(`Verification process has now been stopped!`);
                                                embed.setFooter("Your verification process has now been stopped.");
                                                await message.edit(embed).catch(e => {});
                                            } else {
                                                attemptEmbed.setDescription(`${member} ([${name}](https://www.realmeye.com/player/${name})) tried to verify but no code was found in his realmeye.`);
                                                guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed);
                                                delete verifying[userID];
                                                embed.setDescription(`${origionalMessage}
                                                ----------------------------------------------------------------------
                                                I do not see your vericode in any lines of your realmeye. Please make sure to add it to your realmeye description before trying again. Realmeye can take up to 60 seconds to refresh after updating. Please wait after changing your settings before trying to verify again.`);
                                                return message.edit(embed).catch(e => {});
                                            }
                                        } else {
                                            attemptEmbed.setDescription(`${member} ([${name}](https://www.realmeye.com/player/${name})) tried to verify but something went wrong while reading his profile.`);
                                            await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed);
                                            delete verifying[userID];
                                            embed.setDescription(`${origionalMessage}
                                            ----------------------------------------------------------------------
                                            That seems to be an invalid ROTMG name. If \`${name}\` is not the right rotmg name, react with ❌ and start over using the correct ROMTG name. If it is the correct ROTMG name, please unprivate your profile on realmeye and try again. Realmeye can take up to 60 seconds to refresh after updating. Please wait after changing your settings before trying to verify again.`);
                                            return message.edit(embed).catch(e => {});
                                        }
                                    }).catch(e => {
                                        console.log(e)
                                    });
                                });
                            })
                            // .catch(async e => {
                            //     attemptEmbed.setColor(0xe4e721);
                            //     attemptEmbed.setDescription(`${member} ([${name}](https://www.realmeye.com/player/${name})) tried to obtain a vericode, but has their dm's set to private.`);
                            //     await guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed);
                            //     await message.channel.send(`${member} I cannot send you a dm because your dms are set to private. Please allow me to dm you to proceed.`).then((msg) => {
                            //         setTimeout(() => {
                            //             msg.delete();
                            //         }, 10000);
                            //     });
                            // });
                        } else {
                            if (!finding) return;
                            finding = false;
                            code = `ROTMG${Math.floor(Math.random() * 1000000)}`;
                            guilds[guildID].pending[userID].code = code;
                            origionalMessage = `__**You're almost done! Please follow the steps below to finish!**__
                
                            You have now chosen your in game name to be \`${name}\`!
                            Please copy and paste the code below into any line if your [realmeye](https://www.realmeye.com/player/${name}) description.\`\`\`
                        ${code}\`\`\`
                            Once you have finished this, unreact and re-react with ✅ to finish!
                            If you with to cancel, react with ❌ below.`;
                            embed.setDescription(origionalMessage);
                            foundName = true;
                            message.edit(embed).catch(e => {});
                            await message.reactions.find(e => e.emoji.name === "❌").users.remove(client.user.id).catch(e => {});
                            await message.react("✅").catch(e => {});
                            await message.react("❌").catch(e => {});
                            attemptEmbed.setColor(0x299b37);
                            attemptEmbed.setDescription(`${member} has chosen to verify as [${name}](https://www.realmeye.com/player/${name}).`);
                            guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).then(m => attemptEmbed.setColor(0xe4e721)).catch(e => {});
                            activeEmbed.setDescription(`${member} is attempting to verify on the account: [${name}](https://www.realmeye.com/player/${name})`);
                            activeMessage.edit(activeEmbed).catch(e => {});
                        }
                    } else if (reaction.emoji.name === "❌") {
                        if (names.length !== 0) {
                            name = names[0];
                            names = names.slice(1);
                            if (names.length !== 0) {
                                embed.setDescription(`Would you like to verify as the in game character [${names[0]}](https://www.realmeye.com/player/${names[0]})?`);
                                return message.edit(embed).catch(e => {});
                            }
                            
                        }
                        if (finding) {
                            attemptEmbed.setDescription(`${member} wishes to continue verifying with a different name than [${name}](https://www.realmeye.com/player/${name}).`);
                            embed.setDescription(origionalMessage);
                            message.edit(embed).catch(e => {});
                            guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
                        } else {
                            delete guilds[guildID].pending[userID];
                            collector.stop();
                            if (messageCollector) {
                                messageCollector.stop();
                            }
                            clearInterval(timeOut);
                            await activeMessage.delete().catch(e => {});
                            embed.setFooter("Your verification process has now been stopped.");
                            embed.setDescription(`Verification process has now been stopped!`);
                            await message.edit(embed).catch(e => {});
                            attemptEmbed.setDescription(`${member} has stopped the verification process.`);
                            guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
                            user.send(`Your verification process has now been stopped.`).catch(e => {});
                        }
                        if (names.length === 0) {
                            finding = false;
                        }
                    }
                }
            }).catch(e => {
                guild.channels.get(settings.veriChannel).send(`${member} I cannot send you dms because your dms are set to private. Please allow me to pm you to proceed.`).then(msg => {
                    setTimeout(() => msg.delete().catch(e => {}), 10000);
                    attemptEmbed.setDescription(`${member} attempted to verify, but has their dm's set to private.`);
                    guild.channels.get(settings.veriAttemptsChannel).send(attemptEmbed).catch(e => {});
                }).catch(e => {});
            });
        }
    }).catch(e => {
        delete guilds[guildID].pending[userID];
    });
}