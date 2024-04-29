module.exports = async (id, fetchedMembers, thingToCheck, settings) => {
    let idToCheck = await thingToCheck.replace("<", "").replace("@", "").replace(">", "").replace("!", "").replace("&", "");
    let peoples = await fetchedMembers.filter(e => e.roles.get(settings.raiderRole) || e.roles.get(settings.suspendedRole) || e.roles.get(settings.suspendedButVerifiedRole)).filter(e => e.nickname);
    let guys = await peoples.filter(e => !/^[a-zA-Z]*$/.test(e.nickname)).filter(e => /^[a-zA-Z]*$/.test(e.nickname.slice(1)));
    let guyss = await peoples.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.slice(1))).filter(e => /^[a-zA-Z]*$/.test(e.nickname.slice(2)));
    let guysss = await peoples.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.slice(2))).filter(e => /^[a-zA-Z]*$/.test(e.nickname.slice(3)));
    let gals = await peoples.filter(e => e.nickname.includes(" | "));
    let galss = await gals.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0])).filter(e => /^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(1)));
    let galssors = await gals.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(1))).filter(e => /^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(2)));
    let galssorss = await gals.filter(e => !/^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(2))).filter(e => /^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0].slice(3)));
    let galssas = await gals.filter(e => /^[a-zA-Z]*$/.test(e.nickname.split(" | ")[0]));
    let galsss = await gals.filter(e => e.nickname.split(" | ").length > 2);
    if (peoples.get(idToCheck)) {
        return peoples.get(idToCheck);
    } else if (peoples.find(e => e.nickname.toLowerCase() === thingToCheck.toLowerCase())) {
        return peoples.find(e => e.nickname.toLowerCase() === thingToCheck.toLowerCase());
    } else if (guys.find(e => e.nickname.toLowerCase().slice(1) === thingToCheck.toLowerCase())) {
        return guys.find(e => e.nickname.toLowerCase().slice(1) === thingToCheck.toLowerCase());
    } else if (guyss.find(e => e.nickname.toLowerCase().slice(2) === thingToCheck.toLowerCase())) {
        return guyss.find(e => e.nickname.toLowerCase().slice(2) === thingToCheck.toLowerCase());
    } else if (guysss.find(e => e.nickname.toLowerCase().slice(3) === thingToCheck.toLowerCase())) {
        return guysss.find(e => e.nickname.toLowerCase().slice(3) === thingToCheck.toLowerCase());
    } else if (galssas.find(e => e.nickname.toLowerCase().split(" | ")[0] === thingToCheck.toLowerCase())) {
        return `${galssas.find(e => e.nickname.toLowerCase().split(" | ")[0] === thingToCheck.toLowerCase())} (${galssas.find(e => e.nickname.toLowerCase().split(" | ")[0] === thingToCheck.toLowerCase()).nickname.split(" | ")[0]})`;
    } else if (gals.find(e => e.nickname.toLowerCase().split(" | ")[1] === thingToCheck.toLowerCase())) {
        return `${gals.find(e => e.nickname.toLowerCase().split(" | ")[1] === thingToCheck.toLowerCase())} (${gals.find(e => e.nickname.toLowerCase().split(" | ")[1] === thingToCheck.toLowerCase()).nickname.split(" | ")[1]})`;
    } else if (galsss.find(e => e.nickname.toLowerCase().split(" | ")[2] === thingToCheck.toLowerCase())) {
        return `${galsss.find(e => e.nickname.toLowerCase().split(" | ")[2] === thingToCheck.toLowerCase())} (${galsss.find(e => e.nickname.toLowerCase().split(" | ")[2] === thingToCheck.toLowerCase()).nickname.split(" | ")[2]})`;
    } else if (galss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(1) === thingToCheck.toLowerCase())) {
        return `${galss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(1) === thingToCheck.toLowerCase())} (${galss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(1) === thingToCheck.toLowerCase()).nickname.split(" | ")[0].slice(1)})`;
    } else if (galssors.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(2) === thingToCheck.toLowerCase())) {
        return `${galssors.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(2) === thingToCheck.toLowerCase())} (${galssors.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(2) === thingToCheck.toLowerCase()).nickname.split(" | ")[0].slice(2)})`;
    } else if (galssorss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(3) === thingToCheck.toLowerCase())) {
        return `${galssorss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(3) === thingToCheck.toLowerCase())} (${galssorss.find(e => e.nickname.toLowerCase().split(" | ")[0].slice(3) === thingToCheck.toLowerCase()).nickname.split(" | ")[0].slice(3)})`
    } else {
        return thingToCheck;
    }
}