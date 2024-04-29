const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core-discord');
const getYouTubeID = require('get-youtube-id');

module.exports = {
    aliases: ["vDownload"],
    description: "Downloads the youtube video and sends it in dms.",
    use: `videoDownload [url] [title]`,
    cooldown: 1,
    type: "private",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (message.author.id === "321726133307572235") {
            let args = message.content.split(" ");
            let url = args[1];
            let title = args.slice(2).join(" ");
            if (!url) {
                return message.channel.send(`Please make sure to provide a valid url to download from.`);
            }
            if (!title) {
                return message.channel.send(`Please make sure to provide a valid title to name the video.`);
            }
            let id = await getYouTubeID(url);
            if (!id) {
                return message.channel.send(`That is an invalid url to download a video from.`);
            }
            message.author.send(`Starting download...`).then(msg => {
                try {
                    ytdl(`https://www.youtube.com/watch?v=${id}`).pipe(fs.createWriteStream(`./data/video.mp4`)).on("close", async () => {
                        let attachment = new Discord.MessageAttachment(`./data/video.mp4`, `${title}.mp4`);
                        await message.author.send(attachment).catch(e => {
                            message.author.send(`Something went wrong while downloading the video. Most likely the file size was too large to send on discord.`).catch();
                        });
                    });
                } catch (err) {
                    console.log("oops");
                }
            });
        }
    }
}
