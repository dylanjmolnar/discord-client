module.exports = (sequelize, type) => {
    return sequelize.define("vials", {
        guildID : {
            type: type.STRING
        },
        userID: {
            type: type.STRING
        },
        numberOfVials: {
            type: type.INTEGER,
            defaultvalue: 0
        },
        numberOfVialsUsed: {
            type: type.INTEGER,
            defaultvalue: 0
        }
    });
}