module.exports = (sequelize, type) => {
    return sequelize.define("commandschannels", {
        guildID : {
            type: type.STRING
        },
        channelID: {
            type: type.STRING
        }
    });
}