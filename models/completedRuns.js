module.exports = (sequelize, type) => {
    return sequelize.define("completedruns", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        runType1: {
            type: type.INTEGER,
            defaultvalue: 0
        },
        runType2: {
            type: type.INTEGER,
            defaultvalue: 0
        },
        runType3: {
            type: type.INTEGER,
            defaultvalue: 0
        }
    });
}