module.exports = (sequelize, type) => {
    return sequelize.define("parsemembers", {
        guildID : {
            type: type.STRING
        },
        messageID: {
            type: type.STRING
        },
        raidingChannel: {
            type: type.STRING
        },
        time: {
            type: type.BIGINT
        }
    });
}