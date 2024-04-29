module.exports = (sequelize, type) => {
    return sequelize.define("queueprofile", {
        profileID: {
            type: type.INTEGER
        },
        guildID: {
            type: type.STRING
        },
        channelID: {
            type: type.STRING
        }
    });
}