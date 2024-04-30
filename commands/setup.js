const Discord = require('discord.js');

module.exports = {
    aliases: [],
    description: "Sets up the server.",
    use: "setup [index | type] <add | remove | what to set to> <what to set to>",
    cooldown: 1,
    type: "mod",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        if (!guildMembers.get(message.author.id).hasPermission("ADMINISTRATOR") && message.author.id !== "321726133307572235") {
            return message.channel.send("You do not have permission to change server settings. You are missing `ADMINISTRATOR` permissions.");
        }
        let typeOfSettings = message.content.toLowerCase().split(" ")[1];
        let thingToCheck = message.content.toLowerCase().split(" ").slice(2).join(" ");
        if (!typeOfSettings || typeOfSettings === "1") {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Your server setup is shown below!`);
            let queueChannelsDB = await client.models.get("queuechannels").findAll({where: {guildID: message.guild.id}});
            let queueChannels = [];
            for (let i = 0; i < queueChannelsDB.length; i++) {
                if (message.guild.channels.get(queueChannelsDB[i].dataValues.channelID)) {
                    queueChannels.push(message.guild.channels.get(queueChannelsDB[i].dataValues.channelID));
                } else {
                    queueChannels.push(`\`${queueChannelsDB[i].dataValues.channelID}\``);
                }
            }
            let raidingChannelsDB = await client.models.get("raidingchannels").findAll({where: {guildID: message.guild.id}});
            let raidingChannels = [];
            for (let i = 0; i < raidingChannelsDB.length; i++) {
                if (message.guild.channels.get(raidingChannelsDB[i].dataValues.channelID)) {
                    raidingChannels.push(message.guild.channels.get(raidingChannelsDB[i].dataValues.channelID));
                } else {
                    raidingChannels.push(`\`${raidingChannelsDB[i].dataValues.channelID}\``);
                }
            }
            let eventQueueDB = await client.models.get("eventqueue").findAll({where: {guildID: message.guild.id}});
            let queueChannelsEvent = [];
            for (let i = 0; i < eventQueueDB.length; i++) {
                if (message.guild.channels.get(eventQueueDB[i].dataValues.channelID)) {
                    queueChannelsEvent.push(message.guild.channels.get(eventQueueDB[i].dataValues.channelID));
                } else {
                    queueChannelsEvent.push(`\`${eventQueueDB[i].dataValues.channelID}\``);
                }
            }
            let eventRaidingDB = await client.models.get("eventraiding").findAll({where: {guildID: message.guild.id}});
            let raidingChannelsEvent = [];
            for (let i = 0; i < eventRaidingDB.length; i++) {
                if (message.guild.channels.get(eventRaidingDB[i].dataValues.channelID)) {
                    raidingChannelsEvent.push(message.guild.channels.get(eventRaidingDB[i].dataValues.channelID));
                } else {
                    raidingChannelsEvent.push(`\`${eventRaidingDB[i].dataValues.channelID}\``);
                }
            }
            let veteranQueueDB = await client.models.get("veteranqueue").findAll({where: {guildID: message.guild.id}});
            let veteranQueueChannels = [];
            for (let i = 0; i < veteranQueueDB.length; i++) {
                if (message.guild.channels.get(veteranQueueDB[i].dataValues.channelID)) {
                    veteranQueueChannels.push(message.guild.channels.get(veteranQueueDB[i].dataValues.channelID));
                } else {
                    veteranQueueChannels.push(`\`${veteranQueueDB[i].dataValues.channelID}\``);
                }
            }
            let veteranRaidinggDB = await client.models.get("veteranraiding").findAll({where: {guildID: message.guild.id}});
            let veteranRaidingChannels = [];
            for (let i = 0; i < veteranRaidinggDB.length; i++) {
                if (message.guild.channels.get(veteranRaidinggDB[i].dataValues.channelID)) {
                    veteranRaidingChannels.push(message.guild.channels.get(veteranRaidinggDB[i].dataValues.channelID));
                } else {
                    veteranRaidingChannels.push(`\`${veteranRaidinggDB[i].dataValues.channelID}\``);
                }
            }
            let commandsChannelsDB = await client.models.get("commandschannels").findAll({where: {guildID: message.guild.id}});
            let commandsChannels = [];
            for (let i = 0; i < commandsChannelsDB.length; i++) {
                if (message.guild.channels.get(commandsChannelsDB[i].dataValues.channelID)) {
                    commandsChannels.push(message.guild.channels.get(commandsChannelsDB[i].dataValues.channelID));
                } else {
                    commandsChannels.push(`\`${commandsChannelsDB[i].dataValues.channelID}\``);
                }
            }
            embed.addField(`Your prefix is:`, `${settings.prefix} <- To change: \`${settings.prefix}setup prefix [characters]\``);
            embed.addField(`Your type of server is:`, `${settings.typeOfServer} <- To change: \`${settings.prefix}setup typeOfServer [LH | shatters]\``);
            embed.addField(`Your queue channels:`, `${queueChannels.join(", ")} <- To change: \`${settings.prefix}setup queue [add | remove] [channel | name | id]\``);
            embed.addField(`Your raiding channels:`, `${raidingChannels.join(", ")} <- To change: \`${settings.prefix}setup raiding [add | remove] [channel | name | id]\``);
            embed.addField(`Your event queue channels:`, `${queueChannelsEvent.join(", ")} <- To change: \`${settings.prefix}setup eventQueue [add | remove] [channel | name | id]\``);
            embed.addField(`Your event raiding channels:`, `${raidingChannelsEvent.join(", ")} <- To change: \`${settings.prefix}setup eventRaiding [add | remove] [channel | name | id]\``);
            embed.addField(`Your veteran queue channels:`, `${veteranQueueChannels.join(", ")} <- To change: \`${settings.prefix}setup vetQueue [add | remove] [channel | name | id]\``);
            embed.addField(`Your veteran raiding channels:`, `${veteranRaidingChannels.join(", ")} <- To change: \`${settings.prefix}setup vetRaiding [add | remove] [channel | name | id]\``);
            if (message.guild.channels.get(settings.AFKChannel)) {
                embed.addField(`Your AFK channel is:`, `${message.guild.channels.get(settings.AFKChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [AFK] [channel | name | id]\``);
            } else {
                embed.addField(`Your AFK channel is:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [AFK] [channel | name | id]\``);
            }
            embed.addField(`Your commands channels are:`, `${commandsChannels.join(", ")} <- To change: \`${settings.prefix}setup commands [add | remove] [channel | name | id]\``);
            if (message.guild.channels.get(settings.AFKChecks) || message.guild.channels.get(settings.eventAFKChecks) || message.guild.channels.get(settings.veteranCheckChannel)) {
                embed.addField(`Your AFK check, event AFK check, and veteran AFK check channels are:`, `${message.guild.channels.get(settings.AFKChecks)} | ${message.guild.channels.get(settings.eventAFKChecks)|| "Not Set"} | ${message.guild.channels.get(settings.veteranCheckChannel) || "Not Set"} <- To change: \`${settings.prefix}setup [checks | eventChecks | veteranChecks] [channel | name | id]\``);
            } else {
                embed.addField(`Your AFK check, event AFK check, and veteran AFK check channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [checks | eventChecks | veteranChecks] [channel | name | id]\``);
            }
            if (message.guild.channels.get(settings.arlChannel) || message.guild.channels.get(settings.updatesChannel) || message.guild.channels.get(settings.veteranCommandsChannel)) {
                embed.addField(`Your arl, updates, and veteran commands channels are:`, `${message.guild.channels.get(settings.arlChannel) || "Not Set"} | ${message.guild.channels.get(settings.updatesChannel) || "Not Set"} | ${message.guild.channels.get(settings.veteranCommandsChannel) || "Not Set"} <- To change: \`${settings.prefix}setup [arl | updates | vetCommands] [channel | name | id]\``);
            } else {
                embed.addField(`Your arl, updates, and veteran commands channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [arl | updates | vetCommands] [channel | name | id]\``);
            }
            if (message.guild.channels.get(settings.publicCommandsChannel) || message.guild.channels.get(settings.eventVeriChannel) || message.guild.channels.get(settings.veteranVeriChannel)) {
                embed.addField(`Your public commands, event verification, and veteran verification channels are:`, `${message.guild.channels.get(settings.publicCommandsChannel) || "Not Setup"} | ${message.guild.channels.get(settings.eventVeriChannel) || "Not Setup"} | ${message.guild.channels.get(settings.veteranVeriChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [pubCommands | eventVeri | veteranVeri] [channel | name | id]\``);
            } else {
                embed.addField(`Your public commands, event verification, and veteran verification channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [pubCommands | eventVeri | veteranVeri] [channel | name | id]\``);
            }
            if (message.guild.channels.get(settings.parsemembersChannel) || message.guild.channels.get(settings.currentweekChannel) || message.guild.channels.get(settings.endWeekChannel)) {
                embed.addField(`Your parsemembers, currentweek, and endWeek channels are:`, `${message.guild.channels.get(settings.parsemembersChannel) || "Not Setup"} | ${message.guild.channels.get(settings.currentweekChannel) || "Not Setup"} | ${message.guild.channels.get(settings.endWeekChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [parsemembers | currentweek | endWeek] [channel | name | id]\``);
            } else {
                embed.addField(`Your parsemembers, currentweek, and endWeek channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [parsemembers | currentweek | endWeek] [channel | name | id]\``);
            }
            if (message.guild.channels.get(settings.modmailChannel) || message.guild.channels.get(settings.modmailSendChannel) || message.guild.channels.get(settings.modLogsChannel)) {
                embed.addField(`Your modmail, modmail description, and mod logs channels are:`, `${message.guild.channels.get(settings.modmailChannel) || "Not Setup"} | ${message.guild.channels.get(settings.modmailSendChannel) || "Not Setup"} | ${message.guild.channels.get(settings.modLogsChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [modmail | mailSend | modLogs] [channel | name | id]\``);
            } else {
                embed.addField(`Your modmail, modmail description, and mod logs channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [modmail | mailSend | modLogs] [channel | name | id]\``);
            }
            if (message.guild.channels.get(settings.loggingChannel) || message.guild.channels.get(settings.suspensionsChannel) || message.guild.channels.get(settings.veriChannel)) {
                embed.addField(`Your logging, suspensions, and verification channels are:`, `${message.guild.channels.get(settings.loggingChannel) || "Not Setup"} | ${message.guild.channels.get(settings.suspensionsChannel) || "Not Setup"} | ${message.guild.channels.get(settings.veriChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [logging | suspensions | verification] [channel | name | id]\``);
            } else {
                embed.addField(`Your logging, suspensions, and verification channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [logging | suspensions | verification] [channel | name | id]\``);
            }
            if (message.guild.channels.get(settings.veriAttemptsChannel) || message.guild.channels.get(settings.veriActiveChannel) || message.guild.channels.get(settings.veriLogChannel)) {
                embed.addField(`Your verification attempts, active, and logs channels are:`, `${message.guild.channels.get(settings.veriAttemptsChannel) || "Not Setup"} | ${message.guild.channels.get(settings.veriActiveChannel) || "Not Setup"} | ${message.guild.channels.get(settings.veriLogChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [veriAttempts | veriActive | veriLog] [channel | name | id]\``);
            } else {
                embed.addField(`Your verification attempts, active, and logs channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [veriAttempts | veriActive | veriLog] [channel | name | id]\``);
            }
            if (message.guild.channels.get(settings.veriRejectionChannel) || message.guild.channels.get(settings.musicChannel) || message.guild.channels.get(settings.logsSendChannel)) {
                embed.addField(`Your pending verifications, music, and logs logging channels are:`, `${message.guild.channels.get(settings.veriRejectionChannel) || "Not Setup"} | ${message.guild.channels.get(settings.musicChannel) || "Not Setup"} | ${message.guild.channels.get(settings.logsSendChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [veriPending | music | logSend] [channel | name | id]\``);
            } else {
                embed.addField(`Your pending verifications, music, and logs logging channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [veriPending | music | logSend] [channel | name | id]\``);
            }
            if (message.guild.roles.get(settings.suspendedRole) || message.guild.roles.get(settings.suspendedButVerifiedRole) || message.guild.roles.get(settings.mutedRole)) {
                embed.addField(`Your suspended, suspended but verified, and muted roles are:`, `${message.guild.roles.get(settings.suspendedRole) || "Not Setup"} | ${message.guild.roles.get(settings.suspendedButVerifiedRole) || "Not Setup"} | ${message.guild.roles.get(settings.mutedRole) || "Not Setup"} <- To change: \`${settings.prefix}setup [suspended, SBV, muted] [role | name | id]\``);
            } else {
                embed.addField(`Your suspended, suspended but verified, and muted roles are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [suspended, SBV, muted] [role | name | id]\``);
            }
            if (message.guild.roles.get(settings.keyRole1) || message.guild.roles.get(settings.keyRole2) || message.guild.roles.get(settings.keyRole3)) {
                embed.addField(`Your gold, silver, and bronze key popper roles are:`, `${message.guild.roles.get(settings.keyRole1) || "Not Setup"} | ${message.guild.roles.get(settings.keyRole2) || "Not Setup"} | ${message.guild.roles.get(settings.keyRole3) || "Not Setup"} <- To change: \`${settings.prefix}setup [gold | silver | bronze] [role | name | id]\``);
            } else {
                embed.addField(`Your gold, silver, and bronze key popper roles are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [gold | silver | bronze] [role | name | id]\``);
            }
            if (message.guild.roles.get(settings.rusherRole) || message.guild.roles.get(settings.mysticRole) || message.guild.roles.get(settings.priestRole)) {
                embed.addField(`Your rusher, mystic, and priest roles are:`, `${message.guild.roles.get(settings.rusherRole) || "Not Setup"} | ${message.guild.roles.get(settings.mysticRole) || "Not Setup"} | ${message.guild.roles.get(settings.priestRole) || "Not Setup"} <- To change: \`${settings.prefix}setup [rusher, mystic, priest] [role | name | id]\``);
            } else {
                embed.addField(`Your rusher, mystic, and priest roles are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [rusher, mystic, priest] [role | name | id]\``);
            }
            if (message.guild.roles.get(settings.raiderRole) || message.guild.roles.get(settings.tempKeyRole) || message.guild.roles.get(settings.lolRole)) {
                embed.addField(`Your raider, temp key, and leader on leave roles are:`, `${message.guild.roles.get(settings.raiderRole) || "Not Setup"} | ${message.guild.roles.get(settings.tempKeyRole) || "Not Setup"} | ${message.guild.roles.get(settings.lolRole) || "Not Setup"} <- To change: \`${settings.prefix}setup [raider, tempKey, lol] [role | name | id]\``);
            } else {
                embed.addField(`Your raider, temp key, and leader on leave roles are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [raider, tempKey, lol] [role | name | id]\``);
            }
            if (message.guild.roles.get(settings.veteranRole) || message.guild.roles.get(settings.djRole) || message.guild.roles.get(settings.nitroBooster)) {
                embed.addField(`Your veteran raider, DJ, and nitro booster roles are:`, `${message.guild.roles.get(settings.veteranRole) || "Not Setup"} | ${message.guild.roles.get(settings.djRole) || "Not Setup"} | ${message.guild.roles.get(settings.nitroBooster) || "Not Setup"} <- To change: \`${settings.prefix}setup [vetRole | DJ | booster] [role | name | id]\``);
            } else {
                embed.addField(`Your veteran raider, DJ, and nitro booster roles are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [vetRole | DJ | booster] [role | name | id]\``);
            }
            if (message.guild.roles.get(settings.rlRole) || message.guild.roles.get(settings.arlRole) || message.guild.roles.get(settings.eventRaiderRole)) {
                embed.addField(`Your almost raid leader, raid leader, and event raider roles are:`, `${message.guild.roles.get(settings.rlRole) || "Not Setup"} | ${message.guild.roles.get(settings.arlRole) || "Not Setup"} | ${message.guild.roles.get(settings.eventRaiderRole) || "Not Setup"} <- To change: \`${settings.prefix}setup [rlRole | arlRole | eventRaider] [role | name | id]\``);
            } else {
                embed.addField(`Your almost raid leader, raid leader, and event raider roles are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [arlRole | rlRole | eventRaider] [role | name | id]\``);
            }
            embed.setFooter(`[] - Mandatory,  <> - optional,  | - or`);
            message.channel.send(embed);
        } else if (typeOfSettings === "2") {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Your server setup is shown below! (Continued)`);
            embed.addField(`Your automute, logs, and verification switches are:`, `\`${(settings.autoMuteSwitch) ? "on" : "off"}\` | \`${(settings.logsSwitch) ? "on" : "off"}\` | \`${(settings.veriSwitch) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [autoMute, logSwitch, veriSwitch] [on | off]\``);
            embed.addField(`Your modmail, currentweek updater, and music loop switches are:`, `\`${(settings.modmailSwitch) ? "on" : "off"}\` | \`${(settings.currentweekSwitch) ? "on" : "off"}\` | \`${(settings.loopSwitch) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [mailSwitch, currentSwitch, loop] [on | off]\``);
            embed.addField(`Your event verification switch and veteran verification switch switches are:`, `\`${(settings.eventVeriSwitch) ? "on" : "off"}\` | \`${(settings.veteranVeriSwitch) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [eventVSwitch | vetVSwitch] [on | off]\``);
            embed.addField(`Your logging switches for join VC, leave VC, and change VC are:`, `\`${(settings.joinVC) ? "on" : "off"}\` | \`${(settings.leaveVC) ? "on" : "off"}\` | \`${(settings.changeVC) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [joinVC, leaveVC, changeVC] [on | off]\``);
            embed.addField(`Your logging switches for bulk deletion, banning members, and removing bans are:`, `\`${(settings.bulkDelete) ? "on" : "off"}\` | \`${(settings.banAdd) ? "on" : "off"}\` | \`${(settings.banRemove) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [bulkDelete | banAdd | banRemove] [on | off]\``);
            embed.addField(`Your logging switches for nickname changes, adding roles, and removing roles are:`, `\`${(settings.nicknameSwitch) ? "on" : "off"}\` | \`${(settings.rolesAdd) ? "on" : "off"}\` | \`${(settings.rolesRemove) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [nickname | roleAdd | roleRemove] [on | off]\``);
            embed.addField(`Your logging switches for message edits, message deletes, and users leaving are:`, `\`${(settings.messEdit) ? "on" : "off"}\` | \`${(settings.messDelete) ? "on" : "off"}\` | \`${(settings.userLeave) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [messEdit | messDel | userLeave] [on | off]\``);
            embed.addField(`Your switches for checking name history, guild history, and graveyard are:`, `\`${(settings.veriNameHistory) ? "on" : "off"}\` | \`${(settings.veriGuildHistory) ? "on" : "off"}\` | \`${(settings.veriGraveyard) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [nameHist | guildHist | graveyard] [on | off]\``);
            embed.addField(`Your switches for checking date created and last known location are:`, `\`${(settings.veriCreated) ? "on" : "off"}\` | \`${(settings.veriLKL) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [created | LKL] [on | off]\``);
            embed.addField(`Your required alive fame is set to:`, `\`${settings.veriAliveFame}\` <- To change: \`${settings.prefix}setup [aliveFame] [number]\``);
            embed.addField(`Your required star count is set to:`, `\`${settings.veriStarCount}\` <- To change: \`${settings.prefix}setup [stars] [number]\``);
            embed.addField(`Your required skin count is set to:`, `\`${settings.veriSkinCount}\` <- To change: \`${settings.prefix}setup [skins] [number]\``);
            embed.addField(`Your required character count is set to:`, `\`${settings.veriCharCount}\` <- To change: \`${settings.prefix}setup [charCount] [number]\``);
            embed.addField(`Your required account fame is set to:`, `\`${settings.veriAccountFame}\` <- To change: \`${settings.prefix}setup [accFame] [number]\``);
            embed.addField(`Your required death count is set to:`, `\`${settings.veriDeathCount}\` <- To change: \`${settings.prefix}setup [deathCount] [number]\``);
            embed.addField(`Your AFK check time is set to:`, `\`${settings.afkTime}\` <- To change: \`${settings.prefix}setup [AFKTime] [number]\``);
            embed.addField(`Your post AFK check time is set to:`, `\`${settings.postAFKTime}\` <- To change: \`${settings.prefix}setup [postTime] [number]\``);
            embed.addField(`Your number of keys to accept is set to:`, `\`${settings.keyNumber}\` <- To change: \`${settings.prefix}setup [keys] [number]\``);
            embed.addField(`Your number of event keys to accept is set to:`, `\`${settings.eventKeyNuber}\` <- To change: \`${settings.prefix}setup [eventKeys] [number]\``);
            embed.addField(`Your number of vials to accept is set to:`, `\`${settings.vialNumber}\` <- To change: \`${settings.prefix}setup [vials] [number]\``);
            embed.addField(`Your number of rushers to accept is set to:`, `\`${settings.rusherNumber}\` <- To change: \`${settings.prefix}setup [rushers] [number]\``);
            embed.addField(`Your number of raiders to accept is set to:`, `\`${settings.userMax}\` <- To change: \`${settings.prefix}setup [users] [number]\``);
            embed.addField(`Your new style AFK check and module in arl chat sitches are set to:`, `\`${(settings.newAFKCheck) ? "on" : "off"}\` | \`${(settings.sendARLChat) ? "on" : "off"}\`<- To change: \`${settings.prefix}setup [newType | arlSend] [on | off]\``);
            embed.addField(`Your stats, auto suspended for deafening, and afk checks switches are set to:`, `\`${(settings.statsSwitch) ? "on" : "off"}\` | \`${(settings.autoDeafenSuspend) ? "on" : "off"}\` | \`${(settings.autoAFKSuspend) ? "on" : "off"}\` <- To change: \`${settings.prefix}setup [statsSwitch | deafenSus | AFKSus] [on | off]\``);
            embed.setFooter(`[] - Mandatory,  <> - optional,  | - or`);
            message.channel.send(embed);
        } else if (typeOfSettings === "3") {
            let embed = new Discord.MessageEmbed();
            let logsRolesDB = await client.models.get("logsroles").findAll({where: {guildID: message.guild.id}});
            let logsRoles = [];
            for (let i = 0; i < logsRolesDB.length; i++) {
                if (message.guild.roles.get(logsRolesDB[i].dataValues.roleID)) {
                    logsRoles.push(`${message.guild.roles.get(logsRolesDB[i].dataValues.roleID)}`);
                } else {
                    logsRoles.push(`\`${logsRolesDB[i].dataValues.roleID}\``);
                }
            }
            let staffRolesDB = await client.models.get("muteroles").findAll({where: {guildID: message.guild.id}});
            let staffRoles = [];
            for (let i = 0; i < staffRolesDB.length; i++) {
                if (message.guild.roles.get(staffRolesDB[i].dataValues.roleID)) {
                    staffRoles.push(`${message.guild.roles.get(staffRolesDB[i].dataValues.roleID)}`);
                } else {
                    staffRoles.push(`\`${staffRolesDB[i].dataValues.roleID}\``);
                }
            }
            let expelledGuildsRolesDB = await client.models.get("expelledguildsroles").findAll({where: {guildID: message.guild.id}});
            let expelledGuildsRoles = [];
            for (let i = 0; i < expelledGuildsRolesDB.length; i++) {
                if (message.guild.roles.get(expelledGuildsRolesDB[i].dataValues.roleID)) {
                    expelledGuildsRoles.push(`${message.guild.roles.get(expelledGuildsRolesDB[i].dataValues.roleID)}`);
                } else {
                    expelledGuildsRoles.push(`\`${expelledGuildsRolesDB[i].dataValues.roleID}\``);
                }
            }
            let autoMuteRolesDB = await client.models.get("automuteroles").findAll({where: {guildID: message.guild.id}});
            let autoMuteRoles = [];
            for (let i = 0; i < autoMuteRolesDB.length; i++) {
                if (message.guild.roles.get(autoMuteRolesDB[i].dataValues.roleID)) {
                    autoMuteRoles.push(`${message.guild.roles.get(autoMuteRolesDB[i].dataValues.roleID)}`);
                } else {
                    autoMuteRoles.push(`\`${autoMuteRolesDB[i].dataValues.roleID}\``);
                }
            }
            let guildSuspendRolesDB = await client.models.get("guildsuspendroles").findAll({where: {guildID: message.guild.id}});
            let guildSuspendRoles = [];
            for (let i = 0; i < guildSuspendRolesDB.length; i++) {
                if (message.guild.roles.get(guildSuspendRolesDB[i].dataValues.roleID)) {
                    guildSuspendRoles.push(`${message.guild.roles.get(guildSuspendRolesDB[i].dataValues.roleID)}`);
                } else {
                    guildSuspendRoles.push(`\`${guildSuspendRolesDB[i].dataValues.roleID}\``);
                }
            }
            let purgeRolesDB = await client.models.get("purgeroles").findAll({where: {guildID: message.guild.id}});
            let purgeRoles = [];
            for (let i = 0; i < purgeRolesDB.length; i++) {
                if (message.guild.roles.get(purgeRolesDB[i].dataValues.roleID)) {
                    purgeRoles.push(`${message.guild.roles.get(purgeRolesDB[i].dataValues.roleID)}`);
                } else {
                    purgeRoles.push(`\`${purgeRolesDB[i].dataValues.roleID}\``);
                }
            }
            let changeLogsRolesDB = await client.models.get("changelogsroles").findAll({where: {guildID: message.guild.id}});
            let changeLogsRoles = [];
            for (let i = 0; i < changeLogsRolesDB.length; i++) {
                if (message.guild.roles.get(changeLogsRolesDB[i].dataValues.roleID)) {
                    changeLogsRoles.push(`${message.guild.roles.get(changeLogsRolesDB[i].dataValues.roleID)}`);
                } else {
                    changeLogsRoles.push(`\`${changeLogsRolesDB[i].dataValues.roleID}\``);
                }
            }
            embed.setTitle(`Your server setup is shown below! (Continued)`);
            embed.addField(`Your raid leader roles are:`, `${logsRoles.join(", ")} <- To change: \`${settings.prefix}setup [rlRoles] [add | remove] [role | name | id]\``);
            embed.addField(`Your staff roles are:`, `${staffRoles.join(", ")} <- To change: \`${settings.prefix}setup [staffRoles] [add | remove] [role | name | id]\``);
            embed.addField(`Your roles that can use expelled guilds command are:`, `${expelledGuildsRoles.join(", ")} <- To change: \`${settings.prefix}setup [EGRoles] [add | remove] [role | name | id]\``);
            embed.addField(`Your automute exempt roles are:`, `${autoMuteRoles.join(", ")} <- To change: \`${settings.prefix}setup [AMRoles] [add | remove] [role | name | id]\``);
            embed.addField(`Your guild suspend roles are:`, `${guildSuspendRoles.join(", ")} <- To change: \`${settings.prefix}setup [GSRoles] [add | remove] [role | name | id]\``);
            embed.addField(`Your purge roles are:`, `${purgeRoles.join(", ")} <- To change: \`${settings.prefix}setup [purgeRoles] [add | remove] [role | name | id]\``);
            embed.addField(`Your change logs roles are:`, `${changeLogsRoles.join(", ")} <- To change: \`${settings.prefix}setup [CLRoles] [add | remove] [role | name | id]\``);
            if (message.guild.channels.get(settings.loggingSecondary) || message.guild.channels.get(settings.vialLogChannel) || message.guild.channels.get(settings.veriFAQChannel)) {
                embed.addField(`Your command logging, vial logs, and verification FAQ channels are:`, `${message.guild.channels.get(settings.loggingSecondary) || "Not Setup"} | ${message.guild.channels.get(settings.vialLogChannel) || "Not Setup"} | ${message.guild.channels.get(settings.veriFAQChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [history | vialLogs | veriFAQ] [channel | name | id]\``);
            } else {
                embed.addField(`Your command logging, vial logs, and verification FAQ channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [history | vialLogs | veriFAQ] [channel | name | id]\``);
            }
            if (message.guild.channels.get(settings.FAQChannel) || message.guild.channels.get(settings.rulesChannel) || message.guild.channels.get(settings.veriVetPendingChannel)) {
                embed.addField(`Your FAQ, rules, and veteran pending channels are:`, `${message.guild.channels.get(settings.FAQChannel) || "Not Setup"} | ${message.guild.channels.get(settings.rulesChannel) || "Not Setup"} | ${message.guild.channels.get(settings.veriVetPendingChannel) || "Not Setup"} <- To change: \`${settings.prefix}setup [FAQ | rules | vetPending] [channel | name | id]\``);
            } else {
                embed.addField(`Your FAQ, rules, and veteran pending channels are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [FAQ | rules | vetPending] [channel | name | id]\``);
            }
            embed.addField(`Your veteran verification character count, maxed stats, and run requirements are:`, `${settings.veteranVeriChar} | ${settings.veteranVeriMaxed} | ${settings.veteranVeriRuns} <- To change: \`${settings.prefix}setup [vetChars | vetStats | vetRuns] [channel | name | id]\``);
            if (settings.rusherPrefix || settings.mysticPrefix || settings.priestPrefix) {
                embed.addField(`Your rusher, mystic, and priest prefixes are:`, `${settings.rusherPrefix || "Not Setup"} | ${settings.mysticPrefix || "Not Setup"} | ${settings.priestPrefix || "Not Setup"} <- To change: \`${settings.prefix}setup [rusherP, mysticP, priestP] [characters]\``);
            } else {
                embed.addField(`Your rusher, mystic, and priest prefixes are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [rusherP, mysticP, priestP] [characters]\``);
            }
            if (settings.arlPrefix || settings.rlPrefix) {
                embed.addField(`Your arl and rl prefixes are:`, `${settings.arlPrefix || "Not Setup"} | ${settings.rlPrefix || "Not Setup"} <- To change: \`${settings.prefix}setup [arlP, rlP] [characters]\``);
            } else {
                embed.addField(`Your arl and rl prefixes are:`, `__Not Setup__ <- To change: \`${settings.prefix}setup [arlP, rlP] [characters]\``);
            }
            embed.addField(`Your invite link is:`, `${settings.inviteLink || "__Not Setup__"} <- To change: \`${settings.prefix}setup invite [link]\``);
            embed.setFooter(`[] - Mandatory,  <> - optional,  | - or`);
            message.channel.send(embed);
        } else if (typeOfSettings === "4") {
            let embed = new Discord.MessageEmbed();
            let typeProfileDB = await client.models.get("typeprofile").findAll({where: {guildID: message.guild.id}});
            let types = [];
            for (let i = 0; i < typeProfileDB.length; i++) {
                types.push((client.emojisPortals.get(typeProfileDB[i].dataValues.type)) ? client.emojisPortals.get(typeProfileDB[i].dataValues.type).name.split("_").join(" ") : (typeProfileDB[i].dataValues.type === "lh") ? "Lost Halls" : "Unknown");
            }
            embed.setTitle(`Your server setup is shown below! (Continued)`);
            embed.addField(`Your server types are:`, `${types.join(", ")} <- To change: \`${settings.prefix}setup [serverType] [add | remove] [type of dungeon]\``);
            embed.setFooter(`[] - Mandatory,  <> - optional,  | - or`);
            message.channel.send(embed);
        } else if (typeOfSettings === "prefix") {
            if (thingToCheck.indexOf(" ") > 0) {
                return message.channel.send("Your prefix cannot contain blank spaces.");
            }
            if (thingToCheck.length > 5) {
                return message.channel.send("Your prefix cannot be longer than 5 characters.");
            }
            await message.channel.send(`${thingToCheck} is now set as your prefix!`);
            await client.models.get("guild").update({prefix: thingToCheck}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "typeofserver") {
            if (thingToCheck === "shatters") {
                await message.channel.send(`Your server is now setup as a Shatters server!`);
                await client.models.get("guild").update({typeOfServer: thingToCheck}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "lh") {
                await message.channel.send(`Your server is now setup as a Lost Halls server!`);
                await client.models.get("guild").update({typeOfServer: thingToCheck}, {where: {guildID: message.guild.id}});
            } else {
                return message.channel.send(`That is an invalid type to set this server as. Valid server types include: \`LH\` or \`shatters\`.`);
            }
        } else if (typeOfSettings === "servertype") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                if (client.emojisPortals.get(thingToCheck) || thingToCheck === "lh") {
                    await message.channel.send(`${(client.emojisPortals.get(thingToCheck)) ? client.emojisPortals.get(thingToCheck).name.split("_").join(" ") : "Lost Halls"} is now added to your list of server types!`);
                    await client.models.get("typeprofile").create({
                        guildID: message.guild.id,
                        type: thingToCheck
                    });
                }
            } else if (addOrRemove === "remove") {
                if (client.emojisPortals.get(thingToCheck) || thingToCheck === "lh") {
                    await message.channel.send(`${(client.emojisPortals.get(thingToCheck)) ? client.emojisPortals.get(thingToCheck).name.split("_").join(" ") : "Lost Halls"} is now removed from your server types!`);
                    await client.models.get("typeprofile").destroy({where: {type: thingToCheck}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "queue") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                if (!channelIFound) {
                    return message.channel.send("Please provide a valid channel to add to your queue channels.");
                }
                let queueChannelsDB = await client.models.get("queuechannels").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                if (queueChannelsDB.length > 0) {
                    return message.channel.send("Please provide a valid channel to add to your queue channels.");
                }
                await message.channel.send(`${channelIFound} is now added to your list of queue channels!`);
                await client.models.get("queuechannels").create({
                    guildID: message.guild.id,
                    channelID: channelIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                let queueChannelsDB = await client.models.get("queuechannels").findAll().filter(e => e.dataValues.channelID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!channelIFound && queueChannelsDB.length === 0) {
                    return message.channel.send("Please provide a valid channel to remove from your queue channels.");
                }
                if (!channelIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your queue channels!`);
                    await client.models.get("queuechannels").destroy({where: {channelID: thingToCheck}});
                } else {
                    queueChannelsDB = await client.models.get("queuechannels").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!queueChannelsDB) {
                        return message.channel.send(`\`${channelIFound}\` is not a queue channel.`);
                    }
                    await message.channel.send(`${channelIFound} is now removed from your queue channels!`);
                    await client.models.get("queuechannels").destroy({where: {channelID: channelIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "raiding") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                if (!channelIFound) {
                    return message.channel.send("Please provide a valid channel to add to your raiding channels.");
                }
                let raidingChannelsDB = await client.models.get("raidingchannels").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                if (raidingChannelsDB.length > 0) {
                    return message.channel.send("Please provide a valid channel to add to your raiding channels.");
                }
                await message.channel.send(`${channelIFound} is now added to your list of raiding channels!`);
                await client.models.get("raidingchannels").create({
                    guildID: message.guild.id,
                    channelID: channelIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                let raidingChannelsDB = await client.models.get("raidingchannels").findAll().filter(e => e.dataValues.channelID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!channelIFound && raidingChannelsDB.length === 0) {
                    return message.channel.send("Please provide a valid channel to remove from your raiding channels.");
                }
                if (!channelIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your raiding channels!`);
                    await client.models.get("raidingchannels").destroy({where: {channelID: thingToCheck}});
                } else {
                    raidingChannelsDB = await client.models.get("raidingchannels").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!raidingChannelsDB) {
                        return message.channel.send(`\`${channelIFound}\` is not a raiding channel.`);
                    }
                    await message.channel.send(`${channelIFound} is now removed from your raiding channels!`);
                    await client.models.get("raidingchannels").destroy({where: {channelID: channelIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "eventqueue") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                if (!channelIFound) {
                    return message.channel.send("Please provide a valid channel to add to your event queue channels.");
                }
                let eventQueueDB = await client.models.get("eventqueue").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                if (eventQueueDB.length > 0) {
                    return message.channel.send("Please provide a valid channel to add to your event queue channels.");
                }
                await message.channel.send(`${channelIFound} is now added to your list of event queue channels!`);
                await client.models.get("eventqueue").create({
                    guildID: message.guild.id,
                    channelID: channelIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                let eventQueueDB = await client.models.get("eventqueue").findAll().filter(e => e.dataValues.channelID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!channelIFound && eventQueueDB.length === 0) {
                    return message.channel.send("Please provide a valid channel to remove from your event queue channels.");
                }
                if (!channelIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your event queue channels!`);
                    await client.models.get("eventqueue").destroy({where: {channelID: thingToCheck}});
                } else {
                    eventQueueDB = await client.models.get("eventqueue").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!eventQueueDB) {
                        return message.channel.send(`\`${channelIFound}\` is not a event queue channel.`);
                    }
                    await message.channel.send(`${channelIFound} is now removed from your event queue channels!`);
                    await client.models.get("eventqueue").destroy({where: {channelID: channelIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "eventraiding") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                if (!channelIFound) {
                    return message.channel.send("Please provide a valid channel to add to your event raiding channels.");
                }
                let eventRaidingDB = await client.models.get("eventraiding").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                if (eventRaidingDB.length > 0) {
                    return message.channel.send("Please provide a valid channel to add to your event raiding channels.");
                }
                await message.channel.send(`${channelIFound} is now added to your list of event raiding channels!`);
                await client.models.get("eventraiding").create({
                    guildID: message.guild.id,
                    channelID: channelIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                let eventRaidingDB = await client.models.get("eventraiding").findAll().filter(e => e.dataValues.channelID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!channelIFound && eventRaidingDB.length === 0) {
                    return message.channel.send("Please provide a valid channel to remove from your event raiding channels.");
                }
                if (!channelIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your event raiding channels!`);
                    await client.models.get("eventraiding").destroy({where: {channelID: thingToCheck}});
                } else {
                    eventRaidingDB = await client.models.get("eventraiding").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!eventRaidingDB) {
                        return message.channel.send(`\`${channelIFound}\` is not a event raiding channel.`);
                    }
                    await message.channel.send(`${channelIFound} is now removed from your event raiding channels!`);
                    await client.models.get("eventraiding").destroy({where: {channelID: channelIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "vetqueue") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                if (!channelIFound) {
                    return message.channel.send("Please provide a valid channel to add to your veteran queue channels.");
                }
                let veteranQueueDB = await client.models.get("veteranqueue").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                if (veteranQueueDB.length > 0) {
                    return message.channel.send("Please provide a valid channel to add to your veteran queue channels.");
                }
                await message.channel.send(`${channelIFound} is now added to your list of veteran queue channels!`);
                await client.models.get("veteranqueue").create({
                    guildID: message.guild.id,
                    channelID: channelIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                let veteranQueueDB = await client.models.get("veteranqueue").findAll().filter(e => e.dataValues.channelID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!channelIFound && veteranQueueDB.length === 0) {
                    return message.channel.send("Please provide a valid channel to remove from your veteran queue channels.");
                }
                if (!channelIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your veteran queue channels!`);
                    await client.models.get("veteranqueue").destroy({where: {channelID: thingToCheck}});
                } else {
                    veteranQueueDB = await client.models.get("veteranqueue").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!veteranQueueDB) {
                        return message.channel.send(`\`${channelIFound}\` is not a veteran queue channel.`);
                    }
                    await message.channel.send(`${channelIFound} is now removed from your veteran queue channels!`);
                    await client.models.get("veteranqueue").destroy({where: {channelID: channelIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "vetraiding") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                if (!channelIFound) {
                    return message.channel.send("Please provide a valid channel to add to your veteran raiding channels.");
                }
                let veteranRaidingDB = await client.models.get("veteranraiding").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                if (veteranRaidingDB.length > 0) {
                    return message.channel.send("Please provide a valid channel to add to your veteran raiding channels.");
                }
                await message.channel.send(`${channelIFound} is now added to your list of veteran raiding channels!`);
                await client.models.get("veteranraiding").create({
                    guildID: message.guild.id,
                    channelID: channelIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'voice');
                let veteranRaidingDB = await client.models.get("veteranraiding").findAll().filter(e => e.dataValues.channelID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!channelIFound && veteranRaidingDB.length === 0) {
                    return message.channel.send("Please provide a valid channel to remove from your veteran raiding channels.");
                }
                if (!channelIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your veteran raiding channels!`);
                    await client.models.get("veteranraiding").destroy({where: {channelID: thingToCheck}});
                } else {
                    veteranRaidingDB = await client.models.get("veteranraiding").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!veteranRaidingDB) {
                        return message.channel.send(`\`${channelIFound}\` is not a veteran raiding channel.`);
                    }
                    await message.channel.send(`${channelIFound} is now removed from your veteran raiding channels!`);
                    await client.models.get("veteranraiding").destroy({where: {channelID: channelIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "commands") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'text');
                if (!channelIFound) {
                    return message.channel.send("Please provide a valid channel to add to your commands channels.");
                }
                let commandsChannelsDB = await client.models.get("commandschannels").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                if (commandsChannelsDB.length > 0) {
                    return message.channel.send("Please provide a valid channel to add to your commands channels.");
                }
                await message.channel.send(`${channelIFound} is now added to your list of commands channels!`);
                await client.models.get("commandschannels").create({
                    guildID: message.guild.id,
                    channelID: channelIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/channel`);
                let channelIFound = await command(message, thingToCheck, 'text');
                let commandsChannelsDB = await client.models.get("commandschannels").findAll().filter(e => e.dataValues.channelID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!channelIFound && commandsChannelsDB.length === 0) {
                    return message.channel.send("Please provide a valid channel to remove from your commands channels.");
                }
                if (!channelIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your commands channels!`);
                    await client.models.get("commandschannels").destroy({where: {channelID: thingToCheck}});
                } else {
                    commandsChannelsDB = await client.models.get("commandschannels").findAll().filter(e => e.dataValues.channelID === channelIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!commandsChannelsDB) {
                        return message.channel.send(`\`${channelIFound}\` is not a commands channel.`);
                    }
                    await message.channel.send(`${channelIFound} is now removed from your commands channels!`);
                    await client.models.get("commandschannels").destroy({where: {channelID: channelIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "rlroles") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                if (!roleIFound) {
                    return message.channel.send("Please provide a valid role to add to your leader roles list.");
                }
                let logsRolesDB = await client.models.get("logsroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                if (logsRolesDB.length > 0) {
                    return message.channel.send("Please provide a valid role to add to your leader roles list.");
                }
                await message.channel.send(`${roleIFound.name} is now added to your list of leader roles list!`);
                await client.models.get("logsroles").create({
                    guildID: message.guild.id,
                    roleID: roleIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                let logsRolesDB = await client.models.get("logsroles").findAll().filter(e => e.dataValues.roleID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!roleIFound && logsRolesDB.length === 0) {
                    return message.channel.send("Please provide a valid role to remove from your leader roles list.");
                }
                if (!roleIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your leader roles list!`);
                    await client.models.get("logsroles").destroy({where: {roleID: thingToCheck}});
                } else {
                    logsRolesDB = await client.models.get("logsroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!logsRolesDB) {
                        return message.channel.send(`\`${roleIFound.name}\` is not a leader role.`);
                    }
                    await message.channel.send(`${roleIFound.name} is now removed from your leader roles list!`);
                    await client.models.get("logsroles").destroy({where: {roleID: roleIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "staffroles") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                if (!roleIFound) {
                    return message.channel.send("Please provide a valid role to add to your staff roles list.");
                }
                let staffRoleDB = await client.models.get("muteroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                if (staffRoleDB.length > 0) {
                    return message.channel.send("Please provide a valid role to add to your staff roles list.");
                }
                await message.channel.send(`${roleIFound.name} is now added to your list of staff roles list!`);
                await client.models.get("muteroles").create({
                    guildID: message.guild.id,
                    roleID: roleIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                let staffRoleDB = await client.models.get("muteroles").findAll().filter(e => e.dataValues.roleID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!roleIFound && staffRoleDB.length === 0) {
                    return message.channel.send("Please provide a valid role to remove from your staff roles list.");
                }
                if (!roleIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your staff roles list!`);
                    await client.models.get("muteroles").destroy({where: {roleID: thingToCheck}});
                } else {
                    staffRoleDB = await client.models.get("muteroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!staffRoleDB) {
                        return message.channel.send(`\`${roleIFound.name}\` is not a staff role.`);
                    }
                    await message.channel.send(`${roleIFound.name} is now removed from your staff roles list!`);
                    await client.models.get("muteroles").destroy({where: {roleID: roleIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "egroles") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                if (!roleIFound) {
                    return message.channel.send("Please provide a valid role to add to your expelled guilds roles list.");
                }
                let expelledGuildsRoleDB = await client.models.get("expelledguildsroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                if (expelledGuildsRoleDB.length > 0) {
                    return message.channel.send("Please provide a valid role to add to your expelled guilds roles list.");
                }
                await message.channel.send(`${roleIFound.name} is now added to your list of expelled guilds roles list!`);
                await client.models.get("expelledguildsroles").create({
                    guildID: message.guild.id,
                    roleID: roleIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                let expelledGuildsRoleDB = await client.models.get("expelledguildsroles").findAll().filter(e => e.dataValues.roleID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!roleIFound && expelledGuildsRoleDB.length === 0) {
                    return message.channel.send("Please provide a valid role to remove from your expelled guilds roles list.");
                }
                if (!roleIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your expelled guilds roles list!`);
                    await client.models.get("expelledguildsroles").destroy({where: {roleID: thingToCheck}});
                } else {
                    expelledGuildsRoleDB = await client.models.get("expelledguildsroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!expelledGuildsRoleDB) {
                        return message.channel.send(`\`${roleIFound.name}\` is not a expelled guilds role.`);
                    }
                    await message.channel.send(`${roleIFound.name} is now removed from your expelled guilds roles list!`);
                    await client.models.get("expelledguildsroles").destroy({where: {roleID: roleIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "amroles") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                if (!roleIFound) {
                    return message.channel.send("Please provide a valid role to add to your auto mute roles list.");
                }
                let expelledGuildsRoleDB = await client.models.get("automuteroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                if (expelledGuildsRoleDB.length > 0) {
                    return message.channel.send("Please provide a valid role to add to your auto mute roles list.");
                }
                await message.channel.send(`${roleIFound.name} is now added to your list of auto mute roles list!`);
                await client.models.get("automuteroles").create({
                    guildID: message.guild.id,
                    roleID: roleIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                let expelledGuildsRoleDB = await client.models.get("automuteroles").findAll().filter(e => e.dataValues.roleID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!roleIFound && expelledGuildsRoleDB.length === 0) {
                    return message.channel.send("Please provide a valid role to remove from your auto mute roles list.");
                }
                if (!roleIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your auto mute roles list!`);
                    await client.models.get("automuteroles").destroy({where: {roleID: thingToCheck}});
                } else {
                    expelledGuildsRoleDB = await client.models.get("automuteroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!expelledGuildsRoleDB) {
                        return message.channel.send(`\`${roleIFound.name}\` is not a auto mute role.`);
                    }
                    await message.channel.send(`${roleIFound.name} is now removed from your auto mute roles list!`);
                    await client.models.get("automuteroles").destroy({where: {roleID: roleIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "gsroles") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                if (!roleIFound) {
                    return message.channel.send("Please provide a valid role to add to your guild suspend roles list.");
                }
                let guildSuspendDB = await client.models.get("guildsuspendroles").findAll({where: {roleID: roleIFound.id, guildID: message.guild.id}});
                if (guildSuspendDB.length > 0) {
                    return message.channel.send("Please provide a valid role to add to your guild suspend roles list.");
                }
                await message.channel.send(`${roleIFound.name} is now added to your list of guild suspend roles list!`);
                await client.models.get("guildsuspendroles").create({
                    guildID: message.guild.id,
                    roleID: roleIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                let guildSuspendDB = await client.models.get("guildsuspendroles").findAll().filter(e => e.dataValues.roleID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!roleIFound && guildSuspendDB.length === 0) {
                    return message.channel.send("Please provide a valid role to remove from your guild suspend roles list.");
                }
                if (!roleIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your guild suspend roles list!`);
                    await client.models.get("guildsuspendroles").destroy({where: {roleID: thingToCheck}});
                } else {
                    guildSuspendDB = await client.models.get("guildsuspendroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!guildSuspendDB) {
                        return message.channel.send(`\`${roleIFound.name}\` is not a guild suspend role.`);
                    }
                    await message.channel.send(`${roleIFound.name} is now removed from your guild suspend roles list!`);
                    await client.models.get("guildsuspendroles").destroy({where: {roleID: roleIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "purgeroles") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                if (!roleIFound) {
                    return message.channel.send("Please provide a valid role to add to your purge roles list.");
                }
                let purgeRolesDB = await client.models.get("purgeroles").findAll({where: {roleID: roleIFound.id, guildID: message.guild.id}});
                if (purgeRolesDB.length > 0) {
                    return message.channel.send("Please provide a valid role to add to your purge roles list.");
                }
                await message.channel.send(`${roleIFound.name} is now added to your list of purge roles list!`);
                await client.models.get("purgeroles").create({
                    guildID: message.guild.id,
                    roleID: roleIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                let purgeRolesDB = await client.models.get("purgeroles").findAll().filter(e => e.dataValues.roleID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!roleIFound && purgeRolesDB.length === 0) {
                    return message.channel.send("Please provide a valid role to remove from your purge roles list.");
                }
                if (!roleIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your purge roles list!`);
                    await client.models.get("purgeroles").destroy({where: {roleID: thingToCheck}});
                } else {
                    purgeRolesDB = await client.models.get("purgeroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!purgeRolesDB) {
                        return message.channel.send(`\`${roleIFound.name}\` is not a purge role.`);
                    }
                    await message.channel.send(`${roleIFound.name} is now removed from your purge roles list!`);
                    await client.models.get("purgeroles").destroy({where: {roleID: roleIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "clroles") {
            let addOrRemove = message.content.toLowerCase().split(" ")[2];
            thingToCheck = message.content.toLowerCase().split(" ").slice(3).join(" ");
            if (addOrRemove === "add") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                if (!roleIFound) {
                    return message.channel.send("Please provide a valid role to add to your change logs roles list.");
                }
                let chnageLogsDB = await client.models.get("changelogsroles").findAll({where: {roleID: roleIFound.id, guildID: message.guild.id}});
                if (chnageLogsDB.length > 0) {
                    return message.channel.send("Please provide a valid role to add to your change logs roles list.");
                }
                await message.channel.send(`${roleIFound.name} is now added to your list of change logs roles list!`);
                await client.models.get("changelogsroles").create({
                    guildID: message.guild.id,
                    roleID: roleIFound.id
                });
            } else if (addOrRemove === "remove") {
                let command = await require(`./help/role`);
                let roleIFound = await command(message, thingToCheck);
                let chnageLogsDB = await client.models.get("changelogsroles").findAll().filter(e => e.dataValues.roleID === thingToCheck && e.dataValues.guildID === message.guild.id);
                if (!roleIFound && chnageLogsDB.length === 0) {
                    return message.channel.send("Please provide a valid role to remove from your change logs roles list.");
                }
                if (!roleIFound) {
                    await message.channel.send(`${thingToCheck} is now removed from your change logs roles list!`);
                    await client.models.get("changelogsroles").destroy({where: {roleID: thingToCheck}});
                } else {
                    chnageLogsDB = await client.models.get("changelogsroles").findAll().filter(e => e.dataValues.roleID === roleIFound.id && e.dataValues.guildID === message.guild.id);
                    if (!chnageLogsDB) {
                        return message.channel.send(`\`${roleIFound.name}\` is not a change logs role.`);
                    }
                    await message.channel.send(`${roleIFound.name} is now removed from your change logs roles list!`);
                    await client.models.get("changelogsroles").destroy({where: {roleID: roleIFound.id}});
                }
            } else {
                return message.channel.send("Please provide a valid operation: \`add\` or \`remove\`.");
            }
        } else if (typeOfSettings === "history") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your commands logging channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your commands logging channel!`);
            await client.models.get("guild").update({loggingSecondary: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "viallogs") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your vial logs channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your vial logs channel!`);
            await client.models.get("guild").update({vialLogChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "verifaq") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your verification FAQ channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your verification FAQ channel!`);
            await client.models.get("guild").update({veriFAQChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "faq") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your FAQ channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your FAQ channel!`);
            await client.models.get("guild").update({FAQChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "rules") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your rules channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your rules channel!`);
            await client.models.get("guild").update({rulesChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "vetpending") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your veteran verification channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your veteran verification channel!`);
            await client.models.get("guild").update({veriVetPendingChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "checks") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your afk checks channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your afk check channel!`);
            await client.models.get("guild").update({AFKChecks: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "eventchecks") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your event afk check channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your event afk check channel!`);
            await client.models.get("guild").update({eventAFKChecks: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "veteranchecks") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your veteran afk checks channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your veteran afk check channel!`);
            await client.models.get("guild").update({veteranCheckChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "arl") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your arl channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your arl channel!`);
            await client.models.get("guild").update({arlChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "updates") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your updates channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your updates channel!`);
            await client.models.get("guild").update({updatesChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "vetcommands") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your veteran commands channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your veteran commands channel!`);
            await client.models.get("guild").update({veteranCommandsChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "pubcommands") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your public commands channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your public commands channel!`);
            await client.models.get("guild").update({publicCommandsChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "eventveri") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your event verification channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your event verification channel!`);
            await client.models.get("guild").update({eventVeriChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "veteranveri") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your veteran verification channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your veteran verification channel!`);
            await client.models.get("guild").update({veteranVeriChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "parsemembers") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your parsemembers channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your parsemembers channel!`);
            await client.models.get("guild").update({parsemembersChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "currentweek") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your currentweek channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your currentweek channel!`);
            await client.models.get("guild").update({currentweekChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "endweek") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your endWeek channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your endWeek channel!`);
            await client.models.get("guild").update({endWeekChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "modmail") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your modmail channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your modmail channel!`);
            await client.models.get("guild").update({modmailChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "mailsend") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your modmail description channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your modmail description channel!`);
            await client.models.get("guild").update({modmailSendChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "afk") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'voice');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your AFK channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your AFK channel!`);
            await client.models.get("guild").update({AFKChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "logging") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your logging channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your logging channel!`);
            await client.models.get("guild").update({loggingChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "suspensions") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your suspensions channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your suspensions channel!`);
            await client.models.get("guild").update({suspensionsChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "verification") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your verification channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your verification channel!`);
            await client.models.get("guild").update({veriChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "veriattempts") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your verification attempts channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your verification attempts channel!`);
            await client.models.get("guild").update({veriAttemptsChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "veriactive") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your active verification channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your active verification channel!`);
            await client.models.get("guild").update({veriActiveChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "verilog") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your verification log channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your verification log channel!`);
            await client.models.get("guild").update({veriLogChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "veripending") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your pending verifications channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your pending verifications channel!`);
            await client.models.get("guild").update({veriRejectionChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "music") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your music channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your music channel!`);
            await client.models.get("guild").update({musicChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "logsend") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your logs logging channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your logs logging channel!`);
            await client.models.get("guild").update({logsSendChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "modlogs") {
            let command = await require(`./help/channel`);
            let channelIFound = await command(message, thingToCheck, 'text');
            if (!channelIFound) {
                return message.channel.send("Please provide a valid channel to set as your mod logs channel.");
            }
            await message.channel.send(`${channelIFound} is now set as your mod logs channel!`);
            await client.models.get("guild").update({modLogsChannel: channelIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "booster") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your nitro booster role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your nitro booster role!`);
            await client.models.get("guild").update({nitroBooster: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "suspended") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your suspended role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your suspended role!`);
            await client.models.get("guild").update({suspendedRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "sbv") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your suspended but verified role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your suspended but verified role!`);
            await client.models.get("guild").update({suspendedButVerifiedRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "muted") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your muted role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your muted role!`);
            await client.models.get("guild").update({mutedRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "rusher") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your rusher role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your rusher role!`);
            await client.models.get("guild").update({rusherRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "mystic") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your mystic role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your mystic role!`);
            await client.models.get("guild").update({mysticRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "priest") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your priest role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your priest role!`);
            await client.models.get("guild").update({priestRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "raider") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your raider role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your raider role!`);
            await client.models.get("guild").update({raiderRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "gold") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your gold key popper role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your raider role!`);
            await client.models.get("guild").update({keyRole1: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "silver") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your silver key popper role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your raider role!`);
            await client.models.get("guild").update({keyRole2: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "bronze") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your broze key popper role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your raider role!`);
            await client.models.get("guild").update({keyRole3: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "tempkey") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your temp key role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your temp key role!`);
            await client.models.get("guild").update({tempKeyRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "lol") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your leader on leave role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your leader on leave role!`);
            await client.models.get("guild").update({lolRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "vetrole") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your veteran raider role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your veteran raider role!`);
            await client.models.get("guild").update({veteranRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "dj") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your DJ role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your DJ role!`);
            await client.models.get("guild").update({djRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "rlrole") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your raid leader role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your raid leader role!`);
            await client.models.get("guild").update({rlRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "arlrole") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your almost raid leader role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your almost raid leader role!`);
            await client.models.get("guild").update({arlRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "eventraider") {
            let command = await require(`./help/role`);
            let roleIFound = await command(message, thingToCheck);
            if (!roleIFound) {
                return message.channel.send("Please provide a role to set as your event raider role.");
            }
            await message.channel.send(`${roleIFound.name} is now set as your event raider role!`);
            await client.models.get("guild").update({eventRaiderRole: roleIFound.id}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "rusherp") {
            if (thingToCheck.indexOf(" ") > 0) {
                return message.channel.send("Your rusher prefix cannot contain blank spaces.");
            }
            if (thingToCheck.length > 5) {
                return message.channel.send("Your rusher prefix cannot be longer than 5 characters.");
            }
            await message.channel.send(`${thingToCheck} is now set as your rusher prefix!`);
            await client.models.get("guild").update({rusherPrefix: thingToCheck}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "mysticp") {
            if (thingToCheck.indexOf(" ") > 0) {
                return message.channel.send("Your mystic prefix cannot contain blank spaces.");
            }
            if (thingToCheck.length > 5) {
                return message.channel.send("Your mystic prefix cannot be longer than 5 characters.");
            }
            await message.channel.send(`${thingToCheck} is now set as your mystic prefix!`);
            await client.models.get("guild").update({mysticPrefix: thingToCheck}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "priestp") {
            if (thingToCheck.indexOf(" ") > 0) {
                return message.channel.send("Your priest prefix cannot contain blank spaces.");
            }
            if (thingToCheck.length > 5) {
                return message.channel.send("Your priest prefix cannot be longer than 5 characters.");
            }
            await message.channel.send(`${thingToCheck} is now set as your priest prefix!`);
            await client.models.get("guild").update({priestPrefix: thingToCheck}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "arlp") {
            if (thingToCheck.indexOf(" ") > 0) {
                return message.channel.send("Your almost raid leader prefix cannot contain blank spaces.");
            }
            if (thingToCheck.length > 5) {
                return message.channel.send("Your almost raid leader prefix cannot be longer than 5 characters.");
            }
            await message.channel.send(`${thingToCheck} is now set as your almost raid leader prefix!`);
            await client.models.get("guild").update({arlPrefix: thingToCheck}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "rlp") {
            if (thingToCheck.indexOf(" ") > 0) {
                return message.channel.send("Your raid leader prefix cannot contain blank spaces.");
            }
            if (thingToCheck.length > 5) {
                return message.channel.send("Your raid leader prefix cannot be longer than 5 characters.");
            }
            await message.channel.send(`${thingToCheck} is now set as your raid leader prefix!`);
            await client.models.get("guild").update({rlPrefix: thingToCheck}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "loggingswitch") {
            if (thingToCheck === "on") {
                await message.channel.send(`All logging toggles are now set to \`on\`!`);
                await client.models.get("guild").update({
                    joinVC: true,
                    leaveVC: true,
                    changeVC: true,
                    nicknameSwitch: true,
                    rolesAdd: true,
                    rolesRemove: true,
                    messEdit: true,
                    messDelete: true,
                    userJoin: true,
                    userLeave: true,
                    bulkDelete: true,
                    banAdd: true,
                    banRemove: true,
                    channelCreate: true,
                    channelDelete: true,
                    roleCreate: true,
                    roleDelete: true
    
                }, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`All logging toggles are now set to \`off\`!`);
                await client.models.get("guild").update({
                    joinVC: false,
                    leaveVC: false,
                    changeVC: false,
                    nicknameSwitch: false,
                    rolesAdd: false,
                    rolesRemove: false,
                    messEdit: false,
                    messDelete: false,
                    userJoin: false,
                    userLeave: false,
                    bulkDelete: false,
                    banAdd: false,
                    banRemove: false,
                    channelCreate: false,
                    channelDelete: false,
                    roleCreate: false,
                    roleDelete: false
    
                }, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "automute") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your auto muting toggle is now set to \`on\`!`);
                await client.models.get("guild").update({autoMuteSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your auto muting toggle is now set to \`off\`!`);
                await client.models.get("guild").update({autoMuteSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "deafensus") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your suspend for deafening toggle is now set to \`on\`!`);
                await client.models.get("guild").update({autoDeafenSuspend: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your suspend for deafening toggle is now set to \`off\`!`);
                await client.models.get("guild").update({autoDeafenSuspend: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "afksus") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your suspend for AFK toggle is now set to \`on\`!`);
                await client.models.get("guild").update({autoAFKSuspend: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your suspend for AFK toggle is now set to \`off\`!`);
                await client.models.get("guild").update({autoAFKSuspend: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "logswitch") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logs switch toggle is now set to \`on\`!`);
                await client.models.get("guild").update({logsSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logs switch toggle is now set to \`off\`!`);
                await client.models.get("guild").update({logsSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "veriswitch") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your verification toggle is now set to \`on\`!`);
                await client.models.get("guild").update({veriSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your verification toggle is now set to \`off\`!`);
                await client.models.get("guild").update({veriSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "mailswitch") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your modmail toggle is now set to \`on\`!`);
                await client.models.get("guild").update({modmailSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your modmail toggle is now set to \`off\`!`);
                await client.models.get("guild").update({modmailSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "currentswitch") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your currentweek updater toggle is now set to \`on\`!`);
                await client.models.get("guild").update({currentweekSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your currentweek updater toggle is now set to \`off\`!`);
                await client.models.get("guild").update({currentweekSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "loop") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your loop toggle is now set to \`on\`!`);
                await client.models.get("guild").update({loopSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your loop toggle is now set to \`off\`!`);
                await client.models.get("guild").update({loopSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "eventvswitch") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your event verification switch toggle is now set to \`on\`!`);
                await client.models.get("guild").update({eventVeriSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your event verification switch toggle is now set to \`off\`!`);
                await client.models.get("guild").update({eventVeriSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "vetvswitch") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your veteran verification switch toggle is now set to \`on\`!`);
                await client.models.get("guild").update({veteranVeriSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your veteran verification switch toggle is now set to \`off\`!`);
                await client.models.get("guild").update({veteranVeriSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "userjoin") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging members joining toggle is now set to \`on\`!`);
                await client.models.get("guild").update({userJoin: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging members joining toggle is now set to \`off\`!`);
                await client.models.get("guild").update({userJoin: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "userleave") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging members leaving toggle is now set to \`on\`!`);
                await client.models.get("guild").update({userLeave: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging members leaving toggle is now set to \`off\`!`);
                await client.models.get("guild").update({userLeave: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "joinvc") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging joining VC toggle is now set to \`on\`!`);
                await client.models.get("guild").update({joinVC: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging joining VC toggle is now set to \`off\`!`);
                await client.models.get("guild").update({joinVC: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "leavevc") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging leaving VC toggle is now set to \`on\`!`);
                await client.models.get("guild").update({leaveVC: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging leaving VC toggle is now set to \`off\`!`);
                await client.models.get("guild").update({leaveVC: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "changevc") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging changing VC toggle is now set to \`on\`!`);
                await client.models.get("guild").update({changeVC: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging changing VC toggle is now set to \`off\`!`);
                await client.models.get("guild").update({changeVC: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "messdel") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging message deletes toggle is now set to \`on\`!`);
                await client.models.get("guild").update({messDelete: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging message deletes toggle is now set to \`off\`!`);
                await client.models.get("guild").update({messDelete: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "messedit") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging message edits toggle is now set to \`on\`!`);
                await client.models.get("guild").update({messEdit: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging message edits toggle is now set to \`off\`!`);
                await client.models.get("guild").update({messEdit: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "nickname") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging changing nicknames toggle is now set to \`on\`!`);
                await client.models.get("guild").update({nicknameSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging changing nicknames toggle is now set to \`off\`!`);
                await client.models.get("guild").update({nicknameSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "roleadd") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging adding roles toggle is now set to \`on\`!`);
                await client.models.get("guild").update({rolesAdd: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging adding roles toggle is now set to \`off\`!`);
                await client.models.get("guild").update({rolesAdd: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "roleremove") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging removing roles toggle is now set to \`on\`!`);
                await client.models.get("guild").update({rolesRemove: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging removing roles toggle is now set to \`off\`!`);
                await client.models.get("guild").update({rolesRemove: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "bulkdelete") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging bulk deletions toggle is now set to \`on\`!`);
                await client.models.get("guild").update({bulkDelete: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging bulk deletions toggle is now set to \`off\`!`);
                await client.models.get("guild").update({bulkDelete: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "banadd") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging banning member toggle is now set to \`on\`!`);
                await client.models.get("guild").update({banAdd: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging banning member toggle is now set to \`off\`!`);
                await client.models.get("guild").update({banAdd: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "banremove") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging removing banned member toggle is now set to \`on\`!`);
                await client.models.get("guild").update({banRemove: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging removing banned member toggle is now set to \`off\`!`);
                await client.models.get("guild").update({banRemove: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "channelcreate") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging creating channel toggle is now set to \`on\`!`);
                await client.models.get("guild").update({channelCreate: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging creating channel toggle is now set to \`off\`!`);
                await client.models.get("guild").update({channelCreate: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "channeldelete") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging deleting channel toggle is now set to \`on\`!`);
                await client.models.get("guild").update({channelDelete: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging deleting channel toggle is now set to \`off\`!`);
                await client.models.get("guild").update({channelDelete: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "rolecreate") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging creating role toggle is now set to \`on\`!`);
                await client.models.get("guild").update({roleCreate: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging creating role toggle is now set to \`off\`!`);
                await client.models.get("guild").update({roleCreate: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "roledelete") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your logging deleting role toggle is now set to \`on\`!`);
                await client.models.get("guild").update({roleDelete: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your logging deleting role toggle is now set to \`off\`!`);
                await client.models.get("guild").update({roleDelete: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "namehist") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your checking name history toggle is now set to \`on\`!`);
                await client.models.get("guild").update({veriNameHistory: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your checking name history toggle is now set to \`off\`!`);
                await client.models.get("guild").update({veriNameHistory: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "guildhist") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your checking guild history toggle is now set to \`on\`!`);
                await client.models.get("guild").update({veriGuildHistory: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your checking guild history toggle is now set to \`off\`!`);
                await client.models.get("guild").update({veriGuildHistory: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "graveyard") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your checking graveyard toggle is now set to \`on\`!`);
                await client.models.get("guild").update({veriGraveyard: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your checking graveyard toggle is now set to \`off\`!`);
                await client.models.get("guild").update({veriGraveyard: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "created") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your checking date created toggle is now set to \`on\`!`);
                await client.models.get("guild").update({veriCreated: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your checking date created toggle is now set to \`off\`!`);
                await client.models.get("guild").update({veriCreated: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "lkl") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your checking last known location toggle is now set to \`on\`!`);
                await client.models.get("guild").update({veriLKL: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your checking last known location toggle is now set to \`off\`!`);
                await client.models.get("guild").update({veriLKL: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "statsswitch") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your stats toggle is now set to \`on\`!`);
                await client.models.get("guild").update({statsSwitch: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your stats toggle is now set to \`off\`!`);
                await client.models.get("guild").update({statsSwitch: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "newtype") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your new type of AFK check toggle is now set to \`on\`!`);
                await client.models.get("guild").update({newAFKCheck: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your new type of AFK check toggle is now set to \`off\`!`);
                await client.models.get("guild").update({newAFKCheck: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "arlsend") {
            if (thingToCheck === "on") {
                await message.channel.send(`Your toggle to send the module in arl chat is now set to \`on\`!`);
                await client.models.get("guild").update({sendARLChat: true}, {where: {guildID: message.guild.id}});
            } else if (thingToCheck === "off") {
                await message.channel.send(`Your toggle to send the module in arl chat is now set to \`off\`!`);
                await client.models.get("guild").update({sendARLChat: false}, {where: {guildID: message.guild.id}});
            } else {
                message.channel.send(`Please provide a valid toggle to set to: \`on\` or \`off\`.`);
            }
        } else if (typeOfSettings === "vetchars") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your minimum character count.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 15) {
                return message.channel.send(`Minimum character count must be between 0 and 15.`);
            }
            await message.channel.send(`Your minimum character count is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veteranVeriChar: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "vetstats") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your minimum character stats.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 8) {
                return message.channel.send(`Minimum character stats must be between 0 and 8.`);
            }
            await message.channel.send(`Your minimum character stats is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veteranVeriMaxed: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "vetruns") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your minimum run count.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 10000) {
                return message.channel.send(`Minimum run count must be between 0 and 10000.`);
            }
            await message.channel.send(`Your minimum run count is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veteranVeriRuns: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "alivefame") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your star requirement.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 1000000) {
                return message.channel.send(`Alive fame requirement must be between 0 and 1000000.`);
            }
            await message.channel.send(`Your alive fame requirement is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veriAliveFame: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "stars") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your star requirement.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 75) {
                return message.channel.send(`Star count requirement must be between 0 and 75.`);
            }
            await message.channel.send(`Your star count requirement is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veriStarCount: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "skins") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your skin count requirement.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 492) {
                return message.channel.send(`Skin count requirement must be between 0 and 492.`);
            }
            await message.channel.send(`Your skin count requirement is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veriSkinCount: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "charcount") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your character count requirement.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 15) {
                return message.channel.send(`Character count requirement must be between 0 and 15.`);
            }
            await message.channel.send(`Your character count requirement is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veriCharCount: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "accfame") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your alive fame requirement.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 10000000) {
                return message.channel.send(`Alive fame requirement must be between 0 and 10000000.`);
            }
            await message.channel.send(`Your alive fame requirement is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veriAccountFame: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "deathcount") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your death count requirement.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 1000) {
                return message.channel.send(`Death count requirement must be between 0 and 1000.`);
            }
            await message.channel.send(`Your death count requirement is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({veriDeathCount: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "afktime") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your AFK check time.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 3000) {
                return message.channel.send(`AFK check time must be between 0 and 3000.`);
            }
            await message.channel.send(`Your AFK check time is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({afkTime: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "posttime") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your post AFK check time.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 600) {
                return message.channel.send(`Post AFK check time must be between 0 and 600.`);
            }
            await message.channel.send(`Your post AFK check time is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({postAFKTime: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "keys") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your max keys to accept.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 10) {
                return message.channel.send(`Max keys to accept must be between 0 and 10.`);
            }
            await message.channel.send(`Your max keys to accept is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({keyNumber: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "eventkeys") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your max event keys to accept.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 10) {
                return message.channel.send(`Max event keys to accept must be between 0 and 10.`);
            }
            await message.channel.send(`Your max event keys to accept is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({eventKeyNuber: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "vials") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your max vials to accept.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 10) {
                return message.channel.send(`Max vials to accept must be between 0 and 10.`);
            }
            await message.channel.send(`Your max vials to accept is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({vialNumber: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "rushers") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your max rushers to accept.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 10) {
                return message.channel.send(`Max rushers to accept must be between 0 and 10.`);
            }
            await message.channel.send(`Your max rushers to accept is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({rusherNumber: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        } else if (typeOfSettings === "users") {
            if (!/^[0-9]*$/.test(thingToCheck)) {
                return message.channel.send(`Please provide a valid number to set as your max raiders to accept.`);
            }
            if (parseInt(thingToCheck) < 0 || parseInt(thingToCheck) > 200) {
                return message.channel.send(`Max raiders to accept must be between 0 and 200.`);
            }
            await message.channel.send(`Your max raiders to accept is now set to \`${thingToCheck}\`!`);
            await client.models.get("guild").update({userMax: parseInt(thingToCheck)}, {where: {guildID: message.guild.id}});
        }
    }
}