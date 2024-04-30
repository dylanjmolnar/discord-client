module.exports = (sequelize, type) => {
    return sequelize.define("solocults", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        numberOfRuns: {
            type: type.INTEGER,
            defaultValue: 0
        },
    });
}