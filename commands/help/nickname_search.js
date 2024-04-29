module.exports = async (id, fetchedMembers, thingToCheck, settings) => {
    return new Promise((resolve, reject) => {
        if (!thingToCheck) {
            resolve(null);
        }
        let nameToFind = thingToCheck.toLowerCase();
        let peoples = fetchedMembers.filter(e => e.nickname && (e.roles.get(settings.raiderRole) || e.roles.get(settings.suspendedRole) || e.roles.get(settings.suspendedButVerifiedRole)));
        if (thingToCheck.length <= 10 && /^[a-zA-Z]*$/.test(thingToCheck)) {
            let memberIFound = peoples.find(e => {
                let nicks = e.nickname.toLowerCase();
                while (!/^[a-zA-Z]*$/.test(nicks[0]) && nicks[0]) {
                    nicks = nicks.slice(1);
                }
                let nickArr = nicks.split(" | ");
                for (let i = 0; i < nickArr.length; i++) {
                    if (nickArr[i] === nameToFind) {
                        return true;
                    }
                }
                return false;
            });
            if (memberIFound) {
                resolve(memberIFound);
            }
        }
        resolve(null);
    });
}