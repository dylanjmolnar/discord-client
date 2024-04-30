module.exports = {
    aliases: [],
    description: "Loops through a couple staff commands to see what needs to be done on the server.",
    use: "check <full>",
    cooldown: 5,
    type: "misc",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let commands = [];
        let messages = [];
        let args = message.content.split(" ");
        let extra = args[1];
        commands.push(client.commands.get("falsesuspensions"));
        messages.push(`${settings.prefix}falseSuspensions`);
        commands.push(client.commands.get("nonicknames"));
        messages.push(`${settings.prefix}noNicknames`);
        commands.push(client.commands.get("keypops"));
        messages.push(`${settings.prefix}keypops list`);
        commands.push(client.commands.get("pending"));
        messages.push(`${settings.prefix}pending list`);
        if (settings.veteranVeriSwitch) {
            commands.push(client.commands.get("veteranpending"));
            messages.push(`${settings.prefix}veteranpending list`);
        }
        commands.push(client.commands.get("modmail"));
        messages.push(`${settings.prefix}modmail list`);
        commands.push(client.commands.get("duplicatemembers"));
        messages.push(`${settings.prefix}duplicateMembers`);
        if (extra === "f" || extra === "full") {
            commands.push(client.commands.get("suspensions"));
            messages.push(`${settings.prefix}suspensions`);
            commands.push(client.commands.get("mutes"));
            messages.push(`${settings.prefix}mutes`);
        }
        for (let i = 0; i < commands.length; i++) {
            message.content = messages[i];
            let command = commands[i];
            command.execute(client, message, settings, guilds, guildMembers);
        }
    }
}
