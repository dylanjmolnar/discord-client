module.exports = async (message, thingToCheck) => {
    let idToCheck = await thingToCheck.replace("<", "").replace("@", "").replace(">", "").replace("!", "").replace("&", "");
    if (message.guild.roles.get(idToCheck)) {
        return message.guild.roles.get(idToCheck);
    } else if (message.guild.roles.find(e => e.name.toLowerCase() === thingToCheck.toLowerCase())) {
        return message.guild.roles.find(e => e.name.toLowerCase() === thingToCheck.toLowerCase());
    } else {
        return null;
    }
}