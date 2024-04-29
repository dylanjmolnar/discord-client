const getYouTubeID = require("get-youtube-id");
const Discord = require('discord.js');

const ytdl = require('ytdl-core-discord');

module.exports = {
    aliases: ["p"],
    description: "Plays the requested song.",
    use: "play [song name | YouTube URL]",
    cooldown: 1,
    type: "music",
    dms: false,
    public: false,
    premium: true,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ").slice(1).join(" ");
        if (!args[1]) {
            return message.channel.send(`Please provide a valid song to look up.`).catch(e => {});
        }
        if (guildMembers.get(message.author.id).voice.channel) {
            let command = require("./help/getID");
            message.channel.send(`Searching ${client.emojisMisc.get("youtube")} for \`${args}\``);
            command(message, guilds, args, async (id, msg, durationInText, channelName, videoTitle) => {
                let getdID = await getYouTubeID(id);
                if (getdID) {
                    guilds[message.guild.id].music.queue.push(getdID);
                } else {
                    guilds[message.guild.id].music.queue.push(id);
                }
                let timeInText = durationInText.split(":");
                let fullTime = 0;
                if (timeInText.length > 2) {
                    fullTime += parseInt(timeInText[0] * 3600);
                    fullTime += parseInt(timeInText[1] * 60);
                    fullTime += parseInt(timeInText[2]);
                } else {
                    fullTime += parseInt(timeInText[0] * 60);
                    fullTime += parseInt(timeInText[1]);
                }
                guilds[message.guild.id].music.queueNames.push(`[${videoTitle}](https://www.youtube.com/watch?v=${id}) [${durationInText}]`);
                let embed = new Discord.MessageEmbed();
                embed.setDescription(`[${videoTitle}](https://www.youtube.com/watch?v=${id})`);
                embed.setThumbnail(`https://i.ytimg.com/vi/${id}/hqdefault.jpg?width=432&height=324`);
                embed.addField(`Channel`, `${channelName}`, true);
                embed.addField(`Song Duration`, `${durationInText}`, true);
                if (!guilds[message.guild.id].dispatcher) {
                    embed.setAuthor(`Now Playing!`, message.author.displayAvatarURL());
                    playMusic(id, message, client, guilds[message.guild.id]);
                } else {
                    let totalTime = 0;
                    for (let i = 0; i < guilds[message.guild.id].music.queueTime.length; i++) {
                        totalTime += guilds[message.guild.id].music.queueTime[i];
                    }
                    totalTime -= Math.floor(guilds[message.guild.id].dispatcher.streamTime / 1000);
                    let timeOfSongs = totalTime;
                    if (totalTime > 60) {
                        if (totalTime > 3600) {
                            let hoursOfSong = Math.floor(totalTime / 3600);
                            let minutesOfSong = Math.floor(Math.floor(totalTime - (hoursOfSong * 3600)) / 60);
                            let remainder = totalTime - (hoursOfSong * 3600) - (minutesOfSong * 60);
                            if (remainder < 10) {
                                remainder = `0${remainder}`;
                            }
                            if (minutesOfSong < 10) {
                                minutesOfSong = `0${minutesOfSong}`;
                            }
                            timeOfSongs = `${hoursOfSong}:${minutesOfSong}:${remainder}`;
                        } else {
                            let minutesOfSong = Math.floor(totalTime / 60);
                            let remainder = totalTime - (minutesOfSong * 60);
                            if (remainder < 10) {
                                remainder = `0${remainder}`;
                            }
                            timeOfSongs = `${minutesOfSong}:${remainder}`;
                        }
                    } else if (totalTime > 9) {
                        timeOfSongs = `0:${totalTime}`;
                    } else {
                        timeOfSongs = `0:0${totalTime}`;
                    }
                    embed.setAuthor(`Added to Queue!`, message.author.displayAvatarURL());
                    embed.addField(`Estimated time until playing`, `${timeOfSongs}`, true);
                    embed.addField(`Position in queue`, `${guilds[message.guild.id].music.queueNames.length - 1}`, true);
                }
                if (msg) {
                    if (!msg.deleted) {
                        msg.edit(embed).catch(e => {});
                    } else {
                        message.channel.send(embed).catch(e => {});
                    }
                } else {
                    message.channel.send(embed).catch(e => {});
                }
                guilds[message.guild.id].music.queueTime.push(fullTime);
            });
        } else {
            message.channel.send("You must be in a voice channel to play music");
        }
    }
}

function playMusic(id, message, client, guild) {
    let connections;
    if (message.guild.members.get(client.user.id).voice.channel) {
        connections = message.guild.members.get(client.user.id).voice.channel;
    } else {
        connections = message.member.voice.channel;
    }
    connections.join().then(async (connection) => {
        guild.dispatcher = connection.play(await ytdl(`https://www.youtube.com/watch?v=${id}`, {
            filter: "audioonly"
        }).catch(e => guild.dispatcher.end()), { type: 'opus' });
        guild.dispatcher.setVolumeLogarithmic(1/5);
        guild.dispatcher.on("error", (error) => {
            console.log(error);
        });
        guild.dispatcher.on("end", async () => {
            let guilds = await client.models.get("guild").findOne({where: {guildID: message.guild.id}});
            if (guilds.dataValues.loopSwitch) {
                guild.music.queue.push(guild.music.queue[0]);
                guild.music.queueNames.push(guild.music.queueNames[0]);
            }
            if (guild.music.queue.length !== 0) {
                guild.music.queue.shift();
                guild.music.queueNames.shift();
            }
            if (guild.music.queue.length === 0) {
                guild.dispatcher = null;
                await connection.disconnect();
            } else {
                playMusic(guild.music.queue[0], message, client, guild);
            }
        });
    }).catch(e => {
        message.channel.send(`I cannot join the channel ${connections}. This is most likely because I am missing permissions to do so.`).catch(e => {});
    });
}