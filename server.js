require("rootpath")();
const path = require("path");
module.paths.push(path.join(__dirname, "ReplayService"));
const logger = require("./config/logger");
const express = require("express");
const cors = require("cors");
const app = express();
const { createOrFindGame } = require("./db/updator.js")(app);
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: false,
  },
});
require("dotenv").config();

// Установка CORS middleware для всех HTTP-запросов
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Логирование всех входящих запросов для диагностики

app.set("views", path.join(__dirname, "/"));
app.set("view engine", "ejs");

app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".html") || path.endsWith(".ejs")) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
      } else if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      } else if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css; charset=utf-8");
      }
    },
  })
);

app.use(
  "/ReplayService",
  express.static(path.join(__dirname, "ReplayService"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".html") || path.endsWith(".ejs")) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
      } else if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      } else if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css; charset=utf-8");
      }
    },
  })
);

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
  logging: (msg) => logger.debug(msg),
});

logger.info("⚠️ Using Redis fallback mode (in-memory)...");

const inMemoryStore = new Map();

module.exports = {
  rtpConfig: {
    BuyBonusDefaultMulti: Number(process.env.BuyBonusDefaultMulti) || 0,
    FreeMinMulti: Number(process.env.FreeMinMulti) || 0,
    JackpotNormalStart: Number(process.env.JackpotNormalStart) || 0,
    JackpotNormalEnd: Number(process.env.JackpotNormalEnd) || 0,
    JackpotLongPercent: Number(process.env.JackpotLongPercent) || 0,
    JackpotLongStart: Number(process.env.JackpotLongStart) || 0,
    JackpotLongEnd: Number(process.env.JackpotLongEnd) || 0,
    SmallBaseMaxMulti: Number(process.env.SmallBaseMaxMulti) || 0,
  },
};

app.redis_client = {
  get: (key, callback) => {
    if (typeof callback === "function") {
      const value = inMemoryStore.get(key) || null;
      callback(null, value);
    }
    return Promise.resolve(inMemoryStore.get(key) || null);
  },
  set: (key, value, ...args) => {
    inMemoryStore.set(key, value);
    const callback = args.find((arg) => typeof arg === "function");
    if (callback) callback(null, "OK");
    return Promise.resolve("OK");
  },
  del: (key, callback) => {
    const result = inMemoryStore.delete(key) ? 1 : 0;
    if (callback) callback(null, result);
    return Promise.resolve(result);
  },
  connect: () => Promise.resolve(),
  quit: () => Promise.resolve("OK"),
  sendCommand: () => Promise.resolve(null),
  _executeCommand: () => Promise.resolve(null),
  on: (event, callback) => {
    if (event === "connect") {
      setTimeout(callback, 0);
    }
    return app.redis_client;
  },
};

app.redis_fallback_initialized = true;

app.db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
};
require("models/index")(app);
require("routes/index")(app);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send(err);
});

async function start() {
  try {
    await sequelize.authenticate();
    logger.info("✅ Успешное подключение к базе данных");
    await sequelize.sync();
    await createOrFindGame();
    logger.info("✅ Модели инициализированы");
    logger.info("✅ Используется Redis fallback (in-memory)");
    const PORT = process.env.PORT || 8940;
    http.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Сервер запущен на порту ${PORT}`);
      logger.info(
        `🎮 Игровой хост: ${process.env.GAME_HOST || "http://localhost:8940"}`
      );
      logger.info(
        `📼 Хост для реплеев: ${
          process.env.REPLAY_HOST || "http://localhost:8940"
        }`
      );
      logger.info("🔌 WebSocket сервер готов к подключениям");
    });
  } catch (e) {
    logger.error("❌ Ошибка при запуске сервера:", e);
    process.exit(1);
  }
}

start();

io.on("connection", (socket) => {
  logger.info("✅ Пользователь подключился к WebSocket");
  socket.on("disconnect", () => {
    logger.info("👋 Пользователь отключился от WebSocket");
  });
});
