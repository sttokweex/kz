var Util = require("../../../../utils/slot_utils")

function ApiManager() { };

ApiManager.prototype.InitApi = function (player, param) {
    var result = {
        def_s: "8,7,4,9,8,6,7,4,9,8,3,7,7,6,6",
        balance: "100,000.00",
        cfgs: "1",
        reel1: "8,3,6,6,6,7,7,7,4,4,4,3,4,7,5,1,7,8,6,9,9,9,8,9,9,4,4",
        ver: "2",
        reel0: "8,8,8,7,7,7,4,6,6,6,5,7,6,1,4,3,6,8,9,8,7,9",
        index: "1",
        balance_cash: "100,000.00",
        def_sb: "9,9,9,5,6",
        def_sa: "8,8,8,7,7",
        reel3: "6,6,6,9,9,9,7,6,6,8,8,8,4,8,3,5,3,9,9,9,6,6,5,4,8,1",
        reel2: "4,9,9,9,9,8,8,8,3,6,8,9,5,4,7,8,5,6,1,7,6,8,7,8",
        reel4: "9,9,9,5,6,6,6,3,9,6,9,3,5,6,7,8,8,8,6,3,1,8,6,8,4,4",
        balance_bonus: "0.00",
        na: "s",
        scatters: "1~250,50,10,0,0~0,0,0,0,0~1,1,1,1,1",
        gmb: "0,0,0",
        rt: "d",
        gameInfo: "{props:{max_rnd_sim:\"1\",max_rnd_hr:\"41101\",max_rnd_win:\"1000\"}}",
        stime: "1644571968358",
        sa: "8,8,8,7,7",
        sb: "9,9,9,5,6",
        sc: "40.00,80.00,100.00,150.00,200.00,300.00,400.00,500.00,700.00,1000.00,1500.00,2000.00,3000.00,5000.00,8000.00,15000.00,20000.00",
        defc: "40",
        sh: "3",
        wilds: "2~0,0,0~1,1,1",
        bonuses: "0",
        fsbonus: "",
        c: "400",
        sver: "5",
        counter: "2",
        paytable: "0,0,0,0,0;0,0,0,0,0;0,0,0,0,0;5000,1000,100,0,0;1000,200,50,0,0;1000,200,50,0,0;200,50,20,0,0;200,50,20,0,0;200,40,20,0,0;200,40,20,5,0",
        l: "5",
        rtp: "96.50",
        s: "8,7,4,9,8,6,7,4,9,8,3,7,7,6,6",
    };

    //              api            
    if (player.lastPattern) {
        for (var key in player.lastPattern) {
            result[key] = player.lastPattern[key];
        }
    }

    result["balance"] = player.balance;
    result["balance_cash"] = player.balance;
    result["index"] = param.index;
    result["counter"] = ++param.counter;

    if (player.betPerLine > 0) {
        result["c"] = player.betPerLine;
        result["defc"] = player.betPerLine;
    }

    return result;
};

ApiManager.prototype.GameApi = function (player, prevGameMode, param) {
    var result = {
        tw: player.machine.winMoney,
        balance: 0,
        index: 1,
        balance_cash: 0,
        balance_bonus: 0,
        na: "s",
        stime: new Date().getTime(),
        sa: "",
        sb: "",
        sh: 3,
        sver: 5,
        c: player.betPerLine,
        counter: 1,
        l: 5,
        w: player.machine.winMoney,
        s: Util.view2String(player.machine.view)
    };

    //          ,                          
    result["sa"] = Util.view2String(player.machine.virtualReels.above);
    result["sb"] = Util.view2String(player.machine.virtualReels.below);
    //                                 
    var winLines = player.machine.winLines;
    for (var i = 0; i < winLines.length; i++) {
        result[`l${i}`] = winLines[i];
    }

    //                                           
    var nextAction = "s";
    if (player.machine.winMoney > 0) {
        nextAction = "c";
    }

    result["na"] = nextAction;
    result["balance"] = player.balance;
    result["balance_cash"] = player.balance;
    result["index"] = param.index;
    result["counter"] = ++param.counter;

    return result;
};

ApiManager.prototype.CollectApi = function (player, param) {
    var result = {
        balance: "100,000.00",
        index: "3",
        balance_cash: "100,000.00",
        balance_bonus: "0.0",
        na: "s",
        stime: "1629939208592",
        sver: "5",
        counter: "2"
    };

    result["balance"] = player.balance;
    result["balance_cash"] = player.balance;
    result["stime"] = new Date().getTime();
    result["index"] = param.index;
    result["counter"] = ++param.counter;

    return result;
};

module.exports = ApiManager;