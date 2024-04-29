const cheerio = require('cheerio');
const request = require("request");
let customHeaderRequest = request.defaults({
    headers: {'User-Agent': `Automated Verification System (Designed by dylanxdman#0992 for Discord)`}
});

module.exports = async (name, options) => {
    return new Promise(async (resolve, reject) => {
        await findInfo(name).then(async generalInfo => {
            if (generalInfo.error) {
                resolve(generalInfo);
            } else {
                if (options.pastnames) {
                    sleep(1000);
                    generalInfo.names = await nameHistory(name);
                }
                if (options.pastGuilds) {
                    sleep(1000);
                    generalInfo.guilds = await guildHistory(name);
                }
                if (options.graveyard) {
                    sleep(1000);
                    generalInfo.graveyard = await graveYard(name).catch(e => console.log(e));
                }
                if (options.petYard) {
                    sleep(1000);
                    generalInfo.pets = await petYard(name);
                }
                if (options.pastRuns) {
                    sleep(1000);
                    generalInfo.runs = await runCount(name);
                }
                resolve(generalInfo);
            }
        }).catch(e => {
            reject(e);
        });
    });
}

function findInfo(name) {
    return new Promise((resolve, reject) => {
        let url = `https://www.realmeye.com/player/${name}`;
        customHeaderRequest.get(url, async (err, resp, body) => {
            if (!body) {
                reject("No body was found!");
            }
            let $ = await cheerio.load(body);
            let results = {};
            let textHTML = $('.col-md-12 h2');
            let text = textHTML.text();
            if (text === "Sorry, but we either:") {
                results.error = "No User Found!";
                results.suggestions = [];
                let columns = $(".table-responsive tr").toArray();
                let entires = $(".table-responsive td").toArray();
                for (let i = 0; i < entires.length; i += (entires.length / (columns.length - 1))) {
                    results.suggestions.push({
                        name: $(entires[i]).text(),
                        guild: $(entires[i + 1]).text(),
                        fame: $(entires[i + 2]).text(),
                        xp: $(entires[i + 3]).text(),
                        rank: $(entires[i + 4]).text(),
                        characters: $(entires[i + 5]).text(),
                        average_fame: $(entires[i + 6]).text(),
                        average_xp: $(entires[i + 7]).text(),
                        last_seen: ($(entires[i + 8]).text() === "hidden") ? new Date($(entires[i + 8]).text()) : "hidden",
                        server: $(entires[i + 9]).text()
                    })
                }
                resolve(results);
            } else {
                let nameHTML = $('.col-md-12 span.entity-name');
                results.name = nameHTML.text();
                let desc1HTML = $('.line1.description-line');
                results.description_1 = desc1HTML.text() || null;
                let desc2HTML = $('.line2.description-line');
                results.description_2 = desc2HTML.text() || null;
                let desc3HTML = $('.line3.description-line');
                results.description_3 = desc3HTML.text() || null;
                let charactersHTML = $('.summary td').toArray();
                for (let i = 0; i < charactersHTML.length; i += 2) {
                    let itemHTML = $(charactersHTML[i]);
                    let item = itemHTML.text();
                    let nextItemHTML = $(charactersHTML[i + 1]);
                    let nextItem = nextItemHTML.text();
                    if (item === "Characters") {
                        results.characterCount = nextItem;
                    } else if (item === "Skins") {
                        results.skins = nextItem;
                    } else if (item === "Fame") {
                        results.fame = nextItem;
                    } else if (item === "EXP") {
                        results.exp = nextItem;
                    } else if (item === "Rank") {
                        results.rank = nextItem;
                    } else if (item === "Account fame") {
                        results.accFame = nextItem;
                    } else if (item === "Guild") {
                        results.guild = nextItem;
                    } else if (item === "Guild Rank") {
                        results.guildRank = nextItem;
                    } else if (item === "Created") {
                        results.created = nextItem;
                    } else if (item === "First seen") {
                        results.created = nextItem;
                    } else if (item === "Last seen") {
                        results.lastSeen = nextItem;
                    }
                }
                if (results.characterCount.includes("hidden")) {
                    results.characters = null;
                } else {
                    results.characters = [];
                    let characterArray = $(".table-responsive td").toArray();
                    let number = (!$(characterArray[0]).text() && !$(characterArray[1]).text()) ? ((results.lastSeen.includes("hidden")) ? 10 : 12) : ((results.lastSeen.includes("hidden")) ? 9 : 11)
                    let extraNumber = (!$(characterArray[0]).text() && !$(characterArray[1]).text()) ? 0 : 1;
                    for (let i = 0; i < characterArray.length; i += number) {
                        let charData = {
                            class: $(characterArray[i + 2 - extraNumber]).text(),
                            level: $(characterArray[i + 3 - extraNumber]).text(),
                            class_quests_completed: $(characterArray[i + 4 - extraNumber]).text(),
                            base_fame: $(characterArray[i + 5 - extraNumber]).text(),
                            xp: $(characterArray[i + 6 - extraNumber]).text(),
                            place: $(characterArray[i + 7 - extraNumber]).text(),
                            stats_maxed: $(characterArray[i + 9 - extraNumber]).text()
                        }
                        let gearHTML = $(characterArray[i + 8 - extraNumber]);
                        let stats = $(characterArray[i + 9 - extraNumber])['0'].children[0].attribs['data-stats'];
                        charData.stats = stats.substring(1, stats.length - 1).split(",");
                        charData.weapon = (gearHTML['0'].children[0].children[0].children[0]) ? gearHTML['0'].children[0].children[0].children[0].attribs.title : null;
                        charData.ability = (gearHTML['0'].children[1].children[0].children[0]) ? gearHTML['0'].children[1].children[0].children[0].attribs.title : null;
                        charData.armor = (gearHTML['0'].children[2].children[0].children[0]) ? gearHTML['0'].children[2].children[0].children[0].attribs.title : null;
                        charData.ring = (gearHTML['0'].children[3].children[0].children[0]) ? gearHTML['0'].children[3].children[0].children[0].attribs.title : null;
                        charData.backpack = (gearHTML['0'].children[4]) ? gearHTML['0'].children[4].children[0].children[0].attribs.title : null;
                        if (!results.lastSeen.includes("hidden")) {
                            charData.last_seen = $(characterArray[i + 10 - extraNumber]).text();
                            charData.last_seen_server = $(characterArray[i + 11 - extraNumber]).text();
                        }
                        results.characters.push(charData);
                    }
                    resolve(results);
                }
            }
        });
    });
}

