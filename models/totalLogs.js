module.exports = (sequelize, type) => {
    return sequelize.define("totallogs", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        numberOfVoid: {
            type: type.INTEGER,
            defaultvalue: 0
        },
        numberofCult: {
            type: type.INTEGER,
            defaultvalue: 0
        },
        numberOfAssists: {
            type: type.INTEGER,
            defaultvalue: 0
        },
        numberOfEvent: {
            type: type.INTEGER,
            defaultvalue: 0
        },
        numberOfEventAssists: {
            type: type.INTEGER,
            defaultvalue: 0
        }
    });
}