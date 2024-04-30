const Discord = require('discord.js');

module.exports = {
    aliases: ["q"],
    description: "Lists the queued songs for the server or remove a specific song from the queue.",
    use: "queue <remove> <number>",
    cooldown: 1,
    type: "music",
    dms: false,
    public: false,
    premium: true,
    allChannels: false,
    channels: [],
    roles: ["mutedRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        if (message.content.split(" ").slice(1).join(" ") === "") {
            let queueEmbed = new Discord.MessageEmbed();
            queueEmbed.setTitle(`🎶__Current Song__🎶`);
            queueEmbed.setColor(0xffe451);
            if (guilds[message.guild.id].music.queueNames.length !== 0) {
                let position = guilds[message.guild.id].music.queueNames[0].lastIndexOf("[");
                let firstPart = guilds[message.guild.id].music.queueNames[0].slice(position + 1);
                let lastPart = guilds[message.guild.id].music.queueNames[0].slice(0, position + 1);
                let middlePart = Math.floor(guilds[message.guild.id].dispatcher.streamTime / 1000);
                let timeOfSong = Math.floor(guilds[message.guild.id].dispatcher.streamTime / 1000);
                if (middlePart > 60) {
                    if (middlePart > 3600) {
                        let hoursOfSong = Math.floor(middlePart / 3600);
                        let minutesOfSong = Math.floor(Math.floor(middlePart - (hoursOfSong * 3600)) / 60);
                        let remainder = middlePart - (hoursOfSong * 3600) - (minutesOfSong * 60);
                        if (remainder < 10) {
                            remainder = `0${remainder}`;
                        }
                        if (minutesOfSong < 10) {
                            minutesOfSong = `0${minutesOfSong}`;
                        }
                        timeOfSong = `${hoursOfSong}:${minutesOfSong}:${remainder}`;
                    } else {
                        let minutesOfSong = Math.floor(middlePart / 60);
                        let remainder = middlePart - (minutesOfSong * 60);
                        if (remainder < 10) {
                            remainder = `0${remainder}`;
                        }
                        timeOfSong = `${minutesOfSong}:${remainder}`;
                    }
                } else if (middlePart > 9) {
                    timeOfSong = `0:${middlePart}`;
                } else {
                    timeOfSong = `0:0${middlePart}`;
                }
                queueEmbed.setDescription(`${lastPart}${timeOfSong}/${firstPart}`);
            } else {
                queueEmbed.setDescription(`Empty`);
            }
            let queueSongs = [];
            for (let i = 1; i < guilds[message.guild.id].music.queueNames.length; i++) {
                let numberOfSong = i;
                if (i === 0) {
                    queueSongs.push(`${numberOfSong}:  ${guilds[message.guild.id].music.queueNames[i]} (**Now Playing**)`);
                } else {
                    queueSongs.push(`${numberOfSong}:  ${guilds[message.guild.id].music.queueNames[i]}`);
                }
            }
            if (queueSongs.length !== 0) {
                queueEmbed.addField(`Your Server's Queue:`, `${queueSongs.join("\n")}`);
            }
            queueEmbed.setFooter(`Loop is set to ${settings.loopSwitch}.`)
            message.channel.send(queueEmbed);
        } else {
            let addOrRemove = message.content.split(" ").slice(1)[0];
            if (addOrRemove.toLowerCase() === "remove") {
                let numberOfSong = message.content.split(" ").slice(2).join(" ");
                if (/^[0-9]*$/.test(numberOfSong) && numberOfSong) {
                    let numberInQueue = guilds[message.guild.id].music.queueNames.length - 1;
                    if (parseInt(numberOfSong) > numberInQueue) {
                        return message.channel.send("Please provide a valid song to remove from the queue.");
                    } else {
                        let embed = new Discord.MessageEmbed();
                        embed.setAuthor(`Removed from Queue!`, message.author.displayAvatarURL());
                        embed.setDescription(`${numberOfSong}: ${guilds[message.guild.id].music.queueNames[parseInt(numberOfSong)]}`);
                        message.channel.send(embed);
                        guilds[message.guild.id].music.queueNames.splice(parseInt(numberOfSong), 1);
                        guilds[message.guild.id].music.queue.splice(parseInt(numberOfSong), 1);
                        guilds[message.guild.id].music.queueTime.splice(parseInt(numberOfSong), 1);
                    }
                } else {
                    return message.channel.send("Please provide a valid song to remove from the queue.");
                }
            }
            if (addOrRemove.toLowerCase() === "clear") {
                if (guilds[message.guild.id].music.queueNames.length > 1) {
                    message.channel.send("Queue is now cleared!");
                    for (let i = guilds[message.guild.id].music.queueNames.length - 1; i > 0; i = i - 1) {
                        await guilds[message.guild.id].music.queueNames.splice(i, 1);
                        await guilds[message.guild.id].music.queue.splice(i, 1);
                        await guilds[message.guild.id].music.queueTime.splice(i, 1);
                    }
                } else {
                    return message.channel.send("There are no songs in the queue to clear.");
                }
            }
        }
    }
}