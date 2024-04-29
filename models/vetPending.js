module.exports = (sequelize, type) => {
    return sequelize.define("vetpending", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        messageID: {
            type: type.STRING
        }
    });
}