const axios = require("axios");
const logger = require("../../config/logger");
const PROMO_HOST = process.env.PROMO_HOST || 'http://localhost:8940'; // Default fallback URL

exports.Promo_Active = async (req, res) => {
    const url = `${PROMO_HOST}/resources/gs2c/promo/active`;

    try {
        const response = await axios.get(url);
        return res.json({ ...response.data });
    } catch (error) {
        logger.info(`[Promo]: Failed to fetch from ${url}`);
        logger.info(error.message);
        return res.json({});
    }
};

exports.Promo_Race_Details = async (req, res) => {
    const url = `${PROMO_HOST}/resources/gs2c/promo/race/details`;

    try {
        const response = await axios.get(url);
        return res.json({ ...response.data });
    } catch (error) {
        logger.info(`[Promo]: Failed to fetch from ${url}`);
        logger.info(error.message);
        return res.json({});
    }
};

exports.Promo_Race_Prizes = async (req, res) => {
    const url = `${PROMO_HOST}/resources/gs2c/promo/race/prizes`;

    try {
        const response = await axios.get(url);
        return res.json({ ...response.data });
    } catch (error) {
        logger.info(`[Promo]: Failed to fetch from ${url}`);
        logger.info(error.message);
        return res.json({});
    }
};

exports.Promo_Tournament_Details = async (req, res) => {
    const url = `${PROMO_HOST}/resources/gs2c/promo/tournament/details`;

    try {
        const response = await axios.get(url);
        return res.json({ ...response.data });
    } catch (error) {
        logger.info(`[Promo]: Failed to fetch from ${url}`);
        logger.info(error.message);
        return res.json({});
    }
};

exports.Promo_Race_Winners = async (req, res) => {
    const url = `${PROMO_HOST}/resources/gs2c/promo/race/winners`;

    try {
        const response = await axios.post(url);
        return res.json({ ...response.data });
    } catch (error) {
        logger.info(`[Promo]: Failed to fetch from ${url}`);
        logger.info(error.message);
        return res.json({});
    }
};

exports.Promo_Tournament_v2_leaderboard = async (req, res) => {
    const url = `${PROMO_HOST}/resources/gs2c/promo/tournament/v2/leaderboard`;

    try {
        const response = await axios.get(url);
        return res.json({ ...response.data });
    } catch (error) {
        logger.info(`[Promo]: Failed to fetch from ${url}`);
        logger.info(error.message);
        return res.json({});
    }
};

exports.Promo_Tournament_v3_leaderboard = async (req, res) => {
    const url = `${PROMO_HOST}/resources/gs2c/promo/tournament/v3/leaderboard`;

    try {

        // logger.info(`[Promo]:           ${url}`);

        const response = await axios.get(url);

        return res.json({ ...response.data });
    } catch (error) {
        logger.info(`[Promo]:              ${url}`);
        logger.info(error.message);
        return res.json({});
    }
};

exports.Frb_Available = async (req, res) => {
    const url = `${PROMO_HOST}/resources/gs2c/promo/frb/available`;

    try {

        // logger.info(`[Promo]:           ${url}`);

        const response = await axios.get(url);

        return res.json({ ...response.data });
    } catch (error) {
        logger.info(`[Promo]:              ${url}`);
        logger.info(error.message);
        return res.json({});
    }
};
