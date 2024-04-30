const Discord = require('discord.js');
const Jimp = require("jimp");

module.exports = {
    aliases: [],
    description: "Adds the role specified to the user specified.",
    use: "command [rusher | mystic | priest | DJ] [user] <image>",
    cooldown: 3,
    type: "raid",
    dms: false,
    public: false,
    premium: false,
    allChannels: false,
    channels: ["modLogsChannel"],
    roles: ["rlRole"],
    async execute(client, message, settings, guilds, guildMembers) {
        let args = message.content.split(" ");
        let author = guildMembers.get(message.author.id);
        if (author.roles.highest.position < message.guild.roles.get(settings.rlRole).position) {
            return message.channel.send(`You do not have permission to use this command.`);
        }
        let whatType = args[1];
        if (!whatType) {
            return message.channel.send(`Please provide a valid role to commend for: \`DJ\`, \`mystic\`, \`priest\`, or \`rusher\`.`);
        }
        let person = args[2];
        let command = require("./help/member");
        let personToCommend = await command(guildMembers, person, settings);
        if (!personToCommend) {
            return message.channel.send(`Please provide a valid user to commend.`);
        }
        whatType = whatType.toLowerCase();
        if (whatType === `r` || whatType === `rusher`) {
            if (!message.guild.roles.get(settings.rusherRole)) {
                return message.channel.send(`You cannot commend for this because this role has not been setup on your server.`).catch(e => {});
            }
            if (personToCommend.roles.get(settings.rusherRole)) {
                return message.channel.send(`${personToCommend} (${personToCommend.displayName}) cannot be commended as they already have the \`${message.guild.roles.get(settings.rusherRole).name}\` role.`);
            }
            let filter = (messages) => messages.author.id === message.author.id || message.author.id === "";
            let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
            message.channel.send(`Are you sure you want to commend ${personToCommend} (${personToCommend.displayName}) for the \`${message.guild.roles.get(settings.rusherRole).name}\` role? Doing so will immediately give them the role.`).then(msg => {
                collector.on("collect", async (msgs) => {
                    let content = msgs.content.toLowerCase();
                    if (content === `y` || content === `yes` || content === `-yes` || content === `${settings.prefix}yes`) {
                        await collector.stop();
                        await message.channel.send(`${personToCommend} (${personToCommend.displayName}) will now have the \`${message.guild.roles.get(settings.rusherRole).name}\` role added!`);
                        await personToCommend.roles.add(settings.rusherRole);
                        await message.guild.channels.get(settings.modLogsChannel).send(`\`${message.guild.roles.get(settings.rusherRole).name}\` role was added to ${personToCommend} (${personToCommend.displayName}) per request of ${guildMembers.get(message.author.id)} (${guildMembers.get(message.author.id).displayName}).`);
                    } else if (content === `n` || content === `no` || content === `-no` || content === `${settings.prefix}no`) {
                        collector.stop();
                        message.channel.send(`Command is now aborted.`);
                    } else {
                        message.channel.send(`Please provide a valid response: \`yes\` or \`no\`.`);
                    }
                });
            });
        } else if (whatType === `m` || whatType === `mystic`) {
            if (!message.guild.roles.get(settings.mysticRole)) {
                return message.channel.send(`You cannot commend for this because this role has not been setup on your server.`).catch(e => {});
            }
            if (personToCommend.roles.get(settings.mysticRole)) {
                return message.channel.send(`${personToCommend} (${personToCommend.displayName}) cannot be commended as they already have the \`${message.guild.roles.get(settings.mysticRole).name}\` role.`);
            }
            let filter = (messages) => messages.author.id === message.author.id;
            let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
            message.channel.send(`Are you sure you want to commend ${personToCommend} (${personToCommend.displayName}) for the \`${message.guild.roles.get(settings.mysticRole).name}\` role? Doing so will immediately give them the role.`).then(msg => {
                collector.on("collect", async (msgs) => {
                    let content = msgs.content.toLowerCase();
                    if (content === `y` || content === `yes` || content === `-yes` || content === `${settings.prefix}yes`) {
                        await collector.stop();
                        await message.channel.send(`${personToCommend} (${personToCommend.displayName}) will now have the \`${message.guild.roles.get(settings.mysticRole).name}\` role added!`);
                        await personToCommend.roles.add(settings.mysticRole);
                        await message.guild.channels.get(settings.modLogsChannel).send(`\`${message.guild.roles.get(settings.mysticRole).name}\` role was added to ${personToCommend} (${personToCommend.displayName}) per request of ${guildMembers.get(message.author.id)} (${guildMembers.get(message.author.id).displayName}).`);
                    } else if (content === `n` || content === `no` || content === `-no` || content === `${settings.prefix}no`) {
                        collector.stop();
                        message.channel.send(`Command is now aborted.`);
                    } else {
                        message.channel.send(`Please provide a valid response: \`yes\` or \`no\`.`);
                    }
                });
            });
        } else if (whatType === `dj`) {
            if (!message.guild.roles.get(settings.djRole)) {
                return message.channel.send(`You cannot commend for this because this role has not been setup on your server.`).catch(e => {});
            }
            if (personToCommend.roles.get(settings.djRole)) {
                return message.channel.send(`${personToCommend} (${personToCommend.displayName}) cannot be commended as they already have the \`${message.guild.roles.get(settings.djRole).name}\` role.`);
            }
            let filter = (messages) => messages.author.id === message.author.id;
            let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
            message.channel.send(`Are you sure you want to commend ${personToCommend} (${personToCommend.displayName}) for the \`${message.guild.roles.get(settings.djRole).name}\` role? Doing so will immediately give them the role.`).then(msg => {
                collector.on("collect", async (msgs) => {
                    let content = msgs.content.toLowerCase();
                    if (content === `y` || content === `yes` || content === `-yes` || content === `${settings.prefix}yes`) {
                        await collector.stop();
                        await message.channel.send(`${personToCommend} (${personToCommend.displayName}) will now have the \`${message.guild.roles.get(settings.djRole).name}\` role added!`);
                        await personToCommend.roles.add(settings.djRole);
                        await message.guild.channels.get(settings.modLogsChannel).send(`\`${message.guild.roles.get(settings.djRole).name}\` role was added to ${personToCommend} (${personToCommend.displayName}) per request of ${guildMembers.get(message.author.id)} (${guildMembers.get(message.author.id).displayName}).`);
                    } else if (content === `n` || content === `no` || content === `-no` || content === `${settings.prefix}no`) {
                        collector.stop();
                        message.channel.send(`Command is now aborted.`);
                    } else {
                        message.channel.send(`Please provide a valid response: \`yes\` or \`no\`.`);
                    }
                });
            });
        } else if (whatType === `p` || whatType === `priest`) {
            if (!message.guild.roles.get(settings.priestRole)) {
                return message.channel.send(`You cannot commend for this because this role has not been setup on your server.`).catch(e => {});
            }
            if (personToCommend.roles.get(settings.priestRole)) {
                return message.channel.send(`${personToCommend} (${personToCommend.displayName}) cannot be commended as they already have the \`${message.guild.roles.get(settings.priestRole).name}\` role.`);
            }
            let imageAttached = message.attachments.array()[0];
            let optionalImage = args[3];
            if (!imageAttached && !optionalImage) {
                return message.channel.send(`Please attach an image as proof that the user meets \`${message.guild.roles.get(settings.priestRole).name}\` requirements.`);
            }
            let imageURL = (imageAttached) ? imageAttached.url : optionalImage;
            await Jimp.read(imageURL).then(async function (image) {
                await image.write("./data/priest.png");
                let filter = (messages) => messages.author.id === message.author.id;
                let collector = new Discord.MessageCollector(message.channel, filter, {time: 60000});
                message.channel.send(`Are you sure you want to commend ${personToCommend} (${personToCommend.displayName}) for the \`${message.guild.roles.get(settings.priestRole).name}\` role? Doing so will immediately give them the role.`).then(msg => {
                    collector.on("collect", async (msgs) => {
                        let content = msgs.content.toLowerCase();
                        if (content === `y` || content === `yes` || content === `-yes` || content === `${settings.prefix}yes`) {
                            await collector.stop();
                            await message.channel.send(`${personToCommend} (${personToCommend.displayName}) will now have the \`${message.guild.roles.get(settings.priestRole).name}\` role added!`);
                            await personToCommend.roles.add(settings.priestRole);
                            await message.guild.channels.get(settings.modLogsChannel).send(`\`${message.guild.roles.get(settings.priestRole).name}\` role was added to ${personToCommend} (${personToCommend.displayName}) per request of ${guildMembers.get(message.author.id)} (${guildMembers.get(message.author.id).displayName}). Image proof is provided below.`, {files: ["./data/priest.png"]});
                        } else if (content === `n` || content === `no` || content === `-no` || content === `${settings.prefix}no`) {
                            collector.stop();
                            message.channel.send(`Command is now aborted.`);
                        } else {
                            message.channel.send(`Please provide a valid response: \`yes\` or \`no\`.`);
                        }
                    });
                });
            }).catch(async (err) => {
                await message.channel.send("That is not a valid image link.");
            });
        } else {
            message.channel.send(`Please provide a valid role to commend for: \`DJ\`, \`mystic\`, \`priest\`, or \`rusher\`.`);
        }
    }
}