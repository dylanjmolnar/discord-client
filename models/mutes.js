module.exports = (sequelize, type) => {
    return sequelize.define("mutes", {
        guildID: {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        time: {
            type: type.BIGINT
        },
        reason: {
            type: type.STRING
        }
    });
}