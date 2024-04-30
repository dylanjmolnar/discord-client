const Discord = require('discord.js');

module.exports = (client, message, typeOfRun) => {
    return new Promise((resolve, reject) => {
        let myNewArray = client.emojisPortals.keyArray();
        let keyss = [];
        for (let i = 0; i < myNewArray.length; i++) {
            keyss.push(myNewArray[i]);
        }
        let keys = keyss.sort();
        let failed = [];
        for (let i = 0; i < keys.length; i++) {
            let portal = keys[i];
            let numberOfFailed = 0;
            for (let j = 0; j < typeOfRun.length; j++) {
                if (portal.indexOf(typeOfRun[j]) === -1) {
                    numberOfFailed++;
                    if (numberOfFailed > 1) {
                        failed.push(portal);
                    }
                }
            }
        }
        let suggestions = keys.filter(e => !failed.includes(e));
        if (suggestions.length !== 0) {
            let suggestionsText = "";
            let mass = suggestions.length;
            for (let i = 0; i < mass; i++) {
                suggestionsText += `\n**${i + 1}:** ${suggestions[i]} (${client.emojisPortals.get(suggestions[i]).name.split("_").join(" ")})`;
            }
            message.channel.send(`**__That is an invalid type of run. Did you mispell and mean one of the following?__**${suggestionsText}\nType \`cancel\` to cancel selection.`).then(suggestionMessage => {
                let filter = (messager) => messager.author.id === message.author.id;
                let collector = new Discord.MessageCollector(message.channel, filter, {
                    time: 60000
                });
                let found = false, theNumber;
                collector.on("collect", (msg) => {
                    if (/^[0-9]*$/.test(msg.content)) {
                        if (parseInt(msg.content) <= mass && parseInt(msg.content) > 0) {
                            theNumber = parseInt(msg.content) - 1;
                            found = true;
                            collector.stop();
                        }
                    } else if (msg.content.toLowerCase() === "cancel" || msg.content.toLowerCase() === "stop") {
                        collector.stop();
                    }
                });
                collector.on("end", (collected) => {
                    if (found) {
                        if (suggestionMessage.deleted === false) {
                            suggestionMessage.edit(`**Correction was made.**\n**${theNumber + 1}:** ${suggestions[theNumber]} (${client.emojisPortals.get(suggestions[theNumber]).name.split("_").join(" ")})\nWas selected instead.`).catch(e => {});
                        } else {
                            message.channel.send(`**Correction was made.**\n**${theNumber + 1}:** ${suggestions[theNumber]} (${client.emojisPortals.get(suggestions[theNumber]).name.split("_").join(" ")})\nWas selected instead.`).catch(e => {});
                        }
                        resolve(suggestions[theNumber]);
                    } else {
                        if (suggestionMessage.deleted === false) {
                            suggestionMessage.edit(`**No correction was made.**\nThe command was aborted as a result.`).catch(e => {});
                        } else {
                            message.channel.send(`**No correction was made.**\nThe command was aborted as a result.`).catch(e => {});
                        }
                        resolve(null);
                    }
                });
            }).catch(e => {});
        } else {
            message.channel.send(`That is an invalid type of run. I could not find any suggestions for you.`).catch(e => {});
            resolve(null);
        }
    });
}