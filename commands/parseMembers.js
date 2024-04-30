const vision = require('@google-cloud/vision');
const clients = new vision.ImageAnnotatorClient({
    keyFilename: './data/VisionThing.json'
});
const Discord = require('discord.js');

module.exports = {
    aliases: ["pm", "parse"],
    description: "Checks the list of users in the voice channel versus the in game image.",
    use: "parseMembers [channel number] [image]",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["tempKeyRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let channelNumber = args[1];
        if (!channelNumber) {
            return message.channel.send("Please provide a valid channel to check against.").catch(e => {});
        } 
        if (!/^[0-9]*$/.test(channelNumber)) {
            return message.channel.send("Please provide a valid channel to check against.").catch(e => {});
        }
        let numberNumber = parseInt(channelNumber);
        let channelsDB = (message.channel.id === settings.veteranCommandsChannel) ? await client.models.get("veteranraiding").findAll({where: {guildID: message.guild.id}}) : await client.models.get("raidingchannels").findAll({where: {guildID: message.guild.id}});
        let channels = [];
        for (let i = 0; i < channelsDB.length; i++) {
            channels.push(channelsDB[i].dataValues.channelID);
        }
        if (numberNumber - 1 > channels.length) {
            return message.channel.send("Please provide a valid channel to check against.").catch(e => {});
        }
        const imageAttached = Array.from(message.attachments.values())[0];
        let optionalImage = args[2];
        if (!imageAttached && !optionalImage) {
            return message.channel.send(`Please attach an image for the parsemembers.`).catch(e => {});
        }
        let imageURL = (imageAttached) ? imageAttached.proxyURL : optionalImage;
        let raidingChannel = message.guild.channels.get(channels[numberNumber - 1]);
        let imageToParse = "./data/who.png";
        const request = {
            image: {
                source:{
                    imageUri: imageURL
                }
            },
            imageContext: {
                languageHints: ['en'],
            },
        };
        await clients.documentTextDetection(request).then(async results => {
            let peoples = guildMembers.filter(e => {
                return !e.permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS");
            });
            let fullTextAnnotation = results[0].fullTextAnnotation;
            if (!fullTextAnnotation) {
                return message.channel.send(`Something went wrong while trying to parse your message. Most likely it is because the image is not cropped to include only the yellow /who text. Please try cropping the image to only include it or make the image larger.`).catch(e => {});
            }
            let peopleText = fullTextAnnotation.text;
            if (peopleText.split(":").length !== 2) {
                return message.channel.send(`Something went wrong while trying to parse your message. Most likely it is because the image is not cropped to include only the yellow /who text. Please try cropping the image to only include it or make the image larger.`).catch(e => {});
            }
            let myPeople = peopleText.split(":")[1];
            let myPeople1 = myPeople.split(" ").join("").split("с").join("c").split("А").join("A").split("а").join("a").split("'").join("").split("é").join("e").split("Ụ").join("U").split("ó").join("o").split("1").join("l").split("İ").join("i").split("|").join("l").split("\n").join("").split(".").join(",").split("0").join("O").split(")").join("D").split("9").join("q").split("5").join("S");
            let names = myPeople1.split(",");
            let crashers = [];
            let possibleAlts = [];
            let badNames = [];
            let command = require("./help/nickname_search");
            let goodPeople = [];
            let kickPeople = [];
            let membersInRaiding = raidingChannel.members.keyArray();
            let raidingMembers = raidingChannel.members.array();
            let msg = await message.channel.send(`Starting to find members now... This may take up to a minute to complete.\nTo cancel, react with ❌ below.`).catch(e => {});
            await msg.react("❌").catch(e => {});
            let filter = (reaction, user) => user.id === message.author.id;
            let collector = new Discord.ReactionCollector(msg, filter);
            let aborting = false, aborter;
            collector.on("collect", (reaction, user) => {
                if (reaction.emoji.name === "❌") {
                    aborter = user;
                    aborting = true;
                    collector.stop();
                }
            });
            collector.on("end", (collected) => {
                msg.reactions.removeAll();
            });
            for (let i = 0; i < names.length; i++) {
                if (names[i]) {
                    await sleep(1);
                    if (aborting) {
                        return message.channel.send(`Parse aborted by ${guildMembers.get(aborter.id)}`).catch(e => {});
                    }
                    if (/^[a-zA-Z]*$/.test(names[i]) && names[i].length <= 10) {
                        let person = (raidingMembers.length) ? await command(message.guild.id, raidingMembers, names[i], settings) : null;
                        if (person) {
                            let position = raidingMembers.indexOf(person);
                            raidingMembers = raidingMembers.splice(position, 1);
                            goodPeople.push(person.id);
                        } else {
                            person = await command(message.guild.id, guildMembers, names[i], settings);
                            if (person) {
                                if (!membersInRaiding.includes(person.id) && !person.permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS")) {
                                    if (person.nickname.includes(" | ")) {
                                        crashers.push(`${person} (${names[i]})`);
                                    } else {
                                        crashers.push(person);
                                    }
                                    kickPeople.push(names[i]);
                                } else {
                                    goodPeople.push(person.id);
                                }
                            } else {
                                let myName = names[i].toLowerCase();
                                let permutations = [];
                                if (myName.includes(`i`)) {
                                    let results = replace_letters(myName, "i", "l");
                                    permutations = permutations.concat(results);
                                }
                                if (myName.includes(`l`)) {
                                    let results = replace_letters(myName, "l", "i");
                                    for (let i = 0; i < results.length; i++) {
                                        if (!permutations.includes(results[i])) {
                                            permutations.push(results[i]);
                                        }
                                    }
                                }
                                if (myName.includes(`a`)) {
                                    let results = replace_letters(myName, "a", "q");
                                    for (let i = 0; i < results.length; i++) {
                                        if (!permutations.includes(results[i])) {
                                            permutations.push(results[i]);
                                        }
                                    }
                                }
                                if (myName.includes(`p`)) {
                                    let results = replace_letters(myName, "p", "D");
                                    for (let i = 0; i < results.length; i++) {
                                        if (!permutations.includes(results[i])) {
                                            permutations.push(results[i]);
                                        }
                                    }
                                }
                                if (!myName.includes("i") && !myName.includes("l")) {
                                    crashers.push(names[i]);
                                    kickPeople.push(names[i]);
                                } else {
                                    let position = permutations.indexOf(myName);
                                    permutations.splice(position, 1);
                                    let found = false;
                                    let maybeTheRightPerson = [];
                                    for (let j = 0; j < ((permutations.length <= 30) ? permutations.length : 30); j++) {
                                        let person1 = await command(message.guild.id, guildMembers, permutations[j], settings);
                                        if (person1) {
                                            if (!membersInRaiding.includes(person1.id) && !person1.permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS")) {
                                                let newArray = [];
                                                newArray.push(person1);
                                                newArray.push(permutations[j]);
                                                maybeTheRightPerson.push(newArray);
                                            } else {
                                                goodPeople.push(person1.id);
                                                found = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (found === false) {
                                        if (maybeTheRightPerson.length > 0) {
                                            crashers.push(maybeTheRightPerson[0][0]);
                                            kickPeople.push(maybeTheRightPerson[0][1]);
                                        } else {
                                            crashers.push(names[i]);
                                            kickPeople.push(names[i]);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        badNames.push(names[i]);
                    }
                }
            }
            collector.stop();
            let peopleInRaiding = raidingChannel.members.filter(e => !e.permissionsIn(raidingChannel).toArray().includes("MOVE_MEMBERS")).keyArray();
            for (let i = 0; i < peopleInRaiding.length; i++) {
                if (!goodPeople.includes(peopleInRaiding[i])) {
                    if (peoples.get(peopleInRaiding[i])) {
                        possibleAlts.push(peoples.get(peopleInRaiding[i]));
                    } else {
                        if (crashers.includes(guildMembers.get(peopleInRaiding[i]))) {
                            let position = crashers.indexOf(guildMembers.get(peopleInRaiding[i]));
                            crashers.splice(position, 1);
                            kickPeople.splice(position, 1);
                        }
                    }
                }
            }
            let message1 = `**These people are in voice channel ${raidingChannel} but not in game, possible alts:**\n${possibleAlts.sort((a, b) => {
                return (a.displayName.toLowerCase() > b.displayName.toLowerCase()) ? 1 : -1;
            }).join(", ")}`;
            let message2 = `**These people are not in voice channel ${raidingChannel}, they are crashers:**\n${crashers.sort((a, b) => {
                if (a.displayName && b.displayName) {
                    return (a.displayName.toLowerCase() > b.displayName.toLowerCase()) ? 1 : -1;
                } else if (a.displayName) {
                    return -1;
                } else if (b.displayName) {
                    return 1;
                } else if (a.toLowerCase() > b.toLowerCase()) {
                    return 1;
                } else {
                    return -1;
                }
            }).join(", ")}${(badNames.length) ? `\n**People who I could not parse properly:**\n${badNames.join(", ")}` : ""}`;
            let message3 = `${(kickPeople.length) ? `/kick \`${kickPeople.sort((a, b) => {
                return (a.toLowerCase() > b.toLowerCase()) ? 1 : -1;
            }).join("\`\n/kick \`")}\`` : ""}`;
            let allMessages = [];
            if (`${message1}\n${message2}\n${message3}`.length < 1950) {
                allMessages.push(`${message1}\n${message2}\n${message3}`);
            } else if (`${message1}\n${message2}`.length <= 2000) {
                allMessages.push(`${message1}\n${message2}`);
                allMessages.push(`${message3}`);
            } else if (`${message2}\n${message3}`.length < 2000) {
                allMessages.push(`${message1}`);
                allMessages.push(`${message2}\n${message3}`);
            } else {
                allMessages.push(`${message1}`);
                allMessages.push(`${message2}`);
                allMessages.push(`${message3}`);
            }
            let oldParse = await client.models.get("parsemembers").findAll({where: {guildID: message.guild.id, raidingChannel: raidingChannel.id}});
            for (let i = 0; i < oldParse.length; i++) {
                try {
                    let oldMessage = await message.guild.channels.get(settings.parsemembersChannel).messages.fetch(oldParse[i].dataValues.messageID);
                    await oldMessage.delete();
                } catch(e) {

                }
            }
            await client.models.get("parsemembers").destroy({where: {guildID: message.guild.id, raidingChannel: raidingChannel.id}});
            if (message.guild.channels.get(settings.parsemembersChannel)) {
                await message.guild.channels.get(settings.parsemembersChannel).send(imageURL).then(async msg => {
                    await client.models.get("parsemembers").create({
                        guildID: message.guild.id,
                        messageID: msg.id,
                        raidingChannel: raidingChannel.id,
                        time: Date.now() + 1800000
                    });
                }).catch(e => {});
            }
            if (message.guild.channels.get(settings.parsemembersChannel)) {
                for (let i = 0; i < allMessages.length; i++) {
                    await message.guild.channels.get(settings.parsemembersChannel).send(allMessages[i]).then(async msg => {
                        await client.models.get("parsemembers").create({
                            guildID: message.guild.id,
                            messageID: msg.id,
                            raidingChannel: raidingChannel.id,
                            time: Date.now() + 1800000
                        });
                    }).catch(e => {});
                }
            }
            for (let i = 0; i < allMessages.length; i++) {
                await message.channel.send(allMessages[i]).catch(e => {});
            }
        }).catch(err => {
            return message.channel.send("Failed to fetch the image from Discord.").catch(e => {});
        });
    }
}
function replace_letters(value, letterToChange, charToReplaceWith) {
    const permutations = [];
    const letters = value.split("");
    const permCount = 1 << value.length;
    for (let perm = 0; perm < permCount; perm++) {
        letters.reduce((perm, letter, i) => {
            if (letters[i] === letterToChange || letters[i] === charToReplaceWith) {
                letters[i] = (perm & 1) ? charToReplaceWith : letterToChange;
            }
            return perm >> 1;
        }, perm);
        permutations.push(letters.join(""));
    }
    return permutations.filter((value, index, self) => self.indexOf(value) === index);
}

async function sleep(ms) {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}