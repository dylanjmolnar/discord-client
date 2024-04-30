module.exports = (sequelize, type) => {
    return sequelize.define("eventraiding", {
        guildID : {
            type: type.STRING
        },
        channelID: {
            type: type.STRING
        }
    });
}