module.exports = (sequelize, type) => {
    return sequelize.define("queuechannels", {
        guildID : {
            type: type.STRING
        },
        channelID: {
            type: type.STRING
        }
    });
}