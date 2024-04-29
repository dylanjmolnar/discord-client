module.exports = (sequelize, type) => {
    return sequelize.define("pending", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        messageID: {
            type: type.STRING
        },
        userNickname: {
            type: type.STRING
        }
    });
}