module.exports = (sequelize, type) => {
    return sequelize.define("kp", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        numberOfRegular: {
            type: type.INTEGER
        },
        numberOfEvent: {
            type: type.INTEGER
        }
    });
}