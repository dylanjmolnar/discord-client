module.exports = (sequelize, type) => {
    return sequelize.define("typeprofile", {
        guildID: {
            type: type.STRING
        },
        type: {
            type: type.STRING
        }
    });
}