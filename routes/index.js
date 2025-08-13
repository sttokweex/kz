require('rootpath')();

module.exports = app => {
    // require('routes/admin')(app);
    require('routes/gameAPI')(app);

    app.get('/', (req, res) => res.redirect('/game_start.do?gameSymbol=vs40pirate&mgckey=testtoken123'));

};