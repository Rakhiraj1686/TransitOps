const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const configuredPort = process.env.PORT || "5000";
const PORT = Number(configuredPort);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error(
    `[TransitOps API] Invalid PORT value: "${configuredPort}". PORT must be a number between 1 and 65535.`
  );
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `[TransitOps API] Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

startServer();
