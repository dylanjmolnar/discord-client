module.exports = (sequelize, type) => {
    return sequelize.define("temprunss", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        time: {
            type: type.BIGINT
        },
        channelID: {
            type: type.STRING
        },
        runtype: {
            type: type.STRING
        }
    });
}