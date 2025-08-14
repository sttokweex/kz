const fs = require('fs');

module.exports = (app) => {
    // Define createOrFindGame
    const createOrFindGame = async () => {
        try {
            const [game, created] = await app.db.Game.findOrCreate({
                where: { g_name: 'vs20doghouse' },
                defaults: {
                    g_name: 'vs20doghouse',
                    g_title: 'The Dog House'
                    // createdAt and updatedAt are managed by Sequelize automatically
                }
            });
            console.log(created ? 'Game created' : 'Game already exists', game.toJSON());
            return game;
        } catch (error) {
            console.error('Error creating or finding game:', error);
            throw error;
        }
    };

    // Define createOrFindUser
    const createOrFindUser = async () => {
        try {
            const [user, created] = await app.db.User.findOrCreate({
                where: { login: 'test_user', email: 'test@example.com' },
                defaults: {
                    login: 'test_user',
                    email: 'test@example.com',
                    token: 'test_token_123',
                    balance: 100000,
                    realRtp: 0,
                    targetRtp: 500,
                    totalDebit: 0,
                    totalCredit: 0
                    // createdAt and updatedAt are managed by Sequelize automatically
                }
            });
            console.log(created ? 'User created' : 'User already exists', user.toJSON());
            return user;
        } catch (error) {
            console.error('Error creating or finding user:', error);
            throw error;
        }
    };

    // Return an object containing the functions
    return {
        createOrFindGame,
        createOrFindUser
    };
};