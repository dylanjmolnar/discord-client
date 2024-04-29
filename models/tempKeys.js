module.exports = (sequelize, type) => {
    return sequelize.define("tempkeys", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        raidingNumber: {
            type: type.STRING
        },
        time: {
            type: type.BIGINT
        }
    });
}