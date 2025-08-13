require("rootpath")();
const path = require("path");
// Add ReplayService directory to module search paths
module.paths.push(path.join(__dirname, "ReplayService"));
// Initialize logger configuration
const logger = require('./config/logger');
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const redis = require("redis");

require("dotenv").config();

app.set("views", path.join(__dirname, "/")); // путь к папке с шаблонами
app.set("view engine", "ejs"); // используемый движок шаблонов

// Установка кодировки UTF-8 для всех ответов
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

// Настройка статических файлов с правильной кодировкой
app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html') || path.endsWith('.ejs')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

// Добавляем обработку статических файлов для ReplayService
app.use('/ReplayService', express.static(path.join(__dirname, 'ReplayService'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html') || path.endsWith('.ejs')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: msg => logger.debug(msg)
});

logger.info('⚠️ Using Redis fallback mode (in-memory)...');


const inMemoryStore = new Map();


app.redis_client = {
    get: (key, callback) => {
        if (typeof callback === 'function') {
            const value = inMemoryStore.get(key) || null;
            callback(null, value);
        }
        return Promise.resolve(inMemoryStore.get(key) || null);
    },
    set: (key, value, ...args) => {
        inMemoryStore.set(key, value);
        // Обработка callback, если он есть
        const callback = args.find(arg => typeof arg === 'function');
        if (callback) callback(null, 'OK');
        return Promise.resolve('OK');
    },
    del: (key, callback) => {
        const result = inMemoryStore.delete(key) ? 1 : 0;
        if (callback) callback(null, result);
        return Promise.resolve(result);
    },
    connect: () => Promise.resolve(),
    quit: () => Promise.resolve('OK'),
    sendCommand: () => Promise.resolve(null),
    _executeCommand: () => Promise.resolve(null),
    on: (event, callback) => {
        if (event === 'connect') {
            // Имитируем событие connect
            setTimeout(callback, 0);
        }
        return app.redis_client; // Для цепочки вызовов
    }
};

app.redis_fallback_initialized = true;

// Инициализация моделей
app.db = {
    sequelize: sequelize,
    Sequelize: Sequelize,
};
require("models/index")(app);

// Инициализация маршрутов
require("routes/index")(app);

// Обработка ошибок
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send(err);
});

// Функция запуска сервера после успешного подключения к БД
async function start() {
    try {
        // Подключение к базе данных
        await sequelize.authenticate();

        logger.info("✅ Успешное подключение к базе данных");

        // Если требуется синхронизация моделей:
        //  // или { alter: true } / { force: true } по необходимости
        logger.info("✅ Модели инициализированы");
    
        // Используем in-memory Redis без попыток подключения
        logger.info("✅ Используется Redis fallback (in-memory)");

        const PORT = process.env.PORT || 8940;
        http.listen(PORT, () => {
            logger.info(`🚀 Сервер запущен на порту ${PORT}`);
            logger.info(`🎮 Игровой хост: ${process.env.GAME_HOST || "http://localhost:8940"}`);
            logger.info(`📼 Хост для реплеев: ${process.env.REPLAY_HOST || "http://localhost:8940"}`);
            logger.info("🔌 WebSocket сервер готов к подключениям");
        });
    } catch (e) {
        logger.error("❌ Ошибка при запуске сервера:", e.message);
        process.exit(1);
    }
}

start();

// Обработка WebSocket соединений
io.on("connection", (socket) => {
    logger.info("✅ Пользователь подключился к WebSocket");
    socket.on("disconnect", () => {
        logger.info("👋 Пользователь отключился от WebSocket");
    });
});
