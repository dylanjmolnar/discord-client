module.exports = async (client, member, settings) => {
    if (member.nickname && member.roles.get(settings.raiderRole)) {
        if (member.roles.highest.position > member.guild.roles.get(settings.rlRole).position || member.guild.members.get(client.user.id).roles.highest.position < member.roles.highest.position) {
            return;
        }
        let prefixes = [];
        if (settings.rusherPrefix && member.roles.get(settings.rusherRole)) {
            prefixes.push(settings.rusherPrefix)
        }
        if (settings.mysticPrefix && member.roles.get(settings.mysticRole)) {
            prefixes.push(settings.mysticPrefix)
        }
        if (settings.priestPrefix && member.roles.get(settings.priestRole)) {
            prefixes.push(settings.priestPrefix)
        }
        prefixes = prefixes.sort((a, b) => {
            return (a > b) ? 1 : -1;
        });
        const oldName = member.nickname;
        let name = member.nickname;
        while (name[0] && !/^[a-zA-Z]*$/.test(name[0])) {
            name = name.slice(1);
        }
        let names = name.split(" | ");
        for (let i = 0 ; i < names.length; i++) {
            if (!/^[a-zA-Z]*$/.test(names[i]) || names[i].length > 10) {
                return;
            }
        }
        let command = require("./searchRealmeye");
        for (let i = 0; i < names.length; i++) {
            try {
                let data = await command(names[i], {});
                if (data.name) {
                    names[i] = data.name;
                }
            } catch(e) {

            }
        }
        if (member.roles.get(settings.rlRole)) {
            let newName = `${settings.rlPrefix}${names.join(" | ")}`;
            if (member.nickname !== newName) {
                if (member.user.username === newName) {
                    if (oldName.toLowerCase() !== newName.toLowerCase()) {
                        if (member.user.username.toLowerCase() === newName.toLowerCase()) {
                            member.setNickname(newName.toUpperCase()).catch(e => {});
                        } else {
                            member.setNickname(newName.toLowerCase()).catch(e => {});
                        }
                    }
                } else {
                    member.setNickname(newName).catch(e => {});
                }
            }
        } else if (member.roles.get(settings.arlRole)) {
            let newName = `${settings.arlPrefix}${names.join(" | ")}`;
            if (member.nickname !== newName) {
                if (member.user.username === newName) {
                    if (oldName.toLowerCase() !== newName.toLowerCase()) {
                        if (member.user.username.toLowerCase() === newName.toLowerCase()) {
                            member.setNickname(newName.toUpperCase()).catch(e => {});
                        } else {
                            member.setNickname(newName.toLowerCase()).catch(e => {});
                        }
                    }
                } else {
                    member.setNickname(newName).catch(e => {});
                }
            }
        } else if (prefixes.length > 0) {
            let newName = `${prefixes.join("")}${names.join(" | ")}`;
            if (member.nickname !== newName) {
                if (member.user.username === newName) {
                    if (oldName.toLowerCase() !== newName.toLowerCase()) {
                        if (member.user.username.toLowerCase() === newName.toLowerCase()) {
                            member.setNickname(newName.toUpperCase()).catch(e => {});
                        } else {
                            member.setNickname(newName.toLowerCase()).catch(e => {});
                        }
                    }
                } else {
                    member.setNickname(newName).catch(e => {});
                }
            }
        } else {
            let newName = `${names.join(" | ")}`;
            if (member.nickname !== newName) {
                if (member.user.username === newName) {
                    if (oldName.toLowerCase() !== newName.toLowerCase()) {
                        if (member.user.username.toLowerCase() === newName.toLowerCase()) {
                            member.setNickname(newName.toUpperCase()).catch(e => {});
                        } else {
                            member.setNickname(newName.toLowerCase()).catch(e => {});
                        }
                    }
                } else {
                    member.setNickname(newName).catch(e => {});
                }
            }
        }
    }
}