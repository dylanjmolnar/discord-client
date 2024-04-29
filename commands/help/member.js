module.exports = async (fetchedMembers, thingToCheck, settings) => {
    if (!thingToCheck) {
        return null;
    }
    let peoples = fetchedMembers.filter(e => e.nickname && (e.roles.get(settings.raiderRole) || e.roles.get(settings.suspendedRole) || e.roles.get(settings.suspendedButVerifiedRole)));
    let idToCheck = thingToCheck.replace("<", "").replace("@", "").replace(">", "").replace("!", "");
    if (fetchedMembers.get(idToCheck)) {
        return fetchedMembers.get(idToCheck);
    } else if (peoples.find(e => e.nickname.toLowerCase() === thingToCheck.toLowerCase())) {
        return peoples.find(e => e.nickname.toLowerCase() === thingToCheck.toLowerCase());
    } else {
        if (thingToCheck.length <= 10 && /^[a-zA-Z]*$/.test(thingToCheck)) {
            let memberIFound = peoples.find(e => {
                let nicks = e.nickname.toLowerCase();
                while (!/^[a-zA-Z]*$/.test(nicks[0]) && nicks[0]) {
                    nicks = nicks.slice(1);
                }
                let nickArr = nicks.split(" | ");
                for (let i = 0; i < nickArr.length; i++) {
                    if (nickArr[i] === thingToCheck.toLowerCase()) {
                        return true;
                    }
                }
                return false;
            });
            if (memberIFound) {
                return memberIFound;
            }
        }
        if (fetchedMembers.find(e => e.user.tag.toLowerCase() === thingToCheck.toLowerCase())) {
            return fetchedMembers.find(e => e.user.tag.toLowerCase() === thingToCheck.toLowerCase());
        } else if (fetchedMembers.find(e => e.user.username.toLowerCase() === thingToCheck.toLowerCase())) {
            return fetchedMembers.find(e => e.user.username.toLowerCase() === thingToCheck.toLowerCase());
        } else {
            return null;
        }
    }
}