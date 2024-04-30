module.exports = (sequelize, type) => {
    return sequelize.define("currentweeklogs", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        type: {
            type: type.STRING
        },
        extra: {
            type: type.STRING,
            defaultValue: null
        },
        time: {
            type: type.BIGINT
        }
    });
}