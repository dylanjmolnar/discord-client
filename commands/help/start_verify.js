const Discord = require('discord.js');

module.exports = async (client, guildID, message) => {
    let verify_second = await require("./verify_second");
    await message.reactions.removeAll();
    let filters = (reaction, user) => reaction.emoji.name === "🔑";
    let verifyCollector = new Discord.ReactionCollector(message, filters);
    verifyCollector.on("collect", async (reaction, user) => {
        if (!user.bot) {
            verifyCollector.stop();
            await message.reactions.removeAll();
            await verify_second(client, guildID, message);
        }
    });
    await message.react("🔑");
}