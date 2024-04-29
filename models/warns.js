module.exports = (sequelize, type) => {
    return sequelize.define("warns", {
        guildID: {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        modID: {
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