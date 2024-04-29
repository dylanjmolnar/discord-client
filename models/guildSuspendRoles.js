module.exports = (sequelize, type) => {
    return sequelize.define("guildsuspendroles", {
        guildID : {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}