const axios = require("axios");
const MD5 = require("md5.js");
module.exports = (app) => {
  const { Sequelize } = app.db;
  const User = app.db.sequelize.define("user", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
    email: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
    token: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
    balance: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
    realRtp: {
      type: Sequelize.DOUBLE(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    targetRtp: {
      type: Sequelize.DOUBLE(10, 2),
      allowNull: false,
      defaultValue: 80,
    },
    totalDebit: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
    totalCredit: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
  });

  User.prototype.setBalance = async function (debit, credit, player) {
    this.balance = this.balance - debit + credit;

    const txnID = new MD5()
      .update(
        player.agentCode +
          player.userCode +
          player.gameCode +
          Math.floor(Math.random() * 1000000) +
          Date.now()
      )
      .digest("hex");
    const reqBody = {
      userID: this.id,
      betAmount: player.virtualBet,
      winAmount: player.machine.winMoney,
      transactionID: txnID,
      agentID: player.agentCode,
      sign: true,
      gameID: player.gameCode,
      balance: this.balance,
    };
    await axios.post(
      `http://host.docker.internal:8000/slot/api/betWin.php`,
      reqBody,
      { timeout: 12000 }
    );
    if (player.callHistId <= 0) {
      this.totalDebit += debit;
      this.totalCredit += credit;
      this.realRtp = this.totalDebit
        ? ((this.totalCredit / this.totalDebit) * 100).toFixed(2)
        : 100;
    }
    await this.save();
  };

  app.db.User = User;
};
