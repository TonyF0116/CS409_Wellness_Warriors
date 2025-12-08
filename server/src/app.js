const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userContext = require("./middleware/userContext");
const errorHandler = require("./middleware/errorHandler");
const createHabitRouter = require("./routes/habits");
const createProgressRouter = require("./routes/progress");
const createUsersRouter = require("./routes/users");

function createApp(store) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api", userContext);
  app.use("/api/habits", createHabitRouter(store));
  app.use("/api/progress", createProgressRouter(store));
  app.use("/api/users", createUsersRouter(store));

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
