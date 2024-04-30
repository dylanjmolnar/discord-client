const fs = require('fs');
const ytdl = require('ytdl-core');
const getYouTubeID = require('get-youtube-id');
const ffmetadata = require('ffmetadata');
const audioConverter = require('video-converter');
const Jimp = require("jimp");

audioConverter.setFfmpegPath("C:/FFMPEG/bin/ffmpeg", (err) => {
    if (err) console.log(err);
});

module.exports = {
    aliases: [],
    description: "Downloads the song requested as a mp3.",
    use: "download [url] [title]",
    cooldown: 0,
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
            let query = args[1];
            let name = args.splice(2).join(" ");
            let id = await getYouTubeID(query);
            if (!id) {
                return message.channel.send(`That is an invalid url to download a video from.`);
            }
            try {
                let data = await client.spotify.search({type: "track", query: name});
                let song = data.tracks.items[0];
                if (!song) {
                    return message.channel.send(`I could not find the song you are looking for`);
                }
                if (song.name.includes("(feat")) {
                    let feats = song.name.substring(song.name.lastIndexOf("("), song.name.lastIndexOf(")"));
                    feats = feats.split(" ").slice(1).join(" ").split(", ").join("|").split(" & ").join("|").split("|");
                    for (let i = 0; i < feats.length; i++) {
                        let position = song.artists.indexOf(song.artists.find(e => e.name === feats[i]));
                        song.artists.splice(position, 1);
                    }
                }
                if (song.name.includes("(with")) {
                    song.name = song.name.split(" (").slice(0, 1).join("");
                }
                let artists = song.artists.map((e, i) => {
                    if (i === song.artists.length - 1) return `${e.name}`
                    else if (i === song.artists.length - 2) return `${e.name} & `
                    else return `${e.name}, `
                }).join("");
                let messager = await message.channel.send(`Found the song \`${song.name}\` by \`${artists}\`, doing your dirst work boss :D`).catch(e => {});
                var tags = {
                    title: song.name,
                    artist: artists,
                    album_artist: song.album.artists.map((e, i) => {
                        if (i === song.album.artists.length - 1) return `${e.name}`
                        else if (i === song.album.artists.length - 2) return `${e.name} & `
                        else return `${e.name}, `
                    }).join(""),
                    track: song.track_number,
                    album: song.album.name,

                };
                ytdl(`https://www.youtube.com/watch?v=${id}`, {
                    filter: "audioonly",
                    filter: (format) => format.container === 'mp4'
                }).pipe(fs.createWriteStream(`./data/audio.mp4`)).on("close", async () => {
                    audioConverter.convert("./data/audio.mp4", `C:/Users/Dylan/Downloads/${tags.artist} - ${tags.title}.mp3`, async (err) => {
                        if (err) console.log(err);
                        const image = await Jimp.read(song.album.images[0].url);
                        await image.writeAsync("albumArt.jpg");
                        const coverImage = {
                            attachments: ["albumArt.jpg"],
                            'id3v2.3' : true
                        };
                        ffmetadata.write(`C:/Users/Dylan/Downloads/${tags.artist} - ${tags.title}.mp3`, tags, coverImage, (error) => {
                            if (err) console.log(error);
                            if (messager) {
                                messager.edit("Done doing your dirst work boss ;D").catch(e => {});
                            }
                        });
                    });
                });
            } catch(error) {
                console.log(error);
            }
        }
    }
}
