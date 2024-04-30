const cheerio = require('cheerio');
const request = require("request");
const Jimp = require("jimp");

module.exports = {
    aliases: ["updateEmoji", "ue"],
    description: "Updates all the emojis with the in game items.",
    use: `updateEmojis`,
    cooldown: 20,
    type: "private",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (message.author.id === "321726133307572235") {
            await message.channel.send(`Starting to parse all of realmeye for equiptment reactions. Will let you know when I'm done...`);
            let urls = [
                `https://www.realmeye.com/wiki/bows`,
                `https://www.realmeye.com/wiki/daggers`,
                `https://www.realmeye.com/wiki/staves`,
                `https://www.realmeye.com/wiki/wands`,
                `https://www.realmeye.com/wiki/swords`,
                `https://www.realmeye.com/wiki/katanas`,
                `https://www.realmeye.com/wiki/leather-armors`,
                `https://www.realmeye.com/wiki/robes`,
                `https://www.realmeye.com/wiki/heavy-armors`,
                `https://www.realmeye.com/wiki/cloaks`,
                `https://www.realmeye.com/wiki/poisons`,
                `https://www.realmeye.com/wiki/prisms`,
                `https://www.realmeye.com/wiki/quivers`,
                `https://www.realmeye.com/wiki/traps`,
                `https://www.realmeye.com/wiki/stars`,
                `https://www.realmeye.com/wiki/wakizashi`,
                `https://www.realmeye.com/wiki/spells`,
                `https://www.realmeye.com/wiki/skulls`,
                `https://www.realmeye.com/wiki/orbs`,
                `https://www.realmeye.com/wiki/tomes`,
                `https://www.realmeye.com/wiki/scepters`,
                `https://www.realmeye.com/wiki/helms`,
                `https://www.realmeye.com/wiki/shields`,
                `https://www.realmeye.com/wiki/seals`
            ];
            let guildIDs = [
                `583847032385699851`,
                `583835875998302219`,
                `583834659893542913`,
                `583843193683181568`,
                `583844990401380363`,
                `583846022581714944`,
                `583828681605251113`,
                `583839502905376780`,
                `583840744977203210`,
                `583807147134025750`,
                `583807147134025750`,
                `583807147134025750`,
                `583871706985398292`,
                `583871706985398292`,
                `583869373849010196`,
                `583869373849010196`,
                `583853269512749057`,
                `583860720114991124`,
                `583860720114991124`,
                `583867958963601409`,
                `583867958963601409`,
                `583873260886687786`,
                `583873260886687786`,
                `583873260886687786`
            ];
            for (let i = 0; i < urls.length; i++) {
                await findEmojis(client, urls[i], {}, guildIDs[i], message);
            }
            await message.channel.send(`Done checking emojis, your emojis are now up to date with realmeye!`);
        }
    }
}

let customHeaderRequest = request.defaults({
    headers: {'User-Agent': `Emoji updater for Discord bot (Designed by dylanxdman#0992 for Discord)`}
});

async function findEmojis(client, url, type, guildID, message) {
    return await new Promise((resolve, reject) => {
        customHeaderRequest.get(url, async (err, resp, body) => {
            let $ = await cheerio.load(body);
            let tables = $('.col-md-12 td').toArray();
            for (let i = 0; i < tables.length; i++) {
                let item2HTML = $(tables[i]);
                let item3HTML = $(tables[i + 1]);
                let item4HTML = $(tables[i + 2]);
                if (item2HTML.html().indexOf(" src=") !== -1 || item2HTML.html().indexOf("><img src=") !== -1) {
                    let tierText = (/^[0-9]*$/.test(item3HTML.text())) ? `T${item3HTML.text()}` : `UT`;
                    if (/^[0-9TU]*$/.test(tierText) && item3HTML.text() && item3HTML.text() !== `\n` && item4HTML.text() && /^[a-zA-Z.:’ -]*$/.test(item4HTML.text().split("-").join(""))) {
                        let nameText = item4HTML.text();
                        let args = item2HTML.html().split(`"`);
                        let url1 = `https:${args[args.indexOf(" src=") + 1 || args.indexOf("><img src=") + 1].replace("&apos;", "'")}`;
                        let nameToSetTo = `${nameText.split(" ").join("").split("-").join("").split(".").join("").split("’").join("").split(":").join("")}${tierText}`;
                        console.log(nameToSetTo);
                        let emoji = client.guilds.get(guildID).emojis.find(e => e.name === nameToSetTo);
                        if (!emoji) {
                            let image = await Jimp.read(url1);
                            await image.write("./data/equiptment.png");
                            await sleep(1000);
                            let newEmoji = await client.guilds.get(guildID).emojis.create("./data/equiptment.png", nameToSetTo);
                            await message.channel.send(`${newEmoji} has now been added!`);
                        }
                    }
                }
            }
            resolve();
        });
    });
}
async function sleep(ms) {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}