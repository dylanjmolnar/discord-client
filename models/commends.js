module.exports = (sequelize, type) => {
    return sequelize.define("commends", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        modID: {
            type: type.STRING
        }
    });
}