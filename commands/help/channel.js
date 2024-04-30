module.exports = async (message, thingToCheck, typeOfChannel) => {
    let idToCheck = await thingToCheck.replace("<#", "").replace(">", "");
    let channelsOfGuild = await message.guild.channels.filter(e => e.type === typeOfChannel);
    if (channelsOfGuild.get(idToCheck)) {
        return channelsOfGuild.get(idToCheck);
    } else if (channelsOfGuild.find(e => e.name.toLowerCase() === thingToCheck.toLowerCase())) {
        return channelsOfGuild.find(e => e.name.toLowerCase() === thingToCheck.toLowerCase());
    } else {
        return null;
    }
}