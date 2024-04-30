module.exports = (sequelize, type) => {
    return sequelize.define("guild", {
        guildID : {
            type: type.STRING
        },
        prefix: {
            type: type.STRING,
            defaultValue: "-"
        },
        typeOfServer: {
            type: type.STRING,
            defaultValue: "shatters"
        },
        inviteLink: {
            type: type.STRING,
            defaultValue: null
        },
        veriEventMessage: {
            type: type.STRING,
            defaultValue: null
        },
        veriVeteranMessage: {
            type: type.STRING,
            defaultValue: null
        },
        loggingSecondary: {
            type: type.STRING,
            defaultValue: null
        },
        eventRaiderRole: {
            type: type.STRING,
            defaultValue: null
        },
        veteranVeriCharMelee: {
            type: type.STRING,
            defaultValue: null
        },
        veteranVeriChar: {
            type: type.INTEGER,
            defaultValue: 0
        },
        veteranVeriMaxed: {
            type: type.INTEGER,
            defaultValue: 0
        },
        veteranVeriRuns: {
            type: type.INTEGER,
            defaultValue: 0
        },
        vialLogChannel: {
            type: type.STRING,
            defaultValue: null
        },
        nitroBooster: {
            type: type.STRING,
            defaultValue: null
        },
        veriFAQChannel: {
            type: type.STRING,
            defaultValue: null
        },
        FAQChannel: {
            type: type.STRING,
            defaultValue: null
        },
        rulesChannel: {
            type: type.STRING,
            defaultValue: null
        },
        eventDungeons: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        raidingRulesChannel: {
            type: type.STRING,
            defaultValue: null
        },
        topNumber: {
            type: type.STRING,
            defaultValue: null
        },
        keyNumber1: {
            type: type.STRING,
            defaultValue: null
        },
        keyNumber2: {
            type: type.STRING,
            defaultValue: null
        },
        veriVetPendingChannel: {
            type: type.STRING,
            defaultValue: null
        },
        AFKChecks: {
            type: type.STRING,
            defaultValue: null
        },
        eventAFKChecks: {
            type: type.STRING,
            defaultValue: null
        },
        AFKChannel: {
            type: type.STRING,
            defaultValue: null
        },
        suspensionsChannel: {
            type: type.STRING,
            defaultValue: null
        },
        parsemembersChannel: {
            type: type.STRING,
            defaultValue: null
        },
        loggingChannel: {
            type: type.STRING,
            defaultValue: null
        },
        publicCommandsChannel: {
            type: type.STRING,
            defaultValue: null
        },
        eventVeriChannel: {
            type: type.STRING,
            defaultValue: null
        },
        veteranCommandsChannel: {
            type: type.STRING,
            defaultValue: null
        },
        updatesChannel: {
            type: type.STRING,
            defaultValue: null
        },
        arlChannel: {
            type: type.STRING,
            defaultValue: null
        },
        modLogsChannel: {
            type: type.STRING,
            defaultValue: null
        },
        veteranCheckChannel: {
            type: type.STRING,
            defaultValue: null
        },
        veteranVeriChannel: {
            type: type.STRING,
            defaultValue: null
        },
        currentweekChannel: {
            type: type.STRING,
            defaultValue: null
        },
        currentweekSwitch: {
            type: type.STRING,
            defaultValue: null
        },
        endWeekChannel: {
            type: type.STRING,
            defaultValue: null
        },
        veriChannel: {
            type: type.STRING,
            defaultValue: null
        },
        veriLogChannel: {
            type: type.STRING,
            defaultValue: null
        },
        veriActiveChannel: {
            type: type.STRING,
            defaultValue: null
        },
        veriAttemptsChannel: {
            type: type.STRING,
            defaultValue: null
        },
        veriRejectionChannel: {
            type: type.STRING,
            defaultValue: null
        },
        modmailChannel: {
            type: type.STRING,
            defaultValue: null
        },
        modmailSendChannel: {
            type: type.STRING,
            defaultValue: null
        },
        suspendedRole: {
            type: type.STRING,
            defaultValue: null
        },
        suspendedButVerifiedRole: {
            type: type.STRING,
            defaultValue: null
        },
        mutedRole: {
            type: type.STRING,
            defaultValue: null
        },
        tempKeyRole: {
            type: type.STRING,
            defaultValue: null
        },
        mysticRole: {
            type: type.STRING,
            defaultValue: null
        },
        priestRole: {
            type: type.STRING,
            defaultValue: null
        },
        rusherRole: {
            type: type.STRING,
            defaultValue: null
        },
        keyRole1: {
            type: type.STRING,
            defaultValue: null
        },
        topKeyNumber: {
            type: type.INTEGER,
            defaultValue: 0
        },
        keyRole2: {
            type: type.STRING,
            defaultValue: null
        },
        keysPopped2: {
            type: type.INTEGER,
            defaultValue: 25
        },
        keyRole3: {
            type: type.STRING,
            defaultValue: null
        },
        keysPopped3: {
            type: type.INTEGER,
            defaultValue: 50
        },
        rusherPrefix: {
            type: type.STRING,
            defaultValue: null
        },
        mysticPrefix: {
            type: type.STRING,
            defaultValue: null
        },
        priestPrefix: {
            type: type.STRING,
            defaultValue: null
        },
        arlPrefix: {
            type: type.STRING,
            defaultValue: null
        },
        rlPrefix: {
            type: type.STRING,
            defaultValue: null
        },
        lolRole: {
            type: type.STRING,
            defaultValue: null
        },
        arlRole: {
            type: type.STRING,
            defaultValue: null
        },
        rlRole: {
            type: type.STRING,
            defaultValue: null
        },
        raiderRole: {
            type: type.STRING,
            defaultValue: null
        },
        veteranRole: {
            type: type.STRING,
            defaultValue: null
        },
        afkTime: {
            type: type.INTEGER,
            defaultValue: 360
        },
        userMax: {
            type: type.INTEGER,
            defaultValue: 0
        },
        vialNumber: {
            type: type.INTEGER,
            defaultValue: 3
        },
        rusherNumber: {
            type: type.INTEGER,
            defaultValue: 0
        },
        newAFKCheck: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        keyNumber: {
            type: type.INTEGER,
            defaultValue: 1
        },
        eventKeyNuber: {
            type: type.INTEGER,
            defaultValue: 3
        },
        sendARLChat: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        postAFKTime: {
            type: type.INTEGER,
            defaultValue: 60
        },
        autoMuteSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        autoAFKSuspend: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        autoDeafenSuspend: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        logsSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        statsSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        veriSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        modmailSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        joinVC: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        leaveVC: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        changeVC: {
            type: type.BOOLEAN,
            defaultValue: false
        }, 
        nicknameSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        rolesAdd: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        rolesRemove: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        messEdit: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        messDelete: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        userLeave: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        userJoin: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        bulkDelete: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        banAdd: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        banRemove: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        channelCreate: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        channelDelete: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        roleCreate: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        roleDelete: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        veteranVeriSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        eventVeriSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        logsChannel: {
            type: type.STRING,
            defaultValue: null
        },
        logsSendChannel: {
            type: type.STRING,
            defaultValue: null
        },
        musicChannel: {
            type: type.STRING,
            defaultValue: null
        },
        djRole: {
            type: type.STRING,
            defaultValue: null
        },
        loopSwitch: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        veriNameHistory: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        veriGuildHistory: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        veriCreated: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        veriLKL: {
            type: type.BOOLEAN,
            defaultValue: true
        },
        veriCreatedTime: {
            type: type.BIGINT,
            defaultValue: 0
        },
        veriStarCount: {
            type: type.INTEGER,
            defaultValue: 20
        },
        veriAliveFame: {
            type: type.BIGINT,
            defaultValue: 500
        },
        veriSkinCount: {
            type: type.INTEGER,
            defaultValue: 0
        },
        veriCharCount: {
            type: type.INTEGER,
            defaultValue: 0
        },
        veriCharMaxed: {
            type: type.INTEGER,
            defaultValue: 0
        },
        veriAccountFame: {
            type: type.BIGINT,
            defaultValue: 0
        },
        veriDeathCount: {
            type: type.INTEGER,
            defaultValue: 0
        },
        sendNamesPending: {
            type: type.BOOLEAN,
            defaultValue: true
        },
        sendCharactersPending: {
            type: type.BOOLEAN,
            defaultValue: true
        },
        sendNamesLogging: {
            type: type.BOOLEAN,
            defaultValue: true
        },
        sendCharactersLogging: {
            type: type.BOOLEAN,
            defaultValue: true
        },
        clearPollMessage: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        eventLogging: {
            type: type.BOOLEAN,
            defaultValue: false
        },
    });
}