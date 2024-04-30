module.exports = (sequelize, type) => {
    return sequelize.define("feedbackblacklist", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        }
    });
}