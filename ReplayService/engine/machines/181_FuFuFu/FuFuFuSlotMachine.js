var Util = require("../../../../utils/slot_utils")

function SlotMachine() {
    //                 
    this.spinIndex = 0;
    this.currentGame = "BASE";
    this.gameSort = "BASE";
    this.lineCount = 1;
    //                                 
    this.view = [];
    this.virtualReels = {};
    this.winMoney = 0;
    this.winLines = [];

    this.patternCount = 2000;  //                  
    this.lowLimit = 10;   //                         
    this.prevBalance = 0; //                       (                         )

    this.betPerLine = 0;
    this.totalBet = 0;
    this.jackpotType = ["BONUS"];
};

var slotWidth = 3, slotHeight = 3;
var baseReels = [
    [5, 6, 3, 6, 3, 6, 4, 6, 4, 6, 4, 6, 5, 6],
    [3, 6, 5, 6, 3, 6, 4, 6, 5, 6, 5, 6, 3, 6, 3, 6, 3, 6],
    [4, 6, 4, 6, 3, 6, 4, 6, 5, 6, 5, 6, 5, 6],
];
var payTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 100, 50, 25, 0, 5]
];
var payLines = [
    [3, 4, 5],
];

SlotMachine.prototype.Init = function () {
    this.highPercent = 3; //(0-5)                       (                                .), 
    this.normalPercent = 30; //                                 ,                                               ,                                     .
}

SlotMachine.prototype.SpinFromPattern = function (player) {
    this.gameSort = this.currentGame;

    this.totalBet = Number(player.totalBet);
    this.betPerLine = player.betPerLine;

    this.winMoney = 0;
    this.winLines = [];

    var viewCache = player.viewCache;

    this.view = viewCache.view;

    this.winMoney = WinFromView(this.view, player.betPerLine); //                             
    this.winLines = WinLinesFromView(this.view, player.betPerLine); //                                    

    this.virtualReels = {
        above: RandomLineFromReels(baseReels),
        below: RandomLineFromReels(baseReels)
    };
};

SlotMachine.prototype.SpinForBaseGen = function (bpl, totalBet, baseWin) {
    var tmpView, tmpWin;

    if (baseWin > 0) {
        tmpView = RandomWinView(baseReels, bpl, baseWin);
    } else {
        tmpView = RandomZeroView(baseReels, bpl);
    }
    tmpWin = WinFromView(tmpView, bpl);

    var pattern = {
        view: tmpView,
        win: tmpWin,
        type: "BASE",
        bpl: bpl
    };

    return pattern;
};

SlotMachine.prototype.SpinForJackpot = function (bpl, totalBet, jpWin, isCall = false, jpType) {
    var newJpType = jpType;
    if (jpType === "RANDOM") {
        newJpType = "BONUS";//this.jackpotType[Util.random(0, this.jackpotType.length)];
    }

    switch (newJpType) {
        case "BONUS":
            return this.SpinForBonusGen(bpl, totalBet, jpWin, isCall);
        default: break;
    }
}

SlotMachine.prototype.SpinForBonusGen = function (bpl, totalBet, bsWin, isCall = false) {
    var tmpView = RandomBonusViewCache(baseReels, bpl, bsWin);
    var tmpWin = WinFromView(tmpView, bpl);

    var pattern = {
        view: tmpView,
        bpl: bpl,
        win: tmpWin,
        type: "BASE",
    };

    return pattern;
};

var RandomWinView = function (reels, bpl, maxWin) {
    var tmpView, tmpWin;
    var bottomLimit = 0;
    var calcCount = 0;

    while (true) {
        tmpView = RandomView(reels);
        tmpWin = WinFromView(tmpView, bpl);
        if (tmpWin > bottomLimit && tmpWin <= maxWin) {
            break;
        }
        calcCount++;
        if (calcCount > 100) {
            return RandomZeroView(reels, bpl);
        }
    }
    return tmpView;
};

var RandomZeroView = function (reels, bpl) {
    var tmpView, tmpWin;

    while (true) {
        tmpView = RandomView(reels);
        tmpWin = WinFromView(tmpView, bpl);
        if (tmpWin == 0) {
            break;
        }
    }
    return tmpView
};

var RandomView = function (reels) {
    var view = [];

    for (var i = 0; i < slotWidth; i++) {
        var len = reels[i].length;
        var randomIndex = Util.random(0, len);
        for (var j = 0; j < slotHeight; j++) {
            var viewPos = i + j * slotWidth;
            var reelPos = (randomIndex + j) % len;
            view[viewPos] = reels[i][reelPos];
        }
    }

    return view;
};

var RandomBonusViewCache = function (reels, bpl, bsWin) {
    var minMoney = bsWin * 0.8;
    var maxMoney = bsWin;

    minMoney = Util.max(minMoney, 0);
    maxMoney = Util.max(maxMoney, 0);

    var lowerLimit = -1,
        upperLimit = 100000000000000;
    var lowerView = null,
        upperView = null;

    for (var patternIndex = 0; patternIndex < 200; patternIndex++) {

        var tmpView = RandomWinView(reels, bpl, bsWin);
        var tmpWin = WinFromView(tmpView, bpl);

        if (tmpWin >= minMoney && tmpWin <= maxMoney) {
            return tmpView;
        }

        if (tmpWin > lowerLimit && tmpWin < minMoney) {
            lowerLimit = tmpWin;
            lowerView = tmpView;
        }
        if (tmpWin > maxMoney && tmpWin < upperLimit) {
            upperLimit = tmpWin;
            upperView = tmpView;
        }
    }

    return lowerView ? lowerView : upperView;
};

var WinFromView = function (view, bpl) {
    var money = 0;

    var lineSymbols = Util.symbolsFromLine(view, payLines[0]);
    var linePay = WinFromLine(lineSymbols, bpl);
    money += linePay;

    lineSymbols = Util.symbolsFromLine(view, payLines[0]);
    if (linePay == 0) {
        money += AnyWinFromLine(lineSymbols, bpl);
    }
    return money;
};

var WinLinesFromView = function (view, bpl) {
    var winLines = [];

    var lineSymbols = Util.symbolsFromLine(view, payLines[0]);
    var money = WinFromLine(lineSymbols, bpl);
    if (money > 0) {
        winLines.push(`0~${money}~3~4~5`);
    } else {
        lineSymbols = Util.symbolsFromLine(view, payLines[0]);
        money = AnyWinFromLine(lineSymbols, bpl);

        if (money > 0) {
            winLines.push(`0~${money}~3~4~5`);
        }
    }
    return winLines;
};

var AnyWinFromLine = function (lineSymbols, bpl) {
    var i = 0;

    for (i = 0; i < lineSymbols.length; ++i) {
        if (lineSymbols[i] > 2 && lineSymbols[i] < 6) {
            continue;
        } else {
            break;
        }
    }

    if (i == lineSymbols.length) {
        return payTable[3][7] * bpl;
    }
    return 0;
};

var WinFromLine = function (lineSymbols, bpl) {
    //                     
    var matchCount = 0;

    //                    
    symbol = lineSymbols[0];

    //                                 
    for (var i = 0; i < lineSymbols.length; i++) {
        if (lineSymbols[i] != symbol) break;
        matchCount++;
    }

    return payTable[matchCount][symbol] * bpl;
};

var RandomLineFromReels = function (reels) {
    var result = [];

    for (var i = 0; i < slotWidth; i++) {
        var index = Util.random(0, reels[i].length);
        result[i] = reels[i][index];
    }

    return result;
};

module.exports = SlotMachine;