module.exports = async (message, fetchedMembers, thingToCheck, settings) => {
    let peoples = await fetchedMembers.filter(e => e.nickname).filter(e => e.roles.get(settings.raiderRole) || e.roles.get(settings.suspendedRole) || e.roles.get(settings.suspendedButVerifiedRole));
    let idToCheck = await thingToCheck.replace("<", "").replace("@", "").replace(">", "").replace("!", "").replace("&", "");
    let peopless = await fetchedMembers;
    let guys = await peoples.filter(e => !/^[a-zA-Z]*$/.test(e.nickname)).filter(e => /^[a-zA-Z]*$/.test(e.nickname.slice(1)));
    let guyss = await peoples.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.slice(1))).filter(e => /^[a-zA-Z]*$/.test(e.nickname.slice(2)));
    let guysss = await peoples.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.slice(2))).filter(e => /^[a-zA-Z]*$/.test(e.nickname.slice(3)));
    let gals = await peoples.filter(e => e.nickname.includes(" | "));
    let galss = await gals.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0])).filter(e => /^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(1)));
    let galssors = await gals.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(1))).filter(e => /^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(2)));
    let galssorss = await gals.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(2))).filter(e => /^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(3)));
    let galssas = await gals.filter(e => /^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0]));
    let galsss = await gals.filter(e => e.nickname.split(" | ").length > 2);
    if (message.guild.roles.get(idToCheck)) {
        return message.guild.roles.get(idToCheck);
    } else if (message.guild.roles.find(e => e.name.toLowerCase() === thingToCheck.toLowerCase())) {
        return message.guild.roles.find(e => e.name.toLowerCase() === thingToCheck.toLowerCase());
    } else if (fetchedMembers.get(idToCheck)) {
        return fetchedMembers.get(idToCheck);
    } else if (peoples.find(e => e.nickname.toLowerCase() === thingToCheck.toLowerCase())) {
        return peoples.find(e => e.nickname.toLowerCase() === thingToCheck.toLowerCase());
    } else if (guys.find(e => e.nickname.toLowerCase().slice(1) === thingToCheck.toLowerCase())) {
        return guys.find(e => e.nickname.toLowerCase().slice(1) === thingToCheck.toLowerCase());
    } else if (guyss.find(e => e.nickname.toLowerCase().slice(2) === thingToCheck.toLowerCase())) {
        return guyss.find(e => e.nickname.toLowerCase().slice(2) === thingToCheck.toLowerCase());
    } else if (guysss.find(e => e.nickname.toLowerCase().slice(3) === thingToCheck.toLowerCase())) {
        return guysss.find(e => e.nickname.toLowerCase().slice(3) === thingToCheck.toLowerCase());
    } else if (galssas.find(e => e.nickname.toLowerCase().split(" | ")[0] === thingToCheck.toLowerCase())) {
        return galssas.find(e => e.nickname.toLowerCase().split(" | ")[0] === thingToCheck.toLowerCase());
    } else if (gals.find(e => e.nickname.toLowerCase().split(" | ")[1] === thingToCheck.toLowerCase())) {
        return gals.find(e => e.nickname.toLowerCase().split(" | ")[1] === thingToCheck.toLowerCase());
    } else if (galsss.find(e => e.nickname.toLowerCase().split(" | ")[2] === thingToCheck.toLowerCase())) {
        return galsss.find(e => e.nickname.toLowerCase().split(" | ")[2] === thingToCheck.toLowerCase());
    } else if (galss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(1) === thingToCheck.toLowerCase())) {
        return galss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(1) === thingToCheck.toLowerCase());
    } else if (galssors.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(2) === thingToCheck.toLowerCase())) {
        return galssors.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(2) === thingToCheck.toLowerCase());
    } else if (galssorss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(3) === thingToCheck.toLowerCase())) {
        return galssorss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(3) === thingToCheck.toLowerCase());
    } else if (peopless.find(e => e.user.tag.toLowerCase() === thingToCheck.toLowerCase())) {
        return peopless.find(e => e.user.tag.toLowerCase() === thingToCheck.toLowerCase());
    } else if (peopless.find(e => e.user.username.toLowerCase() === thingToCheck.toLowerCase())) {
        return peopless.find(e => e.user.username.toLowerCase() === thingToCheck.toLowerCase());
    } else {
        return thingToCheck;
    }
}
allChannels: false,