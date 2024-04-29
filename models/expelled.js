module.exports = (sequelize, type) => {
    return sequelize.define("expelled", {
        guildID : {
            type: type.STRING
        },
        inGameName: {
            type: type.STRING
        }
    });
}