const winston = require('winston');
const path = require('path');

// Define log directory
const logDir = path.join(__dirname, '../logs');

// Configure winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // File transport for errors
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        }),
        // File transport for all logs
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log')
        })
    ]
});

// Initialize global log configuration
global.logConfig = {
    show_index: true,    // Show index in logs
    show_pattern: true,  // Show pattern in logs
    show_rtp: true      // Show RTP in logs
};

// Create logs directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Export the configured logger
module.exports = logger;