function nameHistory(name) {
    return new Promise((resolve, reject) => {
        let url = `https://www.realmeye.com/name-history-of-player/${name}`;
        customHeaderRequest.get(url, async (err, resp, body) => {
            if (!body) {
                reject("No body was found!");
            }
            let $ = await cheerio.load(body);
            let names = [];
            let hiddenHTML = $('.col-md-12 h3');
            let hidden = hiddenHTML.text();
            if (hidden === "Name history is hidden") {
                resolve(null);
            } else {
                let noNamesHTML = $(".col-md-12 p");
                let noNames = noNamesHTML.text();
                if (noNames.endsWith(`No name changes detected.`)) {
                    resolve(names);
                } else {
                    let namesHTML = $(".table-responsive td");
                    for (let i = 0; i < namesHTML.length; i += 3) {
                        let itemHTML = $(namesHTML[i]);
                        let item = (itemHTML.text()) ? itemHTML.text() : null;
                        let nextItemHTML = $(namesHTML[i + 1]);
                        let nextItem = (nextItemHTML.text()) ? new Date(nextItemHTML.text()) : null;
                        let item2HTML = $(namesHTML[i + 2]);
                        let item2 = (item2HTML.text()) ? new Date(item2HTML.text()) : null;
                        names.push({pastName: item, dateChangedTo: nextItem, dateChanged: item2});
                    }
                    resolve(names);
                }
            }
        });
    });
}

