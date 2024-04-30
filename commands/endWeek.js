const Discord = require('discord.js');

module.exports = {
    aliases: ["ew"],
    description: "Ends this weeks leader leading logs on the bot.",
    use: "endWeek",
    cooldown: 10,
    type: "private",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (message.author.id === "321726133307572235") {
            let filter = (mess) => mess.author.id === message.author.id;
            let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
            let found = false;
            let optionsMessage = await message.channel.send(`Reply with \`single\` if you would like to only do the current server.\nReply with \`ping\` if you would like to ping everyone.\nReply with \`silent\` if you would like to not ping everyone.\nReply with \`cancel\` if you would like to cancel the command.`);
            collector.on("collect", async (mess) => {
                if (mess) {
                    let content = mess.content.toLowerCase();
                    if (content === "single") {
                        found = true;
                        collector.stop();
                        await optionsMessage.edit(`\`single\` option was selected.`);
                        await mess.delete();
                        let endWeek = require("./help/endWeek");
                        endWeek(client, {
                            ping: true,
                            single: true,
                            guildID: message.guild.id
                        });
                    } else if (content === "ping" || content === "p") {
                        found = true;
                        collector.stop();
                        await optionsMessage.edit(`\`ping\` option was selected.`);
                        await mess.delete();
                        let endWeek = require("./help/endWeek");
                        endWeek(client, {
                            ping: true
                        });
                    } else if (content === "silent" || content === "s") {
                        found = true;
                        collector.stop();
                        await optionsMessage.edit(`\`silent\` option was selected.`);
                        await mess.delete();
                        let endWeek = require("./help/endWeek");
                        endWeek(client, {});
                    } else if (content === "cancel" || content === "c") {
                        found = true;
                        collector.stop();
                        await optionsMessage.edit(`\`cancel\` option was selected.`);
                        await mess.delete();
                    } else {
                        message.channel.send(`Please respond with a valid response: \`ping\`, \`silent\`, or \`cancel\`.`);
                    }
                }
            });
            collector.on("end", (collected) => {
                if (!found) {
                    message.channel.send(`No response was given. The command was aborted as a result.`);
                }
            });
        }
    }
}