require("rootpath")();

module.exports = (app) => {
    const { Sequelize } = app.db;
    require("utils/init_app_module")(app)
        .add("models/users.js")
        .add("models/games.js")
        .add("models/histories.js")
        .add("models/players.js")
        .add("models/replays.js")
        .init();
};
