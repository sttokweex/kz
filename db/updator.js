const fs = require('fs');

module.exports = async (app) => {
    if (!app || !app.db || !app.db.sequelize) {
        console.error('❌ Error: app.db.sequelize is not defined');
        return;
    }

    const logger = app.logger || console; // Fallback to console if logger is missing
    const data = fs.readFileSync('./db/updator.sql', 'utf8');
    const sqlArray = data.split(';')
        .map(query => query.trim())
        .filter(query => query && !query.includes('updator.sql'));

    let nUpdatedSQL = 0;

    for (const query of sqlArray) {
        let result;
        try {
            result = await app.db.sequelize.query(query, {
                type: app.db.sequelize.QueryTypes.RAW,
                logging: msg => logger.debug(msg),
            });
            logger.info(`[SUCCESS] Query executed: ${query.substring(0, 50)}...`);
            if (result[1] && result[1].affectedRows > 0) {
                nUpdatedSQL++;
                logger.info(`Affected rows: ${result[1].affectedRows}`);
            }
        } catch (e) {
            if (e.message.includes('Duplicate column') || e.message.includes('already exists')) {
                logger.warn(`[SKIP] Table or column already exists: ${query.substring(0, 50)}...`);
            } else {
                logger.error(`[ERROR] ${e.message}: ${query.substring(0, 50)}...`);
            }
        }
    }

    if (nUpdatedSQL > 0) {
        logger.info(`* Updating Data Completed! [${nUpdatedSQL} Changes]`);
    } else {
        logger.info(`* Updating Data Completed! [No Change]`);
    }
};