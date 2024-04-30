module.exports = (sequelize, type) => {
    return sequelize.define("raidingchannels", {
        guildID : {
            type: type.STRING
        },
        channelID: {
            type: type.STRING
        }
    });
}