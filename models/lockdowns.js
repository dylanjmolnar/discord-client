module.exports = (sequelize, type) => {
    return sequelize.define("lockdowns", {
        guildID : {
            type: type.STRING
        },
        time: {
            type: type.BIGINT
        },
        channelID: {
            type: type.STRING
        },
        reason: {
            type: type.STRING
        }
    });
}