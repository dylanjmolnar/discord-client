module.exports = (sequelize, type) => {
    return sequelize.define("veteranqueue", {
        guildID : {
            type: type.STRING
        },
        channelID: {
            type: type.STRING
        }
    });
}