module.exports = {
    aliases: [],
    description: "Changes the nicknames on the server to the correct capitalization.",
    use: "nicknameFix",
    cooldown: 1,
    type: "private",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: ["raiderRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let members = guildMembers.filter(e => e.nickname && e.roles.get(settings.raiderRole)).array();
        let command = require("./help/searchRealmeye");
        let message1 = await message.channel.send(`Starting to find wrong names now... At 0/${members.length}`);
        for (let i = 0; i < members.length; i++) {
            let oldName = members[i].nickname;
            while (!/^[a-zA-Z]*$/.test(oldName[0])) {
                oldName = oldName.slice(1);
            }
            let oldNames = oldName.split(" | ");
            for (let j = 0; j < oldNames.length; j++) {
                if (/^[a-zA-Z]*$/.test(oldNames[j])) {
                    await sleep(500);
                    let data = await command(oldNames[j], {
                        characters: true
                    }).catch(e => {
                        console.log(e);
                    });
                    if (data.userFound) {
                        if (data.name !== oldNames[j]) {
                            if (members[i].user.username !== members[i].nickname.replace(oldNames[j], data.name)) {
                                await message.channel.send(`${members[i]}'s nickname has been fixed from ${members[i].nickname} to ${members[i].nickname.replace(oldNames[j], data.name)}`);
                                await members[i].setNickname(members[i].nickname.replace(oldNames[j], data.name));
                            }
                        }
                    }
                }
            }
            if (i % 20 === 0) {
                message1.edit(`Starting to find wrong names now... At ${i}/${members.length}`);
            }
        }
    }
}
async function sleep(ms) {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
