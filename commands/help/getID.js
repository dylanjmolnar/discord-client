const yt_api_key = `AIzaSyCeTOz20U_bO3kFDjRZAqMiO9-_oyzlYP0`;
const request = require('request');
const fetchVideoInfo = require("youtube-info");
const getYouTubeID = require('get-youtube-id');
const Discord = require('discord.js');

module.exports = async (message, guilds, str, cb) => {
    let id = await getYouTubeID(str);
    if (id) {
        request(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails,snippet&key=${yt_api_key}`, async function(error, response, body1) {
            let json1 = JSON.parse(body1);
            let time = json1.items[0].contentDetails.duration.slice(2);
            if (parseInt(time.substring(0, time.length - 1)) < 1 && !time.includes("M") || time.includes("W") || time.includes("D")) {
                return message.channel.send(`You cannot play live videos or videos longer than a day through the bot!`);
            } else {
                let timeToText;
                if (time.includes("H")) {
                    let timeTXT = (time.indexOf("S") < 0) ? "0" : time.substring(time.indexOf("M") + 1, time.length - 1);
                    timeTXT = (time.indexOf("M") < 0) ? time.substring(time.indexOf("H") + 1, time.length - 1) : time.substring(time.indexOf("M") + 1, time.length - 1);
                    let timeTXT2 = (time.indexOf("M") < 0) ? "0" : time.substring(time.indexOf("H") + 1, time.indexOf("M"));
                    if (parseInt(timeTXT) < 10) {
                        if (parseInt(timeTXT2) < 10) {
                            timeToText = `${time.substring(0, time.indexOf("H"))}:0${timeTXT2}:0${timeTXT}`;
                        } else {
                            timeToText = `${time.substring(0, time.indexOf("H"))}:${timeTXT2}:0${timeTXT}`;
                        }
                    } else {
                        if (parseInt(timeTXT2) < 10) {
                            timeToText = `${time.substring(0, time.indexOf("H"))}:0${timeTXT2}:${timeTXT}`;
                        } else {
                            timeToText = `${time.substring(0, time.indexOf("H"))}:${timeTXT2}:${timeTXT}`;
                        }
                    }
                } else if (time.includes("M")) {
                    let timeTXT = (time.indexOf("S") < 0) ? "0" : time.substring(time.indexOf("M") + 1, time.length - 1);
                    if (parseInt(timeTXT) < 10) {
                        timeToText = `${time.substring(0, time.indexOf("M"))}:0${timeTXT}`;
                    } else {
                        timeToText = `${time.substring(0, time.indexOf("M"))}:${timeTXT}`;
                    }
                } else {
                    let timeTXT = time.substring(0, time.length - 1);
                    if (parseInt(timeTXT) !== 0) {
                        if (parseInt(timeTXT) < 10) {
                            timeToText = `0:0${timeTXT}`;
                        } else {
                            timeToText = `0:${timeTXT}`;
                        }
                    }
                }
                cb(id, null, timeToText, json1.items[0].snippet.channelTitle, json1.items[0].snippet.title);
            }
        });
    } else {
        search_video(message, guilds, str, function(id, msg, time, channel, title) {
            cb(id, msg, time, channel, title);
        });
    }
}

async function search_video(message, guilds, query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id,snippet&videoSyndicated=true&type=video&maxResults=10&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, async function(error, response, body) {
        let json = JSON.parse(body);
        if (json.items[0]) {
            let mass = (json.items.length < 10) ? json.items.length : 10;
            let mass1 = (json.items.length < 5) ? json.items.length : 5;
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Select one by responding with \`<number (1-${mass1})>\``);
            let newString = json.items[0].id.videoId;
            for (let i = 1; i < mass; i++) {
                newString += `,${json.items[i].id.videoId}`;
            }
            request(`https://www.googleapis.com/youtube/v3/videos?id=${newString}&part=contentDetails&key=${yt_api_key}`, async function(error, response, body1) {
                let json1 = JSON.parse(body1);
                let numberFound = 0;
                let newArray = [];
                let timeIntexts = [];
                for (let i = 0; i < mass; i++) {
                    if (numberFound >= 5) {
                        break;
                    }
                    let time = json1.items[i].contentDetails.duration.slice(2);
                    let timeToText;
                    if (time.includes("D") || time.includes("W")) {
                        
                    } else if (time.includes("H")) {
                        let timeTXT = (time.indexOf("S") < 0) ? "0" : time.substring(time.indexOf("M") + 1, time.length - 1);
                        timeTXT = (time.indexOf("M") < 0) ? time.substring(time.indexOf("H") + 1, time.length - 1) : time.substring(time.indexOf("M") + 1, time.length - 1);
                        let timeTXT2 = (time.indexOf("M") < 0) ? "0" : time.substring(time.indexOf("H") + 1, time.indexOf("M"));
                        if (parseInt(timeTXT) < 10) {
                            if (parseInt(timeTXT2) < 10) {
                                timeToText = `${time.substring(0, time.indexOf("H"))}:0${timeTXT2}:0${timeTXT}`;
                            } else {
                                timeToText = `${time.substring(0, time.indexOf("H"))}:${timeTXT2}:0${timeTXT}`;
                            }
                        } else {
                            if (parseInt(timeTXT2) < 10) {
                                timeToText = `${time.substring(0, time.indexOf("H"))}:0${timeTXT2}:${timeTXT}`;
                            } else {
                                timeToText = `${time.substring(0, time.indexOf("H"))}:${timeTXT2}:${timeTXT}`;
                            }
                        }
                        newArray.push(json.items[i]);
                        numberFound++;
                        timeIntexts.push(timeToText);
                        embed.setDescription(`${embed.description || ""}\n**${numberFound}**: [${json.items[i].snippet.title}](https://www.youtube.com/watch?v=${json.items[i].id.videoId}) [${timeToText}]`);
                    } else if (time.includes("M")) {
                        let timeTXT = (time.indexOf("S") < 0) ? "0" : time.substring(time.indexOf("M") + 1, time.length - 1);
                        if (parseInt(timeTXT) < 10) {
                            timeToText = `${time.substring(0, time.indexOf("M"))}:0${timeTXT}`;
                        } else {
                            timeToText = `${time.substring(0, time.indexOf("M"))}:${timeTXT}`;
                        }
                        newArray.push(json.items[i]);
                        numberFound++;
                        timeIntexts.push(timeToText);
                        embed.setDescription(`${embed.description || ""}\n**${numberFound}**: [${json.items[i].snippet.title}](https://www.youtube.com/watch?v=${json.items[i].id.videoId}) [${timeToText}]`);
                    } else {
                        let timeTXT = time.substring(0, time.length - 1);
                        if (parseInt(timeTXT) !== 0) {
                            if (parseInt(timeTXT) < 10) {
                                timeToText = `0:0${timeTXT}`;
                            } else {
                                timeToText = `0:${timeTXT}`;
                            }
                            newArray.push(json.items[i]);
                            numberFound++;
                            timeIntexts.push(timeToText);
                            embed.setDescription(`${embed.description || ""}\n**${numberFound}**: [${json.items[i].snippet.title}](https://www.youtube.com/watch?v=${json.items[i].id.videoId}) [${timeToText}]`);
                        }
                    }
                }
                embed.setFooter(`Send \`cancel\` to cancel selection`);
                message.channel.send(embed).then(msg => {
                    let filter = (message) => true;
                    let messageCol = new Discord.MessageCollector(message.channel, filter, {
                        time: 60000
                    });
                    guilds[message.guild.id].music.isSelecting = true;
                    let found = false;
                    messageCol.on("collect", (messages) => {
                        if (messages.author.bot === false) {
                            if (messages.content) {
                                if (/^[0-9]*$/.test(messages.content)) {
                                    if (parseInt(messages.content) <= newArray.length) {
                                        found = true;
                                        callback(newArray[parseInt(messages.content) - 1].id.videoId, msg, timeIntexts[parseInt(messages.content) - 1], newArray[parseInt(messages.content) - 1].snippet.channelTitle, newArray[parseInt(messages.content) - 1].snippet.title, newArray[parseInt(messages.content) - 1].snippet.thumbnails.default.url);
                                        messageCol.stop();
                                    }
                                } else if (messages.content.toLowerCase() === "cancel") {
                                    messageCol.stop();
                                } else {
                                    message.channel.send(`That is an invalid response. Type either \`cancel\` or \`<number 1-${newArray.length}>\``);
                                }
                            }
                        }
                    });
                    messageCol.on("end", (collected) => {
                        if (found === false) {
                            message.channel.send(`No song will be selected to add to queue.`);
                        }
                        setTimeout(() => {
                            guilds[message.guild.id].music.isSelecting = false;
                        }, 500);
                    })
                });
            });
        } else {
            message.channel.send(`:x: No matches found!`);
        }
    });
}