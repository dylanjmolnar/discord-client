const Discord = require('discord.js');

module.exports = {
    aliases: ["clearEvent", "ce"],
    description: "Moves all members from the event raiding channel to the event queue channel",
    use: "cleanEvent [channel number]",
    cooldown: 5,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (guilds[message.guild.id].cleaning === true) {
            return message.channel.send(`I cannot start cleaning if another cleaning module is active.`);
        }
        let typeOfChannel = await client.models.get("eventraiding").findAll({where: {guildID: message.guild.id}});
        let queueChannel = await client.models.get("eventqueue").findAll({where: {guildID: message.guild.id}});
        if (queueChannel.length === 0) {
            queueChannel = await client.models.get("queuechannels").findAll({where: {guildID: message.guild.id}});
        }
        let channel = message.content.split(" ").slice(1).join(" ");
        let channels = typeOfChannel.length;
        if (!channel) {
            return message.channel.send("Please provide a channel to clean. Your channel numbers are 1 to " + channels + ".");
        }
        if (!/^[0-9]*$/.test(channel)) {
            return message.channel.send("Please provide a channel to clean. Your channel numbers are 1 to " + channels + ".");
        }
        if (parseInt(channel) > channels || parseInt(channel) < 1) {
            return message.channel.send("Please provide a channel to clean. Your channel numbers are 1 to " + channels + ".");
        }
        guilds[message.guild.id].cleaning = true;
        let collectors;
        let myMessage;
        let myChannel = parseInt(channel) - 1;
        let channelID = typeOfChannel[myChannel].dataValues.channelID;
        let raidingChannel = message.guild.channels.get(channelID);
        let peopleInRaiding = await raidingChannel.members.filter(e => !e.permissionsIn(channelID).toArray().includes("MOVE_MEMBERS")).keyArray();
        let newInterval;
        if (raidingChannel) {
            if (peopleInRaiding.length > 7) {
                newInterval = setInterval(async () => {
                    await move();
                }, 7000);
            }
        }
        await move();
        async function move() {
            if (raidingChannel) {
                peopleInRaiding = await raidingChannel.members.filter(e => !e.permissionsIn(channelID).toArray().includes("MOVE_MEMBERS")).keyArray();
                let myLength = peopleInRaiding.length;
                let mass = await 7;
                if (!myLength) {
                    mass = 0;
                } else if (myLength < 7) {
                    mass = await myLength;
                }
                for (let i = 0; i < mass; i++) {
                    let user = guildMembers.get(peopleInRaiding[i]);
                    if (user) {
                        if (user.voice) {
                            await user.voice.setChannel(queueChannel[0].dataValues.channelID).catch(e => {});
                        }
                    }
                }
                if (myLength <= 7) {
                    guilds[message.guild.id].cleaning = false;
                    if (newInterval) {
                        clearInterval(newInterval);
                    }
                    message.channel.send(`Cleaning is now finished.`);
                    setTimeout(() => {
                        if (collectors) {
                            collectors.stop();
                        }
                        if (myMessage) {
                            myMessage.delete().catch(e => {});
                        } else {
                            setTimeout(() => {
                                if (myMessage) {
                                    myMessage.delete().catch(e => {});
                                }
                            }, 5000);
                        }
                    }, 1000);
                }
            } else {
                guilds[message.guild.id].cleaning = false;
                if (newInterval) {
                    clearInterval(newInterval);
                }
            }
        }
        let aborter = new Discord.MessageEmbed();
        aborter.setTitle(`Cleaning aborter for \`${message.guild.channels.get(channelID).name}\``);
        aborter.setDescription(`If you with to abort the Cleaner, please react with :x: below.`);
        await message.channel.send(aborter).then(async (msg) => {
            myMessage = msg;
            let filter = (reaction, user) => reaction.emoji.name === "❌";
            collectors = new Discord.ReactionCollector(msg, filter);
            await collectors.on("collect", (element, collector) => {
                if (element.users.last().bot === false) {
                    guilds[message.guild.id].cleaning = false;
                    if (newInterval) {
                        clearInterval(newInterval);
                    }
                    collectors.stop();
                    msg.delete().catch(e => {});
                    message.channel.send(`Cleaning aborted by ${element.users.last()} (${guildMembers.get(element.users.lastKey()).displayName}).`);
                }
            });
            await msg.react("❌");
        });
    }
}