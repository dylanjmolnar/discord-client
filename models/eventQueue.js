module.exports = (sequelize, type) => {
    return sequelize.define("eventqueue", {
        guildID : {
            type: type.STRING
        },
        channelID: {
            type: type.STRING
        }
    });
}