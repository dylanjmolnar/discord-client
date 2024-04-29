module.exports = (sequelize, type) => {
    return sequelize.define("profile", {
        profileID: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        guildID: {
            type: type.STRING
        },
        raidStatus: {
            type: type.STRING
        }
    });
}