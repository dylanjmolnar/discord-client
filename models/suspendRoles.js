module.exports = (sequelize, type) => {
    return sequelize.define("suspendroles", {
        guildID : {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}