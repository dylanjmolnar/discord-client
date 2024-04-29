const cheerio = require('cheerio');
const request = require("request");
let customHeaderRequest = request.defaults({
    headers: {'User-Agent': `Testing - Automated Guild Blacklist System (Designed by dylanxdman#0992 for Discord)`}
});

module.exports = async (name) => {
    return new Promise(async (resolve, reject) => {
        await findInfo(name).then(async generalInfo => {
            resolve(generalInfo);
        }).catch(e => {
            reject(e);
        });
    });
}

function findInfo(name) {
    return new Promise((resolve, reject) => {
        if (!name) {
            reject("Name must be a non-empty string!");
        }
        let url = `https://www.realmeye.com/guild/${name.split(" ").join("%20")}`;
        customHeaderRequest.get(url, async (err, resp, body) => {
            if (!body) {
                reject("No body was found!");
            }
            let $ = await cheerio.load(body);
            let results = {};
            let textHTML = $('.col-md-12 h2');
            let text = textHTML.text();
            if (text.startsWith("Sorry, we haven't")) {
                results.error = "No Guild Found!";
                results.suggestions = [];
                let columns = $(".table-responsive tr").toArray();
                let entires = $(".table-responsive td").toArray();
                for (let i = 0; i < entires.length; i += (entires.length / (columns.length - 1))) {
                    results.suggestions.push({
                        guild: $(entires[i]).text(),
                        guild_fame: $(entires[i + 1]).text()
                    })
                }
                resolve(results);
            } else {
                results.members = [];
                let characterArray = $(".table-responsive td").toArray();
                let characterArray1 = $(".table-responsive tr").toArray();
                let extraNumber = 0;
                for (let i = 0; i < characterArray.length; i += (characterArray.length / (characterArray1.length - 1))) {
                    let charData = {};
                    if (!$(characterArray[i]).text()) {
                        extraNumber = 1;
                    }
                    charData.name = $(characterArray[i + extraNumber]).text();
                    charData.rank = $(characterArray[i + 1 + extraNumber]).text();
                    results.members.push(charData);
                }
                resolve(results);
            }
        });
    });
}