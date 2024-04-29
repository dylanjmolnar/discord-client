module.exports = (sequelize, type) => {
    return sequelize.define("modmailpending", {
        guildID : {
            type: type.STRING
        },
        messageID: {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        }
    });
}