function guildHistory(name) {
    return new Promise((resolve, reject) => {
        let url = `https://www.realmeye.com/guild-history-of-player/${name}`;
        customHeaderRequest.get(url, async (err, resp, body) => {
            if (!body) {
                reject("No body was found!");
            }
            let $ = await cheerio.load(body);
            let names = [];
            let hiddenHTML = $('.col-md-12 h3');
            let hidden = hiddenHTML.text();
            if (hidden === "Guild history is hidden") {
                resolve(null);
            } else {
                let noNamesHTML = $(".col-md-12 p");
                let noNames = noNamesHTML.text();
                if (noNames.endsWith(`No guild changes detected.`)) {
                    resolve(names);
                } else {
                    let namesHTML = $(".table-responsive td").toArray();
                    for (let i = 0; i < namesHTML.length; i += 4) {
                        let itemHTML = $(namesHTML[i]);
                        let item = (itemHTML.text() && itemHTML.html().startsWith(`<a href`)) ? itemHTML.text() : null;
                        let nextItemHTML = $(namesHTML[i + 1]);
                        let nextItem = (nextItemHTML.text()) ? nextItemHTML.text() : null;
                        let item2HTML = $(namesHTML[i + 2]);
                        let item2 = (item2HTML.text()) ? new Date(item2HTML.text()) : null;
                        let item3HTML = $(namesHTML[i + 3]);
                        let item3 = (item3HTML.text()) ? new Date(item3HTML.text()) : null;
                        names.push({guildName: item, guildRank: nextItem, dateJoined: item2, dateLeft: item3});
                    }
                    resolve(names);
                }
            }
        });
    });
}

function graveYard(name) {
    return new Promise((resolve, reject) => {
        let url = `https://www.realmeye.com/graveyard-of-player/${name}`;
        customHeaderRequest.get(url, async (err, resp, body) => {
            if (!body) {
                reject("No body was found!");
            }
            let $ = await cheerio.load(body);
            let names = [];
            let hiddenHTML = $('.col-md-12 h3');
            let hidden = hiddenHTML.text();
            if (hidden.toLowerCase() === `the graveyard of ${name.toLowerCase()} is hidden.`) {
                resolve(null);
            } else if (hidden) {
                resolve(names);
            } else {
                await sleep(1000);
                let graveYardCount = $(".table-responsive td").toArray();
                let findHTML = $('.col-md-12 p');
                let found = findHTML.text();
                let myNumber = parseInt(found.split(".")[found.split(".").length - 2].split(" ")[1]);
                let number = 1;
                for (let i = 0; i < Math.ceil(myNumber / 100); i++) {
                    await new Promise((resolver, reject) => {
                        url = `https://www.realmeye.com/graveyard-of-player/${name}/${number}`;
                        customHeaderRequest.get(url, async (err, resp, body) => {
                            $ = await cheerio.load(body);
                            graveYardCount = $(".table-responsive td").toArray();
                            for (let i = 0; i < graveYardCount.length; i += 10) {
                                let graveYardObject = {
                                    dateOfDeath: ($(graveYardCount[i]).text()) ? new Date($(graveYardCount[i]).text()) : null,
                                    class: $(graveYardCount[i + 2]).text(),
                                    level: $(graveYardCount[i + 3]).text(),
                                    base_fame: $(graveYardCount[i + 4]).text(),
                                    toal_fame: $(graveYardCount[i + 5]).text(),
                                    exp: $(graveYardCount[i + 6]).text(),
                                    maxed: $(graveYardCount[i + 8]).text(),
                                    slain_by: $(graveYardCount[i + 9]).text()
                                }
                                let gearHTML = $(graveYardCount[i + 7]);
                                graveYardObject.weapon = (gearHTML['0'].children[0].children[0].children[0]) ? gearHTML['0'].children[0].children[0].children[0].attribs.title : null;
                                graveYardObject.ability = (gearHTML['0'].children[1].children[0].children[0]) ? gearHTML['0'].children[1].children[0].children[0].attribs.title : null;
                                graveYardObject.armor = (gearHTML['0'].children[2].children[0].children[0]) ? gearHTML['0'].children[2].children[0].children[0].attribs.title : null;
                                graveYardObject.ring = (gearHTML['0'].children[3].children[0].children[0]) ? gearHTML['0'].children[3].children[0].children[0].attribs.title : null;
                                graveYardObject.backpack = (gearHTML['0'].children[4]) ? gearHTML['0'].children[4].children[0].children[0].attribs.title : null;
                                names.push(graveYardObject);
                            }
                            number += 100;
                            await sleep(1000);
                            resolver();
                        });
                    });
                }
                resolve(names);
            }
        });
    });
}

