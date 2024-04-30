module.exports = (sequelize, type) => {
    return sequelize.define("suspensions", {
        guildID: {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        nickname: {
            type: type.STRING
        },
        time: {
            type: type.BIGINT
        },
        reason: {
            type: type.STRING
        },
        messageID: {
            type: type.STRING
        }
    });
}