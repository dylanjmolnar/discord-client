module.exports = (sequelize, type) => {
    return sequelize.define("veteranraiding", {
        guildID : {
            type: type.STRING
        },
        channelID: {
            type: type.STRING
        }
    });
}