function petYard(name) {
    return new Promise((resolve, reject) => {
        let url = `https://www.realmeye.com/pets-of/${name}`;
        customHeaderRequest.get(url, async (err, resp, body) => {
            if (!body) {
                reject("No body was found!");
            }
            let $ = await cheerio.load(body);
            let pets = [];
            let hiddenHTML = $('.col-md-12 h3');
            let hidden = hiddenHTML.text();
            if (hidden.toLowerCase() === `${name.toLowerCase()} has no pets.`) {
                resolve(pets);
            } else {
                let petYardCells = $(".table-responsive td").toArray();
                for (let i = 0; i < petYardCells.length; i += 12) {
                    let petObject = {
                        petName: $(petYardCells[i + 1]).text(),
                        rarity: $(petYardCells[i + 2]).text(),
                        family: $(petYardCells[i + 3]).text(),
                        place: $(petYardCells[i + 4]).text() || null,
                        abilities: [],
                        max_level: $(petYardCells[i + 11]).text()
                    }
                    petObject.abilities.push({
                        name: $(petYardCells[i + 5]).text(),
                        level: $(petYardCells[i + 6]).text() || null
                    });
                    petObject.abilities.push({
                        name: $(petYardCells[i + 7]).text(),
                        level: $(petYardCells[i + 8]).text() || null
                    });
                    petObject.abilities.push({
                        name: $(petYardCells[i + 9]).text(),
                        level: $(petYardCells[i + 10]).text() || null
                    });
                    pets.push(petObject);
                }
                resolve(pets);
            }
        });
    });
}

function runCount(name) {
    return new Promise((resolve, reject) => {
        let url = `https://www.realmeye.com/graveyard-summary-of-player/${name}`;
        customHeaderRequest.get(url, async (err, resp, body) => {
            if (!body) {
                reject("No body was found!");
            }
            let $ = await cheerio.load(body);
            let runs = {};
            let hiddenHTML = $('.col-md-12 h3');
            let hidden = hiddenHTML.text();
            if (hidden === `No data available yet.`) {
                resolve(runs);
            } else if (hidden.toLowerCase() === `the graveyard of ${name.toLowerCase()} is hidden.`) {
                resolve(null);
            } else {
                let petYardCells = $(".table-responsive td").toArray();
                for (let i = 0; i < petYardCells.length; i += 6) {
                    if ($(petYardCells[i + 1]).text() === "Lost Halls completed") {
                        runs.Lost_Halls_Completed = parseInt($(petYardCells[i + 2]).text()) || 0;
                    } else if ($(petYardCells[i + 1]).text() === "Voids completed") {
                        runs.Voids_Completed = parseInt($(petYardCells[i + 2]).text()) || 0;
                    } else if ($(petYardCells[i + 1]).text() === "Cultist Hideouts completed") {
                        runs.Cultist_Hideouts_Completed = parseInt($(petYardCells[i + 2]).text()) || 0;
                    } else if (!$(petYardCells[i]).text()) {
                        let nameSus = $(petYardCells[i + 1]).text().split("'").join("").split("(").join("").split(")").join("");
                        if (/^[0-9]*$/.test(nameSus[nameSus.length - 1])) {
                            nameSus = nameSus.slice(0, -1);
                        }
                        if (nameSus.endsWith("completed")) {
                            nameSus = nameSus.split(" ").slice(0, -1).join(" ");
                        }
                        if (nameSus.endsWith("s") && nameSus !== "Shatters") {
                            nameSus = nameSus.slice(0, -1);
                        }
                        if (nameSus) {
                            runs[nameSus.split(" ").join("_")] = parseInt($(petYardCells[i + 2]).text()) || 0;
                        }
                    }
                }
                resolve(runs);
            }
        });
    });
}

async function sleep(ms) {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}