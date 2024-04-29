module.exports = (sequelize, type) => {
    return sequelize.define("raidingprofile", {
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